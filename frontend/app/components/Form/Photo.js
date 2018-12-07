import React, { Component } from 'react'
import {StyleSheet, Text, Image, TouchableWithoutFeedback} from "react-native";
import {View, ActionSheet} from 'native-base';
import {observable, action} from "mobx";
import {observer} from 'mobx-react';
import Cropper from "../../modules/Cropper";
import {cdn} from "../../modules/Url";

@observer
export default class Photo extends Component {
  @observable image = {
    path: this.props.path
  };

  @action changePhoto = async type => {
    this.modal = false;
    this.loading = true;

    try {
      this.image = await Cropper[type]({cropperCircleOverlay: false});
      this.props.onChange(this.image);
    } catch (e) {}

    this.loading = false;
  };

  @action action = () => {
    ActionSheet.show(
      {
        options: [
          { text: "Загрузить из галереи", icon: "images", iconColor: "#b9babd"},
          { text: "Сделать снимок", icon: "camera", iconColor: "#b9babd"},
          { text: "Отмена", icon: "close", iconColor: "#b9babd" }
        ],
        cancelButtonIndex: 2
      },
      index => {
        if(index === 0) {
          this.changePhoto("gallery")
        }

        if(index === 1) {
          this.changePhoto("camera")
        }
      }
    )
  };

  render () {
    return (
      <View style={styles.wrapper}>
        <View style={styles.title}><Text style={styles.titleText}>{this.props.title || ""}</Text></View>
        <TouchableWithoutFeedback onPress={()=>{this.action()}}>
          <View style={styles.image}>
            {
              this.image.path
                ?
                <Image style={{width: "100%", aspectRatio: 1, borderRadius: 5}} source={{uri: cdn + this.image.path}}/>
                :
                <Image style={{width: 60, height: 60, marginTop: 50, marginBottom: 50}} source={require("../../assets/images/photo_thumb.png")}/>
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
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

  image: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  },
});