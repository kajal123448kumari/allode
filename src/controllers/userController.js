import userModel from '../models/user'
import emailVerification from '../models/emailVerification';
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { config } from '../utils/config';
import nodemailer from 'nodemailer'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from "uuid";

const generateDynamicSecretKey = () => {
    return process.env.SECRET_KEY || uuidv4();
  };
  
let currentSecretKey = generateDynamicSecretKey();

const shopifyShop = 'suraj-kumar-app.myshopify.com';
const shopifyToken = 'shpua_f6df06be7c8c235dfb43f49c4c859a76';

const generateRandomToken = () => {
    return crypto.randomBytes(20).toString("hex");
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kajal.kumari@ens.enterprises",
        pass: "tcxvybmagrlutahm",
    },
});

const sendVerificationEmail = async (name, email, userId, token) => {
    try {
        await transporter.sendMail({
            from: "kajal.kumari@ens.enterprises",
            to: email,
            subject: "Verify Your Account",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>              
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 2;
                        margin: 0;
                        padding: 0;
                        background-color: #f8f8f8;
                    }
                    .container {
                        max-width: 600px;
                        padding: 20px;
                    }
                    h1, p {
                        margin: 0;
                        padding: 0;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                    }
                    a:hover {
                        color: #37b7f1;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h3>Hi, ${name}</h3>
  
                    <p>Welcome to savageseller.com! To get started,</p>
  
                    <p>please verify your email address by clicking the link below:</p><br/>
  
                    <p><a href="suraj-kumar-app.myshopify.com/user/verifyEmail/${userId}/${token}" style="color: #fff; background-color: #007bff; padding: 5px 16px;">Verify Now</a></p><br/>
  
                    <p>This link will expire when you used it. If you didn’t create an account with us, you can safely ignore this email.</p>
  
                    <p>Thank you for joining us!</p><br>
                    
                    <p>Best Regards,<br>- The Savage Seller Team</p>
  
                </div>
            </body>
            </html>`,
        });

        console.log("Verification email sent successfully");
    } catch (error) {
        console.error("Failed to send verification email:", error);
    }
};

function generateRandomPassword() {
    const min = 100000;
    const max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  const comparePasswords = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
export const generateToken = (email,password) => {
  console.log('Generating token', email, password);
  const token = jwt.sign(
    { user: { email: email, password: password } },
    currentSecretKey,
    { expiresIn: "1h" }
  );
  // const token = jwt.sign({ id: userId }, currentSecretKey, { expiresIn: '1h' });
  return token;
};

export const emailVerify = async (req, res) => {
  console.log("kxxncj kdjf uhf")
    try {
      const { userId, token } = req.params;
      console.log("jbyjbhu",userId,token);
      const verification = await emailVerification.findOne({userId, token });
  console.log("verification------",verification);
      if (!verification) {
        return res.status(201).json({
          success: false,
          message: "Verification record not found or invalid token",
        });
      }
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(201).json({
          success: false,
          message: "User not found",
        });
      }
  
      // user.verifyUser = true;
      user.verifyEmail = true;
      await user.save();
  
      await verification.deleteOne();
  
      res.status(200).json({
        success: true,
        message: "User verified successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to verify user.",
        error: error.message,
      });
    }
  };

export const userRegisterForShopify = async (req, res) => {
    try {
      const body = await req.body;
      console.log("Payload:", body);
  
      const modifiedName = `${body.first_name} ${body.last_name}`;
      const existingUser = await userModel.findOne({ email: body.email });
      if (existingUser) {
        return res.status(201).json({
          success: false,
          message: "Email is already registered.",
        });
      }
      let password;
      if(body.password){
        password = body.password
      }
      else{
        password = generateRandomPassword();
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = generateRandomToken();
  
      const newUser = new userModel({
        name: modifiedName,
        dob: "",
        firstname: body.first_name,
        lastname: body.last_name,
        organization: "",
        email: body.email,
        phone: body.phone,
        designation: "",
        // location: body.addresses[0]?.country,
        userHandle: "",
        password: hashedPassword,
        accountType: "user",
        verifyToken: token,
      });
  
      const response = await newUser.save();
  
      await sendVerificationEmail(newUser.name, newUser.email, newUser._id, token);
  
      const verification = new emailVerification({
        userId: newUser._id,
        token,
      });
  
      await verification.save();
  
      res.status(201).json({
        success: true,
        message: "User registered successfully!",
      });
  
  
    } catch (error) {
        console.log("err--------",error);
      res.status(500).json({
        success: false,
        message: "Failed to register user.",
        error: error.message,
      });
    }
  };

export const userLogin = async (req, res) => {
    try {
      const { email, password } = await req.body;
      const user = await userModel.findOne({ email: email });
      if (user) {
        const isPasswordValid = await comparePasswords(password, user.password);
        console.log("ispass------------",isPasswordValid);
        if (isPasswordValid) {
            console.log("nbhyg hvgy",user);
          if (user.verifyEmail) {
            console.log("user-----------",user.verifyEmail);
            const token = generateToken(email, user.password);
            res.status(201).send({
              success: true,
              emailVerify: true,
              token: token,
            });
          } else {
            res.status(400).send({
              success: false,
              emailVerify: false,
              message: "User email is not verified.",
            });
          }
        } else {
          res.status(400).send({
            success: false,
            message: "Invalid password.",
          });
        }
      } else {
        res.status(400).send({
          success: false,
          message: "User not found.",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to login.",
        error: error.message,
      });
    }
  };

export const resendEmailVerification = async(req,res)=>{
  try {
    const {email} = req.body
    const user = await userModel.findOne({email})
    console.log("user----",user);
    if (!user){
      res.status(400).json({msg:"user not found"})
    }
console.log("ndw cdh fd  j");
    const newtoken = generateRandomToken()
    console.log("newtoken-",newtoken);
    user.verifyToken = newtoken
    await user.save()
    console.log(user);
    const newVerification = new emailVerification({
      userId:user._id,
      token : newtoken
    })
    await newVerification.save()
    console.log(newVerification);
    await sendVerificationEmail(user.name,user.email,user._id,newtoken)
    res.status(200).json({msg:"Resent verification successfully"})
  } catch (error) {
    console.log("error------------".error);
    res.status(500).json({msg:"Something went wrong",err:error})
  }
}

export const updateUser = async(req,res)=> {
  try {
    const {id} = req.params
    const {name, dob,firstname,lastname,organization} = req.body
    const user = await userModel.findOne({email})
    if(!user){
      res.status(400).json({msg:"User not found"})
    }

    const data = {
      name: modifiedName,
        dob: "",
        firstname: body.first_name,
        lastname: body.last_name,
        organization: "",
        email: body.email,
        phone: body.phone,
        designation: "",
        // location: body.addresses[0]?.country,
        userHandle: "",
        password: hashedPassword,
        accountType: "user",
        verifyToken: token,
    }
  } catch (error) {
    
  }
}