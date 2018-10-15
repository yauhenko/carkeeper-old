import React from 'react';
import {Text, RefreshControl} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, Accordion, View} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import Cars from "../../store/Cars";
import CarMenu from "../../components/CarMenu";
import moment from "moment";


const dataArray = [
  { title: "Замена масла", content: "Lorem ipsum dolor sit amet" },
  { title: "Замена воздушного фильтра и прочей хуйни такой дилнной", content: "Lorem ipsum dolor sit amet" },
  { title: "Замена маслянного фильтра", content: "Lorem ipsum dolor sit amet" }
];

@observer
export default class Journal extends React.Component {
  renderHeader({title}, expanded) {
    return (
      <View style={{flexDirection: "row", alignItems: "center", padding: 10,  backgroundColor: "#fff", borderBottomWidth: 0.5, borderBottomColor: "#d6d7da"}}>
        <View>
          <Text style={{fontSize: 14}}>{moment().format("DD.MM.YYYY")}</Text>
        </View>
        <View style={{flex: 1, paddingLeft: 10, paddingRight: 10}}>
          <Text style={{fontSize: 14}}>{title}</Text>
        </View>
        <View style={{padding: 5}}>
          {expanded ? <Icon style={{ fontSize: 18 }} name="arrow-up" /> : <Icon style={{ fontSize: 18 }} name="arrow-down" />}
        </View>
      </View>
    );
  }

  renderContent(content) {
    return (
      <Text style={{padding: 10}}>1</Text>
    );
  }

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
          <Body>
            <Title><Text style={styles.headerTitle}>Журнал: {car.mark.name} {car.model.name}</Text></Title>
          </Body>
          <Right>
            <Button onPress={()=>{}} transparent>
              <Icon name='add'/>
            </Button>
          </Right>
        </Header>

        <Content contentContainerStyle={styles.container}>
          <Accordion renderHeader={this.renderHeader} renderContent={this.renderContent} dataArray={dataArray}/>
        </Content>

        <Footer>
          <CarMenu {...this.props}/>
        </Footer>
      </Container>
    );
  }
}