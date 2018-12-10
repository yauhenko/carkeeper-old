import React from 'react';
import {Text, View, StyleSheet, Image, Dimensions, ScrollView} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, ListItem, Tab, Tabs, TabHeading,} from 'native-base';
import styles from "../../styles"
import {observable, action} from 'mobx';
import autoCard from "../../assets/images/autoCard.jpg";
import Input from "../../components/Form/Input";
import User from "../../store/User";

@observer
export default class Card extends React.Component {
  @observable loading = false;

  @observable data = {
    firstname: User.profile.user.name || "",
    lastname: "",
    phone: User.profile.user.tel || ""
  };

  @observable dataChange = (key, value) => {
    this.data[key] = value;
  };
  
  @observable submitHandler = () => {
    
  };

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
        <Tabs style={{borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#a9b3c7"}} locked={true}>

          <Tab style={{backgroundColor: "#d5dae4"}} heading={<TabHeading style={componentStyle.tabHeading}><Text style={componentStyle.tabText}>О карте</Text></TabHeading>}>
            <Content contentContainerStyle={styles.content}>
              <View style={styles.block}>
                  <View style={componentStyle.top}>
                    <View style={componentStyle.topItem}><Icon style={componentStyle.icon} name="star"/><Text style={componentStyle.topText}>Кэшбэк 3% на АЗС по всему миру</Text></View>
                    <View style={componentStyle.topItem}><Icon style={componentStyle.icon} name="star"/><Text style={componentStyle.topText}>Кэшбэк до 10% в сети автопартнеров</Text></View>
                    <View style={componentStyle.topItem}><Icon style={componentStyle.icon} name="star"/><Text style={componentStyle.topText}>Кэшбэк до 1% за любые покупки</Text></View>
                  </View>
                  <Image resizeMode={'contain'} style={componentStyle.image} source={autoCard}/>
              </View>
            </Content>
          </Tab>

          <Tab style={{backgroundColor: "#d5dae4"}} heading={<TabHeading style={componentStyle.tabHeading}><Text style={componentStyle.tabText}>Подробно</Text></TabHeading>}>
            <Content contentContainerStyle={styles.content}>
              <View style={styles.block}>
                <Text>Текст</Text>
              </View>
            </Content>
          </Tab>

          <Tab style={{backgroundColor: "#d5dae4"}} heading={<TabHeading style={componentStyle.tabHeading}><Text style={componentStyle.tabText}>Заказать</Text></TabHeading>}>
            <Content contentContainerStyle={styles.content}>
              <View style={styles.block}>
                <Text style={styles.blockHeading}>Заявка на автокарту</Text>
                <Input onChange={value=>this.dataChange("phone", value)} value={this.data.phone} title="Телефон"/>
                <Input onChange={value=>this.dataChange("firstname", value)} value={this.data.firstname} title="Имя"/>
                <Input onChange={value=>this.dataChange("lastname", value)} value={this.data.lastname}  title="Фамилия"/>
                <Button onPress={this.submitHandler} style={[styles.primaryButton, {alignSelf: "center", marginTop: 15}]}>
                  <Text style={styles.primaryButtonText}>ОТПРАВИТЬ ЗАЯВКУ</Text>
                </Button>
              </View>
            </Content>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  top: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d5dae4"
  },
  topItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },
  topText: {
    fontWeight: "bold",
  },
  icon: {
    marginRight: 15,
    color: "#a23737"
  },
  image: {
    aspectRatio: 1,
    width: Dimensions.get("window").width - 30,
    height: null
  },
  tabText: {
    color: "#000"
  },
  tabHeading: {
    backgroundColor: "#eaeef7"
  }
});