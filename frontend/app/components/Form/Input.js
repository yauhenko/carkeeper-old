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
      flex: 1,
      alignItems: "center",
      paddingTop: 10,
      paddingLeft: 0,
      paddingRight: 12,
      paddingBottom: 7,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "#d6d7da",
      color: this.props.light ? "#fff" : "#000"
    },

    text : {
      color: this.props.light ? "#fff" : "#000"
    }
  });

  render () {
    return (
      <View style={this.styles.wrapper}>
        <View style={this.styles.title}><Text style={this.styles.text}>{this.props.title || ""}</Text></View>
        <TextInput
          value={this.props.value ? String(this.props.value) : ""}
          onChangeText={this.props.onChange}
          selectionColor={this.props.light ? "#fff" : "#a23737"}
          autoCorrect={false}
          secureTextEntry={"secureTextEntry" in this.props}
          underlineColorAndroid="transparent"
          multiline={this.props.multiline || false}
          keyboardType={this.props.keyboardType || "default"}
          style={this.styles.input}/>
      </View>
    )
  }
}
