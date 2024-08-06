const multer = require('multer');
const generateUniqueString = require('./generateUniqueString.js');
const allowedExtensions = require('./allowedExtensions.js');
const fs = require('fs');
const path = require('path');

const multerMiddle = ({
  extensions = allowedExtensions.image,
  filePath = 'general',
}) => {
  // Resolve the destination path
  const destination = path.resolve(`uploads/${filePath}`);
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Configure storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const uniqueFileName = `${generateUniqueString(6)}-${Date.now()}-${file.originalname}`;
      cb(null, uniqueFileName);
    },
  });

  // File filter to check for allowed extensions
  const fileFilter = (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    if (extensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error(`File format not allowed: ${extension}`), false);
    }
  };

  return multer({ storage, fileFilter });
};

const multerHost = ({ extensions = allowedExtensions.image }) => {
  // Configure storage for multerHost
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  // File filter to check for allowed extensions
  const fileFilter = (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    if (extensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error(`File format not allowed: ${extension}`), false);
    }
  };

  return multer({ storage, fileFilter });
};

module.exports = { multerMiddle, multerHost };
