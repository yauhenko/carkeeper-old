import React from 'react';
import {AsyncStorage, StyleSheet, Text, StatusBar, RefreshControl, Image, View} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form} from 'native-base';
import User from "../../store/User";
import { observable, action} from 'mobx';
import styles from "../../styles";
import Logo from "../../assets/images/logo.png";
import Notification from "../../components/Notification";
import Input from "../../components/Form/Input";
import Api from "../../modules/Api";

@observer
export default class Restore extends React.Component {
  @observable email = false;
  @observable send = false;
  @observable loading = false;
  @observable ticket = null;

  interval = null;

  @action change = email => {
    this.email = email;
  };

  @action submitHandler = async () => {
    this.loading = true;

    try {
      const response = await User.recovery({email: this.email});
      this.ticket = response.ticket;
      this.interval = setInterval(this.ping, 2000);
      this.send = true;
    } catch (e) {
      Notification(e);
    }

    this.loading = false
  };

  @action ping = async () => {
    const response = await Api("account/recovery/ticket", {ticket: this.ticket});

    if(response.token) {
      clearInterval(this.interval);
      await AsyncStorage.setItem('token', response.token);
      User.token = response.token;
      User.profile = await User.info();
      User.auth = true;
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={styles.statusBarColor} barStyle="light-content"/>
        <Content contentContainerStyle={customStyles.container}>
          <View>
            <View style={{alignItems: "center", paddingBottom: 20}}>
              <Image style={{width: 125, height: 74}} source={Logo}/>
            </View>

            <View style={{alignItems: "center", paddingBottom: 60, paddingLeft: 17, paddingRight: 17}}>
              <Text style={{color: "#fff", marginBottom: 4}}>Весь автомобильный мир в одном приложении.</Text>
              <Text style={{color: "#fff"}}>Присоединяйся!</Text>
            </View>
          </View>

          {
            this.send
              ?
              <View style={{padding: 20}}>
                <Text style={{color:"#fff", textAlign: "center"}}>Ссылка для входа была отправлена на почту: {this.email}. Ссылка будет актуальна в течение часа.</Text>
              </View>
              :
              <Form>
                <View style={{paddingRight: 17}}>
                  <Input onChange={value => {this.change(value)}} value={this.email} light={true} title="E-mail"/>
                </View>
                <Button disabled={this.loading} onPress={this.submitHandler} style={customStyles.primaryButton} block><Text style={{color: "#000"}}>Восстановить пароль</Text></Button>
              </Form>
          }

          <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
            <Text style={customStyles.link} onPress={()=>this.props.navigation.navigate('Login')}>Войти</Text>
            <Text style={customStyles.link} onPress={()=>this.props.navigation.navigate('Registration')}>Регистрация</Text>
          </View>
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