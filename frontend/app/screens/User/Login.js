import React, {Fragment} from 'react';
import {AsyncStorage, StyleSheet, Text, StatusBar, Animated, Image, View, Dimensions, TextInput, RefreshControl, Vibration} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content} from 'native-base';
import User from "../../store/User";
import { observable, action} from 'mobx';
import Logo from "../../assets/images/logo.png";
import Notification from "../../components/Notification";
import background from "../../assets/images/login_background.jpg";
import back from "../../assets/images/back.png";
import TouchableItem from "react-navigation/src/views/TouchableItem";

@observer
export default class Login extends React.Component {
  @observable tel = "";
  @observable password = "";
  @observable code = "";
  @observable geo = {};
  @observable exists = null;

  @observable loading = false;
  @observable disabled = false;

  @observable left = new Animated.Value(0);

  @action change = (type, value) => {this[type] = value};

  @action login = async () => {
    this.loading = true;
    this.disabled = true;

    try {
      const response  = await User.login({tel: this.tel, password: this.password || " "});
      User.token = response.token;
      await AsyncStorage.setItem('token', response.token);
      User.profile = await User.info();
      User.auth = true;
      await AsyncStorage.multiSet([["tel", String(this.tel)],["password", String(this.password)]]);
    } catch (e) {
      Vibration.vibrate(300);
      Notification(e);
    }

    this.disabled = false;
    this.loading = false
  };

  @action register = async () => {
    this.loading = true;
    this.disabled = true;

    try {
      const response = await User.register({code: this.code, user: {tel: this.tel, password: this.password}, ttl: 3600 * 24 * 7, noip: true, fcm: User.fcm})
      User.token = response.token;
      await AsyncStorage.setItem('token', response.token);
      User.profile = await User.info();
      User.auth = true;
      await AsyncStorage.multiSet([["tel", String(this.tel)],["password", String(this.password)]]);
    } catch (e) {
      Notification(e)
    }

    this.disabled = false;
    this.loading = false
  };

  @action checkPhoneNumber = async () => {
    this.disabled = true;
    this.loading = true;

    try {
      const response = await User.login({tel: this.tel});
      this.slide();

      setTimeout(() => {
        this.exists = ("exists" in response) ? response.exists : null;
        this.slide("0");
      }, 600);

      if (response.exists === false) {
        await User.tel({tel: this.tel});
      }
    } catch (e) {
      Notification(e)
    }

    this.disabled = false;
    this.loading = false;
  };

  @action fillPhoneCode = async () => {
    if(this.tel) return;

    try {
      this.geo = await User.getGeo();
      this.tel = "+" + this.geo.tel;
    } catch (e) {
      Notification(e);
    }
  };

  @action back = () => {
    this.slide();
    setTimeout(() => {
      this.exists = null;
      this.slide("0");
    }, 600)
  };

  @action checkCode = async () => {
    try {
      await User.verify({tel: this.tel, code: this.code});
      this.slide();
      setTimeout(() => {this.exists = "password"; this.slide("0")}, 600)
    } catch (e) {
      Vibration.vibrate(300);
      Notification(e)
    }
  };

  @action sendSMS = async (silent = false) => {
    this.disabled = true;

    try {
      await User.tel({tel: this.tel});
      if(!silent) Notification("Вам отправлено СМС c кодом")
    } catch (e) {
      Notification(e)
    }

    this.disabled = false;
  };

  @action showRestore = () => {
    this.sendSMS(true);
    this.slide();

    setTimeout(() => {
      this.exists = "restore";
      this.slide("0");
    }, 600)
  };

  @action restore = async () => {
    this.disabled = true;
    this.loading = true;

    try {
      const response = await User.recoverySMS({tel: this.tel, code: this.code});
      User.token = response.token;
      await AsyncStorage.setItem('token', response.token);
      User.profile = await User.info();
      User.auth = true;
      await AsyncStorage.multiSet([["tel", String(this.tel)]]);
    } catch (e) {
      Notification(e);
      Vibration.vibrate(300);
    }

    this.disabled = false;
    this.loading = false;
  };

  slide = (value) => {
    Animated.spring(this.left, {toValue: value ? Number(value) : (Dimensions.get("window").width + 100)}, {}).start();
  };

  async componentDidMount() {
    AsyncStorage.multiGet(["tel", "password"], (err, data) => {
      if(data) {this.tel = data[0][1] || this.tel; this.password = data[1][1] || this.password}
      this.fillPhoneCode();
    });
  }

  render() {
    return (
      <Container>
        <StatusBar backgroundColor="#000" translucent={true} barStyle="light-content"/>

        <Content refreshControl={<RefreshControl enabled={false} refreshing={this.loading}/>} contentContainerStyle={componentStyle.container}>
          <View style={[StyleSheet.absoluteFill, {alignItems: "center", paddingTop: StatusBar.currentHeight}]}>
            <Image style={{height: Dimensions.get("window").height - StatusBar.currentHeight, width: Dimensions.get("window").width}} source={background}/>
          </View>

          <View style={[StyleSheet.absoluteFill, {backgroundColor: "rgba(0,0,0,0.7)"}]}/>

          <View style={componentStyle.logoContainer}>
            <Image style={componentStyle.logo} source={Logo}/>
            <Text style={componentStyle.slogan}>Мобильный органайзер водителя</Text>
          </View>

          {
            this.exists === null
              ?
              <Animated.View style={{left: this.left}}>
                <Text style={componentStyle.label}>Введите Ваш номер телефона</Text>
                <TextInput placeholder="Номер телефона" onChangeText={text => {this.change('tel', text)}} underlineColorAndroid="transparent" autoCorrect={false} selectionColor="#a23737" keyboardType="phone-pad" value={this.tel} style={componentStyle.input}/>
                <Button disabled={this.disabled} onPress={()=>{this.checkPhoneNumber()}} style={componentStyle.button} block>
                  <Text style={componentStyle.buttonText}>ДАЛЕЕ</Text>
                </Button>
              </Animated.View>
              : null
          }

          {this.exists !== null ?
            <Animated.View style={{left: this.left}}>
              <View style={componentStyle.backContainer}>
                <TouchableItem style={componentStyle.backTouchable} onPress={()=>{this.back()}}>
                  <Fragment>
                    <Image style={componentStyle.backIcon} source={back}/>
                    <Text style={componentStyle.backText}>НАЗАД</Text>
                  </Fragment>
                </TouchableItem>
              </View>
              {this.exists === true ?
                <Fragment>
                  <Text style={componentStyle.label}>Введите Ваш пароль</Text>
                  <TextInput placeholder="Пароль" secureTextEntry onChangeText={text => {this.change('password', text)}} underlineColorAndroid="transparent" autoCorrect={false} selectionColor="#a23737" value={this.password} style={componentStyle.input}/>
                  <Button disabled={this.disabled} onPress={()=>{this.login()}} style={componentStyle.button} block>
                    <Text style={componentStyle.buttonText}>ВОЙТИ</Text>
                  </Button>

                  <Button onPress={()=>{this.showRestore()}} style={componentStyle.link} transparent={true}>
                    <Text style={componentStyle.linkText}>Забыли пароль?</Text>
                  </Button>
                </Fragment>
              : null}

              {this.exists === false ?
                <Fragment>
                  <Text style={componentStyle.label}>Введите код, который мы отправили на Ваш телефон {this.tel}</Text>
                  <TextInput keyboardType="numeric" onChangeText={text => {this.change('code', text)}} underlineColorAndroid="transparent" autoCorrect={false} selectionColor="#a23737" value={this.code} style={componentStyle.input}/>
                  <Button disabled={this.disabled} onPress={()=>{this.checkCode()}} style={componentStyle.button} block>
                    <Text style={componentStyle.buttonText}>ДАЛЕЕ</Text>
                  </Button>
                  <Button onPress={()=>{this.sendSMS()}} style={componentStyle.link} transparent={true}>
                    <Text style={componentStyle.linkText}>Отправить код повторно</Text>
                  </Button>
                </Fragment>
              : null}

              {this.exists === "password" ?
                <Fragment>
                  <Text style={componentStyle.label}>Придумайте пароль</Text>
                  <TextInput secureTextEntry onChangeText={text => {this.change('password', text)}} underlineColorAndroid="transparent" autoCorrect={false} selectionColor="#a23737" value={this.password} style={componentStyle.input}/>
                  <Button disabled={this.disabled} onPress={()=>{this.register()}} style={componentStyle.button} block>
                    <Text style={componentStyle.buttonText}>ЗАРЕГИСТРИРОВАТЬСЯ</Text>
                  </Button>
                </Fragment>
              : null}

              {this.exists === "restore" ?
                <Fragment>
                  <Text style={componentStyle.label}>Введите код, который мы отправили на Ваш телефон {this.tel}</Text>
                  <TextInput keyboardType="numeric" onChangeText={text => {this.change('code', text)}} underlineColorAndroid="transparent" autoCorrect={false} selectionColor="#a23737" value={this.code} style={componentStyle.input}/>
                  <Button disabled={this.disabled} onPress={()=>{this.restore()}} style={componentStyle.button} block>
                    <Text style={componentStyle.buttonText}>ВОССТАНОВИТЬ ПАРОЛЬ</Text>
                  </Button>
                  <Button onPress={()=>{this.sendSMS()}} style={componentStyle.link} transparent={true}>
                    <Text style={componentStyle.linkText}>Отправить код повторно</Text>
                  </Button>
                </Fragment>
                : null}
            </Animated.View>
            :
            null
          }

        </Content>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
    padding: 30
  },

  logo: {
    width: 167.5,
    height: 88
  },

  logoContainer: {
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 70
  },

  button: {
    backgroundColor: "#a23737",
    height: 50
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12
  },

  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 15,
    marginLeft: 10,
    lineHeight: 22
  },

  input: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 5,
    height: 50,
  },

  slogan: {
    marginTop: 30,
    color: "#fff",
    fontSize: 16
  },
  slide: {
    left: -100
  },

  backContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#fff",
    marginBottom: 15,
    alignItems: "flex-start"
  },

  backTouchable: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },

  backText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 12
  },

  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },

  link: {
    marginTop: 15,
    alignSelf: "center"
  },

  linkText: {
    color: "#a23737",
  }
});