const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { validateID } = require('../utils/validateID')
const { cloudinaryUploadImg } = require('../utils/cloudinary')
const fs = require('fs')

// Function to create a new blog post
const createBlog = asyncHandler(async (req, res) => {
    try {
        const blogPost = await Blog.create(req.body)
        res.json(blogPost)
    } catch (error) {
        throw new Error(error)
    }
})

// Function to get a blog post
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        //increase the number of views by 1 each time user requests a blog
        const findBlog = await Blog.findByIdAndUpdate(id,
            { $inc: {numViews: 1} },
            { new:true }
        ).populate('likes').populate('dislikes')
        res.json(findBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// Function to get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const findBlogs = await Blog.find()
        res.json(findBlogs)
    } catch (error) {
        throw new Error(error)
    }
})

// Function to update blog post
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findBlog = await Blog.findByIdAndUpdate(id, req.body, { new:true })
        res.json(findBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// Function to delete a blog post
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findBlog = await Blog.findByIdAndDelete(id)
        res.json({ success: 
            `Blog with id: <${findBlog.id}> and title: <${findBlog.title}> has been succesfully deleted`
        })
    } catch (error) {
        throw new Error(error)
    }
})

//Adds a user to likes field in DB if user likes a blog
const likeBlog = asyncHandler(async (req, res) => {
    const blogId = req.body.id
    const loginUserId = req.user.id
    validateID(blogId);
    const findBlog = await Blog.findById(blogId)
    const isLiked = findBlog.isLiked
    //will return true or false if userId already in dislikes list
    const alreadyDisliked = findBlog.dislikes.find(
        (userId) => userId.toString() === loginUserId.toString()
    )
    //if userId already in disliked then remove userId and set isDisliked to false
    if (alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId,
            { $pull: { dislikes: loginUserId },
              isDisliked: false,
            },
            {
                new:true
            }
        )
        return res.json(blog)
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId,
            { $pull: { likes: loginUserId },
              isLiked: false,
            },
            {
                new:true
            }
        )
        return res.json(blog)
    } else { //if user has neither liked nor disliked the post then this will make user like the post
        const blog = await Blog.findByIdAndUpdate(blogId,
            { $push: { likes: loginUserId },
              isLiked: true,
            },
            {
                new:true
            }
        )
        return res.json(blog)
    }
})

//
const dislikeBlog = asyncHandler(async (req, res) => {
    const blogId = req.body.id
    const userLoginId = req.user.id
    validateID(blogId)
    const findBlog = await Blog.findById(blogId)

    const isDisliked = findBlog.isDisliked
    const alreadyLiked = findBlog.likes.find(
        (userId) => userId.toString() === userLoginId.toString()
    )

    //if user has already liked the post then remove the user and set isLiked to false
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { likes: userLoginId },
                isLiked: false
            },
            {
                new:true
            }
        )
        return res.json(blog)
    }

    //if isDisliked is true then user has already disliked the post then remove the user and set isDisliked to false
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $pull: { dislikes: userLoginId },
                isDisliked: false
            },
            {
                new:true
            }
        )
        return res.json(blog)
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId,
            {
                $push: { dislikes: userLoginId },
                isDisliked: true
            },
            {
                new:true
            }
        )
        return res.json(blog)
    }
})

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const uploader = (path) => cloudinaryUploadImg(path, 'images')
        const urls = []
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path)
            urls.push(newPath)
            fs.unlinkSync(path)
        }
        const findBlog = await Blog.findByIdAndUpdate(
            id,
            { images: urls.map((file) => { return file}) },
            { new:true }
        )
        res.json(findBlog)
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = {
    createBlog,
    getBlog,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImages,
}