import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight} from 'react-native';
import {Container, Content, Text, List, ListItem, Left, Body, Icon} from 'native-base';
import User from "../store/User";

export default class Navigation extends Component {
  render () {
    return (
      <Container style={{backgroundColor: "#f5f5f5", paddingTop: 20}}>
        <Content>
          <List>
            <ListItem icon style={styles.listItem} onPress={() => this.props.navigation.navigate('Garage')}>
              <Left style={{alignItems: "flex-end"}}>
                <Icon style={{color: "#f13f3f"}} name={'car'}/>
              </Left>
              <Body>
              <Text style={styles.link}>Гараж</Text>
              </Body>
            </ListItem>

            <ListItem icon style={styles.listItem} onPress={() => this.props.navigation.navigate('Profile')}>
              <Left style={{alignItems: "flex-end"}}>
                <Icon style={{color: "#f13f3f"}} name={'person'}/>
              </Left>
              <Body>
              <Text style={styles.link}>Профиль</Text>
              </Body>
            </ListItem>

            <ListItem icon style={styles.listItem} onPress={() => User.logout()}>
              <Left style={{alignItems: "flex-end"}}>
                <Icon style={{color: "#f13f3f"}} name={'exit'}/>
              </Left>
              <Body>
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
    fontSize : 15
  },
  listItem : {
    height: 60,
    alignItems: "flex-end"
  }
});