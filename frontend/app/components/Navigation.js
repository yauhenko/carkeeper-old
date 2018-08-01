import React, { Component } from 'react'
import { StyleSheet, View, Image, TouchableHighlight} from 'react-native';
import {Container, Content, Text, List, ListItem, Left, Body} from 'native-base';

export default class Navigation extends Component {
  render () {
    return (
      <Container style={{backgroundColor: "#3e4669"}}>
        <Content>
          <View style={styles.separator} />
          <List>
            <ListItem icon noIndent style={styles.listItem} onPress={() => this.props.navigation.navigate('Home')}>
              <Body style={styles.listItemBody}>
                <Text style={styles.link}>Достижения</Text>
              </Body>
            </ListItem>

            <ListItem icon noIndent style={styles.listItem} onPress={() => this.props.navigation.navigate('Home')}>
              <Body style={styles.listItemBody}>
              <Text style={styles.link}>Достижения</Text>
              </Body>
            </ListItem>
          </List>
          <View style={styles.bottomLine}/>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  logoWrapper : {
    alignItems: "center",
    paddingTop : 50
  },
  avatar : {
    height: 65,
    width: 65,
    borderRadius: 65,
    resizeMode : "cover",
    marginLeft: 20,
    borderWidth: 5,
    borderColor: "#fff"
  },
  separator : {
    height: 8,
    backgroundColor: "#32395b",
    marginTop: 30,
    marginBottom : 30,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 4
  },
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
  },
  bottomLine : {
    marginTop: 30,
    marginBottom: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#3f5778"
  },
  profileButton : {
    marginRight: 20
  }
});