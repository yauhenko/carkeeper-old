import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
  List,
  ListItem,
  Thumbnail,
  Item, Label, Input, Form
} from 'native-base';
import styles from "../styles"
import Footer from "../components/Footer";
import User from "../store/User";
import Uploader from "../store/Uploader";
import Cropper from "../modules/Cropper";

@observer
export default class Profile extends React.Component {
  componentDidMount() {

  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
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

              <View>
                <TouchableOpacity onPress={()=>{Cropper.camera({cropperCircleOverlay: true}).then((id)=>{User.update({avatar: id})})}}>
                  <Thumbnail style={customStyles.avatar} source={{uri: Uploader.get(User.profile.avatar)}} />
                  <Icon style={customStyles.camera} name="camera"/>
                </TouchableOpacity>
              </View>

              <View style={{paddingLeft: 20}}>
                <Text style={{fontSize: 20, color: "#fff"}}>Вадим Васильевич</Text>
                <Text style={{color: "#fff", marginTop: 5}}>Написать по красоте</Text>
              </View>
            </View>

          <Form>
            <Item style={customStyles.label} inlineLabel>
              <Label>Номер телефона</Label>
              <Input keyboardType="numeric" onChangeText={(text)=>{}} value={String(User.profile.tel)} />
            </Item>
          </Form>
        </Content>
        <Footer {...this.props}/>
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
    backgroundColor: "#3e4669",
    marginBottom: 30
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
    backgroundColor: "#3e4669",
    color:"#fff",
    padding: 10,
    fontSize: 20,
    borderRadius: 50,
  }
});