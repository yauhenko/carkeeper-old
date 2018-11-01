import React from 'react';
import {StyleSheet, Text, TouchableOpacity, RefreshControl, View, Alert} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem, Thumbnail, Item, Label, Input, Form} from 'native-base';
import styles from "../styles"
import User from "../store/User";
import Cropper from "../modules/Cropper";
import ModalMenu from "../components/ModalMenu";
import {observable, action, toJS} from 'mobx';
import Cars from "../store/Cars";
import thumb from "../assets/images/avatar_thumb.png";
import {cdn} from "../modules/Url";
import Notification from "../components/Notification";


@observer
export default class Profile extends React.Component {
  @observable avatarMenu = false;

  @observable profile = toJS(User.profile);
  @observable changed = false;
  @observable loading = false;

  @action change = (field, value) => {
    this.profile.user[field] = value || null;
    this.changed = true;
  };

  @action update = async () => {
    this.loading = true;

    try {
      await User.update(this.profile);
      User.profile = await User.info();
      Notification("Профиль обновлен");
      this.changed = false;
    } catch (e) {
      Notification(e);
    }

    this.loading = false;
  };

  @action changeAvatar = async type => {
    this.avatarMenu = false;
    this.loading = true;

    try {
      const image = await Cropper[type]({cropperCircleOverlay: true});
      this.profile.refs.avatar = image;
      this.profile.user.avatar = image.id;
      this.changed = true;
    } catch (e) {
      Notification(e)
    }

    this.loading = false;
  };

  @action refresh = async () => {
    this.loading = true;
    User.profile = await User.info();
    this.loading = false;
  };

  componentDidMount() {
    const blur = this.props.navigation.addListener('willBlur', () => {
          blur.remove();
          if(!this.changed) return;
          Alert.alert(null, 'Сохранить изменения в профиле?', [
          {text: 'Не сохранять', onPress: () => {}, style: 'cancel'},
          {text: 'Сохранить', onPress: () => {this.update()}}],
          {cancelable: false })
    });
  }

  render() {
    let {user, refs} = this.profile;

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
            {this.changed &&
            <Button onPress={this.update} title={"Сохранить"} transparent>
              <Icon name='checkmark'/>
            </Button>}
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{}}/>} contentContainerStyle={styles.container}>
          <View style={customStyles.top}>
            <View style={{paddingRight: 20}}>
              <TouchableOpacity onPressIn={()=>{this.avatarMenu = true}}>
                <Thumbnail style={customStyles.avatar} source={refs.avatar ? {uri: cdn + refs.avatar.path} : thumb} />
                <Icon style={customStyles.camera} name="camera"/>
              </TouchableOpacity>
            </View>

            <View>
              <Text ellipsizeMode='tail' numberOfLines={1} style={{fontSize: 20, color: "#fff"}}>{`${User.profile.user.name}`}</Text>
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
              <Label style={customStyles.label}>Имя:</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} onChangeText={value => {this.change("name", value)}} value={user.name || ""} />
            </Item>

            <Item fixedLabel>
              <Label style={customStyles.label}>Телефон:</Label>
              <Input style={customStyles.input} keyboardType="numeric" onChangeText={value => {this.change("tel", value)}} value={String(user.tel || "")} />
            </Item>

            <Item fixedLabel>
              <Label style={customStyles.label}>Пароль:</Label>
              <Input placeholder="Новый пароль" secureTextEntry style={customStyles.input} onChangeText={value => {this.change("password", value)}} value={String(user.password || "")} />
            </Item>

            <Item fixedLabel>
              <Label style={customStyles.label}>E-mail:</Label>
              <Input style={customStyles.input} selectionColor={styles.selectionColor} onChangeText={value => {this.change("email", value)}} value={user.email || ""} />
            </Item>
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