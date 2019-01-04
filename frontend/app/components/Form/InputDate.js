import React, {Component} from 'react'
import {DatePickerAndroid, DatePickerIOS, StyleSheet, Text, TouchableWithoutFeedback, Platform, Modal} from "react-native";
import {Body, Button, Container, Content, Header, Icon, Left, Right, Title, View} from 'native-base';
import {observer} from 'mobx-react';
import moment from "moment";
import styles from "../../styles";


@observer
export default class InputDate extends Component {

  constructor() {
    super()
    this.state = {
      modalVisible: false,
      chosenDate:  null
    }
  }

  componentWillMount() {
    this.setState({chosenDate : moment(this.props.value).toDate() || new Date()})
  }

  closeModal = () => {
    this.setState({chosenDate: moment(this.props.value).toDate() || new Date(), modalVisible: false})
  }

  selectIosDate = () => {
    let {chosenDate} = this.state
    this.setState({modalVisible: false})
    this.props.onChange(moment(chosenDate).format("YYYY-MM-DD"));

  }

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
        Platform.OS === 'android' ?
      <TouchableWithoutFeedback onPress={() => {this.open(this.props.value)}}>
        <View style={[componentStyles.wrapper, this.props.last ? {borderBottomWidth: 0} : {}]}>
          <View style={componentStyles.title}><Text style={componentStyles.titleText}>{this.props.title || ""}</Text></View>
          <View style={componentStyles.date}>
            <Text>{this.props.value ? moment(this.props.value).format("DD.MM.YYYY") : "Выберите дату"}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
          :
          <View>
          <TouchableWithoutFeedback onPress={() => {this.setState({modalVisible: true})}} >
            <View style={[componentStyles.wrapper, this.props.last ? {borderBottomWidth: 0} : {}]}>
              <View style={componentStyles.title}><Text style={componentStyles.titleText}>{this.props.title || ""}</Text></View>
              <View style={componentStyles.date}>
                <Text>{this.props.value ? moment(this.props.value).format("DD.MM.YYYY") : "Выберите дату"}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
            <Modal
              animationType="slide"
              visible={this.state.modalVisible}
              onRequestClose={()=> this.setState({modalVisible: false})}
            >
              <Container>
                <Header  androidStatusBarColor={styles.statusBarColor} style={styles.header}>
                  <Left>
                    <Button title={"Назад"} onPress={this.closeModal} transparent>
                      <Icon style={styles.headerIcon} name='md-arrow-back'/>
                    </Button>
                  </Left>
                  <Body>
                  <Title><Text style={styles.headerTitle}>Выберите дату</Text></Title>
                  </Body>
                  <Right>
                    <Button title={"Сохранить"} onPress={this.selectIosDate} transparent>
                      <Icon style={styles.headerSaveIcon} name='md-checkmark'/>
                    </Button>
                  </Right>
                </Header>
              <Content contentContainerStyle={styles.content} >
                <View>
                <DatePickerIOS
                  mode='date'
                  date={this.state.chosenDate}
                  onDateChange={(date) => this.setState({chosenDate: date})}
                />
                </View>
              </Content>
              </Container>
            </Modal>
          </View>

    )
  }
}

const componentStyles = StyleSheet.create({
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