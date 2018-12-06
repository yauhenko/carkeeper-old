import React from 'react';
import {Text, View, StyleSheet, Image, Dimensions, ScrollView} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, ListItem, Tab, Tabs, TabHeading,} from 'native-base';
import styles from "../../styles"
import {observable, action} from 'mobx';
import avtokarta from "../../assets/images/avtokarta.jpg";

@observer
export default class Card extends React.Component {
  @observable loading = false;

  render() {
    return (
      <Container>
        <Header  hasTabs androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Меню"} onPress={this.props.navigation.openDrawer} transparent>
              <Icon name='menu'/>
            </Button>
          </Left>
          <Body style={{flexGrow: 2}}>
            <Title><Text style={styles.headerTitle}>Автокарта</Text></Title>
          </Body>
        </Header>
        <Tabs style={{borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#fff"}} locked={true}>
          <Tab heading={<TabHeading style={{backgroundColor: "#555"}}><Text style={componentStyle.tabText}>О карте</Text></TabHeading>}>
            <ScrollView>
              <View style={componentStyle.top}>
                <View style={componentStyle.topItem}><Icon style={componentStyle.icon} name="star"/><Text style={componentStyle.topText}>Кэшбэк 3% на АЗС по всему миру</Text></View>
                <View style={componentStyle.topItem}><Icon style={componentStyle.icon} name="star"/><Text style={componentStyle.topText}>Кэшбэк до 10% в сети автопартнеров</Text></View>
                <View style={componentStyle.topItem}><Icon style={componentStyle.icon} name="star"/><Text style={componentStyle.topText}>Кэшбэк до 1% за любые покупки</Text></View>
              </View>
              <Image resizeMode={'contain'} style={componentStyle.image} source={avtokarta}/>
            </ScrollView>
          </Tab>
          <Tab heading={<TabHeading style={{backgroundColor: "#555"}}><Text style={componentStyle.tabText}>Подробно</Text></TabHeading>}>
            <Text>2</Text>
          </Tab>
          <Tab heading={<TabHeading style={{backgroundColor: "#555"}}><Text style={componentStyle.tabText}>Заказать</Text></TabHeading>}>
            <Text>3</Text>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  top: {
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d6d7da"
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
    width: Dimensions.get("window").width,
    height: null
  },
  tabText: {
    color: "#fff"
  }
});