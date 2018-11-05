import React from 'react';
import {Text, RefreshControl, Modal, View, Dimensions, Image} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem, Thumbnail, Item, ActionSheet, Form} from 'native-base';
import styles from "../../styles"
import Cars from "../../store/Cars";
import { observable, action} from 'mobx';
import Notification from "../../components/Notification";
import Select from "../../components/Form/Select";
import Input from "../../components/Form/Input";
import ModalMenu from "../../components/ModalMenu";
import Cropper from "../../modules/Cropper";
import {cdn} from "../../modules/Url";


@observer
export default class Garage extends React.Component {
  componentDidMount() {
    this.cars();
  }

  @observable loading = false;

  @observable photoMenu = false;
  @observable photo = false;

  @observable car = {};

  @action changeCar = (key, value) => {
    this.car[key] = value;

    if(key === "mark") {
      this.car.model = null;
      this.car.generation = null;
      this.car.serie = null;
      this.car.modification = null;
    }

    if(key === "model") {
      this.car.generation = null;
      this.car.serie = null;
      this.car.modification = null;
    }

    if(key === "generation") {
      this.car.serie = null;
      this.car.modification = null;
    }

    if(key === "serie") {
      this.car.modification = null;
    }
  };


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

  @observable marksButtons = [];
  @action getMarks = async () => {
    const marks = await Cars.getMarks();
    this.marksButtons = marks.map(item => {return {id: item.id, text: item.name, icon: "radio-button-off"}});
  };

  @observable modelsButtons = [];
  @action getModels = async (id) => {
    try {
      const models = await Cars.getModels({mark: Number(id)});
      this.modelsButtons = models.map(item => {return {id: item.id, text: item.name, icon: "radio-button-off"}});
    } catch (e) {
      Notification(e)
    }
  };

  @observable generationsButtons = [];
  @action getGenerations = async (id) => {
    try {
      const generations = await Cars.getGenerations({model: Number(id)});
      this.generationsButtons = generations.map(item => {return {id: item.id, text: item.name + " (" + item.year_begin + (item.year_end ? ` - ${item.year_end}` : "") + ")", icon: "radio-button-off"}});
    } catch (e) {
      Notification(e)
    }
  };

  @observable seriesButtons = [];
  @action getSeries = async (id) => {
    try {
      const series = await Cars.getSeries({generation: Number(id)});
      this.seriesButtons = series.map(item => {return {id: item.id, text: item.name, icon: "radio-button-off"}});
    } catch (e) {
      Notification(e)
    }
  };

  @observable modificationsButtons = [];
  @action getModifications = async (id) => {
    try {
      const modifications = await Cars.getModifications({serie: Number(id)});
      this.modificationsButtons = modifications.map(item => {return {id: item.id, text: item.name, icon: "radio-button-off"}});
    } catch (e) {
      Notification(e)
    }
  };

  @action addCar = async () => {
    try {
      await Cars.addCar(this.car);
      this.toggleModal(false);
      this.car = {};
      this.photo = null;
      this.cars();
    } catch (e) {
      Notification(e)
    }
  };

  @action changePhoto = async type => {
    this.photoMenu = false;
    this.loading = true;

    try {
      const image = await Cropper[type]({cropperCircleOverlay: false});
      this.car.image = image.id;
      this.photo = image.path;
    } catch (e) {
      Notification(e)
    }

    this.loading = false;
  };

  render() {
    const {cars, refs} = Cars.cars;

    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Меню"} onPress={this.props.navigation.openDrawer} transparent>
              <Icon name='menu'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Гараж</Text></Title>
          </Body>
          <Right>
            <Button title={"Добавить"} onPress={()=>{this.toggleModal(true)}} transparent>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>this.cars()}/>} contentContainerStyle={styles.container}>
          <List>
            {cars && cars.map(car => {
              return(
                <ListItem onPress={()=>this.props.navigation.navigate('Car', {id: car.id, mark: refs.mark[car.mark].name, model: refs.model[car.model].name, })} thumbnail key={car.id}>
                  <Left>
                    {car.image ?
                      <Thumbnail source={{uri:  cdn + refs.image[car.image].path}}/>
                      :
                      <Thumbnail source={require('../../assets/images/car_stub.png')}/>
                    }
                  </Left>

                  <Body>
                    <Text>{refs.mark[car.mark].name} {refs.model[car.model].name}, {String(car.year)}г.</Text>
                    <Text style={styles.textNote}>{Boolean(car.serie) && refs.serie[car.serie].name} {Boolean(car.generation) && refs.generation[car.generation].name}</Text>
                    <Text style={styles.textNote}>{Boolean(car.modification) && refs.modification[car.modification].name}</Text>
                  </Body>

                  <Right style={{paddingLeft: 10}}>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              )
            })}
          </List>

          {!this.loading && !Cars.cars.cars.length && <Text style={{padding: 20, textAlign: "center"}}>Вы еще не добавляли автомобили в гараж.</Text>}

          <Modal animationType="slide" onShow={()=>this.getMarks()} transparent={false} visible={this.modal} onRequestClose={() => {this.toggleModal(false)}}>
            <Container>
              <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
                <Left>
                  <Button title={"Назад"} onPress={() => {this.toggleModal(false)}} transparent>
                    <Icon name='arrow-back'/>
                  </Button>
                </Left>
                <Body>
                  <Title><Text style={styles.headerTitle}>Добавить автомобиль</Text></Title>
                </Body>
                <Right>
                  <Button onPress={()=>{this.addCar()}} title={"Сохранить"} transparent>
                    <Icon name='checkmark'/>
                  </Button>
                </Right>
              </Header>

              <Content refreshControl={<RefreshControl refreshing={this.loading}/>}>
                <List>
                  <ListItem itemDivider>
                    <Text>Какой у Вас автомобиль?</Text>
                  </ListItem>
                </List>

                <Select onChange={selected=>{this.changeCar("mark", selected.id); this.getModels(selected.id)}} value={this.car.mark} buttons={this.marksButtons} actionName="Выберите марку автомобиля" title="Марка"/>
                <Select disabled={!Boolean(this.car.mark)} onChange={selected=>{this.changeCar("model", selected.id); this.getGenerations(selected.id)}} value={this.car.model} buttons={this.modelsButtons} actionName="Выберите модель автомобиля" title="Модель"/>
                <Select disabled={!Boolean(this.car.model)} onChange={selected=>{this.changeCar("generation", selected.id); this.getSeries(selected.id)}} value={this.car.generation} buttons={this.generationsButtons} actionName="Выберите поколение автомобиля" title="Поколение"/>
                <Select disabled={!Boolean(this.car.generation)} onChange={selected=>{this.changeCar("serie", selected.id); this.getModifications(selected.id)}} value={this.car.serie} buttons={this.seriesButtons} actionName="Выберите серию автомобиля" title="Серия"/>
                <Select disabled={!Boolean(this.car.serie)} onChange={selected=>{this.changeCar("modification", selected.id)}} value={this.car.modification} buttons={this.modificationsButtons} actionName="Выберите модификацию автомобиля" title="Модификация"/>

                <List style={{paddingTop: 40}}>
                  <ListItem itemDivider>
                    <Text>Когда был выпущен?</Text>
                  </ListItem>
                </List>

                <Input keyboardType="numeric" value={this.car.year} onChange={value => {this.changeCar("year", Number(value))}} title="Год выпуска"/>

                <List style={{paddingTop: 40}}>
                  <ListItem itemDivider>
                    <Text>Есть фотография автомобиля?</Text>
                  </ListItem>
                </List>

                {this.photo
                  ?
                  <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width}} source={{uri: cdn + this.photo}}/>
                  :
                  <Button block light style={{marginTop: 10, marginLeft: 12, marginRight: 12, marginBottom: 12}} disabled={this.loading} title="Добавить фотографию" onPress={()=>{this.photoMenu = true}}><Text>Добавить фотографию</Text></Button>
                }
              </Content>

              {this.photoMenu
                ?
                <ModalMenu onClose={()=>{this.photoMenu = false}}>
                  <List>
                    <ListItem onPress={() => {this.changePhoto("gallery")}}>
                      <Text>Загрузить из галереи</Text>
                    </ListItem>

                    <ListItem onPress={() => {this.changePhoto("camera")}}>
                      <Text>Сделать снимок</Text>
                    </ListItem>

                    <ListItem onPress={() => {this.photoMenu = false}}>
                      <Text>Отмена</Text>
                    </ListItem>
                  </List>
                </ModalMenu>
                :
                null
              }
            </Container>
          </Modal>
        </Content>
      </Container>
    );
  }
}