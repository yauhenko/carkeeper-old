import React, {Fragment} from 'react';
import {Text, View, RefreshControl, StyleSheet, TouchableNativeFeedback, Modal} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, ListItem} from 'native-base';
import styles from "../../styles"
import {observable, action} from 'mobx';
import News from "../../store/News";
import ContentView from "../../components/ContentView";
import moment from "moment";

@observer
export default class List extends React.Component {
  @observable loading = true;
  @observable modal = false;
  @observable item = {};

  @action getList = async () => {
    this.loading = true;
    await News.getList();
    this.loading = false;
  };

  @action openModal = item => {
    this.item = item;
    this.modal = true;
  };

  @action closeModal = () => {
    this.modal = false;
    this.item = {};
  };

  componentDidMount() {
    this.getList();
  };

  render() {
    const {data: list = []} = News.list;

    return (
      <Fragment>
        <Container>
          <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
            <Left>
              <Button title={"Меню"} onPress={this.props.navigation.openDrawer} transparent>
                <Icon name='menu'/>
              </Button>
            </Left>
            <Body>
            <Title><Text style={styles.headerTitle}>Лента новостей</Text></Title>
            </Body>
            <Right>
              {/*<Button onPress={() => {}} transparent>*/}
              {/*<Icon name='more'/>*/}
              {/*</Button>*/}
            </Right>
          </Header>

          <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={() => {this.getList()}}/>} contentContainerStyle={styles.container}>
            {list.map((item) => {
              return (
                <View key={item.id} >
                  <View style={componentStyle.item} >
                    <Text onPress={()=>this.openModal(item)} style={componentStyle.title}>{item.title}</Text>
                    <ContentView data={item.content} screen={"main"}/>
                    <View style={componentStyle.footer}>
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={{color: "#d6d7da"}}>{moment(item.date_begin).format("DD.MM.YYYY")}</Text>
                      </View>
                      <TouchableNativeFeedback onPress={()=>this.openModal(item)}>
                        <Text style={{color: "#d6d7da"}}>Читать дальше</Text>
                      </TouchableNativeFeedback>
                    </View>
                  </View>
                </View>
              )
            })}
          </Content>
        </Container>

        <Modal animationType="slide" onShow={()=>{}}  transparent={false} visible={this.modal} onRequestClose={() => {this.closeModal()}}>
          <Container>
            <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
              <Left>
                <Button title={"Назад"} onPress={() => {this.closeModal()}} transparent>
                  <Icon name='arrow-back'/>
                </Button>
              </Left>
              <Body>
                <Title><Text style={styles.headerTitle}>Запись в ленте</Text></Title>
              </Body>
              <Right>

              </Right>
            </Header>

            <Content contentContainerStyle={styles.container}>
                  <View>
                    <View>
                      <Text style={componentStyle.title}>{this.item.title}</Text>
                      <ContentView data={this.item.content} screen={"inner"}/>
                      <View style={[componentStyle.footer, componentStyle.innerFooter]}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                          <Text style={{color: "#d6d7da"}}>{moment(this.item.date_begin).format("DD.MM.YYYY")}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
            </Content>
          </Container>
        </Modal>
      </Fragment>
    );
  }
}

const componentStyle = StyleSheet.create({
  item: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d7da",
    paddingBottom: 15
  },

  title: {
    fontSize: 16,
    padding: 17,
    fontWeight: "bold",
    lineHeight: 24
  },

  footer : {
    marginLeft: 17,
    marginRight: 17,
    justifyContent: "space-between",
    flexDirection: "row"
  },

  innerFooter: {
    borderTopWidth: 0.5,
    borderTopColor: "#d6d7da",
    paddingBottom: 17,
    paddingTop: 17
  },

  icon: {
    fontSize: 22,
    marginRight: 10,
    color: "#d6d7da"
  }
});