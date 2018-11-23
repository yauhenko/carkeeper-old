import React from 'react';
import {Text, View, RefreshControl, Alert, Dimensions, StyleSheet} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, Thumbnail, List, ListItem} from 'native-base';
import styles from "../../styles"
import {observable, action} from 'mobx';

@observer
export default class News extends React.Component {
  @observable loading = true;

  @action getNews = async () => {
    this.loading = false;
  };

  componentDidMount() {
    this.getNews();
  };

  render() {
    return (
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
            <Button onPress={() => {}} transparent>
              <Icon name='more'/>
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={() => {this.getNews()}}/>} contentContainerStyle={styles.container}>
          <View style={{padding: 20}}>
            <Text>В ленте пока пусто...</Text>
          </View>
        </Content>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({

});