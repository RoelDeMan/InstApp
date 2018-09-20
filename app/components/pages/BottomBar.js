import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Button,
    Picker,
    TextInput, ListView,
    Image
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager
} = FBSDK;

import Modal from 'react-native-modal';
import firebaseApp from '../Firebase/Firebase.js';
import Hr from 'react-native-hr';
import LocationHandler from '../Location/DriverLocationHandler';
import LocationProvider from '../Location/LocationProvider';
import HeaderBar from "../UI/HeaderBar";
import CarManager from "../Cars/CarManager";
import Styles from '../../styles/styles';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import TravelOptions from './TravelOptions';
import NavigationButton from "../UI/NavigationButton";
import ProgressImage from 'react-native-image-progress';
import ProgressImageBar from 'react-native-progress/Bar';
import RNSendIntent from 'react-native-send-intent';


export default class BottomBar extends Component {

    mainLayout;

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            isModalVisible: false,
            isVisible: false,
            isTimeModal: false,
            currentTime: '',
            setTimeInArray: [],
            setSelectedTime: '',
            driving: this.NOTDRIVING,
            mapsPage: props.mapsPage,
            selectCarModal: false,
            selectCarsDataSource: ds,
            selectCarsError: '',
            content: <View><Text>Selecteer een bestemming</Text></View>,
            passengerModal: false,
            passengerName: '',
            passengerId: '',
            request: '',
            passengerStartAddress: '',
            passengerStartCity: '',
            passengerDestAddress: '',
            passengerDestCity: '',
            passengerPicture: '',
            passengerPhone: '',
            passengerLat: '',
            passengerLong: '',
            passengerDesLat: '',
            passengerDesLong: ''
        };
        this.mainLayout = this.props.main;
        console.log("Bottombar created");


    }

    setTravelOptions() {
        this.setState({
            content: (
                (<TravelOptions
                        onPassengerPressed={() => {
                            this.openTimeBox();
                        }}
                        onDriverPressed={() => {
                            this.onRijden()
                        }}/>
                )
            )
        });
    }

    setDrivingMode() {
        addressCity = this.state.mapsPage.getAddressCity();
        console.log(addressCity);
        this.setState({
            content: (
                <View style={{flexDirection: 'row'}}>
                    <Text>Status: Rijden</Text>
                    <NavigationButton address={addressCity.address} city={addressCity.city}/>
                </View>)
        });
    }

    setDrivingModeWithPassenger(ref, passengerid, passengername, passengerLat, passengerLong, passengerDesLat, passengerDesLong) {
        this.setState({
            request: ref,
            passengerId: passengerid,
            passengerName: passengername,
            passengerLat: passengerLat,
            passengerLong: passengerLong,
            passengerDesLat: passengerDesLat,
            passengerDesLong: passengerDesLong,
            content: (
                <View style={{flexDirection: 'row'}}>

                    <TouchableHighlight onPress={() => this.openPassengerModal()}>
                        <Text>Passagier: {passengername}</Text>
                    </TouchableHighlight>
                    <NavigationButton address={addressCity.address} city={addressCity.city}/>
                </View>)
        }, () => {
            this.loadPassengerData();
        });
    }

    loadPassengerData() {
        firebaseApp.database().ref(FirebaseKeys.REQUEST_NODE)
            .child(this.state.request)
            .once(FirebaseKeys.VALUE.ONCE)
            .then(request => {
                this.setState({
                    passengerStartAddress: request.child(FirebaseKeys.REQUEST.START.ADDRESS).val(),
                    passengerStartCity: request.child(FirebaseKeys.REQUEST.START.CITY).val(),
                    passengerDestAddress: request.child(FirebaseKeys.REQUEST.DESTINATION.ADDRESS).val(),
                    passengerDestCity: request.child(FirebaseKeys.REQUEST.DESTINATION.CITY).val(),
                })
            });
        firebaseApp.database().ref(FirebaseKeys.USER_NODE)
            .child(this.state.passengerId)
            .once(FirebaseKeys.VALUE.ONCE)
            .then(user => {
                picture = user.child(FirebaseKeys.USER.PICTURE).val();
                phone = user.child(FirebaseKeys.USER.PHONE).val();
                if (phone) {
                    this.setState({passengerPhone: phone});
                }
                if (picture) {
                    firebaseApp.storage()
                        .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                        .child(picture)
                        .getDownloadURL().then((url) => {
                        console.log(url);
                        this.setState({passengerPicture: url});
                    });
                }
            })
    }

    openPassengerModal() {
        this.setState({
            passengerModal: true
        });
    }


    openTimeBox() {
        var visible = this.state.isModalVisible;
        if (visible === false) {
            this.setState({isModalVisible: true});
            this.getCurrentTime();
            this.setAllTimeInArray();
        } else if (visible === true) {
            this.setState({isModalVisible: false})
        }
    }


    hideSecondModal() {
        this.setState({isModalVisible: false});
    }


    selectNow() {
        console.log('werk eens gvd mee kut');
        let routeData = this.state.mapsPage.getRouteData();
        let destination = this.mainLayout.getSelectedLocation();
        if (routeData) {
            this.setState({isModalVisible: false});
            let ref = firebaseApp.database()
                .ref(FirebaseKeys.REQUEST_NODE)
                .push();
            LocationProvider.getFullLocation()
                .then(position => {
                    console.log(routeData);
                    console.log('YYY');
                    console.log(FirebaseKeys.REQUEST.STATES.PASSENGERREQUESTED);
                    console.log('YYY');
                    let updates = {};
                    updates[FirebaseKeys.REQUEST.TIMESTAMP] = new Date().getTime();
                    updates[FirebaseKeys.REQUEST.STATE] = FirebaseKeys.REQUEST.STATES.PASSENGERREQUESTED;
                    updates[FirebaseKeys.REQUEST.PASSENGER.UID] = firebaseApp.auth().currentUser.uid;
                    updates[FirebaseKeys.REQUEST.PASSENGER.NAME] = firebaseApp.auth().currentUser.displayName;
                    updates[FirebaseKeys.REQUEST.START.LAT] = parseFloat(position.position.lat);
                    updates[FirebaseKeys.REQUEST.START.LONG] = parseFloat(position.position.lng);
                    updates[FirebaseKeys.REQUEST.START.ADDRESS] = position.streetName + " " + position.streetNumber;
                    updates[FirebaseKeys.REQUEST.START.CITY] = position.locality;
                    updates[FirebaseKeys.REQUEST.DESTINATION.LAT] = routeData.routes[0].legs[0].end_location.lat;
                    updates[FirebaseKeys.REQUEST.DESTINATION.LONG] = routeData.routes[0].legs[0].end_location.lng;
                    updates[FirebaseKeys.REQUEST.DESTINATION.ADDRESS] = destination.address;
                    updates[FirebaseKeys.REQUEST.DESTINATION.CITY] = destination.city;
                    ref.set(updates);
                });
        }
    }


    getCurrentTime() {
        let setCurrentTime = new Date();
        let setHours = setCurrentTime.getHours();
        let setMinutes = setCurrentTime.getMinutes();
        setHours = setHours + "";
        if (setHours.length == 1) {
            setHours = "0" + setHours;
        }
        setMinutes = setMinutes + "";
        if (setMinutes.length == 1) {
            setMinutes = "0" + setMinutes;
        }
        let currentTime = "(" + setHours + ":" + setMinutes + ")";
        this.setState({currentTime: currentTime})
    }


    setAllTimeInArray() {
        this.getCurrentTime()
        let timeArray = [];
        let number = 0;
        for (var i = 0; i < 60; i += 5) {
            let plusFiveMinutes = i + 5;
            let time = new Date(),
                setTime = new Date();
            setTime.setMinutes(time.getMinutes() + plusFiveMinutes)
            let setHours = setTime.getHours();
            let setMinutes = setTime.getMinutes();
            setHours = setHours + "";
            if (setHours.length == 1) {
                setHours = "0" + setHours;
            }
            setMinutes = setMinutes + "";
            if (setMinutes.length == 1) {
                setMinutes = "0" + setMinutes;
            }
            number = number + 1;
            let loopTime = plusFiveMinutes + " min (" + setHours + ":" + setMinutes + ")";
            timeArray.push(loopTime);
        }
        this.setState({setTimeInArray: timeArray})
    }


    openDropDownTimeModal() {
        if (this.state.isTimeModal === false) {
            var routeData = this.state.mapsPage.getRouteData();
            if (routeData) {
                this.setState({isTimeModal: true})
                this.getTimeArray();
            }
        } else if (this.state.isTimeModal === true) {
            this.setState({isTimeModal: false})
        }
    }


    closeDropDownTimeModal() {
        this.setState({isTimeModal: false})
        this.setState({setSelectedTime: ''})
    }


    getTimeArray() {
        this.setAllTimeInArray.bind(this)
        return this.state.setTimeInArray.map((time, i) => {
            return (
                <View key={i} value={i}>
                    <TouchableHighlight onPress={() => this.setTimeInState(time)}>
                        <Text style={{fontSize: 15, marginTop: 5, marginBottom: 5}}>
                            {time}
                        </Text>
                    </TouchableHighlight>
                </View>
            );
        });
    }


    setTimeInState(time) {
        this.setState({setSelectedTime: time})
    }

    getPic() {
        return this.state.passengerPicture;

    }
    setSelectedTime() {
        var routeData = this.state.mapsPage.getRouteData();
        var destination = this.mainLayout.getSelectedLocation();
        if (routeData) {
            this.closeDropDownTimeModal.bind(this);
            this.setState({isTimeModal: false, isModalVisible: false});
            let uid = firebaseApp.auth().currentUser.uid;
            let name = firebaseApp.auth().currentUser.displayName;
            LocationProvider.getFullLocation()
                .then((position => {
                    let dateText = this.state.setSelectedTime;
                    let date = new Date();
                    let time = dateText.substring(dateText.indexOf('(') + 1, dateText.indexOf(')')).split(':');
                    let hours = time[0];
                    let minutes = parseInt(time[1]);
                    if (hours === '00') {
                        if (date.getHours() === 23) {
                            date.setDate(date.getDate() + 1);
                        }
                    }
                    date.setHours(parseInt(hours));
                    date.setMinutes(minutes);

                    let updates = {};
                    updates[FirebaseKeys.REQUEST.STATE] = FirebaseKeys.REQUEST.STATES_SEMI.PASSENGERREQUESTED;
                    updates[FirebaseKeys.REQUEST.PASSENGER.UID] = uid;
                    updates[FirebaseKeys.REQUEST.PASSENGER.NAME] = name;
                    updates[FirebaseKeys.REQUEST.TIMESTAMP] = date.getTime();
                    updates[FirebaseKeys.REQUEST.REQUESTTIMESTAMP] = new Date().getTime();
                    updates[FirebaseKeys.REQUEST.START.LAT] = position.position.lat;
                    updates[FirebaseKeys.REQUEST.START.LONG] = position.position.lng;
                    updates[FirebaseKeys.REQUEST.START.ADDRESS] = position.streetName + " " + position.streetNumber;
                    updates[FirebaseKeys.REQUEST.START.CITY] = position.locality;
                    updates[FirebaseKeys.REQUEST.DESTINATION.LAT] = routeData.routes[0].legs[0].end_location.lat;
                    updates[FirebaseKeys.REQUEST.DESTINATION.LONG] = routeData.routes[0].legs[0].end_location.lng;
                    updates[FirebaseKeys.REQUEST.DESTINATION.ADDRESS] = destination.address;
                    updates[FirebaseKeys.REQUEST.DESTINATION.CITY] = destination.city;

                    firebaseApp.database().ref(FirebaseKeys.REQUEST_NODE)
                        .push()
                        .update(updates);
                }));
        }
    }


    onRijden() {

        if (this.state.driving === this.NOTDRIVING) {
            var routeData = this.state.mapsPage.getRouteData();
            //console.log("routeData: ");
            //console.debug(routeData);
            if (routeData != null && routeData != '') {
                this.fetchCars();
                this.setState({selectCarModal: true});

            }
        } else if (this.state.driving === this.DRIVING) {
            this.setState({driving: this.NOTDRIVING});
            LocationHandler.stopDriverLocationUpload();
        }
    }

    fetchCars() {
        CarManager.getCars()
            .then(cars => {
                console.log('cars:');
                console.log(cars);
                if (cars.length > 0) {
                    this.setState({
                        selectCarsDataSource: this.state.selectCarsDataSource.cloneWithRows(cars),
                        selectCarsError: ""
                    });
                } else {
                    this.setState({selectCarsError: "Geen auto's gevonden"})
                }
            });
    }

    renderCarRow(car, sectionId, rowId, highlightRow) {
        return (

            <TouchableHighlight onPress={() => this.onSelectCar(car)}>
                <Text>{car.name}</Text>
            </TouchableHighlight>
        );
    }

    onSelectCar(car) {
        this.setState({driving: this.DRIVING, selectCarModal: false});
        CarManager.setCurrentCar(car);
        LocationHandler.startDriverLocationUpload(car);
        this.setDrivingMode();
    }

    callPassenger() {
        RNSendIntent.sendPhoneCall(this.state.passengerPhone);
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    {this.state.content}
                </View>
                <Modal isVisible={this.state.isModalVisible} backdropOpacity={0.30}>
                    <View style={styles.modalWindow}>
                        <Text style={styles.modalOverview}>Wanneer?</Text>
                        <Hr lineColor='#998e88'/>
                        <View style={styles.selectNowOrDelay}>
                            <TouchableHighlight style={styles.modalTextBox1} onPress={() => this.selectNow()}
                                                underlayColor={'#998e88'}>
                                <Text style={styles.modalText}>
                                    Nu {this.state.currentTime}
                                </Text>
                            </TouchableHighlight>
                            <View style={styles.modalDelayBox}>
                                <TouchableHighlight style={styles.modalTextBox2}
                                                    onPress={this.openDropDownTimeModal.bind(this)}
                                                    underlayColor={'#998e88'}>
                                    <Text style={styles.modalText}>
                                        Straks
                                    </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.isTimeModal} backdropOpacity={0.30}>
                    <View style={styles.modalSelectTimeWindow}>
                        <Text style={styles.modalOverview}>{this.state.setSelectedTime}</Text>
                        <Text style={styles.modalOverview}>Tijdstip?</Text>
                        <Hr lineColor='#998e88'/>
                        {this.getTimeArray()}
                        <Hr lineColor='#998e88'/>
                        <Button
                            style={{marginTop: 10}}
                            title={'Terug'}
                            onPress={this.closeDropDownTimeModal.bind(this)}
                        />
                        <Button
                            style={{marginTop: 10}}
                            title={'Refresh tijd'}
                            onPress={this.setAllTimeInArray.bind(this)}
                        />
                        <Button
                            style={{marginTop: 10}}
                            title={'Go!'}
                            onPress={() => this.setSelectedTime()}
                        />
                    </View>
                </Modal>

                <Modal isVisible={this.state.selectCarModal}
                       transparent={true}
                       onRequestClose={() => this.setState({selectCarModal: false})}
                       style={styles.selectCarModal}
                >
                    <HeaderBar onBackPressed={() => this.setState({selectCarModal: false})} title="Selecteer een auto"/>
                    <View style={Styles.headerContainer}>
                        <Text>{this.state.selectCarsError}</Text>
                        <ListView dataSource={this.state.selectCarsDataSource}
                                  renderRow={this.renderCarRow.bind(this)}/>
                    </View>
                </Modal>


                <Modal isVisible={this.state.passengerModal}
                       transparent={true}
                       onRequestClose={() => this.setState({passengerModal: false})}
                >
                    <HeaderBar onBackPressed={() => this.setState({passengerModal: false})} title="Passagier"/>
                    <View style={Styles.headerContainer}>
                    <View style={{backgroundColor: 'white'}}>
                        <Image style={styles.passengerPicture} source={{uri: this.state.passengerPicture}} />

                    <Text>Van: {this.state.passengerStartAddress} {this.state.passengerStartCity}</Text>
                    <Text>Naar: {this.state.passengerDestAddress} {this.state.passengerDestCity}</Text>
                    <TouchableHighlight onPress={() => this.callPassenger()}>
                        <View>
                            <Text>Bellen</Text>
                            <Image style={styles.personImage} source={require('../../../images/manfull_ROOD.png')} />

                        </View>

                    </TouchableHighlight>
                    </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    personImage: {
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: -16,
        width: 40,
        height: 80
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        alignSelf: 'stretch'
    },
    buttonContainer: {
        alignSelf: 'stretch',

    },
    comboBox: {
        height: 60,
        width: 160,
    },
    selectCarModal: {
        backgroundColor: '#FFFFFF'
    },
    selectDriveOption: {

        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        alignSelf: 'stretch'
    },
    submitTop: {
        height: 80,
        width: 162,
        backgroundColor: 'white',
        borderColor: '#998e88',
        borderRightWidth: 1,
        padding: 25,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    submitBottom: {
        height: 80,
        width: 162,
        backgroundColor: 'white',
        borderColor: '#998e88',
        borderLeftWidth: 1,
        padding: 25,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
    },
    submitText: {
        textAlign: 'center',
        fontSize: 25,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
        alignSelf: 'stretch'
    },
    modalWindow: {
        height: 160,
        width: 325,
        padding: 15,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: 1,
        borderColor: '#998e88'
    },
    modalOverview: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    selectNowOrDelay: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalTextBox1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: 110,
        width: 102,
    },
    modalDelayBox: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    modalTextBox2: {
        flex: 1,
        borderLeftWidth: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 110,
        width: 102,
    },
    modalText: {
        fontSize: 20,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: 'center',
    },
    modalSelectTimeWindow: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        width: 325,
        backgroundColor: 'white',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: 1,
        borderColor: '#998e88'
    },
    modalSelectTimeText: {
        fontSize: 20,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: 'center',
    },
    passengerPicture: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    travelButton: {

        justifyContent: 'center',
        alignSelf: 'stretch',
        marginTop: 0,


    }

});

AppRegistry.registerComponent('BottomBar', () => BottomBar);
