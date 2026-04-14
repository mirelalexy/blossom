import cloudinary from "../config/cloudinary.js"

export function uploadToCloudinary(buffer, options) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            options,
            (error, result) => error ? reject(error) : resolve(result)
        ).end(buffer)
    })
}