'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';

const firebase = require('firebase');
const FBSDK = require('react-native-fbsdk');
const {
    AccessToken,
    LoginManager
} = FBSDK;

import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-material-design';
import FCM from 'react-native-fcm';
import renderIf from "./renderif";
import PreferenceKeys from "../PreferenceKeys/PreferenceKeys";


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fbId: '',
            displaySucces: false
        };
    }

    componentWillMount() {
        this.setState({displaySucces: false});

    }
    navigator(name, data) {
        this.props.navigator.push({
            name,
            data
        });
    }

    goToEmailLoginPage(){
        this.navigator("EmailLogin", null);
    }

    goToRegister(){
        this.navigator("RegisterPage", null);
    }

    initFacebookUser(token, id){
        let credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebaseApp.auth().signInWithCredential(credential)
            .then((user) => {
                console.log('User signed in to firebase');
                this.loginFirebase(user, id, token);
            })
            .catch((err) => {
                console.log('User signin error', err);
            });
    }

    loginFirebase(user, fbid, token) {
        FCM.subscribeToTopic(FirebaseKeys.FCM.TOPICS + user.uid);
        // FCM.subscribeToTopic(user.uid);
        let ref = firebaseApp.database()
            .ref(FirebaseKeys.USER_NODE)
            .child(user.uid);
        let updates = {};
        updates['picture'] = 'initialProfile.jpg';
        updates[FirebaseKeys.USER.FBID] = fbid;
        ref.update(updates);
    }

    loginWithFacebook(){
        let context = this;
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            function(result) {
                if (result.isCancelled) {
                    console.log('Login cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                        const {accessToken, userID} = data;
                        console.log("logged in: ",data);
                        context.setState({displaySucces: true});
                        context.initFacebookUser(accessToken, userID);
                    });
                }
            },
            function(error) {
                console('Login fail with error: ' + error);
            }
        );
    }

    render() {
        return (
            <Image source={require('../../../images/achtergrond_logo2.png')} style={styles.backgroundImage}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.mainBox}>
                            <Image source={require('../../../images/rnmlogo_1000x1000.png')} style={styles.logo}/>
                            <View style={styles.fbButton}>
                                <TouchableOpacity underlayColor={'#25006B'} onPress={()=> this.loginWithFacebook()}>
                                    <Card style={{paddingLeft: -16, paddingRight: -16, paddingTop: 2, paddingBottom: 2, backgroundColor: '#6F0091'}}>
                                        <View style={{width: 275, height: 30, flexDirection:'row', justifyContent: 'center', alignItems: 'center',}}>
                                            <Icon name="facebook-box" size={20} color={'#FFFFFF'}/>
                                            <Text style={styles.loginEmailText}>INLOGGEN MET FACEBOOK</Text>
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                                <TouchableOpacity underlayColor={'#25006B'} onPress={()=> this.goToEmailLoginPage()}>
                                    <Card style={{paddingLeft: -16, paddingRight: -16, paddingTop: 2, paddingBottom: 2, backgroundColor: '#6F0091'}}>
                                        <View style={{width: 275, height: 30, flexDirection:'row', justifyContent: 'center', alignItems: 'center',}}>
                                            <Text style={styles.loginEmailText}>INLOGGEN MET EMAILACCOUNT</Text>
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                                <View style={styles.loginWithoutFacebook}>
                                    <Text style={styles.normalText}>Nog geen account?</Text>
                                    <TouchableOpacity onPress={()=> this.goToRegister()}>
                                        <Text style={styles.registerText}>Registreren</Text>
                                    </TouchableOpacity>
                                </View>
                                {renderIf(this.state.displaySucces)(
                                    <Card style={{flex: 1, alignSelf: 'stretch', marginTop: 16, justifyContent: 'center', alignItems: 'center'}}>
                                        <Card.Body>
                                            <View>
                                                <Text style={{justifyContent: 'center', alignItems: 'center', color: '#6F0091'}}>Inloggen is gelukt! U wordt doorgestuurd</Text>
                                            </View>
                                        </Card.Body>
                                    </Card>
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    backgroundImage:{
        flex: 1,
        width: null,
        height: null
    },
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    logo: {
        flex: 1.5,
        width: 170,
        height: 140
    },
    fbButton: {
        marginTop: 65,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainBox: {
        flex: 6,
        marginTop: 35,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    loginWithoutFacebook:{
        flexDirection: 'row'
    },
    normalText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 13
    },
    loginEmailText: {
        marginLeft: 5,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Roboto',
        fontSize: 12
    },
    loginEmail:{
        marginTop: 20,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        backgroundColor: '#6F0091',
        height: 35,
        borderRadius: 2,
        fontSize: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        flexDirection: 'row'
    },
    registerText: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
        fontSize: 13,
        fontFamily: 'Roboto'
    },
    loginFacebook:{
        marginTop: 20,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 10,
        paddingBottom: 7,
        backgroundColor: '#6F0091',
        height: 35,
        borderRadius: 2,
        fontSize: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        flexDirection: 'row'
    }
});

module.exports = Home;