import userModel from '../models/userModel.js' ;
import otpModel from '../models/otpModel.js' ;
import jwt from 'jsonwebtoken' ;
import bcrypt from 'bcryptjs' ;
import validator from 'validator' ;
import sendOtpMail from '../utils/sendOtpMail.js' ;

const loginUser = async(req, res) => {
    const {email, password} = req.body ;

    try{

        const user = await userModel.findOne({email}) ;

        // check User is present or not
        if(!user){
            return res.json({success: false, message: "User doesn't exist."}) ;
        }

        // check password is match
        const isMatch = await bcrypt.compare(password, user.password) ;

        if(!isMatch){
            return res.json({success: false, message: "Invalid credentials."}) ;
        }

        const token = createToken(user._id) ;
        return res.json({success: true, token}) ;

    }catch(err){
        console.log(err) ;
        return res.json({success: false, message: "Error"}) ;
    }
} ;

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,  { expiresIn: '1h' }) ;
}

const registerUser = async(req, res) => {

    const {name, email, password} = req.body ;
    try{
        // checking email in DB
        const exist = await userModel.findOne({email}) ;
        if(exist){
            return res.json({status: false, message: "User already exists."}) ;
        }

        // validator for email
        if(!validator.isEmail(email)){
            return res.json({status: false, message: "Please enter valid email."}) ;
        }

        if(password.length < 8){
            return res.json({status: false, message: "Password length should be greater tha 8."}) ;
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10) ;
        const hashedPassword = await bcrypt.hash(password, salt) ;

        const newUser = new userModel({
            name: name,
            email, email,
            password: hashedPassword
        }) ;

        const user = await newUser.save() ;
        const token = createToken(user._id) ;
        res.json({success: true, token}) ;

    }catch(err){
        console.log(err) ;
        res.json({success: false, message: "Error"}) ;
    }

} ;

// Generate OTP and send via email
const sendOtp = async(req, res) => {
    const {email} = req.body ;

    try{
        // Validate email
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter valid email."}) ;
        }

        // Check if user already exists
        const userExists = await userModel.findOne({email}) ;
        if(userExists){
            return res.json({success: false, message: "User already exists with this email."}) ;
        }

        // Delete any existing OTP for this email
        await otpModel.deleteMany({email}) ;

        // Generate random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString() ;

        // Save OTP to database
        const newOtp = new otpModel({
            email,
            otp
        }) ;

        await newOtp.save() ;

        // Send OTP via email
        await sendOtpMail(email, otp) ;

        return res.json({success: true, message: "OTP sent to your email."}) ;

    }catch(err){
        console.log(err) ;
        return res.json({success: false, message: "Error sending OTP"}) ;
    }
} ;

// Register user with OTP verification
const registerUserWithOtp = async(req, res) => {
    const {name, email, password, otp} = req.body ;

    try{
        // Validate email
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter valid email."}) ;
        }

        // Check password length
        if(password.length < 8){
            return res.json({success: false, message: "Password length should be greater than 8."}) ;
        }

        // Check if user already exists
        const exist = await userModel.findOne({email}) ;
        if(exist){
            return res.json({success: false, message: "User already exists."}) ;
        }

        // Verify OTP
        const otpRecord = await otpModel.findOne({email, otp}) ;
        if(!otpRecord){
            return res.json({success: false, message: "Invalid or expired OTP."}) ;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10) ;
        const hashedPassword = await bcrypt.hash(password, salt) ;

        // Create new user
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            isVerified: true
        }) ;

        const user = await newUser.save() ;

        // Delete OTP after successful registration
        await otpModel.deleteOne({_id: otpRecord._id}) ;

        // Create token
        const token = createToken(user._id) ;
        return res.json({success: true, token, message: "User registered successfully."}) ;

    }catch(err){
        console.log(err) ;
        return res.json({success: false, message: "Error registering user"}) ;
    }
} ;

export {loginUser, registerUser, sendOtp, registerUserWithOtp}