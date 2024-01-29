const express = require('express');
const connection = require('../connection');
const router = express.Router();

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add',auth.authenticationToken,checkRole.checkRole, (req, res, next)=>{
    let category = req.body;
    query = "INSERT INTO category (name) values (?)";
    connection.query(query, [category.name], (error, result)=>{
        if (!error){
            return res.status(200).json({message : "Category Added Successfully "});
        }else {
            return res.status(500).json(error);
        }
    })
})

router.get('/get',auth.authenticationToken, (req, res, next)=>{
    var query = "SELECT * FROM category order by name"
    connection.query(query, (error, result)=>{
        if (!error){
            return res.status(200).json(result);
        }else {
            return res.status(500).json(error);
        }
    })
})

router.patch('/update',auth.authenticationToken, checkRole.checkRole, (req, res, next)=>{
    let product = req.body;
    var query = "UPDATE category SET name=? WHERE id=?";
    connection.query(query, [product.name, product.id],(error, result)=>{
        if (!error){
            if (result.affectedRows == 0){
                return res.status(404).json({message: "Category id does not Found..."})
            }
                return res.status(200).json({message: "Category updated Successfully!"})
        }else {
            return res.status(500).json(error);
        }
    })
})



module.exports = router;