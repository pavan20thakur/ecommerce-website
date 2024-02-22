const { hashpassword, comparePassword } = require("../helpers/authHelpers");
const userModel = require("../models/userModel")
const JWT = require("jsonwebtoken")

const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address} = req.body;

        //Validation
        if(!name){
            return res.send({error: "Name is Required"})
        }
        if(!email){
            return res.send({error: "email is Required"})
        }
        if(!password){
            return res.send({error: "password is Required"})
        }
        if(!phone){
            return res.send({error: "phone is Required"})
        }
        if(!address){
            return res.send({error: "address is Required"})
        }

        //Check if the user already exists
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success: true,
                message: "Already registered please login"
            })
        }
        //Hash Password
        const hashedPassword = await hashpassword(password);

        //Create or save user
        const register = await userModel.create({name, email, phone, address, password:hashedPassword});
        res.status(200).json({
            success: true, 
            message:"User sucessfully registered",
            register})
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
};

const loginController = async(req, res) => {
    try {
        const {email, password} = req.body;
        //validations
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message:"Please Enter valid Credentials"
            })
        }
        //Check user exists
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
            success: false,
            message: "Please register first"
            })
        }
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(200).send({
            success: false,
            message: "Please enter correct password"
            })
        }

        //token
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        res.status(200).send({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }
}

const testController = (req, res) => {
    res.send("Protected Route");
}

module.exports =  {registerController, loginController, testController}