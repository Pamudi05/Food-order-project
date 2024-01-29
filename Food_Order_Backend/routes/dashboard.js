const express = require('express');
const connection = require('../connection');
const router = express.Router();

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.get('/details',auth.authenticationToken,checkRole.checkRole, (req,res, next)=>{
    var categoryCount;
    var productCount;
    var userCount;

    var sql = "SELECT count(id) AS categoryCount FROM category";
    connection.query(sql, (error, result)=>{
        if (!error){
            categoryCount = result[0].categoryCount;
        }else {
            return res.status(500).json(error);
        }
    })

    var sql = "SELECT count(id) AS productCount FROM product";
    connection.query(sql, (error, result)=>{
        if (!error){
            productCount = result[0].productCount;
        }else {
            return res.status(500).json(error);
        }
    })

    var sql = "SELECT count(id) AS userCount FROM user";
    connection.query(sql, (error, result)=>{
        if (!error){
            userCount = result[0].userCount;
            var data = {
                category:categoryCount,
                product:productCount,
                users:userCount
            };
            return res.status(200).json(data);
        }else {
            return res.status(500).json(error);
        }
    })
})


module.exports = router;