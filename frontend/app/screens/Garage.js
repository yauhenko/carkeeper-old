import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title} from 'native-base';
import styles from "../styles"
import Hr from "../components/Hr";
import Footer from "../components/Footer";


@observer
export default class Garage extends React.Component {
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
          <Text>Мои автомобили</Text>
          <Hr/>
          <Text>Машина 1</Text>
          <Hr/>
          <Text>Машина 2</Text>
          <Hr/>
          <Button style={styles.primaryButton} onPress={()=>this.props.navigation.navigate('AddCar')} block><Text style={styles.primaryButtonText}>Добавить автомобиль</Text></Button>
        </Content>


        <Footer {...this.props}/>
      </Container>
    );
  }
}