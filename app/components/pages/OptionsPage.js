import React, {Component} from 'react';
import {
    AppRegistry, Image, ScrollView,
    StyleSheet,
    Text, TouchableHighlight,
    View,
    Modal, TextInput, TouchableOpacity,
    Platform, ListView, Alert, LayoutAnimation, NativeModules, AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressImage from 'react-native-image-progress';
import ProgressImageBar from 'react-native-progress/Bar';
import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import RNFetchBlob from 'react-native-fetch-blob'
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Geocoder from 'react-native-geocoder';
import EditHeaderBar from "../UI/EditHeaderBar";
import HeaderBar from "../UI/HeaderBar";
import LocationProvider from "../Location/LocationProvider";
import CarManager from "../Cars/CarManager";
import Styles from '../../styles/styles';
import {Card, Button} from 'react-native-material-design';
import CheckBox from 'react-native-checkbox-heaven';
import MDIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNMColorPicker from "../ColorPicker/RNMColorPicker";
import ModalExtern from 'react-native-modal';

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

export default class OptionsPage extends Component {
    newLocationPlaceholder = "Bestemmingsadres";
    currentLocationText = "Huidige locatie";
    addLocationGoogleAutocomplete;

    DISABLE_TOUCH = 'none';
    ENABLE_TOUCH = 'auto';
    DISABLED_COLOR = '#D3D3D3';

    ACCENT_COLOR = '#4A0091';
    LICENSE_TEXT_COLOR = '#2C2C2C';

    editCarColorPicker;


    colours = [
        {colour: 'Donkerblauw', hex: '#3F578C'},
        {colour: 'Rood', hex: '#FF0000'},
        {colour: 'Wit', hex: '#FFFFFF'},
        {colour: 'Lichtblauw', hex: '#2FA9E4'},
        {colour: 'Zwart', hex: '#000000'},
        {colour: 'Grijs', hex: '#D3D3D3'},
        {colour: 'Groen', hex: '#217F4E'},
        {colour: 'Oranje', hex: '#F37047'},
        {colour: 'Donkergrijs', hex: '#636363'},
        {colour: 'Paars', hex: '#B91E4C'},
        {colour: 'Geel', hex: '#F5C84E'},
        {colour: 'Roze', hex: '#FF3399'}
    ];


    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            username: '',
            cellphone: '',
            email: '',
            editProfileModal: false,
            addLocationModal: false,
            newLocationName: '',
            newAddress: '',
            newCity: '',
            newlat: '',
            newLong: '',
            locationsDataSource: ds,
            editLocationModal: false,
            editLocationRef: null,
            editLocationName: '',
            editLocationAddress: '',
            editLocationCity: '',
            editLocationLat: '',
            editLocationLong: '',
            carsDataSource: ds,
            newCarModal: false,
            newCarLicense: '',
            newCarName: '',
            newCarBrand: '',
            newCarColour: '',
            editCarModal: false,
            editCarLicense: '',
            editCarName: '',
            editCarBrand: '',
            editCarColour: '',
            editCarRef: '',
            editCarHex: '',
            borderColor: '#D3D3D3',
            lastName: '',
            firstName: '',
            carChecked: false,
            pointerEvents: this.DISABLE_TOUCH,
            carColor: this.colours[0].hex,
            carColorText: this.colours[0].colour,
            carDisplayColor: this.DISABLED_COLOR,
            carDisplayColorText: '',
            licenseHeaderColor: this.DISABLED_COLOR,
            licenseTextColor: this.DISABLED_COLOR,
            carButtonColor: this.DISABLED_COLOR,
            licenseText: '',
            colorModal: false,
            newFirstName: '',
            newLastName: ''
        };
    }

    componentWillMount() {
        this.updateInfo();
        this.fetchLocationsData();
        this.fetchCarsData();
        this.onCheckPressed(true);
    }

    updateInfo() {
        let uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database()
            .ref(FirebaseKeys.USER_NODE)
            .child(uid)
            .once(FirebaseKeys.VALUE.ONCE)
            .then((snapshot) => {
                let name = snapshot.child(FirebaseKeys.USER.NAME).val();
                let cellphone = snapshot.child(FirebaseKeys.USER.PHONE).val();
                let email = snapshot.child(FirebaseKeys.USER.EMAIL).val();
                let picture = snapshot.child(FirebaseKeys.USER.PICTURE).val();
                let place = snapshot.child(FirebaseKeys.USER.PLACE).val();
                if (name === null || name === '') {
                    let getName = firebaseApp.auth().currentUser.displayName;
                    let splitName = getName.split(" ");
                    let firstName = splitName.splice(0, 1);
                    let lastName = splitName.join(' ');
                    this.setState({firstName: firstName, lastName: lastName, newFirstName: firstName, newLastName: lastName});
                    if (picture !== null) {
                        firebaseApp.storage()
                            .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                            .child(picture)
                            .getDownloadURL().then((url) => {
                            this.setState({profilePicture: url});
                        });
                    } else {
                        this.setState({profilePicture: '../../../images/initialProfile.jpg'});
                    }
                } else {
                    let splitName = name.split(" ");
                    let firstName = splitName.splice(0, 1);
                    let lastName = splitName.join(' ');
                    this.setState({firstName: firstName, lastName: lastName, newFirstName: firstName, newLastName: lastName});
                    if (picture !== null) {
                        firebaseApp.storage()
                            .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                            .child(picture)
                            .getDownloadURL().then((url) => {
                            this.setState({profilePicture: url});
                        });
                    } else {
                        this.setState({profilePicture: '../../../images/initialProfile.jpg'});
                    }
                }
                let firstNamee = this.state.firstName[0];
                let newFirstNamee = this.state.newFirstName;
                let lastNamee = this.state.lastName;
                let newLastNamee = this.state.newLastName;
                console.log('firstName: ' + firstNamee);
                console.log('newFirstName: ' + newFirstNamee);
                console.log('lastName: ' + lastNamee);
                console.log('ewLastName: ' + newLastNamee);
                this.setState({
                    cellphone: cellphone,
                    email: email,
                    place: place,
                    newUsername: '',
                    newCellphone: '',
                    newEmail: '',
                    newPlace: '',
                    newProfilePicture: '',
                    newImage: null,

                });
                console.log('++++++');
                console.log(this.state.username);
                console.log('++++++');
            });
    }

    openEditProfileModal() {
        this.setState({
            newUsername: this.state.username,
            newCellphone: this.state.cellphone,
            newEmail: this.state.email,
            newProfilePicture: this.state.profilePicture,
            newPlace: this.state.place,
            editProfileModal: true,
        });

    }

    saveProfile() {
        let firstNamee = this.state.firstName;
        let newFirstNamee = this.state.newFirstName;
        let lastNamee = this.state.lastName;
        let newLastNamee = this.state.newLastName;
        console.log('firstName: ' + firstNamee);
        console.log('newFirstName: ' + newFirstNamee);
        console.log('lastName: ' + lastNamee);
        console.log('newLastName: ' + newLastNamee);
            if(newFirstNamee === '' && newLastNamee === '') {
                console.log('zijn beide leeg');
                this.setState({editProfileModal: false});
            }else if(newLastNamee !== lastNamee && newFirstNamee !== firstNamee) {
                if (newLastNamee === '' || newFirstNamee === '') {
                    this.setState({editProfileModal: false});
                } else {
                    console.log('naam wordt niet aangepast achternaam wel');
                    let firstName = this.state.newFirstName;
                    let lastName = this.state.newLastName;
                    let newName = firstName + ' ' + lastName;
                    let uid = firebaseApp.auth().currentUser.uid;
                    let updates = {};
                    firebaseApp.auth().currentUser.updateProfile({displayName: newName});
                    updates[FirebaseKeys.USER.NAME] = newName;
                    updates[FirebaseKeys.USER.PHONE] = this.state.newCellphone;
                    updates[FirebaseKeys.USER.EMAIL] = this.state.newEmail;
                    updates[FirebaseKeys.USER.PLACE] = this.state.newPlace;
                    firebaseApp.database()
                        .ref(FirebaseKeys.USER_NODE)
                        .child(uid)
                        .update(updates)
                        .then(() => {
                            this.updateInfo();
                            this.setState({
                                editProfileModal: false,
                                newLastName: this.state.newLastName,
                                newFirstName: this.state.newFirstName,
                                lastName: this.state.newLastName,
                                firstName: this.state.newFirstName
                            });
                            this.props.mainLayout.updateDrawerViewName();
                        });
                }
            }else if(newFirstNamee !== firstNamee){
                if(newFirstNamee === ''){
                    console.log('alleen naam is leeg');
                    this.setState({editProfileModal: false});
                }else{
                    console.log('naam wordt aangepast achternaam niet');
                    let firstName = this.state.newFirstName;
                    let lastName = this.state.lastName;
                    let newName = firstName + ' ' + lastName;
                    let uid = firebaseApp.auth().currentUser.uid;
                    let updates = {};
                    firebaseApp.auth().currentUser.updateProfile({displayName: newName});
                    updates[FirebaseKeys.USER.NAME] = newName;
                    updates[FirebaseKeys.USER.PHONE] = this.state.newCellphone;
                    updates[FirebaseKeys.USER.EMAIL] = this.state.newEmail;
                    updates[FirebaseKeys.USER.PLACE] = this.state.newPlace;
                    firebaseApp.database()
                        .ref(FirebaseKeys.USER_NODE)
                        .child(uid)
                        .update(updates)
                        .then(() => {
                            this.updateInfo();
                            this.setState({editProfileModal: false, firstName: this.state.newFirstName, newFirstName: this.state.newFirstName, lastName: this.state.lastName});
                            this.props.mainLayout.updateDrawerViewName();
                        });
                }
            }else if(newLastNamee !== lastNamee) {
                if (newLastNamee === '') {
                    this.setState({editProfileModal: false});
                } else {
                    console.log('naam wordt niet aangepast achternaam wel');
                    let firstName = this.state.firstName;
                    let lastName = this.state.newLastName;
                    let newName = firstName + ' ' + lastName;
                    let uid = firebaseApp.auth().currentUser.uid;
                    let updates = {};
                    firebaseApp.auth().currentUser.updateProfile({displayName: newName});
                    updates[FirebaseKeys.USER.NAME] = newName;
                    updates[FirebaseKeys.USER.PHONE] = this.state.newCellphone;
                    updates[FirebaseKeys.USER.EMAIL] = this.state.newEmail;
                    updates[FirebaseKeys.USER.PLACE] = this.state.newPlace;
                    firebaseApp.database()
                        .ref(FirebaseKeys.USER_NODE)
                        .child(uid)
                        .update(updates)
                        .then(() => {
                            this.updateInfo();
                            this.setState({
                                editProfileModal: false,
                                newLastName: this.state.newLastName,
                                lastName: this.state.newLastName,
                                firstName: this.state.firstName
                            });
                            this.props.mainLayout.updateDrawerViewName();
                        });
                    }
                }else{
                console.log('alles is het zelfde');
            }
        }


    savePersonalData() {

        let first = this.state.firstName;
        let last = this.state.lastName;


        let uid = firebaseApp.auth().currentUser.uid;
        let updates = {};
        updates[FirebaseKeys.USER.NAME] = this.state.newUsername;
        updates[FirebaseKeys.USER.PHONE] = this.state.newCellphone;
        firebaseApp.database()
            .ref(FirebaseKeys.USER_NODE)
            .child(uid)
            .update(updates)
            .then(() => {
                this.updateInfo();
                this.setState({editProfileModal: false});
            });
    }

    openImagePicker() {
        ImagePicker.openPicker({
            width: 100,
            height: 100,
            cropping: true,
            includeBase64: true,
        }).then((image) => {
            this.setState({
                profilePicture: image.path,
            });
            ref = firebaseApp.database()
                .ref(FirebaseKeys.UPLOADS_NODE)
                .push();
            ref.set({
                user: firebaseApp.auth().currentUser.uid,
                type: FirebaseKeys.UPLOADS.TYPES.PROFILE_PICTURE,
                time: new Date().getTime()
            });
            key = ref.key;
            uploadUri = Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path;
            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    Blob.build(data, {type: 'application/octet-stream;BASE64'})
                        .then((blob) => {
                            console.debug(blob);
                            firebaseApp.storage()
                                .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                                .child(key)
                                .put(blob, {contentType: 'application/octet-stream'})
                                .on('state_changed', snapshot => {
                                    //Current upload state
                                }, err => {
                                    console.log(err);
                                }, uploadedFile => {
                                    updates = {};
                                    updates[FirebaseKeys.USER.PICTURE] = key;
                                    uid = firebaseApp.auth().currentUser.uid;
                                    firebaseApp.database()
                                        .ref(FirebaseKeys.USER_NODE)
                                        .child(uid)
                                        .update(updates);
                                    console.log('=======');
                                    console.log(updates.picture);
                                    console.log('=======');
                                    AsyncStorage.setItem("storeProfilePicture", 'boe ik ben roel');

                                    this.props.mainLayout.updateProfilePicture();
                                });


                        });
                });
        });
    }

    openNewLocationModal() {
        this.setState({
            newLocationName: '',
            newAddress: '',
            newCity: '',
            newlat: '',
            newLong: '',
            addLocationModal: true,
        });
        if (this.addLocationGoogleAutocomplete !== null) {
            //this.addLocationGoogleAutocomplete.setAddressText(this.newLocationPlaceholder);
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
            newlat: lat,
            newLong: long,
        });
        console.log(this.state);
    }

    onSaveNewLocation() {
        if (this.addLocationGoogleAutocomplete.getAddressText() === this.currentLocationText && this.state.newLocationName !== '') {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    Geocoder.geocodePosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }).then((result) => {
                        streetName = result.streetName;
                        streetNumber = result.streetNumber;
                        city = result.locality;
                        this.addNewLocation(this.state.newLocationName, streetName + " " + streetNumber, city, position.coords.latitude, position.coords.longitude);
                    });
                }
            );
        } else {
            name = this.state.newLocationName;
            address = this.state.newAddress;
            city = this.state.newCity;
            lat = this.state.newlat;
            long = this.state.newLong;
            console.log(name + " / " + address + " / " + city + " / " + lat + " / " + long);
            if (name !== '' && address !== '' && city !== '' && lat !== '' && long !== '') {
                this.addNewLocation(name, address, city, lat, long);
            }
        }
    }

    addNewLocation(name, address, city, lat, long) {
        uid = firebaseApp.auth().currentUser.uid;
        updates = {};
        updates[FirebaseKeys.LOCATIONS.NAME] = name;
        updates[FirebaseKeys.LOCATIONS.ADDRESS] = address;
        updates[FirebaseKeys.LOCATIONS.CITY] = city;
        updates[FirebaseKeys.LOCATIONS.LAT] = lat;
        updates[FirebaseKeys.LOCATIONS.LONG] = long;
        firebaseApp.database()
            .ref(FirebaseKeys.LOCATIONS_NODE)
            .child(uid)
            .push()
            .set(updates)
            .then(() => {
                this.setState({addLocationModal: false});
                this.fetchLocationsData();
            });
    }

    renderLocationRow(location, sectionId, rowId, highlightRow) {
        return (
            <View style={styles.importanLocationContainer}>
                <Text style={styles.importantLocationText}>{location.name}</Text>
                <View style={{justifyContent: 'center'}}>
                    <TouchableHighlight onPress={() => {
                        this.editLocation(location);
                    }}>
                        <Icon style={styles.editLocationOption} name="mode-edit"/>
                    </TouchableHighlight>
                </View>
                <View style={{justifyContent: 'center'}}>
                    <TouchableHighlight onPress={() => {
                        this.deleteLocationAlert(location);
                    }}>
                        <Icon style={styles.deleteLocationOption} name="delete"/>
                    </TouchableHighlight>
                </View>
            </View>);
    }

    editLocation(location) {
        this.setState({
            editLocationModal: true,
            editLocationRef: location.ref,
            editLocationName: location.name,
            editLocationAddress: location.address,
            editLocationCity: location.city,
            editLocationLat: location.lat,
            editLocationLong: location.long,
        });
    }

    onEditLocationPressed(data, details) {
        address = data.structured_formatting.main_text;
        city = data.structured_formatting.secondary_text;
        lat = details.geometry.location.lat;
        long = details.geometry.location.lng;
        this.setState({
            editLocationAddress: address,
            editLocationCity: city,
            editLocationLat: lat,
            editLocationLong: long,
        });
    }

    saveEditLocation() {
        uid = firebaseApp.auth().currentUser.uid;
        updates = {};
        updates[FirebaseKeys.LOCATIONS.NAME] = this.state.editLocationName;
        updates[FirebaseKeys.LOCATIONS.ADDRESS] = this.state.editLocationAddress;
        updates[FirebaseKeys.LOCATIONS.CITY] = this.state.editLocationCity;
        updates[FirebaseKeys.LOCATIONS.LAT] = this.state.editLocationLat;
        updates[FirebaseKeys.LOCATIONS.LONG] = this.state.editLocationLong;
        firebaseApp.database()
            .ref(FirebaseKeys.LOCATIONS_NODE)
            .child(uid)
            .child(this.state.editLocationRef)
            .update(updates)
            .then(() => {
                this.setState({editLocationModal: false});
                this.fetchLocationsData();
            });
    }

    deleteLocationAlert(location) {
        Alert.alert(
            'Bestemming verwijderen?',
            "Weet u zeker dat u '" + location.name + "' wilt verwijderen?",
            [
                {text: 'Nee', style: 'Cancel', onPress: () => console.log("not deleted")},
                {text: 'Ja', onPress: () => this.deleteLocation(location.ref)}
            ],
            {cancelable: true}
        )

    }

    deleteLocation(ref) {
        uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database()
            .ref(FirebaseKeys.LOCATIONS_NODE)
            .child(uid)
            .child(ref)
            .remove()
            .then((() => {
                this.fetchLocationsData();
            }));
    }

    fetchLocationsData() {
        uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database().ref(FirebaseKeys.LOCATIONS_NODE)
            .child(uid)
            .once(FirebaseKeys.VALUE.ONCE)
            .then((snapshot) => {
                items = [];
                snapshot.forEach((location) => {
                    name = location.child(FirebaseKeys.LOCATIONS.NAME).val();
                    address = location.child(FirebaseKeys.LOCATIONS.ADDRESS).val();
                    city = location.child(FirebaseKeys.LOCATIONS.CITY).val();
                    lat = location.child(FirebaseKeys.LOCATIONS.LAT).val();
                    long = location.child(FirebaseKeys.LOCATIONS.LONG).val();
                    key = location.key;
                    items.push({name: name, address: address, city: city, lat: lat, long: long, ref: key});
                });
                this.setState({locationsDataSource: this.state.locationsDataSource.cloneWithRows(items)});
            });
    }

    onCurrentLocation() {
        LocationProvider.getFullLocation()
            .then(result => {
                //this.addNewLocation(this.state.newLocationName,result.streetName + ' ' + result.streetNumber, result.locality,result.position.lat, result.position.lng);
                console.log(result);
                this.setState({
                    newAddress: result.streetName + ' ' + result.streetNumber,
                    newCity: result.locality,
                    newlat: result.position.lat,
                    newLong: result.position.lng,
                }, () => {
                    this.addLocationGoogleAutocomplete.setAddressText(this.state.newAddress + ', ' + this.state.newCity);
                });
            });
    }

    openNewCarModal() {
        this.setState({
            newCarLicense: '',
            newCarName: '',
            newCarBrand: '',
            newCarColour: '',
            newCarModal: true,
        });
    }

    saveNewCar() {
        CarManager.addCar(this.state.newCarName,
            this.state.newCarBrand,
            this.state.newCarColour,
            this.state.newCarLicense)
            .then(() => {
                this.setState({newCarModal: false});
                this.fetchCarsData();
            })
            .catch(() => {
                console.log("error adding car");
            });
    }

    renderCarRow(car, sectionId, rowId, highlightRow) {
        return (
            <View style={styles.importanLocationContainer}>
                <Text style={styles.importantLocationText}>{car.name}</Text>
                <View style={{justifyContent: 'center'}}>
                    <TouchableHighlight onPress={() => {
                        this.editCar(car);
                    }}>
                        <Icon style={styles.editLocationOption} name="mode-edit"/>
                    </TouchableHighlight>
                </View>
                <View style={{justifyContent: 'center'}}>
                    <TouchableHighlight onPress={() => {
                        this.deleteCarAlert(car);
                    }}>
                        <Icon style={styles.deleteLocationOption} name="delete"/>
                    </TouchableHighlight>
                </View>
            </View>);
    }

    editCar(car) {
        if (this.editCarColorPicker) {
            console.log(car.colour);
            this.editCarColorPicker.setSelectedColor(car.colour);
        }
        hexColour = this.getHexColor(car.colour);
        this.setState({
            editCarRef: car.ref,
            editCarName: car.name,
            editCarBrand: car.brand,
            editCarColour: car.colour,
            editCarLicense: car.license,
            editCarModal: true,
            editCarHex: hexColour,
            carDisplayColor: hexColour,
        });
    }

    saveEditCar() {
        console.log(this.state.editCarColour);
        CarManager.editCar(this.state.editCarRef, this.state.editCarName, this.state.editCarBrand, this.state.editCarColour, this.state.editCarLicense)
            .then(() => {
                this.setState({
                    editCarModal: false,
                });
                this.fetchCarsData();
            });
    }

    deleteCarAlert(car) {
        Alert.alert(
            'Auto verwijderen',
            "Weet u zeker dat u '" + car.name + "' wilt verwijderen?",
            [
                {text: 'Nee', style: 'Cancel', onPress: () => console.log("not deleted")},
                {text: 'Ja', onPress: () => this.deleteCar(car.ref)}
            ],
            {cancelable: true}
        )

    }

    deleteCar(ref) {
        CarManager.deleteCar(ref)
            .then(() => {
                this.fetchCarsData();
            });
    }

    fetchCarsData() {
        CarManager.getCars()
            .then(cars => {
                this.setState({carsDataSource: this.state.carsDataSource.cloneWithRows(cars)});
                console.log("{{{{{{{{{{{[");
                console.log(cars);
                console.log("{{{{{{{{{{{[");
            });

    }

    changeBorderColor(boolean) {
        LayoutAnimation.spring();
        if (boolean === true) {
            this.setState({borderColor: '#36006b'});
        } else {
            this.setState({borderColor: 'gray'});
        }
    }

    saveProfileNewData() {
        console.log(this.state.firstName + '' + this.state.lastName);
        console.log(this.state.newUsername + 'hooooi');
        console.log(this.state.newCellphone + 'hooooi');

    }

    goToRegTwo() {
        this.props.navigator.pop();
    }

    onCheckPressed(checked) {
        let pointerEvents = checked ? this.ENABLE_TOUCH : this.DISABLE_TOUCH;
        let carDisplayColor = checked ? this.state.carColor : this.DISABLED_COLOR;
        let licenseHeaderColor = checked ? this.ACCENT_COLOR : this.DISABLED_COLOR;
        let licenseTextColor = checked ? this.LICENSE_TEXT_COLOR : this.DISABLED_COLOR;
        let carButtonColor = checked ? this.ACCENT_COLOR : this.DISABLED_COLOR;
        this.setState(
            {
                carChecked: checked,
                pointerEvents: pointerEvents,
                carDisplayColor: carDisplayColor,
                licenseHeaderColor: licenseHeaderColor,
                licenseTextColor: licenseTextColor,
                carButtonColor: carButtonColor,
            }
        )
    }

    checkAll() {
        let user = firebaseApp.auth().currentUser;
        if (this.state.carChecked) {
            let updates = {};
            updates[FirebaseKeys.DRIVER.CAR.COLOUR] = this.state.carColorText;
            updates[FirebaseKeys.DRIVER.CAR.LICENSE] = this.state.licenseText;
            firebaseApp.database()
                .ref(FirebaseKeys.USER_NODE)
                .child(user.uid)
                .update(updates)
                .then(() => {

                });
            this.props.navigator.push({name: 'MainLayout', data: null});
        } else {
            this.props.navigator.push({name: 'MainLayout', data: null});
        }

    }

    closeModal(cancel) {
        if (cancel) {
            this.setState({
                carDisplayColor: this.state.carColor,
                carDisplayColorText: this.state.carColorText,
                colorModal: false
            });
        } else {
            this.setState({
                carColor: this.state.carDisplayColor,
                carColorText: this.state.carDisplayColorText,
                colorModal: false
            });
        }
    }

    getHexColor(colorText){
        for(i=0;i<this.colours.length;i++){
            if(this.colours[i].colour === colorText){
                return this.colours[i].hex;
            }
        }
        return null;
    }

    render() {
        return (
            <Image source={require('../../../images/achtergrond_man.png')} style={styles.backgroundImage}>
                <View>
                    <ScrollView>
                        <View style={styles.container}>
                            <Card style={{flex: 1, alignSelf: 'stretch'}}>
                                <Card.Body>
                                    <View>

                                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Persoonlijke gegevens</Text>
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 10
                                        }}>
                                            <View style={{flex: 1, flexDirection: 'column'}}>
                                                <Text style={styles.smallTextboxLabel}>Voornaam</Text>
                                                {/*<Text>{this.state.firstName}</Text>*/}
                                                <TextInput
                                                    value={this.state.firstName[0]}
                                                    placeholder='Voornaam'
                                                    underlineColorAndroid='transparent'
                                                    editable={false}
                                                    style={[styles.optionItem, {borderColor: this.state.borderColor}]}>
                                                </TextInput>
                                                <Text style={styles.smallTextboxLabel}>Achternaam</Text>
                                                <TextInput value={this.state.lastName}
                                                           placeholder='Achternaam'
                                                           underlineColorAndroid='transparent'
                                                           editable={false}
                                                           autoCapitalize='words'
                                                           style={[styles.optionItem, {borderColor: this.state.borderColor}]}>
                                                </TextInput>
                                                {/*<Text style={styles.smallTextboxLabel}>Telefoonnummer</Text>*/}
                                                {/*<TextInput onChangeText={(text) => this.setState({newCellphone: text})}*/}
                                                           {/*placeholder='Telefoonnummer'*/}
                                                           {/*underlineColorAndroid='transparent'*/}
                                                           {/*editable={false}*/}
                                                           {/*keyboardType="phone-pad"*/}
                                                           {/*style={[styles.optionItem, {borderColor: '#D3D3D3'}]}>{this.state.cellphone}*/}
                                                {/*</TextInput>*/}
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text
                                                    style={[styles.smallTextboxLabel, {marginBottom: 5}]}>Profielfoto</Text>
                                                <Image style={styles.profileImage}
                                                       source={{uri: this.state.profilePicture}}/>

                                            </View>
                                        </View>
                                        <TouchableHighlight onPress={() => this.openEditProfileModal()} style={{
                                            height: 40,
                                            backgroundColor: '#36006b',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 2,
                                            marginTop: 5
                                        }}>
                                            <View style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={{color: '#FFFFFF', fontSize: 10}}>BEWERKEN</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </Card.Body>
                            </Card>

                            {/*<Card style={{flex: 1, alignSelf: 'stretch'}}>*/}
                                {/*<Card.Body>*/}
                                    {/*<View>*/}
                                        {/*<Text style={{fontWeight: 'bold', fontSize: 18}}>Inloggegevens</Text>*/}
                                        {/*<View style={{*/}
                                            {/*flex: 1,*/}
                                            {/*flexDirection: 'row',*/}
                                            {/*justifyContent: 'center',*/}
                                            {/*alignItems: 'center',*/}
                                            {/*marginTop: 10*/}
                                        {/*}}>*/}
                                            {/*<View style={{flex: 1, flexDirection: 'column'}}>*/}
                                                {/*<Text style={styles.smallTextboxLabel}>E-mailadres</Text>*/}
                                                {/*<TextInput onChangeText={(text) => this.setState({newEmail: text})}*/}
                                                           {/*placeholder='E-mailadres'*/}
                                                           {/*keyboardType='email-address'*/}
                                                           {/*editable={false}*/}
                                                           {/*onBlur={() => this.changeBorderColor(false)}*/}
                                                           {/*onFocus={() => this.changeBorderColor(true)}*/}
                                                           {/*underlineColorAndroid='transparent'*/}
                                                           {/*style={[styles.optionItem, {borderColor: this.state.borderColor}]}>{this.state.email}*/}
                                                {/*</TextInput>*/}

                                            {/*</View>*/}
                                        {/*</View>*/}
                                    {/*</View>*/}
                                {/*</Card.Body>*/}
                            {/*</Card>*/}


                            <Card style={{flex: 1, alignSelf: 'stretch'}}>
                                <Card.Body>
                                    <View>
                                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Favoriete bestemmingen</Text>
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 10
                                        }}>
                                            <View style={{flex: 1, flexDirection: 'column'}}>
                                                <View style={styles.locationsListView}>
                                                    <ListView dataSource={this.state.locationsDataSource}
                                                              renderRow={this.renderLocationRow.bind(this)}/>
                                                </View>
                                                <TouchableHighlight style={styles.addLocationTouchableHighlight}
                                                                    onPress={() => this.openNewLocationModal()}>
                                                    <View style={styles.addLocationView}>
                                                        <Text style={styles.addText}>Bestemming toevoegen</Text>
                                                        <Icon style={styles.importantLocationOption} name="add"/>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    </View>
                                </Card.Body>
                            </Card>

                            <Card style={{flex: 1, alignSelf: 'stretch'}}>
                                <Card.Body>
                                    <View>
                                        <Text style={{fontWeight: 'bold', fontSize: 18}}>Auto's</Text>
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 10
                                        }}>
                                            <View style={{flex: 1, flexDirection: 'column'}}>
                                                <View style={styles.locationsListView}>
                                                    <ListView dataSource={this.state.carsDataSource}
                                                              renderRow={this.renderCarRow.bind(this)}/>
                                                </View>
                                                <TouchableHighlight style={styles.addLocationTouchableHighlight}
                                                                    onPress={() => this.openNewCarModal()}>
                                                    <View style={styles.addLocationView}>
                                                        <Text style={styles.addText}>Auto toevoegen</Text>
                                                        <Icon style={styles.importantLocationOption} name="add"/>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    </View>
                                </Card.Body>
                            </Card>
                        </View>
                    </ScrollView>


                    <Modal animationType="slide"
                           onRequestClose={() => this.setState({editProfileModal: false})}
                           visible={this.state.editProfileModal}
                           transparent={false}
                           style={styles.editProfileModal}
                    >
                        <Image source={require('../../../images/achtergrond_man.png')} style={styles.backgroundImage}>

                            <ScrollView keyboardShouldPersistTaps='always'>
                                <HeaderBar onBackPressed={() => this.setState({editProfileModal: false})}
                                           title="Profiel aanpassen"
                                           onSavePressed={() => this.saveNewCar()}/>
                                <View style={styles.container}>

                                    <Card style={{flex: 1, alignSelf: 'stretch'}}>
                                        <Card.Body>
                                            <View>
                                                <Text style={{fontWeight: 'bold', fontSize: 18}}>Persoonlijke
                                                    gegevens</Text>
                                                <View style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginTop: 10
                                                }}>
                                                    <View style={{flex: 1, flexDirection: 'column'}}>
                                                        <Text style={styles.smallTextboxLabel}>Voornaam</Text>
                                                        <TextInput
                                                            onChangeText={(text) => this.setState({newFirstName: text})}
                                                            placeholder='Voornaam'
                                                            underlineColorAndroid='transparent'
                                                            autoCapitalize='sentences'
                                                            style={[styles.optionItem, {borderColor: '#36006b'}]}>{this.state.firstName}
                                                        </TextInput>
                                                        <Text style={styles.smallTextboxLabel}>Achternaam</Text>
                                                        <TextInput
                                                            onChangeText={(text) => this.setState({newLastName: text})}
                                                            placeholder='Achternaam'
                                                            underlineColorAndroid='transparent'
                                                            autoCapitalize='words'
                                                            style={[styles.optionItem, {borderColor: this.state.borderColor}]}>{this.state.lastName}
                                                        </TextInput>
                                                        {/*<Text style={styles.smallTextboxLabel}>Telefoonnummer</Text>*/}
                                                        {/*<TextInput*/}
                                                            {/*onChangeText={(text) => this.setState({newCellphone: text})}*/}
                                                            {/*placeholder='Telefoonnummer'*/}
                                                            {/*underlineColorAndroid='transparent'*/}
                                                            {/*keyboardType="phone-pad"*/}
                                                            {/*style={styles.optionItem}>{this.state.cellphone}*/}
                                                        {/*</TextInput>*/}
                                                    </View>
                                                    <View style={{
                                                        flex: 1,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Text style={[styles.smallTextboxLabel, {marginBottom: 5}]}>Profielfoto</Text>
                                                        <Image style={styles.profileImage}
                                                               source={{uri: this.state.profilePicture}}/>
                                                        <TouchableHighlight onPress={() => this.openImagePicker()}
                                                                            style={{
                                                                                height: 40,
                                                                                backgroundColor: '#36006b',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                borderRadius: 2,
                                                                                marginTop: 5
                                                                            }}>
                                                            <View style={{
                                                                flex: 1,
                                                                alignSelf: 'flex-end',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                paddingLeft: 10,
                                                                paddingRight: 10,
                                                                paddingTop: 5,
                                                                paddingBottom: 5
                                                            }}>
                                                                <Image style={{height: 15, width: 20, marginRight: 5}}
                                                                       source={require('../../../images/photowit.png')}/>
                                                                <Text style={{color: '#FFFFFF', fontSize: 10}}>FOTO
                                                                    WIJZIGEN</Text>
                                                            </View>
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>
                                                <View style={{flex: 1, alignSelf: 'flex-start'}}>
                                                    <Button overrides={{textColor: '#6F0091'}}
                                                            onPress={() => this.saveProfile()} text="OPSLAAN"/>
                                                </View>
                                            </View>
                                        </Card.Body>
                                    </Card>

                                    {/*<Card style={{flex: 1, alignSelf: 'stretch'}}>*/}
                                        {/*<Card.Body>*/}
                                            {/*<View>*/}
                                                {/*<Text style={{fontWeight: 'bold', fontSize: 18}}>Inloggegevens</Text>*/}
                                                {/*<View style={{*/}
                                                    {/*flex: 1,*/}
                                                    {/*flexDirection: 'row',*/}
                                                    {/*justifyContent: 'center',*/}
                                                    {/*alignItems: 'center',*/}
                                                    {/*marginTop: 10*/}
                                                {/*}}>*/}
                                                    {/*<View style={{flex: 1, flexDirection: 'column'}}>*/}
                                                        {/*<Text style={styles.smallTextboxLabel}>E-mailadres</Text>*/}
                                                        {/*<TextInput*/}
                                                            {/*onChangeText={(text) => this.setState({newEmail: text})}*/}
                                                            {/*placeholder='E-mailadres'*/}
                                                            {/*keyboardType='email-address'*/}
                                                            {/*onBlur={() => this.changeBorderColor(false)}*/}
                                                            {/*onFocus={() => this.changeBorderColor(true)}*/}
                                                            {/*underlineColorAndroid='transparent'*/}
                                                            {/*style={[styles.optionItem, {borderColor: this.state.borderColor}]}>{this.state.email}*/}
                                                        {/*</TextInput>*/}
                                                        {/*<Text style={styles.smallTextboxLabel}>Wachtwoord</Text>*/}
                                                        {/*<TextInput*/}
                                                            {/*onChangeText={(text) => this.setState({newUsername: text})}*/}
                                                            {/*placeholder='Wachtwoord'*/}
                                                            {/*secureTextEntry={true}*/}
                                                            {/*onBlur={() => this.changeBorderColor(false)}*/}
                                                            {/*onFocus={() => this.changeBorderColor(true)}*/}
                                                            {/*underlineColorAndroid='transparent'*/}
                                                            {/*style={[styles.optionItem, {borderColor: this.state.borderColor}]}>*/}
                                                        {/*</TextInput>*/}
                                                        {/*<Text style={styles.smallTextboxLabel}>Wachtwoord*/}
                                                            {/*herhalen</Text>*/}
                                                        {/*<TextInput*/}
                                                            {/*onChangeText={(text) => this.setState({newUsername: text})}*/}
                                                            {/*placeholder='Wachtwoord herhalen'*/}
                                                            {/*secureTextEntry={true}*/}
                                                            {/*onBlur={() => this.changeBorderColor(false)}*/}
                                                            {/*onFocus={() => this.changeBorderColor(true)}*/}
                                                            {/*underlineColorAndroid='transparent'*/}
                                                            {/*style={[styles.optionItem, {borderColor: this.state.borderColor}]}>*/}
                                                        {/*</TextInput>*/}
                                                    {/*</View>*/}
                                                {/*</View>*/}
                                            {/*</View>*/}
                                        {/*</Card.Body>*/}
                                        {/*<View style={{*/}
                                            {/*flex: 1,*/}
                                            {/*flexDirection: 'row',*/}
                                            {/*justifyContent: 'center',*/}
                                            {/*alignItems: 'center'*/}
                                        {/*}}>*/}

                                            {/*<Card.Actions position="Left">*/}
                                                {/*<View style={{flex: 1, alignSelf: 'flex-start'}}>*/}
                                                    {/*<Button overrides={{textColor: '#6F0091'}}*/}
                                                            {/*onPress={() => this.setState({editProfileModal: false})}*/}
                                                            {/*text="ANNULEREN"/>*/}
                                                {/*</View>*/}
                                            {/*</Card.Actions>*/}


                                            {/*<Card.Actions position="right">*/}
                                                {/*<View style={{flex: 1, alignSelf: 'flex-end'}}>*/}
                                                    {/*<Button overrides={{textColor: '#6F0091'}}*/}
                                                            {/*onPress={() => this.saveProfile()} text="OPSLAAN"/>*/}
                                                {/*</View>*/}
                                            {/*</Card.Actions>*/}


                                        {/*</View>*/}
                                    {/*</Card>*/}
                                </View>
                            </ScrollView>
                        </Image>
                        {/*<View style={styles.profilePictureContainer}>*/}
                        {/*<View style={styles.smallOptionContainer}>*/}
                        {/*<TextInput onChangeText={(text) => this.setState({newUsername: text})}*/}
                        {/*style={styles.optionItem}>{this.state.username}</TextInput>*/}
                        {/*<TextInput onChangeText={(text) => this.setState({newCellphone: text})}*/}
                        {/*keyboardType="phone-pad"*/}
                        {/*style={styles.optionItem}>{this.state.cellphone}</TextInput>*/}
                        {/*</View>*/}

                        {/*</View>*/}
                        {/*<View style={styles.normalContainer}>*/}
                        {/*<TextInput onChangeText={(text) => this.setState({newEmail: text})}*/}
                        {/*keyboardType='email-address'*/}
                        {/*style={styles.optionItem}>{this.state.email}</TextInput>*/}
                        {/*<TextInput onChangeText={(text) => this.setState({newPlace: text})}*/}
                        {/*style={styles.optionItem}>{this.state.place}</TextInput>*/}
                        {/*</View>*/}


                        {/*<View style={styles.editProfileModalButtonContainer}>*/}
                        {/*<Button style={styles.editButton}*/}
                        {/*onPress={() => this.setState({editProfileModal: false})}*/}
                        {/*title="Annuleren"/>*/}
                        {/*<Button style={styles.editButton} onPress={() => this.saveProfile()}*/}
                        {/*title="Opslaan"/>*/}
                        {/*</View>*/}
                    </Modal>
                    <Modal
                        animationType="slide"
                        onRequestClose={() => this.setState({addLocationModal: false})}
                        transparent={false}
                        visible={this.state.addLocationModal}
                        style={styles.addLocationModal}>


                        <ScrollView>
                            <EditHeaderBar style={{flex: 1}} title="Bestemming toevoegen"
                                           onBackPressed={() => {
                                               this.setState({addLocationModal: false});
                                           }}
                                           onSavePressed={() => {
                                               this.onSaveNewLocation();
                                           }}/>
                            <View>
                                <Text style={styles.locationAndCarTextBoxLabel}>Favoriete bestemmingsnaam</Text>
                            </View>
                            <View style={{paddingLeft: 18, paddingRight: 18, flexDirection: 'row', flex: 1}}>
                                <TextInput placeholder='Bestemmingsnaam'
                                           autoCapitalize='sentences'
                                           style={{
                                               borderBottomWidth: 1,
                                               flex: 5,
                                               alignSelf: 'flex-start',
                                               paddingLeft: 15,
                                               borderColor: '#6F0091',
                                               color: '#6F0091'
                                           }}
                                           onChangeText={(text) => this.setState({newLocationName: text})}/>
                                <TouchableOpacity style={{flex: 2, alignSelf: 'flex-end'}} onPress={() => {
                                    this.onCurrentLocation()
                                }}>
                                    <View style={{
                                        paddingTop: 10,
                                        flex: 1,
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Image source={require('../../../images/pointer.png')}
                                               style={{height: 20, width: 20}}/>
                                        <Text style={styles.addTextCurrentLocation}>Huidige</Text>
                                        <Text style={styles.addTextCurrentLocation}>Bestemming</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{marginTop: 10}}>
                                <Text style={styles.locationAndCarTextBoxLabel}>Bestemmingsadres</Text>
                            </View>
                            <GooglePlacesAutocomplete
                                ref={(ref) => this.addLocationGoogleAutocomplete = ref}
                                placeholder={this.newLocationPlaceholder}
                                minLength={2} // minimum length of text to search
                                autoFocus={false}
                                listViewDisplayed='auto'    // true/false/undefined
                                fetchDetails={true}
                                renderDescription={(row) => row.description} // custom description render
                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                    this.onNewLocationPressed(data, details);
                                }}
                                getDefaultValue={() => {
                                    return ''; // text input default value
                                }}
                                query={{
                                    // available options: https://developers.google.com/places/web-service/autocomplete
                                    key: 'AIzaSyAcHeNdkB7i8AFxjAoS0L6ziqWUaWBRW_c',
                                    language: 'nl', // language of the results
                                    types: 'address', // default: 'geocode'
                                }}
                                style={styles.autocomplete}
                                styles={{
                                    description: {
                                        fontWeight: 'bold',
                                        color: '#6F0091',
                                    },
                                    container: {
                                        paddingLeft: 16,
                                        paddingRight: 16
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#6F0091',

                                    },
                                    separator: {
                                        borderColor: '#6F0091',
                                        borderBottomWidth: 1
                                    },
                                    textInput: {
                                        padding: 0,
                                        margin: 0,
                                        color: '#6F0091',
                                        // borderTopWidth: 2
                                        // '#b5b5b5'
                                    },
                                    textInputContainer: {
                                        backgroundColor: '#FFFFFF',
                                        color: '#6F0091',
                                        // borderWidth: 2
                                        // padding: 0
                                    },
                                    powered: {width: 0, height: 0},

                                }}
                                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                currentLocationLabel={this.currentLocationText}
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


                                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                            />
                        </ScrollView>


                    </Modal>
                    <Modal
                        animationType="slide"
                        onRequestClose={() => this.setState({editLocationModal: false})}
                        transparent={false}
                        visible={this.state.editLocationModal}
                        style={styles.editLocationModal}>

                        <ScrollView style={styles.editLocationScrollView}>
                            <EditHeaderBar style={{flex: 1}} title="Bestemming aanpassen"
                                           onBackPressed={() => {
                                               this.setState({editLocationModal: false})
                                           }}
                                           onSavePressed={() => {
                                               this.saveEditLocation()
                                           }}/>
                            <View>
                                <Text style={styles.locationAndCarTextBoxLabel}>Favoriete bestemmingsnaam</Text>
                            </View>
                            <View style={{paddingLeft: 18, paddingRight: 18}}>
                                <TextInput value={this.state.editLocationName}
                                           placeholder='Bestemmingsnaam'
                                           autoCapitalize='sentences'
                                           style={{
                                               borderBottomWidth: 1,
                                               paddingLeft: 15,
                                               borderColor: '#6F0091',
                                               color: '#6F0091'
                                           }}
                                           onChangeText={(text) => this.setState({editLocationName: text})}/>
                            </View>
                            <View style={{marginTop: 10}}>
                                <Text style={styles.locationAndCarTextBoxLabel}>Bestemmingsadres</Text>
                            </View>
                            <GooglePlacesAutocomplete
                                placeholder={this.state.editLocationAddress + ", " + this.state.editLocationCity}
                                minLength={2} // minimum length of text to search
                                autoFocus={false}
                                editable={false}
                                listViewDisplayed='auto'    // true/false/undefined
                                fetchDetails={true}
                                renderDescription={(row) => row.description} // custom description render
                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                    this.onEditLocationPressed(data, details);
                                }}
                                getDefaultValue={() => {
                                    return ''; // text input default value
                                }}
                                query={{
                                    // available options: https://developers.google.com/places/web-service/autocomplete
                                    key: 'AIzaSyAcHeNdkB7i8AFxjAoS0L6ziqWUaWBRW_c',
                                    language: 'nl', // language of the results
                                    types: 'address', // default: 'geocode'
                                }}
                                style={{}}
                                styles={{
                                    description: {
                                        fontWeight: 'bold',
                                        color: '#6F0091',
                                    },
                                    container: {
                                        paddingLeft: 16,
                                        paddingRight: 16
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#6F0091',

                                    },
                                    separator: {
                                        borderColor: '#6F0091',
                                        borderBottomWidth: 1
                                    },
                                    textInput: {
                                        padding: 0,
                                        margin: 0,
                                        color: '#6F0091',
                                        // borderTopWidth: 2
                                        // '#b5b5b5'
                                    },
                                    textInputContainer: {
                                        backgroundColor: '#FFFFFF',
                                        color: '#6F0091',
                                        // borderWidth: 2
                                        // padding: 0
                                    },
                                    powered: {width: 0, height: 0},

                                }}
                                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                currentLocationLabel={this.currentLocationText}
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


                                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                            />
                        </ScrollView>
                    </Modal>
                    <Modal
                        onRequestClose={() => this.setState({newCarModal: false})}
                        transparent={false}
                        visible={this.state.newCarModal}
                        animationType="slide">
                        <Image source={require('../../../images/achtergrond_leeg.png')}
                               style={[styles.backgroundImage, {}]}>
                            <ScrollView>
                                <EditHeaderBar onBackPressed={() => this.setState({newCarModal: false})}
                                               title="Auto toevoegen"
                                               onSavePressed={() => this.saveNewCar()}/>
                                <Card style={{flex: 1, alignSelf: 'stretch', marginTop: 20}}>
                                    <Card.Body>
                                        <View style={{margin: 0, padding: 5}}>
                                            <View style={styles.checkBoxContainer}>


                                            </View>
                                            <View style={styles.carSelectContainer}
                                                  pointerEvents={this.state.pointerEvents}>
                                                <View style={{flexDirection: 'row', flex: 1}}>
                                                    <View style={{flexDirection: 'column', flex: 1, paddingRight: 20}}>
                                                        <View style={{flex: 1}}>
                                                            <Text style={styles.smallTextboxLabel}>Automerk</Text>
                                                            <TextInput
                                                                style={{
                                                                    color: this.state.licenseTextColor,
                                                                    borderBottomWidth: 1,
                                                                    borderColor: '#D3D3D3',
                                                                    flex: 1
                                                                }}
                                                                underlineColorAndroid='transparent'
                                                                autoCapitalize='sentences'
                                                                placeholder='Automerk'
                                                                onChangeText={text => this.setState({newCarBrand: text})}/>
                                                        </View>
                                                        <View style={{flex: 1}}>
                                                            <Text style={[styles.smallTextboxLabel, {marginTop: 20}]}>Autotype</Text>
                                                            <TextInput
                                                                style={[styles.licenseInput, {
                                                                    color: this.state.licenseTextColor,
                                                                    borderBottomWidth: 1,
                                                                    borderColor: '#D3D3D3'
                                                                }]}
                                                                underlineColorAndroid='transparent'
                                                                autoCapitalize="words"
                                                                placeholder='Autotype'
                                                                onChangeText={text => this.setState({newCarName: text})}/>
                                                        </View>
                                                        <View style={{flex: 1}}>
                                                            <Text style={[styles.smallTextboxLabel, {marginTop: 20}]}>Kenteken</Text>
                                                            <TextInput
                                                                style={[styles.licenseInput, {
                                                                    color: this.state.licenseTextColor,
                                                                    borderBottomWidth: 1,
                                                                    borderColor: '#D3D3D3'
                                                                }]}
                                                                underlineColorAndroid='transparent'
                                                                autoCapitalize="characters"
                                                                placeholder='Kenteken'
                                                                maxLength={8}
                                                                onChangeText={text => this.setState({newCarLicense: text})}/>
                                                        </View>
                                                    </View>
                                                    <View style={{
                                                        flexDirection: 'column',
                                                        flex: 1,
                                                        justifyContent: 'center'
                                                    }}>
                                                        <View style={{flex: 1}}/>
                                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                                            <View
                                                                style={[styles.colorCircle, {backgroundColor: this.state.carDisplayColor}]}/>
                                                            <Text style={{
                                                                color: '#6F0091',
                                                                fontWeight: 'bold',
                                                                fontSize: 13,
                                                                marginTop: -10,
                                                                marginBottom: 15
                                                            }}>{this.state.carColorText}</Text>
                                                        </View>
                                                        <TouchableHighlight
                                                            style={[styles.carButton, {backgroundColor: this.state.carButtonColor}]}
                                                            onPress={() => this.setState({colorModal: true})}>
                                                            <Text style={{color: '#FFFFFF'}}>Kies autokleur</Text>
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </Card.Body>
                                </Card>
                                <View style={{
                                    flex: 4,
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    marginTop: 100
                                }}>
                                    <View
                                        style={{flex: 1, justifyContent: 'center', alignItems: 'center', bottom: -10}}>
                                        <MDIcon name={"car"} color={this.state.carDisplayColor} size={100}/>
                                    </View>
                                </View>
                                <ModalExtern
                                    onRequestClose={() => this.setState({colorModal: false})}
                                    isVisible={this.state.colorModal}
                                    transparent={true}
                                    animationType={"fade"}
                                    style={styles.colorModal}>
                                    <Text style={{color: '#6F0091', fontWeight: 'bold', margin: 10, fontSize: 15}}>Autokleur</Text>
                                    <RNMColorPicker selectedcolor={this.state.carColor} colours={this.colours}
                                                    onColorPressed={(hex, text) => this.setState({
                                                        carDisplayColor: hex,
                                                        carDisplayColorText: text,
                                                        newCarColour: text
                                                    })}/>

                                    <View style={styles.bottomModalButtons}>
                                        <Button overrides={{textColor: '#6F0091', padding: 20,}}
                                                onPress={() => this.closeModal(true)}
                                                text="ANNULEREN"/>
                                        <Button overrides={{textColor: '#6F0091', padding: 20,}}
                                                onPress={() => this.closeModal(false)}
                                                text="OK"/>
                                    </View>
                                </ModalExtern>
                            </ScrollView>
                        </Image>
                    </Modal>
                    <Modal
                        onRequestClose={() => this.setState({editCarModal: false})}
                        transparent={false}
                        visible={this.state.editCarModal}
                        animationType="slide"
                        style={{flex: 1,}}>
                        <View style={{flex: 1}}>

                            <Image source={require('../../../images/achtergrond_leeg.png')}
                                   style={[styles.backgroundImage, {}]}>
                                <ScrollView>
                                    <EditHeaderBar style={{flex: 1}}
                                                   onBackPressed={() => this.setState({editCarModal: false})}
                                                   title="Auto aanpassen"
                                                   onSavePressed={() => this.saveEditCar()}/>


                                    <Card style={{flex: 1, alignSelf: 'stretch', marginTop: 20}}>
                                        <Card.Body>
                                            <View style={{margin: 0, padding: 5}}>
                                                <View style={styles.checkBoxContainer}>


                                                </View>
                                                <View style={styles.carSelectContainer}
                                                      pointerEvents={this.state.pointerEvents}>
                                                    <View style={{flexDirection: 'row', flex: 1}}>
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            flex: 1,
                                                            paddingRight: 20
                                                        }}>
                                                            <View style={{flex: 1}}>
                                                                <Text style={styles.smallTextboxLabel}>Automerk</Text>
                                                                <TextInput value={this.state.editCarBrand}
                                                                           style={{
                                                                               color: this.state.licenseTextColor,
                                                                               borderBottomWidth: 1,
                                                                               borderColor: '#D3D3D3',
                                                                               flex: 1
                                                                           }}
                                                                           underlineColorAndroid='transparent'
                                                                           autoCapitalize='sentences'
                                                                           placeholder='Automerk'
                                                                           onChangeText={(text) => this.setState({editCarBrand: text})}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <Text
                                                                    style={[styles.smallTextboxLabel, {marginTop: 20}]}>Autotype</Text>
                                                                <TextInput value={this.state.editCarName}
                                                                           style={[styles.licenseInput, {
                                                                               color: this.state.licenseTextColor,
                                                                               borderBottomWidth: 1,
                                                                               borderColor: '#D3D3D3'
                                                                           }]}
                                                                           underlineColorAndroid='transparent'
                                                                           autoCapitalize="words"
                                                                           placeholder='Autotype'
                                                                           onChangeText={(text) => this.setState({editCarName: text})}/>
                                                            </View>
                                                            <View style={{flex: 1}}>
                                                                <Text
                                                                    style={[styles.smallTextboxLabel, {marginTop: 20}]}>Kenteken</Text>
                                                                <TextInput value={this.state.editCarLicense}
                                                                           style={[styles.licenseInput, {
                                                                               color: this.state.licenseTextColor,
                                                                               borderBottomWidth: 1,
                                                                               borderColor: '#D3D3D3'
                                                                           }]}
                                                                           underlineColorAndroid='transparent'
                                                                           autoCapitalize="characters"
                                                                           maxLength={8}
                                                                           placeholder='Kenteken'
                                                                           onChangeText={(text) => this.setState({editCarLicense: text})}/>
                                                            </View>
                                                        </View>
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            flex: 1,
                                                            justifyContent: 'center'
                                                        }}>
                                                            <View style={{flex: 1}}/>
                                                            <View style={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}>
                                                                <View
                                                                    style={[styles.colorCircle, {backgroundColor: this.state.editCarHex}]}/>
                                                                <Text style={{
                                                                    color: '#6F0091',
                                                                    fontWeight: 'bold',
                                                                    fontSize: 13,
                                                                    marginTop: -10,
                                                                    marginBottom: 15
                                                                }}>{this.state.editCarColour}</Text>
                                                            </View>
                                                            <TouchableHighlight
                                                                style={[styles.carButton, {backgroundColor: this.state.carButtonColor}]}
                                                                onPress={() => this.setState({colorModal: true})}>
                                                                <Text style={{color: '#FFFFFF'}}>Kies autokleur</Text>
                                                            </TouchableHighlight>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </Card.Body>
                                    </Card>
                                    <View style={{
                                        flex: 4,
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        marginTop: 100
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            bottom: -10
                                        }}>
                                            <MDIcon name={"car"} color={this.state.carDisplayColor} size={100}/>
                                        </View>
                                    </View>
                                    <ModalExtern
                                        onRequestClose={() => this.setState({colorModal: false})}
                                        isVisible={this.state.colorModal}
                                        transparent={true}
                                        animationType={"fade"}
                                        style={styles.colorModal}>
                                        {/*<Text style={{fontWeight: 'bold', fontSize: 18}}>Autokleur</Text>*/}
                                        <Text style={{color: '#6F0091', fontWeight: 'bold', margin: 10, fontSize: 15}}>Autokleur</Text>

                                        <RNMColorPicker selectedcolor={this.state.editCarColour} colours={this.colours}
                                                        onColorPressed={(hex, text) => this.setState({
                                                            carDisplayColor: hex,
                                                            carDisplayColorText: text,
                                                            editCarColour: text,
                                                        })}
                                                        ref={(ref) => this.editCarColorPicker = ref}/>

                                        <View style={styles.bottomModalButtons}>
                                            <Button overrides={{textColor: '#6F0091', padding: 20,}}
                                                    onPress={() => this.closeModal(true)}
                                                    text="ANNULEREN"/>
                                            <Button overrides={{textColor: '#6F0091', padding: 20,}}
                                                    onPress={() => this.closeModal(false)}
                                                    text="OK"/>
                                        </View>
                                    </ModalExtern>


                                </ScrollView>
                            </Image>
                        </View>
                    </Modal>
                </View>
            </Image>
        );
    }


}

const
    styles = StyleSheet.create({
        backgroundImage: {
            flex: 1,
            width: null,
            height: null
        },
        profileImage: {
            height: 100,
            width: 100,
            borderRadius: 50
        },
        addLocationBottomButton: {
            flex: 1,
            alignSelf: 'stretch',
        },
        addLocationBottomButtonContainer: {
            flexDirection: 'row',
        },
        addLocationView: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center'
        },
        addLocationTouchableHighlight: {
            flex: 1,
            alignSelf: 'stretch',
            marginTop: 10
        },

        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',

            alignSelf: 'stretch',
            padding: 15,
        },
        editButton: {
            alignSelf: 'flex-end',
            width: 100,
        },
        editLocationModal: {
            flex: 1,
            flexDirection: 'column',
            padding: 20,

        },
        editLocationScrollView: {
            // flex: 1,
        },
        editProfileModal: {
            padding: 20,
            flex: 1
        },
        editProfileModalButtonContainer: {
            flex: 1,
            flexDirection: 'row',
        },
        headerText: {
            fontSize: 25,
            marginBottom: 10,
        },

        importanLocationContainer: {
            flex: 1,
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: '#D3D3D3',

        },
        importantLocationOption: {
            fontSize: 20,
            color: '#D3D3D3',
            flex: 1,
            paddingTop: 10,
            paddingLeft: 10,
            paddingBottom: 10,
            alignSelf: 'flex-end',
        },
        addText: {
            color: '#D3D3D3',
            flex: 6,
            fontSize: 15,
            padding: 10,
            alignSelf: 'flex-start'
        },
        addTextCurrentLocation: {
            color: '#D3D3D3',
            // flex: 6,
            fontSize: 12,
            // padding: 10,
            // alignSelf: 'flex-start'
        },
        editLocationOption: {
            color: '#f9c407',
            fontSize: 20,
            flex: 1,
            alignSelf: 'flex-end'
        },
        deleteLocationOption: {
            color: '#f90707',
            fontSize: 20,
            flex: 1,
            alignSelf: 'flex-end'
        },
        importantLocationText: {
            flex: 6,
            fontSize: 15,
            // padding: 10,
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 10,
            paddingTop: 10,
            alignSelf: 'center',
            // backgroundColor: "#95989A",
        },

        locationsListView: {
            flex: 1,
            alignSelf: 'stretch',
        },
        newCarContainer: {
            flexDirection: 'column',
            flex: 1,
        },
        normalContainer: {
            flex: 1,
        },
        optionGroup: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignSelf: 'stretch',
            // borderColor: "#95989A",
            borderWidth: 1,
            borderRadius: 20,
            padding: 15,
            marginBottom: 10,

        },
        optionItem: {
            borderBottomWidth: 1,
            // backgroundColor: '#95989A',
            color: '#6F0091',
            height: 40,
            marginBottom: 15,
            textAlign: 'left',
            textAlignVertical: 'center',
        },
        profilePicture: {
            flex: 1,
            width: 100,
            height: 100,
            borderRadius: 50,
        },
        profilePictureContainer: {
            flex: 1,
            flexDirection: "row",

        },
        smallOptionContainer: {
            flex: 2,
            flexDirection: "row",
        },
        smallTextboxLabel: {
            color: '#D3D3D3',
            fontSize: 9
        },
        locationAndCarTextBoxLabel: {
            paddingLeft: 18,
            paddingTop: 10,
            paddingBottom: 5,
            color: '#D3D3D3',
            fontSize: 12
        },
        carButton: {
            flex: 0.5,
            marginTop: 10,
            marginBottom: 10,

            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 2,
            padding: 10
        },
        colorModal: {
            backgroundColor: '#FFFFFF',
            flexDirection: 'column',
            flex: 1,
            marginTop: 50,
            marginBottom: 250,
            padding: 10,
            justifyContent: 'space-between',
            borderRadius: 2,
        },
        bottomModalButtons: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end'
        },
        colorCircle: {
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#BBBBBB',
            margin: 10,
            flex: 1
        },
    });

AppRegistry
    .registerComponent(
        'OptionsPage'
        , () =>
            OptionsPage
    )
;
