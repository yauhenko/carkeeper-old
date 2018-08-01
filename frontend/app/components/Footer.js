import React, { Component } from 'react'

import { Container, Header, Content, Footer, FooterTab, Button, Text } from 'native-base';
import styles from "../styles";

export default class FooterWrapper extends Component {
  render () {
    return (
      <Footer>
        <FooterTab>
          <Button style={styles.footerButton} onPress={()=>this.props.navigation.navigate('Garage')} active={this.props.navigation.state.routeName === "Garage"}>
            <Text>Гараж</Text>
          </Button>
          <Button style={styles.footerButton} onPress={()=>this.props.navigation.navigate('Home')}>
            <Text>Запчасти</Text>
          </Button>
          <Button style={styles.footerButton} onPress={()=>this.props.navigation.navigate('Home')}>
            <Text>Шлюхи</Text>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
}