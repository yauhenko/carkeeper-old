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
        <Button vertical style={this.activeStyle("Journal")} onPress={()=>this.props.navigation.navigate("Journal", {car: this.props.car})} active={this.activeButton("Journal")}>
          <Icon style={styles.footerBadge} name={"clipboard"} />
          <Text style={{color: "#fff"}}>Бортжурнал</Text>
        </Button>

        <Button vertical style={this.activeStyle("Reminders")} onPress={()=>this.props.navigation.navigate("Reminders", {car: this.props.car})} active={this.activeButton("Reminders")}>
          <Icon style={styles.footerBadge} name={"watch"} />
          <Text style={{color: "#fff"}}>Напоминания</Text>
        </Button>

        <Button badge vertical style={this.activeStyle("Fines")} onPress={()=>this.props.navigation.navigate("Fines", {car: this.props.car})} active={this.activeButton("Fines")}>
          <Badge><Text>1</Text></Badge>
          <Icon style={styles.footerBadge} name={"speedometer"} />
          <Text style={{color: "#fff"}}>Штрафы</Text>
        </Button>
      </React.Fragment>
    );
  }
}