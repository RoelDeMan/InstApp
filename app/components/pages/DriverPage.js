'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableHighlight, TouchableOpacity,
    Alert, Image, ScrollView, NativeModules, Switch, LayoutAnimation, ListView, Dimensions
} from 'react-native';

import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import CarManager from "../Cars/CarManager";
import HeaderBar from "../UI/HeaderBar";
import { Card } from 'react-native-material-design';
import ModalExtern from 'react-native-modal';
import renderIf from './renderif';
import Navigation from '../Cars/Navigation';
import DriverLocationHandler from "../Location/DriverLocationHandler";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import EditHeaderBar from "../UI/EditHeaderBar";
import Geocoder from 'react-native-geocoder';
const MapView = require('react-native-maps');
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationButton from "../UI/NavigationButton";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

const markerImage = require('../../../images/icoooon_v2.png');
const { UIManager } = NativeModules;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

export default class DriverPage extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            hasRouteLine: false,
            t: null,
            agreed: false,
            switchOnOff: false,
            isChildVisible: false,
            carModal: false,
            selectCarsDataSource: ds,
            firstCarName: '',
            firstCarBrand: '',
            firstCarColour: '',
            firstCarLicense: '',
            selectCar: '',
            removeHidden: false,
            facebookInfo: false,
            marginTopCard: 0,
            firstName: '',
            lastName: '',
            facebookFlexNumber: 0.1,
            arrowFacebookInfo: 'keyboard-arrow-down',
            // lat: 52.008684 ,
            // long: 5.967663,
            lat: null,
            long: null,
            inputLatitude: 0,
            inputLongitude: 0,
            currentLat: null,
            // currentLat: 51.821598,
            currentLong: null,
            // currentLong: 5.836539,
            latitudeText: 'Latitude...',
            longitudeText: 'longitude...',
            error: null,
            coords: [],
            locations: [],
            coordsBetween: [],
            addLocationModal: false,
            newLat: null,
            newLong: null,
            destinationDriverBox: false,
            driverCityName: null,
            currentDriver: null,
            locationsDataSource: ds,
            googleKaart: true,
            borderProfileRing: 'rgba(54, 0, 107, 0.3)',
            mapMainDiv: false,
            mainDivDestination: true,
            mapDiv: false,
            switchBox: false,
            destinationBox: false,
            comma: null,
            firstSwitch: true,
            strokeColor: '#8A5BB7',
            pic: '../../../images/pointer.png',
            passengerPicca: '../../../images/icoooon.png',
            pointer: null,
            point: null,
            passengerArray: [],
            initialRender: true,
            newCompleteAddress: null,
            completeDestination: null,
            completeCurrent: null,
            routeDistanceDriver: null,
            routeTimeDriver: null,
            extraDriveTime: null,
            destinationFullAdressName: null,
            destinationFullCityName: null,
            navButton: null,
            initialPosition: 'unknown',
            passengerArrayLength: null,
            extraDrivetimeBox: false,
            requestModal: false,
            paslat: null,
            paslong: null,
            pasDestLat: null,
            pasDestLong: null,
            title: null,
            message: null,
            passengerImage: null,
            passengerName: null,
            passengerId: null,
            fbNodePassenger: null,
            totalExtraDrivetime: 0,
            extraDriveTimeVisual: null,
            main: props.mainLayout
        };
        this.setDriver = this.setDriver.bind(this);
    }


    checkGPS(){
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Uw locatie staat uit</h2>Laat reizigers weten waar u bent!<br/><br/>Zonder 'locatie' kunt u geen route uitzetten.",
            ok: "Activeren",
            cancel: "Sluiten",
            enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
            showDialog: true, // false => Opens the Location access page directly
            openLocationServices: true, // false => Directly catch method is called if location services are turned off
            preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
            preventBackClick: false //true => To prevent the location services popup from closing when it is clicked back button
        }).then(function() {
                this.setDrive(() => {
                }, error => console.log(error), { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
            }.bind(this)
        ).catch((error) => {
            console.log(error.message);
        });
    }


    componentWillMount(){
        this.fetchCars();
        this.fetchName();
    }


    currentPos(){
        LayoutAnimation.spring();
        let uid = firebaseApp.auth().currentUser.uid;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                    currentLat: position.coords.latitude,
                    // currentLat: 51.963537,
                    currentLong: position.coords.longitude,
                    // currentLong: 5.866388,
                    error: null,
                });

                Geocoder.geocodePosition({lat: position.coords.latitude, lng: position.coords.longitude})
                    .then(result => {
                        let addressString = result[0].streetName + ' ' + result[0].streetNumber + ', ' + result[0].locality;
                        this.setState({completeCurrent: addressString});
                    });
                if(this.state.hasRouteLine === true){
                    this.setState({extraDrivingTime: 0});
                    this.getPassenger();
                }
            },
            (error) => this.setState({error: error.message}),
        );

        this.locationListener = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    currentLat: position.coords.latitude,
                    currentLong: position.coords.longitude,
                    error: null,
                });
                firebaseApp.database()
                    .ref('drivers/'+uid)
                    .once('value')
                    .then((snapshot) => {
                        let driverExists = snapshot.val();
                        console.log(driverExists);
                        if(driverExists !== null){
                            let updates = {};
                            updates['/lat/'] =  position.coords.latitude;
                            updates['/long/'] = position.coords.longitude;
                            firebaseApp.database().ref('drivers/'+uid).update(updates);
                            if(this.state.hasRouteLine === true){
                                this.setState({extraDrivingTime: 0});
                                this.getPassenger();
                            }
                        }
                    });
            },
            (error) => this.setState({error: error.message}));
    }


    loadProfilePicture() {
        let uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database().ref(FirebaseKeys.USER_NODE)
            .child(uid)
            .child(FirebaseKeys.USER.PICTURE)
            .once(FirebaseKeys.VALUE.ONCE)
            .then(snapshot => {
                let picture = snapshot.val();
                if (picture !== null) {
                    firebaseApp.storage()
                        .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                        .child(picture)
                        .getDownloadURL().then((url) => {
                        this.setState({profilePicture: {uri: url}});
                    });
                }else{
                    let url = firebaseApp.auth().currentUser.photoURL;
                    this.setState({profilePicture: {uri : url}});
                }
            });
    }

    openRequestModal(title, message, requestModal, passengerImage, passengerName, passengerId, lat, long, destLat, destLong, firebaseNodePassenger){
        if(this.state.newLat != null){
            console.log('sagbeeeeee');
            let context = this;
            let startCoords = this.state.currentLat.toString() + ',' + this.state.currentLong.toString();
            let endCoords = this.state.newLat.toString() + ',' +  this.state.newLong.toString();
            let waypoints = lat + ',' + long;
            console.log('===');
            console.log(startCoords);
            console.log(waypoints);
            console.log(endCoords);
            console.log('===');
            Navigation.getNavigationDataForDriver(startCoords, waypoints, endCoords)
                .then((routeData) => {
                    context.setState({
                        routeDistanceBetween: Navigation.getNavigationDistance(routeData),
                        routeTimeBetween: Navigation.getNavigationDurationNew(routeData)
                    });
                    console.log("origineel:" +  this.state.routeTime);
                    console.log("maybe goeie:" + Navigation.getNavigationDuration(routeData));
                    this.calculateInCommingPassenger();
                });
            this.setState({
                title: title,
                message: message,
                requestModal: requestModal,
                passengerImage: passengerImage,
                passengerName: passengerName,
                passengerId: passengerId,
                paslat: lat,
                paslong: long,
                pasDestLat: destLat,
                pasDestLong: destLong,
                fbNodePassenger: firebaseNodePassenger
            });
        }
    }

    calculateInCommingPassenger(){
        let driverDesTime = parseFloat(this.state.routeTime);
        let passengerDesTime = parseFloat(this.state.routeTimeBetween);
        let extraDrivingTime = passengerDesTime - driverDesTime;
        console.log('======');
        console.log('driver: ' + driverDesTime);
        console.log('totaal plus passagiers: ' + passengerDesTime);
        console.log('extra rij tijd: ' + extraDrivingTime);
        console.log('======');
        this.setState({extraDriveTime: extraDrivingTime});
    }

    acceptRequest() {
        this.setState({requestModal: false});
        let ref = this.state.fbNodePassenger;
        let response = firebaseApp.database()
            .ref(FirebaseKeys.REQUEST_NODE)
            .child(ref);
        let updates = {};
        updates[FirebaseKeys.REQUEST.DRIVER.UID] = firebaseApp.auth().currentUser.uid;
        updates[FirebaseKeys.REQUEST.DRIVER.NAME] = firebaseApp.auth().currentUser.displayName;

        updates[FirebaseKeys.REQUEST.STATE] = FirebaseKeys.REQUEST.STATES.DRIVERACCEPTED;
        response.update(updates);
        let driverId = firebaseApp.auth().currentUser.uid;
            let somDriveTime = this.state.extraDriveTime + this.state.totalExtraDrivetime;
            this.setState({totalExtraDrivetime: somDriveTime});
        this.connectDriverWithPassenger(driverId);
    }

    connectDriverWithPassenger(driverId){
        let passengerName = this.state.passengerName;
        let passengerId = this.state.passengerId;
        let passengerLat = this.state.paslat;
        let passengerLong = this.state.paslong;
        let passengerDestLat = this.state.pasDestLat;
        let passengerDestLong = this.state.pasDestLong;

        console.log('tozzz');
        console.log(driverId);
        console.log('tozzz');
        let data = {
            passengerId: passengerId,
            passengerName: passengerName,
            passengerLat: passengerLat,
            passengerLong: passengerLong,
            passengerDestLat: passengerDestLat,
            passengerDestLong: passengerDestLong,
            extraDrivingTime: this.state.extraDriveTime
        };
        firebaseApp.database().ref('drivers/'+driverId+'/passengers/'+passengerId).set(data);
        this.getPassenger(passengerLat, passengerLong, passengerDestLat, passengerDestLong);
        console.log('connection is klaar');
    }


    getPassenger(){
        this.setState({passengersMarker: null, extraDrivetimeBox: false, totalExtraDrivetime: 0});
        let context = this;
        let passengerArray = [];
        let uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database()
            .ref('drivers/'+uid+'/passengers')
            .once(FirebaseKeys.VALUE.ONCE)
            .then((snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    passengerArray.push(childSnapshot.val());
                });
                this.setState({passengerArray: passengerArray});
                this.setState({passengerArrayLength: passengerArray.length});
                if(passengerArray.length >= 1){
                    this.setState({extraDrivetimeBox: true});
                }
                let waypoints = '';
                let i = 0;
                for(let key in passengerArray){
                    let obj = passengerArray[key];
                    if(i !== 0 && i === passengerArray.length-1){
                        waypoints += '|';
                    }
                    waypoints += obj.passengerLat.toString() + ',' + obj.passengerLong.toString();
                    i++;
                }
                let pointers = [];

                for(let key in passengerArray){
                    let obj = passengerArray[key];
                    Geocoder.geocodePosition({lat: parseFloat(obj.passengerLat), lng: parseFloat(obj.passengerLong)})
                        .then(result => {
                            let addressString = result[0].streetName + ' ' + result[0].streetNumber + ', ' + result[0].locality;
                            pointers.push({title: obj.passengerName, description: addressString, coordinates: {latitude: parseFloat(obj.passengerLat), longitude: parseFloat(obj.passengerLong)}});
                            this.setState({
                                pointer: pointers,
                                totalExtraDrivetime: this.state.totalExtraDrivetime + obj.extraDrivingTime
                            });
                            this.setState({
                                passengersMarker:
                                    <View>
                                        {this.state.pointer.map(marker => (
                                            <MapView.Marker
                                                coordinate={marker.coordinates}
                                                title={marker.title}
                                                description={marker.description}
                                                image={markerImage}
                                            />
                                        ))}
                                    </View>
                            });
                    });
                }


                let startCoords = this.state.currentLat.toString() + ',' + this.state.currentLong.toString();
                let endCoords = this.state.newLat.toString() + ',' +  this.state.newLong.toString();
                console.log('===');
                console.log(startCoords);
                console.log(waypoints);
                console.log(endCoords);
                console.log('===');
                Navigation.getNavigationDataForDriver(startCoords, waypoints, endCoords)
                    .then((routeData) => {
                        context.setState({
                            routeDistanceBetween: Navigation.getNavigationDistance(routeData),
                            routeTimeBetween: Navigation.getNavigationDurationNew(routeData),
                            coords: Navigation.getNavigationPolyLine(routeData),
                            hasRouteLine: true
                        });
                        console.log("origineel:" +  this.state.routeTime);
                        console.log("maybe goeie:" + Navigation.getNavigationDuration(routeData));
                        this.calculateExtraDrivingTime();
                    });
            });
    }


    calculateExtraDrivingTime(){
            let driverDesTime = parseFloat(this.state.routeTime);
            let passengerDesTime = parseFloat(this.state.routeTimeBetween);
            let extraDrivingTime = passengerDesTime - driverDesTime;
            console.log('======');
                console.log('driver: ' + driverDesTime);
                console.log('totaal plus passagiers: ' + passengerDesTime);
                console.log('extra rij tijd: ' + extraDrivingTime);
            console.log('======');
                    this.setState({extraDriveTime: extraDrivingTime});
    }
// console.log("inCommon: " + JSON.stringify(inCommon));
//             console.log('===');
//             console.log(name);
//             console.log(lat1.toString());
//             console.log(long1.toString());
//             console.log(destLat.toString());
//             console.log(destLong.toString());
//             console.log(passengeruid);
//             console.log(ref);
//             console.log(JSON.stringify(inCommon));
    // console.log(city);
    // console.log(address);
    // console.log('====');

    toggleStatus(value){
        LayoutAnimation.spring();
            this.setState({status: value, switchOnOff: value});
            if (value === false){
                this.deleteAlert();
            }else{
                this.currentPos();
                this.updateLocations();
            }
    }


    travel(){
        let context = this;
        Navigation.getNavigationData(this.state.currentLat, this.state.currentLong, this.state.newLat, this.state.newLong)
            .then((routeData) => {
                Geocoder.geocodePosition({lat: this.state.newLat, lng: this.state.newLong})
                    .then(result => {
                        let addressString = result[0].streetName + ' ' + result[0].streetNumber + ', ' + result[0].locality;
                        let fullAdressAndNumber = result[0].streetName + ' ' + result[0].streetNumber;
                        this.setState({completeDestination: addressString});
                        this.setState({destinationFullAdressName: result[0].streetName + ' ' + result[0].streetNumber});
                        this.setState({destinationFullCityName: result[0].locality});
                        this.setState({driverCityName: result[0].locality});
                        this.setDrivingMode(result[0].streetName + ' ' + result[0].streetNumber, result[0].locality);
                        this.setState({
                            point:(
                                <MapView.Marker
                                    title={'Bestemming: '}
                                    description={addressString}
                                    coordinate={{
                                        longitude: this.state.newLong, latitude: this.state.newLat,
                                        longitudeDelta: 0.0421, latitudeDelta: 0.0922
                                    }} >
                                    <View style={{width: 15, height: 15, borderColor: '#36006b', borderWidth: 3, borderRadius: 7, backgroundColor: '#FFFFFF'}}/>
                                </MapView.Marker>)
                        });
                    });
                context.setState({
                    routeDistance: Navigation.getNavigationDistance(routeData),
                    routeTime: Navigation.getNavigationDuration(routeData),
                    coords: Navigation.getNavigationPolyLine(routeData),
                    routeValue: 1,
                    routeData: routeData,
                    hasRouteLine: true
                });
                this.setState({mainDivDestionation: false, mapMainDiv: true, destinationDriverBox: false, status: false, firstSwitch: false, mapDiv: true, switchBox: true, destinationBox: true, comma: ', '});
            });
    }

    setDrive(){
        this.setDriver();
    }

    setDriver(){
        this.currentPos();
        if(this.state.newLat != null && this.state.newLong != null){
            this.loadProfilePicture();
            this.travel();
            setTimeout(() => {
                let uid = firebaseApp.auth().currentUser.uid;
                let ref = firebaseApp.database().ref(FirebaseKeys.DRIVER_NODE).child(uid);
                this.setState({currentDriver: ref});
                DriverLocationHandler.uploadRouteCoords(this.state.currentLat, this.state.currentLong, this.state.routeData, this.state.selectCar,ref, this.state.driverCityName);
                this.fetchDriverInfo();
                this.setState({addLocationModal: false, destinationDriverBox: true, status: false, googleKaart: true});
            }, 500);
        }
    }

    fetchName() {
        let uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database()
            .ref(FirebaseKeys.USER_NODE)
            .child(uid)
            .once(FirebaseKeys.VALUE.ONCE)
            .then((snapshot) => {
                let name = snapshot.child(FirebaseKeys.USER.NAME).val();

                if (name === null || name === '') {
                    let getName = firebaseApp.auth().currentUser.displayName;
                    let splitName = getName.split(" ");
                    let firstName = splitName.splice(0, 1);
                    let lastName = splitName.join(' ');
                    this.setState({firstName: firstName, lastName: lastName});
                }else{
                    let splitName = name.split(" ");
                    let firstName = splitName.splice(0, 1);
                    let lastName = splitName.join(' ');
                    this.setState({firstName: firstName, lastName: lastName});
                }
            });
    }



    fetchCars() {
        CarManager.getCars()
            .then(cars => {
                if (cars.length > 0) {
                    this.setState({
                        selectCarsDataSource: this.state.selectCarsDataSource.cloneWithRows(cars),
                        selectCarsError: "",
                        selectCar: cars[0],
                        firstCarName: cars[0].name,
                        firstCarColour: cars[0].colour,
                        firstCarbrand: cars[0].brand,
                        firstCarLicense: cars[0].license});
                } else {
                    this.setState({selectCarsError: "Geen auto's gevonden"})
                }
            });
    }

    fetchDriverInfo(){
        let uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database().ref(FirebaseKeys.DRIVER_NODE)
            .child(uid)
            .child(FirebaseKeys.DRIVER.TIMESTAMP)
            .once(FirebaseKeys.VALUE.ONCE)
            .then(snapshot => {
                let time = snapshot.val();
                this.setState({timeStamp: time});
            });
    }

    deleteAlert(){
        Alert.alert(
            'Rit annuleren?',
            "Weet u zeker dat u uw rit wilt annuleren?",
            [
                {text: 'Nee', style: 'Cancel', onPress: () => this.setState({status: true, switchOnOff: true})},
                {text: 'Ja', onPress: () => this.deleteDriver()}
            ],
            {cancelable: true}
        )
    }

    deleteDriver(){
        let curDriver = this.state.currentDriver;
        if (curDriver !== null){
            this.setState({totalExtraDrivetime:0 , extraDrivetimeBox: false, passengersMarker: null, hasRouteLine: false});
            this.setState({currentDriver: null, newLat: null, neLong: null});
            this.setState({mainDivDestionation: true, mapMainDiv: false, destinationDriverBox: true, newCompleteAddress: null, completeDestination: null, completeCurrent: null, status: false, firstSwitch: true, mapDiv: false, switchBox: false, destinationBox: false, comma: null, newAddress: null, newCity: null});
            curDriver.remove();
            this.setState({destinationDriverBox: false});
        }else{
            console.log('Geen driver geselecteerd!');
        }

    }

    fetchLocationsData() {
        let uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database().ref(FirebaseKeys.LOCATIONS_NODE)
            .child(uid)
            .once(FirebaseKeys.VALUE.ONCE)
            .then((snapshot) => {
                let items = [];
                snapshot.forEach((location) => {
                    let  name = location.child(FirebaseKeys.LOCATIONS.NAME).val();
                    let  address = location.child(FirebaseKeys.LOCATIONS.ADDRESS).val();
                    let  city = location.child(FirebaseKeys.LOCATIONS.CITY).val();
                    let  lat = location.child(FirebaseKeys.LOCATIONS.LAT).val();
                    let  long = location.child(FirebaseKeys.LOCATIONS.LONG).val();
                    let  key = location.key;
                    items.push({name: name, address: address, city: city, lat: lat, long: long, ref: key});
                });
                this.setState({locationsDataSource: this.state.locationsDataSource.cloneWithRows(items)});
                this.updateLocations();
            });
    }

    updateLocations() {
        let uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database()
            .ref(FirebaseKeys.LOCATIONS_NODE)
            .child(uid)
            .once(FirebaseKeys.VALUE.ONCE)
            .then((snapshot) => {
                let locations = [];
                snapshot.forEach((location) => {
                    let name = location.child(FirebaseKeys.LOCATIONS.NAME).val();
                    let address = location.child(FirebaseKeys.LOCATIONS.ADDRESS).val();
                    let city = location.child(FirebaseKeys.LOCATIONS.CITY).val();
                    let lat = parseFloat(location.child(FirebaseKeys.LOCATIONS.LAT).val());
                    let long = parseFloat(location.child(FirebaseKeys.LOCATIONS.LONG).val());
                    locations.push({
                        description: name + ' ( ' + address + ' ' + city + ' )',
                        geometry: {location: {lat: lat, lng: long}},
                        structured_formatting: {
                            main_text: address,
                            secondary_text: city,
                        },
                        isPredefinedPlace : true,
                    });
                });
                this.setState({locations: locations});
            });
    }

    openDestinationModal(){
        if (this.state.firstCarName === '' && this.state.firstCarLicense === ''){
            Alert.alert(
                'Geen auto geselecteerd',
                "Ga naar uw 'profiel' om een auto toe te voegen",
                [
                    {text: 'Sluiten', style: 'Cancel', onPress: () => this.setState({addLocationModal: false})},
                    // {text: 'Profiel', onPress: () => this.state.main.changeScreen('options')}
                ],
                {cancelable: true}
            )
        }else{
            this.setState({addLocationModal: true});
            this.fetchLocationsData();
        }
    }

    navigator(name, data) {

        this.props.navigator.push({
            name,
            data
        });
    }


    openCarModal(boolean){
        this.setState({carModal: boolean});
    }

    goToOptionPage(){
        this.navigator("OptionsPage", null);
        this.setState({carModal: false});
    }

    renderCarRow(car) {
        return (
            <TouchableHighlight onPress={() => this.onSelectCar(car)}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{paddingBottom: 5, paddingTop: 5, flex: 1, alignSelf: 'flex-start'}}>
                        <Text style={{fontSize: 15, color: '#6F0091'}}>{car.name}</Text>
                    </View>
                    <View style={{paddingBottom: 5, paddingTop: 5, flex: 1, alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 15, color: '#6F0091'}}>{car.license}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    onSelectCar(car) {
        this.setState({firstCarName: car.name, firstCarLicense: car.license, carModal: false, firstCarBrand: car.brand, firstCarColour: car.colour, selectCar: car});
    }

    test() {
        LayoutAnimation.spring();
        if (this.state.facebookInfo === false) {
            LayoutAnimation.spring();
            this.setState({facebookInfo: true, arrowFacebookInfo: 'keyboard-arrow-up', facebookFlexNumber: 0});
        } else if (this.state.facebookInfo === true) {
            LayoutAnimation.spring();
            this.setState({facebookInfo: false, arrowFacebookInfo: 'keyboard-arrow-down', facebookFlexNumber: 0.1});
        } else {
            console.log('Facebook modal werkt niet');
        }
    }

    onNewLocationPressed(data, details) {
        let address = data.structured_formatting.main_text;
        let city = data.structured_formatting.secondary_text;
        let lat = details.geometry.location.lat;
        let long = details.geometry.location.lng;
        this.setState({
            newAddress: address,
            newCity: city,
            newLat: lat,
            newLong: long,
            newCompleteAddress: address + ', ' + city
        });
    }

    setDrivingMode(street, city) {
        this.setState({
            navButton: (
                    <NavigationButton address={street} city={city}/>
                )
        });
    }


    declineRequest(){
        console.log('niet accepteren');
        this.setState({requestModal: false});
        // firebaseApp.database()
        //     .ref('requests/')
        //     .once('value')
        //     .then((snapshot) => {
        //         snapshot.forEach((childSnapshot) => {
        //             let request = childSnapshot.val();
        //             console.log("frikandellen");
        //             console.log(request);
        //             console.log(this.state.passengerId);
        //             console.log("frikandellen");
        //             if(request.uid === this.state.passengerId){
        //                 let updates = {};
        //                 updates['ready'] = 1;
        //                 firebaseApp.database().ref('requests/'+childSnapshot.key).update(updates);
        //             }
        //         });
        //     });
    }


    render() {
        return (
            <Image source={require('../../../images/achtergrond_auto.png')} style={styles.backgroundImage}>
                <ScrollView keyboardShouldPersistTaps='always'>
                        {renderIf(this.state.mainDivDestination)(
                            <View style={styles.contain}>
                                <View style={{padding: 25, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 25, color: '#F6CBD7'}}>Wil je iemand</Text>
                                    <Text style={{fontSize: 25, color: '#F6CBD7'}}>meenemen? </Text>
                                </View>
                                <View style={{marginBottom: 5, marginRight: 5, marginLeft: 5}}>
                                    <Text style={{color: '#6F0091', fontWeight: 'bold', fontSize: 13}}>Maak een nieuwe rit aan!</Text>

                                </View>
                                {renderIf(this.state.firstSwitch)(
                                <Card style={{flex: 1, width: 290, paddingLeft: -16, paddingRight: -16}}>
                                    <Card.Body>
                                        <View style={{flex:1 ,marginLeft: 16, marginRight: 16, flexDirection: 'row'}}>
                                            <View style={{flex: 1.5, justifyContent: 'center', marginLeft: 16}}>
                                                <Text style={{color: '#6F0091'}}>Beschikbaar stellen</Text>
                                                <Text style={{color: '#6F0091'}}>als bestuurder</Text>
                                            </View>
                                            <View style={{justifyContent: 'center', flex: 1,  marginRight: 10}}>
                                                <Switch
                                                    onValueChange={(value) => this.toggleStatus(value)}
                                                    value={this.state.switchOnOff}/>
                                            </View>
                                        </View>
                                    </Card.Body>
                                </Card>
                                )}
                                <View>
                                    {renderIf(this.state.status)(
                                        <Card style={{width: 290}}>
                                            <Card.Body>
                                                <View>
                                                    <View style={{backgroundColor: '#FFFFFF', borderColor: '#D3D3D3', borderBottomWidth: 1, paddingBottom: 5, paddingTop: 5}}>
                                                        <TouchableOpacity onPress={() => this.openDestinationModal()} style={{flex: 1 ,marginLeft: 16, marginRight: 16, marginBottom: 10}}>
                                                            <Text style={{color: '#6F0091', fontWeight: 'bold', fontSize: 13}}>Bestemming indienen</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{backgroundColor: '#FFFFFF'}}>
                                                        <TouchableHighlight onPress={() => this.openCarModal(true)}>
                                                            <View style={{flex:1 ,marginLeft: 16, marginRight: 16, paddingTop: 16, flexDirection: 'row'}}>
                                                                <View style={{flex:1.4, alignSelf: 'flex-start'}}>
                                                                    <Text style={{color: '#6F0091', fontWeight: 'bold', fontSize: 13}}>Ander voertuig</Text>
                                                                </View>
                                                                <View style={{flex: 1.5, alignSelf: 'flex-end'}}>
                                                                    <View style={{flexDirection: 'row'}}>
                                                                        <View style={{flex: 1}}>
                                                                            <Text style={{color: '#D3D3D3', alignSelf: 'flex-start'}}>{this.state.firstCarName}</Text>
                                                                        </View>
                                                                        <View style={{flex: 1, alignSelf: 'flex-end'}}>
                                                                            <Text style={{color: '#D3D3D3', alignSelf: 'flex-end'}}>{this.state.firstCarLicense}</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>
                                            </Card.Body>
                                        </Card>
                                    )}
                                </View>

                                <View>
                                    {renderIf(this.state.destinationDriverBox)(
                                        <Card style={{width: 290}}>
                                            <Card.Body>
                                                <View style={{marginLeft: 16, marginRight: 16}}>
                                                    <Text style={{color: '#6F0091', fontWeight: 'bold', fontSize: 13}}>Uw ingediende bestemming</Text>
                                                </View>
                                                <View style={{marginTop: 10, marginLeft: 16, marginRight: 16}}>
                                                    <Text style={{color: '#D3D3D3', fontWeight: 'bold', fontSize: 13}}>{this.state.newAddress}, {this.state.newCity}</Text>
                                                </View>
                                            </Card.Body>
                                        </Card>
                                    )}
                                </View>



                                <ModalExtern isVisible={this.state.carModal}
                                             transparent={true}
                                             animationType="slide"
                                             onRequestClose={() => this.setState({carModal: false})}
                                             style={{color: '#FFFFFF', justifyContent: 'center'}}>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 1}} />
                                        <View style={{flex: 4, justifyContent: 'center'}}>
                                            <View style={{flex: 1, flexDirection: 'column'}}>
                                                <View style={{flex: 1}} />
                                                <View style={{flex: 5}}>
                                                    <View style={{flex: 1, borderRadius: 2, borderWidth: 1, borderColor: '#36006b'}}>
                                                        <HeaderBar onBackPressed={() => this.setState({carModal: false})} title="Selecteer een auto"/>
                                                    </View>
                                                    <View style={{flex: 4, marginTop: -3, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, borderWidth: 0.5, borderColor: '#D3D3D3', backgroundColor: '#FFFFFF'}}>
                                                        <View style={{margin: 16}}>
                                                            <ListView style={{marginBottom: 10, marginRight: 10, marginLeft: 10}}
                                                                      dataSource={this.state.selectCarsDataSource}
                                                                      renderRow={this.renderCarRow.bind(this)}/>
                                                            {/*<View style={{paddingTop: 10, paddingBottom: 10, borderColor: '#D3D3D3', borderTopWidth: 0.5}}>*/}
                                                                {/*<TouchableHighlight onPress={() => this.goToOptionPage()}>*/}
                                                                    {/*<Text style={{paddingLeft: 10, paddingRight: 10, color: '#D3D3D3'}}>Auto toevoegen / wijzigen</Text>*/}
                                                                {/*</TouchableHighlight>*/}
                                                            {/*</View>*/}
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{flex: 4}} />
                                            </View>
                                        </View>
                                        <View style={{flex: 1}} />
                                    </View>
                                </ModalExtern>

                                <Modal
                                    animationType="slide"
                                    onRequestClose={() => this.setState({addLocationModal: false})}
                                    transparent={false}
                                    visible={this.state.addLocationModal}>
                                    <ScrollView keyboardShouldPersistTaps='always'>
                                        <EditHeaderBar style={{flex: 1}} title="Bestemming indienen"
                                                       onBackPressed={() => {this.setState({addLocationModal: false});}}
                                                       onSavePressed={() => {this.checkGPS();}}/>
                                        <View style={{marginTop: 10}}/>


                                        <GooglePlacesAutocomplete
                                            placeholder='Zoeken naar een bestemming'
                                            minLength={2}
                                            autoFocus={true}
                                            listViewDisplayed='auto'
                                            fetchDetails={true}
                                            renderDescription={(row) => row.description}
                                            onPress={(data, details = null) => {
                                                this.onNewLocationPressed(data, details);
                                            }}
                                            getDefaultValue={() => {
                                                return '';
                                            }}
                                            query={{
                                                key: 'AIzaSyAcHeNdkB7i8AFxjAoS0L6ziqWUaWBRW_c',
                                                language: 'nl',
                                                types: 'address',
                                            }}
                                            style={styles.autocomplete}
                                            styles={{
                                                description: {
                                                    fontWeight: 'bold',
                                                    padding: 0,
                                                    color: '#6F0091'
                                                    // justifyContent: 'center'
                                                },
                                                predefinedPlacesDescription: {
                                                    color: '#6F0091',
                                                },
                                                textInput: {
                                                    padding: 0,
                                                    marginLeft: 0,
                                                    // textAlign: 'right',
                                                    flexWrap: 'wrap',
                                                    flex: 1,
                                                    flexDirection:'row',
                                                    color: '#6F0091'
                                                    // backgroundColor: '#6F0091',
                                                },
                                                textInputContainer: {
                                                    color: '#6F0091',
                                                    backgroundColor: 'rgba(0,0,0,0)'
                                                },
                                                powered: {width: 0, height: 0},

                                            }}
                                            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                            currentLocationLabel="Current location"
                                            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                            GoogleReverseGeocodingQuery={{
                                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                            }}
                                            GooglePlacesSearchQuery={{
                                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                                rankby: 'distance',
                                                types: 'food',
                                            }}


                                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                            predefinedPlaces={this.state.locations}
                                            debounce={200}
                                        />
                                    </ScrollView>
                                </Modal>
                            </View>
                            )}

                </ScrollView>
                {renderIf(this.state.mapMainDiv)(
                    <View style={styles.main}>
                        <View style={styles.box}>
                            {renderIf(this.state.switchBox)(
                                <Card style={{flex: 1, width: 260, paddingLeft: -16, paddingRight: -16}}>
                                    <Card.Body>
                                        <View style={{flex:1 ,marginLeft: 16, marginRight: 16, flexDirection: 'row'}}>
                                            <View style={{flex: 1.5, justifyContent: 'center', marginLeft: 16}}>
                                                <Text style={{color: '#D3D3D3'}}>U bent actief</Text>
                                                <Text style={{color: '#D3D3D3'}}>als een bestuurder</Text>
                                            </View>
                                            <View style={{justifyContent: 'center', flex: 1,  marginRight: 10}}>
                                                <Switch
                                                    onValueChange={(value) => this.toggleStatus(value)}
                                                    value={this.state.switchOnOff}/>
                                            </View>
                                        </View>
                                    </Card.Body>
                                </Card>
                            )}
                        </View>
                        {renderIf(this.state.mapDiv)(
                            <View style={styles.container}>
                                <Image
                                    style={{opacity: 0, height: 0, width: 0}}
                                    source={markerImage}
                                />
                                <MapView
                                    style={styles.map}
                                    region={{
                                        longitude: this.state.long, latitude: this.state.lat,
                                        latitudeDelta: 0.1, longitudeDelta: 0.1
                                    }}>
                                    <View>{this.state.point}</View>
                                    <View>{this.state.passengersMarker}</View>
                                    <View>{this.state.driverLocation}</View>


                                    <MapView.Marker
                                        title={'U:'}
                                        description={this.state.completeCurrent}
                                        coordinate={{
                                            longitude: this.state.currentLong, latitude: this.state.currentLat,
                                            latitudeDelta: 0.1, longitudeDelta: 0.1
                                        }}>
                                        <View style={{marginTop: 3}}>
                                            <View style={{borderWidth: 12, borderRadius: 60, borderColor: this.state.borderProfileRing}}>
                                                <Image style={{borderWidth: 4, borderColor: '#FFFFFF', width: 50, height: 50, borderRadius: 50}} source={this.state.profilePicture}/>
                                            </View>
                                        </View>
                                    </MapView.Marker>
                                    <MapView.Polyline
                                        coordinates={this.state.coords}
                                        strokeWidth={6}
                                        strokeColor={this.state.strokeColor}
                                        fillColor={this.state.strokeColor}
                                    />
                                    <MapView.Polyline
                                        coordinates={this.state.coordsBetween}
                                        lineDashPhase={4}
                                        strokeWidth={6}
                                        strokeColor={'#e75a58'}
                                        fillColor={'#e75a58'}
                                    />
                                </MapView>
                            </View>
                        )}

                        <View style={styles.box2}>
                            {renderIf(this.state.destinationBox)(
                                <View style={{justifyContent: 'center'}}>

                                        {renderIf(this.state.extraDrivetimeBox)(
                                            <View style={{flexDirection: 'row'}}>
                                                <View style={{justifyContent: 'center', alignItems: 'flex-start', marginRight:-6, marginBottom: -6}}>
                                                    <Card style={{width: 100, height: 35, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text>+ {this.state.totalExtraDrivetime} min</Text>
                                                    </Card>
                                                </View>
                                            </View>
                                        )}
                                    <View style={{width: 260, height: 65, flexDirection: 'row'}}>
                                        <Card style={{width: 195, justifyContent: 'center', alignItems: 'flex-start'}}>
                                            <View style={{width:195, marginLeft: -6, marginRight: -6, justifyContent: 'center', alignItems: 'center'}}>
                                                <View>
                                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                                        <View style={{alignItems: 'flex-start'}}>
                                                            <View style={{flexDirection: 'row'}}>
                                                                <Text style={{alignItems: 'flex-start', color: '#8A5BB7', fontWeight: 'bold', fontSize: 13}}>Afstand: </Text>
                                                                <Text style={{alignItems: 'flex-end', color: '#D3D3D3', fontWeight: 'bold', fontSize: 13}}>{this.state.routeDistance}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{alignItems: 'flex-end'}}>
                                                            <View style={{flexDirection: 'row'}}>
                                                                <Text style={{alignItems: 'flex-start', color: '#8A5BB7', fontWeight: 'bold', fontSize: 13}}>Ca. Tijd: </Text>
                                                                <Text style={{alignItems: 'flex-end', color: '#D3D3D3', fontWeight: 'bold', fontSize: 13}}>{this.state.routeTime}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </Card>
                                        <Card style={{width: 45, marginLeft: -3, paddingLeft: 3, justifyContent: 'center', alignItems: 'flex-end'}}>
                                                <View style={{marginRight: 1.5}}>
                                                    <View>{this.state.navButton}</View>
                                                </View>
                                        </Card>
                                    </View>
                                    <View style={{width: 260, height: 65, flexDirection: 'row', marginTop: -11}}>
                                        <Card style={{width: 245, justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{marginLeft: -6, marginRight: -6, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{color: '#D3D3D3', fontWeight: 'bold', fontSize: 13}}>{this.state.completeDestination}</Text>
                                            </View>
                                        </Card>
                                    </View>
                                </View>
                            )}
                            <ModalExtern
                                animationType={"slide"}
                                transparent={true}
                                isVisible={this.state.requestModal}
                                backdropOpacity={0.30}
                                onRequestClose={() => this.setState({requestModal: false})}
                                style={styles.requestModal}>
                                {/*<View style={styles.modalWindow}>*/}
                                <View style={{flex: 1, marginRight: 26, marginLeft: 26}}>
                                    <View style={{flex: 0.05}}/>
                                    <View style={{flex: 1}}>
                                        <View style={{flex: this.state.facebookFlexNumber}}/>
                                        <View style={{flex: 1, marginLeft: 16, marginRight: 16}}>
                                            <View style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginBottom: -40,
                                                zIndex: 2
                                            }}>
                                                <View style={{
                                                    borderWidth: 0.5,
                                                    borderRadius: 95,
                                                    borderColor: '#D3D3D3',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <View style={{borderWidth: 7, borderRadius: 85, borderColor: '#FFFFFF'}}>
                                                        <Image source={this.state.passengerImage}
                                                               style={{height: 150, width: 150, borderRadius: 75}}/>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{zIndex: 1, marginTop: -53, marginLeft: -16, marginRight: -16}}>
                                                <Card style={{paddingLeft: -16, paddingRight: -16}}>
                                                    <View>
                                                        <View style={{height: 100}}>
                                                            <View>

                                                            </View>
                                                        </View>
                                                        <View style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderTopWidth: 0.5,
                                                            borderColor: '#D3D3D3'
                                                        }}>

                                                            <TouchableHighlight underlayColor={'#D3D3D3'}
                                                                                onPress={() => this.test()}>
                                                                <View style={{
                                                                    paddingBottom: 20,
                                                                    paddingTop: 20,
                                                                    paddingLeft: 35,
                                                                    flexDirection: 'row'
                                                                }}>
                                                                    <Text style={{
                                                                        color: '#000000',
                                                                        fontSize: 22
                                                                    }}>{this.state.message}</Text>

                                                                    <Icon name={this.state.arrowFacebookInfo} size={35}
                                                                          color={'#D3D3D3'}/>
                                                                </View>

                                                            </TouchableHighlight>
                                                        </View>
                                                        <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 16}}>
                                                            <Text style={{color: '#000000', fontSize: 22}}>Wilt met u meerijden</Text>
                                                        </View>
                                                    </View>
                                                    {renderIf(this.state.facebookInfo)(
                                                        <View style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            paddingBottom: 16
                                                        }}>
                                                            <Text style={{color: '#D3D3D3', fontSize: 13, marginTop: -15}}>Is ook
                                                                bekend met:...</Text>
                                                            <View style={{flexDirection: 'row', paddingLeft: 16, paddingRight: 16}}>
                                                                <View style={{
                                                                    flexDirection: 'column',
                                                                    alignSelf: 'flex-start',
                                                                    flex: 1
                                                                }}>
                                                                    <View style={{
                                                                        paddingTop: 10,
                                                                        paddingBottom: 10,
                                                                        paddingLeft: 5,
                                                                        paddingRight: 5,
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <View style={{
                                                                            borderWidth: 0.5,
                                                                            borderColor: '#D3D3D3',
                                                                            borderRadius: 80
                                                                        }}>
                                                                            <Image source={require('../../../images/reneB.jpg')}
                                                                                   style={{
                                                                                       height: 40,
                                                                                       width: 40,
                                                                                       borderRadius: 75
                                                                                   }}/>
                                                                        </View>
                                                                        <Text style={{marginLeft: 10}}>René Bakker</Text>
                                                                    </View>
                                                                    <View style={{
                                                                        paddingTop: 10,
                                                                        paddingBottom: 10,
                                                                        paddingLeft: 5,
                                                                        paddingRight: 5,
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <View style={{
                                                                            borderWidth: 0.5,
                                                                            borderColor: '#D3D3D3',
                                                                            borderRadius: 80
                                                                        }}>
                                                                            <Image source={require('../../../images/tom.jpeg')}
                                                                                   style={{
                                                                                       height: 40,
                                                                                       width: 40,
                                                                                       borderRadius: 75
                                                                                   }}/>
                                                                        </View>
                                                                        <Text style={{marginLeft: 10}}>Tom barend</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={{
                                                                    flexDirection: 'column',
                                                                    alignSelf: 'flex-end',
                                                                    flex: 1
                                                                }}>
                                                                    <View style={{paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                                        <View style={{borderWidth: 0.5, borderColor: '#D3D3D3', borderRadius: 80}}>
                                                                            <Image source={require('../../../images/jos.jpg')} style={{height: 40,width: 40, borderRadius: 75}}/>
                                                                        </View>
                                                                        <Text style={{marginLeft: 10}}>Jos Toonen</Text>
                                                                    </View>
                                                                    <View style={{
                                                                        paddingTop: 10,
                                                                        paddingBottom: 10,
                                                                        paddingLeft: 5,
                                                                        paddingRight: 5,
                                                                        flexDirection: 'row',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <View style={{
                                                                            borderWidth: 0.5,
                                                                            borderColor: '#D3D3D3',
                                                                            borderRadius: 80
                                                                        }}>
                                                                            <Image source={require('../../../images/thijs.jpg')}
                                                                                   style={{
                                                                                       height: 40,
                                                                                       width: 40,
                                                                                       borderRadius: 75
                                                                                   }}/>
                                                                        </View>
                                                                        <Text style={{marginLeft: 10}}>Thijs Lange</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )}
                                                </Card>

                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{
                                    flex: 0.25,
                                    marginRight: -16,
                                    marginLeft: -16,
                                    backgroundColor: '#FFFFFF',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    borderTopWidth: 0.5,
                                    borderColor: '#D3D3D3'
                                }}>
                                    <View style={{flex: 0.3}}/>
                                    <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}>
                                        <TouchableOpacity onPress={this.acceptRequest.bind(this)}>
                                            <Card style={{borderRadius: 50}}>
                                                <View style={{
                                                    marginLeft: -16,
                                                    marginRight: -16,
                                                    borderRadius: 60,
                                                    borderWidth: 2,
                                                    borderColor: '#FFFFFF'
                                                }}>
                                                    <Icon name="check-circle" size={65} color={'#2EAF5F'}/>
                                                </View>
                                            </Card>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000000'}}>+ {this.state.extraDriveTime} min</Text>
                                        <Text style={{fontSize: 18, color: '#000000'}}>Extra reistijd</Text>
                                    </View>
                                    <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}>
                                        <TouchableOpacity onPress={this.declineRequest.bind(this)}>
                                            <Card style={{borderRadius: 50}}>
                                                <View style={{
                                                    marginLeft: -16,
                                                    marginRight: -16,
                                                    borderRadius: 60,
                                                    borderWidth: 2,
                                                    borderColor: '#FFFFFF'
                                                }}>
                                                    <Icon name="cancel" size={65} color={'#E20000'}/>
                                                </View>
                                            </Card>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 0.3}}/>
                                </View>
                            </ModalExtern>


                            <ModalExtern
                                animationType={"slide"}
                                transparent={true}
                                isVisible={this.state.acceptModal}
                                backdropOpacity={0.60}
                                onRequestClose={() => this.setState({acceptModal: false})}
                                style={styles.modal}
                            >
                                <Card style={{
                                    paddingLeft: -16,
                                    paddingRight: -16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 16
                                }}>
                                    <Text style={{color: '#6F0091', fontWeight: 'bold', fontSize: 18}}>{this.state.title}</Text>
                                    <Text style={{color: '#000000', fontSize: 15, paddingTop: 10}}> Met</Text>
                                    <View
                                        style={{paddingTop: 10, paddingBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{
                                            color: '#000000',
                                            fontWeight: 'bold',
                                            fontSize: 15,
                                            paddingTop: 5,
                                            paddingBottom: 10
                                        }}>{this.state.message}</Text>

                                    </View>
                                </Card>

                            </ModalExtern>

                        </View>
                    </View>
                )}
            </Image>
        )
    }
}


const styles = StyleSheet.create({
    backgroundImage:{
        flex: 1,
        width: null,
        height: null,
        zIndex: 1,
        position: 'relative'
    },
    contain: {
        flex: 1,
        alignItems: 'center',
    },
    main: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
    },
    box: {
        flex: 1,
        zIndex: 3,
        position: 'absolute',
        alignItems: 'center',
        top: 10
    },
    box2: {
        flex: 1,
        zIndex: 3,
        // height: 100,
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 23
    },
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        left: 0,
        top: 0,
        zIndex: 2,
    },
    map: {
        flex: 3,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width,
        height,
        alignSelf: 'stretch',
        position: 'relative',
        zIndex: 2
    },
    requestModal: {
        marginLeft: -16,
        marginRight: -16,
        marginBottom: -10
        // height: 160,
        // width: 325,
        // padding: 15,
        // justifyContent: 'center',
        // backgroundColor: 'white',
        // borderBottomRightRadius: 10,
        // borderTopRightRadius: 10,
        // borderTopLeftRadius: 10,
        // borderBottomLeftRadius: 10,
        // borderWidth: 1,
        // borderColor: '#998e88'
    },
});


AppRegistry.registerComponent('DriverPage', () => DriverPage);