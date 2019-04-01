const fs = require('fs');
module.exports.write = function(error,file = 'error.log') {
    var now,log;
    if(file === 'error.log') {    
        now = new Date().toString();
        now = now.replace('GMT+0530 (India Standard Time)','')
        log = `${now} || ${error}`;
    } else {
        log = `${token}`;
    }
    fs.appendFile(file , log +  ' $', (err) => {
        if(err) {
            console.log('Unable to append to .log');
        }
    }); 
}