import React from 'react';
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import {observer} from 'mobx-react';
import { Font } from "expo";
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import User from "./store/User";
import Home from "./screens/Home";
import Navigation from "./components/Navigation";
import Garage from "./screens/Garage";
import AddCar from "./screens/AddCar";

const Navigator = createDrawerNavigator({
    Home: {screen: Home},
    Garage: {screen: Garage},
    AddCar: {screen: AddCar},
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
    Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  render() {
    return (User.auth ? <Navigator/> : <Auth/>);
  }
}