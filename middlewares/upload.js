const path = require('path');
const multer = require('multer');
const uploadDir = path.join(process.cwd(), 'tmp');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const {originalname} = file;
        const filename = `${uniquePrefix}_${originalname}`
        cb(null, filename);
    },
    limits: {
        fileSize: 1048576,
    },
});

const upload = multer({
    storage: storage,
});

module.exports = upload;