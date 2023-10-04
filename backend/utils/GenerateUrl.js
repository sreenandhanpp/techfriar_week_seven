const adminHelper = require("../helpers/adminHelper");

exports.generateUrls = (req) => {
    return new Promise(async (resolve, reject) => {
        const files = req.files.image
        const urls = [];
        for (const file of files) {
            adminHelper.uploadProductImage(file).then(resp => {
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