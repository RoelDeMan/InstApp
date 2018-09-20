import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Navigator,
    TouchableHighlight, BackAndroid, ScrollView, LayoutAnimation, NativeModules, Platform,

} from 'react-native';

import CarManager from "../Cars/CarManager";

import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressImage from 'react-native-image-progress';
import ProgressImageBar from 'react-native-progress/Bar';
import HeaderBar from "../UI/HeaderBar";
import {Button, Icon, Subheader, Card} from 'react-native-material-design';
import CheckBox from 'react-native-checkbox-heaven';
import MDIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import RNMColorPicker from "../ColorPicker/RNMColorPicker";
// import PressButton from 'react-native-material-button';

const {UIManager} = NativeModules;

const borderErrorColor = 'red';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);


export default class RegisterPage3 extends Component {

    DISABLE_TOUCH = 'none';
    ENABLE_TOUCH = 'auto';
    DISABLED_COLOR = '#D3D3D3';

    ACCENT_COLOR = '#4A0091';
    LICENSE_TEXT_COLOR = '#2C2C2C';


    colours = [
        {colour: 'donkerblauw', hex: '#3F578C'},
        {colour: 'rood', hex: '#FF0000'},
        {colour: 'wit', hex: '#FFFFFF'},
        {colour: 'lichtblauw', hex: '#2FA9E4'},
        {colour: 'zwart', hex: '#000000'},
        {colour: 'grijs', hex: '#D3D3D3'},
        {colour: 'groen', hex: '#217F4E'},
        {colour: 'oranje', hex: '#F37047'},
        {colour: 'donkergrijs', hex: '#636363'},
        {colour: 'paars', hex: '#B91E4C'},
        {colour: 'geel', hex: '#F5C84E'},
        {colour: 'roze', hex: '#FF3399'}
    ];

    constructor() {
        super();
        this.state = {
            carChecked: false,
            pointerEvents: this.DISABLE_TOUCH,
            carColor: this.colours[0].hex,
            carColorText: this.colours[0].colour,
            carDisplayColor: this.DISABLED_COLOR,
            carDisplayColorText: '',
            licenseHeaderColor: this.DISABLED_COLOR,
            licenseTextColor: this.DISABLED_COLOR,
            carButtonColor: this.DISABLED_COLOR,
            licenseText: '',
            carBrandText: '',
            carTypeText: '',
            colorModal: false,
            editable: false
        };
    }


    goToRegTwo() {
        this.props.navigator.pop();
    }


    onCheckPressed(checked) {
        let pointerEvents = checked ? this.ENABLE_TOUCH : this.DISABLE_TOUCH;
        let carDisplayColor = checked ? this.state.carColor : this.DISABLED_COLOR;
        let licenseHeaderColor = checked ? this.ACCENT_COLOR : this.DISABLED_COLOR;
        let licenseTextColor = checked ? this.LICENSE_TEXT_COLOR : this.DISABLED_COLOR;
        let carButtonColor = checked ? this.ACCENT_COLOR : this.DISABLED_COLOR;
        this.setState(
            {
                carChecked: checked,
                pointerEvents: pointerEvents,
                carDisplayColor: carDisplayColor,
                licenseHeaderColor: licenseHeaderColor,
                licenseTextColor: licenseTextColor,
                carButtonColor: carButtonColor,
            }
        )
    }

    checkAll() {
        if(this.state.carChecked){
            CarManager.addCar(this.state.carTypeText,
                this.state.carBrandText,
                this.state.carColorText,
                this.state.licenseText)
                .then(() => {
                    this.props.navigator.push({name: 'MainLayout', data: null});
                })
        }else{
            this.props.navigator.push({name: 'MainLayout', data: null});
        }

    }

    closeModal(cancel){
        if(cancel){
            this.setState({carDisplayColor: this.state.carColor, carDisplayColorText: this.state.carColorText, colorModal: false});
        }else{
            this.setState({carColor: this.state.carDisplayColor, carColorText: this.state.carDisplayColorText, colorModal: false});
        }
    }

    render() {
        return (
            <Image source={require('../../../images/achtergrond_leeg.png')} style={styles.backgroundImage}>
                <ScrollView style={{flex: 1}} contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
                    <HeaderBar onBackPressed={() => this.props.navigator.push({name: 'Login', data: null})}
                               title="Registreren"/>
                    <View style={styles.container}>
                        <View style={styles.emptySpace}/>
                        <View style={styles.mainBox}>


                            <Card style={{marginTop: 20, width: 290, paddingLeft: -16, paddingRight: -16}}>
                                <View style={{
                                    backgroundColor: '#EBEBEB',
                                    borderTopLeftRadius: 2,
                                    borderTopRightRadius: 2,
                                    height: 110,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={{margin: 16, flexDirection: 'row'}}>
                                        <View style={{
                                            flex: 1.5,
                                            height: 40,
                                            width: 40,
                                            alignSelf: 'flex-start',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <View style={{
                                                width: 35,
                                                height: 35,
                                                borderRadius: 20,
                                                backgroundColor: '#6F0091',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={{color: 'white', fontSize: 15}}>
                                                    <Image style={{height: 50, width: 55, marginRight: 10}}
                                                           source={require('../../../images/checkmark_wit.png')}/>
                                                </Text>
                                            </View>
                                            <Text
                                                style={{fontSize: 12, width: 80, color: '#D3D3D3'}}>Inloggegevens</Text>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}>

                                            </Text>
                                        </View>
                                        <View style={{flex: 0.5, alignItems: 'center', paddingLeft: 15, marginTop: -7}}>
                                            <Text style={{color: '#D3D3D3', width: 50}}>______</Text>
                                        </View>
                                        <View style={{
                                            flex: 1.5,
                                            height: 40,
                                            width: 40,
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <View style={{
                                                width: 35,
                                                height: 35,
                                                borderRadius: 20,
                                                backgroundColor: '#6F0091',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}><Text style={{color: 'white', fontSize: 15}}>
                                                <Image style={{height: 50, width: 55, marginRight: 10}}
                                                       source={require('../../../images/checkmark_wit.png')}/>
                                            </Text>
                                            </View>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}>Persoonlijk</Text>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}>

                                            </Text>
                                        </View>
                                        <View style={{flex: 0.5, alignItems: 'center', paddingLeft: 15, marginTop: -7}}>
                                            <Text style={{color: '#D3D3D3', width: 50}}>______</Text>
                                        </View>
                                        <View style={{
                                            flex: 1.5,
                                            height: 40,
                                            width: 40,
                                            alignSelf: 'flex-end',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <View style={{
                                                width: 35,
                                                height: 35,
                                                borderRadius: 20,
                                                backgroundColor: '#FC0D7F',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}><Text style={{color: 'white', fontSize: 15}}>3</Text></View>
                                            <Text style={{color: '#D3D3D3', fontSize: 12}}>Auto</Text>
                                            <Text style={{color: '#D3D3D3', fontSize: 12, marginBottom: -12}}>(Optioneel)</Text>
                                        </View>
                                    </View>
                                </View>
                                <Card.Body>
                                    <View style={{margin: 0, padding: 5}}>
                                        <View style={styles.checkBoxContainer}>
                                            <CheckBox
                                                style={styles.checkbox}
                                                iconSize={30}
                                                iconName='matMix'
                                                checked={this.state.carChecked}
                                                onChange={(checked) => this.onCheckPressed(checked)}
                                                label="Ik heb een auto en wil anderen uit mijn omgeving graag helpen met een mobiliteitsprobleem als dat uitkomt."
                                                labelStyle={styles.labelStyle}
                                                checkedColor="#6F0091"
                                                uncheckedColor="#D3D3D3"
                                            />

                                        </View>

                                        <TextInput
                                            style={[styles.licenseInput, {color: this.state.licenseTextColor}]}
                                            underlineColorAndroid={this.state.licenseHeaderColor}
                                            autoCapitalize="characters"
                                            placeholder={'Kenteken'}
                                            editable={this.state.carChecked}
                                            onChangeText={(text) => this.setState({licenseText: text})}/>
                                        <TextInput
                                            style={[styles.licenseInput, {color: this.state.licenseTextColor}]}
                                            underlineColorAndroid={this.state.licenseHeaderColor}
                                            placeholder={'Automerk'}
                                            editable={this.state.carChecked}
                                            onChangeText={(text) => this.setState({carBrandText: text})}/>
                                        <TextInput
                                            style={[styles.licenseInput, {color: this.state.licenseTextColor}]}
                                            underlineColorAndroid={this.state.licenseHeaderColor}
                                            placeholder={'Autotype'}
                                            onChangeText={(text) => this.setState({carTypeText: text})}/>
                                        <View style={styles.carSelectContainer}
                                              editable={this.state.carChecked}
                                              pointerEvents={this.state.pointerEvents}>

                                            <View
                                                style={[styles.colorCircle, {backgroundColor: this.state.carDisplayColor}]}>
                                            </View>

                                            <TouchableHighlight
                                                style={[styles.carButton, {backgroundColor: this.state.carButtonColor}]}
                                                onPress={() => this.setState({colorModal: true})}>
                                                <Text style={styles.carButtonTextColor}>Kies autokleur</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                </Card.Body>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Card.Actions position="left">
                                        <View>
                                            <Button overrides={{textColor: '#6F0091'}} onPress={() => this.goToRegTwo()}
                                                    text="Vorige"/>
                                        </View>
                                    </Card.Actions>
                                    <Card.Actions position="right">
                                        <View>
                                            <Button overrides={{textColor: '#6F0091'}} onPress={() => this.checkAll()}
                                                    text="Afronden"/>
                                        </View>
                                    </Card.Actions>
                                </View>
                            </Card>
                        </View>
                        <View style={styles.emptySpace}/>


                    </View>
                    <View style={{flex: 4, flexDirection: 'column', justifyContent: 'flex-end',marginTop: 100}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', bottom: 0,}}>
                            <MDIcon name={"car"} color={this.state.carDisplayColor} size={100}/>
                        </View>
                    </View>
                    <Modal
                        onRequestClose={() => this.setState({colorModal: false})}
                        isVisible={this.state.colorModal}
                        transparent={true}
                        animationType={"fade"}
                        style={styles.colorModal}>
                        <Text style={{color: '#000000', margin: 10, fontSize: 15}}>Autokleur</Text>

                        <RNMColorPicker selectedcolor={this.state.carColor} colours={this.colours} onColorPressed={(hex, text) => this.setState({
                            carDisplayColor: hex,
                            carDisplayColorText: text
                        })}/>

                        <View style={styles.bottomModalButtons}>
                            <Button overrides={{textColor: '#6F0091', padding: 20,}} onPress={() => this.closeModal(true)}
                                    text="Annuleren"/>
                            <Button overrides={{textColor: '#6F0091', padding: 20,}} onPress={() => this.closeModal(false)}
                                    text="OK"/>
                        </View>
                    </Modal>
                </ScrollView>
            </Image>

        )
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null
    },
    bottomModalButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    carButton: {
        marginTop: 10,
        marginBottom: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    carButtonTextColor: {
        color: '#FFFFFF',
    },
    carSelectContainer: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 10,
        // justifyContent: 'space-between'
        justifyContent: 'center'
    },
    colorCircle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#BBBBBB',
        margin: 10,
    },
    colorModal: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
        flex: 1,
        marginTop: 150,
        marginBottom: 150,
        padding: 10,
        justifyContent: 'space-between'

    },
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    checkBoxContainer: {
        margin: 0,
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
    licenseContainer: {
        flex: 1,
        flexDirection: 'column',

    },
    licenseHeaderText: {
        flex: 1,
    },
    licenseInput: {
        flex: 1,
    },
    loginEmailText: {
        marginLeft: 5,
        color: 'white',
        fontFamily: 'Roboto medium',
        fontSize: 15
    },
    loginEmailButton: {
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
    labelStyle: {
        fontSize: 13,
        padding: 2,
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

AppRegistry.registerComponent('RegisterPage3', () => RegisterPage3);