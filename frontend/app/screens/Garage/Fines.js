import React from 'react';
import {Text, RefreshControl, View, Modal, Clipboard, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {observable, action} from "mobx";
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
  List,
  ListItem,
  ActionSheet
} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import CarMenu from "../../components/CarMenu";
import Cars from "../../store/Cars";
import Input from "../../components/Form/Input";
import HeaderMenu from "../../components/HeaderMenu";
import moment from "moment";

@observer
export default class Fines extends React.Component {
  @observable car = Cars.currentCar;
  @observable loading = true;
  @observable fines = [];
  @observable menu = false;
  @observable passportLoaded = false;

  @observable passport = {
    firstname: "",
    middlename: "",
    lastname: "",
    serie: "",
    number: ""
  };

  @observable modal = false;

  componentDidMount = async () => {
    this.getFines();
    this.getPass();
  };

  @action getFines = async () => {
    this.loading = true;
    const response = await Cars.getFines({car: this.car.car.id});
    this.fines = [...response.fines];
    this.loading = false;
  };

  @action getPass = async () => {
    this.passport = (await Cars.getPass({car: this.car.car.id})).pass;
    this.passportLoaded = true;
  };

  @action updatePass = async () => {
    await Cars.updatePass({
      car: this.car.car.id,
      pass: this.passport
    });

    this.toggleModal(false)
  };

  @action fillPass = (key, value) => {
    this.passport[key] = value.trim();
  };

  @action toggleModal = (bool = false) => {
      this.modal = bool;
  };

  action = (id, regid, status) => {
    let options = [];

    if(status === 0) {
      options.push({ text: "Отметить как оплаченный", icon: "checkmark", hidden: true, iconColor: "#b9babd"})
    }

    options = [...options, ...[
      { text: "Скопировать номер", icon: "copy", iconColor: "#b9babd"},
      { text: "Удалить", icon: "trash", iconColor: "#b9babd" },
      { text: "Отмена", icon: "close", iconColor: "#b9babd" }
    ]];

    ActionSheet.show(
      {
        options: options,
        cancelButtonIndex: 3
      },
      index => {
        if(status === 1) {
          index = index + 1
        }

        if(index === 0) {
            Cars.payFines({id: id}).then(this.getFines)
        }

        if(index === 1) {
          Clipboard.setString(String(regid));
        }

        if(index === 2) {
          Alert.alert(null, 'Подтвердите удаление', [
              {text: 'Отмена', onPress: () => {}, style: 'cancel'},
              {text: 'Удалить', onPress: () => {Cars.deleteFines({id: id}).then(this.getFines)}}],
            {cancelable: false })
        }
      }
    )};

  render() {
    const {refs} = this.car;

    return (
      <Container style={styles.container}>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Назад"} onPress={() => {this.props.navigation.goBack()}} transparent>
              <Icon style={styles.headerIcon} name='md-arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Штрафы: {refs.mark.name} {refs.model.name}</Text></Title>
          </Body>
          <Right>
            <Button title={"Опции"} onPress={()=>{this.menu = true}} transparent>
              <Icon style={styles.headerIcon} name='md-more' />
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{this.getFines()}}/>} contentContainerStyle={styles.content}>

          {this.passportLoaded && !this.passport.serie
            ?
            <View style={[styles.block]}>
              <Text style={componentStyle.empty}>Для получения уведомлений о штрафах необходимо заполнить данные техпаспорта</Text>
              <Button style={[styles.grayButton, {alignSelf: "center", marginTop: 10, marginBottom: 10}]} onPress={()=>this.toggleModal(true)}><Text style={styles.grayButtonText}>ЗАПОЛНИТЬ</Text></Button>
            </View>
            :
            null
          }

          {this.fines.length
            ?
            <View style={styles.block}>
              {this.fines.map(({id, cdate, regid, amount, status}, key) => (
                  <TouchableOpacity onPress={()=>this.action(id, regid, status)} key={id}>
                    <View style={[componentStyle.item, this.fines.length === key + 1 ? {borderBottomWidth: 0} : {}]}>
                      <View style={{width: 50, paddingLeft: 10}}>
                        <Icon style={[status === 0 ? {color: "#a23737"} : {color: "green"}, {fontSize: 22}]} name={status === 0 ? "alert" : "checkmark-circle"}/>
                      </View>

                      <View style={{flex: 1}}>
                        <Text style={{marginBottom: 5}}>Дата: {moment(cdate).format("DD.MM.YYYY")}</Text>
                        <Text style={styles.textNote}>Постановление: {regid}</Text>
                      </View>
                      {Boolean(amount) && <Text>{amount.toFixed(2)} руб.</Text>}
                    </View>
                  </TouchableOpacity>
              ))}
            </View>
            :
            this.loading ? null : <View style={styles.block}><Text style={componentStyle.empty}>Штрафы не найдены</Text></View>
          }

          <Modal animationType="slide" transparent={false} visible={this.modal} onRequestClose={() => {this.toggleModal(false)}}>
            <Container style={styles.container}>
              <Header androidStatusBarColor={styles.statusBarColor} style={styles.modalHeader}>
                <Left>
                  <Button title={"Назад"} onPress={() => {this.toggleModal(false)}} transparent>
                    <Icon style={styles.headerIcon} name='md-arrow-back'/>
                  </Button>
                </Left>
                <Body>
                <Title><Text style={styles.headerTitle}>Техпаспорт {refs.mark.name} {refs.model.name}</Text></Title>
                </Body>
                <Right>
                  <Button onPress={()=>{this.updatePass()}} title={"Сохранить"} transparent>
                    <Icon style={styles.headerSaveIcon} name='md-checkmark'/>
                  </Button>
                </Right>
              </Header>

              <Content contentContainerStyle={styles.content}>
                <View style={styles.block}>
                  <Text style={styles.blockHeading}>Данные техпаспорта</Text>
                  <Input value={this.passport.firstname} onChange={value => {this.fillPass("firstname", value)}} title="Фамилия"/>
                  <Input value={this.passport.middlename} onChange={value => {this.fillPass("middlename", value)}} title="Имя"/>
                  <Input value={this.passport.lastname} onChange={value => {this.fillPass("lastname", value)}} title="Отчество"/>
                  <Input value={this.passport.serie} onChange={value => {this.fillPass("serie", value)}} title="Серия"/>
                  <Input last={true} value={this.passport.number} onChange={value => {this.fillPass("number", value)}} title="Номер"/>
                </View>
              </Content>
            </Container>
          </Modal>
        </Content>

        <Footer><CarMenu navigation={this.props.navigation}/></Footer>

        <HeaderMenu show={this.menu} onClose={() => this.menu = false}>
          <List>
            <ListItem onPress={() => {this.menu = false; this.toggleModal(true)}}>
              <Text>Редактировать паспорт</Text>
            </ListItem>
          </List>
        </HeaderMenu>
      </Container>
    );
  }
}


const componentStyle = StyleSheet.create({
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#d5dae4",
    flexDirection: "row",
    alignItems: "center"
  },
  empty: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 21
  },
  name: {
    marginBottom: 5
  }
});
