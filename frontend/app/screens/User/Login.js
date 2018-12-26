import React, {Fragment} from 'react';
import {AsyncStorage, StyleSheet, Text, StatusBar, Animated, Image, View, Dimensions, TextInput, RefreshControl, Vibration, Modal} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content} from 'native-base';
import User from "../../store/User";
import { observable, action} from 'mobx';
import Notification from "../../components/Notification";
import TouchableItem from "react-navigation/src/views/TouchableItem";
import Logger from "../../modules/Logger";
import Swiper from 'react-native-swiper';
import styles from "../../styles";
import Pixel from "../../modules/Pixel";

@observer
export default class Login extends React.Component {
  @observable tel = "";
  @observable password = "";
  @observable code = "";
  @observable geo = {};
  @observable exists = null;

  @observable showSlides = false;

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
      Logger.info("Пользователь авторизовался", {phone: String(this.tel)})
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
      const response = await User.register({
        code: this.code,
        user: {tel: this.tel, password: this.password},
        ttl: 3600 * 24 * 7,
        noip: true,
        fcm: User.fcm,
        pixel: Pixel.pixel
      });
      User.token = response.token;
      await AsyncStorage.setItem('token', response.token);
      User.profile = await User.info();
      User.auth = true;
      await AsyncStorage.multiSet([["tel", String(this.tel)],["password", String(this.password)]]);
      Logger.info("Пользователь зарегистрировался", {phone: String(this.tel)})
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

    Logger.info("Пользователю отправлено СМС с кодом");

    try {
      await User.tel({tel: this.tel});
      if(!silent) Notification("Вам отправлено СМС c кодом");
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

  @action closeSlides = () => {
    this.showSlides = false;
    AsyncStorage.setItem("slides", "1")
  };

  async componentDidMount() {
    AsyncStorage.multiGet(["tel", "password", "slides"], (err, data) => {
      if(data) {
        this.tel = data[0][1] || this.tel;
        this.password = data[1][1] || this.password;
        this.showSlides = !Boolean(data[2][1]);
      }
      this.fillPhoneCode();
    });
  }

  render() {
    return (
      <Fragment>
        <Container>
          <StatusBar backgroundColor="#000" translucent={true} barStyle="light-content"/>
          <Content refreshControl={<RefreshControl enabled={false} refreshing={this.loading}/>} contentContainerStyle={componentStyle.container} style={{backgroundColor: 'rgba(255,255,255,0.4)'}}>
            <View style={componentStyle.background}>
              <Image style={{height: '100%', width: '100%'}} source={require("../../assets/images/login_background.jpg")}/>
            </View>

            <View style={componentStyle.logoContainer}>
              <Image style={componentStyle.logo} source={require("../../assets/images/logo.png")}/>
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
                      <Image style={componentStyle.backIcon} source={require("../../assets/images/back.png")}/>
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

        <Modal animationType="fade" transparent={false} visible={this.showSlides} onRequestClose={() => {this.closeSlides()}}>
          <Container>
            <Swiper ref="slider" paginationStyle={{bottom: 80}} activeDotColor="#000" showsButtons={false}>
              <View style={componentStyle.swipeItem}>
                <View style={componentStyle.swipeItemTop}>
                  <Text style={componentStyle.swipeItemTitle}>Бортжурнал</Text>
                  <Text style={componentStyle.swipeItemText}>Фиксируй все важные события из жизни автомобиля</Text>
                </View>
                <Image style={{width: 170, height: 279, alignSelf: "center", top: -20}} source={require("../../assets/images/slider_journal.png")}/>
                <View style={componentStyle.swipeItemBottom}>
                  <Button onPress={()=>{this.closeSlides()}} transparent><Text style={componentStyle.swipeItemSkipText}>ПРОПУСТИТЬ</Text></Button>
                  <Button onPress={()=>{this.refs.slider.scrollBy(1)}} style={[styles.primaryButton, componentStyle.primaryButton]} transparent><Text style={styles.primaryButtonText}>ДАЛЕЕ</Text></Button>
                </View>
              </View>

              <View style={componentStyle.swipeItem}>
                <View style={componentStyle.swipeItemTop}>
                  <Text style={componentStyle.swipeItemTitle}>Обслуживание</Text>
                  <Text style={componentStyle.swipeItemText}>Уведомления подскажут, когда в следующий раз пора менять масло и другие расходники</Text>
                </View>
                <Image style={{width: 170, height: 279, alignSelf: "center", top: -20}} source={require("../../assets/images/slider_maintenance.png")}/>
                <View style={componentStyle.swipeItemBottom}>
                  <Button onPress={()=>{this.closeSlides()}} transparent><Text style={componentStyle.swipeItemSkipText}>ПРОПУСТИТЬ</Text></Button>
                  <Button onPress={()=>{this.refs.slider.scrollBy(1)}} style={[styles.primaryButton, componentStyle.primaryButton]} transparent><Text style={styles.primaryButtonText}>ДАЛЕЕ</Text></Button>
                </View>
              </View>

              <View style={componentStyle.swipeItem}>
                <View style={componentStyle.swipeItemTop}>
                  <Text style={componentStyle.swipeItemTitle}>Штрафы</Text>
                  <Text style={componentStyle.swipeItemText}>Узнавай о штрафах с камер фиксации, не дожидаясь запоздалых почтовых уведомлений</Text>
                </View>
                <Image style={{width: 170, height: 279, alignSelf: "center", top: -20}} source={require("../../assets/images/slider_fines.png")}/>
                <View style={componentStyle.swipeItemBottom}>
                  <Button onPress={()=>{this.closeSlides()}} transparent><Text style={componentStyle.swipeItemSkipText}>ПРОПУСТИТЬ</Text></Button>
                  <Button onPress={()=>{this.refs.slider.scrollBy(1)}} style={[styles.primaryButton, componentStyle.primaryButton]} transparent><Text style={styles.primaryButtonText}>ДАЛЕЕ</Text></Button>
                </View>
              </View>

              <View style={componentStyle.swipeItem}>
                <View style={componentStyle.swipeItemTop}>
                  <Text style={componentStyle.swipeItemTitle}>Заметки</Text>
                  <Text style={componentStyle.swipeItemText}>Сохраняй любую полезную информацию - от кода магнитолы до телефона любимых СТО</Text>
                </View>
                <Image style={{width: 170, height: 279, alignSelf: "center", top: -20}} source={require("../../assets/images/slider_notes.png")}/>
                <View style={componentStyle.swipeItemBottom}>
                  <Button onPress={()=>{this.closeSlides()}} transparent><Text style={componentStyle.swipeItemSkipText}>ПРОПУСТИТЬ</Text></Button>
                  <Button onPress={()=>{this.refs.slider.scrollBy(1)}} style={[styles.primaryButton, componentStyle.primaryButton]} transparent><Text style={styles.primaryButtonText}>ДАЛЕЕ</Text></Button>
                </View>
              </View>
              <View style={componentStyle.swipeItem}>
                <View style={componentStyle.swipeItemTop}>
                  <Text style={componentStyle.swipeItemTitle}>Напоминания</Text>
                  <Text style={componentStyle.swipeItemText}>Не пропусти дату окончания страховки и техосмотра</Text>
                </View>
                <Image style={{width: 170, height: 279, alignSelf: "center", top: -20}} source={require("../../assets/images/slider_reminders.png")}/>
                <View style={[componentStyle.swipeItemBottom, {justifyContent: "center"}]}>
                  <Button onPress={()=>{this.closeSlides()}} style={[styles.primaryButton, componentStyle.primaryButton]} transparent><Text style={styles.primaryButtonText}>НАЧАТЬ ПОЛЬЗОВАТЬСЯ</Text></Button>
                </View>
              </View>
            </Swiper>
          </Container>
        </Modal>
      </Fragment>
    );
  }
}

const componentStyle = StyleSheet.create({
  swipeItem: {
    justifyContent: "space-between",
    flex: 1,
    backgroundColor: "#c4cad8"
  },

  swipeItemTitle: {
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 10
  },

  swipeItemText: {
    lineHeight: 21,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: "center"
  },

  swipeItemTop: {
    paddingTop: 30,
    alignItems: "center"
  },

  swipeItemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },

  primaryButton: {
    paddingLeft: 20,
    paddingRight: 20
  },

  swipeItemSkipText: {
      fontWeight: "bold"
  },

  container: {
    justifyContent: "space-between",
    flex: 1,
    padding: 30
  },

  background: {
    alignItems: "center",
    paddingTop: StatusBar.currentHeight,
    position: 'absolute',
    width: Dimensions.get("window").width,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
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