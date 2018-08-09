import React, { Component } from 'react'

import { Container, Header, Content, Footer, FooterTab, Button, Text } from 'native-base';
import styles from "../styles";

export default class FooterWrapper extends Component {
  render () {
    let active = this.props.navigation.state.routeName;

    return (
      <Footer>
        <FooterTab>
          <Button style={active === "Garage" ? styles.footerButtonActive : styles.footerButton} onPress={()=>this.props.navigation.navigate('Garage')} active={active === "Garage"}>
            <Text style={{color: "#fff"}}>Гараж</Text>
          </Button>
          <Button style={active === "Profile" ? styles.footerButtonActive : styles.footerButton} onPress={()=>this.props.navigation.navigate('Profile')} active={active === "Profile"}>
            <Text style={{color: "#fff"}}>Профиль</Text>
          </Button>

        </FooterTab>
      </Footer>
    )
  }
}