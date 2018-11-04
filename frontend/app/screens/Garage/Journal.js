import React from 'react';
import {Text, RefreshControl, Modal} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, Accordion, View, Form, Label, Item, Picker} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import Cars from "../../store/Cars";
import CarMenu from "../../components/CarMenu";
import moment from "moment";
import {observable, action, toJS} from 'mobx';
import Notification from "../../components/Notification";
import Select from "../../components/Form/Select";
import Input from "../../components/Form/Input";

const dataArray = [
  { title: "Замена масла", content: "Lorem ipsum dolor sit amet" },
  { title: "Замена воздушного фильтра и прочей хуйни такой дилнной", content: "Lorem ipsum dolor sit amet" },
  { title: "Замена маслянного фильтра", content: "Lorem ipsum dolor sit amet" }
];

@observer
export default class Journal extends React.Component {
  @observable car = this.props.navigation.state.params.car;

  @observable modal = false;

  @observable loading = true;

  initialRecord = {
    id: this.car.car.id,
    record : {
      car: this.car.car.id,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      type: null,
      comment: null
    }
  };

  @observable record = {...this.initialRecord};


  @observable journal = {
    records: [],
    refs: {}
  };

  @action toggleModal = bool => {
      this.modal = bool;
  };

  @action getJournal = async () => {
      this.loading = true;

      try {
        this.journal = await Cars.getJournal(this.car.car.id);
      } catch (e) {
        Notification(e)
      }

      this.loading = false;
  };

  @action addRecord = async (obj) => {
    this.loading = true;
    try {
      await Cars.journalAdd(obj);
      this.journal = await Cars.getJournal(this.car.car.id);
      this.toggleModal(false);
      this.record = this.initialRecord;
    } catch (e) {
      Notification(e)
    }
    this.loading = false;
  };

  @action changeRecord = (key, value) => {
    this.record.record[key] = value;
  };

  componentDidMount() {
     this.getJournal();
  }

  renderHeader({date, type}, expanded) {
    return (
      <View style={{flexDirection: "row", alignItems: "center", padding: 10,  backgroundColor: "#fff", borderBottomWidth: 0.5, borderBottomColor: "#d6d7da"}}>
        <View>
          <Text style={{fontSize: 14}}>{moment(date).format("DD.MM.YYYY HH:mm")}</Text>
        </View>
        <View style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
          <Text style={{fontSize: 14}}>{type}</Text>
        </View>
        <View style={{padding: 5}}>
          {expanded ? <Icon style={{ fontSize: 18 }} name="arrow-up" /> : <Icon style={{ fontSize: 18 }} name="arrow-down" />}
        </View>
      </View>
    );
  }

  renderContent({comment}) {

    return (
      <Text style={{padding: 10}}>{comment}</Text>
    );
  }

  render() {
    const {car, refs : carRefs} = this.car;
    const {records, refs : recordsRefs} = this.journal;
    const record = this.record.record;

    return (
      <React.Fragment>
        <Container>
          <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
            <Left>
              <Button title={"Назад"} onPress={() => {this.props.navigation.goBack()}} transparent>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title><Text style={styles.headerTitle}>Журнал: {carRefs.mark.name} {carRefs.model.name}</Text></Title>
            </Body>
            <Right>
              <Button onPress={()=>{this.toggleModal(true)}} transparent>
                <Icon name='options'/>
              </Button>
              <Button onPress={()=>{this.toggleModal(true)}} transparent>
                <Icon name='add'/>
              </Button>
            </Right>
          </Header>

          <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={() => {this.getJournal()}}/>} contentContainerStyle={styles.container}>
            <Accordion renderHeader={this.renderHeader} renderContent={this.renderContent} dataArray={records}/>
          </Content>

          <Footer>
            <CarMenu {...this.props}/>
          </Footer>
        </Container>


        <Modal animationType="slide" transparent={false} visible={this.modal} onRequestClose={() => {this.toggleModal(false)}}>
          <Container>
            <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
              <Left>
                <Button title={"Назад"} onPress={() => {this.toggleModal(false)}} transparent>
                  <Icon name='arrow-back'/>
                </Button>
              </Left>
              <Body>
                <Title><Text style={styles.headerTitle}>Добавить запись в журнал</Text></Title>
              </Body>
              <Right>
                <Button onPress={()=>{this.addRecord(this.record)}} transparent>
                  <Icon name='checkmark'/>
                </Button>
              </Right>
            </Header>

            <Content refreshControl={<RefreshControl refreshing={this.loading} />}>
              <Form>
                <Select value={record.type} onChange={(data)=>{this.changeRecord("type", data.id)}} buttons={[{id: "other", text: "Другое", icon: "radio-button-off"}]} title={"Тип записи"}/>
                <Input value={record.odo} onChange={(value)=>{this.changeRecord("odo", Number(value))}} keyboardType={"numeric"} title={"Показания одометра"}/>
                <Input value={record.comment} onChange={(value)=>{this.changeRecord("comment", value)}} multiline={true} title={"Комментарий"}/>
              </Form>
            </Content>

          </Container>
        </Modal>
      </React.Fragment>
    );
  }
}