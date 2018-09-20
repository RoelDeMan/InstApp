import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';



class CarManager {

    _currentCar = null;

    constructor() {

    }

    getCars() {
        return new Promise(resolve => {
            let uid = firebaseApp.auth().currentUser.uid;
            firebaseApp.database().ref(FirebaseKeys.CAR_NODE).child(uid)
                .once(FirebaseKeys.VALUE.ONCE)
                .then(snapshot => {
                    let cars = [];
                    snapshot.forEach(car => {
                        cars.push({
                            ref: car.key,
                            name: car.child(FirebaseKeys.CAR.NAME).val(),
                            brand: car.child(FirebaseKeys.CAR.BRAND).val(),
                            colour: car.child(FirebaseKeys.CAR.COLOUR).val(),
                            license: car.child(FirebaseKeys.CAR.LICENSE).val()
                        });
                    });
                    return resolve(cars);
                });
        });
    }

    addCar(name, brand, colour, license) {
        return new Promise((resolve, error) => {
            let uid = firebaseApp.auth().currentUser.uid;
            let car = {};
            car[FirebaseKeys.CAR.NAME] = name;
            car[FirebaseKeys.CAR.BRAND] = brand;
            car[FirebaseKeys.CAR.COLOUR] = colour;
            car[FirebaseKeys.CAR.LICENSE] = license;

            firebaseApp.database().ref(FirebaseKeys.CAR_NODE)
                .child(uid)
                .push()
                .set(car)
                .then(() => {
                        resolve();
                    },
                    () => {
                        error();
                    });
        });
    }

    editCar(ref, name, brand, colour, license){
        return new Promise(resolve => {
            uid = firebaseApp.auth().currentUser.uid;
            updates = {};
            updates[FirebaseKeys.CAR.NAME] = name;
            updates[FirebaseKeys.CAR.BRAND] = brand;
            updates[FirebaseKeys.CAR.COLOUR] = colour;
            updates[FirebaseKeys.CAR.LICENSE] = license;
            firebaseApp.database().ref(FirebaseKeys.CAR_NODE)
                .child(uid)
                .child(ref)
                .update(updates)
                .then( () => {
                   resolve();
                });
        });
    }

    deleteCar(ref) {
        return new Promise((resolve) => {
            uid = firebaseApp.auth().currentUser.uid;
            firebaseApp.database().ref(FirebaseKeys.CAR_NODE)
                .child(uid)
                .child(ref)
                .remove(() => {
                    resolve();
                })
        });
    }


    getCurrentCar() {
        return this._currentCar;
    }

    setCurrentCar(value) {
        this._currentCar = value;
    }
}

export default new CarManager();