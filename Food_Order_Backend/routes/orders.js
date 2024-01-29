const express = require('express');
const connection = require('../connection');
const router = express.Router();

var auth = require('../services/authentication');

router.post('/add', auth.authenticationToken, (req, res) => {
    let orderDetail = req.body;

    var sql = "INSERT INTO orders (name,email,contactNumber, paymentMethod) VALUES(?,?,?,?)"
    connection.query(sql,[orderDetail.name, orderDetail.email, orderDetail.contactNumber,orderDetail.paymentMethod],(error,result)=>{
            if(!error){
                return res.status(200).json({message:"Order Added Successfully"});
            }else{
                return res.status(500).json(error)
            }
         })

})

router.get('/get',auth.authenticationToken, (req, res)=>{
    var sql = "SELECT * FROM orders ORDER BY id DESC";
    connection.query(sql,(error, result)=>{
        if(!error) {
            return res.status(200).json(result);
        }else{
            return res.status(500).json(error)
        }
    })
})

router.delete('/delete/:id', auth.authenticationToken, (req, res,next)=>{
    const id = req.params.id;
    var sql = "DELETE FROM orders WHERE id=?";
    connection.query(sql,[id],(error, result)=>{
        if (!error){
            if (result.affectedRows == 0){
                return res.status(404).json({message: "Order id does not found"});
            }else {
                return res.status(200).json({message: "Order deleted Successfully"});
            }
        }else {
            return res.status(500).json(error);
        }
    })
})

module.exports = router;