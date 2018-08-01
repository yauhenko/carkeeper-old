import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Input, Label } from 'native-base';
import UserStore from "../store/User";
import { observable, action} from 'mobx';

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
        <Content contentContainerStyle={styles.container}>
          <Text style={styles.logo}>АВТОЗАПЧАСТИ</Text>
          <Form>
            <Item style={styles.label} floatingLabel>
              <Label>Номер телефона</Label>
              <Input onChangeText={(text)=>{this.change('tel', text)}} value={this.tel} />
            </Item>
            <Item style={styles.label} floatingLabel>
              <Label>Пароль</Label>
              <Input onChangeText={(text)=>{this.change('password', text)}} value={this.password} />
            </Item>
            <Button onPress={this.submitHandler} style={styles.button} block success><Text>Войти</Text></Button>
          </Form>

          <Text style={styles.link} onPress={()=>this.props.navigation.navigate('Registration')}>Зарегистрироваться</Text>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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

  link : {
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 30,
    padding: 5
  }
});