import React from 'react';
import {Text, View, StyleSheet, Image, Vibration, RefreshControl, Dimensions} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, CheckBox, Tab, Tabs, TabHeading} from 'native-base';
import styles from "../../styles"
import {observable, action} from 'mobx';
import Input from "../../components/Form/Input";
import User from "../../store/User";
import Notification from "../../components/Notification"
import Api from "../../modules/Api";
import Logger from "../../modules/Logger";

@observer
export default class Card extends React.Component {
  @observable loading = false;
  @observable checked = false;
  @observable submitted = false;

  @observable data = {
    firstname: User.profile.user.name || "",
    middlename: "",
    lastname: "",
    phone: User.profile.user.tel || "",
    email: User.profile.user.email || ""
  };

  @action dataChange = (key, value) => {
    this.data[key] = value;
  };

  @action check = async () => {
      const response = await Api("autocard/check", {});
      this.submitted = Boolean(response.application);
  };

  @action submitHandler = async () => {
    // if(!this.checked) {
    //   Notification(`Согласитесь с правилами обработки персональных данных`);
    //   Vibration.vibrate(300);
    //   return false;
    // }

    this.loading = true;

    try {
      await Api("autocard/submit", {form: {
          firstname: this.data.firstname,
          lastname: this.data.lastname,
          middlename: this.data.middlename,
          email: this.data.email,
          tel: this.data.phone
      }});

      Logger.info("Оформлена заявка на автокарту", {form: this.data});
      this.submitted = true;
      Notification("Заявка успешно отправлена");
    } catch (e) {
      Vibration.vibrate(300);
      Notification(e)
    }

    this.loading = false;
  };

  componentDidMount() {
    this.check()
  }

  render() {
    return (
      <Container>
        <Header hasTabs androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Меню"} onPress={this.props.navigation.openDrawer} transparent>
              <Icon style={styles.headerIcon} name='md-menu'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Автокарта</Text></Title>
          </Body>
          <Right/>
        </Header>
        <Tabs ref="tabs" style={{borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#d5dae4"}} locked={true}>
          <Tab style={{backgroundColor: "#d5dae4"}} heading={<TabHeading style={componentStyle.tabHeading}><Text style={componentStyle.tabText}>О карте</Text></TabHeading>}>
            <Content contentContainerStyle={styles.content}>
              <View style={styles.block}>
                <Text style={styles.blockHeading}>АвтоКарта</Text>
                <View style={componentStyle.topItem}><Icon style={componentStyle.icon} name="radio-button-on"/><Text style={componentStyle.topText}>Кэшбэк от 3 до 4,5% на АЗС по всему миру</Text></View>
                <View style={componentStyle.topItem}><Icon style={componentStyle.icon} name="radio-button-on"/><Text style={componentStyle.topText}>Кэшбэк до 10% в сети автопартнеров</Text></View>
                <View style={componentStyle.topItem}><Icon style={componentStyle.icon} name="radio-button-on"/><Text style={componentStyle.topText}>Кэшбэк до 1% за любые покупки</Text></View>
              </View>

              <View style={styles.block}>
                <Button onPress={()=>{this.refs.tabs.goToPage(2)}} full style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>ОФОРМИТЬ ЗАЯВКУ</Text>
                </Button>
              </View>

              <View style={styles.block}>
                <Image resizeMode='contain' style={componentStyle.image} source={require("../../assets/images/autocard_new.png")}/>
              </View>
            </Content>
          </Tab>

          <Tab style={{backgroundColor: "#d5dae4"}} heading={<TabHeading style={componentStyle.tabHeading}><Text style={componentStyle.tabText}>Подробно</Text></TabHeading>}>
            <Content contentContainerStyle={styles.content}>
              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>АЗС</Text>
                <Text>от 3 до 4,5%</Text>
                <Text style={styles.textNote}>А-100 и другие заправки</Text>
              </View>

              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>Автомойки</Text>
                <Text>от 3 до 10%</Text>
                <Text style={styles.textNote}>Эспрессо и другие партнеры</Text>
              </View>

              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>Автозапчасти</Text>
                <Text>от 2 до 8,5%</Text>
                <Text style={styles.textNote}>Шате-М, ARMTEK и другие партнеры</Text>
              </View>

              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>Автошкола</Text>
                <Text>2%</Text>
                <Text style={styles.textNote}>Автошкола Минской РОС ДОСААФ</Text>
              </View>

              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>СТО</Text>
                <Text>от 2,5 до 10%</Text>
                <Text style={styles.textNote}>Шате-М и другие партнеры</Text>
              </View>

              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>Такси</Text>
                <Text>от 2 до 3%</Text>
                <Text style={styles.textNote}>Iqtaxi, Шатле, Новое такси</Text>
              </View>

              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>Страхование</Text>
                <Text>от 4 до 10%</Text>
                <Text style={styles.textNote}>Таск, Купала</Text>
              </View>

              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>Супермаркет</Text>
                <Text>0,5%</Text>
                <Text style={styles.textNote}>Крупные сетевые магазины</Text>
              </View>

              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>Доставка</Text>
                <Text>Бесплатная доставка</Text>
              </View>

              <View style={styles.block}>
                <Text style={[styles.blockHeading, componentStyle.blockHeading]}>Обслуживание карты</Text>
                <Text>19,9 руб. в год</Text>
                <Text style={styles.textNote}>Срок карты 3 года</Text>
              </View>

              <View style={styles.block}>
                <Button onPress={()=>{this.refs.tabs.goToPage(2)}} full style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>ОФОРМИТЬ ЗАЯВКУ</Text>
                </Button>
              </View>
            </Content>
          </Tab>

          <Tab style={{backgroundColor: "#d5dae4"}} heading={<TabHeading style={componentStyle.tabHeading}><Text style={componentStyle.tabText}>Заказать</Text></TabHeading>}>
            <Content refreshControl={<RefreshControl refreshing={this.loading} enabled={false} />} contentContainerStyle={styles.content}>
              {this.submitted
                ?
                <View style={styles.block}>
                  <Text style={componentStyle.empty}>Спасибо, Ваша заявка принята!</Text>
                  <Button onPress={()=>{this.submitted = false}} style={[styles.primaryButton, {marginTop: 15, alignSelf: "center"}]}>
                    <Text style={styles.primaryButtonText}>ОТПРАВИТЬ НОВУЮ ЗАЯВКУ</Text>
                  </Button>
                </View>
                :
                <View style={styles.block}>
                  <Text style={styles.blockHeading}>Заявка на автокарту</Text>
                  <Input onChange={value=>this.dataChange("lastname", value)} value={this.data.lastname}  title="Фамилия *"/>
                  <Input onChange={value=>this.dataChange("firstname", value)} value={this.data.firstname} title="Имя *"/>
                  <Input onChange={value=>this.dataChange("middlename", value)} value={this.data.middlename} title="Отчество *"/>
                  <Input onChange={value=>this.dataChange("phone", value)} value={this.data.phone} title="Телефон *"/>
                  <Input keyboardType="email-address" onChange={value=>this.dataChange("email", value)} value={this.data.email} title="E-mail"/>
                  {/*<View style={componentStyle.checkboxWrapper}>*/}
                    {/*<CheckBox onPress={()=>{this.checked = !this.checked}} checked={this.checked} color={"#a23737"} style={componentStyle.checkbox}/>*/}
                    {/*<Text onPress={()=>{this.checked = !this.checked}} style={{flex: 1}}>Согласен с правилами обработки персональных данных</Text>*/}
                  {/*</View>*/}
                  <Button onPress={this.submitHandler} full style={[styles.primaryButton, {marginTop: 15}]}>
                    <Text style={styles.primaryButtonText}>ОТПРАВИТЬ ЗАЯВКУ</Text>
                  </Button>
                </View>
              }
            </Content>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  topItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10
  },
  topText: {
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
    color: "#a23737",
    fontSize: 16
  },
  image: {
    width: Dimensions.get("window").width - 40,
    flexShrink: 1,
    borderRadius: 5,
    height: (Dimensions.get("window").width - 40) / 1.5
  },
  tabText: {
    color: "#a9b3c7"
  },
  tabHeading: {
    backgroundColor: "#eaeef7"
  },
  blockHeading: {
    marginBottom: 10
  },
  checkbox: {
    left: 0,
    marginRight: 15
  },
  checkboxWrapper: {
    flexDirection: "row",
    paddingTop: 15,
    alignItems: "center"
  },
  empty: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center"
  }
});