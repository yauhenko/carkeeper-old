import React, {Component} from 'react'
import {DatePickerAndroid, StyleSheet, Text, TouchableOpacity} from "react-native";
import {View} from 'native-base';
import {observer} from 'mobx-react';
import moment from "moment";


@observer
export default class InputDate extends Component {
  open = async (date) => {
    const {action, year, month, day} = await DatePickerAndroid.open({
      date: date ? moment(date).toDate() : new Date()
    });

    if (action === DatePickerAndroid.dateSetAction) {
      this.props.onChange(moment(year + '-' + (month + 1) + '-' + day, "YYYY-MM-DD"));
    }
  };

  render() {
    return (
      <View style={[styles.wrapper, this.props.last ? {borderBottomWidth: 0} : {}]}>
        <View style={styles.title}><Text>{this.props.title || ""}</Text></View>
        <TouchableOpacity style={styles.date} onPress={() => {this.open(this.props.value)}}>
          <Text>{this.props.value ? moment(this.props.value).format("DD.MM.YYYY") : "Выберите дату"}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    marginTop: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d5dae4"
  },

  title: {
    marginRight: 20,
    width: 120,
  },

  date: {
    flex: 1,
    paddingLeft: 0,
    paddingBottom: 15
  }
});