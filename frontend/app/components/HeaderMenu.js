import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import {observer} from 'mobx-react';

@observer
export default class HeaderMenu extends React.Component {
  render() {
    return this.props.show ? (
      <TouchableWithoutFeedback onPress={this.props.onClose}>
        <View style={{position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 10}}>
          <View style={style.modal}>
            {this.props.children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    ) : null
  }
}

const style = {
  modal: {
    position: "absolute",
    right: 20,
    width: 170,
    top: 20,
    zIndex: 20,
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1
  }
};