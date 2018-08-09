import React, { Component } from 'react'
import { Keyboard} from 'react-native';
import { Footer, FooterTab, Button, Text } from 'native-base';
import styles from "../styles";

export default class FooterWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFooter: true
    }
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow () {
    this.setState({showFooter: false});
  }

  _keyboardDidHide () {
    this.setState({showFooter: true});
  }


  render () {
    let active = this.props.navigation.state.routeName;

    if(!this.state.showFooter) return null;

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