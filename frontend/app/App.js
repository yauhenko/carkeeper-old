import React from 'react';
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import {StyleSheet, Text, View} from 'react-native';
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import User from "./store/User";
import Home from "./screens/Home";
import Navigation from "./components/Navigation";

const Navigator = createDrawerNavigator({
    Home: {screen: Home},
}, {
  initialRouteName: 'Home',
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
  render() {
    return (User.auth ? <Navigator/> : <Auth/>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});