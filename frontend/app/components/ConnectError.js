import React, { Component } from 'react'
import {View, Text} from 'react-native';
import { Spinner } from 'native-base';
import App from "../store/App";
import {observer} from 'mobx-react';

@observer
export default class ConnectError extends Component {
  render () {
    return (
      <React.Fragment>
        {this.props.children}

        {App.connect
          ?
          null
          :
          <View style={{position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", left: 0, right: 0, top: 0, bottom: 0, zIndex: 100, backgroundColor: "rgba(241, 63, 63, 0.8)"}}>
            <Spinner color='white'/>
            <Text style={{color: "#fff", textAlign: "center"}}>Нет подключения к интернету</Text>
          </View>
        }
      </React.Fragment>
    )
  }
}