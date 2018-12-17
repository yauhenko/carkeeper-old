import React, {Fragment} from 'react';
import {Text, RefreshControl, StyleSheet} from 'react-native';
import {observable} from "mobx";
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Body, Title, View, Switch} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import CarMenu from "../../components/CarMenu";
import Cars from "../../store/Cars";
import moment from "moment";
import InputDate from "../../components/Form/InputDate";

@observer
export default class Reminders extends React.Component {
  @observable car = Cars.currentCar;
  @observable loading = true;
  @observable insurance = {casco: {}, regular: {}};
  @observable checkup = {notify: false, edate: null};

  componentDidMount() {
    this.initial();
  }

  initial = async () => {
     this.checkup = (await Cars.getCheckup({car: this.car.car.id})).checkup;
     this.insurance = (await Cars.getInsurance({car: this.car.car.id})).insurance;
     this.loading = false;
  };

  checkupHandler = (bool) => {
    this.checkup.notify = bool;
    this.updateCheckup();
  };

  checkupDate = (date) => {
    this.checkup.edate = moment(date).format("YYYY-MM-DD");
    this.updateCheckup();
  };

  updateCheckup = () => {
    Cars.updateCheckup({car: this.car.car.id, checkup: this.checkup})
  };

  insuranceHandler = (type, bool) => {
    this.insurance[type].notify = bool;
    this.updateInsurance(type);
  };

  insuranceDate = (type, date) => {
    this.insurance[type].edate = moment(date).format("YYYY-MM-DD");
    this.updateInsurance(type);
  };

  updateInsurance = (type) => {
    Cars.updateInsurance({car: this.car.car.id, insurance: {type, ...this.insurance[type]}})
  };

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
          <Body style={{flexGrow: 2}}>
            <Title><Text style={styles.headerTitle}>Напоминания: {refs.mark.name} {refs.model.name}</Text></Title>
          </Body>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{}}/>} contentContainerStyle={styles.content}>

          {this.loading ? null :
            <Fragment>
              <View style={[styles.block, componentStyle.paddingReset]}>
                <View style={componentStyle.header}>
                  <Text style={componentStyle.headerText}>Напоминать о техосмотре</Text>
                  <Switch onTintColor={"#f1838b"} thumbTintColor={this.checkup.notify ? "#a23737" : "#eee"} onValueChange={(value)=>{this.checkupHandler(value)}} value={this.checkup.notify} />
                </View>
                <View style={componentStyle.content}>
                  <InputDate  last={true} onChange={value => {this.checkupDate(value)}} value={this.checkup.edate} title={"Окончание"}/>
                </View>
              </View>

              <View style={[styles.block, componentStyle.paddingReset]}>
                <View style={componentStyle.header}>
                  <Text style={componentStyle.headerText}>Напоминать о страховке</Text>
                  <Switch onTintColor={"#f1838b"} thumbTintColor={this.insurance.regular.notify ? "#a23737" : "#eee"}  onValueChange={(value)=>{this.insuranceHandler("regular", value)}} value={this.insurance.regular.notify} />
                </View>
                <View style={componentStyle.content}>
                  <InputDate last={true} onChange={value => {this.insuranceDate("regular", value)}} value={this.insurance.regular.edate} title={"Окончание"}/>
                </View>
              </View>

              <View style={[styles.block, componentStyle.paddingReset]}>
                <View style={componentStyle.header}>
                  <Text style={componentStyle.headerText}>Напоминать о КАСКО</Text>
                  <Switch onTintColor={"#f1838b"} thumbTintColor={this.insurance.casco.notify ? "#a23737" : "#eee"} onValueChange={(value)=>{this.insuranceHandler("casco", value)}} value={this.insurance.casco.notify} />
                </View>
                <View style={componentStyle.content}>
                  <InputDate last={true} onChange={value => {this.insuranceDate("casco", value)}} value={this.insurance.casco.edate} title={"Окончание"}/>
                </View>
              </View>
            </Fragment>
          }
        </Content>

        <Footer><CarMenu navigation={this.props.navigation} car={this.car}/></Footer>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    alignItems: "center"
  },
  headerText: {
    fontWeight: "bold"
  },
  content: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#d5dae4"
  },
  paddingReset: {
    paddingBottom: 0
  }
});