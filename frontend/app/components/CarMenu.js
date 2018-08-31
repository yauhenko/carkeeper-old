import React from 'react';
import {observer} from 'mobx-react';
import styles from "../styles";
import {Badge, Button, Icon, Text} from "native-base";

@observer
export default class CarMenu extends React.Component {
  id = this.props.id;

  render() {
    const active = this.props.navigation.state.routeName;

    return (
      <React.Fragment>
        <Button badge vertical style={active === "Reminders" ? styles.footerButtonActive : styles.footerButton} onPress={()=>this.props.navigation.navigate("Reminders", {id: this.id})} active={active === "Reminders"}>
          <Badge><Text>1</Text></Badge>
          <Icon style={styles.footerBadge} name={"watch"} />
          <Text style={{color: "#fff"}}>Напоминания</Text>
        </Button>

        <Button vertical style={active === "Reminders" ? styles.footerButtonActive : styles.footerButton} onPress={()=>this.props.navigation.navigate("Reminders", {id: this.id})} active={active === "Reminders"}>
          <Icon style={styles.footerBadge} name={"clipboard"} />
          <Text style={{color: "#fff"}}>Бортжурнал</Text>
        </Button>

        <Button badge vertical style={active === "Reminders" ? styles.footerButtonActive : styles.footerButton} onPress={()=>this.props.navigation.navigate("Reminders", {id: this.id})} active={active === "Reminders"}>
          <Badge><Text>1</Text></Badge>
          <Icon style={styles.footerBadge} name={"speedometer"} />
          <Text style={{color: "#fff"}}>Штрафы</Text>
        </Button>
      </React.Fragment>
    );
  }
}