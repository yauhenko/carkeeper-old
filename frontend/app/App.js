import React from 'react';
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import {observer} from 'mobx-react';
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import User from "./store/User";
import Home from "./screens/Home";
import Navigation from "./components/Navigation";
import Garage from "./screens/Garage";
import AddCar from "./screens/AddCar";
import Car from "./screens/Car";
import Camera from "./screens/Camera";
import Profile from "./screens/Profile";

const Navigator = createDrawerNavigator({
    Home: {screen: Home},
    Garage: {screen: Garage},
    Car: {screen: Car},
    Profile: {screen: Profile},
    AddCar: {screen: AddCar},
    Camera: {screen: Camera},
}, {
  initialRouteName: 'Garage',
  navigationOptions: {
    headerMode: 'float',
    headerStyle: {backgroundColor: '#0091ea'},
    headerTintColor: '#fff',
    headerTitleStyle: {}
  },
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
  componentWillMount() {
    User.checkAuth();
  }

  render() {
    return User.ready ? (User.auth ? <Navigator/> : <Auth/>) : null;
  }
}