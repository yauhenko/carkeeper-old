import React from 'react';
import {View, Text, AsyncStorage} from 'react-native';
import styles from "../styles";
import {Button, Icon} from "native-base";
import { observable, action} from 'mobx';
import {observer} from 'mobx-react';
import Logger from "../modules/Logger";
import User from "../store/User";

@observer
export default class GarageAutoCard extends React.Component {
  @observable visible;

  constructor(props) {
    super(props);
    this.visible = false;
  }

  componentDidMount() {
    this.check();
    AsyncStorage.removeItem("hideGarageAutoCard")
  }

  @action hide = () => {
    this.set();
    this.visible = false;
  };

  @action check = async () => {
    if(User.profile.user.geo !== "BY") return;
    const value = await AsyncStorage.getItem("hideGarageAutoCard", ()=>{});
    this.visible = !value;
  };

  @action more = () => {
    this.set();
    this.props.navigation.navigate('Card');
  };

  set = async () => {
    try {
      await AsyncStorage.setItem("hideGarageAutoCard", "1");
    } catch (e) {
      Logger.error(e);
    }
  };

  render() {
    if(!this.visible) return null;

    return (
      <View style={styles.block}>
        <Text style={styles.blockHeading}>Как сэкономить на топливе и запчастях?</Text>
        <Text style={componentStyle.title}>АВТОКАРТА</Text>
        <View style={componentStyle.description}>

          <View style={componentStyle.item}>
            <Icon style={componentStyle.icon} name="radio-button-on"/>
            <View>
              <Text style={componentStyle.text}>Кэшбэк от 3 до 4,5% на АЗС</Text>
              <Text style={styles.textNote}>А-100 и другие заправки</Text>
            </View>
          </View>

          <View style={componentStyle.item}>
            <Icon style={componentStyle.icon} name="radio-button-on"/>
            <View>
              <Text style={componentStyle.text}>Кэшбэк от 2,5 до 10% на СТО</Text>
              <Text style={styles.textNote}>Шате-М и другие партнеры</Text>
            </View>
          </View>

          <View style={componentStyle.item}>
            <Icon style={componentStyle.icon} name="radio-button-on"/>
            <View>
              <Text style={componentStyle.text}>Кэшбэк от 2 до 8,5% на автозапчасти</Text>
              <Text style={styles.textNote}>Шате-М, ARMTEK и другие партнеры</Text>
            </View>
          </View>
        </View>

        <View style={componentStyle.buttons}>
          <Button style={styles.primaryButton} onPress={()=>{this.more()}}>
            <Text style={styles.primaryButtonText}>ПОДРОБНЕЕ О КАРТЕ</Text>
          </Button>
          <Button style={componentStyle.button} transparent onPress={()=>{this.hide()}}>
            <Text style={componentStyle.buttonText}>СКРЫТЬ</Text>
          </Button>
        </View>
      </View>
    )
  }
}

const componentStyle = {
  description: {
    paddingTop: 15,
    paddingBottom: 10
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  title: {
    textAlign: "center",
    marginTop: 15,
    fontWeight: "bold"
  },
  icon: {
    marginRight: 10,
    color: "#a23737",
    fontSize: 16
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5
  },
  button: {
    alignSelf: "center",
    paddingLeft: 15,
    paddingRight: 15
  },
  buttonText: {
    color: "#a9b3c7",
    fontWeight: "bold"
  }
};
