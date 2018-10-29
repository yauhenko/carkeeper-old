import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem, Thumbnail, Item, Label, Input, Form} from 'native-base';
import styles from "../styles"
import User from "../store/User";
import Uploader from "../store/Uploader";
import Cropper from "../modules/Cropper";
import ModalMenu from "../components/ModalMenu";
import {observable} from 'mobx';
import Cars from "../store/Cars";
import thumb from "../assets/images/avatar_thumb.png";

@observer
export default class Profile extends React.Component {
  @observable avatarMenu = false;
  @observable name = User.profile.name;
  @observable city = User.profile.city ? User.profile.city.name : null;

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
            <Button transparent>
              <Icon name="more"/>
            </Button>
          </Right>
        </Header>

        <Content contentContainerStyle={styles.container}>
          <View style={customStyles.top}>
            <View style={{paddingRight: 20}}>
              <TouchableOpacity onPressIn={()=>{this.avatarMenu = true}}>
                <Thumbnail style={customStyles.avatar} source={User.profile.avatar ? {uri: Uploader.get(User.profile.avatar)} : thumb} />
                <Icon style={customStyles.camera} name="camera"/>
              </TouchableOpacity>
            </View>

            <View>
              <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize: 20, color: "#fff"}}>{`${User.profile.name}`}</Text>
              {Cars.cars.length
                ?
                <Text style={{color: "#fff", marginTop: 5}}>Езжу на {Cars.cars[0].mark.name} {Cars.cars[0].model.name}</Text>
                :
                <Text style={{color: "#fff", marginTop: 5, width: 180}}>Пешеход. Автомобиль не добавлен в гараж.</Text>
              }
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

                <ListItem onPress={() => {this.avatarMenu = false}}>
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