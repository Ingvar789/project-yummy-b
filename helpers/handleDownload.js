const {cloudinary} = require('./cloudinary.js')
const handleDownload = async file => {
    const res = cloudinary.uploader.upload(file, {
      resource_type: "auto"
    });
    return res;
  }
 module.exports = handleDownload