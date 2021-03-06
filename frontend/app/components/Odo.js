import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Button, Icon} from 'native-base';
import {observer} from "mobx-react";


@observer
export default class Odo extends Component {
  digits = 7;

  static propTypes = {
    value: PropTypes.number.isRequired,
    digits: PropTypes.number,
    onChange: PropTypes.func
  };

  static defaultProps = {
    digits: 7
  };

  componentWillMount() {
    this.digits = this.props.digits || 7;
    let digits = String(this.props.value);
    while(digits.length < this.digits) {
      digits = '0' + digits;
    }
    digits = digits.split('').map((n) => {
      return Number(n);
    });
    this.setState({ digits });
  }

  change(idx, value) {
    const digits = this.state.digits;
    digits[idx] += value;
    if(digits[idx] > 9)	digits[idx] = 0;
    else if(digits[idx] < 0) digits[idx] = 9;
    this.setState({ digits });
    if(this.props.onChange) this.props.onChange(Number(digits.join('')));
  }

  render() {
    return (
      <View style={componentStyle.wrapper}>
        {this.state.digits.map((n, idx) => {
          return(
            <View style={{flex: 1}} key={idx}>
              <TouchableOpacity style={componentStyle.iconButton} onPress={()=>this.change(idx, +1)}><Icon style={componentStyle.icon} name='arrow-dropup-circle'/></TouchableOpacity>
              <View style={componentStyle.numberWrapper}><Text style={componentStyle.number}>{n}</Text></View>
              <TouchableOpacity style={componentStyle.iconButton} onPress={()=>this.change(idx, -1)}><Icon style={componentStyle.icon} name='arrow-dropdown-circle'/></TouchableOpacity>
            </View>)
        })}
      </View>
    );
  }
}

const componentStyle = StyleSheet.create({
  wrapper: {
    flexDirection: "row"
  },
  number: {
    textAlign: "center",
    fontSize: 26
  },
  numberWrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#d6d7da",
    paddingTop: 5,
    paddingBottom: 5
  },
  icon: {
    color: "#d5dae4",
    fontSize: 40,
    marginTop: 10,
    marginBottom: 10
  },
  iconButton: {
    flex: 1,
    alignItems: "center"
  }
});