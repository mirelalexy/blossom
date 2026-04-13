import multer from "multer"

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"]

    if (allowedTypes.includes(file.mimetype)) {
        cb (null, true)
    } else {
        cb(new Error("Only PNG, JPG, JPEG, GIF allowed"), false)
    }
}

const upload = multer({ storage, fileFilter })

export default upload