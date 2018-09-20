import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text, TouchableHighlight,
    View
} from 'react-native';

export default class RNMColorCircle extends Component {


    NOTSELECTED;
    SELECTED;
    colorListener;
    color;
    colorText;

    constructor(props) {
        super(props);
        this.SELECTED = (props.colour == '#000000') ? '#cccccc' : '#000000';
        this.NOTSELECTED = this.props.colour;
        this.state = {selected: this.NOTSELECTED};
        this.colorListener = props.main;
        this.color = props.colour;
        this.colorText = props.colortext;
        this.colorSelected = this.colorSelected.bind(this);
    }

    colorSelected() {
        this.colorListener.colorSelected(this.color, this.colorText);
        this.setSelected();

    }

    setSelected() {
        this.setState({selected: this.SELECTED});
    }

    setNotSelected() {
        this.setState({selected: this.NOTSELECTED});
    }

    getColor() {
        return this.color;
    }


    getColorText(){
        return this.colorText;
    }

    render() {

        return (
            <View style={[styles.container, {backgroundColor: this.props.colour,}]}>
                <TouchableHighlight style={[styles.colorButton, {borderColor: this.state.selected}]}
                                    onPress={() => this.colorSelected()}>
                    <View><Text></Text></View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#000000'

    },
    check: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,

    },
    colorButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 5,

    },
});


AppRegistry.registerComponent('RNMColorCircle', () => RNMColorCircle);
