import { AppRegistry } from 'react-native';
import App from './App';
import {Remote} from './modules/Notifications';

AppRegistry.registerComponent('CarKeeper', () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => Remote);