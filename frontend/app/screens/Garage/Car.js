import React from 'react';
import {Text, View, Picker, RefreshControl, Alert, Dimensions, TouchableOpacity, StyleSheet} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, Thumbnail, List, ListItem} from 'native-base';
import styles from "../../styles"
import {observable, action} from 'mobx';
import Cars from "../../store/Cars";
import Footer from "../../components/Footer";
import HeaderMenu from "../../components/HeaderMenu";
import CarMenu from "../../components/CarMenu";
import Notification from "../../components/Notification";

import ModalMenu from "../../components/ModalMenu";
import Cropper from "../../modules/Cropper";
import {cdn} from "../../modules/Url";

@observer
export default class Car extends React.Component {
  @observable id = this.props.navigation.state.params.id;
  @observable mark = this.props.navigation.state.params.mark;
  @observable model = this.props.navigation.state.params.model;

  @observable loading = true;
  @observable car = {};

  @observable menu = false;
  @observable cameraMenu = false;

  componentDidMount() {
    this.getCar();
  };

  getCar = async () => {
    this.loading = true;
    this.car = await Cars.getCar(this.id);
    this.loading = false;
  };

  deleteCar = async () => {
    this.loading = true;

    try {
      this.car = await Cars.deleteCar(this.id);
      this.props.navigation.navigate('Garage')
    } catch (e) {
      Notification(e);
    }

    this.loading = false;
  };

  render() {
    const {car, refs} = this.car;

    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title="Назад" onPress={() => {this.props.navigation.navigate('Garage')}} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>{this.mark} {this.model}</Text></Title>
          </Body>
          <Right>
            <Button onPress={() => {this.menu = true}} transparent>
              <Icon name='more'/>
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={() => {this.getCar()}}/>} contentContainerStyle={styles.container}>
          {this.loading
            ?
            null
            :
            <React.Fragment>
              <View style={{alignItems: "center"}}>
                <Thumbnail square style={{width: Dimensions.get('window').width, height: 200}} large source={car.image ? {uri: cdn + refs.image.path} : require('../../assets/images/car_stub_square.png')} />
                <TouchableOpacity style={customStyles.camera} onPressIn={()=>{this.cameraMenu = true}}>
                  <Icon style={{color: "#f13f3f"}} name="camera"/>
                </TouchableOpacity>
              </View>

              <List>
                <ListItem itemDivider first>
                  <Text>ПОСЛЕДНЯЯ АКТИВНОСТЬ</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена масла</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена правого ступичного подшипника</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Получен штраф на сумму 20р.</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена каленвала</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена тормозных колодок</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена масла</Text>
                </ListItem>
              </List>
            </React.Fragment>
          }
        </Content>

        <Footer><CarMenu id={this.id} {...this.props}/></Footer>


        <HeaderMenu show={this.menu} onClose={() => this.menu = false}>
          <List>
            <ListItem onPress={() => this.menu = false}>
              <Text>Редактировать</Text>
            </ListItem>
            <ListItem onPress={() => Alert.alert('Удалить автомобиль', `${this.mark} ${this.model}`,
              [
                {text: 'Отмена', onPress: () => {this.menu = false}, style: 'cancel'},
                {text: 'Удалить', onPress: () => {this.menu = false; this.deleteCar(this.id)}},
              ], {cancelable: true })} last={true}>
              <Text>Удалить</Text>
            </ListItem>
          </List>
        </HeaderMenu>

        {this.cameraMenu
          ?
          <ModalMenu onClose={()=>{this.cameraMenu = false}}>
            <List>
              {/*<ListItem onPress={() => {this.cameraMenu = false; Cropper.gallery().then((id)=>{Cars.updateCar({id: car.id, image: id}).then(response => {car.image = response.image})}).catch(console.log)}}>*/}
                {/*<Text>Загрузить из галереи</Text>*/}
              {/*</ListItem>*/}

              {/*<ListItem onPress={() => {this.cameraMenu = false; Cropper.camera().then((id)=>{Cars.updateCar({id: car.id, image: id}).then(response => {car.image = response.image})}).catch(console.log)}}>*/}
                {/*<Text>Сделать снимок</Text>*/}
              {/*</ListItem>*/}

              {/*{car.image*/}
                {/*?*/}
                {/*<ListItem onPress={() => {this.cameraMenu = false; Cars.updateCar({id: car.id, image: null}).then(()=>{car.image = null})}}>*/}
                  {/*<Text>Удалить</Text>*/}
                {/*</ListItem>*/}
                {/*:*/}
                {/*null*/}
              {/*}*/}
            </List>
          </ModalMenu>
          :
          null
        }

      </Container>
    );
  }
}

const customStyles = StyleSheet.create({
  camera : {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width:40,
    height: 40,
    borderRadius: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});