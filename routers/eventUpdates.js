const express = require('express');
const mongoose = require('mongoose');
const router = express();
const Event = require('../models/Event.js');
const foo = require('./write');

router.get('/',(req,res) => {
    Event.find()
        .then(value => { 
            res.send({value})
        })
        .catch(err => {
            res.status(400).send({msg: "Error while fetching the Event data..."});
            foo.write(err);    
        });
});
module.exports = router;