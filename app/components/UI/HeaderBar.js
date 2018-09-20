import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class EditHeaderBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={[styles.backButton, this.props.backButtonStyle]}
                                    onPress={this.props.onBackPressed}
                >
                    <Icon size={20} name="arrow-back" style={[styles.backButtonText, this.props.backButtonTextStyle,{color:'#FFFFFF'}]}/>

                </TouchableHighlight>
                <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#36006b'
    },
    backButton: {
        flex: 1,
        padding: 20,
    },
    title: {
        flex: 6,
        padding: 20,
        color: '#FFFFFF',
    },
});

EditHeaderBar.propTypes = {
    title: Text.propTypes.string,
    onBackPressed: TouchableHighlight.propTypes.onPress,
}

AppRegistry.registerComponent('EditHeaderBar', () => EditHeaderBar);
