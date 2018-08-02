import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem, Thumbnail} from 'native-base';
import styles from "../styles"
import Hr from "../components/Hr";
import Footer from "../components/Footer";
import Cars from "../store/Cars";


@observer
export default class Garage extends React.Component {
  componentDidMount() {
    Cars.getCars();
  }


  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button onPress={this.props.navigation.openDrawer} transparent>
              <Icon name='menu'/>
            </Button>
          </Left>

          <Body>
            <Title><Text style={styles.headerTitle}>Гараж</Text></Title>
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

        <Content contentContainerStyle={styles.container}>
          <List>
            {Cars.cars.map((car) => {
              return(
                <ListItem style={customStyles.listItem} onPress={()=>console.log('1')} thumbnail key={car.id}>
                  <Left>
                    <Thumbnail source={require('../assets/images/car_stub.png')}/>
                  </Left>
                  <Body>
                    <Text>{car.mark_name} {car.model_name}</Text>
                    <Text style={styles.textNote}>{car.year}г. {car.serie_name} {car.generation_name} {car.modification_name}</Text>
                  </Body>
                  <Right style={{paddingLeft: 10}}>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              )
            })}
          </List>

          {!Cars.cars.length && <Button style={styles.primaryButton} onPress={()=>this.props.navigation.navigate('AddCar')} block><Text style={styles.primaryButtonText}>Добавить автомобиль</Text></Button>}
        </Content>
        <Footer {...this.props}/>
      </Container>
    );
  }
}


const customStyles = StyleSheet.create({
  listItem : {

  }



});