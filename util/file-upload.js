const fs = require('fs');
const multer = require("multer");

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (!fs.existsSync('images')) {
            fs.mkdirSync('images', { recursive: true });
        }
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, err => {
            if(err) throw (err);
        });
    }
}

module.exports = { fileFilter, fileStorage, deleteFile };