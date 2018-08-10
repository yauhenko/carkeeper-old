import { observable, action} from 'mobx';
import Api from "../modules/Api";
import Notification from "../components/Notification";

class Cars {
  @observable loading = false;

  @observable initialCar = Object.freeze({
    mark: String(),
    year: String(),
    model: String(),
    generation: String(),
    serie: String(),
    modification: String()
  });

  @observable car = Object.assign({}, this.initialCar);

  @observable cars = [];

  @observable marks = [];
  @observable models = [];
  @observable generations = [];
  @observable series = [];
  @observable modifications = [];

  @observable carDetail = {};

  @action getCar = (id) => {
    this.loading = true;
    return Api('garage/cars/get', {id}).then((response) => {
      this.carDetail = response;
      console.log(response)
      this.loading = false;
    }).catch(Notification);
  };

  @action getCars = () => {
    this.loading = true;
    return Api('garage/cars', {}).then((response) => {
      this.cars = response;
      this.loading = false;
    }).catch(Notification);
  };

  @action addCar = () => {
    return Api('garage/cars/add', this.car).then((response) => {
    }).catch(Notification);
  };

  @action deleteCar = (id) => {
    return Api('garage/cars/delete', {id}).then((response) => {
    }).catch(Notification);
  };

  @action getMarks = () => {
    return Api('cars/marks', {}).then((response) => {
      this.marks = response;
      console.log(response)
    }).catch(Notification);
  };

  @action getModels = () => {
    if(!this.car.mark) return;
    return Api('cars/models', {mark: this.car.mark}).then((response) => {
      this.models = response;
    }).catch(Notification);
  };

  @action getGenerations = () => {
    if(!this.car.model || this.car.year.length !== 4) return;
    return Api('cars/generations', {model: this.car.model, year: this.car.year }).then((response) => {
      this.generations = response || [];
    }).catch(Notification);
  };

  @action getSeries = () => {
    if(!this.car.generation) return;
    return Api('cars/series', {generation: this.car.generation}).then((response) => {
      this.series = response || [];
      console.log(response)
    }).catch(Notification);
  };

  @action getModifications = () => {
    if(!this.car.serie) return;
    return Api('cars/modifications', {serie: this.car.serie}).then((response) => {
      this.modifications = response || [];
      console.log(response)
    }).catch(Notification);
  }
}

export default new Cars();