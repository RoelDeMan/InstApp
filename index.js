'use strict';


import React, {Component} from 'react';
import {
    AppRegistry,
} from 'react-native';
import RoutesNaarMobiliteit from "./app/components/RoutesNaarMobiliteit/RoutesNaarMobiliteit";





export default class InstApp extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <RoutesNaarMobiliteit/>
        );
    }

}

console.disableYellowBox = true;
AppRegistry.registerComponent('InstApp', () => InstApp);
