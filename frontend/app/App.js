import React from 'react';
import {NetInfo} from 'react-native';
import {Root} from 'native-base';
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import {observer} from 'mobx-react';
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import User from "./store/User";
import Navigation from "./components/Navigation";
import Garage from "./screens/Garage/Garage";
import Car from "./screens/Garage/Car";
import Profile from "./screens/Profile";
import SplashScreen from 'react-native-splash-screen';
import Reminders from "./screens/Garage/Reminders";
import AppStore from "./store/App";
import ConnectError from "./components/ConnectError";
import Fines from "./screens/Garage/Fines";
import Journal from "./screens/Garage/Journal";
import Logger from "./modules/Logger";
import Notifications from "./modules/Notifications";
import Notes from "./screens/Garage/Notes";
import News from "./screens/News/News";

const Navigator = createDrawerNavigator({
    Garage: {screen: Garage},
    Car: {screen: Car},
    Fines: {screen: Fines},
    Journal: {screen: Journal},
    Profile: {screen: Profile},
    Reminders: {screen: Reminders},
    Notes: {screen: Notes},
    News: {screen: News}
}, {
  initialRouteName: 'Garage',
  headerMode: 'none',
  contentComponent : Navigation
});

const Auth = createStackNavigator({
    Login: {screen: Login, path: 'login'},
    Registration: {screen: Registration, path: 'registration'}
  }, {
    headerMode: "none"
  }
);

@observer
export default class App extends React.Component {
  async componentWillMount() {
    await User.checkAuth();
    SplashScreen.hide();
  }

  async componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', result => {
      AppStore.connect = result;
      Logger.info(result ? "Подключение к интернету установлено" : "Нет подключения к интернету")
    });

    Notifications.initial();

    Logger.session(null, ()=>{
      Logger.info("Запуск приложения");
    });
  }

  render() {
    return(<ConnectError>{User.ready ? (User.auth ? <Root><Navigator/></Root>: <Auth/>) : null}</ConnectError>)

  }
}


//https://medium.com/@nhancv/react-native-build-release-duplicate-file-original-is-here-the-version-qualifier-may-be-implied-115e967c59e6