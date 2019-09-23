import React from 'react';
import {Text, RefreshControl, View, TouchableWithoutFeedback, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title} from 'native-base';
import styles from "../../styles"
import Cars from "../../store/Cars";
import { observable, action} from 'mobx';
import Notification from "../../components/Notification";
import {cdn} from "../../modules/Url";
import AddOrEditCar from "./AddOrEditCar";
// import GarageAutoCard from "../../components/GarageAutoCard";

@observer
export default class Garage extends React.Component {
  @observable loading = true;

  @observable modal = false;
  @action toggleModal = bool => {this.modal = bool};

  @action cars = async () => {
    this.loading = true;
    try {
      Cars.cars = await Cars.getCars();
    } catch (e) {
      Notification(e)
    }
    this.loading = false;
  };

  @action selectCar = async id => {
    if(this.loading) return;
    this.loading = true;
    try {
      const car = await Cars.getCar(id);
      Cars.setCurrentCar(car);
      this.props.navigation.navigate('Car')
    } catch (e) {
      Notification(e);
    }

    this.loading = false;
  };

  componentWillMount() {
      this.cars();
  }

  render() {
    const {cars, refs} = Cars.cars;

    return (
      <Container style={styles.container}>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Меню"} onPress={this.props.navigation.openDrawer} transparent>
              <Icon style={styles.headerIcon} name='md-menu'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Гараж</Text></Title>
          </Body>
          <Right>
            <Button title={"Добавить"} onPress={()=>{this.toggleModal(true)}} transparent>
              <Icon style={styles.headerIcon} name='md-add'/>
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>this.cars()}/>} contentContainerStyle={styles.content}>
          <View style={componentStyle.list}>
            {cars && cars.map(car => {
              return(
                <View style={componentStyle.item} key={car.id}>
                  <TouchableWithoutFeedback onPress={()=>{this.selectCar(car.id)}}>
                    <View style={styles.block}>
                      <Text style={componentStyle.header}>{refs.mark[car.mark].name} {refs.model[car.model].name}, {String(car.year)}г.</Text>

                      {car.image
                        ?
                        <Image style={componentStyle.image} source={{uri:  cdn + refs.image[car.image].path}}/>
                        :
                        <View style={componentStyle.thumbWrapper}>
                          <Image style={componentStyle.thumb} source={require('../../assets/images/car_stub.png')}/>
                        </View>
                      }

                      {Boolean(car.serie) && <Text style={Boolean(car.serie) ? componentStyle.description : {}}>
                        {Boolean(car.serie) && refs.serie[car.serie].name} {Boolean(car.generation) && refs.generation[car.generation].name} {Boolean(car.modification) && refs.modification[car.modification].name}
                      </Text>}

                      {car.notifications
                        ?
                        <View style={componentStyle.notificationWrapper}>
                          <View style={componentStyle.notificationValueWrapper}>
                            <Text style={componentStyle.notificationValue}>{car.notifications}</Text>
                          </View>
                          <View style={componentStyle.triangle}/>
                          <Icon style={componentStyle.notificationIcon} name="notifications"/>
                        </View>
                        :
                        null}
                    </View>
                  </TouchableWithoutFeedback>
                </View>)
            })}
          </View>

          {!this.loading && !Cars.cars.cars.length && <View style={styles.block}>
            <Text style={{textAlign: "center", padding: 10}}>Вы еще не добавили автомобиль в гараж</Text>
            <Button style={[styles.primaryButton, {alignSelf: "center", marginBottom: 10, marginTop: 10}]} onPress={()=>{this.toggleModal(true)}}><Text style={styles.primaryButtonText}>ДОБАВИТЬ АВТОМОБИЛЬ</Text></Button>
          </View>}

          {/*{(!this.loading || Boolean(Cars.cars.cars.length)) && <GarageAutoCard navigation={this.props.navigation}/>}*/}

          <AddOrEditCar cb={this.cars} edit={false} onClose={()=>{this.toggleModal(false)}} show={this.modal}/>
        </Content>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
  },
  item: {
    width: "100%"
  },
  header: {
    fontWeight: "bold"
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 5,
    marginTop: 10
  },
  thumbWrapper: {
    backgroundColor: "#eaeef7",
    height: 120,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  thumb: {
    width: 74,
    height: 34
  },
  description: {
    color: "#7f8a9d",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10
  },
  notificationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10
  },
  notificationValue: {
    color: "#fff",
    fontWeight: "bold"
  },
  notificationValueWrapper: {
    backgroundColor: "#a23737",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 7,
    paddingRight: 7,
    borderRadius: 5,
    overflow: "visible"
  },
  notificationIcon: {
    color: "#7f8a9d",
    fontSize: 20,
    marginLeft: 5
  },
  triangle: {
    left: -1,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 4,
    borderBottomWidth: 6,
    borderLeftWidth: 4,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#a23737',
    borderLeftColor: 'transparent',
    transform: [
      {rotate: '90deg'}
    ]
  }
});
