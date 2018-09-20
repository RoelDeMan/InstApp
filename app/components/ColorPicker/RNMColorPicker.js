import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,

} from 'react-native';

import Grid from 'react-native-grid-component';
import ColorCircle from './RNMColorCircle';

export default class RNMColorPicker extends Component {

    circles = [];

    constructor(props) {
        super(props);
        colours = this.props.colours;
        this.state = {carColour: props.selectedcolor};
        console.log("RNMColorPicker constructor");
    }


    colorSelected(colour,colourText) {
        this.resetSelected();
        this.props.onColorPressed(colour,colourText);

    }

    resetSelected(){
        circles = this.circles;
        for(i=0;i<circles.length;i++){
            circles[i].setNotSelected();
        }
    }

    renderItem(data, i) {
        selected = (this.props.carColour == data.hex);
        return <ColorCircle ref={(ref) => this.circles.push(ref)} main={this} colour={data.hex} colortext={data.colour} selected={selected}/>;
    }

    setSelectedColor(color){
        console.log('setSelectedColor: ', color);
        this.resetSelected();
        for(i = 0 ;i<this.circles.length;i++){
            console.log('Circle: ' +  i , this.circles[i].getColorText() );
            if(this.circles[i].getColorText() === color){
                this.circles[i].setSelected();
                console.log(color);
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Grid
                    style={styles.list}
                    renderItem={this.renderItem.bind(this)}
                    data={this.props.colours}
                    itemsPerRow={4}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        flex: 3,
    },
    list: {
        alignSelf: 'stretch'
    }

});

AppRegistry.registerComponent('RNMColorPicker', () => RNMColorPicker);
