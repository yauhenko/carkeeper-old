import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight} from 'react-native';
import {Container, Content, Text, List, ListItem, Left, Body, Thumbnail, Icon} from 'native-base';
import User from "../store/User";
import Uploader from "../store/Uploader";
import Cars from "../store/Cars";
import {observer} from "mobx-react";

@observer
export default class Navigation extends Component {
  render () {
    return (
      <Container style={{backgroundColor: "#f5f5f5"}}>
        <Content>
          <List>
            <View style={styles.top}>
              <View style={{marginRight: 15}}>
                <Thumbnail large source={{uri: Uploader.get(User.profile.avatar)}} />
              </View>
              <View>
                <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize: 16, color: "#fff"}}>{`${User.profile.name}`}</Text>
                {Cars.cars.length ?
                  <Text style={{fontSize: 12, color: "#fff"}}>Езжу на {Cars.cars[0].mark.name} {Cars.cars[0].model.name}</Text>
                  :
                  null
                }
              </View>
            </View>

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
  top: {
    paddingTop: 53,
    paddingBottom: 53,
    paddingLeft: 15,
    borderBottomColor: "#d6d7da",
    borderBottomWidth: 0.5,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f13f3f",
    marginTop: 0
  },
  listItem : {
    height: 60,
    alignItems: "flex-end"
  }
});