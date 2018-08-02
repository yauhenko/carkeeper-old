import db from '../db';

export default class Garage {

    static async getCars(user) {

        // return await db.aggregate('SELECT id, mark, model, generation, serie, modification FROM cars', [], {
        //     mark: { table: 'car_mark', fields: ['id', 'name'] },
        //     model: { table: 'car_model', fields: ['name'] },
        //     generation: { table: 'car_generation', fields: ['name'] },
        //     serie: { table: 'car_serie', fields: ['id', 'name'] },
        //     modification: { table: 'car_modification', fields: ['name'] },
        // });

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

    static async addCar(user, { mark, model, generation, modification, serie, year} = {}) {
        return await db.insert('cars', { user, mark, model, generation: generation || null, modification : modification || null, serie: serie || null, year });
    }

    static async getCar(id) {
        return await db.aggregateOne('SELECT id, user, mark, model, generation, serie, modification FROM cars WHERE id = ?', [id], {
            mark: { table: 'car_mark', fields: ['id', 'name'] },
            model: { table: 'car_model', fields: ['name'] },
            generation: { table: 'car_generation', fields: ['name'] },
            serie: { table: 'car_serie', fields: ['id', 'name'] },
            modification: { table: 'car_modification', fields: ['name'] },
        });
    }



}
