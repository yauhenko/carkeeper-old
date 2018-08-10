import React, { Component } from 'react'
import { Keyboard} from 'react-native';
import { Footer, FooterTab, Button, Text, Badge, Icon } from 'native-base';
import styles from "../styles";

export default class FooterWrapper extends Component {
  constructor() {
    super();

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
    return (
      <Footer>
        <FooterTab>
          {this.props.children}
        </FooterTab>
      </Footer>
    )
  }
}