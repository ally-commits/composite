const express = require('express');
const router = express();
const admin = require('firebase-admin'); 

var serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) 
});
router.post('/subscribe', (req,res) => {
    const {type,token} = req.body;
    admin.messaging().subscribeToTopic(token, type)
    .then(function(response) {
        res.send({success: 'done'})
    })
    .catch(function(error) { 
        res.status(400).send({msg: 'Some err try again'})
    });
}); 

router.post('/unsubscribe',(req,res) => {
    const {type,token} = req.body; 
    admin.messaging().unsubscribeFromTopic(token, type)
        .then(function(response) {  
            res.send({success: 'done for unsubscribe'})
        })
        .catch(function(error) {  
            res.status(400).send({msg: 'some err try again'})
        });
});
module.exports = router;