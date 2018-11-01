import React, { Component } from 'react'
import {StyleSheet, Text, TextInput} from "react-native";
import {View, Icon, ActionSheet} from 'native-base';
import {observer} from 'mobx-react';

@observer
export default class Select extends Component {
  render () {
    return (
      <View style={styles.wrapper}>
        <View style={styles.title}><Text>{this.props.title || ""}</Text></View>
        <TextInput value={this.props.value ? String(this.props.value) : ""} onChangeText={this.props.onChange} selectionColor="#a23737" autoCorrect={false} underlineColorAndroid="transparent" keyboardType="numeric"  style={styles.input}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },

  title: {
    paddingTop: 15,
    paddingLeft: 17,
    paddingBottom: 15,
    marginRight: 20,
    width: 120
  },

  input: {
    display: "flex",
    alignItems: "center",
    paddingTop: 10,
    paddingLeft: 12,
    paddingBottom: 7,
    flexGrow: 2,
    borderBottomWidth: .5,
    borderBottomColor: "#ccc"
  },
});