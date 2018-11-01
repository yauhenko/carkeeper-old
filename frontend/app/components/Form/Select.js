import React, { Component } from 'react'
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {View, Icon, ActionSheet} from 'native-base';
import {observer} from 'mobx-react';
import {action, observable} from 'mobx';

@observer
export default class Select extends Component {
  @action open = () => {
    if(this.props.disabled) return;

    ActionSheet.show(
      {options: this.props.buttons, title: this.props.actionName},
      selected => {
        if(selected !== undefined) {
          this.selected = this.props.buttons[selected];
          if(this.props.onChange) this.props.onChange(this.selected)
        }
      }
    )
  };

  @action getName = (id) => {
    const elem = this.props.buttons.find((elem)=>{return elem.id === id});
    return elem ? elem.text : "";
  };

  render () {
    const {title} = this.props;

    return (
      <View style={styles.wrapper}>
        <View style={styles.title}><Text>{title}</Text></View>
        <TouchableOpacity style={styles.select} onPress={()=>{this.open()}}>
          <Text style={this.props.disabled ? styles.disabled : {}}>{this.props.value ? this.getName(this.props.value) : "Не выбрано"}</Text>
          <Icon style={styles.icon} name="arrow-dropdown"/>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 15,
    paddingLeft: 17,
    paddingBottom: 15,
    marginRight: 20,
    width: 120
  },

  wrapper: {
    display: "flex",
    flexDirection: "row",
  },

  select: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingLeft: 12,
    paddingBottom: 15,
    flexGrow: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    flexDirection: "row"
  },

  disabled : {
    color: "#ccc"
  },

  icon: {
    color: "#ccc",
    marginRight: 12,
    marginLeft: 15,
    fontSize: 16
  }
});