import React from 'react';
import {Text, View, Picker } from 'react-native';
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
  Item,
  Label,
  Input,
  Form,
  List, ListItem
} from 'native-base';
import styles from "../styles"
import { observable, action} from 'mobx';
import Cars from "../store/Cars";
import Footer from "../components/Footer";


@observer
export default class AddCar extends React.Component {
  componentDidMount() {
    Cars.getMarks();
  };

  componentWillUnmount () {
    Cars.car = Object.assign({}, Cars.initialCar);
  }

  submitHandler = () => {
    Cars.addCar().then(()=>this.props.navigation.navigate('Garage'));
  };

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button onPress={()=>{this.props.navigation.navigate('Garage')}} transparent>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Добавить автомобиль</Text></Title>
          </Body>
          <Right/>
        </Header>

        <Content contentContainerStyle={styles.container}>
          <Form style={{padding: 20}}>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={Cars.car.mark} onValueChange={(value)=>{Cars.car.mark = value; Cars.getModels()}}>
                <Picker.Item label="Марка автомобиля" value="" />
                {Cars.marks.map((car)=>{
                  return <Picker.Item key={car.id} label={car.name} value={car.id} />
                })}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker style={Boolean(Cars.car.mark) ? {} : styles.pickerDisabled} enabled={Boolean(Cars.car.mark)} selectedValue={Cars.car.model} onValueChange={(value)=>{Cars.car.model = value}}>
                <Picker.Item label="Модель автомобиля" value=""/>
                {Cars.models.map((model) => {
                  return <Picker.Item key={model.id} label={model.name} value={model.id} />
                })}
              </Picker>
            </View>

            <Item style={styles.itemInput}>
              <Input  keyboardType="numeric" maxLength={4} placeholderTextColor={"#d6d7da"} disabled={!Boolean(Cars.car.model)} placeholder={"Год автомобиля"} onChangeText={(text)=>{Cars.car.year = text; Cars.getGenerations()}} value={Cars.car.year} />
            </Item>

            <View style={styles.pickerWrapper}>
              <Picker style={Boolean(Cars.car.year.length === 4) ? {} : styles.pickerDisabled} enabled={Boolean(Cars.car.year.length === 4)} selectedValue={Cars.car.generation} onValueChange={(value)=>{Cars.car.generation = value; Cars.getSeries();}}>
                <Picker.Item label="Поколение" value=""/>
                {Cars.generations.map((generation) => {
                  return <Picker.Item key={generation.id} label={`${generation.name} (${generation.year_begin} ... ${generation.year_end})`} value={generation.id} />
                })}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker style={Boolean(Cars.car.generation) ? {} : styles.pickerDisabled} enabled={Boolean(Cars.car.generation)} selectedValue={Cars.car.serie} onValueChange={(value)=>{Cars.car.serie = value; Cars.getModifications()}}>
                <Picker.Item label="Серия" value=""/>
                {Cars.series.map((serie) => {
                  return <Picker.Item key={serie.id} label={`${serie.name}`} value={serie.id} />
                })}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker style={Boolean(Cars.car.serie) ? {} : styles.pickerDisabled} enabled={Boolean(Cars.car.serie)} selectedValue={Cars.car.modification} onValueChange={(value)=>{Cars.car.modification = value}}>
                <Picker.Item label="Модификация" value=""/>
                {Cars.modifications.map((modification) => {
                  return <Picker.Item key={modification.id} label={`${modification.name}`} value={modification.id} />
                })}
              </Picker>
            </View>

            <Button onPress={this.submitHandler} style={{...styles.primaryButton, marginTop: 25}} block><Text style={styles.primaryButtonText}>Добавить</Text></Button>
          </Form>
        </Content>

        <Footer {...this.props}/>
      </Container>
    );
  }
}