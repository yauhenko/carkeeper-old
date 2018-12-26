import React from 'react';
import {NetInfo, StatusBar, Platform} from 'react-native';
import {Root} from 'native-base';
import {observer} from 'mobx-react';
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import Login from "./screens/User/Login";
import User from "./store/User";
import Navigation from "./components/Navigation";
import Garage from "./screens/Garage/Garage";
import Car from "./screens/Garage/Car";
import Profile from "./screens/User/Profile";
import SplashScreen from 'react-native-splash-screen';
import Reminders from "./screens/Garage/Reminders";
import AppStore from "./store/App";
import ConnectError from "./components/ConnectError";
import Fines from "./screens/Garage/Fines";
import Journal from "./screens/Garage/Journal";
import Notifications from "./modules/Notifications";
import Notes from "./screens/Garage/Notes";
import List from "./screens/News/List";
import Support from "./screens/User/Support";
import Maintenance from "./screens/Garage/Maintenance";
import Card from "./screens/Card/Card";
import Info from "./screens/User/Info";
import Logger from "./modules/Logger";

const Navigator = createDrawerNavigator({
  Garage: {screen: Garage},
  Car: {screen: Car},
  Fines: {screen: Fines},
  Journal: {screen: Journal},
  Reminders: {screen: Reminders},
  Maintenance: {screen: Maintenance},
  Profile: {screen: Profile},
  Notes: {screen: Notes},
  News: {screen: List},
  Support: {screen: Support},
  Card: {screen: Card},
  Info: {screen: Info}
}, {
  initialRouteName: 'Garage',
  headerMode: "none",
  contentComponent : Navigation
});

const Auth = createStackNavigator({
    Login: {screen: Login, path: 'login'}
  }, {
    headerMode: "none"
  }
);

@observer
export default class App extends React.Component {
  async componentWillMount() {
    await User.checkAuth();
    if(Platform.OS === "android") {StatusBar.setTranslucent(true)}
    SplashScreen.hide();
  }

  async componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', result => {
      AppStore.connect = result;
    });

    Notifications.initial();
    Logger.info("Запуск приложения");
  }

  render() {
    return(User.ready ? <Root><ConnectError/>{User.auth ? <Navigator/> : <Auth/>}</Root> : null)
  }
}

//https://medium.com/@nhancv/react-native-build-release-duplicate-file-original-is-here-the-version-qualifier-may-be-implied-115e967c59e6