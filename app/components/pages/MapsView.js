'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

  import DriveButton from './TravelOptions.js';
  const request = require('superagent');
  const polyline = require('@mapbox/polyline');
  import RNPolyline  from 'rn-maps-polyline';
  var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
  import Geocoder from 'react-native-geocoding';
  Geocoder.setApiKey('AIzaSyBUgSbt6n_EYI9RJRPDQTW5BLspjBW4M80');

  import firebaseApp from '../Firebase/Firebase.js';;
  const MapView = require('react-native-maps');
  const FBSDK = require('react-native-fbsdk');
  const {
    LoginButton,
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager
  } = FBSDK;




class MapsView extends Component {
  constructor(props){
    super(props);
    this.tasksRef = firebaseApp.database().ref();
      this.state = {
      }
  }


    componentDidMount(){
        navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            currentLat: position.coords.latitude,
            currentLong: position.coords.longitude,
            error: null,
          });
        },
        (error) => this.setState({error: error.message}),
        {enableHighAccuracy: true, timeout: 40000, maximumAge: 2000},
      );
    }

    changeComp(){
      if(this.state.compValue === 1){
        this.setState({
          comp: <DestinationBar />
        })
        this.setState({
          compValue: 2
        })
      }else{
          this.setState({
            comp: <DriveButton />
          })
          this.setState({
            compValue: 1
          })
        }
      }





    drawLine(){
      const mode = 'driving'; // 'walking';
      let startLat = this.state.currentLat;
      let startLong = this.state.currentLong;
      let start = [startLat, startLong];
      let destinationLat = this.state.lat;
      let destinationLong = this.state.long;
      let destination = [destinationLat, destinationLong];
      const APIKEY = 'AIzaSyBUgSbt6n_EYI9RJRPDQTW5BLspjBW4M80';
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${APIKEY}&mode=${mode}`;

          var change = this;
          request
               .get(url)
               .set("Accept","application/json")
               .end(function(err, res){
                 var routeData = res.body;
                  var routeArray = [];
                    routeArray = RNPolyline.decode(routeData.routes[0].overview_polyline.points);
                      change.setState({
                        coords: routeArray
                      });
                });
    }

    getLatLng(latLng){

      testje(latLng.latitude, latLng.longitude).then((json) =>{
        alert(json);
        this.setState({currentLat: json.latitude})
      }).catch((error) => {
        alert(error.message);
      });
    }


    render() {
      return (

        <View style={styles.container}>
          <View style={styles.header}>
          <TouchableHighlight  underlayColor={'#998e88'} onPress={this.currentPosition.bind(this)}>
            <Image
              style={styles.optionImgLeft}
              source={require('../../../images/car.png')}
            />
          </TouchableHighlight>
          <TouchableHighlight  underlayColor={'#998e88'} onPress={this.currentPosition.bind(this)}>
            <Image
              style={styles.optionImgRight}
              source={require('../../../images/car.png')}
            />
          </TouchableHighlight>
          </View>

            <MapView
                style={styles.map}
                region={{longitude: this.state.long, latitude: this.state.lat,
                latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
              >
              <MapView.Marker
                coordinate={{longitude: this.state.long, latitude: this.state.lat,
                longitudeDelta: 0.0421, latitudeDelta: 0.0922}}
                image={require('../../../images/pointer.png')}
              />
              <MapView.Marker
                coordinate={{longitude: this.state.currentLong, latitude: this.state.currentLat,
                longitudeDelta: 0.0421, latitudeDelta: 0.0922}}
                image={require('../../../images/person.png')}
              />
              <MapView.Polyline
                coordinates = {this.state.coords}
                strokeWidth={3}
                strokeColor={"red"}
                fillColor="rgba(255,0,0,0.5)"
              />
            </MapView>
            <View style={styles.submitBox}>

              <DestinationBar
                userName={this.state.userName}
                passLatLng={this.getLatLng.bind(this)}
              />
            </View>
        </View>
      );
    }
  }



  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: '#39342f',

    },
    optionImgLeft: {
      height: 50,
      width: 50,
      marginTop: 12.5,
      marginRight: 20,
    },
    optionImgRight: {
      height: 50,
      width: 50,
      marginTop: 12.5,
      marginLeft: 20,
    },
    header:{
      flex: 1,
      flexDirection: 'row',
      height: 50,
      width: 300,
      alignItems: 'center',
    },
    headerText:{
      height: 50,
      textAlign: 'center',
      fontSize: 25,
      color: '#998e88',
      fontFamily: 'myriad pro',
    },
    submitBox:{
      flex: 1,
      flexDirection: 'row',
      width: 290,
      height: 80,
      marginTop: 400,
      marginBottom: 70,
    },
    submitTop: {
      height: 80,
      width: 145,
      backgroundColor: '#39342f',
      borderWidth: 1,
      borderColor: '#998e88',
      paddingTop: 25,
      borderTopLeftRadius:10,
      borderBottomLeftRadius:10,
    },
    submitBottom: {
      height: 80,
      width: 145,
      backgroundColor: '#39342f',
      borderWidth: 1,
      borderColor: '#998e88',
      paddingTop: 25,
      borderBottomRightRadius:10,
      borderTopRightRadius:10,
    },
    submitText:{
      textAlign: 'center',
      fontSize: 25,
      color: '#998e88',
      fontFamily: 'myriad pro',
    },
    map: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0
    },
    text: {
      fontSize: 25,
      fontFamily: 'myriad pro',
      color: '#686868',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    input: {
      height: 40,
      width: 160,
      borderWidth: 1,
      marginBottom: 15,
      borderRadius: 10,
      borderColor: 'gray',
      backgroundColor: 'white',
    },
    mainText: {
      borderWidth: 1,
      marginBottom: 15,
      borderRadius: 10,
      borderColor: 'gray',
      backgroundColor: 'white',
    },
    modalWindow: {
      backgroundColor: 'white',
      width: 325,
      height: 250,
      justifyContent: 'center',
    },
  });

module.exports = MapsView;
