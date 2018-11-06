import React from 'react';
import {Text, RefreshControl, Modal} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, Accordion, View, Form, Card, CardItem} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import Cars from "../../store/Cars";
import CarMenu from "../../components/CarMenu";
import moment from "moment";
import {observable, action, toJS} from 'mobx';
import Notification from "../../components/Notification";
import Select from "../../components/Form/Select";
import Input from "../../components/Form/Input";
import InputDate from "../../components/Form/InputDate";

@observer
export default class Journal extends React.Component {
  @observable car = this.props.navigation.state.params.car;
  @observable modal = false;
  @observable types = [];
  @observable loading = true;

  initialRecord = {
    id: this.car.car.id,
    record : {
      car: this.car.car.id,
      date: moment().format("YYYY-MM-DD"),
      type: null,
      comment: null
    }
  };

  @observable record = {
    id: this.car.car.id,
    record : {
      car: this.car.car.id,
      date: moment().format("YYYY-MM-DD"),
      type: null,
      comment: null
    }
  };

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
      this.record = Object.assign({}, this.initialRecord);
    } catch (e) {
      Notification(e)
    }
    this.loading = false;
  };

  @action changeRecord = (key, value) => {
    this.record.record[key] = value;
  };

  @action getTypes = async () => {
    let tmp = await Cars.getJournalTypes();
    this.types = tmp.types.map((item) => {return {id: item.id, text: item.name, icon: "radio-button-off"}});
  };

  componentDidMount() {
     this.getJournal();
  }

  renderHeader = ({date, type}, expanded) =>  {
    return (
      <View style={{flexDirection: "row", alignItems: "center", paddingLeft: 10,  backgroundColor: "#fff", borderBottomWidth: expanded ? 0 : 0.5, borderBottomColor: "#d6d7da"}}>
        <View>
          <Text style={{fontSize: 14}}>{moment(date).format("DD.MM.YYYY")}</Text>
        </View>
        <View style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
          <Text style={{fontSize: 14}}>{this.journal.refs.type[type].name}</Text>
        </View>
        <View>
          <Button style={{padding: 10}} transparent={true}>
            <Icon style={{fontSize: 18, color: "#d6d7da"}} name="more" />
          </Button>
        </View>
      </View>
    );
  };

  renderContent({comment}) {
    return (
      <View style={{borderBottomWidth: 0.5, borderBottomColor: "#d6d7da"}}>
        {comment
          ?
          <Text style={{padding: 10, fontStyle: "italic"}}>Комментарий: {comment}</Text>
          :
          null
        }
      </View>
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
              <Button transparent>
                <Icon name='options'/>
              </Button>
              <Button onPress={()=>{this.toggleModal(true)}} transparent>
                <Icon name='add'/>
              </Button>
            </Right>
          </Header>

          <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={() => {this.getJournal()}}/>} contentContainerStyle={styles.container}>
            {records && records.length
              ?
              <Accordion renderHeader={this.renderHeader} renderContent={this.renderContent} dataArray={records}/>
              :
              <Text>Вы еще не добавляли записи в журнал.</Text>
            }
          </Content>

          <Footer>
            <CarMenu {...this.props}/>
          </Footer>
        </Container>


        <Modal onShow={()=>this.getTypes()} animationType="slide" transparent={false} visible={this.modal} onRequestClose={() => {this.toggleModal(false)}}>
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
                <Select value={record.type} onChange={(data)=>{this.changeRecord("type", data.id)}} buttons={this.types} title={"Тип записи"}/>
                <InputDate onChange={(value)=>{this.changeRecord("date", moment(value).format("YYYY-MM-DD"))}} value={record.date} title={"Дата"}/>
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