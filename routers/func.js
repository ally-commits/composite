const admin = require('firebase-admin');
const foo = require('./write');
const imgSrc = 'Successfully';

module.exports.sendMsg = function(value) {
    var message = {
      topic: value.topic,
      notification: {
        title: value.title,
        body: value.desc
      },
      webpush: {
        headers : {
          Urgency: 'high'
        }, 
        notification: {
          body: value.desc,
          badge: imgSrc,
          icon: imgSrc,
          tag: 'renotify-tag',
          renotify: true,
          sound: 'https://firebasestorage.googleapis.com/v0/b/lacker-89773.appspot.com/o/to-the-point.mp3?alt=media&token=bb0c2188-e778-4080-ac79-5bd689b62539',
          vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
          click_action: 'https://updates.compositefest.com/info',
          data: {
            click_action: 'https://updates.compositefest.com/info'
          }
        }
      },
      android: {  
        ttl: 3600 * 1000,
        notification: {
          icon: imgSrc,
          color: '#f45342',
          sound: 'https://firebasestorage.googleapis.com/v0/b/lacker-89773.appspot.com/o/to-the-point.mp3?alt=media&token=bb0c2188-e778-4080-ac79-5bd689b62539'
        },
      },
      apns: {
        payload: {
          aps: {
            badge: 42,
            sound:'default'
          },
        },
      } 
    };
    admin.messaging().send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        foo.write(error);
      });
  };