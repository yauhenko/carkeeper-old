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
  _renderHeader({title}, expanded) {
    return (
      <View style={{flexDirection: "row", padding: 10, justifyContent: "space-between", alignItems: "center", backgroundColor: "#d6d7da"}}>
        <Text style={{fontSize: 14}}>{moment().format("DD.MM.YYYY")} {title}</Text>
        {expanded ? <Icon style={{ fontSize: 18 }} name="remove-circle" /> : <Icon style={{ fontSize: 18 }} name="add-circle" />}
      </View>
    );
  }

  _renderContent(content) {
    return (
      <Text style={{padding: 10, fontStyle: "italic" }}>1</Text>
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
              <Icon name='add' />
            </Button>
          </Right>
        </Header>

        <Content contentContainerStyle={styles.container}>

          <Accordion renderHeader={this._renderHeader} renderContent={this._renderContent} dataArray={dataArray}/>

        </Content>

        <Footer><CarMenu {...this.props}/></Footer>
      </Container>
    );
  }
}