import React, { Component } from 'react'
import {StyleSheet, Text, TouchableWithoutFeedback} from "react-native";
import {View, Icon, ActionSheet} from 'native-base';
import {observer} from 'mobx-react';
import {action, observable} from 'mobx';

@observer
export default class Select extends Component {
  @action open = () => {
    if(this.props.disabled) return;

    let options = this.props.buttons.map(item => {
      item.icon = (this.props.value === item.id) ? "radio-button-on" : "radio-button-off";
      return item;
    });

    options.push({ text: "Отмена", icon: "close", iconColor: "#b9babd"});

    ActionSheet.show (
      {
        options: options,
        title: this.props.actionName,
        cancelButtonIndex: options.length - 1
      },
      selected => {
        if(selected === options.length - 1) {
          return;
        }

        if(selected !== undefined) {
          this.selected = this.props.buttons[selected];
          if(this.props.onChange) this.props.onChange(this.selected)
        }
      }
    )
  };

  @action getName = id => {
    const elem = this.props.buttons.find(elem=>{return elem.id === id});
    return elem ? elem.text : "";
  };

  render () {
    const {title} = this.props;

    return (
      <TouchableWithoutFeedback onPress={()=>{this.open()}}>
      <View style={[styles.wrapper, this.props.last ? {borderBottomWidth: 0} : {}]}>
        <View style={styles.title}><Text style={styles.titleText}>{title}</Text></View>
        <View style={styles.select}>
          <Text style={this.props.disabled ? styles.disabled : {flex: 1, color: "#a23737"}}>{this.getName(this.props.value) || "Не выбрано"}</Text>
          <Icon style={styles.icon} name="arrow-dropdown"/>
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 15,
    paddingBottom: 15,
    marginRight: 20,
    width: 120
  },

  wrapper: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d5dae4"
  },

  select: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingLeft: 0,
    paddingBottom: 15
  },

  disabled : {
    color: "#d6d7da"
  },

  titleText: {
    color: "#7f8a9d"
  },

  icon: {
    color: "#a23737",
    marginLeft: 15,
    fontSize: 16,
    width: 15
  }
});