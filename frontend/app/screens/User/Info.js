import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import {Container, Button, Content, Icon, Header, Left, Right, Body, Title} from 'native-base';
import styles from "../../styles";
import Accordion from "../../components/Accordion";

@observer
export default class Info extends React.Component {
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
            <Text>В стадии наполнения</Text>
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

            <Text style={[componentStyle.p, componentStyle.bold]}>3. ПРЕДМЕТ СОГЛАШЕНИЯ</Text>
            <Text style={componentStyle.p}>3.1 Настоящее Соглашение определяет условия и порядок использования Пользователем Сайта, который информирует Пользователя о сервисе CarKeeper.</Text>
            <Text style={componentStyle.p}>3.2 При условии выполнения настоящего Соглашения Пользователю предоставляется простая (неисключительная) лицензия на использование Сайта с помощью персонального компьютера, мобильного телефона, в объеме и порядке, установленном настоящим Соглашением, без права предоставления сублицензий и переуступки.</Text>

            <Text style={[componentStyle.p, componentStyle.bold]}>4. СОГЛАСИЕ С УСЛОВИЯМИ СОГЛАШЕНИЯ</Text>
            <Text style={componentStyle.p}>4.1. Акцептом (принятием оферты) является совершение Пользователем одного из следующих действий:</Text>
            <Text style={componentStyle.p}>4.1.1 посещение Сайта;</Text>
            <Text style={componentStyle.p}>4.1.2 оформление Заявки на Сайте.</Text>
            <Text style={componentStyle.p}>4.2 Совершая действие по принятию оферты, Пользователь гарантирует, что ознакомлен, соглашается, полностью и безоговорочно принимает все условия Соглашения, обязуется их соблюдать.</Text>
            <Text style={componentStyle.p}>4.3 Настоящим Пользователь подтверждает, что акцепт равносилен подписанию и заключению Соглашения на условиях, изложенных в настоящем Соглашении.</Text>
            <Text style={componentStyle.p}>4.4 Оферта вступает в силу с момента размещения в сети Интернет по адресу, указанному в п. 2.3. и действует до момента отзыва оферты.</Text>
            <Text style={componentStyle.p}>4.5 Соглашение может быть принято исключительно в целом. После принятия Пользователем условий настоящего Соглашения оно приобретает силу договора, заключенного между Правообладателем и Пользователем, при этом такой договор как бумажный документ, подписанный обеими Сторонами, не оформляется.</Text>

            <Text style={[componentStyle.p, componentStyle.bold]}>5. ПОРЯДОК ОФОРМЛЕНИЯ ЗАЯВКИ</Text>
            <Text style={componentStyle.p}>5.1 Заявка может быть оформлена Пользователем самостоятельно через форму на Сайте, в которой Пользователю предлагается оставить свое имя, контактный телефон и e-mail, а также отметить интересующие его блоки, которые могут быть сконструированы в Сервисе CarKeeper и указать на необходимость использования CRM/ERP системы или на отсутствие такой необходимости.</Text>
            <Text style={componentStyle.p}>5.2 Оставление Заявки на Сайте не означает заключение какого-либо договора с Правообладателем относительно предоставления в пользования Сервиса CarKeeper.</Text>
            <Text style={componentStyle.p}>5.3 Перед отправкой Заявки Пользователь обязуется ознакомиться с настоящим Соглашением и Политикой конфиденциальности Правообладателя.</Text>
            <Text style={componentStyle.p}>5.4 После получения Заявки Пользователя Правообладатель связывается с Пользователем по указанному им e-mail адресу и/или контактному телефону.</Text>

            <Text style={[componentStyle.p, componentStyle.bold]}>6. УСЛОВИЯ И ПОРЯДОК ИСПОЛЬЗОВАНИЯ САЙТА</Text>
            <Text style={componentStyle.p}>6.1 В соответствии с условиями Соглашения Правообладатель предоставляет Пользователю право использования Сайта следующими способами:</Text>
            <Text style={componentStyle.p}>6.1.1 использовать Сайт для просмотра, ознакомления, оформления Заявки и реализации иного функционала Сайта;</Text>
            <Text style={componentStyle.p}>6.1.2 цитировать элементы из подраздела «Блог» с указанием источника цитирования, включающего ссылку на URL-адрес Сайта.</Text>
            <Text style={componentStyle.p}>6.2 Пользователь не вправе предпринимать указанные ниже действия при использовании Сайта, а равно любых составных частей Сайта:</Text>
            <Text style={componentStyle.p}>6.2.1 копировать, распространять, воспроизводить, опубликовывать или перерабатывать любыми способами материалы и сведения, содержащиеся на Сайте без предварительного письменного согласия Правообладателя;</Text>
            <Text style={componentStyle.p}>6.2.2 модифицировать, копировать или иным образом перерабатывать Сайт, в том числе осуществлять перевод на другие языки;</Text>
            <Text style={componentStyle.p}>6.2.3 нарушать целостность защитной системы или осуществлять какие-либо действия, направленные на обход, снятие или деактивацию технических средств защиты; использовать какие-либо программные коды, предназначенные для искажения, удаления, повреждения, имитации или нарушения целостности Сайта, передаваемой информации или протоколов;</Text>
            <Text style={componentStyle.p}>6.2.4 нарушать надлежащее функционирование Сайта;</Text>
            <Text style={componentStyle.p}>6.2.5 отслеживать или пытаться отслеживать любую информацию о любом другом Пользователе Сайта;</Text>
            <Text style={componentStyle.p}>6.2.6 использовать Сайт и его Контент в любых целях, запрещенных законодательством Республики Беларусь, а также подстрекать к любой незаконной деятельности или другой деятельности, нарушающей права Правообладателя или других лиц.</Text>
            <Text style={componentStyle.p}>6.3 Любые права, не предоставленные Пользователю в явной форме в соответствии с настоящим Соглашением, сохраняются за Правообладателем.</Text>
            <Text style={componentStyle.p}>6.4 Сайт предоставляется в пользование без каких-либо гарантийных обязательств Правообладателя по устранению недостатков, эксплуатационной поддержке и усовершенствованию.</Text>
            <Text style={componentStyle.p}>6.5 Правообладатель не несет ответственность за посещение и использование Пользователем внешних ресурсов, ссылки на которые могут содержаться на Сайте.</Text>
            <Text style={componentStyle.p}>6.6 Пользователь согласен с тем, что Правообладатель не несет какой-либо ответственности и не имеет каких-либо обязательств в связи с рекламой, которая может быть размещена на Сайте.</Text>
            <Text style={componentStyle.p}>6.7 Пользователь соглашается не предпринимать действий и не оставлять комментарии и записи, которые могут рассматриваться как нарушающие законодательство Республики Беларусь или нормы международного права, в том числе в сфере интеллектуальной собственности, авторских и/или смежных прав, общепринятые нормы морали и нравственности, а также любых действий, которые приводят или могут привести к нарушению нормальной работы Сайта и сервисов Сайта.</Text>

            <Text style={[componentStyle.p, componentStyle.bold]}>7. ПРАВА И ОБЯЗАННОСТИ СТОРОН</Text>
            <Text style={componentStyle.p}>7.1 Правообладатель обязуется:</Text>
            <Text style={componentStyle.p}>7.1.1 В течение 30 календарных дней со дня получения соответствующего письменного уведомления Пользователя своими силами и за свой счет устранить выявленные Пользователем недостатки Сайта, а именно:</Text>
            <Text style={componentStyle.p}>• несоответствие содержания Сайта данным, указанным в п. 3.1. Соглашения;</Text>
            <Text style={componentStyle.p}>• наличие в составе Сайта материалов, запрещенных к распространению законодательством.</Text>
            <Text style={componentStyle.p}>7.1.2 Воздерживаться от каких-либо действий, способных затруднить осуществление Пользователем предоставленного ему права использования Сайта в установленных Соглашением пределах.</Text>
            <Text style={componentStyle.p}>7.1.3 Предоставлять информацию по вопросам работы Сайта посредством электронной почты: info@carkeeper.pro.</Text>
            <Text style={componentStyle.p}>7.1.4 Обеспечить конфиденциальность информации, введенной Пользователем при использовании Сайта.</Text>
            <Text style={componentStyle.p}>7.2 Пользователь обязуется:</Text>
            <Text style={componentStyle.p}>7.2.1 Использовать Сайт только в тех пределах и теми способами, которые предусмотрены в Соглашении.</Text>
            <Text style={componentStyle.p}>7.2.2 При оформлении Заявки предоставить реальные, а не вымышленные сведения. В случае обнаружения недостоверности представленных сведений, а также если у Правообладателя возникнут обоснованные сомнения в их достоверности (в том числе, если при попытке связаться указанные контактные данные окажутся несуществующими), Правообладатель имеет право в одностороннем порядке прекратить отношения с Пользователем.</Text>
            <Text style={componentStyle.p}>7.2.3 При оформлении Заявки указать следующую информацию: имя, контактный телефон, контактный e-mail, а также при желании указать место работы.</Text>
            <Text style={componentStyle.p}>7.2.4 Строго соблюдать и не нарушать условий настоящего Соглашения.</Text>
            <Text style={componentStyle.p}>7.2.5 Воздерживаться от копирования в любой форме, а также от изменения, дополнения, распространения Сайта, контента Сайта (либо любой его части), а также воздерживаться от создания на его основе производных объектов без предварительного письменного разрешения Правообладателя.</Text>
            <Text style={componentStyle.p}>7.2.6 Не использовать никаких приборов либо компьютерных программ для вмешательства или попытки вмешательства в процесс нормального функционирования Сайта Правообладателя.</Text>
            <Text style={componentStyle.p}>7.2.7 Незамедлительно информировать Правообладателя обо всех ставших ему известных фактах противоправного использования Сайта третьими лицами.</Text>
            <Text style={componentStyle.p}>7.2.8 Использовать Сайт, не нарушая имущественных и/или личных неимущественных прав Правообладателя и третьих лиц, а равно запретов и ограничений, установленных применимым правом, включая без ограничения: права на фирменное наименование, права на коммерческое обозначение, авторские и смежные права, права на товарные знаки, знаки обслуживания и наименования мест происхождения товаров, права на промышленные образцы, права на использование изображений людей.</Text>
            <Text style={componentStyle.p}>7.2.9 Не допускать размещение и передачу материалов незаконного, неприличного, клеветнического, дискредитирующего, угрожающего, порнографического, враждебного характера, а также содержащих домогательства и признаки расовой или этнической дискриминации, призывающих к совершению действий, которые могут считаться уголовным преступлением или являться нарушением какого-либо законодательства, равно как и считаться недопустимыми по иным причинам, материалов, пропагандирующих культ насилия и жестокости, материалов, содержащих нецензурную брань.</Text>
            <Text style={componentStyle.p}>7.2.10 Исполнять иные обязанности, предусмотренные Соглашением.</Text>
            <Text style={componentStyle.p}>7.3 Правообладатель вправе:</Text>
            <Text style={componentStyle.p}>7.3.1 Приостановить или прекратить доступ Пользователя на Сайт, если Правообладатель будет обоснованно считать, что Пользователь ведет неправомерную деятельность.</Text>
            <Text style={componentStyle.p}>7.3.2 Собирать информацию о предпочтениях Пользователей и способах использования ими Сайта (наиболее часто используемые функции, настройки, предпочитаемое время и продолжительность работы с Сайтом и прочее), которая не является персональными данными, для улучшения работы Сайта, диагностики и профилактики сбоев Сайта.</Text>
            <Text style={componentStyle.p}>7.3.3 Заблокировать Пользователя в случае нарушения им условий настоящего Соглашения.</Text>
            <Text style={componentStyle.p}>7.3.4 Вносить в одностороннем порядке изменения в Соглашение путем издания его новых редакций.</Text>
            <Text style={componentStyle.p}>7.3.5 Временно прекращать работу Сайта, а равно частично ограничивать или полностью прекращать доступ к Сайту до завершения необходимого технического обслуживания и / или модернизации Сайта. Пользователь не вправе требовать возмещения убытков за такое временное прекращение оказания услуг или ограничение доступности Сайта.</Text>
            <Text style={componentStyle.p}>7.4 Пользователь вправе:</Text>
            <Text style={componentStyle.p}>7.4.1 Использовать Сайт в пределах и способами, предусмотренными Соглашением.</Text>
            <Text style={componentStyle.p}>7.4.2 Пользователь не вправе давать согласие на выполнение настоящего Соглашения в случаях, если у него нет законного права использовать Сайт в стране, в которой находится или проживает, или если он не достиг возраста, с которого имеет право заключать данное Соглашение.</Text>

            <Text style={[componentStyle.p, componentStyle.bold]}>8. ПЕРСОНАЛЬНЫЕ ДАННЫЕ И ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</Text>
            <Text style={componentStyle.p}>1. Для выполнения условий Соглашения Пользователь соглашается предоставить и дает согласие на обработку персональных данных на условиях и для целей надлежащего исполнения Соглашения. Под «персональными данными» понимается персональная информация, которую Пользователь предоставляет о себе самостоятельно для совершения акцепта.</Text>
            <Text style={componentStyle.p}>2. Правообладатель обрабатывает персональные данные Пользователя в соответствии с законодательством и Политикой конфиденциальности, расположенной по адресу: https://carkeeper.pro/privacy.</Text>
            <Text style={componentStyle.p}>3. Правообладатель гарантирует конфиденциальность в отношении персональных данных Пользователя.</Text>
            <Text style={componentStyle.p}>4. Полученные Правообладателем персональные данные Пользователя не подлежат разглашению, за исключением случаев, предусмотренных Политикой конфиденциальности.</Text>

            <Text style={[componentStyle.p, componentStyle.bold]}>9. ОТВЕТСТВЕННОСТЬ СТОРОН</Text>
            <Text style={componentStyle.p}>1. Стороны несут ответственность за неисполнение или ненадлежащее исполнение своих обязательств в соответствии с условиями Соглашения и законодательством Республики Беларусь.</Text>
            <Text style={componentStyle.p}>2. Правообладатель не принимает на себя ответственность за соответствии Сайта целям использования.</Text>
            <Text style={componentStyle.p}>3. Правообладатель не несет ответственности за технические перебои в работе Сайта. Вместе с тем Правообладатель обязуется принимать все разумные меры для предотвращения таких перебоев.</Text>
            <Text style={componentStyle.p}>4. Правообладатель не несет ответственности за любые действия Пользователя, связанные с использованием предоставленных прав использования Сайта; за ущерб любого рода, понесенный Пользователем из-за утери и/или разглашения своих данных либо в процессе использования Сайта.</Text>
            <Text style={componentStyle.p}>5. В случае нарушения Пользователем настоящего Соглашения либо действующих норм законодательства (в том числе прав Правообладателя на интеллектуальную собственность), Пользователь несет ответственность перед Правообладателем предусмотренную действующим законодательством.</Text>

            <Text style={[componentStyle.p, componentStyle.bold]}>10. РАЗРЕШЕНИЕ СПОРОВ</Text>
            <Text style={componentStyle.p}>1. В случае возникновения любых разногласий или споров между Сторонами настоящего Соглашения обязательным условием до обращения в суд является предъявление претензии (письменного предложения о добровольном урегулировании спора). При направлении претензии Правообладателю в тексте претензии должно быть указано: ФИО; сведения, подтверждающие участие Пользователя в отношениях с Правообладателем, либо сведения, иным способом подтверждающие факт взаимодействия Пользователя и Правообладателя; подпись гражданина (или его законного представителя).</Text>
            <Text style={componentStyle.p}>2. Срок рассмотрения претензионного письма составляет 15 рабочих дней со дня получения последнего адресатом.</Text>
            <Text style={componentStyle.p}>3. При невозможности разрешить спор в добровольном порядке любая из Сторон вправе обратиться в суд за защитой своих прав, которые предоставлены им действующим законодательством Республики Беларусь.</Text>

            <Text style={[componentStyle.p, componentStyle.bold]}>11. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</Text>
            <Text style={componentStyle.p}>1. Новая редакция Соглашения вступает в силу с момента ее размещения на Сайте.</Text>
            <Text style={componentStyle.p}>2. В случае несогласия с условиями Соглашения Пользователь не должен пользоваться Сайтом.</Text>
            <Text style={componentStyle.p}>3. Взаимодействие (направление писем/запросов/претензий) между Правообладателем и Пользователем может осуществляться посредством электронной почты и/или путем направления заказных писем с уведомлением по почте. Адрес электронной почты Правообладателя: info@carkeeper.pro.</Text>
            <Text style={componentStyle.p}>4. Настоящее Соглашение разработано в соответствии с законодательством РБ. В случае изменения норм законодательства РБ настоящее Соглашение должно быть приведено в соответствие с действующим законодательством в течение недели с даты вступления в силу таких изменений.</Text>
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