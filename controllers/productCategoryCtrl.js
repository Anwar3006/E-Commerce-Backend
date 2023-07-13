const ProductCategory = require('../models/productCategoryModel')
const asyncHandler = require('express-async-handler')
const { validateID } = require('../utils/validateID')

//Create a category
const createCategory = asyncHandler(async (req, res) => {
    try {
        const createCategory = await ProductCategory.create(req.body)
        res.json(createCategory)
    } catch (error) {
        throw new Error(error)
    }
})

//Update a category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findCategory = await ProductCategory.findByIdAndUpdate(id,
            req.body,
            { new:true }
        );
        res.json(findCategory)
    } catch (error) {
        throw new Error(error)
    }
})

//Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findCategory = await ProductCategory.findByIdAndDelete(id)
        res.json(findCategory)
    } catch (error) {
        throw new Error(error)
    }
})

//Get a category
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateID(id)
    try {
        const findCategory = await ProductCategory.findById(id)
        res.json(findCategory)
    } catch (error) {
        throw new Error(error)
    }
})

//Get all categories
const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const findCategory = await ProductCategory.find()
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