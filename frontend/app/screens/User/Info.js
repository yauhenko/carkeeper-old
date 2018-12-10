import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title, View} from 'native-base';
import styles from "../../styles";
import Accordion from "../../components/Accordion";

@observer
export default class Info extends React.Component {
  @observable loading = false;

  render() {
    return (
      <Container style={styles.container}>
        <Header androidStatusBarColor={styles.statusBarColor} style={styles.header}>
          <Left>
            <Button onPress={this.props.navigation.openDrawer} transparent>
              <Icon style={styles.headerIcon} name='md-menu'/>
            </Button>
          </Left>

          <Body>
          <Title><Text style={styles.headerTitle}>Информация</Text></Title>
          </Body>

          <Right/>
        </Header>

        <Content contentContainerStyle={styles.content}>
          <Accordion heading={"Политика конфиденциальности"}>
            <Text>1</Text>
            <Text>1</Text>
            <Text>1</Text>
            <Text>1</Text>
          </Accordion>

          <Accordion heading={"Пользовательское соглашение"}>
            <Text style={[componentStyle.p, componentStyle.bold]}>1. ОБЩИЕ ПОЛОЖЕНИЯ</Text>
            <Text style={componentStyle.p}>1.1 Настоящее Пользовательское соглашение (далее – «Соглашение») определяет условия использования Пользователями материалов и сервисов сайта, расположенного по адресу: https://carkeeper.pro/ (далее – «Сайт»).</Text>
            <Text style={componentStyle.p}>1.2 Настоящее Соглашение приравнивается к договору, составленному в письменной форме, который вступает в силу с момента принятия его условий путем совершения действий, предусмотренных Соглашением.</Text>
            <Text style={componentStyle.p}>1.3 На Сайте информация размещается от имени ООО «РэдСтрим», адрес: офис 97, 40/2 южнее д. Большое Стиклево, Новодворский с/с, Минский р-н, 223060, Республика Беларусь (далее - "Правообладатель").</Text>
            <Text style={componentStyle.p}>1.4 Правообладатель оставляет за собой право в любое время изменять, добавлять или удалять пункты настоящего Соглашения без уведомления Пользователя.</Text>
            <Text style={componentStyle.p}>1.5 Продолжение использования Сайта Пользователем означает принятие Соглашения и изменений, внесенных в настоящее Соглашение.</Text>
            <Text style={componentStyle.p}>1.6 Пользователь несет персональную ответственность за проверку настоящего Соглашения на наличие изменений в нем.</Text>
            <Text style={componentStyle.p}>1.7 Использование материалов и сервисов Сайта регулируется нормами действующего законодательства Республики Беларусь.</Text>

            <Text style={[componentStyle.p, componentStyle.bold]}>2. ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ</Text>

            <Text style={componentStyle.p}>2.1 Правообладатель – юридическое лицо, разместившее оферту.</Text>
            <Text style={componentStyle.p}>2.2 Пользователь – дееспособное физическое лицо, имеющее доступ к Сайту, посредством сети Интернет, и заключившее Соглашение посредством акцепта на условиях, содержащихся в оферте.</Text>
            <Text style={componentStyle.p}>2.3 Оферта – настоящее Соглашение, размещенное в сети Интернет по адресу: https://carkeeper.pro/terms.</Text>
            <Text style={componentStyle.p}>2.4 Акцепт – полное и безоговорочное принятие оферты путем осуществления действий, указанных в п. 4.1. Соглашения.</Text>
            <Text style={componentStyle.p}>2.5 Контент – информация, представленная в текстовом, графическом, аудиовизуальном (видео) форматах на Сайте, являющегося его наполнением. Контент Сайта создает Правообладатель для облегчения функционирования Сайта, включая интерфейс Сайта.</Text>
            <Text style={componentStyle.p}>2.6 Простая (неисключительная) лицензия – неисключительное право Пользователя использовать результат интеллектуальной деятельности, указанный в п. 3.1. Соглашения, с сохранением за Правообладателем права выдачи лицензий другим лицам.</Text>
            <Text style={componentStyle.p}>2.7 Заявка – должным образом оформленный запрос Пользователя на обратную связь от Правообладателя по вопросу потенциального подключения к сервису CarKeeper по интересующим блокам, выбранным на Сайте.</Text>
            <Text style={componentStyle.p}>2.8 Сервис CarKeeper – сервис для автовладельцев.</Text>
          </Accordion>

          <Accordion heading={"О разработчике"}>
            <Text style={componentStyle.p}>Компания: ООО «РэдСтрим»</Text>
            <Text style={componentStyle.p}>Адрес: 223060, Минский р-н, Новодворский с/с, южнее д. Большое Стиклево, 40/2, офис 97</Text>
            <Text style={componentStyle.p}>E-mail: info@redstream.by</Text>
            <Text style={componentStyle.p}>Сайт: redstream.by</Text>
          </Accordion>
        </Content>
      </Container>
    );
  }
}

const componentStyle = StyleSheet.create({
  p: {
    marginBottom: 10,
    lineHeight: 21
  },
  bold: {
    fontWeight: "bold"
  }
});