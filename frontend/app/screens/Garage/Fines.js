import React from 'react';
import {Text, RefreshControl, View, Modal, TouchableWithoutFeedback, Image} from 'react-native';
import {observable, action, toJS} from "mobx";
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import CarMenu from "../../components/CarMenu";
import Cars from "../../store/Cars";
import Input from "../../components/Form/Input";

@observer
export default class Fines extends React.Component {
  @observable car = this.props.navigation.state.params.car;
  @observable loading = true;
  @observable fines = [];

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
    this.fines = (await Cars.getFines({car: this.car.car.id})).fines;
    this.loading = false;
  };

  @action getPass = async () => {
    this.passport = (await Cars.getPass({car: this.car.car.id})).pass;
  };

  @action updatePass = async () => {
    await Cars.updatePass({
      car: this.car.car.id,
      pass: this.passport
    });

    this.toggleModal(false)
  };

  @action fillPass = (key, value) => {
    this.passport[key] = value.toUpperCase().trim();

  };

  @action toggleModal = (bool = false) => {
      this.modal = bool;
  };

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

          <Body style={{flexGrow: 2}}>
            <Title><Text style={styles.headerTitle}>Штрафы: {refs.mark.name} {refs.model.name}</Text></Title>
          </Body>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{this.getFines()}}/>} contentContainerStyle={styles.container}>
          {this.passport.number
            ?
            <Text style={{padding: 20, textAlign: "center"}}>Штрафы не найдены.</Text>
            :
            <View style={{padding: 20}}>
              <Text style={{textAlign: "center"}}>Для получения уведомлений и списка штрафов необходимо заполнить техпаспорт.</Text>
              <Button onPress={()=>this.toggleModal(true)}><Text>Заполнить</Text></Button>
            </View>
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
                <Input value={this.passport.firstname} onChange={value => {this.fillPass("firstname", value)}} title="Фамилия"/>
                <Input value={this.passport.middlename} onChange={value => {this.fillPass("middlename", value)}} title="Имя"/>
                <Input value={this.passport.lastname} onChange={value => {this.fillPass("lastname", value)}} title="Отчество"/>
                <Input value={this.passport.serie} onChange={value => {this.fillPass("serie", value)}} title="Серия"/>
                <Input value={this.passport.number} onChange={value => {this.fillPass("number", value)}} title="Номер"/>
              </Content>
            </Container>
          </Modal>


        </Content>

        <Footer><CarMenu navigation={this.props.navigation} car={this.car}/></Footer>
      </Container>
    );
  }
}