import {DatePickerAndroid} from "react-native";
import moment from "moment";

export default async (date) => {
  const {action, year, month, day} = await DatePickerAndroid.open({
    date: date ? moment(date).toDate() : new Date(),
    minDate: new Date()
  });

  if(action === DatePickerAndroid.dateSetAction) {
    return moment(year + '-' + (month + 1) + '-' + day, "YYYY-MM-DD")
  }

  return false;
};