import React from 'react';
import {Text, View, Picker, RefreshControl, Alert, Dimensions} from 'react-native';
import {observer} from 'mobx-react';
import {
  Container,
  Button,
  Content,
  Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
  Thumbnail,
  List, ListItem
} from 'native-base';
import styles from "../styles"
import {observable, action} from 'mobx';
import Cars from "../store/Cars";
import Footer from "../components/Footer";
import HeaderMenu from "../components/HeaderMenu";
import CarMenu from "../components/CarMenu";
import Uploader from "../store/Uploader";

@observer
export default class Car extends React.Component {
  @observable id = this.props.navigation.state.params.id;
  @observable menu = false;

  componentWillMount() {
    Cars.loading = true;
    Cars.carDetail = {};
  }

  componentDidMount() {
    Cars.getCar(this.id)
  };

  render() {
    const car = Cars.carDetail;

    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button onPress={() => {
              this.props.navigation.navigate('Garage')
            }} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
          {!Cars.loading &&
          <Title><Text style={styles.headerTitle}>{car.mark.name} {car.model.name}</Text></Title>}
          </Body>
          <Right>
            <Button onPress={() => {this.menu = true}} transparent>
              <Icon name='more'/>
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={Cars.loading} onRefresh={() => {Cars.getCar(this.id)}}/>} opacity={Cars.loading ? 0.5 : 1} contentContainerStyle={styles.container}>
          {Cars.loading
            ?
            null
            :
            <React.Fragment>
              <View style={{alignItems: "center"}}>
                <Thumbnail square style={{width: Dimensions.get('window').width, height: 200}} large source={car.image ? {uri: Uploader.get(car.image)} : require('../assets/images/car_stub_square.png')} />
              </View>

              <List>
                <ListItem itemDivider first>
                  <Text>ПОСЛЕДНЯЯ АКТИВНОСТЬ</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена масла</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена правого ступичного подшипника</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Получен штраф на сумму 20р.</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена каленвала</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена тормозных колодок</Text>
                </ListItem>
                <ListItem>
                  <Text>08.16.1550 - Замена масла</Text>
                </ListItem>
              </List>
            </React.Fragment>
          }
        </Content>

        <Footer><CarMenu id={this.id} {...this.props}/></Footer>

        {Cars.loading
          ? null
          : <HeaderMenu show={this.menu} onClose={() => this.menu = false}>
              <List>
                <ListItem onPress={() => this.menu = false}>
                  <Text>Редактировать</Text>
                </ListItem>
                <ListItem onPress={() => Alert.alert('Удалить автомобиль', `${car.mark.name} ${car.model.name}`,
                  [
                    {text: 'Отмена', onPress: () => {this.menu = false}, style: 'cancel'},
                    {text: 'Удалить', onPress: () => {this.menu = false; Cars.deleteCar(this.id).then(()=>this.props.navigation.navigate('Garage'))}},
                  ], {cancelable: true })} last={true}>
                  <Text>Удалить</Text>
                </ListItem>
              </List>
            </HeaderMenu>
        }
      </Container>
    );
  }
}