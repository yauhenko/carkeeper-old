import {AsyncStorage} from 'react-native';
import firebase , {RemoteMessage} from 'react-native-firebase';
import icon from "../assets/images/car_stub.png";

class Notifications {
  permission = false;
  fcm = null;

  initial = () => {
    const channel = new firebase.notifications.Android.Channel('test-channel', 'CarKeeper Channel', firebase.notifications.Android.Importance.Max).setDescription('My apps test channel');
    // Create the channel
    firebase.notifications().android.createChannel(channel);

    firebase.messaging().getToken().then(fcm => {AsyncStorage.setItem('fcm', fcm); this.fcm = fcm; console.log(fcm)});
    firebase.messaging().hasPermission().then(bool => {this.permission = bool});


    firebase.messaging().onMessage((message) => {
      console.log(message);
      // Process your message as required

      const notification = new firebase.notifications.Notification()
        .setTitle(message._data.title)
        .setBody(message._data.body)
        .setData(message._data)
        .setSound(message._data.sound)
        .android.setChannelId('test-channel');
        firebase.notifications().displayNotification(notification)
    });
  }
}

export const Remote = (message) => {
  const notification = new firebase.notifications.Notification()
    .setTitle(message.data.title)
    .setBody(message.data.body)
    .setData(message.data)
    .setSound(message.data.sound)
    .android.setChannelId('test-channel');
  firebase.notifications().displayNotification(notification);
  return Promise.resolve();
};

export default new Notifications();