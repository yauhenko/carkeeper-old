import React from 'react';
import { StyleSheet, Text, RefreshControl, DatePickerAndroid} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, View, ListItem, Switch, Separator} from 'native-base';
import styles from "../styles"
import Footer from "../components/Footer";
import Cars from "../store/Cars";
import {observable} from "mobx";
import CarMenu from "../components/CarMenu";
import moment from "moment";

@observer
export default class Reminders extends React.Component {
  @observable insurance = false;
  @observable checkup = false;

  openDatePicker = async (date) => {
    const {action, year, month, day} = await DatePickerAndroid.open({
      date: date ? moment(date).toDate() : new Date(),
      minDate: new Date()
    });
    if(action === DatePickerAndroid.dateSetAction) {return moment(year + '-' + (month + 1) + '-' + day, "YYYY-MM-DD")}
    return false;
  };

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button onPress={() => {this.props.navigation.goBack()}} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>

          <Body>
            <Title><Text style={styles.headerTitle}>Напоминания</Text></Title>
          </Body>

          <Right>
            <Button onPress={()=>this.props.navigation.navigate('AddCar')} transparent>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={Cars.loading} onRefresh={()=>{Cars.getCars()}}/>} opacity={Cars.loading ? 0.5 : 1} contentContainerStyle={styles.container}>
          {/*<ListItem>*/}
            {/*<Body>*/}
              {/*<Text>Напоминать о страховке</Text>*/}
            {/*</Body>*/}
            {/*<Right>*/}
              {/*<Switch onTintColor={"#f13f3f"} thumbTintColor={"#a23737"} onValueChange={()=>{this.insurance = !this.insurance}} value={this.insurance} />*/}
            {/*</Right>*/}
          {/*</ListItem>*/}

          {/*{this.insurance*/}
            {/*?*/}
            {/*<React.Fragment>*/}
              {/*<ListItem last>*/}
                {/*<View><Text>Дык нима тут нихуя</Text></View>*/}
              {/*</ListItem>*/}
              {/*<Separator bordered/>*/}
            {/*</React.Fragment>*/}
            {/*:*/}
            {/*null*/}
          {/*}*/}


          <ListItem>
            <Body>
            <Text>Напоминать о техосмотре</Text>
            </Body>
            <Right>
              <Switch onTintColor={"#f13f3f"} thumbTintColor={"#a23737"} onValueChange={(value)=>{Cars.checkupUpdate({car: Cars.carDetail.id, notify: value}).then(()=>{Cars.carDetail.checkup.notify = value})}} value={Boolean(Cars.carDetail.checkup.notify)} />
            </Right>
          </ListItem>

          {Cars.carDetail.checkup.notify
            ?
            <React.Fragment>
              <ListItem last onPress={()=>this.openDatePicker(Cars.carDetail.checkup.edate).then((value)=>{
                if(!value) return;
                Cars.checkupUpdate({car: Cars.carDetail.id, notify: true, edate: moment(value).format("YYYY-MM-DD")});
                Cars.carDetail.checkup.edate = value.format("YYYY-MM-DD")})}>
                <Body>
                  <Text>Дата: {Cars.carDetail.checkup.edate ? moment(Cars.carDetail.checkup.edate).format("DD.MM.YYYY") : "Выберите дату"}</Text>
                </Body>
                <Right>
                  <Icon name="create"/>
                </Right>
              </ListItem>
              <Separator bordered/>
            </React.Fragment>
            :
            null}
        </Content>

        <Footer><CarMenu {...this.props}/></Footer>
      </Container>
    );
  }
}