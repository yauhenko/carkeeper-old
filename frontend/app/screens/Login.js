import React from 'react';
import {AsyncStorage, StyleSheet, Text, StatusBar, RefreshControl} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Input, Label } from 'native-base';
import User from "../store/User";
import { observable, action} from 'mobx';
import styles from "../styles";
import Cars from "../store/Cars";

@observer
export default class Login extends React.Component {
  @observable tel = "";
  @observable password = "";

  @action change = (type, value) => {this[type] = value};

  @action submitHandler = () => {
    User.login(this.tel, this.password).then(() => {
      AsyncStorage.multiSet([["tel", String(this.tel)],["password", String(this.password)]]);
    }).catch(console.log);
  };

  @action autoFill = () => {
    AsyncStorage.multiGet(["tel", "password"], (err, data) => {
      if(data) {
        this.tel = data[0][1];
        this.password = data[1][1];
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
        <Content refreshControl={<RefreshControl refreshing={User.loading}/>} opacity={User.loading ? 0.8 : 1}  contentContainerStyle={customStyles.container}>
          <Text style={customStyles.logo}><Text style={{color:"#fff"}}>CAR</Text>KEEPER</Text>
          <Form>
            <Item style={customStyles.item} stackedLabel>
              <Label style={customStyles.label}>Номер телефона</Label>
              <Input selectionColor={styles.selectionColor} style={customStyles.input} keyboardType="numeric" onChangeText={(text)=>{this.change('tel', text)}} value={this.tel ? String(this.tel) : ""} />
            </Item>

            <Item style={customStyles.item} stackedLabel>
              <Label style={customStyles.label}>Пароль</Label>
              <Input selectionColor={styles.selectionColor} style={customStyles.input} secureTextEntry onChangeText={(text)=>{this.change('password', text)}} value={this.password ? String(this.password) : ""} />
            </Item>

            <Button disabled={User.loading} onPress={this.submitHandler} style={customStyles.primaryButton} block><Text style={{color: "#000"}}>Войти</Text></Button>
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
    padding: 20,
    backgroundColor: "#f13f3f"
  },

  input: {
    color: "#fff",
    fontSize: 16
  },

  label: {
    color: "#d6d7da"
  },

  item : {
    marginLeft: 0
  },

  primaryButton : {
    marginTop: 25,
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