import React, {Component} from 'react'
import {StyleSheet, View, TouchableOpacity, Image, Dimensions, ImageBackground} from 'react-native';
import {Text, List, ListItem, Left, Body, Thumbnail, Icon, Button} from 'native-base';
import User from "../store/User";
import Cars from "../store/Cars";
import {observer} from "mobx-react";
import thumb from "../assets/images/avatar_thumb.png";
import {cdn} from "../modules/Url";

@observer
export default class Navigation extends Component {
  routes = [
    {
      title: "ГАРАЖ",
      icon: "car",
      path: "Garage",
      action: null
    },
    // {
    //   title: "Лента",
    //   icon: "paper",
    //   path: "News",
    //   action: null
    // },

    // {
    //   title: "АВТОКАРТА",
    //   icon: "card",
    //   path: "Card",
    //   action: null,
    //   hidden: User.profile.user.geo !== "BY"
    // },
    // {
    //   title: "ОБРАТНАЯ СВЯЗЬ",
    //   icon: "text",
    //   path: "Support",
    //   action: null
    // }
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

    if(route.path === "Garage" && Cars.currentCar) {
      this.props.navigation.navigate("Car");
      this.props.navigation.closeDrawer();
      return;
    }

    this.props.navigation.navigate(route.path);
  };

  render () {
    const {user, refs} = User.profile;
    let cars = Cars.cars;

    return (

      <ImageBackground source={require("../assets/images/login_background.jpg")} style={{width: '100%', height: '100%', flex: 1}}>
        <View style={{flex: 1}}>
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
              if(route.hidden) return null;
              return (
                <ListItem key={key} icon style={componentStyle.listItem} onPress={() => {this.change(route)}}>
                  <Left style={{alignItems: "flex-end"}}>
                    <Icon style={{color: "#d5dae4"}} name={route.icon}/>
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
            <Button onPress={()=>{this.props.navigation.closeDrawer(); this.props.navigation.navigate("Info")}} transparent><Icon style={componentStyle.bottomIcon} name={"information-circle"}/></Button>
          </View>
          <Button onPress={()=>{this.props.navigation.closeDrawer(); User.logout()}} transparent><Icon style={componentStyle.bottomIcon} name={"power"}/></Button>
        </View>
      </ImageBackground>

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
    color: "#d5dae4",
    fontSize: 26,
  }
});
