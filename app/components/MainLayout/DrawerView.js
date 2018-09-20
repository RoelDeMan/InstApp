
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    AsyncStorage,
    Alert,
} from 'react-native';

import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import FCM from 'react-native-fcm';
import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk';
import ProgressImage from 'react-native-image-progress';
import ProgressPie from 'react-native-progress/Pie';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

export default class DrawerView extends Component {

    DEFAULT_ICON = require('../../../images/photowit.png');

    ACTIVE_COLOR = '#FC0D7F';
    DISABLED_COLOR= '#2E2E2E';

    constructor(props) {
        super(props);
        colors = {};
        colors['maps'] = this.DISABLED_COLOR;
        colors['history'] = this.DISABLED_COLOR;
        colors['options'] = this.DISABLED_COLOR;
        colors['driver'] = this.ACTIVE_COLOR;
        this.state = {
            username: '',
            name: firebaseApp.auth().currentUser.displayName,
            main: props.mainLayout,
            profilePicture: '',
            colors: colors,
            firstName: '',
            lastName: '',
            huidigePage: 'driver'
        };
        this.onBestuurder = this.onBestuurder.bind(this);
        this.onReizen = this.onReizen.bind(this);
        this.onProfiel = this.onProfiel.bind(this);
        this.onGeschiedenis = this.onGeschiedenis.bind(this);
        this.loadProfilePicture();
    }

    componentDidMount() {
        this.loadProfilePicture();
        this.fetchName();
        this.forceUpdate();
        this.storePicture();
    }

    storePicture(){
        AsyncStorage.getItem("storeProfilePicture").then((value) => {
            this.setState({fototje: {value}});
            console.log(value);
        }).done();
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

    onBestuurder(childSnapshot){
        this.state.main.changeScreen('driver');
        this.changeDrawerColors('driver');
        if(childSnapshot != null){
            firebaseApp.database().ref('requests/'+childSnapshot).remove();
        }
    }


    deleteDriverAlert(value){
        console.log('tazz');
        console.log('wholla');
        console.log(value);
        console.log('wholla');
        let uid = firebaseApp.auth().currentUser.uid;
        console.log(this.state.huidigePage);
        if (this.state.huidigePage === 'driver'){
            firebaseApp.database()
                .ref('drivers/'+uid)
                .once('value')
                .then((snapshot) => {
                    if(snapshot.val() != null){
                        if(value === 'profile'){
                            Alert.alert(
                                'Weet u het zeker?',
                                "Als u dit scherm verlaat wordt uw rit geannuleerd.",
                                [
                                    {text: 'Nee', style: 'Cancel', onPress: () => console.log('gebeurt niks!')},
                                    {text: 'Ja', onPress: () => this.onProfiel('driver')}
                                ],
                                {cancelable: true}
                            );
                        }else{
                            Alert.alert(
                                'Weet u het zeker?',
                                "Als u dit scherm verlaat wordt uw rit geannuleerd.",
                                [
                                    {text: 'Nee', style: 'Cancel', onPress: () => console.log('gebeurt niks!')},
                                    {text: 'Ja', onPress: () => this.onReizen()}
                                ],
                                {cancelable: true}
                            );
                        }
                    }else{
                        if(value === 'profile'){
                            this.onProfiel('driver');
                        }
                        else{
                            if( value === this.state.huidigePage){
                                this.onBestuurder();
                            }else{
                                this.onReizen();
                            }
                        }
                    }
                });
        }else if(this.state.huidigePage === 'maps'){
            let isRequest = false;
            let snapShot = null;
            firebaseApp.database()
                .ref('requests/')
                .once('value')
                .then((snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        snapShot = childSnapshot.key;
                        let dbid = childSnapshot.val();
                        if(dbid.uid === uid){
                            console.log('value');
                            console.log(value);
                            console.log('value');
                            if(value === 'profile'){
                                Alert.alert(
                                    'Weet u het zeker?',
                                    "Als u dit scherm verlaat wordt uw rit geannuleerd.",
                                    [
                                        {text: 'Nee', style: 'Cancel', onPress: () => console.log('gebeurt niks!')},
                                        {text: 'Ja', onPress: () => this.onProfiel('maps', snapShot)}
                                    ],
                                    {cancelable: true}
                                );
                            }else{
                                Alert.alert(
                                    'Weet u het zeker?',
                                    "Als u dit scherm verlaat wordt uw rit geannuleerd.",
                                    [
                                        {text: 'Nee', style: 'Cancel', onPress: () => console.log('gebeurt niks!')},
                                        {text: 'Ja', onPress: () => this.onBestuurder(snapShot)}
                                    ],
                                    {cancelable: true}
                                );
                            }
                            isRequest = true;
                        }
                    });
                    if (isRequest === false){

                        if(value === 'profile'){
                            this.onProfiel('maps', snapShot);
                        }else {
                            if(value === this.state.huidigePage){
                                this.onReizen();
                            }else{
                                this.onBestuurder(null);
                            }

                        }
                    }
                });
        }
        else if(this.state.huidigePage === 'options'){
            if(value === 'driver'){
                this.onBestuurder();
            }else if(value === 'maps'){
                this.onReizen();
            }else{
                console.log('boe');
                this.onProfiel();
            }

        }

    }

    checkGPS(){
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Uw locatie staat uit</h2>Zet jezelf op de kaart!",
            ok: "Activeren",
            cancel: "Sluiten",
            enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
            showDialog: true, // false => Opens the Location access page directly
            openLocationServices: true, // false => Directly catch method is called if location services are turned off
            preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
            preventBackClick: false //true => To prevent the location services popup from closing when it is clicked back button
        }).then(function() {
                let uid = firebaseApp.auth().currentUser.uid;
                firebaseApp.database().ref("drivers/"+uid).remove();
                this.state.main.changeScreen('maps');
                this.changeDrawerColors('maps');
            }.bind(this)
        ).catch((error) => {
                console.log(error.message);
        });
    }

    onReizen() {
        this.checkGPS();
    }

    onProfiel(value, childSnapshot) {
        console.log('kom jij hier');
        console.log(value);
        console.log(childSnapshot);
        console.log('kom jij hier');
        let uid = firebaseApp.auth().currentUser.uid;
        if(value === 'driver'){
            firebaseApp.database().ref("drivers/"+uid).remove();
        }else if(value === 'maps'){
            if(childSnapshot != null){
                firebaseApp.database().ref('requests/'+childSnapshot).remove();
            }
        }
        this.changeDrawerColors('options');
        this.state.main.changeScreen('options');
    }

    onGeschiedenis() {
        this.changeDrawerColors('history');
        this.state.main.changeScreen('history');
    }

    onUitloggen() {
        console.log('onUitloggen');
        AccessToken.getCurrentAccessToken()
            .then((accessToken) => {
                if (accessToken) {
                    LoginManager.logOut();
                }
                FCM.unsubscribeFromTopic(FirebaseKeys.FCM.TOPICS + firebaseApp.auth().currentUser.uid);
                firebaseApp.auth().signOut();
                // this.props.navigator.push({name: 'Login', data: null});
            });
    }

    changeDrawerColors(page){
        console.log(page);
        this.setState({huidigePage: page});
        colors = this.state.colors;
        for(color in colors){
            if(colors.hasOwnProperty(color)){
                if(colors[color] == this.ACTIVE_COLOR)
                    colors[color] = this.DISABLED_COLOR;
            }
        }
        colors[page] = this.ACTIVE_COLOR;
        this.setState({colors: colors});
    }



    render() {
        progressBar = (<ProgressPie progress={0} size={30} indeterminate={true} color="#FC1885"/>);
        return (
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <View style={styles.profileNameIconContainer}>
                        <View style={styles.iconContainer}>
                            <Image style={[StyleSheet.absoluteFill,styles.icon]} source={this.state.profilePicture}
                                /*indicator={progressBar}*//>
                        </View>
                        <Text style={styles.name}>{this.state.firstName}</Text>
                        <Text style={styles.name}>{this.state.lastName}</Text>

                    </View>
                    <View style={styles.logoutButtonContainer}>
                        <TouchableHighlight onPress={() => this.onUitloggen()} style={styles.logoutButton}
                                            underlayColor={styles.drawerItemColor.color}><Text
                            style={styles.logoutButtonText}>Uitloggen</Text></TouchableHighlight>
                    </View>
                </View>


                <View style={styles.drawerList}>

                    <TouchableHighlight onPress={() => this.deleteDriverAlert('driver')} style={styles.drawerItem}
                                        underlayColor={styles.drawerItemColor.color}>
                        <View style={styles.drawerListButtonContainer}>
                            <Icon name="directions-car" size={30} style={styles.drawerListIcon} color={this.state.colors['driver']}/>
                            <Text style={[styles.drawerItemText,{color: this.state.colors['driver']}]}>Bestuurder</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => this.deleteDriverAlert('maps')} style={styles.drawerItem}
                                        underlayColor={styles.drawerItemColor.color}>
                        <View style={styles.drawerListButtonContainer}>
                            <Icon name="directions-walk" size={30} style={styles.drawerListIcon} color={this.state.colors['maps']}/>
                            <Text
                                style={[styles.drawerItemText,{color: this.state.colors['maps']}]}>Reizen</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => this.deleteDriverAlert('profile')} style={styles.drawerItem}
                                        underlayColor={styles.drawerItemColor.color}>
                        <View style={styles.drawerListButtonContainer}>
                            <Icon name="person" size={30} style={styles.drawerListIcon} color={this.state.colors['options']}/><Text
                            style={[styles.drawerItemText,{color: this.state.colors['options']}]}>Profiel</Text>
                        </View>
                    </TouchableHighlight>

                    {/*<TouchableHighlight onPress={() => this.onGeschiedenis()} style={styles.drawerItem}*/}
                                        {/*underlayColor={styles.drawerItemColor.color}>*/}
                        {/*<View style={styles.drawerListButtonContainer}>*/}
                            {/*<Icon name="schedule" size={30} style={styles.drawerListIcon} color={this.state.colors['history']}/>*/}
                            {/*<Text*/}
                                {/*style={[styles.drawerItemText,{color: this.state.colors['history']}]}>Geschiedenis</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableHighlight>*/}
                    {/*<TouchableHighlight onPress={() => this.storePicture()} style={styles.drawerItem}*/}
                                        {/*underlayColor={styles.drawerItemColor.color}>*/}
                        {/*<View style={styles.drawerListButtonContainer}>*/}
                            {/*<Icon name="schedule" size={30} style={styles.drawerListIcon} color={this.state.colors['history']}/>*/}
                            {/*<Text*/}
                                {/*style={[styles.drawerItemText,{color: this.state.colors['history']}]}>Geschiedenis</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableHighlight>*/}
                    <View>


                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    icon: {
        flex: 1,
        resizeMode: 'contain',
        height: 100,
        width: 100,
        borderRadius: 50,
        // borderWidth: 2,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        // borderWidth: 2,
        borderColor: '#FFFFFF',
        marginBottom: 5
    },
    name: {
        justifyContent: 'center',
        alignItems: 'center',
        color: "#E7DEF1"
    },
    drawerItem: {

        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        alignSelf: 'stretch'

    },
    drawerItemText: {
        fontSize: 13,
        padding: 10,
        flex: 3,
        color: '#000000'
    },
    drawerItemColor: {
        color: '#FAFAFA',
    },
    drawerList: {
        flex: 4,
        flexDirection: 'column',

    },
    drawerListButtonContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    drawerListIcon: {
        flex: 1,
    },
    logoutButton: {
        padding: 20,
    },
    logoutButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    logoutButtonText: {
        fontSize: 15,
        color: "#FFFFFF"
    },
    profileContainer: {
        backgroundColor: '#4A0091',
        flex: 2,
        flexDirection: 'column',
        padding: 10,
    },
    profileNameIconContainer: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginTop: 30
    }
});

AppRegistry.registerComponent('DrawerView', () => DrawerView);
