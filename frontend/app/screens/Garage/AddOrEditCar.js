import React from 'react';
import {Text, RefreshControl, Modal, TouchableWithoutFeedback, Image, View} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem, ActionSheet} from 'native-base';
import styles from "../../styles"
import Cars from "../../store/Cars";
import { observable, toJS, action} from 'mobx';
import Notification from "../../components/Notification";
import Select from "../../components/Form/Select";
import Input from "../../components/Form/Input";
import Cropper from "../../modules/Cropper";
import {cdn} from "../../modules/Url";


@observer
export default class AddOrEditCar extends React.Component {
  @observable loading = false;
  @observable image = null;
  @observable car = this.props.car ? Object.assign({}, toJS(this.props.car.car)) : {odo_unit: "km"};

  @action close = () => {
      this.car = this.props.car ? this.props.car.car : {};
      this.props.onClose();
  };

  fill = () => {
      if(this.car.mark) this.getModels(this.car.mark);
      if(this.car.model) this.getGenerations(this.car.model);
      if(this.car.generation) this.getSeries(this.car.generation);
      if(this.car.serie) this.getModifications(this.car.serie);
  };

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
      this.close();
      this.props.cb && this.props.cb();
    } catch (e) {
      alert(1);
      Notification(e)
    }
  };

  @action updateCar = async () => {
      try {
        await Cars.updateCar({id: this.car.id, car: this.car});
        this.close();
        this.props.cb && this.props.cb();
        Notification("Изменения сохранены")
      } catch (e) {
        Notification(e)
      }
  };

  @action save = () => {
      this.props.edit ? this.updateCar() : this.addCar();
  };

  @action action = () => {
    ActionSheet.show(
      {
        options: [
          { text: "Загрузить из галереи", icon: "images", iconColor: "#b9babd"},
          { text: "Сделать снимок", icon: "camera", iconColor: "#b9babd"},
          { text: "Отмена", icon: "close", iconColor: "#b9babd" }
        ],
        cancelButtonIndex: 2
      },
      index => {
        if(index === 0) {
          this.photo("gallery")
        }

        if(index === 1) {
          this.photo("camera")
        }
      }
    )
  };


  @action photo = async type => {
    this.loading = true;

    try {
      const image = await Cropper[type]({cropperCircleOverlay: false});
      this.image = image.path;
      this.car.image = image.id;
    } catch (e) {

    }

    this.loading = false;
  };

  render() {
    return (
      <Modal animationType="slide" onShow={()=>{this.getMarks(); this.fill()}} transparent={false} visible={this.props.show} onRequestClose={()=>this.close()}>
        <Container>
          <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
            <Left>
              <Button title={"Назад"} onPress={() => {this.close()}} transparent>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
            <Title><Text style={styles.headerTitle}>Добавить автомобиль</Text></Title>
            </Body>
            <Right>
              <Button onPress={()=>{this.save()}} title={"Сохранить"} transparent>
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
                <Text>Другие параметры</Text>
              </ListItem>
            </List>

            <Input keyboardType="numeric" value={this.car.year} onChange={value => {this.changeCar("year", Number(value))}} title="Год выпуска"/>

            <Select onChange={selected => {this.changeCar("odo_unit", selected.id)}} value={this.car.odo_unit} buttons={[
              {id: "km", text: "Километры", icon: "radio-button-off"},
              {id: "m", text: "Мили", icon: "radio-button-off"}
            ]} actionName="Едиица измерения одометра" title="Км/Мили"/>

            <List style={{paddingTop: 40}}>
              <ListItem itemDivider>
                <Text>Есть фотография автомобиля?</Text>
              </ListItem>
            </List>

            {this.car.image
              ?
              <TouchableWithoutFeedback onPress={()=>{this.action()}}>
                <Image style={{width: "100%", aspectRatio: 1}} source={{uri: cdn + (this.image || this.props.car.refs.image.path)}}/>
              </TouchableWithoutFeedback>
              :
              <TouchableWithoutFeedback onPress={()=>{this.action()}}>
                <View style={{alignItems: "center",  backgroundColor: "#f4f4f4", marginTop: 5}}>
                  <Image style={{width: 100, height: 100, marginTop:50, marginBottom: 50}} source={require("../../assets/images/photo_thumb.png")}/>
                </View>
              </TouchableWithoutFeedback>
            }
          </Content>
        </Container>
      </Modal>
    );
  }
}