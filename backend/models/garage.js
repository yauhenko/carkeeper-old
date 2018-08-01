import db from '../db';

export default class Garage {

    static async getCars(user) {
        return await db.query('SELECT ' +
            ' c.id, c.year, ' +
            ' mark.id AS mark_id, mark.name AS mark_name, ' +
            ' model.id AS model_id, model.name AS model_name, ' +
            ' generation.id AS generation_id, generation.name AS generation_name, ' +
            ' serie.id AS serie_id, serie.name AS serie_name, ' +
            ' modification.id AS modification_id, modification.name AS modification_name ' +
            ' FROM cars c ' +
            ' LEFT JOIN car_mark mark ON mark.id = c.mark ' +
            ' LEFT JOIN car_model model ON model.id = c.model ' +
            ' LEFT JOIN car_generation generation ON generation.id = c.generation ' +
            ' LEFT JOIN car_serie serie ON serie.id = c.serie ' +
            ' LEFT JOIN car_modification modification ON modification.id = c.modification ' +
            ' WHERE user = ?', [user]);
    }

    static async addCar(user, car = {}) {
        car.user = user;
        return await db.insert('cars', car);
    }

}
