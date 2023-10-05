const cloudinary = require('../../utils/cloudinaryConfig');




// Function to delete images associated with a product from Cloudinary
const deleteProductImage = async (images) => {
    return new Promise(async (resolve, reject) => {
        // Iterate through the array of image IDs and delete each image
        for (img of images) {
            await cloudinary.uploader.destroy(img.id)
                .then(res => {
                    // Resolve with true if the image is deleted successfully
                    resolve(true);
                })
                .catch(err => {
                    // Reject with an error message if there's an issue with image deletion
                    reject("Something went wrong on image deletion");
                });
        }
    });
}


module.exports = deleteProductImage;