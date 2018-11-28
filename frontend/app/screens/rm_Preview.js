import React from 'react';
import { StyleSheet, Text, StatusBar} from 'react-native';
import {observer} from 'mobx-react';
import { Container, Content} from 'native-base';
import styles from "../styles";

@observer
export default class Rm_Preview extends React.Component {
  render() {
    return (
      <Container>
        <StatusBar backgroundColor={styles.statusBarColor} barStyle="light-content"/>
        <Content contentContainerStyle={customStyles.container}>
          <Text style={customStyles.logo}>Loading</Text>
        </Content>
      </Container>
    );
  }
}

const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20
  },
  logo : {
    textAlign: "center",
    fontSize: 30,
    marginBottom: 20
  }
});