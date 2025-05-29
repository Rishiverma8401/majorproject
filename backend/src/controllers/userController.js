const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`,
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`,
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`,
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload verification documents
// @route   PUT /api/users/:id/documents
// @access  Private/Admin or Self
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
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`,
      });
    }
    
    // Add new document to the array
    user.verificationDocuments.push({
      documentType,
      name: documentName,
      documentUrl,
      uploadDate: Date.now(),
    });
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user
// @route   PUT /api/users/:id/verify
// @access  Private/Admin
exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`,
      });
    }
    
    user.isVerified = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}; 