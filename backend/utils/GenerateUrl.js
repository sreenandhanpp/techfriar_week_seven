const adminHelper = require("../helpers/adminHelper");

exports.generateUrls = (images) => {
    return new Promise(async (resolve, reject) => {
        const urls = [];
        for (let i = 0; i < images.length; i++) {
            adminHelper.uploadProductImage(images[i]).then(resp => {
                urls.push(resp);
                if (urls.length == 4) {
                    resolve(urls);
                }
            }).catch(err => {
                reject(err);
            });
        }
    });
}