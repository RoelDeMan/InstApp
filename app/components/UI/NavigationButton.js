import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NativeModules, TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

NavigationModule = NativeModules.NavigationModule;

export default class NavigationButton extends Component {

    constructor(props){
        super(props);
        this.state = {street: props.address, city: props.city};
    }

    startNavigation(){
        console.log('GEEEEEEK');
        console.log(this.state.street);
        console.log(this.state.city);
        // 'Imkersstraat 39'
        // 'Nijmegen'
        console.log('GEEEEEEK');
        // NavigationModule.startAddressNavigation('Imkersstraat 39', 'Nijmegen');
        NavigationModule.startAddressNavigation(this.state.street, this.state.city);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight underlayColor='#D3D3D3' onPress={() => {this.startNavigation()}}>
                    <Icon color={'#4A0091'} size={26} name="directions"/>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -9,
        backgroundColor: '#FFFFFF',
    },

});

AppRegistry.registerComponent('NavigationButton', () => NavigationButton);
