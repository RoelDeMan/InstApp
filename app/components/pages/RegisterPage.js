import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image, ScrollView, LayoutAnimation, NativeModules, Keyboard
} from 'react-native';

import firebaseApp from '../Firebase/Firebase';
import HeaderBar from "../UI/HeaderBar";
import { Button, Icon, Card } from 'react-native-material-design';

const { UIManager } = NativeModules;

const borderErrorColor = 'red';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

export default class RegisterPage extends Component {

    constructor() {
        super();
        this.state = {
            agreed: false,
            agreementModal: false,
            modalTerms: false,
            termsCheckBox: false,
            disableTouch: true,
            namePlaceholder: 'Naam *',
            phonePlaceholder: 'Telefoonnummer *',
            emailPlaceholder: 'Emailadres',
            carLicensePlaceholder: 'Kenteken (bijv. GV-685-D)',
            name: '',
            phone: '',
            email: '',
            carLicense: '',
            border: 'white',
            borderName: 'white',
            borderEmail: '#D3D3D3',
            borderPhone: 'white',
            borderCarLicense: 'white',
            errorHeightName: 0,
            errorHeightPhone: 0,
            errorHeightEmail: 2,
            errorHeightCarLicense: 0,
            displayErrorName: '',
            displayErrorPhone: '',
            displayErrorEmail: '',
            displayErrorCarLicense: '',
            nameReady: 0,
            phoneReady: 0,
            emailReady: 0,
            carLicenseReady: 0,
            infoPhone: 'Uw telefoonnummer kan alleen gebruikt worden na het boeken van een rit voor de communicatie tussen een bestuurder en reiziger.',
            infoPhoneHeight: 0,
            infoPhoneBoolean: false,
            profilePicture: 'https://bin.snmmd.nl/m/dr9yfkdw2ni1.jpg',
            profilePicture2: 'https://www.friesland-post.nl/wp-content/uploads/2014/12/facebook-header.jpg?x67396',
            password: '',
            passwordSecond: '',
            borderBottomLineEmail: 1,
            borderBottomLinePassword: 1,
            borderBottomLinePasswordSecond: 1,
            borderPassword: '#D3D3D3',
            borderPasswordSecond: '#D3D3D3',
            passwordPlaceholder: 'Wachtwoord',
            passwordPlaceholderSecond: 'Wachtwoord herhalen',
            errorEmail: '   ',
            errorPassword: '   ',
            errorPasswordSecond: '   ',
            errorHeightPassword: 2,
            errorHeightPasswordSecond: 2,
            passwordReady: 0,
            passwordReadySecond: 0,
            labelHeightEmail: 2,
            labelHeightPassword: 2,
            labelHeightPasswordSecond: 2,
            labelTextEmail: 'Email',
            labelTextPassword: 'Wachtwoord',
            labelTextPasswordSecond: 'Wachtwoord Herhalen',
            colorEmail: 'white',
            colorPassword: 'white',
            colorPasswordSecond: 'white',
            colorEmailError: 'white',
            colorPasswordError: 'white',
            colorPasswordSecondError: 'white',
            errorExists: '   '
        };
    }

    navigator(name, data) {
        this.props.navigator.push({
            name,
            data
        });
    }

    checkEmail(){
        console.log('wat is de waarde van email '+ this.state.email);
        LayoutAnimation.spring();
        let email = this.state.email;
        if(email === "" || email === null) {
            console.log('kom ik hier');
            this.setState({colorEmailError: 'red'});
            this.setState({errorEmail: 'Er is geen e-mail ingevoerd!'});
            this.setState({borderEmail: borderErrorColor});
            return 0;
        }else{
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (reg.test(email) === false) {
                this.setState({email: email});
                this.setState({colorEmailError: 'red'});
                this.setState({borderEmail: borderErrorColor});
                this.setState({errorEmail: 'E-mail is niet correct!'});
                return 0;
            } else {
                this.setState({email: email});
                this.setState({errorEmail: 'Error'});
                this.setState({colorEmailError: 'white'});
                this.setState({borderBottomLineEmail: 2});
                this.setState({borderEmail: '#6F0091'});
                this.setState({emailReady: 1});
                return 1;
            }
        }
    }





    checkPassword(){
        LayoutAnimation.spring();
        let password = this.state.password;
        let passwordSecond = this.state.passwordSecond;
        let passLength = 6;
        if(password === ''){
            this.setState({borderPassword: borderErrorColor});
            this.setState({colorPasswordError: 'red'});
            this.setState({errorPassword: 'Er is geen wachtwoord ingevoerd!'});
            return 0;
        }else if(passwordSecond !== ''){
            if(password !== passwordSecond){
                this.setState({borderPassword: borderErrorColor});
                this.setState({colorPasswordError: 'red'});
                this.setState({errorPassword: 'Wachtwoord komen niet overeen!'});
                console.log('niet correct');
                this.setState({colorPasswordSecondError: 'red'});
                this.setState({borderPasswordSecond: borderErrorColor});
                this.setState({errorPasswordSecond: 'Wachtwoord komt niet overeen!'});
                return 0;
            }else{
                this.setState({colorPasswordError: 'white'});
                this.setState({borderPassword: '#6F0091'});
                this.setState({errorPassword: 'Error'});
                console.log('correct');
                this.setState({colorPasswordSecondError: 'white'});
                this.setState({borderPasswordSecond: '#6F0091'});
                this.setState({errorPasswordSecond: 'Error'});
                return 1;
            }
        }else{
            if(password.length < passLength){
                this.setState({colorPasswordError: 'red'});
                this.setState({borderPassword: borderErrorColor});
                this.setState({errorPassword: 'Wachtwoord moet minstens '+ passLength +' tekens hebben!'});
                return 0;
            }else{
                this.setState({colorPasswordError: 'white'});
                this.setState({borderBottomLinePassword: 2});
                this.setState({borderPassword: '#6F0091'});
                this.setState({errorPassword: 'Error'});
                this.setState({passwordReady: 1});
                return 1;
            }
        }
    }

    checkPasswordSecond(){
        LayoutAnimation.spring();
        let password = this.state.password;
        let passwordSecond = this.state.passwordSecond;
        let passLength = 6;
        if(passwordSecond === ''){
            this.setState({borderPasswordSecond: borderErrorColor});
            this.setState({colorPasswordSecondError: 'red'});
            this.setState({errorPasswordSecond: 'Er is geen wachtwoord ingevoerd!'});
            return 0;
        }
        else{
            if(passwordSecond.length < passLength){
                this.setState({borderPasswordSecond: borderErrorColor});
                this.setState({colorPasswordSecondError: 'red'});
                this.setState({errorPasswordSecond: 'Wachtwoord moet minstens '+ passLength +' tekens hebben!'});
                return 0;
            }else if(password !== passwordSecond){
                this.setState({borderPassword: borderErrorColor});
                this.setState({colorPasswordError: 'red'});
                this.setState({errorPassword: 'Wachtwoorden komen niet overeen!'});
                return 0;
                console.log('niet correct');
                this.setState({colorPasswordSecondError: 'red'});
                this.setState({borderPasswordSecond: borderErrorColor});
                this.setState({errorPasswordSecond: 'Wachtwoord komt niet overeen!'});
                return 0;
            }else if(password === passwordSecond){
                this.setState({colorPasswordError: 'white'});
                this.setState({borderPassword: '#6F0091'});
                this.setState({errorPassword: 'Error'});
                console.log('correct');
                this.setState({colorPasswordSecondError: 'white'});
                this.setState({borderPasswordSecond: '#6F0091'});
                this.setState({errorPasswordSecond: 'Error'});
                return 1;
            }else{
                this.setState({borderBottomLinePasswordSecond: 2});
                this.setState({colorPasswordSecondError: 'white'});
                this.setState({borderPasswordSecond: '#6F0091'});
                this.setState({errorPasswordSecond: 'Error'});
                this.setState({passwordReadySecond: 1});
                return 1;
            }
        }
    }

    bottomLineEmail(text){
        LayoutAnimation.spring();
        if(text.length === 0){
            this.setState({ borderBottomLineEmail: 1,
                borderEmail: '#D3D3D3',
                colorEmail:'white',
                labelTextEmail: 'Label'});
        }else{
            this.setState({ borderBottomLineEmail: 2,
                borderEmail: '#6F0091',
                colorEmail: '#6F0091',
                labelTextEmail: 'Email'});
        }
    }

    bottomLinePassword(text){
        LayoutAnimation.spring();
        if(text.length === 0){
            this.setState({ borderBottomLinePassword: 1,
                borderPassword: '#D3D3D3',
                colorPassword:'white',
                labelTextPassword: 'Label'});
        }else{
            this.setState({ borderBottomLinePassword: 2,
                colorPassword: '#6F0091',
                borderPassword: '#6F0091',
                labelTextPassword: 'Wachtwoord'});
        }
    }
    bottomLinePasswordSecond(text){
        LayoutAnimation.spring();
        if(text.length === 0){
            this.setState({ borderBottomLinePasswordSecond: 1,
                borderPasswordSecond: '#D3D3D3',
                colorPasswordSecond:'white',
                labelTextPasswordSecond: 'Label'});
        }else{
            this.setState({ borderBottomLinePasswordSecond: 2,
                borderPasswordSecond: '#6F0091',
                colorPasswordSecond: '#6F0091',
                labelTextPasswordSecond: 'Wachtwoord herhalen'});
        }
    }

    goToRegTwo(){
        Keyboard.dismiss();
        let emailValue = this.checkEmail();
        let passwordValue = this.checkPassword();
        let passwordValueSecond = this.checkPasswordSecond();
        console.log(emailValue);
        console.log(passwordValue);
        console.log(passwordValueSecond);
        if (emailValue === 1 && passwordValue === 1 && passwordValueSecond === 1){
            let email = this.state.email;
            let password = this.state.password;
            // if (password === passwordValueSecond){
                firebaseApp.auth().createUserWithEmailAndPassword(email,password)
                    .then(user => {
                        console.log(user);
                        this.setState({errorExists: '  '});

                    }).catch(error => {
                    this.setState({errorExists: 'Account bestaat al'});
                    console.log(error);
                });

        }
    }

    render() {
        return (
            <Image source={require('../../../images/achtergrond_logo2.png')} style={styles.backgroundImage}>
                <ScrollView>
                    <HeaderBar onBackPressed={() => this.props.navigator.push({name: 'Login', data: null})}
                               title="Registreren"/>
                    <View style={styles.container}>
                        <View style={styles.emptySpace}/>
                        <View style={styles.mainBox}>


                            <Card style={{marginTop:20, width: 290, paddingLeft: -16, paddingRight: -16}}>
                                <View style={{backgroundColor: '#EBEBEB', borderTopLeftRadius: 2, borderTopRightRadius: 2, height: 110, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{margin: 16, flexDirection: 'row'}}>
                                        <View style={{flex: 1.5, height: 40, width: 40, alignSelf:'flex-start', justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{width: 35, height: 35, borderRadius: 20, backgroundColor: '#FC0D7F', justifyContent: 'center',  alignItems: 'center'}}><Text style={{color: 'white', fontSize: 15}}>1</Text></View>
                                            <Text style={{fontSize: 12, width: 80,color: 'black'}}>Inloggegevens</Text>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}></Text>
                                        </View>
                                        <View style={{flex:0.5, alignItems:'center', paddingLeft: 15, marginTop: -7}}>
                                            <Text style={{color: '#D3D3D3', width: 50}}>______</Text>
                                        </View>
                                        <View style={{flex: 1.5, height: 40, width: 40, alignSelf:'center', justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{width: 35, height: 35, borderRadius: 20, backgroundColor: '#D3D3D3', justifyContent: 'center', alignItems: 'center'}}><Text style={{color: 'white', fontSize: 15}}>2</Text></View>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}>Persoonlijk</Text>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}></Text>
                                        </View>
                                        <View style={{flex: 0.5, alignItems:'center',paddingLeft: 15, marginTop: -7}}>
                                            <Text style={{color: '#D3D3D3', width: 50}}>______</Text>
                                        </View>
                                        <View style={{flex: 1.5, height: 40, width: 40, alignSelf:'flex-end', justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{width: 35, height: 35, borderRadius: 20, backgroundColor: '#D3D3D3', justifyContent: 'center', alignItems: 'center'}}><Text style={{color: 'white', fontSize: 15}}>3</Text></View>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}>Auto</Text>
                                            <Text style={{color: '#D3D3D3', fontSize: 12, marginBottom: -12}}>(Optioneel)</Text>
                                        </View>
                                    </View>
                                </View>
                                <Card.Body>
                                    <View style={{marginLeft: 16, marginRight: 16}}>
                                        <View style={[styles.label, {paddingTop: this.state.labelHeightEmail, paddingBottom: this.state.labelHeightEmail}]}>
                                            <Text style={[styles.labelText, {color: this.state.colorEmail}]}>
                                                {this.state.labelTextEmail}
                                            </Text>
                                        </View>
                                        <TextInput keyboardType='email' value={this.state.email}
                                                   onChangeText={text => this.setState({email: text}, () => this.bottomLineEmail(text))}
                                                   onBlur={() => this.checkEmail()}
                                                   style={[styles.textInput, {borderColor: this.state.borderEmail, borderBottomWidth: this.state.borderBottomLineEmail}]}
                                                   placeholder={this.state.emailPlaceholder}
                                                   placeholderTextColor= '#D3D3D3'
                                                   underlineColorAndroid='transparent'/>
                                        <View style={{marginBottom: 5, paddingTop: this.state.errorHeightEmail, paddingBottom: this.state.errorHeightEmail, alignSelf: 'flex-start'}}>
                                            <Text style={[styles.errorText, {color: this.state.colorEmailError}]}>
                                                {this.state.errorEmail}
                                            </Text>
                                        </View>


                                        <View style={[styles.label, {paddingTop: this.state.labelHeightPassword, paddingBottom: this.state.labelHeightPassword}]}>
                                        <Text style={[styles.labelText, {color: this.state.colorPassword}]}>
                                            {this.state.labelTextPassword}
                                        </Text>
                                    </View>
                                        <TextInput secureTextEntry={true} value={this.state.password}
                                                   style={[styles.textInput, {borderColor: this.state.borderPassword, borderBottomWidth: this.state.borderBottomLinePassword}]}
                                                   onChangeText={text => this.setState({password: text}, () => this.bottomLinePassword(text))}
                                                   onBlur={() => this.checkPassword()}
                                                   placeholder={this.state.passwordPlaceholder}
                                                   placeholderTextColor= '#D3D3D3'
                                                   underlineColorAndroid='transparent'/>
                                        <View style={{marginBottom: 5, paddingTop: this.state.errorHeightPassword, paddingBottom: this.state.errorHeightPassword, alignSelf: 'flex-start'}}>
                                            <Text style={[styles.errorText, {color: this.state.colorPasswordError}]}>
                                                {this.state.errorPassword}
                                            </Text>
                                        </View>


                                        <View style={[styles.label, {paddingTop: this.state.labelHeightPasswordSecond, paddingBottom: this.state.labelHeightPasswordSecond}]}>
                                            <Text style={[styles.labelText, {color: this.state.colorPasswordSecond}]}>
                                                {this.state.labelTextPasswordSecond}
                                            </Text>
                                        </View>
                                        <TextInput secureTextEntry={true} value={this.state.passwordSecond}
                                                   style={[styles.textInput, {borderColor: this.state.borderPasswordSecond, borderBottomWidth: this.state.borderBottomLinePasswordSecond}]}
                                                   onChangeText={text => this.setState({passwordSecond: text}, () => this.bottomLinePasswordSecond(text))}
                                                   onBlur={() => this.checkPasswordSecond()}
                                                   placeholder={this.state.passwordPlaceholderSecond}
                                                   placeholderTextColor= '#D3D3D3'
                                                   underlineColorAndroid='transparent'/>
                                        <View style={{paddingTop: this.state.errorHeightPasswordSecond, paddingBottom: this.state.errorHeightPasswordSecond, alignSelf: 'flex-start'}}>
                                            <Text style={[styles.errorText, {color: this.state.colorPasswordSecondError}]}>
                                                {this.state.errorPasswordSecond}
                                            </Text>

                                        </View>
                                        <Text style={[styles.errorText, {color: 'red'}]}>
                                            {this.state.errorExists}
                                        </Text>
                                    </View>
                                </Card.Body>
                                <Card.Actions position="right">
                                    <View>
                                        <Button overrides={{textColor: '#6F0091'}} onPress={() => this.goToRegTwo()} text="Volgende"/>
                                    </View>
                                </Card.Actions>
                            </Card>
                        </View>
                        <View style={styles.emptySpace}/>
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
    fbButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainBox: {
        flex: 6,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    loginEmailText: {
        marginLeft: 5,
        color: 'white',
        fontFamily: 'Roboto medium',
        fontSize: 15
    },
    emptySpace: {
        flex: 0.5
    },
    textInput: {
        height: 40,
        fontSize: 15,
        borderColor: '#6F0091',
        color: '#6F0091',
        fontFamily: 'Roboto'
    },
    labelText: {
        color: '#FFFFFF',
        fontSize: 13
    },
    label: {
        alignSelf: 'flex-start'
    },
    errorText: {
        fontSize: 13
    }
});

AppRegistry.registerComponent('RegisterPage', () => RegisterPage);