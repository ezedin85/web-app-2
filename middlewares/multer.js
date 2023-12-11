const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    cb(new Error("File type is not supported"), false);
    return;
  }
  cb(null, true);
}

function uploadFile(req, res, next) {
  const upload = multer({storage, fileFilter}).single('image');

  upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({error: err.message})
      } else if (err) {
        return res.status(400).json({error: err.message})
      }
      // Everything went fine. 
      next()
  })
}

module.exports = uploadFile;
