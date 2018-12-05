import React, {Component} from 'react'
import {StyleSheet, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import {Text, List, ListItem, Left, Body, Thumbnail, Icon, Button} from 'native-base';
import User from "../store/User";
import Cars from "../store/Cars";
import {observer} from "mobx-react";
import thumb from "../assets/images/avatar_thumb.png";
import {cdn} from "../modules/Url";
import background from "../assets/images/navbar_bg.png";

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
      title: "Автокарта",
      icon: "card",
      path: "Card",
      action: null
    },
    {
      title: "Поддержка",
      icon: "text",
      path: "Support",
      action: null
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
        <View style={{alignItems: "center", position: "absolute", left: 0, right: 0, top: 0, bottom: 0}}>
          <Image style={{height: Dimensions.get("window").height, width: Dimensions.get("window").width}} source={background}/>
        </View>

        <View>
          <View style={componentStyle.top}>
            <View style={{marginRight: 15}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                {user.avatar
                  ? <Thumbnail style={{borderWidth: 3, borderColor: "#d6d7da"}} large source={{uri: cdn + refs.avatar.path}}/>
                  : <Thumbnail large source={thumb}/>
                }
              </TouchableOpacity>
            </View>
            <View>
              <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize: 16, color: "#fff"}}>{`${user.name || "Аноним"}`}</Text>
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

        <View style={componentStyle.bottom}>
          <View style={{flexDirection: "row"}}>
            <Button onPress={()=>{this.props.navigation.closeDrawer(); this.props.navigation.navigate("Profile")}} transparent><Icon style={[componentStyle.bottomIcon, {marginRight: 20}]} name={"settings"}/></Button>
            <Button transparent><Icon style={componentStyle.bottomIcon} name={"information-circle"}/></Button>
          </View>
          <Button onPress={()=>{this.props.navigation.closeDrawer(); User.logout()}} transparent><Icon style={componentStyle.bottomIcon} name={"power"}/></Button>
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
    fontSize : 14,
    color: "#fff"
  },
  top: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingLeft: 15,
    borderBottomColor: "#d6d7da",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0
  },

  listItem : {
    height: 60,
    alignItems: "flex-end"
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 5
  },

  bottomIcon: {
    color: "#fff",
    fontSize: 26,
    opacity: 0.5

  }
});