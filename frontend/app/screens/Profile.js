import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import {observer} from 'mobx-react';
import {ActionSheet, Container,
  Button,
  Content,
  Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
  List,
  ListItem,
  Thumbnail,
  Item, Label, Input, Form
} from 'native-base';
import styles from "../styles"
import User from "../store/User";
import Uploader from "../store/Uploader";
import Cropper from "../modules/Cropper";
import ModalMenu from "../components/ModalMenu";
import { observable, action} from 'mobx';

var BUTTONS = [
  { text: "Option 0", icon: "american-football", iconColor: "#2c8ef4" },
  { text: "Option 1", icon: "analytics", iconColor: "#f42ced" },
  { text: "Option 2", icon: "aperture", iconColor: "#ea943b" },
  { text: "Delete", icon: "trash", iconColor: "#fa213b" },
  { text: "Cancel", icon: "close", iconColor: "#25de5b" }
];

var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

@observer
export default class Profile extends React.Component {
  @observable avatarMenu = false;

  @observable name = User.profile.name;
  @observable city = User.profile.city.name;

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button onPress={this.props.navigation.openDrawer} transparent>
              <Icon name='menu'/>
            </Button>
          </Left>

          <Body>
          <Title><Text style={styles.headerTitle}>Профиль</Text></Title>
          </Body>

          <Right>
            {/*<Button transparent>*/}
              {/*<Icon name='search'/>*/}
            {/*</Button>*/}
          </Right>
        </Header>


        <Content contentContainerStyle={styles.container}>
          <View style={customStyles.top}>
            <View style={{paddingRight: 20}}>
              <TouchableOpacity onPressIn={()=>{this.avatarMenu = true}}>
                <Thumbnail style={customStyles.avatar} source={{uri: Uploader.get(User.profile.avatar)}} />
                <Icon style={customStyles.camera} name="camera"/>
              </TouchableOpacity>
            </View>

            <View>
              <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize: 20, color: "#fff"}}>{`${User.profile.name}`}</Text>
              <Text style={{color: "#fff", marginTop: 5}}>Езжу на Acura TSX 2004</Text>
            </View>
          </View>

          <Form>
            <Item style={customStyles.label} stackedLabel>
              <Label>Номер телефона</Label>
              <Input disabled={true} keyboardType="numeric" onChangeText={(text)=>{}} value={String(User.profile.tel)} />
            </Item>

            <Item style={customStyles.label} stackedLabel>
              <Label>Имя</Label>
              <Input selectionColor={styles.selectionColor} onSubmitEditing={()=>User.update({name: this.name})}  onChangeText={(text)=>{this.name = text}} value={this.name || ""} />
              <View style={{ right: 10, bottom: 15, position: "absolute"}} pointerEvents="none">
                <Icon style={customStyles.editIcon} name="create"/>
              </View>
            </Item>

            <Item style={customStyles.label} stackedLabel>
              <Label>Город</Label>
              <Input selectionColor={styles.selectionColor} onSubmitEditing={()=>User.update({city: this.city})}  onChangeText={(text)=>{this.city = text}} value={this.city || ""} />
              <View style={{ right: 10, bottom: 15, position: "absolute"}} pointerEvents="none">
                <Icon style={customStyles.editIcon} name="create"/>
              </View>
            </Item>
          </Form>

        </Content>

        {this.avatarMenu
          ?
            <ModalMenu onClose={()=>{this.avatarMenu = false}}>
              <List>
                <ListItem onPress={() => {this.avatarMenu = false; Cropper.gallery({cropperCircleOverlay: true}).then((id)=>{User.update({avatar: id})})}}>
                  <Text>Загрузить из галереи</Text>
                </ListItem>

                <ListItem onPress={() => {this.avatarMenu = false; Cropper.camera({cropperCircleOverlay: true}).then((id)=>{User.update({avatar: id})})}}>
                  <Text>Сделать снимок</Text>
                </ListItem>

                <ListItem onPress={() => {this.avatarMenu = false;}}>
                  <Text>Удалить</Text>
                </ListItem>
              </List>
            </ModalMenu>
          :
            null
        }

      </Container>
    );
  }
}


const customStyles = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 25,
    paddingTop: 5,
    backgroundColor: "#f13f3f",
    marginBottom: 30
  },

  avatar : {
    height: 100,
    width: 100,
    borderRadius: 100
  },

  editIcon : {

    fontSize: 18,
    color: "#ccc"
  },

  camera : {
    position: "absolute",
    right: -7,
    bottom: -7,
    backgroundColor: "#f13f3f",
    color:"#fff",
    padding: 10,
    fontSize: 20,
    borderRadius: 50,
  }
});