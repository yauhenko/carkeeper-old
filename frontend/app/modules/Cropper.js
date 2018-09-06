import ImagePicker from 'react-native-image-crop-picker';
import Uploader from "../store/Uploader";

export default class Cropper {
  static params = {
    cropperToolbarTitle: "",
    width: 1000,
    height: 1000,
    cropperToolbarColor: "#f13f3f",
    includeBase64: true,
    mediaType: "photo",
    cropping: true
  };

  static async gallery (props = {}) {
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