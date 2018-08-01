import React from 'react';
import {customStylesheet, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Input, Label } from 'native-base';
import UserStore from "../store/User";
import { observable, action} from 'mobx';
import styles from "../styles";

@observer
export default class Login extends React.Component {
  @observable tel = "+375 29 384-53-61";
  @observable password = "123456";

  @action change = (type, value) => {
      this[type] = value;
  };

  @action submitHandler = () => {
    UserStore.login(this.tel, this.password);
  };

  render() {
    console.log(this.props);
    return (
      <Container>
        <Content contentContainerStyle={customStyles.container}>
          <Text style={customStyles.logo}>АВТОЛЮБИТЕЛЬ</Text>
          <Form>
            <Item style={customStyles.label} floatingLabel>
              <Label>Номер телефона</Label>
              <Input onChangeText={(text)=>{this.change('tel', text)}} value={this.tel} />
            </Item>
            <Item style={customStyles.label} floatingLabel>
              <Label>Пароль</Label>
              <Input onChangeText={(text)=>{this.change('password', text)}} value={this.password} />
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
    justifyContent: "center"
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