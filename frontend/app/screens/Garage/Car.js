import React, {Fragment} from 'react';
import {Text, View, RefreshControl, Alert, Image, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react';
import {
  Container,
  Button,
  Content,
  Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
  ActionSheet
} from 'native-base';
import styles from "../../styles"
import {observable, action, toJS} from 'mobx';
import Cars from "../../store/Cars";
import Footer from "../../components/Footer";
import CarMenu from "../../components/CarMenu";
import Notification from "../../components/Notification";
import {cdn} from "../../modules/Url";
import AddOrEditCar from "./AddOrEditCar";
import {number_format} from "../../modules/Utils";
import Odo from "../../components/Odo";
import Logger from "../../modules/Logger";
import moment from "moment";

@observer
export default class Car extends React.Component {
  @observable car = Cars.currentCar;

  @observable loading = false;

  @observable odoModal = false;
  @observable odoValue = this.car.car.odo;

  @observable history = [];

  @observable edit = false;

  @action getCar = async () => {
    this.loading = true;
    try {
      this.car = await Cars.getCar(this.car.car.id);
      Cars.setCurrentCar(this.car);
      this.odoValue = this.car.car.odo;
    } catch (e) {
      Notification(e);
      this.props.navigation.navigate('Garage');
    }
    this.loading = false;
  };

  @action updateOdo = async () => {
    try {
      await Cars.updateCar({
        id: this.car.car.id,
        car: {
          odo: Number(this.odoValue)
        }
      });
      this.car.car.odo = this.odoValue;
      this.odoModal = false;
      Logger.info("Пользователь обновил одометр", {odo: this.odoValue});
      Notification("Пробег сохранён");
    } catch (e) {
      Notification(e);
    }
  };

  @action deleteCar = async () => {
    Alert.alert('Удалить автомобиль', `${this.car.refs.mark.name} ${this.car.refs.model.name}`, [
      {text: 'Отмена', style: 'cancel'},
      {text: 'Удалить', onPress: async () => {
          this.loading = true;
          try {
            await Cars.deleteCar(this.car.car.id);
            Logger.info("Пользователь удалил автомобиль", {car: this.car.car.id});
            this.props.navigation.navigate('Garage');
            Cars.resetCurrentCar();
          } catch (e) {
            Notification(e);
          }
          this.loading = false;
      }}
    ]);
  };

  @action toggleEditCarModal = (bool = true) => {
      this.edit = bool;
  };

  @action resetOdo = () => {
      this.odoValue = this.car.car.odo;
  };

  @action getOdoHistory = async () => {
    this.history = (await Cars.getOdoHistory({id: this.car.car.id})).history;
    console.log(toJS(this.history))
  };

  action = () => {
    ActionSheet.show(
      {
        options: [
          { text: "Редактировать", icon: "create", iconColor: "#b9babd" },
          { text: "Удалить", icon: "trash", iconColor: "#b9babd" },
          { text: "Отмена", icon: "close", iconColor: "#b9babd" }
        ],
        cancelButtonIndex: 2,
        title: `${this.car.refs.mark.name} ${this.car.refs.model.name}`
      },
      index => {
        if(index === 0) {this.toggleEditCarModal(true)}
        if(index === 1) {this.deleteCar()}
      }
    )
  };

  render() {
    const {car, refs, notifications} = this.car;

    return (
      <Fragment>
        <Container style={styles.container}>
          <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
            <Left>
              <Button title="Назад" onPress={() => {Cars.resetCurrentCar(); this.props.navigation.navigate('Garage')}} transparent>
                <Icon style={styles.headerIcon} name='md-arrow-back'/>
              </Button>
            </Left>
            <Body>
            <Title><Text style={styles.headerTitle}>Обзор: {refs.mark.name} {refs.model.name}</Text></Title>
            </Body>
            <Right>
              <Button onPress={() => {this.action()}} transparent>
                <Icon style={styles.headerIcon} name='md-more'/>
              </Button>
            </Right>
          </Header>

          <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={() => {this.getCar()}}/>} contentContainerStyle={styles.content}>
            <View style={styles.block}>
              <Text style={componentStyle.header}>{refs.mark.name} {refs.model.name}, {this.car.car.year}г.</Text>
              {car.image
                ?
                <Image style={componentStyle.image} source={{uri: cdn + refs.image.path}} />
                :
                <View style={componentStyle.stubWrapper}>
                  <Image style={componentStyle.stub} source={car.image ? {uri: cdn + refs.image.path} : require('../../assets/images/car_stub.png')} />
                </View>
              }

              <View style={componentStyle.odo}>
                <View style={componentStyle.odoValue}>
                  {car.odo
                    ?
                    <Text  onPress={()=>this.odoModal = true} style={componentStyle.odoValueText}>Пробег: <Text style={{fontSize: 18}}>{number_format(car.odo, 0, "", " ")}</Text> {car.odo_unit === "m" ? "миль" : "км"}</Text>
                    :
                    <Text onPress={()=>this.odoModal = true} style={componentStyle.odoValueText}>Пробег не указан</Text>
                  }
                  <Button style={componentStyle.odoButton} transparent small onPress={()=>this.odoModal = true}><Icon style={{color: "#7f8a9d"}} name="create"/></Button>
                </View>
                <Text style={componentStyle.odo_text}>Регулярно обновляйте значение пробега, чтобы своевременно получать рекомендации по обслуживанию автомобиля</Text>
              </View>
            </View>

            <View style={styles.block}>
              {notifications.map((item, key) => {
                let route = null;
                switch (item.type) {
                  case "fines" : route = "Fines";
                    break;
                  case "checkup" : route = "Reminders";
                    break;
                  case "insurance" : route = "Reminders";
                    break;
                  case "maintenances" : route = "Maintenance";
                    break;
                  case "maintenance" : route = "Journal";
                    break;
                }

                return(
                  <TouchableOpacity key={key} onPress={()=>{Boolean(route) && this.props.navigation.navigate(route)}}>
                    <View style={[componentStyle.listItem, notifications.length === key + 1 ? {borderBottomWidth: 0} : {}]}>
                      <View style={componentStyle.listIcon}>
                        {item.level === "warning" && <Icon style={{color: "#ffb157"}} name="warning" />}
                        {item.level === "danger" && <Icon style={{color: "#a23737"}} name="alert" />}
                        {item.level === "info" && <Icon style={{color: "#76b6ff"}} name="information-circle" />}
                      </View>
                      <Text style={componentStyle.listText}>{item.text}</Text>
                      <View>
                        <Icon style={componentStyle.listArrow} name='arrow-forward'/>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </Content>

          <Footer><CarMenu navigation={this.props.navigation}/></Footer>

          <Modal animationType="slide" transparent={false} visible={this.odoModal} onShow={()=>{this.getOdoHistory()}} onRequestClose={() => {this.resetOdo(); this.odoModal = false;}}>
            <Container style={styles.container}>
              <Header androidStatusBarColor={styles.statusBarColor} style={styles.modalHeader}>
                <Left>
                  <Button title={"Назад"} onPress={() => {this.odoModal = false}} transparent>
                    <Icon style={styles.headerIcon} name='md-arrow-back'/>
                  </Button>
                </Left>
                <Body>
                <Title><Text style={styles.headerTitle}>Текущий пробег</Text></Title>
                </Body>
                <Right>
                  <Button onPress={()=>{this.updateOdo()}} transparent>
                    <Icon style={styles.headerSaveIcon} name='md-checkmark'/>
                  </Button>
                </Right>
              </Header>

              <Content contentContainerStyle={styles.content}>
                <View style={styles.block}>
                  <Odo onChange={value => {this.odoValue = value}} value={this.odoValue || 0}/>
                </View>
                {
                  this.history.length
                  ?
                  <View style={styles.block}>
                    <Text style={styles.blockHeading}>История обновлений одометра</Text>
                    {this.history.map((item, key) => (
                      <View key={key} style={[componentStyle.listItem, this.history.length === key + 1 ? {borderBottomWidth: 0} : {}]}>
                        <View style={{width: 120}}>
                          <Text>{moment(item.date).format("DD.MM.YYYY")}</Text>
                        </View>
                        <Text style={componentStyle.listText}>{number_format(item.odo, 0, "", " ")} {car.odo_unit === "m" ? "миль" : "км"}</Text>
                      </View>
                    ))}
                  </View>
                  :
                  null
                }
              </Content>
            </Container>
          </Modal>
        </Container>

        <AddOrEditCar cb={()=>{this.getCar()}} edit={true} onClose={()=>{this.toggleEditCarModal(false)}} car={this.car} show={this.edit}/>
      </Fragment>
    );
  }
}

const componentStyle = StyleSheet.create({
  odo: {
    marginTop: 10
  },
  odoValue: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#d5dae4",
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  odoButton : {
    top: 2
  },
  odoValueText: {
    color: "#7f8a9d"
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 5,
    marginTop: 10
  },
  stubWrapper: {
    backgroundColor: "#eaeef7",
    height: 120,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  stub: {
    width: 74,
    height: 34
  },
  header: {
    fontWeight: "bold"
  },
  odo_text: {
    lineHeight: 21
  },
  listItem: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#d5dae4"
  },
  listIcon: {
    width: 35
  },
  listText: {
    lineHeight: 21,
    flex: 1,
    paddingRight: 10
  },
  listArrow: {
    color: "#d5dae4"
  }
});