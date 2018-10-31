import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem, Thumbnail, Item, Label, Input, Form} from 'native-base';
import styles from "../styles"
import User from "../store/User";
import Uploader from "../store/Uploader";
import Cropper from "../modules/Cropper";
import ModalMenu from "../components/ModalMenu";
import {observable, action} from 'mobx';
import Cars from "../store/Cars";
import thumb from "../assets/images/avatar_thumb.png";
import {cdn} from "../modules/Url";

@observer
export default class Profile extends React.Component {
  @observable avatarMenu = false;
  @observable name = User.profile.user.name;
  @observable email = User.profile.user.email;
  @observable city = User.profile.user.city ? User.profile.refs.city.name : null;

  @action changeAvatar = async type => {
    this.avatarMenu = false;
    const image = await Cropper[type]({cropperCircleOverlay: true});
    await User.update({avatar: image.id});
    User.profile.refs.avatar = image;
  };

  render() {
    const {user, refs} = User.profile;

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
                <Thumbnail style={customStyles.avatar} source={user.avatar ? {uri: cdn+refs.avatar.path} : thumb} />
                <Icon style={customStyles.camera} name="camera"/>
              </TouchableOpacity>
            </View>

            <View>
              <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize: 20, color: "#fff"}}>{`${user.name}`}</Text>
              {Cars.cars.length
                ?
                <Text style={{color: "#fff", marginTop: 5}}>Езжу на {Cars.cars[0].mark.name} {Cars.cars[0].model.name}</Text>
                :
                <Text style={{color: "#fff", marginTop: 5, width: 180}}>Пешеход. Автомобиль не добавлен в гараж.</Text>
              }
            </View>
          </View>

          <Form>
            <Item fixedLabel>
              <Label style={customStyles.label}>Телефон:</Label>
              <Input style={customStyles.input} disabled={true} keyboardType="numeric" onChangeText={(text)=>{}} value={String(user.tel)} />
            </Item>

            <Item fixedLabel>
              <Label style={customStyles.label}>Имя:</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} onSubmitEditing={()=>User.update({name: this.name})}  onChangeText={(text)=>{this.name = text}} value={this.name || ""} />
            </Item>

            <Item fixedLabel>
              <Label style={customStyles.label}>E-mail:</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} onSubmitEditing={()=>User.update({email: this.email})}  onChangeText={(text)=>{this.city = text}} value={this.email || ""} />
            </Item>

            {/*<Item fixedLabel>*/}
              {/*<Label style={customStyles.label}>Город:</Label>*/}
              {/*<Input style={customStyles.input} selectionColor={styles.selectionColor} onSubmitEditing={()=>User.update({city: this.city})}  onChangeText={(text)=>{this.city = text}} value={this.city || ""} />*/}
            {/*</Item>*/}
          </Form>
        </Content>

        {this.avatarMenu
          ?
            <ModalMenu onClose={()=>{this.avatarMenu = false}}>
              <List>
                <ListItem onPress={() => {this.changeAvatar("gallery")}}>
                  <Text>Загрузить из галереи</Text>
                </ListItem>

                <ListItem onPress={() => {this.changeAvatar("camera")}}>
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

  label : {
    fontSize: 14,
    marginBottom: 1
  },

  avatar : {
    height: 100,
    width: 100,
    borderRadius: 100
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
  },

  input: {
    fontSize: 14
  }

});