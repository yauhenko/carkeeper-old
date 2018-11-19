import React from 'react';
import {AsyncStorage, Image, RefreshControl, StatusBar, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Input, Label, Segment } from 'native-base';
import UserStore from "../store/User";
import { observable, action} from 'mobx';
import styles from "../styles";
import Logo from "../assets/images/logo.png";
import Notification from "../components/Notification";

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
      UserStore.token = registration.token;
      UserStore.profile = await UserStore.info();
      UserStore.auth = true;
      AsyncStorage.multiSet([["tel", String(this.tel)], ["password", String(this.password)]]);
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

          <Form>
            <Item style={customStyles.item} fixedLabel>
              <Label style={customStyles.label}>Имя:</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} onChangeText={(text)=>{this.change('name', text)}} value={this.name} />
            </Item>

            <Item style={customStyles.item} fixedLabel>
              <Label style={customStyles.label}>Телефон:</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} keyboardType="numeric" onChangeText={(text)=>{this.change('tel', text)}} value={this.tel} />
            </Item>

            <Item style={customStyles.item} fixedLabel>
              <Label style={customStyles.label}>E-mail:</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} onChangeText={(text)=>{this.change('email', text)}} value={this.email} />
            </Item>

            <Item style={customStyles.item} fixedLabel>
              <Label style={customStyles.label}>Пароль:</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} secureTextEntry onChangeText={(text)=>{this.change('password', text)}} value={this.password} />
            </Item>

            <Button title="Зарегистрироваться" disabled={this.loading} onPress={this.submitHandler} style={customStyles.button} block><Text style={{color: "#000"}}>Зарегистрироваться</Text></Button>
          </Form>
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
    justifyContent: 'center',
    padding: 20
  },

  label : {
    color: "#fff",
    fontSize: 14,
    marginBottom: 1
  },

  input: {
    fontSize: 14,
    color: "#fff"
  },

  item : {
    marginLeft: 0
  },

  button : {
    marginTop: 25,
    ...styles.primaryButton,
    backgroundColor: "#fff",
  },

  logo : {
    textAlign: "center",
    fontSize: 30,
    marginBottom: 20
  },

  segment : {
    backgroundColor: "transparent",
    justifyContent: "space-between",
    marginTop: 20
  },

  segmentButton: {
    borderColor: "#d6d7da",
    padding: 10,
    flex: 1,
    height: 45
  },

  segmentButtonActive: {
    borderColor: "#3e4669",
    backgroundColor: "#3e4669",
    padding: 10,
    flex: 1,
    height: 45
  },

  link : {
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 30,
    padding: 5,
    color: "#fff"
  }
});