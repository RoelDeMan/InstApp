'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Modal,
    ScrollView,
    NativeModules,
    LayoutAnimation
} from 'react-native';

import MapsPage from "./MapsPage";
import HeaderBar from "../UI/HeaderBar";
import { Card } from 'react-native-material-design';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import renderIf from './renderif';

import EditHeaderBar from "../UI/EditHeaderBar";
import LocationProvider from "../Location/LocationProvider";
import Geocoder from 'react-native-geocoder';


const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

export default class DestinationInput extends Component {

    addLocationGoogleAutocomplete;
    contentComponment;

    constructor(props){
        super(props);

        this.state = {
            whereToGo: 'Waar wilt u heen?',
            modalDestination: false,
            data: [],
            address: 'Zoeken',
            city: "",
            lat: '',
            long: '',
            modalVisible: false,
            content: (<View></View>),
            locations: [],
            addLocationModal: false,
            newLocationName: '',
            newAddress: '',
            newCity: '',
            newlat: '',
            newLong: '',
            navEnable: true,
            navDisable: false
        };
        this.updateLocations();
        this.sendLocation = this.sendLocation.bind(this);
    }

    openDestinationModal(){
        this.setState({modalDestination: true});
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
    setDrawer(drawer) {
        this.drawer = drawer;
    }
    setContentComponent(content) {
        this.contentComponent = content;
    }
    onAddressPressed() {
        console.log("onAddressPressed");
        this.setState({modalVisible: true});
    }
    sendLocation() {
       // MapsPage.setAddressCity(this.state.address, this.state.city);
       // MapsPage.getLatLng({latitude: this.state.lat, longitude: this.state.long});
        this.props.set(this.state.address, this.state.city);
        this.props.get({latitude: this.state.lat, longitude: this.state.long, destinationAdress: this.state.address, destinationCity: this.state.city});
    }
    setNavigationBar() {
        console.log('ik ben roel');
        this.setState({content: ((<TouchableHighlight onPress={() => this.onAddressPressed()}><Text
            style={styles.addressButtonText}>{this.state.address} {this.state.city}</Text></TouchableHighlight>))});
    }
    setTextBar(text) {
        this.setState({content: (<Text style={{color: '#FFFFFF'}}>{text}</Text>)});
    }
    clearInputTextbox(){
        this.setState({whereToGo: 'Waar wilt u heen?'});
    }
    onItemSelected(data, details) {
        console.log('data');
        console.log(data);
        let address = data.structured_formatting.main_text;
        let city = data.structured_formatting.secondary_text;
        let lat = details.geometry.location.lat;
        let long = details.geometry.location.lng;
        console.log("Lat: " + lat + "  Long: " + long );
        this.setState({
            address: address,
            city: city,
            lat: lat,
            long: long,
            whereToGo: address + ', ' + city,
            modalDestination: false
        }, () =>{
            this.setNavigationBar();
            this.sendLocation();
        });
    }
    getSelectedLocation(){
        return {address: this.state.address, city: this.state.city};
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
    onSaveNewLocation() {
        if (this.addLocationGoogleAutocomplete.getAddressText() === this.currentLocationText && this.state.newLocationName !== '') {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    Geocoder.geocodePosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }).then((result) => {
                        let streetName = result.streetName;
                        let streetNumber = result.streetNumber;
                        let city = result.locality;
                        this.addNewLocation(this.state.newLocationName, streetName + " " + streetNumber, city, position.coords.latitude, position.coords.longitude);
                    });
                }
            );
        } else {
            let name = this.state.newLocationName;
            let address = this.state.newAddress;
            let city = this.state.newCity;
            let lat = this.state.newlat;
            let long = this.state.newLong;
            console.log(name + " / " + address + " / " + city + " / " + lat + " / " + long);
            if (name !== '' && address !== '' && city !== '' && lat !== '' && long !== '') {
                this.addNewLocation(name, address, city, lat, long);
            }
        }
    }
    openNewLocationModal() {
        this.setState({
            newLocationName: '',
            newAddress: '',
            newCity: '',
            newlat: '',
            newLong: '',
            addLocationModal: true,
            modalDestination: false
        });
        if (this.addLocationGoogleAutocomplete !== null) {
            //this.addLocationGoogleAutocomplete.setAddressText(this.newLocationPlaceholder);
        }

    }
    addNewLocation(name, address, city, lat, long) {
        let uid = firebaseApp.auth().currentUser.uid;
        let updates = {};
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
                this.fetchLocationsData();
                this.updateLocations();
                this.setState({addLocationModal: false});
                setTimeout(() => {
                    this.setState({modalDestination: true});
                }, 500);

            });
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
    enableDestinationInput(){
        this.setState({navEnable: true, navDisable: false});
    }
    disableDestinationInput(){
        this.setState({navDisable: true, navEnable: false});
    }
    render(){
        return(
            <View style={styles.container}>
                {renderIf(this.state.navEnable)(
                    <Card onPress={() => this.openDestinationModal()} style={{backgroundColor: '#FFFFFF', width: 320, alignSelf: 'stretch'}}>
                        <Card.Body>
                            <View style={{ margin: -5,}}>
                                <Text style={{color: '#D3D3D3'}}>{this.state.whereToGo}</Text>
                            </View>
                        </Card.Body>
                    </Card>
                )}
                {renderIf(this.state.navDisable)(
                    <Card style={{backgroundColor: '#FFFFFF', width: 320, alignSelf: 'stretch'}}>
                        <Card.Body>
                            <View style={{ margin: -5,}}>
                                <Text style={{color: '#D3D3D3'}}>{this.state.whereToGo}</Text>
                            </View>
                        </Card.Body>
                    </Card>
                )}

                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.modalDestination}
                    onRequestClose={() => this.setState({modalDestination: false})}>
                    <ScrollView
                        keyboardShouldPersistTaps='always'
                    >
                        <HeaderBar title="Bestemming kiezen" onBackPressed={() => { this.setState({modalDestination: false})}} />
                        <GooglePlacesAutocomplete
                            placeholder='Zoeken naar een bestemming'
                            minLength={2}
                            autoFocus={true}
                            listViewDisplayed='auto'
                            fetchDetails={true}
                            renderDescription={(row) => row.description}
                            onPress={(data, details = null) => {
                                this.onItemSelected(data, details);
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
                                },
                                predefinedPlacesDescription: {
                                    color: '#6F0091',
                                },
                                textInput: {
                                    padding: 0,
                                    margin: 0
                                },
                                textInputContainer: {
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
                            // renderRightButton={() =>
                            //     <TouchableHighlight onPress={() => this.openNewLocationModal()} >
                            //         <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingRight: 10}}>
                            //             <Icon style={styles.importantLocationOption} name="add"/>
                            //             <Text style={{fontSize: 8, color: '#D3D3D3'}}>Fav. bestemming</Text>
                            //             <Text style={{fontSize: 8, color: '#D3D3D3'}}>toevoegen</Text>
                            //         </View>
                            //     </TouchableHighlight>}
                        />
                    </ScrollView>
                </Modal>
                <Modal
                    animationType="slide"
                    onRequestClose={() => this.setState({addLocationModal: false})}
                    transparent={false}
                    visible={this.state.addLocationModal}>
                    <ScrollView>
                        <EditHeaderBar style={{flex: 1}} title="Bestemming toevoegen"
                                       onBackPressed={() => {this.setState({addLocationModal: false});}}
                                       onSavePressed={() => {this.onSaveNewLocation();}}/>
                        <View>
                            <Text style={styles.locationAndCarTextBoxLabel}>Favoriete bestemmingsnaam</Text>
                        </View>
                        <View style={{paddingLeft: 18, paddingRight: 18, flexDirection: 'row', flex: 1}}>
                            <TextInput  placeholder='Bestemmingsnaam'
                                        autoCapitalize= 'sentences'
                                        style={{borderBottomWidth: 1, flex: 5, alignSelf: 'flex-start', paddingLeft: 15, borderColor: '#6F0091', color: '#6F0091'}}
                                        onChangeText={(text) => this.setState({newLocationName: text})}/>
                            <TouchableOpacity  style={{flex: 2, alignSelf: 'flex-end'}} onPress={() => {this.onCurrentLocation()}}>
                                <View style={{paddingTop: 10, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <Image source={require('../../../images/pointer.png')} style={{height: 20, width: 20}}/>
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
                            placeholder={'Zoeken naar een bestemmingsnaam'}
                            minLength={2}
                            autoFocus={false}
                            listViewDisplayed='auto'
                            fetchDetails={true}
                            renderDescription={(row) => row.description}
                            onPress={(data, details = null) => {this.onNewLocationPressed(data, details);}}
                            getDefaultValue={() => {return '';}}
                            query={{
                                key: 'AIzaSyAcHeNdkB7i8AFxjAoS0L6ziqWUaWBRW_c',
                                language: 'nl',
                                types: 'address',
                            }}
                            style={styles.autocomplete}
                            styles={{
                                description: {
                                    fontWeight: 'bold',
                                    color: '#6F0091'
                                },
                                container: {
                                    paddingLeft: 16,
                                    paddingRight: 16
                                },
                                predefinedPlacesDescription: {
                                    color: '#6F0091'
                                },
                                separator:{
                                    borderColor: '#6F0091',
                                    borderBottomWidth: 1
                                },
                                textInput: {
                                    padding: 0,
                                    margin: 0,
                                    color: '#6F0091'
                                },
                                textInputContainer: {
                                    backgroundColor: '#FFFFFF',
                                    color: '#6F0091'
                                },
                                powered: {width: 0, height: 0}
                            }}
                            currentLocation={false}
                            currentLocationLabel={this.currentLocationText}
                            nearbyPlacesAPI='GooglePlacesSearch'
                            GoogleReverseGeocodingQuery={{}}
                            GooglePlacesSearchQuery={{
                                rankby: 'distance',
                                types: 'food',
                            }}
                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                            debounce={200}
                        />
                    </ScrollView>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 3,
        position: 'absolute',
        alignItems: 'center',
        top: 10
    },
    contentView: {
        backgroundColor: '#36006b',
        color: '#FFFFFF',
        flex: 6,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
    },
    addressButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        justifyContent: 'center',
    },
    importantLocationOption: {
        fontSize: 10,
        color: '#D3D3D3'
    },
    locationAndCarTextBoxLabel: {
        paddingLeft: 18,
        paddingTop: 10,
        paddingBottom: 5,
        color: '#D3D3D3',
        fontSize: 12
    },
    addTextCurrentLocation: {
        color: '#D3D3D3',
        fontSize: 12,
    }
});

AppRegistry.registerComponent('DestinationInput', () => DestinationInput);

