import React from 'react';
import {Text, View, Picker, RefreshControl, Alert} from 'react-native';
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

@observer
export default class Car extends React.Component {
  @observable id = this.props.navigation.state.params.id || 20;
  @observable menu = false;

  componentWillMount() {
    Cars.loading = true;
    Cars.carDetail = {};
  }

  componentDidMount() {
    Cars.getCar(this.id)
  };

  render() {
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
          <Title><Text style={styles.headerTitle}>{Cars.carDetail.mark.name} {Cars.carDetail.model.name}</Text></Title>}
          </Body>
          <Right>
            <Button onPress={() => {
              this.menu = true
            }} transparent>
              <Icon name='more'/>
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={Cars.loading} onRefresh={() => {
          Cars.getCar(this.id)
        }}/>} opacity={Cars.loading ? 0.5 : 1} contentContainerStyle={styles.container}>
          {Cars.loading
            ?
            null
            :
            <View style={{alignItems: "center", padding: 20}}>
              <Thumbnail style={{width: 200, height: 200}} large source={require('../assets/images/car_stub.png')}/>
            </View>
          }
        </Content>

        <Footer><CarMenu {...this.props}/></Footer>

        <HeaderMenu show={this.menu} onClose={() => this.menu = false}>
          <List>
            <ListItem onPress={() => this.menu = false}>
              <Text>Редактировать</Text>
            </ListItem>
            <ListItem onPress={() => Alert.alert('Удалить автомобиль', `${Cars.carDetail.mark.name} ${Cars.carDetail.model.name}`,
              [
                {text: 'Отмена', onPress: () => {this.menu = false}, style: 'cancel'},
                {text: 'Удалить', onPress: () => {this.menu = false; Cars.deleteCar(this.id).then(()=>this.props.navigation.navigate('Garage'))}},
              ], {cancelable: true })} last={true}>
              <Text>Удалить</Text>
            </ListItem>
          </List>
        </HeaderMenu>



      </Container>
    );
  }
}