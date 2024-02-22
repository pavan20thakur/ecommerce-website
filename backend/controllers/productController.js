const productdb = require("../models/productModel")
const slugify = require("slugify")
const fs = require("fs")

//Create-Product
const createProductController = async(req, res) => {
    try {
        const {name, description, price, category, quantity, shipping} = req.fields;
        const {photo} = req.files

        //Validation
        switch(true){
            case !name: 
                return res.status(500).send({error: "name is required"});

            case !description: 
                return res.status(500).send({error: "description is required"})

            case !price: 
                return res.status(500).send({error: "price is required"})

            case !category: 
                return res.status(500).send({error: "category is required"})

            case !quantity: 
                return res.status(500).send({error: "quantity is required"})

            case photo && photo.size > 100000: 
                return res.status(500).send({error: "photo is required and size shoul be smaller than 10MB"})
        }

        const products = new productdb({...req.fields, slug: slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message : "Error in create product"
        })
    }
}

//Get all products
const getAllProductController = async(req, res) => {
    try {
        const product = await productdb.find({}).select("-photo").limit(12).sort({createdAt: -1})
        res.status(200).send({
            success: true,
            countTotal: product.length,
            message: "Successful",
            product
        })
    } catch (error) {
        res.status(500).send({
        success: false,
        error,
        message: "Error in get-all-products"})
    }
}
module.exports = {createProductController, getAllProductController}