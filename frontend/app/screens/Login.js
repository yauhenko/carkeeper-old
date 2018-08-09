import React from 'react';
import {AsyncStorage, StyleSheet, Text, StatusBar} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Input, Label } from 'native-base';
import UserStore from "../store/User";
import { observable, action} from 'mobx';
import styles from "../styles";

@observer
export default class Login extends React.Component {
  @observable tel = "+375 ";
  @observable password = "";

  @action change = (type, value) => {
      this[type] = value;
  };

  @action submitHandler = () => {
    UserStore.login(this.tel, this.password).then(() => {
      AsyncStorage.multiSet([["tel", String(this.tel)],["password", String(this.password)]])
    });
  };

  @action autoFill = () => {
    AsyncStorage.multiGet(["tel", "password"], (err, data) => {
      if(data) {
        this.tel = data[0][1];
        // this.password = data[1][1];
      }
    })
  };

  componentDidMount() {
    this.autoFill();
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={styles.statusBarColor} barStyle="light-content"/>
        <Content contentContainerStyle={customStyles.container}>
          <Text style={customStyles.logo}><Text style={{color:"#ab3131"}}>CAR</Text>KEEPER</Text>
          <Form>
            <Item style={customStyles.label} floatingLabel>
              <Label>Номер телефона</Label>
              <Input keyboardType="numeric" onChangeText={(text)=>{this.change('tel', text)}} value={this.tel} />
            </Item>
            <Item style={customStyles.label} floatingLabel>
              <Label>Пароль</Label>
              <Input secureTextEntry onChangeText={(text)=>{this.change('password', text)}} value={this.password} />
            </Item>
            <Button onPress={this.submitHandler} style={customStyles.primaryButton} block><Text style={styles.primaryButtonText}>Войти</Text></Button>
          </Form>
          <Text style={customStyles.link} onPress={()=>this.props.navigation.navigate('Registration')}>Зарегистрироваться</Text>
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
    padding: 20
  },

  label : {
    marginLeft: 0
  },

  primaryButton : {
    marginTop: 25,
    ...styles.primaryButton
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
    padding: 5
  }
});