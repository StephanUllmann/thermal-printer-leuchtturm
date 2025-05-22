import multer from 'multer';
import CloudinaryStorage from '../services/cloudinary.js';
const allowedExtensions = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'gif'];
const storage = new CloudinaryStorage();
const fileFilter = (req, file, cb) => {
    const fileExt = file.mimetype.split('/')[1];
    if (!allowedExtensions.includes(fileExt)) {
        const err = new Error(`Wrong file type, only ${allowedExtensions.join(', ')} allowed`, {
            cause: { statusCode: 400 },
        });
        cb(err);
    }
    else {
        cb(null, true);
    }
};
const fileSize = 1_048_576 * 2; // 2mb
const upload = multer({ storage, fileFilter, limits: { fileSize } });
export default upload;
//# sourceMappingURL=upload.js.map