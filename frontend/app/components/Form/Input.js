import React, { Component } from 'react'
import {StyleSheet, Text, TextInput} from "react-native";
import {View, Icon, ActionSheet} from 'native-base';
import {observer} from 'mobx-react';

@observer
export default class Input extends Component {
  styles = StyleSheet.create({
    wrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: this.props.last ? 0 : StyleSheet.hairlineWidth,
      borderBottomColor: "#d5dae4"
    },

    title: {
      paddingTop: 15,
      paddingBottom: 15,
      marginRight: 20,
      width: 120
    },

    input: {
      display: "flex",
      flex: 1,
      alignItems: "center",
      paddingTop: 10,
      paddingRight: 12,
      paddingBottom: 7
    }
  });

  render () {
    return (
      <View style={this.styles.wrapper}>
        <View style={this.styles.title}><Text>{this.props.title || ""}</Text></View>
        <TextInput
          value={this.props.value ? String(this.props.value) : ""}
          onChangeText={this.props.onChange}
          selectionColor="#a23737"
          secureTextEntry={"secureTextEntry" in this.props}
          underlineColorAndroid="transparent"
          multiline={this.props.multiline || false}
          keyboardType={this.props.keyboardType || "default"}
          style={this.styles.input}/>
      </View>
    )
  }
}
