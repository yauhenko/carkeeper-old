import ImagePicker from 'react-native-image-crop-picker';
import Uploader from "../store/Uploader";
import User from "../store/User";



export default class Cropper {
  static params = {
    cropperToolbarTitle: "",
    width: 500,
    height: 500,
    cropperToolbarColor: "#3e4669",
    includeBase64: true,
    mediaType: "photo",
    cropping: true
  };


  static async gallery(props = {}) {
    let image = await ImagePicker.openPicker(Object.assign({...Cropper.params}, props));
    let name = image.path.split('/').pop();
    return await Uploader.save({name: name, data: image.data});
  }

  static async camera(props = {}) {
    let image = await ImagePicker.openCamera(Object.assign({...Cropper.params}, props));
    let name = image.path.split('/').pop();
    return await Uploader.save({name: name, data: image.data});
  }
}