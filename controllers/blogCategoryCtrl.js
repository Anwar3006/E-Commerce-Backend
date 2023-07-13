const BlogCategory = require('../models/blogCategoryModel')
const asyncHandler = require('express-async-handler')
const { validateID } = require('../utils/validateID')

//Create a blog category
const createCategory = asyncHandler(async (req, res) => {
    try {
        const createCategory = await BlogCategory.create(req.body)
        res.json(createCategory)
    } catch (error) {
        throw new Error(error)
    }
})

//Update a blog category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id)
    try {
        const findCategory = await BlogCategory.findByIdAndUpdate(id,
            req.body,
            { new:true }
        )
        res.json(findCategory)
    } catch (error) {
        throw new Error(error)
    }
})

//Delete a blog category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id)
    try {
        const findCategory = await BlogCategory.findByIdAndDelete(id)
        res.json(findCategory)
    } catch (error) {
        throw new Error(error)
    }
})

//Delete a blog category
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id)
    try {
        const findCategory = await BlogCategory.findById(id)
        res.json(findCategory)
    } catch (error) {
        throw new Error(error)
    }
})

//Delete a blog category
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const findCategory = await BlogCategory.find()
        res.json(findCategory)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory,
}