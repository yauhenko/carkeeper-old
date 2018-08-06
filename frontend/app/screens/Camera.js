import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react';
import {Icon} from 'native-base';
import Camera from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';

@observer
export default class CameraComponent extends React.Component {
  componentDidMount() {
      console.log(this.props)
  }

  takePicture = () => {
    this.camera.capture().then((data) => {
      ImagePicker.openCropper({
        path: data.path,
        cropperToolbarTitle: "",
        width: 400,
        height: 400,
        mediaType: "photo",
        cropperToolbarColor: "#3e4669",
        includeBase64: true
      }).then(image => {
        console.log(image);
        this.props.navigation.goBack();
      });
    }).catch(err => console.error(err));
  };

  // reset = () => {
  //   console.log("reset");
  //   this.camera.startPreview();
  //   this.camera.stopPreview();
  // };

  render() {
    return (
      <View style={styles.container}>
        <Camera ref={(cam) => {this.camera = cam}} style={styles.preview} aspect={Camera.constants.Aspect.fill} captureQuality={"photo"} playSoundOnCapture={true}>
          <TouchableOpacity style={styles.capture} onPress={this.takePicture}>
            <Icon name='camera'/>
          </TouchableOpacity>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    position: "absolute",
    bottom: 20
  }
});