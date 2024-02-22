const express = require("express")
const router = express.Router()
const formidable = require("express-formidable")

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const { createProductController, getAllProductController } = require("../controllers/productController")

//Create Product Route
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController)
//Get all products route
router.get("/get-all-product", getAllProductController)

module.exports = router
