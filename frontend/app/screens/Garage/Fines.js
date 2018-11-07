import React from 'react';
import {Text, RefreshControl} from 'react-native';
import {observable} from "mobx";
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import CarMenu from "../../components/CarMenu";

@observer
export default class Fines extends React.Component {
  @observable car = this.props.navigation.state.params.car;
  @observable loading = false;

  componentDidMount() {
    console.log(this.car);
  }

  render() {
    return (
      <Container>

        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Назад"} onPress={() => {this.props.navigation.goBack()}} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>

          <Body style={{flexGrow: 2}}>
            <Title><Text style={styles.headerTitle}>Штрафы: {this.car.refs.mark.name} {this.car.refs.model.name}</Text></Title>
          </Body>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{}}/>} contentContainerStyle={styles.container}>
          <Text style={{padding: 20, textAlign: "center"}}>Штрафы не найдены.</Text>
        </Content>

        <Footer><CarMenu navigation={this.props.navigation} car={this.car}/></Footer>
      </Container>
    );
  }
}