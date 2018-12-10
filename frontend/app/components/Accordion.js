import React from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import styles from '../styles';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';

@observer
export default class Accordion extends React.Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
  };

  @observable open = false;

  @action toggle = () => {
      this.open = !this.open;
  };

  render() {
    return (
      <View style={[styles.block, {paddingTop: 0, paddingBottom: 0}]}>
        <TouchableWithoutFeedback onPress={this.toggle}>
          <View style={componentStyle.header}>
            <Text style={componentStyle.headerText}>{this.props.heading}</Text>
            <Icon style={componentStyle.headerIcon} name={this.open ? "arrow-dropup" : "arrow-dropdown"}/>
          </View>
        </TouchableWithoutFeedback>
        {this.open
          ?
          <View style={componentStyle.content}>
            {this.props.children}
          </View>
          :
          null
        }
      </View>
    );
  }
}

const componentStyle = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  headerText: {
    fontWeight: "bold",
    flex: 1,
    marginRight: 10
  },
  headerIcon: {
    color: "#a9b3c7",
    fontSize: 16
  },
  content: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#d5dae4",
    paddingTop: 10,
    paddingBottom: 10
  }
});
