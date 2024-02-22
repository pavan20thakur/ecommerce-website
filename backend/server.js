const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const authRoute = require("./routes/authRoute")
const categoryRoute = require("./routes/categoryRoutes")
const productRoute = require("./routes/productRoute")

//Rest object
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"))
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/category", categoryRoute)
app.use("/api/v1/product", productRoute)

//Rest Api
app.get("/", (req, res) => {
    res.send("Hello")
})

//Database Connection and Listening to Port
const PORT = process.env.PORT;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => { console.log(`sever is running on ${PORT}`)});
    })
    .catch((error) => { console.log(error) })