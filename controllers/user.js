const jwt = require("jsonwebtoken")
const User = require("../models/User")
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
dotenv.config()
const secret = process.env.SECRET
const salt = process.env.SALT

const createToken = (result) => {
    return jwt.sign({result}, secret)
}

exports.registerUser = async(req, res) => {
    const email = req.body.email
    const password = req.body.password
    try {
        if(!email){
            return res.status(400).json({msg: 'Pelase enter email?', success: false})
        }else if(!password){
            return res.status(400).json({msg: 'Pelase enter password?', success: false})
        }else{
            const checkUser = await User.findOne({email: email})
            if(checkUser){
                return res.status(400).json({msg: 'Email already register! Please login.'})
            }else{
                const hashedPass = await bcrypt.hash(password, parseInt(salt))
                const result = await User.create({email: email, password: hashedPass})
                if(result){
                    const token = createToken({_id: result._id, email: result.email})
                    return res.status(200).json({msg: 'Ok', token, success: true})
                }else{
                    return res.status(400).json({msg: 'Failed to register user?', success: false})
                }
            }
        }
    } catch (error) {
        console.log("error on registerUser: ", error);
        return res.status(500).json({msg: error.message, error, success: false})
    }
}

exports.singIn = async(req, res) => {
    const email = req.body.email
    const password = req.body.password
    // console.log("secret: ", secret);
    try {
        if(!email){
            return res.status(400).json({msg: 'Pelase enter email?', success: false})
        }else if(!password){
            return res.status(400).json({msg: 'Pelase enter password?', success: false})
        }else{
            const checkUser = await User.findOne({email: email})
            if(checkUser){
                const matchPass = await bcrypt.compare(password, checkUser.password)
                if(matchPass){
                    const token = createToken({_id: checkUser._id, email: checkUser.email})
                    return res.status(200).json({msg: 'Ok', token, success: true})
                }else{
                    return res.status(400).json({msg: 'Email and Password are not matched?', success: false})
                }
            }else{
                return res.status(400).json({msg: 'Email not found! Please register first.', success: false})
            }
        }

    } catch (error) {
        console.log("error on singIn: ", error);
        return res.status(500).json({msg: error.message, error, success: false})
    }
}