const Ngo = require('../models/Ngo');
const User = require('../models/User');

// @desc    Get all NGOs
// @route   GET /api/ngos
// @access  Public
exports.getNgos = async (req, res, next) => {
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
    
    // Finding resource
    query = Ngo.find(JSON.parse(queryStr)).populate('user', 'name email');
    
    // Select Fields
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
    const total = await Ngo.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const ngos = await query;

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
      count: ngos.length,
      pagination,
      data: ngos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single NGO
// @route   GET /api/ngos/:id
// @access  Public
exports.getNgo = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.params.id).populate('user', 'name email');

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: `No NGO found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new NGO
// @route   POST /api/ngos
// @access  Private/NGO
exports.createNgo = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if user already has an NGO
    const existingNgo = await Ngo.findOne({ user: req.user.id });

    // If user is not an admin, they can only add one NGO
    if (existingNgo && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already registered an NGO profile`,
      });
    }

    const ngo = await Ngo.create(req.body);

    // Update user role to NGO if not already
    if (req.user.role !== 'ngo' && req.user.role !== 'admin') {
      await User.findByIdAndUpdate(req.user.id, { role: 'ngo' });
    }

    res.status(201).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update NGO
// @route   PUT /api/ngos/:id
// @access  Private/NGO Owner/Admin
exports.updateNgo = async (req, res, next) => {
  try {
    let ngo = await Ngo.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: `No NGO found with id ${req.params.id}`
      });
    }

    // Make sure user is NGO owner or admin
    if (ngo.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this NGO profile`
      });
    }

    ngo = await Ngo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete NGO
// @route   DELETE /api/ngos/:id
// @access  Private/NGO Owner/Admin
exports.deleteNgo = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: `No NGO found with id ${req.params.id}`
      });
    }

    // Make sure user is NGO owner or admin
    if (ngo.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this NGO profile`
      });
    }

    await ngo.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get NGOs within a radius
// @route   GET /api/ngos/radius/:zipcode/:distance
// @access  Private/Donor
exports.getNgosInRadius = async (req, res, next) => {
  try {
    const { zipcode, distance } = req.params;

    // In a real application, you would use the zipcode to get lat/lng from a geocoding service
    // For this example, we'll use some default coordinates
    
    // Placeholder coordinates (New York City)
    const lat = 40.7128;
    const lng = -74.0060;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const ngos = await Ngo.find({
      'primaryLocation.coordinates': {
        $geoWithin: { $centerSphere: [[lng, lat], radius] }
      }
    });

    res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add NGO requirement
// @route   POST /api/ngos/:id/requirements
// @access  Private/NGO Owner/Admin
exports.addNgoRequirement = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: `No NGO found with id ${req.params.id}`
      });
    }

    // Make sure user is NGO owner or admin
    if (ngo.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this NGO profile`
      });
    }

    // Add requirement to requirements array
    ngo.requirements.push(req.body);
    await ngo.save();

    res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload NGO documents
// @route   PUT /api/ngos/:id/documents
// @access  Private/NGO Owner/Admin
exports.uploadDocuments = async (req, res, next) => {
  try {
    // In a real application, this would involve file uploads with multer
    // For this example, we're just updating the documents array
    
    const { documentType, documentName, documentUrl } = req.body;
    
    if (!documentType || !documentName || !documentUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required document information',
      });
    }
    
    const ngo = await Ngo.findById(req.params.id);
    
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: `No NGO found with id ${req.params.id}`,
      });
    }
    
    // Make sure user is NGO owner or admin
    if (ngo.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this NGO profile`,
      });
    }
    
    // Add new document to the array
    ngo.documents.push({
      documentType,
      documentName,
      documentUrl,
      uploadDate: Date.now(),
    });
    
    await ngo.save();
    
    res.status(200).json({
      success: true,
      data: ngo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify NGO
// @route   PUT /api/ngos/:id/verify
// @access  Private/Admin
exports.verifyNgo = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.params.id);
    
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: `No NGO found with id ${req.params.id}`,
      });
    }
    
    ngo.verificationStatus = 'verified';
    await ngo.save();
    
    res.status(200).json({
      success: true,
      data: ngo,
    });
  } catch (error) {
    next(error);
  }
}; 