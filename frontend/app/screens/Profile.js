import React from 'react';
import { StyleSheet, Text, RefreshControl } from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem, Thumbnail} from 'native-base';
import styles from "../styles"
import Footer from "../components/Footer";
import Cars from "../store/Cars";

@observer
export default class Profile extends React.Component {
  componentDidMount() {

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
          <Title><Text style={styles.headerTitle}>Профиль</Text></Title>
          </Body>

          <Right>
            {/*<Button transparent>*/}
              {/*<Icon name='search'/>*/}
            {/*</Button>*/}
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={Cars.loading} onRefresh={()=>{Cars.getCars()}}/>} opacity={Cars.loading ? 0.5 : 1} contentContainerStyle={styles.container}>
          <List>

          </List>

        </Content>
        <Footer {...this.props}/>
      </Container>
    );
  }
}