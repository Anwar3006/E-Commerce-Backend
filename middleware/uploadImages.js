const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
/**
 * this code sets up a middleware for handling file uploads, allowing only image
 * files to be accepted and stored in the specified directory with unique filenames.
 * It also includes a size limit for the uploaded files.
 */
const multerStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        callback(null, file.fieldname + '-' + uniqueSuffix + '.jpeg')
    }
})

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')){
        callback(null, true)
    } else {
        callback({
            message: 'Unsupported File Format'
        }, false)
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 }  //2mb
})

const productImgResize = async (req, file, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path).resize(300, 300)
            .toFormat('jpeg').jpeg({quality: 80})
            .toFile(`public/images/products/${file.filename}`)
            fs.unlinkSync(`public/images/products/${file.filename}`)
        })
        )
    next()
}

const blogImgResize = async (req, file, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path).resize(300, 300)
            .toFormat('jpeg').jpeg({quality: 80})
            .toFile(`public/images/blogs/${file.filename}`)
            fs.unlinkSync(`public/images/blogs/${file.filename}`)
        })
        )
    next()
}

module.exports = {
    uploadPhoto,
    productImgResize,
    blogImgResize
}