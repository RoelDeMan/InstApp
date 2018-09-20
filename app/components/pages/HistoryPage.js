import React, {Component} from 'react';
import {
    AppRegistry, Button, ListView, Modal, ScrollView,
    StyleSheet,
    Text, TouchableHighlight,
    Image,
    View,
} from 'react-native';


import firebaseApp from '../Firebase/Firebase';
import FirebaseKeys from '../FirebaseKeys/FirebaseKeys';

let ScrollableTabView = require('react-native-scrollable-tab-view');
import { Card } from 'react-native-material-design';

export default class HistoryPage extends Component {

    baseNumber = 5;
    increment = 5;

    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            passengerDataSource: ds,
            driverDataSource: ds,
            passengerMax: this.baseNumber,
            driverMax: this.baseNumber,
            passengerMoreButton: (<TouchableHighlight style={styles.button} onPress={() => {this.incrementMax(true);}}><Text style={{color: 'white'}}>Meer laden</Text></TouchableHighlight>),
            driverMoreButton: (<TouchableHighlight style={styles.button} onPress={() => {this.incrementMax(false);}}><Text style={{color: 'white'}}>Meer laden</Text></TouchableHighlight>),
            detailModel: false,
            trip: '',
            driver: false,
            page: 'passenger',
        }
    }

    componentDidMount() {
        this.fetchAllData();
    }

    incrementMax(passenger){

        if(passenger){
            let newMax =  this.state.passengerMax + this.increment
            this.setState({passengerMax: newMax});
            this.fetchPassengerData(newMax)
        }else{
            let newMax =  this.state.driverMax + this.increment
            this.setState({driverMax: newMax});
            this.fetchDriverData(newMax);
        }
    }

    fetchAllData() {
        this.fetchPassengerData(this.state.passengerMax);
        this.fetchDriverData(this.state.driverMax);
    }

    fetchPassengerData(max) {
        uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database().ref(FirebaseKeys.REQUEST_NODE)
            .orderByChild(FirebaseKeys.REQUEST.PASSENGER.UID)
            .equalTo(uid)
            .limitToLast(max)
            .once(FirebaseKeys.VALUE.ONCE)
            .then((snapshot) => {
                let items = [];
                snapshot.forEach((trip) => {
                    items.push({
                        date: new Date(trip.child(FirebaseKeys.REQUEST.TIMESTAMP).val()).toLocaleString(),
                        driver: trip.child(FirebaseKeys.REQUEST.DRIVER.NAME).val(),
                        destination: trip.child(FirebaseKeys.REQUEST.DESTINATION.ADDRESS).val(),
                        destinationCity: trip.child(FirebaseKeys.REQUEST.DESTINATION.CITY).val(),
                        ref: trip.key,
                    });
                });
                this.setState({passengerDataSource: this.state.passengerDataSource.cloneWithRows(items.reverse())});
                if(items.length == 0){
                 this.setState({passgengerMoreButton: (<Text>Geen items</Text>)});
                }else if (items.length != max) {
                    this.setState({passengerMoreButton: null});
                }
            });
    }

    fetchDriverData(max) {
        let uid = firebaseApp.auth().currentUser.uid;
        firebaseApp.database().ref(FirebaseKeys.REQUEST_NODE)
            .orderByChild(FirebaseKeys.REQUEST.DRIVER.UID)
            .equalTo(uid)
            .limitToLast(max)
            .once(FirebaseKeys.VALUE.ONCE)
            .then((snapshot) => {
                let items = [];
                snapshot.forEach((trip) => {
                    items.push({
                        date: new Date(trip.child(FirebaseKeys.REQUEST.TIMESTAMP).val()).toLocaleString(),
                        passenger: trip.child(FirebaseKeys.REQUEST.PASSENGER.NAME).val(),
                        destination: trip.child(FirebaseKeys.REQUEST.DESTINATION.ADDRESS).val(),
                        destinationCity: trip.child(FirebaseKeys.REQUEST.DESTINATION.CITY).val(),
                        ref: trip.key,
                    });
                });
                this.setState({driverDataSource: this.state.driverDataSource.cloneWithRows(items.reverse())});
                if(items.length == 0) {
                    this.setState({driverMoreButton: (<Text>Geen items</Text>)});
                }else if (items.length != max) {
                    this.setState({driverMoreButton: null});
                }
            });
    }

    onPressPassenger(trip) {
        this.setState({trip: trip, detailModel: true, driver: true});
    }

    getCorrectHours(trip){
        let hours = new Date(trip.date).getHours();
        return hours;
    }

    getCorrectMinutes(trip){
        let minutes = new Date(trip.date).getMinutes();
        let time = JSON.stringify(minutes);
        if (time.length === 1){
            time = '0' + time;
            return time;
        }else{
            return time;
        }
    }

    getDayNumber(trip){
        let day = new Date(trip.date).getDate();
        return day;
    }

    getCorrectMonth(trip){
        let month = new Date(trip.date).getMonth();
        if(month === 0){
            return 'januari';
        }else if(month === 1){
            return 'februari';
        }else if(month === 2){
            return 'maart';
        }else if (month === 3){
            return 'april';
        }else if (month === 4){
            return 'mei';
        }else if (month === 5){
            return 'juni';
        }else if (month === 6){
            return 'juli';
        }else if (month === 7){
            return 'augustus';
        }else if (month === 8){
            return 'september';
        }else if (month === 9){
            return 'oktober';
        }else if (month === 10){
            return 'november';
        }else if (month === 11){
            return 'december';
        }else{
            return 'Geen datum';
        }
    }

    getYear(trip){
        let year = new Date (trip.date).getFullYear();
        return year;
    }

    getCorrectDayName(trip){
        let day = new Date(trip.date).getDay();

        if(day === 1){
            return 'Maandag';

        }else if(day === 2){
            return 'Dinsdag';

        }else if(day === 3){
            return 'Woensdag';

        }else if (day === 4){
            return 'Donderdag';
        }else if (day === 5){
            return 'Vrijdag';

        }else if (day === 6){
            return 'Zaterdag';

        }else if (day === 0){
            return 'Zondag';
        }else{
            return 'error';
        }
    }

    getDestinationName(trip){
        let arr = [];
        let t = JSON.stringify(trip.destinationCity);
        let j = t.split(", ");
        arr.push(j[0]);
        if (arr[0].indexOf(null)){
            return ', '+ arr[0].substring(1);
        }else{
            return 'Geen bestemming';
        }
    }

    renderPassengerRow(trip, sectionId, rowId, highlightRow) {
        return (
            <TouchableHighlight onPress={() => {
                this.onPressPassenger(trip)
            }}>
                <View>
                    <Card style={{flex: 1, alignSelf: 'stretch'}}>
                        <Card.Body>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image style={styles.personImage} source={require('../../../images/manfull_ROOD.png')} />
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.rowDestination}>{trip.destination}{this.getDestinationName(trip)}</Text>
                                    <Text style={styles.rowDate}>{this.getCorrectDayName(trip)} {this.getDayNumber(trip)} {this.getCorrectMonth(trip)}</Text>
                                    <Text style={styles.rowDate}>{this.getCorrectHours(trip)}:{this.getCorrectMinutes(trip)} uur {this.getYear(trip)}</Text>
                                    <View style={{flex: 1, flexDirection: 'row', alignItems:'center'}}>
                                        <Image style={styles.wheel} source={require('../../../images/driver_zwart.png')}/><Text style={[styles.rowDate,{justifyContent: 'center', alignItems: 'center'}]}>{trip.driver}</Text>
                                    </View>
                                </View>
                            </View>
                        </Card.Body>
                    </Card>
                </View>
            </TouchableHighlight>);
    }

    onPressDriver(trip) {
        this.setState({trip: trip, detailModel: true, driver: false});
    }

    renderDriverRow(trip, sectionId, rowId, highlightRow) {
        return (
            <TouchableHighlight onPress={() => {
                this.onPressDriver(trip)
            }}>
                <View>
                    <Card style={{flex: 1, alignSelf: 'stretch'}}>
                        <Card.Body>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image style={styles.carImage} source={require('../../../images/auto_donkerrood.png')} />
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.rowDestination}>{trip.destination}{this.getDestinationName(trip)}</Text>
                                    <Text style={styles.rowDate}>{this.getCorrectDayName(trip)} {this.getDayNumber(trip)} {this.getCorrectMonth(trip)}</Text>
                                    <Text style={styles.rowDate}>{this.getCorrectHours(trip)}:{this.getCorrectMinutes(trip)} uur {this.getYear(trip)}</Text>
                                    <View style={{flex: 1, flexDirection: 'row', alignItems:'center'}}>
                                        <Image style={styles.person} source={require('../../../images/manfull_zwart.png')}/><Text style={[styles.rowDate,{justifyContent: 'center', alignItems: 'center'}]}>{trip.passenger}</Text>
                                    </View>
                                </View>
                            </View>
                        </Card.Body>
                    </Card>
                </View>
            </TouchableHighlight>);
    }

    render() {
        return (
            <Image source={require('../../../images/achtergrond_man.png')} style={styles.backgroundImage}>
                <ScrollView style={{zIndex: 3}}>

                    <View style={styles.container}>
                        <ScrollableTabView
                            tabBarBackgroundColor="#4A0091"
                            tabBarUnderlineStyle={{backgroundColor: '#FFFFFF'}}
                            tabBarActiveTextColor="#FFFFFF"
                            tabBarInactiveTextColor="#FFFFFF"
                            tabBarTextStyle={{fontFamily: 'Roboto'}}

                            style={{marinBottom: -1}}
                            tabBarPosition="top">
                            <View tabLabel="Passagier">
                                <ScrollView >
                                    <ListView dataSource={this.state.passengerDataSource}
                                              renderRow={this.renderPassengerRow.bind(this)}/>
                                    <View>{this.state.passengerMoreButton}</View>
                                </ScrollView>
                            </View>
                            <View tabLabel="Bestuurder">
                                <ScrollView>
                                    <ListView dataSource={this.state.driverDataSource}
                                              renderRow={this.renderDriverRow.bind(this)}/>
                                </ScrollView>
                                <View>{this.state.driverMoreButton}</View>
                            </View>
                        </ScrollableTabView>
                        <Modal
                            visible={this.state.detailModel}
                            animationType='slide'
                            onRequestClose={() => console.log('detail closed')}
                            transparent={false}
                        >
                            <View style={styles.modalContainer}>
                                <ScrollView>
                                    <Text style={styles.modalText}>{JSON.stringify(this.state.trip)}</Text>
                                </ScrollView>
                                <Button color='#4A0091' title="Terug" onPress={() => this.setState({detailModel: false})}></Button>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null
    },
    container: {
        zIndex: 3,
        flex: 1,
        flexDirection: 'column',
    },
    modalContainer: {
        padding: 30,
        alignSelf: 'stretch',
        flex: 1,
        backgroundColor: '#95989A',
    },
    modalText: {
        fontSize: 20,
        color: '#000000'
    },
    carImage: {
        paddingTop: 20,
        paddingBottom: 20,
        width: 115,
        height: 60,
        marginLeft: -16
    },
    personImage: {
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: -16,
        width: 40,
        height: 80
    },
    rowDestination: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black'
    },
    rowDate: {
        marginTop: 5,
        fontSize: 12,
        color: 'black'
    },
    wheel:{
        width: 20,
        height: 20,
        marginTop: 5,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    person: {
        width: 12,
        height: 25,
        marginTop: 5,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        flex: 1,
        marginLeft: 7,
        marginRight: 7,
        marginTop: 30,
        marginBottom: 50,
        borderRadius: 2,
        color: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A0091',
        height: 40
    }
});

AppRegistry.registerComponent('HistoryPage', () => HistoryPage);
