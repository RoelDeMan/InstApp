'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Navigator,
    TouchableWithoutFeedback,
    Alert,LayoutAnimation, NativeModules, Easing, Animated
} from 'react-native';
// const functions = require('firebase-functions');

import firebaseApp from '../Firebase/Firebase.js';
;

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
import Geocoder from 'react-native-geocoder';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import { Button, Icon, Card } from 'react-native-material-design';
import TopBar from "../MainLayout/TopBar";
import HideableView from 'react-native-hideable-view';

// Geocoder.setApiKey('AIzaSyBUgSbt6n_EYI9RJRPDQTW5BLspjBW4M80');

const MapView = require('react-native-maps');
const markerImage = require('../../../images/icoooon_v2.png');
import Modal from 'react-native-modal';

import Navigation from '../Cars/Navigation';
import DriverLocationHandler from "../Location/DriverLocationHandler";
import BottomBar from "./BottomBar";
import renderIf from './renderif';
import DestinationInput from './DestinationInput';
// import {default as FCM, FCMEvent} from "react-native-fcm";
import FCM, {FCMEvent} from 'react-native-fcm';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";



class MapsPage extends Component {
    notificationListener;
    locationListener;
    bottomBar;
    topBar;
    va;

    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(0.3);
        this.state = {
            lat: 51.814390,
            long: 5.852026,
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
            coordsBetween: [],
            compValue: 2,
            userName: props.data,
            name: firebaseApp.auth().currentUser.displayName,
            routeTime: '',
            routeDistance: '',
            routeValue: 0,
            routeData: null,
            component: null,
            showDetail: false,
            pointer: null,
            driverLocation: null,
            driverArie: [{test: 'dit is een test'}],
            address: '',
            city: '',
            pic: '../../../images/pointer.png',
            borderW: 2,
            fadeAnim: new Animated.Value(0),
            status: false,
            whereToGo: 'Waar wil je heen?',
            stayClosed: false,
            driverID: '',
            navButton: false,
            distanceRoute: '',
            timeRoute: '',
            waitingForDriver: false,
            hideDestinationBar: false,
            arrowBar: false,
            timeStamp: null,
            strokeColor: '#8A5BB7',
            strokeColorBetween: '#AFAFAF',
            borderProfileRing: 'rgba(54, 0, 107, 0.3)',
            hoi: '',
            la: null,
            lo: null,
            laLoShow: false,
            driverTimeBox: false,
            drivername: 'Nog geen bestuurder',
            passengerInfo: false,
            driverAdressCity: 'Adres en stadsnaam',
            eenComma: '',
            eenPlus: '',
            carBrand: null,
            carColor: null,
            carLicense: null,
            haaklinks: null,
            haakrechts: null
        };
        this.topBar = this.props.main;
        Navigation.getNavigationData();
        this.openDestinationModal = this.openDestinationModal.bind(this);
        this.setAddressCity = this.setAddressCity.bind(this);
        this.getLatLng = this.getLatLng.bind(this);
        this.goTravel = this.goTravel.bind(this);
        this.testAuto = this.testAuto.bind(this);
        this.bottomBar= this.props.main;



    }


    componentWillMount() {
        LayoutAnimation.spring();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                    currentLat: position.coords.latitude,
                    currentLong: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({error: error.message}),
        );
        this.loadProfilePicture();
        this.locationListener = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    currentLat: position.coords.latitude,
                    currentLong: position.coords.longitude,
                    error: null,
                });
                let ltlng = {latitude: this.state.lat, longitude: this.state.long, destinationAdress: this.state.address, destinationCity: this.state.city};
                if(ltlng.destinationAdress !== ''){
                    this.getLatLng(ltlng);
                    if(this.state.coordsBetween.length !== 0){
                        this.getLatLngBetween(this.state.driverLat, this.state.driverLong);
                    }
                }
            },
            (error) => this.setState({error: error.message}));
    }
    currentPos(){
        LayoutAnimation.spring();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                    currentLat: position.coords.latitude,
                    currentLong: position.coords.longitude,
                    error: null,
                });

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
                let ltlng = {latitude: this.state.lat, longitude: this.state.long, destinationAdress: this.state.address, destinationCity: this.state.city};
                console.log('2222');
                console.log('heeft tweede gedaan');
                console.log('2222');
                if(this.state.destinationAdress !== ''){
                    this.getLatLng(ltlng);
                    if(this.state.coordsBetween.length !== 0){
                        this.getLatLngBetween(this.state.driverLat, this.state.driverLong);
                    }
                }
            },
            (error) => this.setState({error: error.message}));
    }
    getFullLocation() {
        return new Promise((resolve, error) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    Geocoder.geocodePosition({lat: position.coords.latitude, lng: position.coords.longitude})
                        .then(result => {
                            resolve(result[0]);
                        });
                },
                error => {
                    console.log(error);
                }
            );
        })
    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.locationListener);
    }

    checkGPS(){
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Uw locatie staat uit</h2>Laat reizigers weten waar u bent!<br/><br/>Zonder 'locatie' kunt u geen route uitzetten.",
            ok: "Ja",
            cancel: "Nee",
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
    getRouteData() {
        return this.state.routeData;
    }
    setAddressCity(address, city) {
        console.log('YYYYYYYYYYY');
        console.log(address);
        console.log(city);
        console.log('YYYYYYYYYYY');
        this.setState({address: address, city: city});
    }
    getAddressCity() {
        return {address: this.state.address, city: this.state.city};
    }
    getLatLng(latLng) {
        this.setState({
            lat: latLng.latitude, long: latLng.longitude, destinationAdress: latLng.destinationAdress, destinationCity: latLng.destinationCity,
                pointer:(
                    <MapView.Marker
                        title={latLng.destinationAdress+', '+latLng.destinationCity}
                        coordinate={{
                            longitude: latLng.longitude, latitude: latLng.latitude,
                            longitudeDelta: 0.0421, latitudeDelta: 0.0922
                        }} >
                                <View style={{width: 15, height: 15, borderColor: '#36006b', borderWidth: 3, borderRadius: 7, backgroundColor: '#FFFFFF'}}/>
                    </MapView.Marker>)

        }, () => {
            DriverLocationHandler.setDestination(this.state.lat, this.state.long);
            const mode = 'driving';
            let context = this;
            Navigation.getNavigationData(this.state.currentLat, this.state.currentLong, this.state.lat, this.state.long)

                .then((routeData) => {
                    context.setState({
                        routeDistance: Navigation.getNavigationDistance(routeData),
                        routeTime: Navigation.getNavigationDuration(routeData),
                        coords: Navigation.getNavigationPolyLine(routeData),
                        routeValue: 1,
                        routeData: routeData,
                    });
                    console.log('PPPPPPPP');
                    // console.log(routeData);
                    console.log('PPPPPPPP');
                    this.setNavBar();
                    // this.bottomBar.setTravelOptions();
                });
        });
    }
    getLatLngBetween(dLat, dLong){


        LayoutAnimation.spring();
        this.setState({driverLat: dLat, driverLong: dLong});
        let cLat = this.state.currentLat;
        let cLong = this.state.currentLong;
        let context = this;
        Navigation.getNavigationData(dLat, dLong, cLat, cLong)
            .then((routeData) => {
                context.setState({
                    routeDistanceBetween: Navigation.getNavigationDistance(routeData),
                    routeTimeBetween: Navigation.getNavigationDuration(routeData),
                    coordsBetween: Navigation.getNavigationPolyLine(routeData),
                });
            });

    }
    setDriverID(driverID){
        this.setState({driverID: driverID});
        firebaseApp.database()
            .ref(FirebaseKeys.USER_NODE)
            .child(driverID)
            .child(FirebaseKeys.USER.PICTURE)
            .once(FirebaseKeys.VALUE.ONCE)
            .then(picture => {
               if(picture.val()){
                   firebaseApp.storage()
                       .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                       .child(picture.val())
                       .getDownloadURL()
                       .then(url => {
                           this.setState({pic: {uri: url}});
                       })
               }
            });
    }

    testAuto(lat, long) {
        LayoutAnimation.spring();
        this.getLatLngBetween(lat, long);
        this.setState({
            driverLocation: (<MapView.Marker
                title={'Bestuurdersnaam!'}
                coordinate={{
                    longitude: long, latitude: lat,
                    longitudeDelta: 0.0421, latitudeDelta: 0.0922
                }}
                >
                <View style={{borderRadius: 60}}>
                    <View style={{widht: 30, height: 30, backgroundColor: 'red', position: 'absolute', zIndex:''}}>hoi</View>
                    {/*<Image style={{borderWidth: 4, borderColor: '#FFFFFF', width: 40, height: 40, borderRadius: 50, zIndex: 4, position: 'absolute'}}  source={markerImage}/>*/}
                </View>
            </MapView.Marker>)
        });
    }

    setDriverLocation(lat, long, driverName, pictureURL, carBrand, carColor, carLicense) {

        this.setState({eenComma: ',', eenPlus: '+'});

        console.log('driver Lat: '+ lat);
        console.log('driver Long: '+ long);
        console.log('driver: '+ driverName);
        console.log('carBrand: '+ carBrand);
        console.log('carColor: '+ carColor);
        console.log('carLicense: '+ carLicense);
        console.log(this.state.driverID);

        LayoutAnimation.spring();
        this.getLatLngBetween(lat, long);
        this.setState({
            carBrand: carBrand,
            carColor: carColor,
            carLicense: carLicense,
            dLat: lat,
            dlong: long,
            driverPic: pictureURL,
            drivername: driverName,
            haaklinks: '(',
            haakrechts: ')',
            driverTimeBox: true,
            driverLocation:
                (<MapView.Marker
                        title={driverName}
                        style={styles.markerPic}
                        image={markerImage}
                        coordinate={{
                            longitude: long, latitude: lat,
                            longitudeDelta: 0.0421, latitudeDelta: 0.0922
                        }} >

                    </MapView.Marker>)
                // (<MapView.Marker
                //     title={'werk gewoon eens mee kut!'}
                //     coordinate={{
                //         longitude: long, latitude: lat,
                //         longitudeDelta: 0.0421, latitudeDelta: 0.0922
                //     }}
                // >
                //     <View style={{width: 15, height: 15, borderColor: '#36006b', borderWidth: 3, borderRadius: 7, backgroundColor: '#FFFFFF'}}/>
                // </MapView.Marker>)

        });
        return new Promise((resolve, error) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    Geocoder.geocodePosition({lat: lat, lng: long})
                        .then(result => {
                            resolve(result[0]);
                            let dAdressCity = result[0].formattedAddress;
                            console.log(result[0]);
                            this.setState({driverAdressCity: dAdressCity, driverStreetName: result[0].streetName, driverStreetNumber: result[0].streetNumber, driverCityName: result[0].locality});
                        });
                },
                error => {
                    console.log(error);
                }
            );
        });
    }



    openDestinationModal(){
      this.topBar.onAddressPressed(this);
    }
    setNavBar(){
        LayoutAnimation.spring();
        this.setState({navButton: true});
    }
    goTravel(driverDeleted){
        LayoutAnimation.spring();
        if(driverDeleted === true){
            this.setState({navButton: false, waitingForDriver: true, hideDestinationBar: false, laLoShow: true});
        }else{
            this.setState({navButton: false, waitingForDriver: true, hideDestinationBar: true, laLoShow: true});
            this.setRouteInFirebase();
        }
        this.hideDestinationBar();
        this.destinationInput.disableDestinationInput();


    }
    hideDestinationBar(){
        LayoutAnimation.spring();
        setTimeout(() => {
            LayoutAnimation.spring();
            this.setState({hideDestinationBar: false, arrowBar: true});
        }, 4000);
    }
    clearDestination(driverDeleted){

        console.log('ZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGGGGGGGGGBEEE');
        LayoutAnimation.spring();
        this.setState({eenComma: '', eenPlus: '', arrowBar: false, waitingForDriver: false, driverTimeBox: false, passengerInfo: false});
        this.currentPos();
        if(driverDeleted === true){
            this.setState({coordsBetween: [], driverLocation: null, driverPic: null, routeTimeBetween: null, drivername: 'Nog geen bestuurder', driverStreetName: null, driverStreetNumber: null, driverCityName: null, carBrand: null, carColor: null, carLicense: null, haaklinks: null, haakrechts: null});
            this.goTravel(true);
            this.updateDestinationNodeFromFirebase();
            this.destinationInput.clearInputTextbox();
        }else{
            this.setState({pointer: null, coords: [], coordsBetween: [], driverLocation: null, driverPic: null, routeTimeBetween: null, drivername: 'Nog geen bestuurder', driverStreetName: null, driverStreetNumber: null, driverCityName: null, carBrand: null, carColor: null, carLicense: null, haaklinks: null, haakrechts: null});
            this.deleteDestinationNodeFromFirebase();
            console.log('hele node verwijderd');
        }
        this.destinationInput.enableDestinationInput();
    }

    clearDriverDestination(){
        console.log("cleardriverdestination");
        LayoutAnimation.spring();
        let time = this.state.timeStamp;
        let ref = firebaseApp.database().ref(FirebaseKeys.REQUEST_NODE); //root reference to your data
        this.setState({coordsBetween: [], driverLocation: null});
        ref.orderByChild('timestamp').equalTo(time)
            .once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                console.log("heelveelswagindezetag");
                console.log(childSnapshot.val());
                ref.child(childSnapshot.key).child('driveruid').remove();
                ref.child(childSnapshot.key).child('drivername').remove();
                ref.child(childSnapshot.key).update({'ready': 2});
                //remove each child
                //ref.child(childSnapshot.key).remove();
            });
        });
    }

    setRouteInFirebase() {
        console.log("setRouteInFirebase");
        let routeData = this.getRouteData();
        if (routeData) {
            let ref = firebaseApp.database()
                .ref(FirebaseKeys.REQUEST_NODE)
                .push();
                this.getFullLocation()
                .then(position => {
                    let updates = {};
                    updates[FirebaseKeys.REQUEST.TIMESTAMP] = new Date().getTime();
                    updates[FirebaseKeys.REQUEST.STATE] = FirebaseKeys.REQUEST.STATES.PASSENGERREQUESTED;
                    updates[FirebaseKeys.REQUEST.PASSENGER.UID] = firebaseApp.auth().currentUser.uid;
                    updates[FirebaseKeys.REQUEST.PASSENGER.NAME] = firebaseApp.auth().currentUser.displayName;
                    updates[FirebaseKeys.REQUEST.START.LAT] = parseFloat(this.state.currentLat);
                    updates[FirebaseKeys.REQUEST.START.LONG] = parseFloat(this.state.currentLong);
                    updates[FirebaseKeys.REQUEST.START.ADDRESS] = position.streetName + " " + position.streetNumber;
                    updates[FirebaseKeys.REQUEST.START.CITY] = position.locality;
                    updates[FirebaseKeys.REQUEST.DESTINATION.LAT] = routeData.routes[0].legs[0].end_location.lat;
                    updates[FirebaseKeys.REQUEST.DESTINATION.LONG] = routeData.routes[0].legs[0].end_location.lng;
                    updates[FirebaseKeys.REQUEST.DESTINATION.ADDRESS] = this.state.address;
                    updates[FirebaseKeys.REQUEST.DESTINATION.CITY] = this.state.city;
                    ref.set(updates)
                        .then(() => {
                            console.log('set uitgevoerd');
                            console.log('een nummer(ready state): ' + FirebaseKeys.REQUEST.STATES.PASSENGERREQUESTED);
                        })
                        .catch(error => {
                            console.log("error: " , error);
                        });
                        this.setState({timeStamp: updates.timestamp })

                });
        }
    }



    updateDestinationNodeFromFirebase(){
        let time = this.state.timeStamp;
        let ref = firebaseApp.database().ref(FirebaseKeys.REQUEST_NODE); //root reference to your data
        ref.orderByChild('timestamp').equalTo(time)
            .once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                let currentRequestNode = childSnapshot.key;
                console.log("blahahahaha");
                console.log(currentRequestNode);
                console.log(time);
                console.log("blahahahaha");
                let updates = {};
                updates['/ready/'] = 1;
                updates['/timestamp/'] = new Date().getTime();
                firebaseApp.database().ref('requests/'+currentRequestNode).update(updates);
                firebaseApp.database().ref('requests/'+currentRequestNode).child('drivername').remove();
                firebaseApp.database().ref('requests/'+currentRequestNode).child('driveruid').remove();

            });
        });
    }

    deleteDestinationNodeFromFirebase(){
        let time = this.state.timeStamp;
        let ref = firebaseApp.database().ref(FirebaseKeys.REQUEST_NODE); //root reference to your data
        ref.orderByChild('timestamp').equalTo(time)
            .once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                firebaseApp.database().ref("requests/"+childSnapshot.key).remove();
            });
        });
    }
    deleteDestionation() {
        Alert.alert(
            'Bestemming intrekken?',
            "Weet u zeker dat u uw geplaatste bestemming wilt intrekken?",
            [
                {text: 'Nee', style: 'Cancel', onPress: () => console.log("not deleted")},
                {text: 'Ja', onPress: () => this.clearDestination()}
            ],
            {cancelable: true}
        )
    }

    openPassengerInfo(value){
        LayoutAnimation.spring();
            if(value === true){
                this.setState({arrowBar: false});
                this.setState({passengerInfo: true});
                console.log('====');
                console.log(value);
                console.log('====');
            }else{
                this.setState({arrowBar: true});
                this.setState({passengerInfo: false, driverTimeBox: true});
            }
    }


    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{opacity: 0, height: 0, width: 0}}
                    source={markerImage}
                />
                <DestinationInput get={this.getLatLng} set={this.setAddressCity} ref={(ref) => this.destinationInput = ref} />

                <MapView
                        style={styles.map}
                        region={{
                            longitude: this.state.long, latitude: this.state.lat,
                            latitudeDelta: 0.1, longitudeDelta: 0.1
                        }}>

                    <View>{this.state.pointer}</View>
                    {this.state.driverLocation}


                        <MapView.Marker
                            coordinate={{
                                longitude: this.state.currentLong, latitude: this.state.currentLat,
                                latitudeDelta: 0.1, longitudeDelta: 0.1
                            }} title={'U'}>
                            <View style={{}}>
                                <View style={{borderWidth: 12, borderRadius: 60, borderColor: this.state.borderProfileRing}}>
                                    <Image style={{borderWidth: 4, borderColor: '#FFFFFF', width: 50, height: 50, borderRadius: 50}} source={this.state.profilePicture}/>
                                </View>
                            </View>
                        </MapView.Marker>

                                <MapView.Polyline
                                    coordinates={this.state.coords}
                                    strokeWidth={6}
                                    strokeColor={this.state.strokeColor}
                                    fillColor={this.state.strokeColor}/>
                        <MapView.Polyline
                            coordinates={this.state.coordsBetween}
                            lineDashPhase={4}
                            strokeWidth={6}
                            strokeColor={this.state.strokeColor}
                            fillColor={this.state.strokeColor}/>

                    </MapView>
                        {renderIf(this.state.navButton)(
                         <View  style={{flex: 8, zIndex: 4, position: 'absolute', bottom: 50}}>
                             <View style={{marginBottom: -8}}>
                                 <Card style={{backgroundColor: '#FFFFFF', alignSelf: 'stretch'}}>
                                     <Card.Body>
                                         <View>
                                             <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                                 <View style={{flex: 1, alignSelf:  'flex-start'}}>
                                                     <Text style={{color: '#6F0091'}}>Reistijd: </Text>
                                                 </View>
                                                 <View style={{flex: 0.5}} />
                                                 <View style={{alignSelf:  'flex-end'}}>
                                                     <Text style={{color: '#D3D3D3'}}>{this.state.routeTime}</Text>
                                                 </View>
                                             </View>
                                             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                                 <View style={{alignSelf: 'flex-start'}}>
                                                     <Text style={{color: '#6F0091'}}>Afstand in km's: </Text>
                                                 </View>
                                                 <View style={{flex: 0.5}} />
                                                 <View style={{alignSelf:  'flex-end'}}>
                                                     <Text style={{color: '#D3D3D3'}}>{this.state.routeDistance}</Text>
                                                 </View>
                                             </View>
                                         </View>
                                     </Card.Body>
                                 </Card>
                            </View>
                             <View style={{padding: 10}}>

                                 <TouchableHighlight onPress={() => this.goTravel()} style={{backgroundColor: '#6F0091', height: 40, width: 200, justifyContent: 'center', alignItems: 'center', borderRadius: 2, borderWidth: 1, borderColor: '#6F0091'}}>
                                     <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                         <Text style={{color: '#FFFFFF'}}>Bestemming indienen</Text>
                                     </View>
                                 </TouchableHighlight>
                             </View>
                        </View>
                        )}



                            {renderIf(this.state.waitingForDriver)(
                                <View style={{flex: 8, zIndex: 4, position: 'absolute', bottom: 50}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        {renderIf(this.state.arrowBar)(
                                                <View style={{marginBottom: -8, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                                    <Card style={{backgroundColor: '#FFFFFF', alignSelf: 'stretch'}}>
                                                        <Card.Body>
                                                            <View>
                                                                <TouchableOpacity onPress={() => this.openPassengerInfo(true)}>
                                                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                                                    <View style={{flex: 1, alignSelf:  'flex-start'}}>
                                                                        <Text style={{color: '#6F0091'}}>Reistijd: </Text>
                                                                    </View>
                                                                    <View style={{flex: 0.5}} />
                                                                    <View style={{alignSelf:  'flex-end'}}>
                                                                        <Text style={{color: '#D3D3D3'}}>{this.state.routeTime}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                                                    <View style={{alignSelf: 'flex-start'}}>
                                                                        <Text style={{color: '#6F0091'}}>Afstand in km's: </Text>
                                                                    </View>
                                                                    <View style={{flex: 0.5}} />
                                                                    <View style={{alignSelf:  'flex-end'}}>
                                                                        <Text style={{color: '#D3D3D3'}}>{this.state.routeDistance}</Text>
                                                                    </View>
                                                                </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </Card.Body>
                                                    </Card>
                                                    {renderIf(this.state.driverTimeBox)(
                                                    <Card style={{backgroundColor: '#FFFFFF', alignSelf: 'stretch', marginTop: 0}}>
                                                        <Card.Body>
                                                            <View>
                                                                <TouchableOpacity onPress={() => this.openPassengerInfo(true)}>
                                                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                                        <Text style={{color: '#6F0091'}}>Bekijk bestuurder gegevens</Text>
                                                                    </View>
                                                                </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </Card.Body>
                                                    </Card>
                                                    )}
                                                </View>
                                        )}
                                        {renderIf(this.state.passengerInfo)(
                                        <View>
                                            <TouchableOpacity onPress={() => this.openPassengerInfo(false)}>
                                            <Card style={{backgroundColor: '#FFFFFF', alignSelf: 'stretch'}}>
                                                <View style={{justifyContent: 'center', alignItems: 'center', padding: 16}}>
                                                    <Image source={this.state.driverPic} style={{height: 100, width: 100, borderRadius: 50 }}/>
                                                    <Text  style={{color: '#000000', fontSize: 18, fontWeight: 'bold', marginTop: 5, marginBottom: 5}}>{this.state.drivername}</Text>
                                                    <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 6}}>
                                                        <Text style={{justifyContent: 'center', alignItems: 'center', color: '#6F0091'}}>{this.state.carBrand} {this.state.haaklinks}{this.state.carColor}{this.state.haakrechts}</Text>
                                                        <Text style={{justifyContent: 'center', alignItems: 'center', color: '#6F0091'}}>{this.state.carLicense}</Text>
                                                    </View>
                                                        <Text style={{color: '#6F0091'}}>{this.state.eenPlus} {this.state.routeTimeBetween}</Text>
                                                        <Text style={{color: '#6F0091'}}>{this.state.driverStreetName} {this.state.driverStreetNumber}{this.state.eenComma} {this.state.driverCityName}</Text>
                                                </View>
                                            </Card>
                                            </TouchableOpacity>
                                        </View>
                                        )}
                                        {renderIf(this.state.hideDestinationBar)(
                                            <View style={{marginBottom: -8, justifyContent: 'center', alignItems: 'center'}}>
                                                <Card style={{backgroundColor: '#FFFFFF', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                                                    <Card.Body>
                                                        <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 15}}>
                                                            <Text style={{color: '#6F0091', fontWeight: 'bold', fontSize: 18}}>Uw bestemming is verzonden!</Text>
                                                        </View>
                                                        <View style={{justifyContent: 'center', alignItems: 'center', paddingLeft: 5, paddingRight: 5}}>
                                                            <Text style={{color: '#D3D3D3', fontSize: 13}}>De app is voor u op zoek naar een bestuurder... </Text>
                                                        </View>
                                                    </Card.Body>
                                                </Card>
                                            </View>
                                        )}
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{padding: 10}}>
                                                <TouchableHighlight onPress={() => this.deleteDestionation()} style={{backgroundColor: '#6F0091', height: 40, width: 200, justifyContent: 'center', alignItems: 'center', borderRadius: 2, borderWidth: 1, borderColor: '#6F0091'}}>
                                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{color: '#FFFFFF'}}>Bestemming intrekken</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                    </View>
                                    </View>
                                </View>
                            )}


                <HideableView removeWhenHidden={true} visible={false}>
                    <BottomBar main={this.props.main} pic={this.props.passengerPicture} mapsPage={this} style={styles.bottomBar} ref={(ref) => {
                        this.bottomBar = ref;
                        this.props.main.setBottomBar(ref);
                    }
                    }/>
                </HideableView>
                {/*<Modal isVisible={this.state.passengerInfo}*/}
                       {/*onRequestClose={() => this.setState({passengerInfo: false})}*/}
                       {/*backdropOpacity={0.30}>*/}
                    {/*<Card style={{backgroundColor: '#FFFFFF', alignSelf: 'stretch', height: 50}}>*/}
                        {/*<View style={{justifyContent: 'center', alignItems: 'center'}}>*/}
                            {/*<Image source={this.state.driverPic} style={{height: 100, width: 100, borderRadius: 50 }}/>*/}
                            {/*<Text>{this.state.drivername}</Text>*/}
                        {/*</View>*/}
                    {/*</Card>*/}
                {/*</Modal>*/}


            </View>
        );
    }
}

{/*<Card style={{backgroundColor: '#FFFFFF', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>*/}
    {/*<Card.Body>*/}
        {/*<View style={{justifyContent: 'center', alignItems: 'center'}}>*/}
            {/*<Text style={{color: '#6F0091', fontWeight: 'bold', fontSize: 15}}>Bestemming verzonden!</Text>*/}
        {/*</View>*/}
    {/*</Card.Body>*/}
{/*</Card>*/}
const styles = StyleSheet.create({
    bottomBar: {
        height: 100
    },
    container: {
        position: 'relative',
        // justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        zIndex: 1,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        width: 300,
        alignItems: 'center'
    },
    headerText: {
        height: 50,
        marginTop: 5,
        fontSize: 25,
        alignItems: 'flex-start',
    },
    headerText2: {
        marginLeft: 50,
        height: 50,
        marginTop: 20,
        fontSize: 15,
        alignItems: 'flex-end',
    },
    submitBox: {
        width: 270,
        height: 80,
        marginTop: 400,
        marginBottom: 70,
        alignItems: 'center'
    },
    map: {
        flex: 9,
        alignSelf: 'stretch',
        position: 'relative',
        zIndex: 2
    },
    markerPic: {
        width: 5,
        height: 5,
    }
});

module.exports = MapsPage;
