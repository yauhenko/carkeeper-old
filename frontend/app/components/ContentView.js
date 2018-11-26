import React, { Component } from 'react'
import {Image, Linking, StyleSheet, Text, Dimensions} from 'react-native';

export default class ContentView extends Component {
  render () {
    return (
      this.props.data.map((element, key) => {
          if(element.screen !== this.props.screen && element.screen !== "any") return null;
          switch (element.type) {
            case "p" : return <Text key={key} style={componentStyle.p}>{element.text}</Text>;
            case "img" : return <Image key={key} style={componentStyle.img} source={{uri: element.src}}/>;
            case "a" : return <Text key={key} style={componentStyle.a} onPress={()=>Linking.openURL(element.href)}>{element.text || element.href}</Text>;
            default: return null;
          }
      })
    )
  }
}

const componentStyle = StyleSheet.create({
  img: {
    marginBottom: 15,
    aspectRatio: 1,
    width: "100%",
    height: null
  },

  p: {
    paddingLeft: 17,
    paddingRight: 17,
    marginBottom: 15,
    lineHeight: 20
  },

  a: {
    paddingLeft: 17,
    paddingRight: 17,
    marginBottom: 15,
    color: "#f13f3f",
    textDecorationLine: "underline"
  }
});