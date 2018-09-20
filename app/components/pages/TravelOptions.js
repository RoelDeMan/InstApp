'use strict';


import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
} from 'react-native';



class TravelOptions extends Component {

    NOTDRIVING = 'Rijden';
    DRIVING = 'Stoppen met rijden';


    constructor(props) {
        super(props);

    }




    render() {
        return (
            <View style={styles.container}>
                <View style={styles.selectDriveOption}>
                    <TouchableHighlight style={styles.travelButton} underlayColor={'#998e88'}
                                        onPress={this.props.onPassengerPressed}>
                        <Text style={styles.submitText}>
                            Meerijden
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.travelButton} underlayColor={'#998e88'}
                                        onPress={this.props.onDriverPressed}>
                        <Text style={styles.submitText}>
                            {this.NOTDRIVING}
                        </Text>
                    </TouchableHighlight>
                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'stretch',

    },
    container: {
        flex: 1,
    },
    comboBox: {
        height: 60,
        width: 160,
    },
    selectCarModal: {
        backgroundColor: '#FFFFFF'
    },
    selectDriveOption: {

        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        alignSelf: 'stretch'
    },
    submitTop: {
        height: 80,
        width: 162,
        backgroundColor: 'white',
        borderColor: '#998e88',
        borderRightWidth: 1,
        padding: 25,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    submitBottom: {
        height: 80,
        width: 162,
        backgroundColor: 'white',
        borderColor: '#998e88',
        borderLeftWidth: 1,
        padding: 25,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
    },
    submitText: {
        textAlign: 'center',
        fontSize: 25,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
        alignSelf: 'stretch'
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
    },
    modalOverview: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    selectNowOrDelay: {
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalTextBox1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: 110,
        width: 102,
    },
    modalDelayBox: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    modalTextBox2: {
        flex: 1,
        borderLeftWidth: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 110,
        width: 102,
    },
    modalText: {
        fontSize: 20,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: 'center',
    },
    modalSelectTimeWindow: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        width: 325,
        backgroundColor: 'white',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: 1,
        borderColor: '#998e88'
    },
    modalSelectTimeText: {
        fontSize: 20,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: 'center',
    },
    travelButton: {

        justifyContent: 'center',
        alignSelf: 'stretch',
        marginTop: 0,



    }
});

module.exports = TravelOptions;
