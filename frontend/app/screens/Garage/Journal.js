import React, {Fragment} from 'react';
import {Text, RefreshControl, Modal, Alert, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, View, ActionSheet} from 'native-base';
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
import Photo from "../../components/Form/Photo";
import {cdn} from "../../modules/Url";
import {number_format} from "../../modules/Utils";
import PhotoModal from "../../components/PhotoModal";


@observer
export default class Journal extends React.Component {
  @observable car = Cars.currentCar;
  @observable modal = false;
  @observable maintenance = [];
  @observable loading = true;
  @observable update = false;

  @observable maintenanceId = this.props.navigation.state.params && this.props.navigation.state.params.maintenance  ? this.props.navigation.state.params.maintenance : null;

  @observable photo = {
    modal: false,
    url: null
  };

  initialRecord = {
    id: this.car.car.id,
    record : {
      car: this.car.car.id,
      date: moment().format("YYYY-MM-DD"),
      maintenance: null,
      comment: null,
      image: null
    }
  };

  @observable record = {
    id: this.car.car.id,
    record : {
      car: this.car.car.id,
      date: moment().format("YYYY-MM-DD"),
      maintenance: null,
      comment: null,
      image: null
    }
  };

  @observable journal = {
    records: [],
    refs: {}
  };

  @action toggleModal = bool => {
      if(!bool) {this.update = false}
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

  @action deleteRecord = async (id) => {
    this.loading = true;
    await Cars.journalDelete({id: id});
    await this.getJournal();
    this.loading = false;
  };

  @action updateRecord = async () => {
    this.loading = true;

    try {
      await Cars.journalUpdate({
        id: this.record.record.id,
        record: this.record.record
      });


      this.modal = false;
      this.update = false;

      await this.getJournal();

      this.loading = false;
    } catch (e) {
      Notification(e);
    }

    this.loading = false;
  };

  @action changeRecord = (key, value) => {
    this.record.record[key] = value;
  };

  @action getMaintenance = async () => {
    let tmp = await Cars.getMaintenance({car: this.car.car.id});
    tmp.list.push({id: null, name: "????????????"});
    this.maintenance = tmp.list.map((item) => {return {id: item.id, text: item.name, icon: "radio-button-off"}});
  };

  action = record => {
    ActionSheet.show(
      {
        options: [
          { text: "??????????????????????????", icon: "create", iconColor: "#b9babd" },
          { text: "??????????????", icon: "trash", iconColor: "#b9babd" },
          { text: "????????????", icon: "close", iconColor: "#b9babd" }
        ],
        cancelButtonIndex: 2
      },
      index => {
        if(index === 0) {
          this.record.record = toJS(record);
          this.modal = true;
          this.update = true;
        }

        if(index === 1) {
          Alert.alert(null, '?????????????????????? ????????????????', [
              {text: '????????????', onPress: () => {}, style: 'cancel'},
              {text: '??????????????', onPress: () => {this.deleteRecord(record.id)}}],
              {cancelable: false })
        }
      }
  )};

  @action openCurrentMaintenance = id => {
    this.record = Object.assign({}, this.initialRecord);
    this.record.record.maintenance = id;
    this.record.record.odo = this.car.car.odo;
    this.modal = true;
    this.props.navigation.state.params.maintenance = null;
  };

  componentDidMount() {
     this.getJournal();
     if(this.maintenanceId) {this.openCurrentMaintenance(this.maintenanceId)}
  }

  render() {
    const {refs : carRefs, car} = this.car;
    const {records} = this.journal;
    const record = this.record.record;

    return (
      <Fragment>
        <Container style={styles.container}>
          <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
            <Left>
              <Button title={"??????????"} onPress={() => {this.props.navigation.goBack()}} transparent>
                <Icon style={styles.headerIcon} name='md-arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title><Text style={styles.headerTitle}>????????????: {carRefs.mark.name} {carRefs.model.name}</Text></Title>
            </Body>
            <Right>
              <Button onPress={()=>{this.record = Object.assign({}, this.initialRecord); this.toggleModal(true)}} transparent>
                <Icon style={styles.headerIcon} name='md-add'/>
              </Button>
            </Right>
          </Header>

          <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>this.getJournal()}/>} contentContainerStyle={styles.content}>
              {records && records.length
                ?
                <View style={styles.block}>
                  {records.map((record, id) => {
                    return (
                      <TouchableOpacity onPress={()=>{this.action(record)}} key={id}>
                        <View style={[componentStyle.item, records.length === id + 1 ? {borderBottomWidth: 0} : {}]}>
                          <View style={componentStyle.itemLeft}>
                            <Text>{moment(record.date).format("DD.MM.YYYY")}</Text>
                            {record.odo ? <Text style={[styles.textNote, {marginTop: 5}]}>{number_format(record.odo, 0, "", " ")} {car.odo_unit === "m" ? "????????" : "????"}</Text> : null}
                          </View>
                          <View style={componentStyle.itemBody}>
                            {record.title
                              ?
                              <Text>{record.title}</Text>
                              :
                              <Text>{record.maintenance && this.journal.refs.maintenance[record.maintenance].name}</Text>
                            }
                            {record.comment ? <Text style={[styles.textNote, {marginTop: 5}]}>{record.comment}</Text> : null}
                          </View>

                          {record.image
                            ?
                            <TouchableOpacity onPress={()=>{this.photo = {modal: true, url: cdn + this.journal.refs.image[record.image].path}}}>
                              <Image style={componentStyle.image} source={{uri: cdn + this.journal.refs.image[record.image].path}}/>
                            </TouchableOpacity>
                            :
                            null}
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
                :
                this.loading ? null : <View style={styles.block}><Text style={componentStyle.empty}>???? ?????? ???? ?????????????????? ???????????? ?? ????????????</Text></View>
              }
          </Content>
          <Footer><CarMenu navigation={this.props.navigation}/></Footer>
        </Container>

        <PhotoModal animationType="none" image={this.photo.url} onRequestClose={()=>{this.photo.modal = false}} visible={this.photo.modal}/>

        <Modal onShow={()=>this.getMaintenance()} animationType="slide" transparent={false} visible={this.modal} onRequestClose={() => {this.toggleModal(false)}}>
          <Container style={styles.container}>
            <Header androidStatusBarColor={styles.statusBarColor} style={styles.modalHeader}>
              <Left>
                <Button title={"??????????"} onPress={() => {this.toggleModal(false)}} transparent>
                  <Icon style={styles.headerIcon} name='md-arrow-back'/>
                </Button>
              </Left>
              <Body>
                <Title><Text style={styles.headerTitle}>{this.update ? "???????????????????????????? ????????????" : "????????????: ???????????????????? ????????????"}</Text></Title>
              </Body>
              <Right>
                <Button onPress={()=>{this.update ? this.updateRecord() : this.addRecord(this.record)}} transparent>
                  <Icon style={styles.headerSaveIcon} name='md-checkmark'/>
                </Button>
              </Right>
            </Header>
            <Content contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={this.loading} />}>
              <View style={styles.block}>
                <Select value={record.maintenance} onChange={(data)=>{this.changeRecord("maintenance", data.id)}} buttons={this.maintenance} title={"?????? ????????????"}/>
                {!record.maintenance ?
                  <Input value={record.title} onChange={value => this.changeRecord("title", value)} title={"????????????????"}/>
                : null}
                <InputDate onChange={(value)=>{this.changeRecord("date", moment(value).format("YYYY-MM-DD"))}} value={record.date} title={"????????"}/>
                <Input value={record.odo} onChange={(value)=>{this.changeRecord("odo", Number(value))}} keyboardType={"numeric"} title="????????????"/>
                <Input value={record.comment} onChange={(value)=>{this.changeRecord("comment", value)}} multiline={true} title={"??????????????????????"}/>
                <Photo onDelete={()=>{this.changeRecord("image", null)}} path={record.image ? ((this.journal.refs.image && this.journal.refs.image[record.image]) ? this.journal.refs.image[record.image].path : null) : null} onChange={(image) => {this.changeRecord("image", image.id)}} title={"??????????????????????"} />
              </View>
            </Content>
          </Container>
        </Modal>
      </Fragment>
    );
  }
}

const componentStyle = StyleSheet.create({
  item: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#d5dae4",
    paddingTop: 10,
    paddingBottom: 10
  },
  itemLeft: {
    width: 85
  },
  itemBody: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginTop: 5
  },
  empty: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center"
  }
});
