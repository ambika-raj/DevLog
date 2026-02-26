const multer = require("multer");
const path = require("path");

// storage config - where and how to save files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // save files in uploads folder
    },
    filename: function (req, file, cb) {
        // make filename unique - timestamp + original name
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// file filter - only allow image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if(extname && mimetype) {
        cb(null, true); // accept file
    } else {
        cb(new Error("Only image files are allowed!"), false); // reject file
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

module.exports = upload;