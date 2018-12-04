import React from 'react';
import {Text, RefreshControl} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem, Thumbnail} from 'native-base';
import styles from "../../styles"
import Cars from "../../store/Cars";
import { observable, action} from 'mobx';
import Notification from "../../components/Notification";
import {cdn} from "../../modules/Url";
import AddOrEditCar from "./AddOrEditCar";

@observer
export default class Garage extends React.Component {
  @observable loading = true;

  @observable modal = false;
  @action toggleModal = bool => {this.modal = bool};

  @action cars = async () => {
    this.loading = true;
    try {
      Cars.cars = await Cars.getCars();
    } catch (e) {
      Notification(e)
    }
    this.loading = false;
  };

  componentWillMount() {
    if(Cars.currentCar) {
      this.props.navigation.navigate('Car', {id: Cars.currentCar});
    } else {
      this.cars();
    }
  }

  render() {
    const {cars, refs} = Cars.cars;

    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Меню"} onPress={this.props.navigation.openDrawer} transparent>
              <Icon name='menu'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Гараж</Text></Title>
          </Body>
          <Right>
            <Button title={"Добавить"} onPress={()=>{this.toggleModal(true)}} transparent>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>this.cars()}/>} contentContainerStyle={styles.container}>
          <List>
            {cars && cars.map(car => {
              return(
                <ListItem onPress={()=>{Cars.setCurrentCar(car.id); this.props.navigation.navigate('Car', {id: car.id, mark: refs.mark[car.mark].name, model: refs.model[car.model].name})}} thumbnail key={car.id}>
                  <Left>
                    {car.image ?
                      <Thumbnail source={{uri:  cdn + refs.image[car.image].path}}/>
                      :
                      <Thumbnail source={require('../../assets/images/car_stub.png')}/>
                    }
                  </Left>

                  <Body>
                    <Text>{refs.mark[car.mark].name} {refs.model[car.model].name}, {String(car.year)}г.</Text>
                    <Text style={styles.textNote}>{Boolean(car.serie) && refs.serie[car.serie].name} {Boolean(car.generation) && refs.generation[car.generation].name}</Text>
                    <Text style={styles.textNote}>{Boolean(car.modification) && refs.modification[car.modification].name}</Text>
                  </Body>

                  <Right style={{paddingLeft: 10}}>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              )
            })}
          </List>

          {!this.loading && !Cars.cars.cars.length && <Text style={{padding: 20, textAlign: "center"}}>Вы еще не добавляли автомобили в гараж.</Text>}

          <AddOrEditCar cb={this.cars} edit={false} onClose={()=>{this.toggleModal(false)}} show={this.modal}/>
        </Content>
      </Container>
    );
  }
}