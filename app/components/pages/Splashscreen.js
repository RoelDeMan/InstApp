import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Animated,
    Image,
    Easing,
    Dimensions
} from 'react-native';

const deviceWidth = (Dimensions.get('window').width > Dimensions.get('window').height ) ? Dimensions.get('window').height : Dimensions.get('window').width;

export default class Splashscreen extends Component {

    constructor(props) {
        super(props);
        this.state = {spinValue: new Animated.Value(0), fadeValue: new Animated.Value(0), spin: null};
    }


    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../../../images/achtergrond_auto.png')} style={styles.backgroundImage}>

                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Animated.Image style={styles.logoImage} source={require('../../../images/rnmlogo_1000x1000.png')} />
                    </View>
                        {/*<Animated.Image style={[{opacity: this.state.fadeValue}, styles.logoTextImage]} source={require('../../../images/rnmlogotext.png')} />*/}
                </Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flexWrap: 'wrap'
    },
    logoImage: {
        flex: 5,
        marginLeft: deviceWidth * 0.125,
        width: deviceWidth * 0.75,
        height: deviceWidth * 0.75,
        resizeMode: 'contain'
    },
    logoTextImage: {
        flex: 1,
        width: deviceWidth*0.75,
        resizeMode: 'contain',
        marginLeft: deviceWidth*0.125
    }
});

AppRegistry.registerComponent('Splashscreen', () => Splashscreen);