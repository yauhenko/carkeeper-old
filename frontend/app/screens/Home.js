import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {observer} from 'mobx-react';
import { Container, Button, Content, Form, Item, Input, Label } from 'native-base';
import User from "../store/User";
import { observable, action} from 'mobx';

@observer
export default class Home extends React.Component {
  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <Text onPress={()=>{User.auth = false}} style={styles.logo}>Выход</Text>
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