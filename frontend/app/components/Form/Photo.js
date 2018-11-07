import React, { Component } from 'react'
import {StyleSheet, Text, Image, TouchableWithoutFeedback, Modal} from "react-native";
import {List, ListItem, View, Container, Content} from 'native-base';
import {observable, action, toJS} from "mobx";
import {observer} from 'mobx-react';
import Cropper from "../../modules/Cropper";
import {cdn} from "../../modules/Url";

@observer
export default class Photo extends Component {
  @observable modal = false;
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

  render () {
    return (
      <View style={styles.wrapper}>
        <View style={styles.title}><Text>{this.props.title || ""}</Text></View>
        <TouchableWithoutFeedback onPress={()=>{this.modal = true;}}>
          <View style={styles.image}>
            {
              this.image.path
                ?
                <Image style={{width: "100%", aspectRatio: 1}} source={{uri: cdn + this.image.path}}/>
                :
                <Image style={{width: 100, height: 100, marginTop:50, marginBottom: 50}} source={require("../../assets/images/photo_thumb.png")}/>
            }
          </View>
        </TouchableWithoutFeedback>

        <Modal onShow={()=>{}} transparent={true} visible={this.modal} onRequestClose={() => {this.modal = false}}>
          <View style={styles.container}>
            <View style={styles.modal}>
              <List>
                <ListItem onPress={() => {this.changePhoto("gallery")}}>
                  <Text>Загрузить из галереи</Text>
                </ListItem>

                <ListItem onPress={() => {this.changePhoto("camera")}}>
                  <Text>Сделать снимок</Text>
                </ListItem>

                <ListItem onPress={() => {this.modal = false}}>
                  <Text>Отмена</Text>
                </ListItem>
              </List>
            </View>
          </View>
        </Modal>
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
    paddingLeft: 17,
    paddingBottom: 15,
    marginRight: 20,
    width: 120
  },

  image: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center"
  },

  container : {
    display: "flex",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },

  modal: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    alignSelf: "center"
  }
});