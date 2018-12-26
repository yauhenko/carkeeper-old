import React, { Component } from 'react'
import {StyleSheet, Text, TextInput, TouchableWithoutFeedback} from "react-native";
import {View} from 'native-base';
import {observer} from 'mobx-react';

@observer
export default class Input extends Component {

  styles = StyleSheet.create({
    wrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderBottomColor: "#d5dae4"
    },

    title: {
      paddingTop: 15,
      paddingBottom: 15,
      marginRight: 20,
      width: 120
    },

    titleText: {
      color: "#7f8a9d"
    },

    input: {
      display: "flex",
      flex: 1,
      alignItems: "center",
      paddingTop: 10,
      paddingRight: 12,
      paddingBottom: 7,
      paddingLeft: 0
    }
  });

  checkValue = value => {
      if(value === undefined || value === null) return "";
      return String(value);
  };

  render () {
    return (
      <TouchableWithoutFeedback onPress={()=>{this.refs.input.focus()}}>
        <View style={[this.styles.wrapper, {borderBottomWidth: this.props.last ? 0 : StyleSheet.hairlineWidth}]}>
          <View style={this.styles.title}><Text style={this.styles.titleText}>{this.props.title || ""}</Text></View>
          <TextInput
            editable={"editable" in this.props ? this.props.editable : true}
            ref="input"
            placeholder={this.props.placeholder || ""}
            value={this.checkValue(this.props.value)}
            onChangeText={this.props.onChange}
            selectionColor="#a23737"
            secureTextEntry={"secureTextEntry" in this.props}
            underlineColorAndroid="transparent"
            multiline={this.props.multiline || false}
            keyboardType={this.props.keyboardType || "default"}
            style={this.styles.input}/>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
