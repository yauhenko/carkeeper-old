import React from 'react';
import {Text, RefreshControl, Modal, View, Picker} from 'react-native';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, List, ListItem, Thumbnail, Item, Input, Form} from 'native-base';
import styles from "../../styles"
import Cars from "../../store/Cars";
import Uploader from "../../store/Uploader";
import { observable, action} from 'mobx';
import Notification from "../../components/Notification";

@observer
export default class Garage extends React.Component {
  componentDidMount() {
    this.cars();
  }

  @observable loading = false;

  @observable modal = false;
  @action toggleModal = bool => {this.modal = bool};

  @action cars = async () => {
    this.loading = true;

    try {
      Cars.cars = await Cars.getCars();
    } catch (e) {
      Notification(e)
    }

    this.loading = false;
  };

  render() {
    const {cars, refs} = Cars.cars;

    return (
      <Container>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button title={"Меню"} onPress={this.props.navigation.openDrawer} transparent>
              <Icon name='menu'/>
            </Button>
          </Left>
          <Body>
            <Title><Text style={styles.headerTitle}>Гараж</Text></Title>
          </Body>
          <Right>
            <Button title={"Добавить"} onPress={()=>this.toggleModal(true)} transparent>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>

        <Content refreshControl={<RefreshControl refreshing={this.loading} onRefresh={this.cars}/>} contentContainerStyle={styles.container}>
          <List>
            {cars && cars.map(car => {
              return(
                <ListItem onPress={()=>this.props.navigation.navigate('Car', {id: car.id})} thumbnail key={car.id}>
                  <Left>
                    {car.image ?
                      <Thumbnail source={{uri: Uploader.get(car.image)}}/>
                      :
                      <Thumbnail source={require('../../assets/images/car_stub.png')}/>
                    }
                  </Left>

                  <Body>
                    <Text>{refs.mark[car.mark].name} {refs.model[car.model].name}, {String(car.year)}г.</Text>
                    <Text style={styles.textNote}>{refs.serie[car.serie].name} {refs.generation[car.generation].name}</Text>
                    <Text style={styles.textNote}>{refs.modification[car.modification].name}</Text>
                  </Body>

                  <Right style={{paddingLeft: 10}}>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              )
            })}
          </List>

          {!this.loading && !Cars.cars.cars.length && <Text style={{padding: 20, textAlign: "center"}}>Вы еще не добавляли автомобили в гараж.</Text>}


          <Modal animationType="slide" onShow={Cars.getMarks} transparent={false} visible={this.modal} onRequestClose={() => {this.toggleModal(false)}}>
            <Container>
              <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
                <Left>
                  <Button title={"Назад"} onPress={() => {this.toggleModal(false)}} transparent>
                    <Icon name='arrow-back'/>
                  </Button>
                </Left>
                <Body>
                  <Title><Text style={styles.headerTitle}>Добавить автомобиль</Text></Title>
                </Body>
                <Right>
                  <Button onPress={()=>{}} title={"Сохранить"} transparent>
                    <Icon name='checkmark'/>
                  </Button>
                </Right>
              </Header>
              

              <Content>
                <Form>
                  {/*{Cars.marks.length*/}
                    {/*?*/}
                    {/*<View style={styles.pickerWrapper}>*/}
                      {/*<Picker textStyle={{fontSize: 6}} selectedValue={Cars.car.mark} onValueChange={(value)=>{Cars.car.mark = value; Cars.getModels()}}>*/}
                        {/*<Picker.Item label="Марка автомобиля" value="" />*/}
                        {/*{Cars.marks.map((car)=>{*/}
                          {/*return <Picker.Item key={car.id} label={car.name} value={car.id} />*/}
                        {/*})}*/}
                      {/*</Picker>*/}
                    {/*</View>*/}
                    {/*:*/}
                    {/*null*/}
                  {/*}*/}

                  {/*{Cars.models.length*/}
                    {/*?*/}
                    {/*<View style={styles.pickerWrapper}>*/}
                      {/*<Picker style={Boolean(Cars.car.mark) ? {} : styles.pickerDisabled} enabled={Boolean(Cars.car.mark)} selectedValue={Cars.car.model} onValueChange={(value)=>{Cars.car.model = value}}>*/}
                        {/*<Picker.Item label="Модель автомобиля" value=""/>*/}
                        {/*{Cars.models.map(model => <Picker.Item key={model.id} label={model.name} value={model.id} />)}*/}
                      {/*</Picker>*/}
                    {/*</View>*/}
                    {/*:*/}
                    {/*null*/}
                  {/*}*/}

                  {/*<Item style={styles.itemInput}>*/}
                    {/*<Input keyboardType="numeric" maxLength={4} placeholderTextColor={"#d6d7da"} disabled={!Boolean(Cars.car.model)} placeholder={"Год автомобиля"} onChangeText={(text)=>{Cars.car.year = text; Cars.getGenerations()}} value={Cars.car.year} />*/}
                  {/*</Item>*/}

                  {/*<View style={styles.pickerWrapper}>*/}
                    {/*<Picker style={Boolean(Cars.car.year.length === 4) ? {} : styles.pickerDisabled} enabled={Boolean(Cars.car.year.length === 4)} selectedValue={Cars.car.generation} onValueChange={(value)=>{Cars.car.generation = value; Cars.getSeries();}}>*/}
                      {/*<Picker.Item label="Поколение" value=""/>*/}
                      {/*{Cars.generations.map((generation) => {*/}
                        {/*return <Picker.Item key={generation.id} label={`${generation.name} (${generation.year_begin} ... ${generation.year_end})`} value={generation.id} />*/}
                      {/*})}*/}
                    {/*</Picker>*/}
                  {/*</View>*/}

                  {/*<View style={styles.pickerWrapper}>*/}
                    {/*<Picker style={Boolean(Cars.car.generation) ? {} : styles.pickerDisabled} enabled={Boolean(Cars.car.generation)} selectedValue={Cars.car.serie} onValueChange={(value)=>{Cars.car.serie = value; Cars.getModifications()}}>*/}
                      {/*<Picker.Item label="Серия" value=""/>*/}
                      {/*{Cars.series.map((serie) => {*/}
                        {/*return <Picker.Item key={serie.id} label={`${serie.name}`} value={serie.id} />*/}
                      {/*})}*/}
                    {/*</Picker>*/}
                  {/*</View>*/}

                  {/*<View style={styles.pickerWrapper}>*/}
                    {/*<Picker style={Boolean(Cars.car.serie) ? {} : styles.pickerDisabled} enabled={Boolean(Cars.car.serie)} selectedValue={Cars.car.modification} onValueChange={(value)=>{Cars.car.modification = value}}>*/}
                      {/*<Picker.Item label="Модификация" value=""/>*/}
                      {/*{Cars.modifications.map((modification) => {*/}
                        {/*return <Picker.Item key={modification.id} label={`${modification.name}`} value={modification.id} />*/}
                      {/*})}*/}
                    {/*</Picker>*/}
                  {/*</View>*/}
                </Form>
              </Content>
            </Container>
          </Modal>

        </Content>
      </Container>
    );
  }
}