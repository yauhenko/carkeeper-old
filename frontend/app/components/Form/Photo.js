import React, { Component } from 'react'
import {StyleSheet, Text, Image, TouchableWithoutFeedback, Alert} from "react-native";
import {View, ActionSheet} from 'native-base';
import {action} from "mobx";
import {observer} from 'mobx-react';
import Cropper from "../../modules/Cropper";
import {cdn} from "../../modules/Url";

@observer
export default class Photo extends Component {
  @action changePhoto = async type => {
    try {
      this.image = await Cropper[type]({cropperCircleOverlay: false});
      this.props.onChange(this.image);
    } catch (e) {}
  };

  @action action = () => {
    let options = [
      { text: "Загрузить из галереи", icon: "images", iconColor: "#9c9c9c", id: "gallery"},
      { text: "Сделать снимок", icon: "camera", iconColor: "#9c9c9c", id: "camera"},
      { text: "Отмена", icon: "close", iconColor: "#9c9c9c"}
    ];

    if(typeof this.props.onDelete === "function" && this.props.path) {
      options.splice(options.length - 1, 0, { text: "Удалить", icon: "trash", iconColor: "#9c9c9c", id: "delete"} );
    }

    ActionSheet.show(
      {
        options: options,
        cancelButtonIndex: options.length - 1
      },
      index => {
        if(options[index].id === "gallery" || options[index].id === "camera") {
          this.changePhoto(options[index].id)
        }

        if(options[index].id === "delete" && typeof this.props.onDelete === "function") {
          Alert.alert(null, 'Подтвердите удаление', [
              {text: 'Отмена', onPress: () => {}, style: 'cancel'},
              {text: 'Удалить', onPress: () => {this.props.onDelete()}}
              ],
              {cancelable: false });
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
              this.props.path
                ?
                <Image style={{width: "100%", aspectRatio: 1, borderRadius: 5}} source={{uri: cdn + this.props.path}}/>
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