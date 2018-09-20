import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ScrollView, LayoutAnimation, NativeModules, TouchableOpacity, Keyboard, KeyboardAvoidingView

} from 'react-native';

import HeaderBar from '../UI/HeaderBar';
import Preferences from 'react-native-default-preference';
import PreferenceKeys from '../PreferenceKeys/PreferenceKeys';
import firebaseApp from '../Firebase/Firebase';
import Modal from 'react-native-modal';
import { Card } from 'react-native-material-design';
import FirebaseKeys from "../FirebaseKeys/FirebaseKeys";
import FCM from 'react-native-fcm';
import renderIf from "./renderif";



const borderErrorColor = 'red';

const { UIManager } = NativeModules;


UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

export default class EmailLoginPage extends Component {

    LAST_EMAIL_KEY = 'last_email';

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            borderBottomLineEmail: 1,
            borderBottomLinePassword: 1,
            borderEmail: '#6F0091',
            borderPassword: '#6F0091',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Wachtwoord',
            errorEmail: '   ',
            errorPassword: '   ',
            errorHeightEmail: 2,
            errorPaddingEmail: 2,
            errorHeightPassword: 2,
            emailReady: 0,
            passwordReady: 0,
            labelHeightEmail: 2,
            labelHeightPassword: 2,
            labelTextEmail: '',
            labelTextPassword: '',
            passwordResetModal:false,
            displaySucces: false
        };
    }


    componentWillMount() {
        Preferences.get(PreferenceKeys.LAST_USED_EMAIL)
            .then(email => {
                this.setState({email: email});
            });
    }


    onLogin() {
        firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then((user) => {
                    this.setState({
                        borderEmail: '#6F0091',
                        borderPassword: '#6F0091',
                        errorEmail: '   ',
                        displaySucces: true
                    });
                    FCM.subscribeToTopic(FirebaseKeys.FCM.TOPICS + user.uid);
                },
                (error) => {
                    console.log(error);
                    this.setState({errorEmail: 'Ongeldige gegevens!'});
                });
    }


    checkEmail(){
        let email = this.state.email;
        if(email === "" || email === null || email === undefined) {
            this.setState({
                errorEmail: 'Er is geen e-mail ingevoerd!',
                borderEmail: borderErrorColor,
            });
            return 0;
        }else{
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (reg.test(email) === false) {
                this.setState({
                    email: email,
                    borderEmail: borderErrorColor,
                    errorEmail: 'E-mail is niet correct!',
                });
                return 0;
            } else {
                this.setState({
                    email: email,
                    errorEmail: '   ',
                    borderEmail: '#6F0091',
                    emailReady: 1
                });
                return 1;
            }
        }
    }

    checkPassword(){
        let password = this.state.password;
        let passLength = 6;
        if(password === ''){
            this.setState({
                borderPassword: borderErrorColor,
                errorPassword: 'Er is geen wachtwoord ingevoerd!',
            });
            return 0;
        }else{
            if(password.length < passLength){
                this.setState({
                    borderPassword: borderErrorColor,
                    errorPassword: 'Wachtwoord moet minstens '+ passLength +' tekens hebben!',
                });
                return 0;
            }else{
                this.setState({
                    borderPassword: '#6F0091',
                    errorPassword: '   ',
                    passwordReady: 1
                });
                return 1;
            }
        }
    }

    checkAll(){
        Keyboard.dismiss();
        let emailValue = this.checkEmail();
        let passwordValue = this.checkPassword();
        console.log(emailValue);
        console.log(passwordValue);
        if (emailValue === 1 && passwordValue === 1){
            this.onLogin();
        }
    }

    bottomLineEmail(text){
        LayoutAnimation.spring();
        if(text.length === 0){
            this.setState({
                borderEmail: '#FFFFFF',
                labelHeightEmail: 0,
                labelTextEmail: ''
            });
        }else{
            this.setState({
                borderEmail: '#6F0091',
                labelTextEmail: 'Email'
            });
        }
    }
    bottomLinePassword(text){
        LayoutAnimation.spring();
        if(text.length === 0){
            this.setState({
                borderPassword: '#FFFFFF',
                labelTextPassword: ''
            });
        }else{
            this.setState({
                borderPassword: '#6F0091',
                labelTextPassword: 'Wachtwoord'
            });
        }
    }

    onPasswordReset(){
        firebaseApp.auth().sendPasswordResetEmail(this.state.passwordResetEmail)
            .then(() => {
                this.setState({passwordResetModal: false});
            })
            .catch((error) => {
                console.error('Unable send password reset email', error);
            });
    }

    render() {
        return (
            <Image source={require('../../../images/achtergrond_logo2.png')} style={styles.backgroundImage}>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <HeaderBar onBackPressed={() => this.props.navigator.push({name: 'Login', data: null})}
                               title="Inloggen"/>
                    <View style={styles.container}>
                        <Card style={{flex: 1, alignSelf: 'stretch', marginTop: 18}}>
                            <Card.Body>
                                <View>
                                    <View style={styles.fbButton}>
                                        <TextInput keyboardType='email' value={this.state.email}
                                                   onChangeText={text => this.setState({email: text}, () => this.bottomLineEmail(text))}
                                                   style={[styles.textInput, {borderColor: this.state.borderEmail, borderBottomWidth: this.state.borderBottomLineEmail}]}
                                                   placeholder={this.state.emailPlaceholder}
                                                   placeholderTextColor= 'gray'
                                                   underlineColorAndroid='transparent'/>
                                        <View style={{paddingTop: this.state.errorHeightEmail, paddingBottom: this.state.errorHeightEmail, marginBottom: 5, alignSelf: 'flex-start'}}>
                                            <Text style={styles.errorText}>
                                                {this.state.errorEmail}
                                            </Text>
                                        </View>
                                        <TextInput secureTextEntry={true} value={this.state.password}
                                                   style={[styles.textInput, {borderColor: this.state.borderPassword, borderBottomWidth: this.state.borderBottomLinePassword}]}
                                                   onChangeText={text => this.setState({password: text}, () => this.bottomLinePassword(text))}
                                                   placeholder={this.state.passwordPlaceholder}
                                                   placeholderTextColor= 'gray'
                                                   underlineColorAndroid='transparent'/>
                                        <View style={{paddingTop: this.state.errorHeightPassword, paddingBottom: this.state.errorHeightPassword, alignSelf: 'flex-start'}}>
                                            <Text style={styles.errorText}>
                                                {this.state.errorPassword}
                                            </Text>
                                        </View>

                                        <TouchableOpacity onPress={() => this.checkAll()}>
                                            <Card style={{paddingLeft: -16, paddingRight: -16, paddingTop: 5, paddingBottom: 5, backgroundColor: '#6F0091'}}>
                                                <View style={{width: 275, height: 30, borderRadius: 2}}>
                                                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                        <Text style={{color: '#FFFFFF', fontSize: 15}}>INLOGGEN</Text>
                                                    </View>
                                                </View>
                                            </Card>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Card.Body>
                        </Card>
                        {renderIf(this.state.displaySucces)(
                            <Card style={{flex: 1, alignSelf: 'stretch', marginTop: 6, justifyContent: 'center', alignItems: 'center'}}>
                                <Card.Body>
                                    <View>
                                        <Text style={{justifyContent: 'center', alignItems: 'center', color: '#6F0091'}}>Inloggen is gelukt! U wordt doorgestuurd</Text>
                                    </View>
                                </Card.Body>
                            </Card>
                        )}

                        {/*<Modal*/}
                            {/*visible={this.state.passwordResetModal}*/}
                            {/*transparent={true}*/}
                            {/*animationType={"slide"}*/}
                            {/*onRequestClose={() => this.setState({passwordResetModal: false})}*/}
                            {/*style={styles.passwordReset}*/}
                        {/*>*/}
                            {/*<View style={styles.modalPrivacyRights}>*/}
                                {/*<HeaderBar onBackPressed={() => this.setState({passwordResetModal: false})} title="Wachtwoord resetten"/>*/}
                                {/*<Text style={styles.modalText}>Vul uw email adres in*/}
                                {/*</Text>*/}
                                {/*<TextInput onChangeText={text => this.setState({passwordResetEmail: text})}/>*/}
                                {/*<View style={styles.bottomButtons}>*/}
                                    {/*<TouchableHighlight style={styles.modalTouch} onPress={() => {this.setState({passwordResetModal: false})}}>*/}
                                        {/*<Text style={styles.modalTouchText}>Terug</Text>*/}
                                    {/*</TouchableHighlight>*/}
                                    {/*<TouchableHighlight style={styles.modalTouch} onPress={() => {this.onPasswordReset()}}>*/}
                                        {/*<Text style={styles.modalTouchText}>Email versturen</Text>*/}
                                    {/*</TouchableHighlight>*/}
                                {/*</View>*/}

                            {/*</View>*/}
                        {/*</Modal>*/}
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
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding: 15,
    },
    fbButton: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainBox: {
        paddingTop: 20,
        paddingBottom: 20,
        flex: 6,
        marginTop: 35,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 3,
        overflow: 'hidden'
    },
    loginEmailText: {
        marginLeft: 5,
        color: 'white',
        fontFamily: 'Roboto medium',
        fontSize: 15
    },
    loginEmailButton:{
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        backgroundColor: '#6F0091',
        width: 225,
        height: 35,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    emptySpace: {
        flex: 0.5
    },
    textInput: {
        marginTop: 5,
        width: 275,
        height: 40,
        fontSize: 15,
        borderColor: '#6F0091',
        color: '#6F0091',
        fontFamily: 'Roboto'
    },
    labelText: {
        color: '#6F0091',
        marginTop: 5,
        marginLeft: 5,
        marginBottom: 5,
        fontSize: 13,
    },
    label: {
        alignSelf: 'flex-start',
    },
    errorText: {
        color: borderErrorColor,
        marginTop: 10,
        marginLeft: 5,
        marginBottom: 10,
        fontSize: 13
    },
    passwordReset: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 100,
        marginBottom: 100,
    },
    modalTitleText: {

    },
});

AppRegistry.registerComponent('EmailLoginPage', () => EmailLoginPage);