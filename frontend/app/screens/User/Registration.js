import React from 'react';
import {AsyncStorage, Image, RefreshControl, StatusBar, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content} from 'native-base';
import UserStore from "../../store/User";
import { observable, action} from 'mobx';
import styles from "../../styles";
import Logo from "../../assets/images/logo.png";
import Notification from "../../components/Notification";
import Input from "../../components/Form/Input";

@observer
export default class Registration extends React.Component {
  @observable tel = "";
  @observable email = "";
  @observable password = "";
  @observable name = "";

  @observable loading = false;

  @action change = (type, value) => {
    this[type] = value;
  };

  @action submitHandler = async () => {
    this.loading = true;

    try {
      const registration = await UserStore.register({tel: this.tel, email: this.email, password: this.password, name: this.name});
      await AsyncStorage.multiSet([["token", registration.token], ["tel", String(this.tel)], ["password", String(this.password)]]);
      UserStore.token = registration.token;
      UserStore.profile = await UserStore.info();
      UserStore.auth = true;
    } catch (e) {
      Notification(e);
    }

    this.loading = false;
  };

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={styles.statusBarColor} barStyle="light-content"/>
        <Content refreshControl={<RefreshControl refreshing={this.loading}/>} contentContainerStyle={customStyles.container}>
          <View>
            <View style={{alignItems: "center", paddingBottom: 20}}>
              <Image style={{width: 125, height: 74}} source={Logo}/>
            </View>
            <View style={{alignItems: "center", paddingBottom: 60}}>
              <Text style={{color: "#fff", marginBottom: 4}}>Весь автомобильный мир в одном приложении.</Text>
              <Text style={{color: "#fff"}}>Присоединяйся!</Text>
            </View>
          </View>

          <View style={{marginRight: 20, paddingBottom: 15}}>
            <Input onChange={text => {this.change('name', text)}} value={this.name} light={true} title="Имя"/>
            <Input onChange={text => {this.change('tel', text)}} value={this.tel} keyboardType="numeric" light={true} title="Телефон"/>
            <Input onChange={text => {this.change('email', text)}} keyboardType="email-address" value={this.email} light={true} title="E-mail"/>
            <Input onChange={text => {this.change('password', text)}} value={this.password} secureTextEntry light={true} title="Пароль"/>
          </View>

          <Button title="Зарегистрироваться" disabled={this.loading} onPress={this.submitHandler} style={customStyles.button} block><Text style={{color: "#000"}}>Зарегистрироваться</Text></Button>

          <Text onPress={()=>this.props.navigation.navigate('Login')} style={customStyles.link}>Войти</Text>
        </Content>
      </Container>
    );
  }
}

const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f13f3f",
    justifyContent: 'center'
  },

  button : {
    margin: 17,
    ...styles.primaryButton,
    backgroundColor: "#fff",
  },

  logo : {
    textAlign: "center",
    fontSize: 30,
    marginBottom: 20
  },

  link : {
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 30,
    padding: 5,
    color: "#fff"
  }
});