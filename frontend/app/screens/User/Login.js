import React from 'react';
import {AsyncStorage, StyleSheet, Text, StatusBar, RefreshControl, Image, View, Dimensions, TextInput} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Label } from 'native-base';
import User from "../../store/User";
import { observable, action} from 'mobx';
import Logo from "../../assets/images/logo.png";
import Logger from "../../modules/Logger";
import Notification from "../../components/Notification";

import background from "../../assets/images/login_background.jpg";

@observer
export default class Login extends React.Component {
  @observable tel = "";
  @observable password = "";
  @observable geo = {};

  @observable loading = false;
  @observable disabled = false;

  @observable phoneChecked = false;

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

  checkPhoneNumber = async () => {
    this.disabled = true;
    this.loading = true;


    this.disabled = false;
    this.loading = false;
  };

  fillPhoneCode = async () => {
    if(this.tel) return;

    try {
      this.geo = await User.getGeo();
      this.tel = this.geo.tel;
    } catch (e) {
      Notification(e);
      console.log(e)
    }
  };

  async componentDidMount() {
    AsyncStorage.multiGet(["tel", "password"], (err, data) => {
      if(data) {this.tel = data[0][1] || this.tel; this.password = data[1][1] || this.password}
      this.fillPhoneCode();
    });
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor="transparent" translucent={true} barStyle="light-content"/>



        <Content contentContainerStyle={componentStyle.container}>
          <View style={[StyleSheet.absoluteFill, {alignItems: "center"}]}>
            <Image style={{height: Dimensions.get("window").height, width: Dimensions.get("window").width}} source={background}/>
          </View>

          <View style={[StyleSheet.absoluteFill, {backgroundColor: "rgba(0,0,0,0.7)"}]}/>

          <View style={componentStyle.logoContainer}>
            <Image style={componentStyle.logo} source={Logo}/>
            <Text style={componentStyle.slogan}>Авто. Гараж. Сервис. Помощь.</Text>
          </View>

          {/*<View style={{paddingRight: 17}}>*/}
            {/*<Input keyboardType="numeric" onChange={text => {this.change('tel', text)}} value={this.tel} light={true} title="Телефон"/>*/}
            {/*<Input onChange={text => {this.change('password', text)}} value={this.password} secureTextEntry light={true} title="Пароль"/>*/}
          {/*</View>*/}

          <View>
            <Text style={componentStyle.label}>Введите Ваш номер телефона:</Text>

            <TextInput onChangeText={text => {this.change('tel', text)}} underlineColorAndroid="transparent" autoCorrect={false} selectionColor="#f13f3f" keyboardType="phone-pad" value={this.tel} style={componentStyle.input}/>

            <Button disabled={this.disabled} onPress={()=>{this.checkPhoneNumber()}} style={componentStyle.button} block>
              <Text style={componentStyle.buttonText}>ДАЛЕЕ</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
    padding: 30,
  },

  logo: {
    width: 167.5,
    height: 88
  },

  logoContainer: {
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 70
  },

  button: {
    backgroundColor: "#f13f3f",
    height: 50
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12
  },

  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 15,
    marginLeft: 10
  },

  input: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 3,
    paddingLeft: 10,
    paddingRight: 5,
    height: 50,
  },

  slogan: {
    marginTop: 30,
    color: "#fff",
    fontSize: 16
  }
});