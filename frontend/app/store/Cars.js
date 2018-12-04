import { observable, action} from 'mobx';
import Api from "../modules/Api";

class Cars {
  @observable cars = {
    cars: [],
    refs: {}
  };

  @observable currentCar = null;

  @action setCurrentCar = (id = null) => {
    this.currentCar = id;
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

  /**
   * Получить типы записей журнала
   * @param data
   * @returns {Promise<*>}
   */
  @action getJournalTypes = async (data = {}) => {
    return await Api('garage/journal/types', data);
  };

  @action journalDelete = async (data = {}) => {
    return await Api('garage/journal/delete', data);
  };

  /**
   * Обновить запись в журнале
   * @param data
   * @returns {Promise<*>}
   */
  @action journalUpdate = async (data = {}) => {
    return await Api('garage/journal/update', data);
  };

  /**
   * Получить список штрафов
   * @param data
   * @returns {Promise<*>}
   */
  @action getFines = async (data = {}) => {
    return await Api('garage/fines', data);
  };

  /**
   * Отметить штраф как оплаченный
   * @param data
   * @returns {Promise<*>}
   */
  @action payFines = async (data = {}) => {
    return await Api('garage/fines/pay', data);
  };

  /**
   * Удалить штраф
   * @param data
   * @returns {Promise<*>}
   */
  @action deleteFines = async (data = {}) => {
    return await Api('garage/fines/delete', data);
  };

  /**
   * Получение паспорта автомобиля
   * @param data
   * @returns {Promise<*>}
   */
  @action getPass = async (data = {}) => {
    return await Api('garage/pass', data);
  };

  /**
   * Обновление пасспорта автомобиля
   * @param data
   * @returns {Promise<*>}
   */
  @action updatePass = async (data = {}) => {
    return await Api('garage/pass/update', data);
  };

  /**
   * Получить информацио о техосмотре
   * @param data
   * @returns {Promise<*>}
   */
  @action getCheckup = async (data = {}) => {
    return await Api('garage/checkup', data);
  };

  /**
   * Обновление информации о техосмотре
   * @param data
   * @returns {Promise<*>}
   */
  @action updateCheckup = async (data = {}) => {
    return await Api('garage/checkup/update', data);
  };

  /**
   * Получить список страховок
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action getInsurance = async (data = {}) => {
    return await Api('garage/insurance', data);
  };

  /**
   * Обновить страховку
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action updateInsurance = async (data = {}) => {
    return await Api('garage/insurance/update', data);
  };


  /**
   * Получить заметки
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action getNotes = async (data = {}) => {
    return await Api('garage/notes', data);
  };

  /**
   * Удалить заметку
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action deleteNotes = async (data = {}) => {
    return await Api('garage/notes/delete', data);
  };

  /**
   * Добавть заметку
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action addNote = async (data = {}) => {
    return await Api('garage/notes/add', data);
  };

  /**
   * Обновить заметку
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action updateNote = async (data = {}) => {
    return await Api('garage/notes/update', data);
  };


  /**
   * Список обслуживания
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action getMaintenance = async (data = {}) => {
    return await Api('garage/maintenance', data);
  };

  /**
   * Добавление обслуживания
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action addMaintenance = async (data = {}) => {
    return await Api('garage/maintenance/create', data);
  };

  /**
   * Обновление обслуживания
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action updateMaintenance = async (data = {}) => {
    return await Api('garage/maintenance/update', data);
  };

  /**
   * Удаление обслуживания
   * @param data {object}
   * @returns {Promise<*>}
   */
  @action deleteMaintenance = async (data = {}) => {
    return await Api('garage/maintenance/delete', data);
  };
}

export default new Cars();