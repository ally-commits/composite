const express = require('express');
const router = express();
const Admin = require('../admin/adminModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');

router.post('/',(req,res) => {
    const username = req.body.username.toUpperCase();
    const password = req.body.password;
    Admin.findOne({username})
        .then((user => {
            if(!user) {
                res.status(400).send({msg: 'Username Not found'})
            } else {
                bcrypt.compare(password,user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {id: user.id, username: user.username}
                            jwt.sign(payload,keys.secretKey,{expiresIn: 36000}, (err,token) => {
                                res.send({success: true, auth: username, token: 'Bearer ' + token})
                            });
                        } else {
                            res.status(400).send({msg: 'Password is incorrect'});
                        }
                    })
                    .catch(err => { 
                        res.status(400).send({msg: 'Something went wrong try again'})
                    });
            }
        }))
        .catch(err => { 
            res.status(500).send({msg: 'Try again'})
        }); 
});

module.exports = router;