const functions = require('firebase-functions');
const admin = require("firebase-admin");

var oldHours = 0;

admin.initializeApp(functions.config().firebase);

exports.minutely_job =
  functions.pubsub.topic('minutely-tick').onPublish((event) => {
    console.log("This job is ran every minute!");


    admin.database().ref('/users').once('value').then(function (snapshot) {
      //});

      //ref.on('value', function (snapshot) {
      var users = Object.keys(snapshot.val()).map(function (key) {
        return snapshot.val()[key];
      });
      users.forEach(function (user) {
        var userId = user.uid;
        if (user.pets) {
          var pets = Object.keys(user.pets).map(function (key) {
            return user.pets[key];
          });
          pets.forEach(function (pet) {
            if (pet.meds) {
              pet.meds.forEach(function (med, i) {
                var doseT = med.doseType.toString();

                var notificationsRef = admin.database().ref(`users/${userId}/notifications`);
                //var petRef = admin.database().ref(`users/${userId}/pets`);
                console.log(pet);
                const payload = {
                  notification: {
                    title: `Medicate your pet, ${pet.name}! ${new Date().toISOString()}`,
                    body: `Give your pet, ${pet.name}, ${med.dosage} ${doseT.substring(0, doseT.length - 2)} of ${med.name}. There are ${med.remainingDoses} doses left until reorder.`,
                    icon: './src/assets/images/arc_logo.jpg'
                  }
                }

                var startDT = new Date(med.startDateTime);
                var today = new Date();

                var timeDiff = today.getTime() - startDT.getTime();

                if (timeDiff >= 0) {
                  var diffMins = Math.floor(timeDiff / (1000 * 60));
                  var diffHrs = Math.ceil(timeDiff / (1000 * 3600));
                  if ((med.durType.substring(0, med.durType.length - 2) == 'minutes' && diffMins % med.mins == 0) || (med.durType.substring(0, med.durType.length - 2) == 'hours' && diffHrs % med.hours == 0) && oldHours != diffHrs) {
                    
                    // if (med.hrs && diffHrs % med.hrs == 0) {
                    //   var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    //   if (med.days && diffDays % med.days == 0) {
                    //     var diffWeeks = Math.ceil(timeDiff / (1000 * 3600 * 24 * 7));
                    //     if (med.weeks && diffWeeks % med.weeks == 0) {
                    //       var diffMonths = Math.ceil(timeDiff / (1000 * 3600 * 24 * 31));
                    //       if (med.months && diffMonths % med.months == 0) {
                    //         var diffYears = Math.ceil(timeDiff / (1000 * 3600 * 24 * 365));
                    //         if (med.years && diffYears % med.years == 0) {

                    //if (med.remainingDoses == 0) {
                    //  payload.notification.body = `You're out of medication, time to order some more!`;
                    //}
                    admin.database()
                      .ref(`/fcmTokens/${userId}`)
                      .once('value')
                      .then(token => token.val())
                      .then(userFcmToken => {
                        return admin.messaging().sendToDevice(userFcmToken, payload);
                      })
                      .then(res => {
                        console.log("Sent Successfully", res);
                        if(med.durType == 'hours'){
                          oldHours = diffHrs;
                        }
                        if (med.remainingDoses > 0) {
                          pet.meds[i].remainingDoses -= 1;
                        }
                        //petRef.update(pet);
                        console.log("RD", med.remainingDoses);
                        notificationsRef.push(payload.notification);
                      })
                      .catch(err => {
                        console.log(err);
                      });

                    //         }
                    //       }
                    //     }
                    //   }
                    // }
                  }
                }
              });
            }
          });
        }
      });
    }, function (error) {
      console.log("Error: " + error.code);
    });
  });


exports.fcmSend = functions.database.ref('/messages/{userId}/{messageId}').onCreate(event => {
  const message = event.data.val();
  const userId = event.params.userId;
  const payload = {
    notification: {
      title: message.title,
      body: message.body,
      icon: "https://placeimg.com/250/250/people"
    }
  };
  admin.database()
    .ref(`/fcmTokens/${userId}`)
    .once('value')
    .then(token => token.val())
    .then(userFcmToken => {
      return admin.messaging().sendToDevice(userFcmToken, payload);
    })
    .then(res => {
      console.log("Sent Successfully", res);
    })
    .catch(err => {
      console.log(err);
    });
});