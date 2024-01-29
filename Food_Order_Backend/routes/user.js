const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt =require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/signup' , (req,res)=>{
    let user = req.body;
    query = "select email, password, role, status from user where email=?"
    connection.query(query , [user.email], (error, result)=>{
        if (!error){
            if (result.length <= 0){
                query = "insert into user (name, contactNumber, email, password, status, role) values (?,?,?,?,'false','user')";
                connection.query(query,[user.name, user.contactNumber,user.email, user.password], (error, result)=>{
                    if (!error){
                        return res.status(200).json({message : "Successfully Registered"});
                    }else{
                        return res.status(500).json(error);
                    }
                })
            }else {
                return res.status(400).json({message : "Email Already Exists !"});
            }
        }
        else {
             return res.status(500).json(error);
        }
    })
})

router.post('/login', (req,res)=>{
    const user = req.body;
    query = "SELECT email,password,role,status FROM user WHERE email=? ";
    connection.query(query,[user.email], (error, result)=>{
        if (!error){
            if (result.length <=0 || result[0].password !=user.password){
                return res.status(401).json({message: "Incorrect UserName or Password"});
            }else if (result[0].status === 'false'){
                return res.status(401).json({message: "Wait for Admin Approval"});
            }else if (result[0].password === user.password){
                const response = {email:result[0].email , role: result[0].role}
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '8h'})
                res.status(200).json({token : accessToken , message: "Login Successfully !"});
            }else{
                return res.status(400).json({message:"Something went wrong...Try again later!"})
            }
        }else{
            return res.status(500).json(error);
        }
    })
})

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotPassword', (req,res)=>{
    const user = req.body;
    query = "SELECT email,password FROM user WHERE email=? ";
    connection.query(query, [user.email], (error, result)=>{
        if (!error){
            if (result.length <= 0){
                return res.status(200).json({message: "Password sent successfully to your email"});
            }else {
                var mailOptions ={
                    from: process.env.EMAIL,
                    to: result[0].email,
                    subject: 'Reset Password',
                    html: '<p><b>Your Login Details</b><br><b>Email: </b>'+result[0].email+'<br><b>Password: </b>'+result[0].password+'<br><a href="http://localhost:4200/">Login</a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info){
                    if (error){
                        console.log(error);
                    }else {
                        console.log("Email sent: " + info.response);
                    }
                });
                return res.status(200).json({message: "Password went successfully to your email"});
            }
        }else {
            return res.status(500).json(error);
        }
    })
})

//get all records of users
router.get('/get',auth.authenticationToken, checkRole.checkRole, (req, res)=>{
    var query = "SELECT id,name,email,contactNumber, status FROM user WHERE role='user'";
    connection.query(query, (error, result)=>{
        if (!error){
            return res.status(200).json(result);
        }else {
            return res.status(500).json(error);
        }
    })
})

//update status of the user
router.patch('/update',auth.authenticationToken,checkRole.checkRole, (req,res)=>{
    let user = req.body;
    var query = "UPDATE user SET status=? WHERE id=?";
    connection.query(query, [user.status, user.id], (error, result)=>{
        if (!error){
            if (result.affectedRows == 0){
                return res.status(404).json({message:"User id does not exists"});
            }else {
                return res.status(200).json({message:"User updated successfully"});
            }
        }else{
            return res.status(500).json(error);
        }
    })
})

//check the token
router.get('/checkToken',auth.authenticationToken, (req,res)=>{
    return res.status(200).json({message:"true"});
})

//change the password
router.post('/changePassword',auth.authenticationToken, (req,res)=>{
    const user = req.body;
    const email = res.locals.email;
    var query = "SELECT * FROM user WHERE email=? and password=?";
    connection.query(query, [email, user.oldPassword],(error, result)=>{
        if (!error){
            if (result.length <= 0){
                return res.status(400).json({message : "Incorrect Old Password "})
            }else if (result[0].password == user.oldPassword){
                query = "UPDATE user SET password=? WHERE email=?";
                connection.query(query, [user.newPassword, email], (error, result)=>{
                    if (!error){
                        return res.status(200).json({message: "Password updates Successfully"})
                    }else {
                        return res.status(500).json(error)
                    }
                })
            }else {
                return res.status(400).json({message: "Something went wrong! Try again later"})
            }
        }else {
            return res.status(500).json(error)
        }
    })
})




module.exports = router;