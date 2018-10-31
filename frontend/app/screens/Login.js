import React from 'react';
import {AsyncStorage, StyleSheet, Text, StatusBar, RefreshControl, Image, View} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Input, Label } from 'native-base';
import User from "../store/User";
import { observable, action} from 'mobx';
import styles from "../styles";
import Logo from "../assets/images/logo.png";
import Logger from "../modules/Logger";
import Notification from "../components/Notification";

@observer
export default class Login extends React.Component {
  @observable tel = "";
  @observable password = "";
  @observable loading = false;

  @action change = (type, value) => {this[type] = value};

  @action submitHandler = async () => {
      this.loading = true;

      try {
        await User.login({tel: this.tel, password: this.password});
        Logger.info("Пользоваль авторизовался", String(this.tel));
        AsyncStorage.multiSet([["tel", String(this.tel)],["password", String(this.password)]]);
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

            <View style={{alignItems: "center", paddingBottom: 60}}>
              <Text style={{color: "#fff", marginBottom: 4}}>Весь автомобильный мир в одном приложении.</Text>
              <Text style={{color: "#fff"}}>Присоединяйся!</Text>
            </View>
          </View>

          <Form>
            <Item style={customStyles.item} fixedLabel>
              <Label style={customStyles.label}>Телефон:</Label>
              <Input selectionColor={styles.selectionColor} style={customStyles.input} keyboardType="numeric" onChangeText={(text)=>{this.change('tel', text)}} value={this.tel ? String(this.tel) : ""} />
            </Item>

            <Item style={customStyles.item} fixedLabel>
              <Label style={customStyles.label}>Пароль:</Label>
              <Input selectionColor={styles.selectionColor} style={customStyles.input} secureTextEntry onChangeText={(text)=>{this.change('password', text)}} value={this.password ? String(this.password) : ""} />
            </Item>

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
    padding: 20,
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
  },

  link : {
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 30,
    padding: 5,
    color: "#fff"
  }
});