import React from 'react';
import {observer} from 'mobx-react';
import styles from "../styles";
import {Badge, Button, Icon, Text} from "native-base";
import {observable, action} from 'mobx';

@observer
export default class CarMenu extends React.Component {
  @action activeStyle = (current) => {
    return (current === this.props.navigation.state.routeName) ? styles.footerButtonActive : styles.footerButton;
  };

  @action activeButton = (current) => {
    return this.props.navigation.state.routeName === current;
  };

  render() {
    return (
      <React.Fragment>
        <Button vertical style={this.activeStyle("Car")} onPress={()=>this.props.navigation.navigate("Car", {car: this.props.car})} active={this.activeButton("Car")}>
          <Icon style={styles.footerBadge} name={"car"} />
        </Button>

        <Button vertical style={this.activeStyle("Journal")} onPress={()=>this.props.navigation.navigate("Journal", {car: this.props.car})} active={this.activeButton("Journal")}>
          <Icon style={styles.footerBadge} name={"clipboard"} />
        </Button>

        <Button vertical style={this.activeStyle("Notes")} onPress={()=>this.props.navigation.navigate("Notes", {car: this.props.car})} active={this.activeButton("Notes")}>
          <Icon style={styles.footerBadge} name={"list-box"} />
        </Button>

        <Button vertical style={this.activeStyle("Reminders")} onPress={()=>this.props.navigation.navigate("Reminders", {car: this.props.car})} active={this.activeButton("Reminders")}>
          <Icon style={styles.footerBadge} name={"notifications"} />
        </Button>

        <Button style={this.activeStyle("Fines")} onPress={()=>this.props.navigation.navigate("Fines", {car: this.props.car})} active={this.activeButton("Fines")}>
          <Icon style={styles.footerBadge} name={"speedometer"} />
        </Button>
      </React.Fragment>
    );
  }
}