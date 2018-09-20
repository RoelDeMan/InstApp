import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import Navigation from "../Cars/Navigation";


class DriverLocationHandler {

    watchID;
    destination;
    timeStamp;

    startDriverLocationUpload(car) {
        console.log('started upload');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('1');
                console.log(position);
                console.log('1');
                this.uploadLocation(position, true, car);
            },
            (error) => {
                console.log(error);
            });

        this.watchID = navigator.geolocation.watchPosition(
            (position) => {
                this.uploadLocation(position, false, null);
            },
            (error) => {
                console.log(error);
            },
            {enableHighAccuracy: true}
        );
    }

    uploadLocation(position, initial, car) {
        uid = firebaseApp.auth().currentUser.uid;
        ref = firebaseApp.database().ref(FirebaseKeys.DRIVER_NODE).child(uid);
        lat = position.coords.latitude;
        long = position.coords.longitude;
        if (initial) {
            Navigation.getNavigationData(lat, long, this.destination.lat, this.destination.long)
                .then((routeData) => {
                    console.log('1.5');
                    console.log(routeData);
                    console.log('1.5');
                    this.uploadRouteCoords(lat,long,routeData, car,ref);
                });

        } else {
            updates = {};
            updates[FirebaseKeys.DRIVER.LAT] = lat;
            updates[FirebaseKeys.DRIVER.LONG] = long;
            ref.update(updates);
        }
    }

    //bestuurder coordinaten ingevoerd
    uploadRouteCoords(lat,long,routeData, car,ref, driverCityName) {
        route = this.filterRoutesData(routeData);
        updates = {};
        updates[FirebaseKeys.DRIVER.LAT] = lat;
        updates[FirebaseKeys.DRIVER.LONG] = long;
        updates[FirebaseKeys.DRIVER.ROUTE] = route;
        updates[FirebaseKeys.DRIVER.NAME] = firebaseApp.auth().currentUser.displayName;
        updates[FirebaseKeys.DRIVER.TIMESTAMP] = new Date().getTime();
        updates[FirebaseKeys.DRIVER.CAR.BRAND] = car.brand;
        updates[FirebaseKeys.DRIVER.CAR.COLOUR] = car.colour;
        updates[FirebaseKeys.DRIVER.CAR.LICENSE] = car.license;
        updates[FirebaseKeys.DRIVER.DRIVERCITYNAME] = driverCityName;
        ref.update(updates);

    }

    deleteDriver(){
        let name = firebaseApp.auth().currentUser.displayName;
        let ref = firebaseApp.database().ref(FirebaseKeys.DRIVER); //root reference to your data
        ref.orderByChild('name').equalTo(name)
            .once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                //remove each child
                ref.child(childSnapshot.key).remove();
            });
        });
    }

    stopDriverLocationUpload() {
        navigator.geolocation.clearWatch(this.watchID);
        uid = firebaseApp.auth().currentUser.uid;
        ref = firebaseApp.database().ref(FirebaseKeys.DRIVER_NODE).child(uid);
        ref.remove();
    }

    filterRoutesData(data) {
            let steps = data.routes[0].legs[0].steps;
            let locations = [];
            locations[0] = {lat: steps[0].start_location.lat, lng: steps[0].start_location.lng};
            for (let i = 0; i < steps.length; i++) {
                locations[i + 1] = {lat: steps[i].end_location.lat, lng: steps[i].end_location.lng}
            }
            return locations;

    }

    setDestination(lat, long) {
        this.destination = {lat: lat, long: long};
    }

}

export default new DriverLocationHandler();
