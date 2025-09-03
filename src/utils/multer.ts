import path from "path"
import multer from "multer"

const profileStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/users");

  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${Date.now()}-${file.fieldname}${ext}`);
  }
});

export const uploadProfile = multer({ storage: profileStorage });