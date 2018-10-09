import React from 'react';
import {Text, RefreshControl} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import Cars from "../../store/Cars";
import CarMenu from "../../components/CarMenu";

@observer
export default class Fines extends React.Component {
  render() {
    const car = Cars.carDetail;

    return (
      <Container>

        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Назад"} onPress={() => {this.props.navigation.goBack()}} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>

          <Body style={{flexGrow: 2}}>
            <Title><Text style={styles.headerTitle}>Штрафы: {car.mark.name} {car.model.name}</Text></Title>
          </Body>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={Cars.loading} onRefresh={()=>{Cars.getCars()}}/>} opacity={Cars.loading ? 0.5 : 1} contentContainerStyle={styles.container}>
          <Text>Штрафы по скорости</Text>
        </Content>

        <Footer><CarMenu {...this.props}/></Footer>
      </Container>
    );
  }
}