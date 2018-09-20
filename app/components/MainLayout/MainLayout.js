import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Alert,
    Modal,
    Button,
    AppState,
    ListView,
    Image,
    TouchableHighlight, ScrollView, TouchableOpacity, LayoutAnimation
} from 'react-native';

import DrawerLayout from 'react-native-drawer-layout';
import TopBar from "./TopBar";
import DrawerView from "./DrawerView";
import MapsPage from "../pages/MapsPage";
import firebaseApp from "../Firebase/Firebase";
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import FCM, {FCMEvent} from 'react-native-fcm';
import TTS from '../TTS/TTSService';
import {NativeModules} from 'react-native';
import DestinationInput from '../pages/DestinationInput';
import {Card} from 'react-native-material-design';
import Geocoder from 'react-native-geocoder';

SpeechModule = NativeModules.SpeechModule;
import loc from '../Localization/loc';
import OptionsPage from "../pages/OptionsPage";
import HistoryPage from "../pages/HistoryPage";
import RegisterPage from "../pages/RegisterPage";
import DriverPage from "../pages/DriverPage";
import HeaderBar from "../UI/HeaderBar";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Styles from '../../styles/styles';
import HideableView from 'react-native-hideable-view';
import ModalExtern from 'react-native-modal';
import renderIf from '../pages/renderif'
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import KeepAwake from 'react-native-keep-awake';

export default class MainLayout extends Component {

    data;
    notificationListener;

    drawer;
    drawerView;
    optionsPage;
    historyPage;

    mapsPage;

    bottomBar;
    contentComponment;

    DEFAULT_PASSENGER_IMAGE = require('../../../images/jille.jpg');

    constructor(props) {
        super(props);

        this.data = props.data;
        this.mapsPage = (<MapsPage main={this} navigator={props.navigator} data={this.data}
                                   ref={(ref) => this.contentComponment = ref}
        />);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        pages = {};
        pages['driver'] = true;
        pages['maps'] = false;
        pages['options'] = false;
        pages['history'] = false;

        this.state = {
            message: 'Naam',
            drawer: null,
            title: '',
            count: 0,
            requestModal: false,
            acceptModal: false,
            requestStoppingModal: false,
            driverStoppingModal: false,
            ref: '',
            page: 'maps',
            content: this.mapsPage,
            semiMatchModal: false,
            semiMatches: null,
            semiDataSource: ds,
            pages: pages,
            facebookInfo: false,
            arrowFacebookInfo: 'keyboard-arrow-down',
            facebookFlexNumber: 0.1,
            passengerImage: this.DEFAULT_PASSENGER_IMAGE,
            tokenMaken: null,
            passengerId: null,
            passengerName: null,
            driverName: null
        };


        loc.setLanguage('nl');

        this.changeScreen.bind(this);

    }
    componentWillMount(){
        KeepAwake.activate();
        console.log('ik bouw iets op!!!!!');
    }

    componentDidMount() {
        KeepAwake.activate();
        FCM.getFCMToken().then(token => {
            console.log("token: " + token);
        });
        this.notificationListener = FCM.on(FCMEvent.Notification,(notification) => {

           let type = notification.type;
           let requestStopping ='requestStopping';
           let driverStopping ='driverStopping';
            console.log('verzoekje');
            console.log(type);
            console.log('verzoekje');
           /* passenger stops request */
           if (type === requestStopping){
               console.log('het stoppen van een request is gestart');
               this.setState({passengerName: notification.passenger});
               this.setState({requestStoppingModal: true});
               firebaseApp.database().ref("drivers/"+notification.driverID+"/passengers/"+notification.userID).remove();
               setTimeout(() => {
                   LayoutAnimation.spring();
                   this.setState({requestStoppingModal: false});
                   this.contentComponment.getPassenger();
               }, 4500)
           }
            /* driver stops request */
            if (type === driverStopping){
                console.log('het stoppen van een driver is gestart');
                console.log(notification.driverName);
                this.setState({driverName: notification.driverName});
                this.setState({driverStoppingModal: true});
                if (this.contentComponment !== undefined){
                    this.contentComponment.clearDestination(true);
                }
                // this.props.clearDestination();
                setTimeout(() => {
                    LayoutAnimation.spring();
                    this.setState({driverStoppingModal: false});
                }, 4500);
            }


            /* Driver ontvangt verzoek*/
            if (type === FirebaseKeys.FCM.NOTIFICATION.TYPE.REQUEST) {
                ref = notification.ref;
                console.log(notification);

                /*Dubbel verzoek - gaan we zo mee verder*/
                console.log("Driver krijgt een verzoek!!!!!!!!!!!!!!!!!!!!!!!!!");
                name = notification.passenger,
                passengerId = notification.userID;
                lat = notification.lat;
                long = notification.long;
                destLat = notification.destLat;
                destLong = notification.destLong;
                console.log('OO');
                console.log(passengerId);
                console.log('OO');

                    console.log('ik kom mega vaak hierin');
                    message = this.generateRequestMessage(notification);
                    firebaseApp.database()
                        .ref(FirebaseKeys.USER_NODE)
                        .child(passengerId)
                        .child(FirebaseKeys.USER.PICTURE)
                        .once(FirebaseKeys.VALUE.ONCE)
                        .then(image => {
                            if (image) {
                                console.log("image: " , image.val());
                                firebaseApp.storage()
                                    .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                                    .child(image.val())
                                    .getDownloadURL()
                                    .then(url => {
                                        console.log("url: " , url);
                                        this.setState({
                                            title: "Nieuw verzoek",
                                            message: name,
                                            requestModal: false,
                                            passengerImage: {uri: url},
                                            passengerName: name,
                                            passengerId: passengerId,
                                            lat: lat,
                                            long: long,
                                            destLat: destLat,
                                            destLong: destLong
                                        });
                                        this.contentComponment.openRequestModal("Nieuw verzoek", name, true, {uri: url}, name, passengerId, lat, long, destLat, destLong, ref);
                                    });
                            } else {
                                this.setState({
                                    title: "Nieuw verzoek",
                                    message: name,
                                    requestModal: false,
                                    passengerImage: this.DEFAULT_PASSENGER_IMAGE,
                                    passengerName: name,
                                    passengerId: passengerId,
                                    lat: lat,
                                    long: long,
                                    destLat: destLat,
                                    destLong: destLong
                                });
                                this.contentComponment.openRequestModal("Nieuw verzoek", name, true, this.DEFAULT_PASSENGER_IMAGE, name, passengerId, lat, long, destLat, destLong, ref);
                            }
                        });
                    // this.openRequestModal(message, passengerId, lat, long, destLat, destLong);
                }


            /* Passagier ontvangt notificatie dat driver heeft geaccepteerd */
            else if (type === FirebaseKeys.FCM.NOTIFICATION.TYPE.ACCEPTED) {
                driver = notification.driver;
                driverID = notification.driverID;
                ref = notification.ref;
                 message = this.generateAcceptMessage(notification, false);

                this.openAcceptedModal(message);
                this.driverListener(driverID, ref);
            }

            /* Bevestiging voor de driver dat zijn acceptatie is geslaagd*/
            else if (type === 'accepted-driver') {
                console.log('de bestuurder krijgt bevestiging dat de rit geslaagd is(accepteren');
                passengerName = notification.passenger;
                passengerId = notification.passengerId;
                passengerLat = notification.passengerLat;
                passengerLong = notification.passengerLong;
                passengerDesLat = notification.passengerDesLat;
                passengerDesLong = notification.passengerDesLong;
                this.setState({passengerLat: notification.passengerLat, passengerLong: notification.passengerLong, passengerDesLat: notification.passengerDesLat, passengerDesLong: notification.passengerDesLong});
                ref = notification.ref;
                console.log('helemaal gek geaccepteerd');
                // console.log(this.state.passengerLat);
                message = this.generateAcceptMessage(notification, true);
                this.openAcceptedModal(message);
                if (AppState.currentState !== 'active') {
                    this.onAcceptedNotification(ref, message);
                }
                if (this.bottomBar) {
                    this.bottomBar.setDrivingModeWithPassenger(ref, passengerId, passengerName, passengerLat, passengerLong, passengerDesLat, passengerDesLong);
                }

            }

            else if (type === 'semi-request') {
                ref = notification.ref;
                //console.log(notification);
                console.log("Driver krijgt een verzoek!!!!!!!!!!!!!!!!!!!!!!!!! - semi-request");
                name = notification.passenger,
                    passengerId = notification.userID;
                lat = notification.lat;
                long = notification.long;
                destLat = notification.destLat;
                destLong = notification.destLong;
                message = this.generateRequestMessage(notification);

                    firebaseApp.database()
                        .ref(FirebaseKeys.USER_NODE)
                        .child(passengerId)
                        .child(FirebaseKeys.USER.PICTURE)
                        .once(FirebaseKeys.VALUE.ONCE)
                        .then(image => {
                            if (image) {
                                console.log("image: ", image.val());
                                firebaseApp.storage()
                                    .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                                    .child(image.val())
                                    .getDownloadURL()
                                    .then(url => {
                                        console.log("url: ", url);
                                        this.setState({
                                            title: "Nieuw verzoek",
                                            message: name,
                                            requestModal: false,
                                            passengerImage: {uri: url},
                                            passengerName: name,
                                            passengerId: passengerId,
                                            lat: lat,
                                            long: long,
                                            destLat: destLat,
                                            destLong: destLong
                                        });
                                        this.contentComponment.openRequestModal("Nieuw verzoek", name, true, {uri: url}, name, passengerId, lat, long, destLat, destLong, ref);
                                    });
                            } else {
                                this.setState({
                                    title: "Nieuw verzoek",
                                    message: name,
                                    requestModal: false,
                                    passengerImage: this.DEFAULT_PASSENGER_IMAGE,
                                    passengerName: name,
                                    passengerId: passengerId,
                                    lat: lat,
                                    long: long,
                                    destLat: destLat,
                                    destLong: destLong
                                });
                                this.contentComponment.openRequestModal("Nieuw verzoek", name, true, this.DEFAULT_PASSENGER_IMAGE, name, passengerId, lat, long, destLat, destLong, ref);
                            }
                        });
                    // this.openRequestModal(message, passengerId, lat, long, destLat, destLong);
                }


            else if (type === 'semi-accepted') {
                console.log('semi-accepted');
            }

            else if (type === 'semi-accepted-driver') {
                console.log('semi-accepted-driver');
            }

        });
        console.log("notificationListener set");
        this.optionsPage = (<OptionsPage mainLayout={this}/>);
        this.historyPage = (<HistoryPage/>);
        this.registerPage = (<RegisterPage/>);
        this.forceUpdate();
        // this.topBar.setNavigationBar();
        this.topBar.setTextBar('Bestuurder');
    }


    generateRequestMessage(notification) {
        lat = notification.lat;
        long = notification.long;
        name = notification.passenger;
        this.setState({ref: ref});
       // inCommon = JSON.parse(notification.inCommon);
        address = notification.address;
        city = notification.city;
        console.log(notification.userID + ' == GEBRUIKERSID');
        userID = notification.userID;

        // message = name + ' wilt met u meerijden vanaf ' + address + ", " + city + ". ";
        // if (inCommon['place'] && inCommon['place'] !== null && inCommon['place'] !== undefined) {
        //     message += (' ' + name + ' komt ook uit ' + inCommon['place']);
        // }
        message = name;
        // console.log('==============');
        // console.log(userID);
        // console.log('==============');
        return message;
    }

    generateAcceptMessage(notification, driver) {
        if (driver) {
            return notification.passenger
        } else {
            return notification.driver
        }
    }

    setBottomBar(bottomBar) {
        this.bottomBar = bottomBar;
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

    updateContent(page) {
        let pages = this.state.pages;
        for (pagename in pages) {
            if (pages.hasOwnProperty(pagename)) {
                if (pages[pagename]) {
                    pages[pagename] = false;
                }
            }
        }
        switch (page) {
            case 'maps':
                //component = this.mapsPage;
                this.checkGPS();
                pages['maps'] = true;
                this.topBar.setTextBar('Reizen');
                this.topBar.updateLocations();
                break;
            case 'options':
                //component = this.optionsPage;
                pages['options'] = true;
                this.topBar.setTextBar('Instellingen');
                break;
            case 'history' :
                pages['history'] = true;
                //component = this.historyPage;
                this.topBar.setTextBar('Geschiedenis');
                break;
            case 'driver':
                pages['driver'] = true;
                this.topBar.setTextBar('Bestuurder');
                break;
        }

        this.setState({page: page, pages: pages});
    }

    changeScreen(page) {
        if (this.drawer) {
            this.drawer.closeDrawer();
        }
        this.updateContent(page);
        this.forceUpdate();
    }


    openRequestModal(name, passengerId, lat, long, destLat, destLong) {
        console.log("openRequestModal() baas functie");
        console.log(name);
        console.log(passengerId);
        console.log(lat);
        console.log(long);
        console.log(destLat);
        console.log(destLong);
        firebaseApp.database()
            .ref(FirebaseKeys.USER_NODE)
            .child(passengerId)
            .child(FirebaseKeys.USER.PICTURE)
            .once(FirebaseKeys.VALUE.ONCE)
            .then(image => {
                if (image) {
                    console.log("image: " , image.val());
                    firebaseApp.storage()
                        .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                        .child(image.val())
                        .getDownloadURL()
                        .then(url => {
                            console.log("url: " , url);
                            this.setState({
                                title: "Nieuw verzoek",
                                message: name,
                                requestModal: true,
                                passengerImage: {uri: url},
                                passengerName: name,
                                passengerId: passengerId,
                                lat: lat,
                                long: long,
                                destLat: destLat,
                                destLong: destLong
                            });
                        });
                } else {
                    this.setState({
                        title: "Nieuw verzoek",
                        message: name,
                        requestModal: true,
                        passengerImage: this.DEFAULT_PASSENGER_IMAGE,
                        passengerName: name,
                        passengerId: passengerId,
                        lat: lat,
                        long: long,
                        destLat: destLat,
                        destLong: destLong
                    });
                }
            });
    }


    onAcceptedStartTTS(name) {
        TTS.addEventListener('tts-finish', () => console.log('done accepted'));
        TTS.speak('Match is gemaakt. ' + name + ' komt u ophalen');
    }

    openAcceptedModal(message) {
        LayoutAnimation.spring();
        this.setState({title: 'Match is gemaakt', message: message, acceptModal: true});
        setTimeout(() => {
            LayoutAnimation.spring();
            this.setState({acceptModal: false});
        }, 3500)

    }

    driverListener(driverID, ref) {
        firebaseApp.database().ref(FirebaseKeys.USER_NODE)
            .child(driverID)
            .child(FirebaseKeys.USER.PICTURE)
            .once(FirebaseKeys.VALUE.ONCE)
            .then(snapshot => {
                let picture = snapshot.val();
                if (picture !== null) {
                    firebaseApp.storage()
                        .ref(FirebaseKeys.STORAGE.PROFILE_PICTURE)
                        .child(picture)
                        .getDownloadURL().then((url) => {
                        this.setDriverInMaps(driverID, ref, {uri: url});
                    });
                } else {
                    this.setDriverInMaps(driverID, ref, this.DEFAULT_PASSENGER_IMAGE);
                }
            });

    }

    setDriverInMaps(driverID, profilePicture){
        console.log('---');
        console.log(driverID);
        console.log(profilePicture);
        console.log('---');
        this.contentComponment.setDriverID(driverID);
        firebaseApp.database()
            .ref(FirebaseKeys.DRIVER_NODE)
            .child(driverID)
            .on(FirebaseKeys.VALUE.VALUE, (snapshot) => {
                let hasPassengers = snapshot.child("passengers").val();
                if(hasPassengers != null){
                    let driverName = snapshot.child(FirebaseKeys.DRIVER.NAME).val();
                    let lat = snapshot.child(FirebaseKeys.DRIVER.LAT).val();
                    let long = snapshot.child(FirebaseKeys.DRIVER.LONG).val();
                    let carbrand = snapshot.child('carbrand').val();
                    let carcolour = snapshot.child('carcolour').val();
                    let carlicense = snapshot.child('carlicense').val();
                        if (lat && long) {
                            this.contentComponment.setDriverLocation(lat, long, driverName, profilePicture, carbrand, carcolour, carlicense);
                        }
                }
            });
    }


    updateProfilePicture() {
        if (this.drawerView) {
            this.drawerView.loadProfilePicture();
        }
    }

    getSelectedLocation() {
        return this.topBar.getSelectedLocation();
    }


    renderSemiMatch(semimatch, sectionId, rowId, highlightRow) {
        date = new Date(semimatch.timestamp);
        return (<View>
            <Text>{semimatch.name}</Text>
            <Text>Van: {semimatch.address} {semimatch.city}</Text>
            <Text>Naar: {semimatch.destaddress} {semimatch.destcity}</Text>
            <Text>Tijd: {date.toLocaleTimeString()}</Text>
            <TouchableHighlight onPress={() => this.onSemiMatchPressed(semimatch)}>
                <Icon name="directions" size={30}/>
            </TouchableHighlight>
        </View>);
    }

    onSemiMatchPressed(semimatch) {
        Alert.alert(
            'Bevestigen',
            'Match maken met ' + semimatch.name + "?",
            [

                {text: 'Nee', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Ja', onPress: () => this.onMakeSemiMatch(semimatch)},
            ],
            {cancelable: false}
        )
    }

    onMakeSemiMatch(semimatch) {
        console.log('gebeurt bij jou wel');
        updates = {};
        updates[FirebaseKeys.REQUEST.DRIVER.UID] = firebaseApp.auth().currentUser.uid;
        updates[FirebaseKeys.REQUEST.DRIVER.NAME] = firebaseApp.auth().currentUser.displayName;
        updates[FirebaseKeys.REQUEST.STATE] = FirebaseKeys.REQUEST.STATES_SEMI.DRIVERACCEPTED;
        firebaseApp.database()
            .ref(FirebaseKeys.REQUEST_NODE)
            .child(semimatch.ref)
            .update(updates)
            .then(() => {
                this.setState({semiMatchModal: false})
            });
    }

    updateDrawerViewName() {
        if (this.drawerView) {
            this.drawerView.fetchName();
        }
    }

    render() {
        navigationView = (
            <DrawerView mainLayout={this} navigator={this.props.navigator} ref={(ref) => this.drawerView = ref}/>
        );
        return (

            <DrawerLayout
                drawerWidth={225}
                drawerPosition={DrawerLayout.positions.Left}
                renderNavigationView={() => navigationView}
                ref={(ref) => {
                    this.drawer = ref;
                    this.topBar.setDrawer(ref);
                    this.topBar.setContentComponent(this.contentComponment)
                }}

            >
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



                <ModalExtern
                    animationType={"slide"}
                    transparent={true}
                    isVisible={this.state.driverStoppingModal}
                    backdropOpacity={0.60}
                    onRequestClose={() => this.setState({driverStoppingModal: false})}
                    style={styles.modal}
                >
                    <Card style={{
                        paddingLeft: -16,
                        paddingRight: -16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 16
                    }}>
                        <Text style={{color: '#6F0091', fontWeight: 'bold', fontSize: 18}}>{this.state.driverName}</Text>

                        <View
                            style={{paddingTop: 10, paddingBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{
                                color: '#000000',
                                fontWeight: 'bold',
                                fontSize: 15,
                                paddingTop: 5,
                                paddingBottom: 10
                            }}>Heeft de rit geannuleerd</Text>

                        </View>
                    </Card>

                </ModalExtern>


                <ModalExtern
                    animationType={"slide"}
                    transparent={true}
                    isVisible={this.state.requestStoppingModal}
                    backdropOpacity={0.60}
                    onRequestClose={() => this.setState({requestStoppingModal: false})}
                    style={styles.modal}
                >
                    <Card style={{
                        paddingLeft: -16,
                        paddingRight: -16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 16
                    }}>
                        <Text style={{color: '#6F0091', fontWeight: 'bold', fontSize: 18}}>{this.state.passengerName}</Text>

                        <View
                            style={{paddingTop: 10, paddingBottom: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{
                                color: '#000000',
                                fontWeight: 'bold',
                                fontSize: 15,
                                paddingTop: 5,
                                paddingBottom: 10
                            }}>Rijdt niet meer mee</Text>

                        </View>
                    </Card>

                </ModalExtern>


                <ModalExtern
                    animationType={"slide"}
                    transparent={true}
                    backdropOpacity={0.60}
                    visible={this.state.semiMatchModal}
                    onRequestClose={() => this.setState({semiMatchModal: false})}
                >
                    <HeaderBar onBackPressed={() => this.setState({semiMatchModal: false})} title="sagbe"/>
                    <View style={Styles.headerContainer}>
                        <ScrollView>
                            <ListView dataSource={this.state.semiDataSource}
                                      renderRow={this.renderSemiMatch.bind(this)}/>
                        </ScrollView>
                    </View>
                </ModalExtern>
                <View style={styles.container}>
                    <TopBar style={styles.topBar} ref={(ref) => this.topBar = ref}/>
                    <View style={styles.contents}>
                        {renderIf(this.state.pages['maps'])(
                            <View style={styles.content}>
                                <MapsPage main={this} navigator={this.props.navigator} data={this.data} ref={(ref) => this.contentComponment = ref}>
                                </MapsPage>
                            </View>
                        )}
                        {renderIf(this.state.pages['driver'])(
                            <View style={styles.content}>
                                <DriverPage main={this} navigator={this.props.navigator} data={this.data} ref={(ref) => this.contentComponment = ref}>
                                </DriverPage>
                            </View>
                        )}
                        {renderIf(this.state.pages['options'])(
                            <View style={styles.content}>
                                <OptionsPage mainLayout={this}/>
                            </View>
                        )}
                        {renderIf(this.state.pages['history'])(
                            <View style={styles.content}>
                                <HistoryPage />
                            </View>
                        )}
                    </View>
                </View>
            </DrawerLayout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F5FCFF',
        justifyContent: 'center',
    },
    content: {
        flex: 12,
        marginTop: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        zIndex: 1,
    },
    content2: {
        flex: 12,

        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        zIndex: 2,
    },
    contents: {
        flex: 12,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 3,
    },
    topBar: {
        flex: 1,
    },
    requestModal: {
        marginLeft: -16,
        marginRight: -16,
        marginBottom: -10
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
    }
});

AppRegistry.registerComponent('MainLayout', () => MainLayout);
