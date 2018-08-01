import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight} from 'react-native';
import {Container, Content, Text, List, ListItem, Left, Body} from 'native-base';
import User from "../store/User";

export default class Navigation extends Component {
  render () {
    return (
      <Container style={{backgroundColor: "#3e4669", paddingTop: 20}}>
        <Content>
          <List>
            <ListItem icon noIndent style={styles.listItem} onPress={() => this.props.navigation.navigate('Home')}>
              <Body style={styles.listItemBody}>
                <Text style={styles.link}>Главная</Text>
              </Body>
            </ListItem>

            <ListItem icon noIndent style={styles.listItem} onPress={() => this.props.navigation.navigate('Garage')}>
              <Body style={styles.listItemBody}>
              <Text style={styles.link}>Гараж</Text>
              </Body>
            </ListItem>

            <ListItem icon noIndent style={styles.listItem} onPress={() => User.logout()}>
              <Body style={styles.listItemBody}>
                <Text style={styles.link}>Выход</Text>
              </Body>
            </ListItem>

          </List>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  link : {
    color : "#fff",
    fontSize : 15
  },
  listItem : {
    height: 60,
    paddingLeft: 20,
    paddingRight: 20
  },
  listItemBody : {
    borderBottomWidth: 0
  }
});