import React from 'react';
import {AsyncStorage, StyleSheet, Text, StatusBar, RefreshControl, Image, View} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Label } from 'native-base';
import User from "../store/User";
import { observable, action} from 'mobx';
import styles from "../styles";
import Logo from "../assets/images/logo.png";
import Logger from "../modules/Logger";
import Notification from "../components/Notification";
import Input from "../components/Form/Input";

@observer
export default class Login extends React.Component {
  @observable tel = "375";
  @observable password = "";
  @observable loading = false;

  @action change = (type, value) => {this[type] = value};

  @action submitHandler = async () => {
      this.loading = true;

      try {
        await User.login({tel: this.tel, password: this.password});
        await AsyncStorage.multiSet([["tel", String(this.tel)],["password", String(this.password)]]);
        Logger.info("Пользоваль авторизовался", String(this.tel));
      } catch (e) {
        Notification(e);
      }

      this.loading = false
  };

  componentDidMount() {
    AsyncStorage.multiGet(["tel", "password"], (err, data) => {
      if(data) {this.tel = data[0][1] || ""; this.password = data[1][1]  || ""}
    })
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={styles.statusBarColor} barStyle="light-content"/>
        <Content refreshControl={<RefreshControl refreshing={this.loading}/>} contentContainerStyle={customStyles.container}>
          <View>
            <View style={{alignItems: "center", paddingBottom: 20}}>
              <Image style={{width: 125, height: 74}} source={Logo}/>
            </View>

            <View style={{alignItems: "center", paddingBottom: 60, paddingLeft: 17, paddingRight: 17}}>
              <Text style={{color: "#fff", marginBottom: 4}}>Весь автомобильный мир в одном приложении.</Text>
              <Text style={{color: "#fff"}}>Присоединяйся!</Text>
            </View>
          </View>

          <Form>
            <View style={{paddingRight: 17}}>
              <Input onChange={text => {this.change('tel', text)}} value={this.tel} light={true} title="Телефон"/>
              <Input onChange={text => {this.change('password', text)}} value={this.password} secureTextEntry light={true} title="Пароль"/>
            </View>

            <Button disabled={this.loading} onPress={this.submitHandler} style={customStyles.primaryButton} block><Text style={{color: "#000"}}>Войти</Text></Button>
          </Form>
          <Text style={customStyles.link} onPress={()=>this.props.navigation.navigate('Registration')}>Регистрация</Text>
        </Content>
      </Container>
    );
  }
}

const customStyles = StyleSheet.create({
  container: {
    ...styles.container,
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#f13f3f"
  },

  input: {
    fontSize: 14,
    color: "#fff"
  },

  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 1
  },

  item : {
    borderBottomWidth: 0.2,
    borderBottomColor: "#fff",
    marginLeft: 0
  },

  primaryButton : {
    marginTop: 25,
    ...styles.primaryButton,
    backgroundColor: "#fff",
    marginLeft: 17,
    marginRight: 17
  },

  link : {
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 30,
    padding: 5,
    color: "#fff"
  }
});