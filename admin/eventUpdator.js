const express = require('express');
const tools = require('../routers/func.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const Admin = require('./adminModel');
const Event = require('../models/Event');
const router = express();
const College = require('../models/College');
const Name = require('../models/TeamName');
const foo = require('../routers/func');

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    Admin.findOne({username})
        .then((user => {
            if(!user) {
                res.status(400).send({msg: 'User dosen\'t exists'})
            } else {
                bcrypt.compare(password,user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {id: user.id, username: user.username}
                            jwt.sign(payload,keys.secretKey,{expiresIn: 3600}, (err,token) => {
                                res.json({success: true, auth: 'zxcvbnm', token: 'Bearer ' + token})
                            });
                        } else {
                            res.status(400).send({msg: 'Password is incorrect'});
                        }
                    })
                    .catch(err => res.status(400).send({msg: 'Something went wrong try again'}));
            }
        }))
        .catch(err => {
            res.status(500).send({msg: 'Try again'})
        });
});
router.get('/update',passport.authenticate('jwt',{session: false}), (req,res) => {
    let user = req.user.username.toUpperCase();
    Event.findOne({title: user})
        .then(data => {
            res.send({value: data})
        })
        .catch(err => {
            res.status(404).send({msg: 'Your login has been Corrupted please logout and login'})
        });
});
router.post('/update',passport.authenticate('jwt' ,{session: false}), (req,res) => {
    const data = {
        title: req.body.title,
        desc: req.body.desc,
        people: req.body.people,
        round: req.body.round
    }
    Event.findOneAndUpdate({title: req.body.title}, {$set: {...data}}, {new: true}, (err,doc) => {
        if(err) {
            res.status(400).send({msg: 'Database db err'})
        } else {
            const msg = {
                title: req.body.title,
                topic: req.body.title,
                desc: req.body.desc
            } 
            foo.sendMsg(msg);
            res.send({data: `Successfully Updated!. Push has been been sent for ${msg.title} subscribers`})
        }
    })
});
router.post('/create-user',passport.authenticate('jwt',{session: false}),(req,res) => {
    const newAdmin = new Admin({
        username: req.body.username,
        password: req.body.password
    });
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newAdmin.password, salt,(err, hash) => {
            if(err) 
                res.status(400).send({msg: 'Error in hashing the password'})
            newAdmin.password = hash;
            newAdmin.save()  
            .then(user => { 
                res.send({username: req.body.username,password: req.body.password})
            })
            .catch((err) => {
                res.status(400).send({msg: 'Error in  creating new user'});
            });
        });
    });
});
router.get('/college',passport.authenticate('jwt' ,{session: false}),(req,res) => {
    College.find()
        .then(data => {
            res.send({value: data})
        })
        .catch(err => {
            res.status(404).send({msg: 'Something went wrong while extracting value'})
        })
});
router.post('/delete',passport.authenticate('jwt' ,{session: false}), (req,res) => {
    const type = req.body.type;
    Event.findOneAndDelete({title: type})
        .then(() => {
            res.json({success: 'Removed Successfully'})
        })
        .catch(err => res.status(400).send({msg: 'Mongo err inform admin for this error'}));
});
router.post('/create', passport.authenticate('jwt', {session: false}),(req,res) => {
    const title = req.body.title;
    const desc = req.body.desc;
    const people = req.body.people;
    const round = req.body.round;
    const newEvent = new Event({
        title,
        desc,
        people,
        round
    }) 
    newEvent.save()
        .then(data =>  {
            res.send({success: 'Successfully  saved'})
        })
        .catch(err => {
            res.status(400).send({msg: 'Did\'nt save some server problem',check: err})
        })
});
router.post('/reset',passport.authenticate('jwt',{session: false}),(req,res) => {
    College.collection.drop()
    .then(() => {
        Event.collection.drop()
            .then(() => {
                let arr = ['IT_MANAGER','CODING','GAMING','TREASURE_HUNT','VLOG','MEME','MAD_AD','ICE_BREAKER','VIDEO_EDITING','WEB_DESIGNING','TECH_TALK','IT_QUIZ'];
                arr.forEach(event => {
                    let newEvent = new Event({
                        title: event,
                        people: []
                    }) 
                    newEvent.save() 
                        .then(data => {})
                        .catch(err => { 
                            res.status(500).send({msg: err})
                        })
                });
                let name = new Name({
                    title: 'name',
                    names: []
                })
                name.save()
                    .then(data => {res.send({done: 'Succesfully deleted DB'})})
                    .catch(err => res.status(500).send({msg: err}));
            })
            .catch((err) =>{
                console.log(err);
                res.status(500).send({msg: err})
            })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({msg: err})
    });
});
router.post('/add-teamName', passport.authenticate('jwt',{session: false}),(req,res) => {
    let def = {
        title: 'name',
        names: req.body.arr
    }
    Name.findOneAndUpdate({title: 'name'},{$set: def},{new: true}, (err,doc) => {
        if(err) { 
           res.status(400).send({msg: 'Error out of teamName in DB'})
        } else {
            res.send({value: 'Added the value to the DB'});   
        }
    }) 
});
router.get('/add-teamName', passport.authenticate('jwt',{session: false}),(req,res) => {
    Name.findOne({title: 'name'})
        .then((data) => res.send({value: data}))
        .catch(err => res.status(400).send({msg: err}));
});

module.exports = router;