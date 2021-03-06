import ImagePicker from 'react-native-image-crop-picker';
import Uploader from "../store/Uploader";

export default class Cropper {
  static params = {
    cropperToolbarTitle: "",
    width: 2000,
    height: 2000,
    cropperToolbarColor: "#a23737",
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