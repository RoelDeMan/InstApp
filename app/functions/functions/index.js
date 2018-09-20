const functions = require('firebase-functions');
let admin = require("firebase-admin");
let fbsdk = require("facebook-sdk");
const APP_ID = '106637683312394';

let request = require('request');

let FB = new fbsdk.Facebook({
    appId: APP_ID,
    secret: '4c08a065cfd47cc5abd2a1307c73485b'
});

admin.initializeApp({
    credential: admin.credential.cert({
        project_id: "fir-functionstest-ab973",
        client_email: "firebase-adminsdk-s1m0e@fir-functionstest-ab973.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCOKkIw6lyihgn3\njUoEDGi2A/aanB1Ke1Nfxj6w3o5lQmtaPBbEL3avD46k7cIU1nd5LwVeTwkIxoS+\npJSp19H3X8xppLwNlXQKrGcBO94BK8zNry+V2By1Ep8nEgLjKR9IQgspOQl1AM3g\nyIM728N9cPx6QrIMxGIFn+1tve21woyPT1M9MqgfqdHqWa2nooEDs0dyhjDlp6p8\nW6MRPmOKdosWBpSw8mdbtVCBBphnbUNceybfI2yAnUHyvpSa4Nclm3t1JFn7L1bg\nRvx5nlQjIpFHE+jCf7asCDQGfr59IbDhgrAtvZeVunEw9BJKoKe2eOzQVoe7HEMM\nLSc0qEDTAgMBAAECggEAHw5LNF1WDCjkz3+9bgH5890Mx3yYB3fGYFMxybhseeFX\nCzi6LnRB5H8tBYlsztmE8uObNB1m11Rqlizkzu93DieOw3s5m2wNE/HSdJoL5syX\nKk19QyoZJ1MgkkvkdpQ6obHPt1se3kDlOJgE1xQsceA3P0wHkjNqSFlF6CXH4l8A\ns66/GDZP2eFopuEgpTQyozARRcuj2O7S4Ty0+GUdKA7wX1CZ/FJPaxYNgya6fofa\n3EQnnccgLB4sd4zmYqmcMCdX6jFyKEzNVb/TRzgzTchMEmbvEMoYfzmQxqPiOUwW\n/XXY5NFfS792IV6stue2lPZAbnZgRPc0A2qTZqIOSQKBgQDBBe1egrl1ywQZNViq\nm8zwGdUvVqoKMitB8lkFsjNlkKjFY3XlYLtlGfFHswk1haC++aKlYlj/1YpUkrjn\nBA3TmkfEnVeb+9pgLAaNZmyuncQ6L6vd7cTHxjNUCkdBTY8RH40KlnynD/RrFz1G\nXN4Zg91sHDKj3jF0kjxa9F4yGwKBgQC8jHWMkdJTXPwCCKYA9QUyOWsk1X0waNGg\nNkLFDGSvQi1lBpl+uMoSFXcGrpp/yGRcCxnh7q6w9AYtHlZFX/bJ07zI1MDjsjEl\nCwJ7qahsfQQc6Rfjo8bdK+hrW87nGnwiCoaEIbSBYxjFwctb2Kb272u5sm+a4fFA\n0TWixXZXqQKBgCuK6sEnPC8WXRZSsm3KN7DyIuVK55DlQFzgDrT6Ph3rRCdDCJV1\n/NARyhwihzFLs7dhGQ+1393Wjh4F+zAh+fyCES6JT/ogFmMbi17afCnn7RwzJNIr\nkPh//ZQ3vVs948g5FdgNmpEVSE3gMDJvQKsA1DJPKh1NQlrJolPiTF2BAoGBAKSg\nZ0qTT/dlqswDzR3s0dqmc7y3gxUvkEi419fBGHBF8ejRuFgC9LyRbVmyPkfwKmCL\neM/iXTk39+SRJnZwccSLUbxwtvKYdXyIfmSHH/2Jsnujsi4ao9odKlQC10bFwzjd\nw9G+tCJ86fZRXUQWiMH3DjIXcIblXIZhpNk4XDnxAoGAMTydfsfn2RsHiWDAOkSh\n6zahVnkHja+PeHX/1BkSuC4pDMSkSeA8ZJvmsrjo8xt1PH2yo9WUQp9WVffGk4rc\nBcDVpg9nltwids1zApC98wpN99DqW9/8k+8sKTi6C6GeYAsV3f3FER1mFYaLZkK5\n5puLqyL2BZfTBhVf35DRwaY=\n-----END PRIVATE KEY-----\n"
    }),
    databaseURL: "https://fir-functionstest-ab973.firebaseio.com"
});


exports.deleteRequest = functions.database.ref('requests/{uid}')
    .onDelete((event) => {
        console.log("deleteRequestPassenger");
        const removedData = event.data.previous.val();
        let travellerName = removedData.name;
        let travellerId = removedData.uid;
        let driverId = removedData.driveruid;
        console.log('----');
        console.log(removedData);
        console.log(removedData.driveruid);
        console.log('----');

        if(driverId != undefined && driverId != null && driverId != 0 && driverId != 'null'){
            const payload = {
                data: {
                    type: 'requestStopping',
                    passenger: travellerName,
                    userID: travellerId,
                    driverID: driverId
                }
            };
            admin.messaging().sendToTopic("/topics/" + driverId, payload);
            console.log('requestPassenger is verwijderd');
        }else{
            console.log('er was geen driver');
        }
        return 0;
    });


exports.deleteDriver = functions.database.ref('drivers/{uid}')
    .onDelete((event) => {
        console.log("DeleteDriver");
        const removedData = event.data.previous.val();
        const passengers = removedData.passengers;
        let driverName = removedData.drivername;
        let travellerId;
        let travellerName;

        for(let key in passengers){
            let obj = passengers[key];
            travellerId = obj.passengerId;
            travellerName = obj.passengerName;
            const payload = {
                data: {
                    type: 'driverStopping',
                    passenger: travellerName,
                    passengerId: travellerId,
                    driverName: driverName
                }
            };
            admin.messaging().sendToTopic("/topics/" + travellerId, payload);
            console.log('passagier op de hoogte gebracht');
        }
        return 0;
    });

exports.matcher = functions.database.ref('requests/{uid}')
    .onWrite((event) => {
        console.log('matcher is van start gegaan');
        console.log(event);

        console.log('matcher is van start gegaan');
        const ready = event.data.child('ready').val();
        console.log(ready);

        function calculateDistance(lat1, long1, lat2, long2) {
            //https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
            let R = 6371; // Radius of the earth in km
            let dLat = (lat2 - lat1) * (Math.PI / 180);
            let dLon = (long2 - long1) * (Math.PI / 180);
            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1) * (Math.PI / 180)) * Math.cos((lat2) * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let d = R * c; // Distance in km
            return d;
        }

        if (ready === 1) {
            const lat1 = event.data.child('lat').val();
            const long1 = event.data.child('long').val();
            const destLat = event.data.child('destlat').val();
            const destLong = event.data.child('destlong').val();
            const maxRange = 10;
            const name = event.data.child('name').val();
            const ref = event.data.key;
            const passengeruid = event.data.child('uid').val();
            const address = event.data.child('address').val();
            const city = event.data.child('city').val();
            admin.database().ref('requests').child(ref)
                .once('value')
                .then(function(passenger){
                    const passengerPlace = passenger.child('destcity').val();

                    admin.database().ref('drivers').once('value').then((snapshot) => {
                        let sent = false;
                        snapshot.forEach((driver) => {
                            const driverKey = driver.key;
                            const route = driver.child('route').val();
                            let sentToUser = false;
                            route.forEach((routePart) => {
                                if (!sentToUser) {
                                    const lat2 = routePart.lat;
                                    const long2 = routePart.lng;
                                    let range = calculateDistance(lat1, long1, lat2, long2);
                                    if (maxRange > range) {
                                        sent = true;
                                        sentToUser = true;
                                        admin.database().ref('drivers').child(driverKey)
                                            .once('value')
                                            .then(function (driverInfo) {
                                                const driverPlace = driverInfo.child('driverCityName').val();
                                                let inCommon = {};
                                                if (driverPlace === passengerPlace) {
                                                    inCommon["place"] = passengerPlace;

                                                }
                                                const payload = {
                                                    data: {
                                                        type: 'request',
                                                        passenger: name,
                                                        lat: lat1.toString(),
                                                        long: long1.toString(),
                                                        destLat: destLat.toString(),
                                                        destLong: destLong.toString(),
                                                        userID: passengeruid,
                                                        ref: ref,
                                                        inCommon: '',
                                                        city: city,
                                                        address: address
                                                    }
                                                };

                                                console.log("Notif: " + JSON.stringify(payload) + " driver: " + driver.key);
                                                admin.messaging().sendToTopic("/topics/" + driverKey, payload);
                                                event.data.ref.update({ready: 2});
                                                sent = true;
                                                sentToUser = true;
                                            });
                                    }
                                }
                            });
                        });
                        if (sent === true) {
                            console.log('voor ready 2');
                        }
                        else {
                            const payload = {
                                data: {
                                    type: 'error',
                                    errorType: 'NoMatch',
                                    ref: event.data.key

                                }
                            };
                            admin.messaging().sendToTopic("/topics/" + passenger.key, payload);
                            return event.data.ref.update({ready: 1});
                        }
                    });
                });


        } else if (ready === 3) {
            const passengername = event.data.child('name').val();
            const passengerId = event.data.child('uid').val();
            const driverId = event.data.child('driveruid').val();
            const drivername = event.data.child('drivername').val();

            const key = event.data.key;
            const passengerpayload = {
                data: {
                    type: 'accepted',
                    driver: drivername,
                    driverID: driverId,
                    ref: key,
                }
            };

            admin.messaging().sendToTopic("/topics/" + passengerId, passengerpayload);
            const driverpayload = {
                data: {
                    type: 'accepted-driver',
                    passenger: passengername,
                    passengerId: passengerId,
                    ref: key,
                }
            };
            admin.messaging().sendToTopic("/topics/" + driverId, driverpayload);
            event.data.ref.update({'ready': 4});
        }else if(ready == 21){
            const passengername = event.data.child('name').val();
            const passengerId = event.data.child('uid').val();
            const driverId = event.data.child('driveruid').val();
            const drivername = event.data.child('drivername').val();

            const key = event.data.key;
            const passengerpayload = {
                data: {
                    type: 'semi-accepted',
                    driver: drivername,
                    driverID: driverId,
                    ref: key,
                }
            };

            admin.messaging().sendToTopic("/topics/" + passengerId, passengerpayload);
            const driverpayload = {
                data: {
                    type: 'semi-accepted-driver',
                    passenger: passengername,
                    passengerId: passengerId,
                    ref: key,
                }
            };
            admin.messaging().sendToTopic("/topics/" + driverId, driverpayload);
            event.data.ref.update({'ready': 22});
        }
        return 0;
    });

exports.semimatcher = functions.database.ref('drivers/{uid}')
    .onWrite((event) => {
        semimatch = event.data.child('semimatch').val();
        console.log('semi-matcher gaat af');
        if(semimatch === null) {
            const MAX_DISTANCE = 10;
            driverLat = event.data.child('lat').val();
            driverLong = event.data.child('long').val();
            driveruid = event.data.key;
            driverName = event.data.child('drivername');
            route = event.data.child('route').val();
            currentTime = parseInt(event.data.child('timestamp').val());
            HALF_HOUR = (1800 * 1000);
            endTime = currentTime - HALF_HOUR;

            function calculateDistance(lat1, long1, lat2, long2) {
                //https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
                let R = 6371; // Radius of the earth in km
                let dLat = (lat2 - lat1) * (Math.PI / 180);
                let dLon = (long2 - long1) * (Math.PI / 180);
                let a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos((lat1) * (Math.PI / 180)) * Math.cos((lat2) * (Math.PI / 180)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                let d = R * c; // Distance in km
                return d;
            }
            admin.database().ref('requests')
                .orderByChild('timestamp')
                .startAt(endTime)
                .once('value')
                .then((snapshot) => {
                    let matches = [];
                    console.log('maches lege array');
                    let isDone = false;
                    snapshot.forEach((request) => {
                        console.log('request voor Michel');
                        console.log(request);
                        console.log(request.val());
                        console.log(snapshot.val());
                        console.log('request voor Michel');
                        ready = request.child('ready').val();
                        if (ready === 1 && isDone === false) {
                            console.log("timing 1 voorbij");
                            lat = request.child('lat').val();
                            long = request.child('long').val();
                            destlat = request.child('destlat').val();
                            destlong = request.child('destlong').val();
                            timestamp = request.child('timestamp').val();
                            start = false;
                            dest = false;
                            for (routePart in route) {
                                if(route.hasOwnProperty(routePart)) {
                                    if (start && dest) {
                                        break;
                                    }
                                    routeLat = route[routePart].lat;
                                    routeLong = route[routePart].lng;
                                    if (!start) {
                                        distance = calculateDistance(routeLat, routeLong, lat, long);
                                        if (distance < MAX_DISTANCE) {
                                            start = true;
                                        }
                                    }
                                    if (!dest) {
                                        distance = calculateDistance(routeLat, routeLong, destlat, destlong);
                                        if (distance < MAX_DISTANCE) {
                                            dest = true;
                                        }
                                    }
                                }
                            }
                            if (start && dest) {
                                console.log("timing 2 voorbij");
                                name = request.child('name').val();
                                lat = request.child('lat').val();
                                long = request.child('long').val();
                                destLat = request.child('destlat').val();
                                destLong = request.child('destlong').val();
                                uid = request.child('uid').val();
                                address = request.child('address').val();
                                city = request.child('city').val();
                                destaddress = request.child('destaddress').val();
                                destcity = request.child('destcity').val();

                                const driverPayload = {
                                    data: {
                                        type: 'semi-request',
                                        ref: request.key,
                                        userID: uid,
                                        passenger: name,
                                        lat: lat.toString(),
                                        long: long.toString(),
                                        destLat: destLat.toString(),
                                        destLong: destLong.toString(),
                                        currentaddress: address,
                                        currentcity: city,
                                        address: destaddress,
                                        city: destcity,
                                        timestamp: timestamp.toString()
                                    }

                                };
                                admin.messaging().sendToTopic('/topics/' + driveruid, driverPayload);
                                isDone = true;
                            }


                        }

                    });
                    event.data.ref.update({semimatch: null});
                });
        }
        if(semimatch === 1){
            return null;
        }
        return 0;
    });

exports.domain = functions.https.onRequest((req, res) => {
    url = 'http://www.whatsmyip.org/';
    request(url,
        function (error,response, body){
            // console.log('error:', error); // Print the error if one occurred
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.
            res.status(200).send(body);
        });

});

