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
  @observable name = "";

  @action change = (type, value) => {
    this[type] = value;
  };

  @action submitHandler = () => {
    UserStore.create(this.tel, this.email, this.password, this.name);
  };

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={styles.statusBarColor} barStyle="light-content"/>
        <Content contentContainerStyle={customStyles.container}>
          <Text style={customStyles.logo}><Text style={{color:"#fff"}}>CAR</Text>KEEPER</Text>
          <Form>
            <Item style={customStyles.item} stackedLabel>
              <Label style={customStyles.label}>Имя</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} onChangeText={(text)=>{this.change('name', text)}} value={this.name} />
            </Item>

            <Item style={customStyles.item} stackedLabel>
              <Label style={customStyles.label}>Номер телефона</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} keyboardType="numeric" onChangeText={(text)=>{this.change('tel', text)}} value={this.tel} />
            </Item>

            <Item style={customStyles.item} stackedLabel>
              <Label style={customStyles.label}>Пароль</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} secureTextEntry onChangeText={(text)=>{this.change('password', text)}} value={this.password} />
            </Item>

            <Item style={customStyles.item} stackedLabel>
              <Label style={customStyles.label}>E-mail</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} onChangeText={(text)=>{this.change('email', text)}} value={this.email} />
            </Item>

            <Button onPress={this.submitHandler} style={customStyles.button} block><Text style={{color: "#000"}}>Зарегистрироваться</Text></Button>
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
    color: "#fff"
  },

  input: {
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