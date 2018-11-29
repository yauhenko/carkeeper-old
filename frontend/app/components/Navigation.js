import React, {Component} from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {Text, List, ListItem, Left, Body, Thumbnail, Icon} from 'native-base';
import User from "../store/User";
import Cars from "../store/Cars";
import {observer} from "mobx-react";
import thumb from "../assets/images/avatar_thumb.png";
import {cdn} from "../modules/Url";

@observer
export default class Navigation extends Component {
  routes = [
    {
      title: "Гараж",
      icon: "car",
      path: "Garage",
      action: null
    },
    {
      title: "Лента",
      icon: "paper",
      path: "News",
      action: null
    },
    {
      title: "Профиль",
      icon: "person",
      path: "Profile",
      action: null
    },
    {
      title: "Выход",
      icon: "exit",
      path: null,
      action: User.logout
    }
  ];

  change = route => {
    if(route.path === this.props.activeItemKey) {
      this.props.navigation.closeDrawer();
      return;
    }

    if(route.action) {
      route.action();
      this.props.navigation.closeDrawer();
      return;
    }

    this.props.navigation.navigate(route.path);
  };

  render () {
    const {user, refs} = User.profile;
    let cars = Cars.cars;

    return (
      <View style={componentStyle.wrapper}>
        <View>
          <View style={componentStyle.top}>
            <View style={{marginRight: 15}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                {user.avatar
                  ? <Thumbnail large source={{uri: cdn + refs.avatar.path}}/>
                  : <Thumbnail large source={thumb}/>
                }
              </TouchableOpacity>
            </View>

            <View>
              <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize: 16, color: "#fff"}}>{`${user.name}`}</Text>
              {cars.cars.length ?
                <Text style={{fontSize: 12, color: "#fff"}}>Езжу на {cars.refs.mark[cars.cars[0].mark].name} {cars.refs.model[cars.cars[0].model].name}</Text>
                :
                <Text style={{fontSize: 12, color: "#fff", width: 150}}>Пешеход. Автомобиль не добавлен в гараж.</Text>
              }
            </View>
          </View>

          <List>
            {this.routes.map((route, key)=>{
              return (
                <ListItem key={key} icon style={componentStyle.listItem} onPress={() => {this.change(route)}}>
                  <Left style={{alignItems: "flex-end"}}>
                    <Icon style={{color: "#f13f3f"}} name={route.icon}/>
                  </Left>
                  <Body>
                    <Text style={componentStyle.link}>{route.title}</Text>
                  </Body>
                </ListItem>
              )
            })}
          </List>
        </View>

        <View style={componentStyle.callback}>
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Support")}}>
            <Text style={componentStyle.callbackLink}>Обратная связь</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const componentStyle = StyleSheet.create({
  wrapper: {
    justifyContent: "space-between",
    flex: 1
  },
  link: {
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
  },
  callback: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 15
  },
  callbackLink: {
    textDecorationLine: "underline",
    color: "#f13f3f",
    fontSize: 14
  }
});