import React from 'react';
import {StatusBar, StyleSheet, Text} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Input, Label, Segment } from 'native-base';
import UserStore from "../store/User";
import { observable, action} from 'mobx';
import styles from "../styles";

@observer
export default class Registration extends React.Component {
  @observable tel = "";
  @observable email = "";
  @observable password = "";
  @observable firstname = "";
  @observable lastname = "";
  @observable role = "buyer";

  @action change = (type, value) => {
    this[type] = value;
  };

  @action submitHandler = () => {
    UserStore.create(this.role, this.tel, this.email, this.password);
  };

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={styles.statusBarColor} barStyle="light-content"/>
        <Content contentContainerStyle={customStyles.container}>
          <Text style={customStyles.logo}>РЕГИСТРАЦИЯ</Text>
          <Form>
            <Item style={customStyles.label} floatingLabel>
              <Label>Номер телефона</Label>
              <Input onChangeText={(text)=>{this.change('tel', text)}} value={this.tel} />
            </Item>

            <Item style={customStyles.label} floatingLabel>
              <Label>Пароль</Label>
              <Input onChangeText={(text)=>{this.change('password', text)}} value={this.password} />
            </Item>

            <Item style={customStyles.label} floatingLabel>
              <Label>E-mail</Label>
              <Input onChangeText={(text)=>{this.change('email', text)}} value={this.email} />
            </Item>

            <Item style={customStyles.label} floatingLabel>
              <Label>Имя</Label>
              <Input onChangeText={(text)=>{this.change('firstname', text)}} value={this.firstname} />
            </Item>

            <Item style={customStyles.label} floatingLabel>
              <Label>Фамилия</Label>
              <Input onChangeText={(text)=>{this.change('lastname', text)}} value={this.lastname} />
            </Item>


            <Button onPress={this.submitHandler} style={[customStyles.button, styles.primaryButton]} block><Text style={styles.primaryButtonText}>Зарегистрироваться</Text></Button>
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20
  },

  label : {
    marginLeft: 0
  },

  button : {
    marginTop: 25
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
    padding: 5
  }
});