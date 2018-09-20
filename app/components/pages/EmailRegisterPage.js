import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput, TouchableHighlight, ScrollView
} from 'react-native';
import HeaderBar from "../UI/HeaderBar";
import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';
import Preferences from 'react-native-default-preference';
import PreferenceKeys from '../PreferenceKeys/PreferenceKeys';

export default class EmailRegisterPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordConfirm: '',
        }
    }

    onRegister() {
        if (this.state.password === this.state.passwordConfirm) {
            firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((user) => {
                        console.log("signed up");
                        uid = firebaseApp.auth().currentUser.uid;
                        updates = {};
                        updates[FirebaseKeys.USER.EMAIL] = this.state.email;
                        firebaseApp.database()
                            .ref(FirebaseKeys.USER_NODE)
                            .child(uid)
                            .update(updates);
                        Preferences.set(PreferenceKeys.LAST_USED_EMAIL,this.state.email);
                    },
                    (error) => {
                        console.log(error);
                    });
        } else {
            console.log("Wachtwoorden zijn niet hetzelfde")
        }

    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <HeaderBar onBackPressed={() => this.props.navigator.push({name: 'EmailLogin', data: null})}
                               title="Registeren"/>
                    <View style={styles.emailRegisterContainer}>
                        <TextInput keyboardType='email-address' value={this.state.email}
                                   onChangeText={text => this.setState({email: text})}/>
                        <TextInput secureTextEntry={true} value={this.state.password}
                                   onChangeText={text => this.setState({password: text})}/>
                        <TextInput secureTextEntry={true} value={this.state.passwordConfirm}
                                   onChangeText={text => this.setState({passwordConfirm: text})}/>
                        <TouchableHighlight onPress={() => this.onRegister()}><Text>Login</Text></TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    emailRegisterContainer: {
        flex: 10,
    }

});

AppRegistry.registerComponent('EmailRegisterPage', () => EmailRegisterPage);
