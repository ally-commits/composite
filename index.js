const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const passport = require('passport');
const os = require('os');
const app = express(); 

const eventUpdates = require('./routers/eventUpdates');
const eventUpdator =  require('./admin/eventUpdator');
const subscriber = require('./routers/subscriber');
const register = require('./routers/register');
const login = require('./routers/login');
const Event = require('./models/Event');

const Admin = require('./admin/adminModel');
const Name = require('./models/TeamName');

mongoose.connect('mongodb://localhost/composite', {useNewUrlParser: true})
    .then(() =>  console.log('Mongo Connected'))
    .catch(err => console.log(err));
 
// const newAdmin = new Admin({
//     username: 'genSalt10',
//     password: '.console.'
// });
// bcrypt.genSalt(10, (err,salt) => {
//     bcrypt.hash(newAdmin.password, salt,(err, hash) => {
//         if(err) throw err;
//         newAdmin.password = hash;
//         newAdmin.save()  
//         .then(user => console.log(user))
//         .catch((err) => console.log(err));
//     });
// });


    

app.use((req,res,next) => {
    var now = new Date().toString(); 
    now = now.replace('GMT+0530 (India Standard Time','');
    var log = `${now}|| ${req.method} || ${req.url} || ${req.ip || null}`;
    fs.appendFile('server.log' , log +  ' $', (err) => {
        if(err) {
            console.log('Unable to append to server.log');
        }
    });  
    next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/', subscriber);
app.use('/eventupdates', eventUpdates);
app.use('/admin', eventUpdator);
app.use('/register', register);
app.use('/login', login);

app.get('/server-log',(req,res) => { 
    res.sendFile(path.join(__dirname,'/server.log'));
});
app.get('/error-log',(req,res) => { 
    res.sendFile(path.join(__dirname,'/error.log'));
});
app.post('/error-log',(req,res) => { 
    fs.writeFile('error.log','no data $',(err,value) => {
        if(err)
            res.status(400).send({msg: 'Something went wrong while writing file..'})
        else 
            res.sendFile(path.join(__dirname,'/error.log'));
    })
});
app.post('/server-log',(req,res) => { 
    fs.writeFile('server.log','no data$',(err,value) => {
        if(err)
            res.status(400).send({msg: 'Something went wrong while writing file..'})
        else 
            res.sendFile(path.join(__dirname,'/server.log'));
    })
});
app.get('/home',(req,res) => { 
    let value = {};
    fs.readFile('sub.log','utf-8',(err,doc) => {
        value.sub = doc.toString().split('$').length - 2;
    }) 
    fs.readFile('error.log','utf-8',(err,doc) => {
        value.error = doc.toString().split('$');
        value.error = [...new Set(value.error)];
        value.error = value.error.length-2;
    }) 
    fs.readFile('server.log','utf-8',(err,doc) => {
        value.server = doc.toString().split('$');
        value.server = [...new Set(value.server)];
        value.server = value.server.length-2;
    }) 
    function cpuAverage() { 
        var totalIdle = 0, totalTick = 0;
        var cpus = os.cpus(); 
        for(var i = 0, len = cpus.length; i < len; i++) { 
          var cpu = cpus[i]; 
          for(type in cpu.times) {
            totalTick += cpu.times[type];
         }      
          totalIdle += cpu.times.idle;
        } 
        return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
      }
      var startMeasure = cpuAverage(); 
      setTimeout(function() { 
        var endMeasure = cpuAverage();  
        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;
        var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference); 
        value.cpu = percentageCPU;
      }, 100);
      setTimeout(() => { 
        res.send({value})
      },200)
    
}); 
 
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App started in Port:${port}`);
});


