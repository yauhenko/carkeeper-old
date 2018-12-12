import React from 'react';
import {Modal, StyleSheet, Text, Image, RefreshControl} from 'react-native';
import {observer} from 'mobx-react';
import {Body, Button, Container, Content, Header, Icon, Left, Right, Title} from "native-base";
import styles from "../styles";
import RNFS from 'react-native-fs';
import Notification from "./Notification";
import {observable, action} from "mobx";
import PropTypes from 'prop-types';
import moment from "moment";


@observer
export default class PhotoModal extends React.Component {
  @observable loading = false;

  @action download = url => {
    this.loading = true;
    const name = `CarKeeper_${moment().format("DD-MM-YYYY_HH-mm-ss")}`;

    RNFS.downloadFile({
      fromUrl: url,
      toFile: RNFS.PicturesDirectoryPath + `/${name}.jpg`
    }).promise.then(()=>{
      Notification(`Изображение сохранено: ${name}.jpg в ${RNFS.PicturesDirectoryPath}`);
      this.loading = false;
    }).catch(() =>{
      this.loading = false;
    })
  };

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
                <Icon style={styles.headerIcon} name='md-arrow-back'/>
              </Button>
            </Left>
            <Body style={{flexGrow: 2}}>
              <Title><Text style={styles.headerTitle}>Изображение</Text></Title>
            </Body>
            <Right>
              <Button disabled={this.loading} transparent onPress={()=>{this.download(this.props.image)}}>
                <Icon name="download"/>
              </Button>
            </Right>
          </Header>
          <Content refreshControl={<RefreshControl refreshing={this.loading} enabled={false} onRefresh={()=>{}}/>} contentContainerStyle={componentStyle.container}>
              <Image style={componentStyle.image} source={{uri: this.props.image}}/>
          </Content>
        </Container>
      </Modal>
    )
  }
}

PhotoModal.propTypes = {
  image: PropTypes.string
};

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