import React from 'react';
import {View, TouchableWithoutFeedback, Animated} from 'react-native';
import {observer} from 'mobx-react';
import { observable, action} from 'mobx';

@observer
export default class ModalMenu extends React.Component {
  state = {
    opacity: new Animated.Value(0)
  };

  componentDidMount() {
    Animated.timing(this.state.opacity, {toValue: 1, duration: 1000}).start();
  }

  hide = async () => {
    Animated.timing(this.state.opacity, {toValue: 0, duration: 1000}).start(this.props.onClose);
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.hide}>
        <Animated.View style={[style.overlay, {opacity: this.state.opacity}]}>
          <View style={style.modal}>
            {this.props.children}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const style = {
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1
  }
};