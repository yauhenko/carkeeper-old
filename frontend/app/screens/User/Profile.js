import React from 'react';
import {StyleSheet, Text, TouchableOpacity, RefreshControl, View, Alert} from 'react-native';
import {observer} from 'mobx-react';
import {
  Container,
  Button,
  Content,
  Icon,
  Header,
  Left,
  Right,
  Body,
  Title,
  Thumbnail,
  Form,
  ActionSheet
} from 'native-base';
import styles from "../../styles"
import User from "../../store/User";
import Cropper from "../../modules/Cropper";
import {observable, action, toJS} from 'mobx';
import Cars from "../../store/Cars";
import thumb from "../../assets/images/avatar_thumb.png";
import {cdn} from "../../modules/Url";
import Notification from "../../components/Notification";
import Input from "../../components/Form/Input";

@observer
export default class Profile extends React.Component {
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

  @action loadImage = async type => {
    this.loading = true;

    try {
      const image = await Cropper[type]({cropperCircleOverlay: true});
      this.profile.refs.avatar = image;
      this.profile.user.avatar = image.id;
      this.changed = true;
    } catch (e) {}

    this.loading = false;
  };

  @action action = () => {
    ActionSheet.show(
      {
        options: [
          { text: "Загрузить из галереи", icon: "images", iconColor: "#b9babd"},
          { text: "Сделать снимок", icon: "camera", iconColor: "#b9babd"},
          { text: "Отмена", icon: "close", iconColor: "#b9babd" }
        ],
        cancelButtonIndex: 2
      },
      index => {
        if(index === 0) this.loadImage("gallery");
        if(index === 1) this.loadImage("camera");
      }
    )
  };

  render() {
    let {user, refs} = this.profile;
    let cars = Cars.cars;

    return (
      <Container style={styles.container}>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button onPress={this.props.navigation.openDrawer} transparent>
              <Icon style={styles.headerIcon} name='md-menu'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Профиль</Text></Title>
          </Body>
          <Right>
            {this.changed &&
            <Button onPress={this.update} title={"Сохранить"} transparent>
              <Icon style={styles.headerSaveIcon} name='md-checkmark'/>
            </Button>}
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={()=>{}}/>} contentContainerStyle={styles.content}>
          <View style={styles.block}>
            <View style={componentStyle.top}>
              <TouchableOpacity onPress={() => {this.action()}}>
                <Thumbnail style={componentStyle.avatar} source={refs.avatar ? {uri: cdn + refs.avatar.path} : thumb} />
                <View style={componentStyle.camera}>
                  <Icon style={componentStyle.cameraIcon} name="camera"/>
                </View>
              </TouchableOpacity>
              <Text ellipsizeMode='tail' numberOfLines={1} style={componentStyle.name}>{`${User.profile.user.name || "Аноним"}`}</Text>
              {cars.cars.length
                ?
                <Text style={styles.textNote}>Езжу на {cars.refs.mark[cars.cars[0].mark].name} {cars.refs.model[cars.cars[0].model].name}</Text>
                :
                <Text style={styles.textNote}>Пешеход. Автомобиль не добавлен в гараж.</Text>
              }
            </View>
            <Form>
              <Input onChange={value => {this.change("name", value)}} value={user.name || ""}  title="Имя"/>
              <Input editable={!Boolean(User.profile.user.email)} keyboardType="email-address" onChange={value => {this.change("email", value)}} value={user.email || ""}  title="E-mail"/>
              <Input editable={false} keyboardType="numeric" onChange={value => {this.change("tel", value)}} value={String(user.tel || "")}  title="Телефон"/>
              <Input last={true} secureTextEntry style={componentStyle.input} onChange={value => {this.change("password", value)}} value={String(user.password || "")} title="Новый пароль"/>
            </Form>
          </View>
        </Content>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  top: {
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 25,
    paddingTop: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#d5dae4",
  },

  avatar : {
    height: 100,
    width: 100,
    borderRadius: 100/2
  },

  camera : {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#a23737",
    borderRadius: 30/2,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },

  cameraIcon: {
    fontSize: 15,
    color:"#fff",
  },

  name: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5
  }
});
