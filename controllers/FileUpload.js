const User = require('../models/user')
const cloudinary = require('cloudinary').v2;

function isFileSupported (type,supportedTypes) {
  return supportedTypes.includes(type)
}

async function uploadFileToCloudinary (file,folder){
  const options = {folder}
  return await cloudinary.uploader.upload(file.tempFilePath,options);
}

exports.profileUpload = async(req, res) => {
  try {
    const { userName } = req.body;
    const file = req.files.profilePic;
    const supportedTypes = ["jpg", "png", "jpeg"];
    const fileType = file.name.split('.').pop().toLowerCase();

    console.log(fileType);
    if (!isFileSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: 'File format not supported'
      });
    }

    const response = await uploadFileToCloudinary(file, "RecipeKeeper");
    console.log(response);

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.imageUrl = response.secure_url;
    console.log(user.imageUrl);
    await user.save();

    res.status(200).json({
      success: true,
      imageUrl: response.secure_url,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
