import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'native-base';
import {observer} from "mobx-react";


@observer
class Odo extends Component {
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
      <View style={{flexDirection: "row", padding: 20, justifyContent: "space-between"}}>
        {this.state.digits.map((n, idx) => {
          return(
            <View key={idx}>
              <Button style={componentStyle.button} onPress={()=>this.change(idx, +1)}><Text style={componentStyle.buttonText}>+</Text></Button>
              <View style={componentStyle.numberWrapper}><Text style={componentStyle.number}>{n}</Text></View>
              <Button style={componentStyle.button} onPress={()=>this.change(idx, -1)}><Text style={componentStyle.buttonText}>-</Text></Button>
            </View>)
        })}
      </View>
    );
  }
}

export default Odo;


const componentStyle = StyleSheet.create({
  button : {
    padding: 10,
    backgroundColor: "#f13f3f",
    width: "100%"
  },
  buttonText: {
    color: "#fff"
  },
  number: {
    textAlign: "center",
    fontSize: 30
  },
  numberWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    marginBottom: 20
  }
});