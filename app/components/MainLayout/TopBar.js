import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput, Image,
    TouchableHighlight,
    Modal, ScrollView, TouchableOpacity, NativeModules
} from 'react-native';

import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import HeaderBar from "../UI/HeaderBar";
import EditHeaderBar from "../UI/EditHeaderBar";
import LocationProvider from "../Location/LocationProvider";
import Geocoder from 'react-native-geocoder';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

export default class TopBar extends Component {
    currentLocationText = "Huidige locatie";
    addLocationGoogleAutocomplete;
    newLocationPlaceholder = "Bestemmingsadres";

    constructor(props) {
        super(props);

        this.state = {
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
        };

        this.updateLocations();

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
    drawerPressed() {
        this.drawer.openDrawer();
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
        this.contentComponent.setAddressCity(this.state.address, this.state.city);
        this.contentComponent.getLatLng({latitude: this.state.lat, longitude: this.state.long});
    }

    setNavigationBar() {
        console.log('ik ben roel');
        this.setState({content: ((<TouchableHighlight onPress={() => this.onAddressPressed()}><Text
            style={styles.addressButtonText}>{this.state.address} {this.state.city}</Text></TouchableHighlight>))});
    }

    setTextBar(text) {
        this.setState({content: (<Text style={{color: '#FFFFFF'}}>{text}</Text>)});
    }

    onItemSelected(data, details) {
        console.log('data');
        console.log(data);
        address = data.structured_formatting.main_text;
        city = data.structured_formatting.secondary_text;
        lat = details.geometry.location.lat;
        long = details.geometry.location.lng;
        console.log("Lat: " + lat + "  Long: " + long );
        this.setState({
            address: address,
            city: city,
            lat: lat,
            long: long,
            modalVisible: false
        }, () =>{
            this.setNavigationBar();
            // console.log('boe');
            // console.log(this.contentComponent);
            this.sendLocation();
        });
    }

    getSelectedLocation(){
        return {address: this.state.address, city: this.state.city};
    }
    openModalDestination(value){
        this.setState({modalVisible: value});
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
                        this.updateLocations();

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
                this.updateLocations();
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
                this.setState({addLocationModal: false});
                this.fetchLocationsData();

                console.log('voeg toe');
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

    render() {
        return (
            <View style={styles.container}>

                <TouchableHighlight style={styles.drawerButton} onPress={() => this.drawerPressed()}><Icon
                    style={styles.drawerIcon} name="menu"/></TouchableHighlight>
                <View style={styles.contentView}>{this.state.content}</View>

                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({modalVisible: false})}>
                    <ScrollView
                        keyboardShouldPersistTaps='always'
                    >
                        <HeaderBar title="Bestemming kiezen" onBackPressed={() => { this.setState({modalVisible: false})}} />
                        <GooglePlacesAutocomplete

                            placeholder='Zoeken naar een bestemming'
                            minLength={2} // minimum length of text to search
                            autoFocus={true}
                            listViewDisplayed='auto'    // true/false/undefined
                            fetchDetails={true}
                            renderDescription={(row) => row.description} // custom description render
                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                this.onItemSelected(data, details);
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

                            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                            renderRightButton={() =>
                                <TouchableHighlight onPress={() => this.openNewLocationModal()} >
                                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingRight: 10}}>
                                        <Icon style={styles.importantLocationOption} name="add"/>
                                        <Text style={{fontSize: 8, color: '#D3D3D3'}}>Fav. bestemming</Text>
                                        <Text style={{fontSize: 8, color: '#D3D3D3'}}>toevoegen</Text>
                                    </View>
                                </TouchableHighlight>}
                        />
                    </ScrollView>

                </Modal>
                <Modal
                    animationType="slide"
                    onRequestClose={() => this.setState({addLocationModal: false})}
                    transparent={false}
                    visible={this.state.addLocationModal}
                    style={styles.addLocationModal}>


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
                            placeholder={this.newLocationPlaceholder}
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1.2,
        flexDirection: 'row',
        backgroundColor: '#F5FCFF',
        position: 'relative',
        justifyContent: 'center',

    },
    drawerButton: {
        flex: 1,
        backgroundColor: '#36006b',
        justifyContent: 'center',
        alignItems: 'center'
    },
    drawerIcon: {
        fontSize: 30,
        color: '#FFFFFF'
    },
    contentView: {
        backgroundColor: '#36006b',
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

AppRegistry.registerComponent('TopBar', () => TopBar);
