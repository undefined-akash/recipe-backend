const cloudinary = require('cloudinary').v2
require('dotenv').config();

exports.cloudinaryConnect = async() => {
  try {
    cloudinary.config({
      cloud_name:process.env.CLOUD_NAME,
      api_key:process.env.CLOUD_API_KEY,
      api_secret:process.env.CLOUD_API_SECRET
    })
    console.log(`Cloudinary Connect to ${process.env.CLOUD_Name}`)
  } catch (error) {
    console.log(error)
  }
}