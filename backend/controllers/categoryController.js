const slugify = require("slugify");
const categorydb = require("../models/categoryModel");

const createCategoryController = async(req, res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({ messgae: "Please enter category name" })
        }
        const existingCategory = await categorydb.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                messgae: "Category already exists"
            })
        }

        const category = await new categorydb({name, slug: slugify(name)}).save();
        res.status(201).send({
            success: true,
            messgae: "Category created",
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in create-category"
        })
    }
}

const updateCategoryController = async(req, res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categorydb.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new: true})
        res.status(200).send({
            success: true,
            messgae: "Category updated",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in update-category"
        })
    }
}

const getAllCategoryController = async(req, res) => {
    try {
        const category = await categorydb.find({})
        res.status(200).send({
            success: true,
            message: "Successful",
            category
        })
    } catch (error) {
        res.status(500).send({
        success: false,
        error,
        message: "Errorin get-all-category"})
    }
}

const getCategoryController = async(req, res) => {
    try {
        const category = await categorydb.findOne({slug: req.params.slug})
        res.status(200).send({
            success: true,
            message: "Category found!",
            category
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Errorin get-category"})
    }
}

const deleteCategoryController = async (req, res) => {
    try {
        const {id} = req.params
        await categorydb.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Category deleted successfully"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Errorin delete-category"})
    }
}

module.exports = {createCategoryController, updateCategoryController, getAllCategoryController, getCategoryController, deleteCategoryController}