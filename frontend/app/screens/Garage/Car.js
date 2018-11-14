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

  @action getCar = async () => {
    this.loading = true;
    try {
      this.car = await Cars.getCar(this.id);
    } catch (e) {
      Notification(e);
      this.props.navigation.navigate('Garage');
    }
    this.loading = false;
  };

  @action deleteCar = async () => {
    this.loading = true;
    try {
      this.car = await Cars.deleteCar(this.id);
      this.props.navigation.navigate('Garage')
    } catch (e) {
      Notification(e);
    }
    this.loading = false;
  };

  @action deleteImage = async (data = {}) => {
    try {
      await Cars.updateCar(data);
      this.car.car.image = null;
    } catch (e) {
      Notification(e)
    }
  };

  componentDidMount() {
    this.getCar();
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
              </View>
            </React.Fragment>
          }
        </Content>

        <Footer><CarMenu navigation={this.props.navigation} car={this.car}/></Footer>

        <HeaderMenu show={this.menu} onClose={() => this.menu = false}>
          <List>
            {/*<ListItem onPress={() => this.menu = false}>*/}
              {/*<Text>Редактировать</Text>*/}
            {/*</ListItem>*/}
            <ListItem onPress={() => {
              this.menu = false;
              Alert.alert('Удалить автомобиль', `${this.mark} ${this.model}`,
                [{text: 'Отмена', style: 'cancel'},{text: 'Удалить', onPress: () => {this.deleteCar(this.id)}}],
                {cancelable: true })
              }} last={true}>
              <Text>Удалить</Text>
            </ListItem>
          </List>
        </HeaderMenu>
      </Container>
    );
  }
}