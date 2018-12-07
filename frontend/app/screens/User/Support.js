import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, View} from 'native-base';
import styles from "../../styles";
import Select from "../../components/Form/Select";
import Input from "../../components/Form/Input";
import User from "../../store/User";
import Notification from "../../components/Notification";

@observer
export default class Support extends React.Component {
  @observable loading = false;

  @observable subject = "Ошибка в приложении";
  @observable message = "";

  @action send = async () => {
    try {
      await User.feedback({
        subject : this.subject,
        message : this.message,
      });
      this.clear();
      Notification("Сообщение отправлено");
      this.props.navigation.goBack();
    } catch (e) {
      Notification(e);
    }
  };

  @action clear = () => {
      this.message = "";
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button onPress={this.props.navigation.openDrawer} transparent>
              <Icon style={styles.headerIcon} name='menu'/>
            </Button>
          </Left>

          <Body>
            <Title><Text style={styles.headerTitle}>Обратная связь</Text></Title>
          </Body>

          <Right>
            <Button onPress={()=>{this.send()}} title={"Отправить"} transparent>
              <Icon style={styles.headerSaveIcon} name='checkmark'/>
            </Button>
          </Right>
        </Header>

        <Content contentContainerStyle={styles.content}>
            <View style={styles.block}>
              <Select onChange={value => {this.subject = value.id}} value={this.subject} buttons={[
                {id: "Ошибка в приложении", text: "Ошибка в приложении"},
                {id: "Предложить улучшение", text: "Предложить улучшение"},
                {id: "Сотрудничество", text: "Сотрудничество"},
                {id: "Прочее", text: "Прочее"}
              ]} title={"Тема"}/>
              <Input placeholder="Введите сообщение" last={true} onChange={value => {this.message = value}} value={this.message} multiline={true} title={"Сообщение"}/>
            </View>
        </Content>
      </Container>
    );
  }
}