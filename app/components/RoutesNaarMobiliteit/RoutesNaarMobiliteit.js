import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator
} from 'react-native';
import Login from '../pages/Login';
import MainLayout from "../MainLayout/MainLayout";
import RegisterPage from "../pages/RegisterPage";
import RegisterPage2 from "../pages/RegisterPage2";
import RegisterPage3 from "../pages/RegisterPage3";
import Splashscreen from "../pages/Splashscreen";
import EmailRegisterPage from "../pages/EmailRegisterPage";
import EmailLoginPage from "../pages/EmailLoginPage";
import firebaseApp from '../Firebase/Firebase';
import DriverPage from '../pages/DriverPage';
import OptionsPage from "../pages/OptionsPage";
import FirebaseKeys from "../FirebaseKeys/FirebaseKeys";

export default class RoutesNaarMobiliteit extends Component {

    navigator;
    authListener;

    constructor(props) {
        super(props);

        setTimeout(() => {
            this.renderScene = this.renderScene.bind(this);
            this.authListener = firebaseApp.auth().onAuthStateChanged((user) => {
                setTimeout(() => {
                    if (user) {
                        let username = firebaseApp.auth().currentUser.displayName;
                        let uid = firebaseApp.auth().currentUser.uid;
                        if(username) {
                            firebaseApp.database().ref("drivers/"+uid).remove();
                            firebaseApp.database()
                                .ref('requests/')
                                .once(FirebaseKeys.VALUE.ONCE)
                                .then((snapshot) => {
                                    snapshot.forEach((childSnapshot) => {
                                        let dbid = childSnapshot.val();
                                        console.log(dbid.uid);
                                        console.log(uid);
                                        if(dbid.uid === uid){
                                            firebaseApp.database().ref('requests/'+childSnapshot.key).remove();
                                        }
                                    });
                                });

                            this.navigator.push({name: "MainLayout", data: null});
                        }
                        else{
                            this.navigator.push({name: "RegisterPage2", data: null});
                        }
                    }else{
                        this.navigator.push({name: "Login", data: null});
                    }
                }, 400);
            });
        }, 600);
    }


    componentWillUnmount(){
        if(this.authListener){
            this.authListener();
        }
    }


    renderScene(route, navigator) {
        if (route.name === 'Splash') {
            return <Splashscreen navigator={navigator}/>;
        } else if (route.name === 'MainLayout') {
            return <MainLayout navigator={navigator} data={route.data}/>;
        } else if (route.name === 'Login') {
            return <Login navigator={navigator} data={route.data}/>;
        } else if (route.name === 'RegisterPage') {
            return <RegisterPage navigator={navigator} data={route.data}/>;
        } else if (route.name === 'RegisterPage2') {
            return <RegisterPage2 navigator={navigator} data={route.data}/>;
        } else if (route.name === 'RegisterPage3') {
            return <RegisterPage3 navigator={navigator} data={route.data}/>;
        } else if (route.name === 'EmailLogin'){
            return <EmailLoginPage navigator={navigator}/>;
        } else if (route.name === 'EmailRegister'){
            return <EmailRegisterPage navigator={navigator}/>;
        } else if (route.name === 'DriverPage'){
            return <DriverPage navigator={navigator}/>;
        }else if (route.name === 'OptionsPage'){
            return <OptionsPage navigator={navigator}/>;
        }
    }

    render() {
        return (
            <Navigator
                ref={(ref) => this.navigator = ref}
                initialRoute={{name: 'Splash'}}
                renderScene={this.renderScene}
                configureScene={() => {
                    return {...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: {}}
                }}
            />
        );
    }

}


AppRegistry.registerComponent('RoutesNaarMobiliteit', () => RoutesNaarMobiliteit);
