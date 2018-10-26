import firebase from 'react-native-firebase';
import { RemoteMessage } from 'react-native-firebase';

export default async (message) => {
  const notification = new firebase.notifications.Notification()
    .setTitle(message.data.title)
    .setBody(message.data.body)
    .setData(message.data)
    .setSound(message.data.sound)
    .android.setChannelId('test-channel');
    firebase.notifications().displayNotification(notification);
    return Promise.resolve();
}