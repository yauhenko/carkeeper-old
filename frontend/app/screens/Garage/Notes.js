import React from 'react';
import {Text, RefreshControl, Clipboard, Alert, Modal} from 'react-native';
import {action, observable, toJS} from "mobx";
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, View, ListItem,  List, ActionSheet} from 'native-base';
import styles from "../../styles"
import Footer from "../../components/Footer";
import CarMenu from "../../components/CarMenu";
import Cars from "../../store/Cars";
import Input from "../../components/Form/Input";

@observer
export default class Notes extends React.Component {
  @observable car = this.props.navigation.state.params.car;
  @observable loading = true;
  @observable modal = false;
  @observable notes = [];
  
  blank = {
    car: this.car.car.id,
    name: "",
    content: ""
  };

  @observable note = {};

  componentDidMount() {
      this.getNotes();
  }

  @action fillNote = (key, value) => {
    this.note[key] = value;
  };

  @action getNotes = async () => {
    this.loading = true;
    this.notes = (await Cars.getNotes({car: this.car.car.id})).notes;
    this.loading = false;
  };

  @action saveNote = async () => {
    if(this.note.id) {
      await Cars.updateNote({id: this.note.id, note: this.note});
    } else {
      await Cars.addNote({note: this.note});
    }

    this.getNotes();
    this.toggleModal(false);
  };
  
  @action deleteNote = async (id) => {
    await Cars.deleteNotes({id});
    await this.getNotes();
  };

  @action toggleModal = (bool = false) => {
    this.modal = bool;
  };

  action = (note) => {
    ActionSheet.show(
      {
        options: [
          { text: "Редактировать", icon: "create", iconColor: "#b9babd"},
          { text: "Скопировать содержание", icon: "document", iconColor: "#b9babd"},
          { text: "Удалить", icon: "trash", iconColor: "#b9babd" },
          { text: "Отмена", icon: "close", iconColor: "#b9babd" }
        ],
        cancelButtonIndex: 3
      },
      index => {

        if(index === 0) {
            this.note = Object.assign({}, note);
            this.toggleModal(true);
        }

        if(index === 1) {
          Clipboard.setString(String(note.content));
        }

        if(index === 2) {
          Alert.alert(null, 'Подтвердите удаление', [
              {text: 'Отмена', onPress: () => {}, style: 'cancel'},
              {text: 'Удалить', onPress: () => {this.deleteNote(note.id)}}],
              {cancelable: false })
        }
      }
  )};



  render() {
    const {refs} = this.car;

    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Назад"} onPress={() => {this.props.navigation.goBack()}} transparent>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Заметки: {refs.mark.name} {refs.model.name}</Text></Title>
          </Body>
          <Right>
            <Button onPress={()=>{this.toggleModal(true); this.note = Object.assign({}, this.blank)}} transparent>
              <Icon name='add'/>
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{this.getNotes()}}/>} contentContainerStyle={styles.container}>
          <List>
            {this.notes.length
              ?
              this.notes.map((note) => (
                <ListItem onPress={() => {this.action(note)}} style={{flexDirection: "column", alignItems: "flex-start"}} key={note.id}>
                  <Text style={{marginBottom: 5}}>{note.name}</Text>
                  <Text style={styles.textNote}>{note.content}</Text>
                </ListItem>
              ))
              :
              this.loading ? null : <Text style={{padding: 20, textAlign: "center"}}>Вы еще не добавляли заметки</Text>
            }
          </List>

        </Content>

        <Footer><CarMenu navigation={this.props.navigation} car={this.car}/></Footer>


        <Modal animationType="slide" transparent={false} visible={this.modal} onRequestClose={() => {this.toggleModal(false)}}>
          <Container>
            <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
              <Left>
                <Button title={"Назад"} onPress={() => {this.toggleModal(false)}} transparent>
                  <Icon name='arrow-back'/>
                </Button>
              </Left>
              <Body>
                <Title><Text style={styles.headerTitle}>{this.note.id ? "Редактировать" : "Добавить"} заметку</Text></Title>
              </Body>
              <Right>
                <Button onPress={()=>{this.saveNote()}} title={"Сохранить"} transparent>
                  <Icon name='checkmark'/>
                </Button>
              </Right>
            </Header>

            <Content>
              <View style={{paddingTop: 10}}>
                <Input value={this.note.name} onChange={(value)=>{this.fillNote("name", value)}} title="Заголовок"/>
                <Input value={this.note.content} onChange={(value)=>{this.fillNote("content", value)}} multiline={true} title="Текст заметки"/>
              </View>
            </Content>
          </Container>
        </Modal>

      </Container>
    );
  }
}