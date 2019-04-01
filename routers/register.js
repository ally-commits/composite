const express = require('express');
const router = express();
const College = require('../models/College');
const Event = require('../models/Event');
const Name = require('../models/TeamName');
const foo = require('./write');

router.post('/',(req,res) => { 
    const newCollege =  new College({
        ...req.body.data,
        teamName: req.body.data.teamName
    }); 
    newCollege.save()
        .then(data => {
            let i, choice = req.body.data.addChoice;
            let tempCount = req.body.data.addChoice.length;
            let count = 0; 
            for(i=0;i<choice.length;i++) {
                let val = choice[i];
                val = val.toUpperCase(choice[i]);
                Event.find({title: val})
                    .then(data => {
                        let value = data[0];
                        let teamName = {
                            name: req.body.data.teamName
                        };
                        value.people.push(teamName);
                        Event.findOneAndUpdate({title: val},{$set: value},{new: true},(err,doc) => {
                            if(err) {
                                console.log(err);
                                res.status(400).send({msg: 'Could not send Participant for their DB'})
                            } else { 
                                count++;
                                send();
                            }
                        }); 
                    })  
                    .catch(err => {
                        foo.write(err);
                        console.log(err);
                        res.status(400).send({msg: 'Error while fetching event data'})
                    });
                }
                const send = () => {
                    if(count === tempCount) {
                        res.send({done: 'You have Registred  for the events ', teamName: req.body.data.teamName});
                    } 
                }
            })

        .catch(err => {
            foo.write(err);
            res.status(400).send({msg: 'err in saving to DB ! Try again'});
        });
});
router.post('/check',(req,res) => {
    College.findOne({clgName: req.body.name})
        .then(data => { 
            if(!data) {
                res.json({val: 'Continue'})
            } else {
                res.status(400).send({msg: 'College already Registred'})
            }
        })
        .catch(err => {
            foo.write(err);
            res.status(400).send({msg: 'Try Again'})
        })
});
router.post('/up',(req,res) => { 
    func();
    async function func(){
        College.find({clgName: req.body.data.clgName})
        .then(data => { 
            College.findOneAndUpdate({clgName: req.body.data.clgName},{$set: req.body.data},{new: true},(err,doc) => {
                if(err) {
                    res.status(404).send({msg: 'Your doc was not found'})
                }
            });
            let arr = ['it_manager','vlog','it_quiz','coding','gaming','tech_talk','meme','mad_ad','web_designing','video_editing','treasure_hunt'];
            let count = 0;
            arr.forEach(res => {
                let jest = res.toUpperCase(); 
                remove(jest);
            });
            async function remove(jest) {
                await Event.findOne({title: jest})
                    .then(value => {
                        value.people = value.people.filter(val => {
                            return val.name != req.body.data.teamName;
                        }) 
                        save(jest,value);
                    })
                    .catch(err => {
                        foo.write(err);
                        res.status(400).send({msg: 'Error while removing data from DB'})
                    });
            }       
            async function save(val,value) {
                await Event.findOneAndUpdate({title: val},{$set: value},{new: true},(err,doc) => {
                    if(err) {
                        foo.write(err);
                        res.status(400).send({msg: 'could not send participant for their DB'})
                    } else {
                        count++;
                        if(arr.length === count) {
                            res.send({val: 'data removed..'})
                        }
                    }
                }); 
            }
            })
        .catch(err => {
            foo.write(err);
            res.status(400).send({msg: 'error while fetching from DB'})
        });
    }
});
router.post('/addValue',(req,res) => {   
    let i, choice = req.body.addChoice;
    let count = 0; 
    for(i=0;i<choice.length;i++) {
        let val = choice[i];
        val = val.toUpperCase(choice[i]);
        add(val);
    }
    async function add(val) {
        await Event.find({title: val})
            .then(data => {
                let value = data[0];
                let teamName = {
                    name: req.body.teamName
                };
                value.people.push(teamName);
                Event.findOneAndUpdate({title: val},{$set: value},{new: true},(err,doc) => {
                    if(err) {
                        foo.write(err);
                        res.status(400).send({msg: 'Could not send participant for their Db'})
                    } else {
                        count++;
                        if(choice.length === count) {
                            res.send({val: 'data added..'})
                        }
                    }
                }); 
            })
            .catch(err => {
                foo.write(err);
                res.status(400).send({msg: 'Error while fetching data for event'})
            });
    }
});
router.post('/getResult',(req,res) => {
    College.findOne({teamName: req.body.teamName})
        .then(value => {
            if(value) {
                res.send({value: value})
            } else {
                res.status(400).send({msg: `${req.body.teamName} dosen't exist's If you Haven’t registerd. Register first!.. or check the teamName first`})
            }
        })
        .catch(err => res.status(400).send({msg: `${req.body.teamName} dosen't exist's If you Haven’t registerd. Register first!.. or check the teamName first`}));
});
router.get('/getTeamName',(req,res) => {
    Name.findOne({title: 'name'})
        .then(data => {
            let def = data;
            let val = def.names[0];
            value = def.names.filter(res => {
                return val !== res;
            });
            def.names = value;
            Name.findOneAndUpdate({title: 'name'},{$set: def},{new: true}, (err,doc) => {
                if(err) {
                   foo.write(err);
                   res.status(400).send({msg: 'Error!.. TeamName collection is empty'})
                }
                res.send({val});
            })
        })
        .catch(err => {
            foo.write(err);
            res.status(400).send({msg: 'Error!.. TeamName collection is empty'})
        });
});

module.exports = router;