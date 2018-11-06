import React, {Component} from 'react'
import {DatePickerAndroid, StyleSheet, Text, TouchableOpacity} from "react-native";
import {View, Icon, ActionSheet} from 'native-base';
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
      <View style={styles.wrapper}>
        <View style={styles.title}><Text>{this.props.title || ""}</Text></View>
        <TouchableOpacity style={styles.date} onPress={() => {
          this.open(this.props.value)
        }}>
          <Text>{moment(this.props.value).format("DD.MM.YYYY")}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },

  title: {
    paddingLeft: 17,
    marginRight: 20,
    width: 120,
  },

  date: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 12,
    paddingBottom: 12,
    paddingTop: 12,
    borderBottomWidth: .5,
    borderBottomColor: "#ccc"
  },
});