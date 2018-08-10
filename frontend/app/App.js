import React from 'react';
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import {observer} from 'mobx-react';
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import User from "./store/User";
import Navigation from "./components/Navigation";
import Garage from "./screens/Garage";
import AddCar from "./screens/AddCar";
import Car from "./screens/Car";
import Profile from "./screens/Profile";
import SplashScreen from 'react-native-splash-screen';
import Reminders from "./screens/Reminders";

const Navigator = createDrawerNavigator({
    Garage: {screen: Garage},
    Car: {screen: Car},
    AddCar: {screen: AddCar},
    Profile: {screen: Profile},
    Reminders: {screen: Reminders},
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

  render() {
    return(User.ready ? (User.auth ? <Navigator/> : <Auth/>) : null)
  }
}


//https://medium.com/@nhancv/react-native-build-release-duplicate-file-original-is-here-the-version-qualifier-may-be-implied-115e967c59e6