import React, { Component } from 'react'
import {View, Text, Modal, StyleSheet} from 'react-native';
import { Spinner } from 'native-base';
import App from "../store/App";
import {observer} from 'mobx-react';

@observer
export default class ConnectError extends Component {
  render () {
    return (
      <Modal animationType="none" transparent={true} visible={!App.connect} onRequestClose={() => {}}>
        <View style={componentStyle.overlay}>
          <Spinner color='white'/>
          <Text style={{color: "#fff", textAlign: "center"}}>Нет подключения к интернету</Text>
        </View>
      </Modal>
    )
  }
}

const componentStyle = StyleSheet.create({
  overlay: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(241, 63, 63, 0.8)",
  }
});