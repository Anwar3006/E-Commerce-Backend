const Brand = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const { validateID } = require('../utils/validateID')

//Create a brand
const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    };
})

//Update a brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id)
    try {
        const findBrand = await Brand.findByIdAndUpdate(id,
            req.body,
            { new:true }
        )
        res.json(findBrand)
    } catch (error) {
        throw new Error(error)
    };
})

//Delete a brand
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id)
    try {
        const findBrand = await Brand.findByIdAndDelete(id)
        res.json(findBrand)
    } catch (error) {
        throw new Error(error)
    };
})

//Get a brand
const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateID(id)
    try {
        const findBrand = await Brand.findById(id)
        res.json(findBrand)
    } catch (error) {
        throw new Error(error)
    };
})

//Get all brands
const getAllBrands = asyncHandler(async (req, res) => {
    try {
        const findBrand = await Brand.find()
        res.json(findBrand)
    } catch (error) {
        throw new Error(error)
    };
})
module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrands
}