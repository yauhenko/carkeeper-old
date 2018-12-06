import React, {Fragment} from 'react';
import {Text, RefreshControl, StyleSheet} from 'react-native';
import {observable} from "mobx";
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, View, ListItem, Switch} from 'native-base';
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
    console.log(type, bool)
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
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Назад"} onPress={() => {this.props.navigation.goBack()}} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body style={{flexGrow: 2}}>
            <Title><Text style={styles.headerTitle}>Напоминания: {refs.mark.name} {refs.model.name}</Text></Title>
          </Body>
          {/*<Right>*/}
            {/*<Button onPress={()=>{}} transparent>*/}
              {/*<Icon name='add'/>*/}
            {/*</Button>*/}
          {/*</Right>*/}
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{}}/>} contentContainerStyle={styles.content}>
          {this.loading ? null :
            <Fragment>
              <ListItem style={componentStyle.header} itemDivider>
                <Body>
                <Text>Напоминать о техосмотре</Text>
                </Body>
                <Right>
                  <Switch onTintColor={"#f1838b"} thumbTintColor={this.checkup.notify ? "#a23737" : "#eee"} onValueChange={(value)=>{this.checkupHandler(value)}} value={this.checkup.notify} />
                </Right>
              </ListItem>

              {this.checkup.notify ?
                <View style={componentStyle.content}>
                  <InputDate onChange={(value)=>{this.checkupDate(value)}} value={this.checkup.edate} title={"Окончание"}/>
                </View>
              : null}

              <ListItem style={componentStyle.header} itemDivider>
                <Body>
                <Text>Напоминать о страховке</Text>
                </Body>
                <Right>
                  <Switch onTintColor={"#f1838b"} thumbTintColor={this.insurance.regular.notify ? "#a23737" : "#eee"}  onValueChange={(value)=>{this.insuranceHandler("regular", value)}} value={this.insurance.regular.notify} />
                </Right>
              </ListItem>

              {this.insurance.regular.notify ?
                <View style={componentStyle.content}>
                  <InputDate onChange={(value)=>{this.insuranceDate("regular", value)}} value={this.insurance.regular.edate} title={"Окончание"}/>
                </View>
                :
                null}

              <ListItem style={componentStyle.header} itemDivider>
                <Body>
                <Text>Напоминать о КАСКО</Text>
                </Body>
                <Right>
                  <Switch onTintColor={"#f1838b"} thumbTintColor={this.insurance.casco.notify ? "#a23737" : "#eee"} onValueChange={(value)=>{this.insuranceHandler("casco", value)}} value={this.insurance.casco.notify} />
                </Right>
              </ListItem>

              {this.insurance.casco.notify ?
                <View style={componentStyle.content}>
                  <InputDate onChange={(value)=>{this.insuranceDate("casco", value)}} value={this.insurance.casco.edate} title={"Окончание"}/>
                </View>
                :
                null}
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
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da"
  },
  content: {
    paddingBottom: 20,
    paddingTop: 10
  }
});