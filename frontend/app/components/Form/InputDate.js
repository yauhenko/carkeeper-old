import React, {Component} from 'react'
import {DatePickerAndroid, DatePickerIOS, StyleSheet, Text, TouchableWithoutFeedback} from "react-native";
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
      <TouchableWithoutFeedback onPress={() => {this.open(this.props.value)}}>
        <View style={[styles.wrapper, this.props.last ? {borderBottomWidth: 0} : {}]}>
          <View style={styles.title}><Text style={styles.titleText}>{this.props.title || ""}</Text></View>
          <View style={styles.date}>
            <Text>{this.props.value ? moment(this.props.value).format("DD.MM.YYYY") : "Выберите дату"}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d5dae4"
  },

  title: {
    marginRight: 20,
    width: 120,
  },

  titleText: {
    color: "#7f8a9d"
  },

  date: {
    flex: 1,
    paddingLeft: 0,
    paddingBottom: 15
  }
});