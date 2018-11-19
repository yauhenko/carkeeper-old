import React, {Fragment} from 'react';
import {Text, RefreshControl, View, Modal, Clipboard, Alert} from 'react-native';
import {observable, action, toJS} from "mobx";
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
  @observable car = this.props.navigation.state.params.car;
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
      { text: "Скопировать номер", icon: "document", iconColor: "#b9babd"},
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
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Назад"} onPress={() => {this.props.navigation.goBack()}} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>

          <Body>
            <Title><Text style={styles.headerTitle}>Штрафы: {refs.mark.name} {refs.model.name}</Text></Title>
          </Body>

          <Right>
            <Button title={"Опции"} onPress={()=>{this.menu = true}} transparent>
              <Icon name='more' />
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{this.getFines()}}/>} contentContainerStyle={styles.container}>

          {this.passportLoaded && !this.passport.serie
            ?
            <View style={{padding: 20, borderBottomColor: "#b9babd", borderBottomWidth: 0.5}}>
              <Text style={{textAlign: "center"}}>Для получения уведомлений и списка штрафов необходимо заполнить техпаспорт.</Text>

              <Text style={{textDecorationLine: "underline",
                textAlign: "center",
                marginTop: 10,
                padding: 5,
                color: "#f13f3f"}} onPress={()=>this.toggleModal(true)}>Заполнить</Text>
            </View>
            :
            null
          }

          {this.fines.length
            ?
            <List>
              {this.fines.map(({id, cdate, regid, amount, status}) => (
                  <ListItem onPress={()=>this.action(id, regid, status)} key={id}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <View style={{width: 55, paddingLeft: 5}}>
                        <Icon style={status === 0 ? {color: "#f13f3f"} : {color: "green"}} name={status === 0 ? "alert" : "checkmark-circle"}/>
                      </View>
                      <View style={{flex: 1}}>
                        <Text>Дата: {moment(cdate).format("DD.MM.YYYY")}</Text>
                        <Text>Номер: {regid}</Text>
                      </View>
                      {amount ?
                        <View style={{alignItems: "center"}}>
                          <Text>Сумма</Text>
                          <Text style={{fontWeight: "bold"}}>{amount.toFixed(2)} руб.</Text>
                        </View> : null}
                    </View>
                  </ListItem>
              ))}
            </List>
            :
            this.loading ? null : <Text style={{padding: 20, textAlign: "center"}}>Штрафы не найдены.</Text>
          }

          <Modal animationType="slide" transparent={false} visible={this.modal} onRequestClose={() => {this.toggleModal(false)}}>
            <Container>
              <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
                <Left>
                  <Button title={"Назад"} onPress={() => {this.toggleModal(false)}} transparent>
                    <Icon name='arrow-back'/>
                  </Button>
                </Left>
                <Body>
                <Title><Text style={styles.headerTitle}>Техпаспорт {refs.mark.name} {refs.model.name}</Text></Title>
                </Body>
                <Right>
                  <Button onPress={()=>{this.updatePass()}} title={"Сохранить"} transparent>
                    <Icon name='checkmark'/>
                  </Button>
                </Right>
              </Header>

              <Content>
                <View style={{paddingTop: 10}}>
                  <Input value={this.passport.firstname} onChange={value => {this.fillPass("firstname", value)}} title="Фамилия"/>
                  <Input value={this.passport.middlename} onChange={value => {this.fillPass("middlename", value)}} title="Имя"/>
                  <Input value={this.passport.lastname} onChange={value => {this.fillPass("lastname", value)}} title="Отчество"/>
                  <Input value={this.passport.serie} onChange={value => {this.fillPass("serie", value)}} title="Серия"/>
                  <Input value={this.passport.number} onChange={value => {this.fillPass("number", value)}} title="Номер"/>
                </View>
              </Content>
            </Container>
          </Modal>
        </Content>

        <Footer><CarMenu navigation={this.props.navigation} car={this.car}/></Footer>

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