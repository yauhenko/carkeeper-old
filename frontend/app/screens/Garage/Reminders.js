import React from 'react';
import {Text, RefreshControl} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, View, ListItem, Switch, Separator} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import Cars from "../../store/Cars";
import CarMenu from "../../components/CarMenu";
import moment from "moment";
import DatePicker from "../../modules/DatePicker";

@observer
export default class Reminders extends React.Component {

  render() {
    const checkup = Cars.carDetail.checkup, insurance = Cars.carDetail.insurance, car = Cars.carDetail;

    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Назад"} onPress={() => {this.props.navigation.goBack()}} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Напоминания: {car.mark.name} {car.model.name}</Text></Title>
          </Body>
          <Right>
            <Button onPress={()=>{}} transparent>
              <Icon name='add'/>
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={Cars.loading} onRefresh={()=>{Cars.getCars()}}/>} opacity={Cars.loading ? 0.5 : 1} contentContainerStyle={styles.container}>
          <ListItem>
            <Body>
            <Text>Напоминать о техосмотре</Text>
            </Body>
            <Right>
              <Switch onTintColor={"#f13f3f"} thumbTintColor={"#a23737"} onValueChange={(value)=>{checkup.notify = value; Cars.checkupUpdate({car: car.id, notify: value, edate: checkup.edate ? moment(checkup.edate).format("YYYY-MM-DD") : checkup.edate})}} value={Boolean(checkup.notify)} />
            </Right>
          </ListItem>

          {checkup.notify ?
            <React.Fragment>
              <ListItem last onPress={()=>DatePicker(checkup.edate).then(value => {
                if(!value) return;
                Cars.checkupUpdate({car: car.id, notify: true, edate: moment(value).format("YYYY-MM-DD")});
                checkup.edate = value.format("YYYY-MM-DD")})}>
                  <Text>Дата: {checkup.edate ? moment(checkup.edate).format("DD.MM.YYYY") : "Выберите дату"}</Text>
              </ListItem>
              <Separator bordered/>
            </React.Fragment>
            :
            null
          }

          {insurance.map((item)=>{
              return(
                <React.Fragment key={item.id}>
                  <ListItem>
                    <Body>
                    <Text>Напоминать о страховке {item.type === "casco" && "КАСКО"}</Text>
                    </Body>
                    <Right>
                      <Switch onTintColor={"#f13f3f"} thumbTintColor={"#a23737"} onValueChange={(value)=>{item.notify = value; Cars.insuranceUpdate({id: item.id, notify: value, edate: item.edate ? moment(item.edate).format("YYYY-MM-DD") : item.edate})}} value={Boolean(item.notify)} />
                    </Right>
                  </ListItem>

                  {item.notify ?
                  <React.Fragment>
                    <ListItem last onPress={()=>DatePicker(item.edate).then((value)=>{
                      if(!value) return;
                      Cars.insuranceUpdate({id: item.id, notify: true, edate: moment(value).format("YYYY-MM-DD")});
                      item.edate = value.format("YYYY-MM-DD")})}>
                      <Text>Дата: {item.edate ? moment(item.edate).format("DD.MM.YYYY") : "Выберите дату"}</Text>
                    </ListItem>
                    <Separator bordered/>
                  </React.Fragment>
                  :
                  null}
                </React.Fragment>
              )
            })}
        </Content>

        <Footer><CarMenu {...this.props}/></Footer>
      </Container>
    );
  }
}