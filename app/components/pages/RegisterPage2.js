import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Navigator,
    TouchableHighlight, BackAndroid, ScrollView, LayoutAnimation, NativeModules, Platform, Keyboard
} from 'react-native';

import firebaseApp from '../Firebase/Firebase';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressImage from 'react-native-image-progress';
import ProgressImageBar from 'react-native-progress/Bar';
import HeaderBar from "../UI/HeaderBar";
import { Button, Icon, Subheader, Card } from 'react-native-material-design';
import RNFetchBlob from 'react-native-fetch-blob';
import FirebaseKeys from "../FirebaseKeys/FirebaseKeys";
// import FirebaseKeys from "../FirebaseKeys/FirebaseKeys";
import FCM from 'react-native-fcm';

// import PressButton from 'react-native-material-button';

const { UIManager } = NativeModules;

const borderErrorColor = 'red';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export default class RegisterPage2 extends Component {

    DEFAULT_PICTURE = require('../../../images/initialProfile.jpg');

    constructor() {
        super();
        this.state = {
            agreed: false,
            agreementModal: false,
            modalTerms: false,
            termsCheckBox: false,
            disableTouch: true,
            namePlaceholder: 'Naam',
            phonePlaceholder: 'Telefoonnummer',
            emailPlaceholder: 'Emailadres',
            carLicensePlaceholder: 'Kenteken (bijv. GV-685-D)',
            name: '',
            phone: '',
            email: '',
            carLicense: '',
            border: 'white',
            borderName: '#D3D3D3',
            borderEmail: '#D3D3D3',
            borderPhone: '#D3D3D3',
            borderCarLicense: 'white',
            errorHeightName: 0,
            errorHeightPhone: 0,
            errorHeightEmail: 0,
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
            borderBottomLineName: 1,
            borderBottomLinePassword: 1,
            borderPassword: '#D3D3D3',
            passwordPlaceholder: 'Wachtwoord',
            errorEmail: '',
            errorPassword: '',
            errorHeightPassword: 0,
            passwordReady: 0,
            labelHeightEmail: 0,
            labelHeightPassword: 0,
            labelTextEmail: '',
            labelTextPassword: '',

            labelHeightLastName: 0,
            labelTextLastName: '',
            lastName: '',
            borderLastName: '#D3D3D3',
            lastNamePlaceholder: 'Achternaam',
            borderBottomLineLastName: 1,
            errorHeightLastName: 0,
            errorLastName: '',

            labelHeightName: 0,
            labelTextName: '',

            labelHeightPhone: 0,
            labelTextPhone: '',
            borderBottomLinePhone: 1,
            errorLastPhone: '',
            image: this.DEFAULT_PICTURE,
            imageurl: ''

        };
    }

    componentWillMount(){
        // let uid = firebaseApp.auth().currentUser.uid;
        // firebaseApp.database()
        //     .ref('users')
        //     .child(uid)
        //     .once('value')
        //     .then(snapshot => {
        //         email = snapshot.child('email').val();
        //         if(email){
        //             this.setState({email: email});
        //         }
        //     });
    }

    componentDidMount(){

    }

    navigator(name, data) {
        this.props.navigator.push({
            name,
            data
        });
    }

    checkName(){
        LayoutAnimation.spring();
        let name = this.state.name;

        if (name === "" || name === null) {
            this.setState({errorHeightName: 30});
            this.setState({errorName: 'Er is geen naam ingevoerd!'});
            this.setState({borderName: 'red'});
            return 0;
        }
        else if(name.length < 2){
            this.setState({errorHeightName: 30});
            this.setState({errorName: 'Naam kan niet kleiner zijn dan 1 karakter!'});
            this.setState({borderName: 'red'});
            return 0;
        }else{
            this.setState({errorHeightName: 0});
            this.setState({errorName: '  '});
            this.setState({namePlaceholder: this.state.namePlaceholder});
            this.setState({borderName: '#6F0091'});
            this.setState({name: name});
            this.setState({nameReady: 3});
            return 1;
        }
    }

    checkLastName(){
        LayoutAnimation.spring();
        let lastName = this.state.lastName;

        if (lastName === "" || lastName === null) {
            this.setState({errorHeightLastName: 30});
            this.setState({errorLastName: 'Er is geen achternaam ingevoerd!'});
            this.setState({borderLastName: 'red'});
            return 0;
        }
        else if(lastName.length < 2){
            this.setState({errorHeightName: 30});
            this.setState({errorLastName: 'Achternaam kan niet kleiner zijn dan 1 karakter!'});
            this.setState({borderLastName: 'red'});
            return 0;
        }
        else{
            this.setState({errorHeightLastName: 0});
            this.setState({errorLastName: '  '});
            this.setState({lastNamePlaceholder: this.state.lastNamePlaceholder});
            this.setState({borderLastName: '#6F0091'});
            this.setState({lastName: lastName});
            return 1;
        }
    }

    // checkPhone(){
    //     let phone = this.state.phone;
    //     if(phone === "" || phone === null){
    //         this.setState({errorHeightPhone: 15});
    //         this.setState({errorPhone: 'Er is geen nummer ingevoerd!'});
    //         this.setState({borderPhone: 'red'});
    //     }else if(phone.length < 10){
    //         this.setState({errorHeightPhone: 15});
    //         this.setState({errorPhone: 'Het moeten 10 cijfers zijn!'});
    //         this.setState({borderPhone: 'red'});
    //     }else{
    //         let newNumber='';
    //         let numbers='0123456789';
    //         for(let i=0; i < phone.length; i++){
    //             if(numbers.indexOf(phone[i]) > -1){
    //                 newNumber = newNumber + phone[i];
    //             }else{
    //                 this.setState({errorHeightName: 15});
    //                 this.setState({errorPhone: 'Voer alleen nummers in!'});
    //                 this.setState({borderPhone: 'red'});
    //             }
    //             console.log('Telefoon is: '+ phone);
    //             this.setState({phone: newNumber});
    //             this.setState({errorHeightName: 0});
    //             this.setState({errorPhone: ''});
    //             this.setState({borderPhone: '#6F0091'});
    //             this.setState({phoneReady: 3});
    //         }
    //     }
    // }




    uploadData(){
        console.log("uploadData");
        if(this.state.image === this.DEFAULT_PICTURE){
            firebaseApp.auth().currentUser.updateProfile({displayName: this.state.name+" "+ this.state.lastName, photoURL: 'initialProfile.jpg'})
                .then(() => {
                    let uid = firebaseApp.auth().currentUser.uid;
                    let email = firebaseApp.auth().currentUser.email;
                    let updates = {};
                    updates['/picture/'] = 'initialProfile.jpg';
                    updates['/email/'] = email;
                    firebaseApp.database().ref('users/'+uid).update(updates);
                    this.navigator("RegisterPage3", null);
                });
        }else{
            firebaseApp.auth().currentUser.updateProfile({displayName: this.state.name+" "+ this.state.lastName, photoURL: this.state.imageurl})
                .then(() => {
                    this.navigator("RegisterPage3", null);
                });
        }

        let uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database()
            .ref('users')
            .child(uid)
            .update({
                name: this.state.name+ " " + this.state.lastName,
                phone: this.state.phone,
                email: this.state.email
            }).
        then(() => {
            FCM.subscribeToTopic(FirebaseKeys.FCM.TOPICS + uid);
            console.log("klaar met uploaden");
        });

    }

    togglePhoneInfo(active){
        LayoutAnimation.spring();
        console.log(active);
        if(active === false){
            this.setState({infoPhoneBoolean: true});
            this.setState({infoPhoneHeight: 65});
        }else{
            this.setState({infoPhoneBoolean: false});
            this.setState({infoPhoneHeight: 0});
        }
        console.log(this.state.profilePicture);
    }

    openImagePicker() {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: true,
            includeBase64: true,
        }).then((image) => {

            this.setState({
                profilePicture: image.path,

            });
            console.log('nieuwe foto');
            ref = firebaseApp.database()
                .ref('uploads')
                .push();
            ref.set({
                user: firebaseApp.auth().currentUser.uid,
                type: 'profilePicture',
                time: new Date().getTime()
            });
            key = ref.key;
            let uploadUri = Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path;
            console.log("Path: " , uploadUri);

            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    Blob.build(data, {type: 'application/octet-stream;BASE64'})
                        .then((blob) => {
                            console.debug(blob);
                            firebaseApp.storage()
                                .ref('profilePictures/' + key)
                                .put(blob, {contentType: 'application/octet-stream'})
                                .on('state_changed', snapshot => {
                                    //Current upload state
                                }, err => {
                                    console.log(err);
                                }, uploadedFile => {
                                    firebaseApp.database()
                                        .ref('users/' + firebaseApp.auth().currentUser.uid)
                                        .update({picture: key});
                                    firebaseApp.storage()
                                        .ref('profilePictures')
                                        .child(key)
                                        .getDownloadURL()
                                        .then(url => {
                                            this.setState({image: {uri: url}, imageurl: url});
                                        });



                                });


                        });
                });
        });
    }


    checkPassword(){
        LayoutAnimation.spring();
        let password = this.state.password;
        let passLength = 8;
        if(password === ''){
            this.setState({errorHeightPassword: 15});
            this.setState({borderPassword: borderErrorColor});
            this.setState({errorPassword: 'Er is geen wachtwoord ingevoerd!'});
        }else{
            if(password.length < passLength){
                this.setState({errorHeightPassword: 15});
                this.setState({borderPassword: borderErrorColor});
                this.setState({errorPassword: 'Wachtwoord moet minstens '+ passLength +' tekens hebben!'});
            }else{
                this.setState({errorHeightPassword: 0});
                this.setState({borderBottomLinePassword: 2});
                this.setState({borderPassword: '#6F0091'});
                this.setState({errorPassword: ''});
                this.setState({passwordReady: 1});
            }
        }
    }

    checkAll(){
            Keyboard.dismiss();
            let nameValue = this.checkName();
            let lastName = this.checkLastName();

            console.log(nameValue);
            console.log(lastName);
            if (nameValue === 1 && lastName === 1){
                console.log('kom erin');
                this.uploadData();
            }
    }

    bottomLineName(text){
        LayoutAnimation.spring();
        if(text.length === 0){
            this.setState({ borderBottomLineName: 1,
                borderName: '#D3D3D3',
                labelHeightName: 0,
                labelTextName: ''});
        }else{
            this.setState({ borderBottomLineName: 2,
                borderEmail: '#6F0091',
                labelHeightName: 15,
                labelTextName: 'Naam'});
        }
    }

    bottomLineLastName(text){
        LayoutAnimation.spring();
        if(text.length === 0){
            this.setState({ borderBottomLineLastName: 1,
                borderLastName: '#D3D3D3',
                labelHeightLastName: 0,
                labelTextLastName: ''});
        }else{
            this.setState({ borderBottomLineLastName: 2,
                borderLastName: '#6F0091',
                labelHeightLastName: 15,
                labelTextLastName: 'Achternaam'});
        }
    }

    bottomLinePhone(text){
        LayoutAnimation.spring();
        if(text.length === 0){
            this.setState({ borderBottomLinePhone: 1,
                borderPhone: '#D3D3D3',
                labelHeightPhone: 0,
                labelTextPhone: ''});
        }else{
            this.setState({ borderBottomLinePhone: 2,
                labelHeightPhone: 15,
                borderPhone: '#6F0091',
                labelTextPhone: 'Telefoonnummer'});
        }
    }

    goToRegOne(){
        this.props.navigator.pop();
        firebaseApp.auth().signOut();
    }

    test(){
        alert('hoi');
    }

    render() {
        return (
            <Image source={require('../../../images/achtergrond_man.png')} style={styles.backgroundImage}>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <HeaderBar onBackPressed={() => this.props.navigator.push({name: 'Login', data: null})}
                               title="Registreren"/>
                    <View style={styles.container}>
                        <View style={styles.emptySpace}/>
                        <View style={styles.mainBox}>


                            <Card style={{marginTop:20, width: 290, paddingLeft: -16, paddingRight: -16}}>
                                <View style={{backgroundColor: '#EBEBEB', borderTopLeftRadius: 2, borderTopRightRadius: 2, height: 110, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{margin: 16, flexDirection: 'row'}}>
                                        <View style={{flex: 1.5, height: 40, width: 40, alignSelf:'flex-start', justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{width: 35, height: 35, borderRadius: 20, backgroundColor: '#6F0091', justifyContent: 'center',  alignItems: 'center'}}>
                                                <Text style={{color: 'white', fontSize: 15}}>
                                                    <Image style={{height: 50, width: 55, marginRight: 10}} source={require('../../../images/checkmark_wit.png')} />
                                                </Text>
                                            </View>
                                            <Text style={{fontSize: 12, width: 80,color: '#D3D3D3'}}>Inloggegevens</Text>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}>

                                            </Text>
                                        </View>
                                        <View style={{flex:0.5, alignItems:'center', paddingLeft: 15, marginTop: -7}}>
                                            <Text style={{color: '#D3D3D3', width: 50}}>______</Text>
                                        </View>
                                        <View style={{flex: 1.5, height: 40, width: 40, alignSelf:'center', justifyContent: 'center', alignItems: 'center'}}>
                                            <View style={{width: 35, height: 35, borderRadius: 20, backgroundColor: '#FC0D7F', justifyContent: 'center', alignItems: 'center'}}><Text style={{color: 'white', fontSize: 15}}>2</Text></View>
                                            <Text style={{color: 'black', fontSize: 12}}>Persoonlijk</Text>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}>

                                            </Text>
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
                                    <View style={{margin: 16}}>
                                        <TouchableHighlight underlayColor={'#25006B'} style={{flex: 1, borderRadius: 2, height: 30, backgroundColor: '#6F0091', justifyContent: 'center', alignItems: 'center'}} onPress={()=>this.openImagePicker()}>
                                            <View style={{flex:1, borderRadius: 2, height: 35, justifyContent: 'center', alignItems: 'center',  flexDirection: 'row'}}>
                                                <Image style={{height: 17, width: 22, marginRight: 10}} source={require('../../../images/photowit.png')} />
                                                <Text style={{color: 'white'}}>Kies profielfoto</Text>
                                            </View>
                                        </TouchableHighlight>

                                        <View style={{flex: 1, flexDirection: 'row'}}>
                                            <View style={{flex: 1}}>
                                                <TextInput value={this.state.name}
                                                           autoCapitalize={'sentences'}
                                                           onChangeText={text => this.setState({name: text}, () => this.bottomLineName(text))}
                                                           style={[styles.textInput, {width: 125, borderColor: this.state.borderName, borderBottomWidth: this.state.borderBottomLineName}]}
                                                           placeholder={this.state.namePlaceholder}
                                                           placeholderTextColor= '#D3D3D3'
                                                           underlineColorAndroid='transparent'/>
                                                <View style={{height: this.state.errorHeightName, marginBottom: 20, alignSelf: 'flex-start'}}>
                                                    <Text style={styles.errorText}>
                                                        {this.state.errorName}
                                                    </Text>
                                                </View>
                                                <TextInput value={this.state.lastName}
                                                           autoCapitalize={'words'}
                                                           onChangeText={text => this.setState({lastName: text}, () => this.bottomLineLastName(text))}
                                                           style={[styles.textInput, {width: 125, borderColor: this.state.borderLastName, borderBottomWidth: this.state.borderBottomLineLastName}]}
                                                           placeholder={this.state.lastNamePlaceholder}
                                                           placeholderTextColor= '#D3D3D3'
                                                           underlineColorAndroid='transparent'/>
                                                <View style={{height: this.state.errorHeightLastName, marginBottom: 20, alignSelf: 'flex-start'}}>
                                                    <Text style={styles.errorText}>
                                                        {this.state.errorLastName}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end'}}>
                                                <Image style={{height: 110, width: 110, borderRadius: 60}} source={this.state.image} />
                                            </View>
                                        </View>

                                        <TextInput keyboardType='phone-pad' value={this.state.phone}
                                                   style={[styles.textInput, {borderColor: this.state.borderPhone, borderBottomWidth: this.state.borderBottomLinePhone}]}
                                                   onChangeText={text => this.setState({phone: text}, () => this.bottomLinePhone(text))}
                                                   placeholder={this.state.phonePlaceholder}
                                                   placeholderTextColor= '#D3D3D3'
                                                   maxLength={10}
                                                   minLength={10}
                                                   underlineColorAndroid='transparent'/>
                                        <View style={{height: this.state.errorHeightPhone, alignSelf: 'flex-start'}}>
                                            <Text style={styles.errorText}>
                                                {this.state.errorPhone}
                                            </Text>
                                        </View>
                                    </View>
                                </Card.Body>
                                <View style={{flex:1,flexDirection: 'row'}}>
                                    <Card.Actions position="left">
                                        <View>
                                            <Button overrides={{textColor: '#6F0091'}} onPress={() => this.goToRegOne()} text="Vorige"/>
                                        </View>
                                    </Card.Actions>
                                    <Card.Actions position="right">
                                        <View>
                                            <Button overrides={{textColor: '#6F0091'}} onPress={() => this.checkAll()} text="Volgende"/>
                                        </View>
                                    </Card.Actions>
                                </View>
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
        justifyContent: 'center',
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
    textInput: {
        marginTop: 10,
        // width: 275,
        height: 40,
        fontSize: 15,
        borderColor: '#6F0091',
        color: '#6F0091',
        fontFamily: 'Roboto'
    },
    emptySpace: {
        flex: 0.5
    },
    textInput: {
        marginTop: 10,
        // width: 275,
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
        alignSelf: 'flex-start'
    },
    errorText: {
        color: borderErrorColor,
        marginTop: 5,
        marginLeft: 5,
        marginBottom: 5,
        fontSize: 13
    },
});

AppRegistry.registerComponent('RegisterPage2', () => RegisterPage2);