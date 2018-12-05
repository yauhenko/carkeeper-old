import React, {Fragment} from 'react';
import {Text, View, RefreshControl, Alert, Dimensions, StyleSheet, Modal} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, Thumbnail, List, ListItem} from 'native-base';
import styles from "../../styles"
import {observable, action, toJS} from 'mobx';
import Cars from "../../store/Cars";
import Footer from "../../components/Footer";
import HeaderMenu from "../../components/HeaderMenu";
import CarMenu from "../../components/CarMenu";
import Notification from "../../components/Notification";
import {cdn} from "../../modules/Url";
import AddOrEditCar from "./AddOrEditCar";
import {number_format} from "../../modules/Utils";
import Odo from "../../components/Odo";

@observer
export default class Car extends React.Component {
  @observable id = this.props.navigation.state.params.id;
  @observable mark = this.props.navigation.state.params.mark;
  @observable model = this.props.navigation.state.params.model;

  @observable loading = true;

  @observable odoModal = false;
  @observable odoValue = Number();

  @observable car = {};

  @observable menu = false;

  @observable edit = false;

  @action getCar = async () => {
    this.loading = true;
    try {
      this.car = await Cars.getCar(this.id);
      this.odoValue = this.car.car.odo;
      this.mark = this.car.refs.mark.name;
      this.model = this.car.refs.model.name;
    } catch (e) {
      Notification(e);
      this.props.navigation.navigate('Garage');
    }
    this.loading = false;
  };

  @action updateOdo = async () => {
    try {
      await Cars.updateCar({
        id: this.id,
        car: {
          odo: Number(this.odoValue)
        }
      });
      this.car.car.odo = this.odoValue;
      this.odoModal = false;
      Notification("Показания обновлены");
    } catch (e) {
      Notification(e);
    }
  };

  @action deleteCar = async () => {
    this.menu = false;

    Alert.alert('Удалить автомобиль', `${this.mark} ${this.model}`, [
      {text: 'Отмена', style: 'cancel'},
      {text: 'Удалить', onPress: async () => {
          this.loading = true;
          try {
            this.car = await Cars.deleteCar(this.id);
            this.props.navigation.navigate('Garage');
          } catch (e) {
            Notification(e);
          }
          this.loading = false;
      }}
    ]);
  };

  @action toggleEditCarModal = (bool = true) => {
      this.menu = false;
      this.edit = bool;
  };

  @action resetOdo = () => {
      this.odoValue = this.car.car.odo;
  };

  componentDidMount() {
    this.getCar();
  };

  render() {
    const {car, refs, notifications} = this.car;

    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title="Назад" onPress={() => {Cars.setCurrentCar(null); this.props.navigation.navigate('Garage')}} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Обзор: {this.mark} {this.model}</Text></Title>
          </Body>
          <Right>
            <Button onPress={() => {this.menu = true}} transparent>
              <Icon name='more'/>
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={() => {this.getCar()}}/>} contentContainerStyle={styles.content}>
          {this.loading
            ?
            null
            :
            <Fragment>
              <View style={{alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "#d6d7da"}}>
                <Thumbnail square style={{width: Dimensions.get('window').width, height: 200}} large source={car.image ? {uri: cdn + refs.image.path} : require('../../assets/images/car_stub_square.png')} />
              </View>
              <View style={componentStyle.odo}>
                <View style={{flex: 1}}>
                  {car.odo
                    ?
                    <Text style={componentStyle.odo_value}>Пробег: <Text style={{fontSize: 18}}>{number_format(car.odo, 0, "", " ")}</Text> {car.odo_unit === "m" ? "миль" : "км"}</Text>
                    :
                    <Text style={componentStyle.odo_value}>Пробег не указан</Text>
                  }
                  <Text style={styles.textNote}>Регулярно обновляйте показания одометра, чтобы получать рекомендации по обслуживанию автомобиля</Text>
                </View>
                <Button style={componentStyle.odo_button} small onPress={()=>this.odoModal = true}><Icon name="create"/></Button>
              </View>


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
                  }

                  return <ListItem style={{height: null}} onPress={()=>{Boolean(route) && this.props.navigation.navigate(route, {car: this.car})}} last={key === (notifications.length - 1)} key={key} icon>
                    <Left>
                      {item.level === "warning" && <Icon style={{color: "#ffb157"}} name="warning" />}
                      {item.level === "danger" && <Icon style={{color: "#f13f3f"}} name="alert" />}
                      {item.level === "info" && <Icon style={{color: "#76b6ff"}} name="information-circle" />}
                    </Left>
                    <Body style={{height: null, paddingBottom: 15, paddingTop: 15}}>
                      <Text>{item.text}</Text>
                    </Body>
                  </ListItem>
                })}
            </Fragment>
          }
        </Content>

        <Footer><CarMenu navigation={this.props.navigation} car={this.car}/></Footer>

        <HeaderMenu show={this.menu} onClose={() => this.menu = false}>
          <List>
            <ListItem onPress={()=>{this.toggleEditCarModal(true)}}>
              <Text>Редактировать</Text>
            </ListItem>
            <ListItem onPress={() => {this.deleteCar()}} last={true}>
              <Text>Удалить</Text>
            </ListItem>
          </List>
        </HeaderMenu>

        {this.loading ? null : <AddOrEditCar cb={()=>{this.getCar()}} edit={true} onClose={()=>{this.toggleEditCarModal(false)}} car={this.car} show={this.edit}/>}

        <Modal animationType="slide" transparent={false} visible={this.odoModal} onRequestClose={() => {this.resetOdo(); this.odoModal = false;}}>
          <Container>
            <Header androidStatusBarColor={styles.statusBarColor} style={styles.modalHeader}>
              <Left>
                <Button title={"Назад"} onPress={() => {this.odoModal = false}} transparent>
                  <Icon name='arrow-back'/>
                </Button>
              </Left>
              <Body>
                <Title><Text style={styles.headerTitle}>Обновить показания одометра</Text></Title>
              </Body>
              <Right>
                <Button onPress={()=>{this.updateOdo()}} transparent>
                  <Icon name='checkmark'/>
                </Button>
              </Right>
            </Header>
            <Content>
              <Odo onChange={value => {this.odoValue = value}} value={this.odoValue}/>
            </Content>
          </Container>
        </Modal>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  odo: {
    padding: 15,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  odo_value: {
    marginBottom: 10
  },
  odo_button : {
    backgroundColor: "#f13f3f"
  }
});