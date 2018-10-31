import { observable, action} from 'mobx';
import Api from "../modules/Api";

class Cars {
  @observable cars = {
    cars: [],
    refs: {}
  };

  @observable marks = [];



  /**
   * Получение списка машин в гараже
   * @returns {Promise<*>}
   */
  @action getCars = async () => {
    return await Api('garage/cars', {});
  };

  /**
   * Получение марок автомобилей
   * @param data
   * @returns {Promise<*>}
   */
  @action getMarks = async (data = {}) => {
    return await Api('directory/cars/marks', data)
  };

  // @observable initialCar = Object.freeze({
  //   mark: String(),
  //   year: String(),
  //   model: String(),
  //   generation: String(),
  //   serie: String(),
  //   modification: String()
  // });
  //
  // @observable car = Object.assign({}, this.initialCar);
  //
  // @observable marks = [];
  // @observable models = [];
  // @observable generations = [];
  // @observable series = [];
  // @observable modifications = [];
  //
  // @observable carDetail = {};
  //
  // @action getCar = async id => {
  //   this.loading = true;
  //   try {
  //     this.carDetail = await Api('garage/cars/get', {id: id});
  //   } catch (e) {
  //     Notification(e)
  //   }
  //   this.loading = false;
  //   return this.carDetail;
  // };
  //
  // @action updateCar = async (data = {}) => {
  //   return await Api('garage/cars/update', data);
  // };
  //

  //
  // @action addCar = async () => {
  //   try {
  //     return await Api('garage/cars/add', this.car)
  //   } catch (e) {
  //     Notification(e)
  //   }
  // };
  //
  // @action deleteCar = id => {
  //   return Api('garage/cars/delete', {id}).then((response) => {
  //   }).catch(Notification);
  // };
  //
  // @action getMarks = () => {
  //   return Api('directory/cars/marks', {}).then((response) => {
  //     this.marks = response;
  //   }).catch(Notification);
  // };
  //
  // @action getModels = () => {
  //   if(!this.car.mark) return;
  //   return Api('directory/cars/models', {mark: this.car.mark}).then((response) => {
  //     this.models = response;
  //   }).catch(Notification);
  // };
  //
  // @action getGenerations = () => {
  //   if(!this.car.model || this.car.year.length !== 4) return;
  //   return Api('directory/cars/generations', {model: this.car.model, year: this.car.year }).then((response) => {
  //     this.generations = response || [];
  //   }).catch(Notification);
  // };
  //
  // @action getSeries = () => {
  //   if(!this.car.generation) return;
  //   return Api('directory/cars/series', {generation: this.car.generation}).then((response) => {
  //     this.series = response || [];
  //   }).catch(Notification);
  // };
  //
  // @action getModifications = () => {
  //   if(!this.car.serie) return;
  //   return Api('directory/cars/modifications', {serie: this.car.serie}).then((response) => {
  //     this.modifications = response || [];
  //   }).catch(Notification);
  // };
  //
  // @action checkupUpdate = async (data = {}) => {
  //   return Api('garage/cars/checkup/update', data).then((response) => {
  //   }).catch(Notification);
  // };
  //
  // @action insuranceUpdate = async (data = {}) => {
  //   try {
  //     return await Api('garage/cars/insurance/update', data)
  //   } catch (e) {
  //     Notification(e);
  //   }
  // };
}

export default new Cars();