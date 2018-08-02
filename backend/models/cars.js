import db from '../utils/db';

export default class Cars {

    static async getMarks() {
        return await db.query('SELECT id, name FROM car_mark ORDER BY name ASC');
    }

    static async getModels(mark) {
        return await db.query('SELECT id, name FROM car_model WHERE mark = ? ORDER BY name ASC', [mark])
    }

    static async getGenerations(model) {
        return await db.query('SELECT id, name, year_begin, year_end FROM car_generation WHERE model = ? ' +
            ' ORDER BY year_begin ASC, name ASC', [model]);
    }

    static async getSeries(generation) {
        return await db.query('SELECT id, name FROM car_serie WHERE generation = ? ORDER BY name ASC', [generation]);
    }

    static async getModifications(serie) {
        return await db.query('SELECT id, name, year_begin, year_end FROM car_modification WHERE serie = ? ' +
            ' ORDER BY name ASC', [serie]);
    }

}
