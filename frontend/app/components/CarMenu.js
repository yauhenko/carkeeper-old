import React from 'react';
import {observer} from 'mobx-react';
import styles from "../styles";
import {Badge, Button, Icon, Text} from "native-base";
import {observable} from 'mobx';

@observer
export default class CarMenu extends React.Component {
  @observable id = this.props.id;

  render() {
    const active = this.props.navigation.state.routeName;

    return (
      <React.Fragment>
        <Button vertical style={active === "Reminders" ? styles.footerButtonActive : styles.footerButton} onPress={()=>this.props.navigation.navigate("Reminders", {id: this.id})} active={active === "Reminders"}>
          <Icon style={styles.footerBadge} name={"watch"} />
          <Text style={{color: "#fff"}}>Напоминания</Text>
        </Button>

        <Button vertical style={active === "Profile" ? styles.footerButtonActive : styles.footerButton} onPress={()=>this.props.navigation.navigate("Profile", {id: this.id})} active={active === "Profile"}>
          <Icon style={styles.footerBadge} name={"clipboard"} />
          <Text style={{color: "#fff"}}>Бортжурнал</Text>
        </Button>

        <Button badge vertical style={active === "Garage" ? styles.footerButtonActive : styles.footerButton} onPress={()=>this.props.navigation.navigate("Garage", {id: this.id})} active={active === "Garage"}>
          <Badge><Text>1</Text></Badge>
          <Icon style={styles.footerBadge} name={"speedometer"} />
          <Text style={{color: "#fff"}}>Штрафы</Text>
        </Button>
      </React.Fragment>
    );
  }
}