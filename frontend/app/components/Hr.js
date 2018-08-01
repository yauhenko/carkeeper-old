import React, { Component } from 'react'
import { StyleSheet, View} from 'react-native';


export default class Hr extends Component {
  render () {
    return (
      <View style={styles.hr}/>
    )
  }
}

const styles = StyleSheet.create({
  hr : {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 15,
    marginBottom: 15
  }
});