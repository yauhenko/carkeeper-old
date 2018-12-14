import React, {Fragment} from 'react';
import {Text, RefreshControl, Alert, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {action, observable, toJS} from "mobx";
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, View, ActionSheet} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import CarMenu from "../../components/CarMenu";
import Cars from "../../store/Cars";
import Input from "../../components/Form/Input";
import {number_format, plural} from "../../modules/Utils";
import Notification from "../../components/Notification";
import Select from "../../components/Form/Select";

@observer
export default class Maintenance extends React.Component {
  @observable car = Cars.currentCar;
  @observable loading = true;
  @observable modal = false;
  @observable maintenance = [];

  @observable item = {
    car: this.car.car.id,
    name: String(),
    distance: Number(),
    period: Number(),
    period_type: null
  };

  @observable tmp = {};

  componentDidMount() {
    this.getMaintenance();
  }

  @action assign = (item = {}) => {
    this.tmp = Object.assign({}, toJS(item))
  };

  @action getMaintenance = async () => {
    this.loading = true;
    this.maintenance = (await Cars.getMaintenance({car: this.car.car.id})).list;
    this.loading = false;
  };

  @action deleteMaintenance = async (id) => {
    this.loading = true;
    try {
      await Cars.deleteMaintenance({id: id});
    } catch (e) {
      Notification(e);
    }

    this.loading = false;
  };

  @action toggleModal = (bool = false) => {
    this.modal = bool;
  };

  @action addMaintenance = async () => {
    this.loading = true;
    try {
      await Cars.addMaintenance({maintenance: this.tmp});
      this.toggleModal(false);
      this.tmp = Object.assign({}, toJS(this.item));
      this.getMaintenance();
    } catch (e) {
      Notification(e)
    }
    this.loading = false;
  };

  @action updateMaintenance = async () => {
    this.loading = true;
    try {
      await Cars.updateMaintenance({id: this.tmp.id, maintenance: this.tmp});
      this.toggleModal(false);
      this.tmp = Object.assign({}, toJS(this.item));
      this.getMaintenance();
      Notification("Изменения сохранены")
    } catch (e) {
      Notification(e)
    }
    this.loading = false;
  };


  @action save = async () => {
    if(this.tmp.id) {
      this.updateMaintenance();
    } else {
      this.addMaintenance();
    }
  };

  action = item => {
    ActionSheet.show(
      {
        options: [
          {text: "Редактировать", icon: "create", iconColor: "#b9babd"},
          {text: "Удалить", icon: "trash", iconColor: "#b9babd"},
          {text: "Отмена", icon: "close", iconColor: "#b9babd"}
        ],
        cancelButtonIndex: 2
      },
      index => {

        if (index === 0) {
          this.tmp = Object.assign({}, toJS(item));
          this.toggleModal(true);
        }

        if (index === 1) {
          Alert.alert(null, 'Подтвердите удаление', [
              {
                text: 'Отмена', onPress: () => {
                }, style: 'cancel'
              },
              {
                text: 'Удалить', onPress: async () => {
                  await this.deleteMaintenance(item.id);
                  await this.getMaintenance();
                }
              }],
            {cancelable: false})
        }
      }
    )
  };

  render() {
    const {refs, car} = this.car;

    return (
      <Container style={styles.container}>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Назад"} onPress={() => {this.props.navigation.goBack()}} transparent>
              <Icon style={styles.headerIcon} name='md-arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Обслуживание: {refs.mark.name} {refs.model.name}</Text></Title>
          </Body>
          <Right>
            <Button onPress={()=>{this.assign(this.item); this.toggleModal(true)}} transparent>
              <Icon style={styles.headerIcon} name='md-add'/>
            </Button>
          </Right>
        </Header>
        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{this.getMaintenance()}}/>} contentContainerStyle={styles.content}>
            {this.maintenance.length
              ?
              <View style={styles.block}>
                {
                  this.maintenance.map((item, key) => (
                      <View key={item.id} style={[componentStyle.item, this.maintenance.length === key + 1 ? {borderBottomWidth: 0} : {}]}>
                        <TouchableOpacity style={componentStyle.itemText} onPress={()=>{this.action(item)}}>
                          <Fragment>
                            <Text style={componentStyle.name}>{item.name}</Text>
                            <Text style={styles.textNote}>
                              {item.distance ? `${number_format(item.distance, "", "", " ")} ${car.odo_unit === "m" ? "миль" : "км"}` : null}
                              {item.distance && item.period ? ` / ` : null}
                              {item.period ? `${item.period} ${item.period_type === "year" ? plural(item.period, ",год,года,лет") : plural(item.period, "месяц,,а,ев")}` : null}</Text>
                          </Fragment>
                        </TouchableOpacity>

                        <View style={{flexDirection: "row"}}>
                          <Button onPress={()=>{this.props.navigation.navigate("Journal", {maintenance: item.id})}} transparent>
                            <Icon style={{color: "#a9b3c7"}} name="md-checkmark"/>
                          </Button>
                        </View>
                      </View>
                  ))
                }
              </View>
              :
              this.loading ? null : <View style={styles.block}><Text style={componentStyle.empty}>Нет записей обслуживания</Text></View>
            }
        </Content>

        <Footer><CarMenu navigation={this.props.navigation}/></Footer>

        <Modal animationType="slide" transparent={false} visible={this.modal} onRequestClose={() => {this.toggleModal(false)}}>
          <Container style={styles.container}>
            <Header androidStatusBarColor={styles.statusBarColor} style={styles.modalHeader}>
              <Left>
                <Button title={"Назад"} onPress={() => {this.toggleModal(false)}} transparent>
                  <Icon style={styles.headerIcon} name='md-arrow-back'/>
                </Button>
              </Left>
              <Body>
              <Title><Text style={styles.headerTitle}>{this.tmp.id ? "Редактировать запись" : "Добавить запись"}</Text></Title>
              </Body>
              <Right>
                <Button onPress={()=>{this.save()}} title={"Сохранить"} transparent>
                  <Icon style={styles.headerSaveIcon} name='md-checkmark'/>
                </Button>
              </Right>
            </Header>

            <Content contentContainerStyle={styles.content}>
              <View style={styles.block}>
                <Text style={styles.blockHeading}>Основные параметры</Text>
                <Input multiline={true} onChange={(value)=>{this.tmp.name = value}} value={this.tmp.name} title="Название"/>
                <Input onChange={(value)=>{this.tmp.distance = Number(value)}} value={this.tmp.distance} keyboardType="numeric" title="Пробег"/>
                <Input onChange={(value)=>{this.tmp.period = Number(value)}} value={this.tmp.period} keyboardType="numeric" title="Период"/>
                <Select last={true} onChange={value => {this.tmp.period_type = value.id}} value={this.tmp.period_type} buttons={[
                  {id: "year", text: "Год"},
                  {id: "month", text: "Месяц"}
                ]} title={"Год/Месяц"}/>
              </View>

              {/*<View style={styles.block}>*/}
                {/*<Text style={styles.blockHeading}>Последнее проведение работы</Text>*/}
                {/*<Input keyboardType="numeric" onChange={value => {this.tmp.last_odo = value}} value={this.tmp.last_odo} title="Пробег"/>*/}
                {/*<InputDate last={true} onChange={(date)=>{this.tmp.last_date = moment(date).format("YYYY-MM-DD")}} value={this.tmp.last_date} title="Дата"/>*/}
              {/*</View>*/}
            </Content>
          </Container>
        </Modal>
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
    justifyContent: "space-between"
  },
  itemText: {
    flex: 1,
    paddingRight: 5
  },
  empty: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center"
  },
  name: {
    marginBottom: 5
  }
});