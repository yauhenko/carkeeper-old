import React from 'react';
import {View, Modal, StyleSheet, Text, Image} from 'react-native';
import {observer} from 'mobx-react';
import {Body, Button, Container, Header, Icon, Left, Title} from "native-base";
import styles from "../styles";

@observer
export default class PhotoModal extends React.Component {
  render() {
    return (
      <Modal
        animationType={this.props.animationType}
        transparent={this.props.transparent}
        onRequestClose={() => {this.props.onRequestClose()}}
        visible={this.props.visible}>
        <Container>
          <Header androidStatusBarColor="#000" style={{backgroundColor: "#000"}}>
            <Left>
              <Button title={"Назад"} onPress={() => {this.props.onRequestClose()}} transparent>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body style={{flexGrow: 2}}>
              <Title><Text style={styles.headerTitle}>Изображение</Text></Title>
            </Body>
          </Header>
          <View style={componentStyle.container}>
            <Image style={componentStyle.image} source={{uri: this.props.image}}/>
          </View>
        </Container>

      </Modal>
    )
  }
}

PhotoModal.defaultProps = {
  animationType: 'slide',
  transparent: false,
  onRequestClose: () => {},
  visible: false,
  image: null
};

const componentStyle = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },

  image: {
    width: "100%",
    aspectRatio: 1
  }
});