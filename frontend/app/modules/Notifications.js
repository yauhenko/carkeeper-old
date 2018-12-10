import {AsyncStorage} from 'react-native';
import firebase from 'react-native-firebase';
import User from "../store/User";

class Notifications {
  permission = false;
  fcm = null;

  initial = () => {
    const channel = new firebase.notifications.Android.Channel('test-channel', 'CarKeeper Channel', firebase.notifications.Android.Importance.Max).setDescription('My apps test channel');
    firebase.notifications().android.createChannel(channel);
    firebase.messaging().getToken().then(fcm => {AsyncStorage.setItem('fcm', fcm); this.fcm = fcm; User.fcm = fcm;});
    firebase.messaging().hasPermission().then(bool => {
        firebase.messaging().requestPermission()
        this.permission = bool
    });

    firebase.messaging().onMessage(message => {
      const notification = new firebase.notifications.Notification()
        .setTitle(message._data.title)
        .setBody(message._data.body)
        .setData(message._data)
        .setSound(message._data.sound)
        .android.setLargeIcon("ic_launcher")
        .android.setSmallIcon("ic_notification")
        .android.setChannelId('test-channel');

      firebase.notifications().displayNotification(notification);
      firebase.notifications().onNotificationOpened(() => {
        firebase.notifications().removeDeliveredNotification(notification._notificationId);
      })
    });
  }
}

export const Remote = message => {
  const notification = new firebase.notifications.Notification()
    .setTitle(message.data.title)
    .setBody(message.data.body)
    .setData(message.data)
    .android.setLargeIcon("ic_launcher")
    .android.setSmallIcon("ic_notification")
    .setSound(message.data.sound)
    .android.setChannelId('test-channel');
    firebase.notifications().displayNotification(notification);

  firebase.notifications().onNotificationOpened(() => {
    firebase.notifications().removeDeliveredNotification(notification._notificationId);
  });

  return Promise.resolve();
};

export default new Notifications();