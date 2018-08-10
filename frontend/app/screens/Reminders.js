import React from 'react';
import { StyleSheet, Text, RefreshControl} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, View, ListItem, Switch, Separator} from 'native-base';
import styles from "../styles"
import Footer from "../components/Footer";
import Cars from "../store/Cars";
import {observable} from "mobx";
import CarMenu from "../components/CarMenu";

@observer
export default class Reminders extends React.Component {
  // @observable id = this.props.navigation.state.params.id;

  @observable insurance = false;

  componentDidMount() {
    // Cars.getCar(this.id)
  };

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button onPress={() => {
              this.props.navigation.goBack();
            }} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>

          <Body>
            <Title><Text style={styles.headerTitle}>Напоминания</Text></Title>
          </Body>

          <Right>
            <Button transparent>
              <Icon name='search'/>
            </Button>
            <Button onPress={()=>this.props.navigation.navigate('AddCar')} transparent>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={Cars.loading} onRefresh={()=>{Cars.getCars()}}/>} opacity={Cars.loading ? 0.5 : 1} contentContainerStyle={styles.container}>
          <ListItem>
            <Body>
              <Text>Напоминать о страховке</Text>
            </Body>
            <Right>
              <Switch onTintColor={"#f13f3f"} thumbTintColor={"#a23737"} onValueChange={()=>{this.insurance = !this.insurance}} value={this.insurance} />
            </Right>
          </ListItem>

          {this.insurance
            ?
            <React.Fragment>
              <ListItem last>
                <View><Text>Дык нима тут нихуя</Text></View>
              </ListItem>
              <Separator bordered/>
            </React.Fragment>
            :
            null
          }


          <ListItem>
            <Body>
            <Text>Напоминать о техосмотре</Text>
            </Body>
            <Right>
              <Switch onTintColor={"#f13f3f"} thumbTintColor={"#a23737"} onValueChange={(value)=>{Cars.carDetail.checkup.notify = value; console.log(value)}} value={Cars.carDetail.checkup.notify} />
            </Right>

          </ListItem>

          {Cars.carDetail.checkup.notify
            ?
            <React.Fragment>
              <ListItem style={{height: 150}} last>
                <View><Text>И тут нима нихуя</Text></View>
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