const Resource = require('../models/Resource');
const Ngo = require('../models/Ngo');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
exports.getResources = async (req, res, next) => {
  try {
    // Build query
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resources
    query = Resource.find(JSON.parse(queryStr)).populate({
      path: 'ngo',
      select: 'organizationName primaryLocation'
    });
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Resource.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const resources = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: resources.length,
      pagination,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Private
exports.getResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate({
      path: 'ngo',
      select: 'organizationName primaryLocation contactEmail contactPhone'
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `No resource found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private/NGO
exports.createResource = async (req, res, next) => {
  try {
    // Find NGO associated with the user
    const ngo = await Ngo.findOne({ user: req.user.id });

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'No NGO profile found for this user'
      });
    }

    // Add NGO to req.body
    req.body.ngo = ngo._id;

    // Validate required fields
    const { title, description, resourceType, category } = req.body;

    if (!title || !description || !resourceType || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, resourceType, and category'
      });
    }

    const resource = await Resource.create(req.body);

    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private/NGO Owner/Admin
exports.updateResource = async (req, res, next) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `No resource found with id ${req.params.id}`
      });
    }

    // Make sure user is the NGO owner or admin
    if (req.user.role !== 'admin') {
      const ngo = await Ngo.findById(resource.ngo);
      
      if (!ngo || ngo.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this resource'
        });
      }
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private/NGO Owner/Admin
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `No resource found with id ${req.params.id}`
      });
    }

    // Make sure user is the NGO owner or admin
    if (req.user.role !== 'admin') {
      const ngo = await Ngo.findById(resource.ngo);
      
      if (!ngo || ngo.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this resource'
        });
      }
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request resource exchange
// @route   POST /api/resources/:id/exchange
// @access  Private/NGO
exports.requestExchange = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `No resource found with id ${req.params.id}`
      });
    }

    // Find requesting NGO
    const requestingNgo = await Ngo.findOne({ user: req.user.id });

    if (!requestingNgo) {
      return res.status(404).json({
        success: false,
        message: 'No NGO profile found for this user'
      });
    }

    // Check if the NGO is trying to request its own resource
    if (resource.ngo.toString() === requestingNgo._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'NGO cannot request its own resource'
      });
    }

    // Check if NGO has already requested this resource
    const alreadyRequested = resource.exchanges.some(
      exchange => exchange.requestedBy.toString() === requestingNgo._id.toString()
    );

    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested this resource'
      });
    }

    // Create exchange request
    const exchange = {
      requestedBy: requestingNgo._id,
      requestDate: Date.now(),
      status: 'pending',
      message: req.body.message || 'Resource exchange request'
    };

    // Add exchange to resource exchanges array
    resource.exchanges.push(exchange);
    await resource.save();

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to exchange request
// @route   PUT /api/resources/:id/exchange/:exchangeId
// @access  Private/NGO Owner/Admin
exports.respondToExchange = async (req, res, next) => {
  try {
    const { status, responseMessage } = req.body;

    if (!status || !['accepted', 'declined', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (accepted, declined, or completed)'
      });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `No resource found with id ${req.params.id}`
      });
    }

    // Make sure user is the NGO owner or admin
    if (req.user.role !== 'admin') {
      const ngo = await Ngo.findById(resource.ngo);
      
      if (!ngo || ngo.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this resource'
        });
      }
    }

    // Find the exchange
    const exchangeIndex = resource.exchanges.findIndex(
      exchange => exchange._id.toString() === req.params.exchangeId
    );

    if (exchangeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Exchange request not found'
      });
    }

    // Update exchange
    resource.exchanges[exchangeIndex].status = status;
    resource.exchanges[exchangeIndex].responseDate = Date.now();
    resource.exchanges[exchangeIndex].responseMessage = responseMessage || '';

    if (status === 'completed') {
      resource.exchanges[exchangeIndex].completionDate = Date.now();
      
      // If this is an offer and it's completed, mark the resource as fulfilled
      if (resource.resourceType === 'offer') {
        resource.status = 'fulfilled';
      }
    }

    await resource.save();

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate exchange
// @route   PUT /api/resources/:id/exchange/:exchangeId/rate
// @access  Private/NGO
exports.rateExchange = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5'
      });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: `No resource found with id ${req.params.id}`
      });
    }

    // Find requesting NGO
    const requestingNgo = await Ngo.findOne({ user: req.user.id });

    if (!requestingNgo) {
      return res.status(404).json({
        success: false,
        message: 'No NGO profile found for this user'
      });
    }

    // Find the exchange
    const exchangeIndex = resource.exchanges.findIndex(
      exchange => 
        exchange._id.toString() === req.params.exchangeId &&
        exchange.requestedBy.toString() === requestingNgo._id.toString()
    );

    if (exchangeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Exchange request not found or not authorized'
      });
    }

    // Make sure exchange is completed before rating
    if (resource.exchanges[exchangeIndex].status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed exchanges'
      });
    }

    // Update exchange with rating
    resource.exchanges[exchangeIndex].rating = rating;
    resource.exchanges[exchangeIndex].feedback = feedback || '';

    await resource.save();

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    next(error);
  }
}; 