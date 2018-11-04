import { observable, action} from 'mobx';
import Api from "../modules/Api";

class Cars {
  @observable cars = {
    cars: [],
    refs: {}
  };

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

  /**
   * Получение моделей автомобиля
   * @param mark
   * @returns {Promise<*>}
   */
  @action getModels = async (mark = null) => {
    return await Api('directory/cars/models', mark);
  };

  /**
   * Получение поколений автомобиля
   * @param model
   * @returns {Promise<*>}
   */
  @action getGenerations = async (model = null) => {
    return await Api('directory/cars/generations', model);
  };

  /**
   * Получение серий автомобиля
   * @param generation
   * @returns {Promise<*>}
   */
  @action getSeries = async (generation = null) => {
    return await Api('directory/cars/series', generation);
  };

  /**
   * Получение модификаций автомобиля
   * @param serie
   * @returns {Promise<*>}
   */
  @action getModifications = async (serie) => {
    return await Api('directory/cars/modifications', serie)
  };

  /**
   * Добавление автомобиля в гараж
   * @param obj
   * @returns {Promise<*>}
   */
  @action addCar = async (obj) => {
    return await Api('garage/cars/add', {car: obj})
  };

  /**
   * Получение машины
   * @param id
   * @returns {Promise<*>}
   */
  @action getCar = async id => {
    return await Api('garage/cars/get', {id});
  };

  /**
   * Удаление машины
   *
   * @param id
   * @returns {Promise<*>}
   */
  @action deleteCar = async id => {
    return await Api('garage/cars/delete', {id})
  };

  /**
   * Обновить данные по машине
   * @param data
   * @returns {Promise<*>}
   */
  @action updateCar = async (data = {}) => {
    return await Api('garage/cars/update', data);
  };

  /**
   * Получить журнал по машине
   * @param id {number}
   * @returns {Promise<*>}
   */
  @action getJournal = async (id) => {
    return await Api('garage/journal', {car: id});
  };

  /**
   * Добавить запись в журнал
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action journalAdd = async (data = {}) => {
    return await Api('garage/journal/add', data);
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