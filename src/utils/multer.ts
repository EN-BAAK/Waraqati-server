import path from "path"
import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");

  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });

export default upload;
