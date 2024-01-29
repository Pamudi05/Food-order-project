const express = require('express');
const connection = require('../connection');
const router = express.Router();
const multer = require('multer');
const path = require('path');

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticationToken, checkRole.checkRole, (req, res)=>{
    let product = req.body;
    var sql = "INSERT INTO product(name, categoryId, price, images, status) VALUES (?,?,?,?,'true')";
    connection.query(sql,[product.name,product.categoryId, product.price, product.images],(error, result)=>{
        if (!error){
            return res.status(200).json({message:"Product Added Successfully"});
        }else {
            return res.status(500).json(error);
        }
    })
})

router.get('/get',auth.authenticationToken, (req, res, next)=>{
    var sql = "SELECT p.id,p.name,p.price,p.images,p.status,c.id AS categoryId, c.name AS categoryName FROM product AS p INNER JOIN category AS c WHERE p.categoryId = c.id";
    connection.query(sql, (error, result)=>{
        if (!error){
            return res.status(200).json(result);
        }else {
            return res.status(500).json(error);
        }
    })
})

router.get('/getByCategoryId/:id',auth.authenticationToken,(req, res, next)=>{
    const id = req.params.id;
    var sql = "SELECT id, name,price FROM product WHERE categoryId =? AND status= 'true'";
    connection.query(sql, [id], (error,result)=>{
        if (!error){
            return res.status(200).json(result);
        }else{
            return res.status(500).json(error);
        }
    })
})

router.get('/getById/:id', auth.authenticationToken,(req, res, next)=>{
    const id = req.params.id;
    var sql = "SELECT id, name, price FROM product WHERE id =?";
    connection.query(sql, [id], (error,result)=>{
        if (!error){
            return res.status(200).json(result[0]);
        }else{
            return res.status(500).json(error);
        }
    })
})

router.put('/update', auth.authenticationToken, checkRole.checkRole, (req, res,next)=>{
    let product = req.body;
    var sql = "UPDATE product SET name=?, categoryId=?, price=?, images=? WHERE id=?";
    connection.query(sql, [product.name, product.categoryId, product.price, product.images, product.id], (error, result)=>{
        if (!error){
            if (result.affectedRows == 0){
                return res.status(404).json({message: "Product id does not found"});
            }else {
                return res.status(200).json({message: "Product updated Successfully"});
            }
        }else {
            return res.status(500).json(error);
        }
    })
})

router.delete('/delete/:id', auth.authenticationToken, checkRole.checkRole, (req, res,next)=>{
    const id = req.params.id;
    var sql = "DELETE FROM product WHERE id=?";
    connection.query(sql,[id],(error, result)=>{
        if (!error){
            if (result.affectedRows == 0){
                return res.status(404).json({message: "Product id does not found"});
            }else {
                return res.status(200).json({message: "Product deleted Successfully"});
            }
        }else {
            return res.status(500).json(error);
        }
    })
})

router.put('/updateStatus', auth.authenticationToken, checkRole.checkRole, (req, res,next)=>{
    let user = req.body;
    var sql = "UPDATE product SET status=? WHERE id=?";
    connection.query(sql, [user.status, user.id], (error, result)=>{
        if (!error){
            if (result.affectedRows == 0){
                return res.status(404).json({message: "Product id does not found"});
            }else {
                return res.status(200).json({message: "Product Status updated Successfully"});
            }
        }else {
            return res.status(500).json(error);
        }
    })
})

//Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
   storage: storage,
})

router.post('/upload-images', upload.single('profile'), (req, res) => {
    res.json({
        success: 1,
        profile_url: `http://localhost:8080/profile/${req.file.filename}`
    })
})

module.exports = router;