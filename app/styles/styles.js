'use strict';

const React = require('react-native')
const {StyleSheet} = React

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a5a4a4'
  },
  header: {
    justifyContent: 'center',
    marginBottom: 5,
    height: 75,
    borderBottomWidth: 1,
    borderBottomColor: '#686868'
  },
  headerText: {
    fontSize: 25,
    fontFamily: 'Oxygen',
    color: '#686868',
    textAlign: 'center',
    fontWeight: 'bold'
  },
    headerContainer:{
      flex: 10,
        flexDirection: 'column'
    },
  mainBox: {
    marginTop: 15,
    alignItems: 'center'
  },
  mainLine: {
    marginTop: 25,
    borderBottomWidth: 1.5,
    borderBottomColor: '#686868',
  },
  mainText: {
    marginTop: 15,
    fontSize: 20,
    fontFamily: 'Oxygen',
    color: '#686868',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  mainImages: {
    marginTop: 60,
    height: 50,
    width: 50,
  },
  modalWindow: {
    backgroundColor: '#a5a4a4',
    width: 325,
    height: 250,
    justifyContent: 'center',
  },
  modalInput: {
    width: 150,
    fontSize: 20,
    fontFamily: 'Oxygen',
    justifyContent: 'center',
    color: '#686868',
  }
});

module.exports = styles
