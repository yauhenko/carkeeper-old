import db from '../../utils/db';
import { error } from '../../utils';
import { ICar } from '../cars';

export default class Garage {

	public static rules = {
		mark: { table: 'car_mark', fields: [ 'id', 'name' ] },
		model: { table: 'car_model', fields: [ 'id', 'name' ] },
		generation: { table: 'car_generation', fields: [ 'id', 'name', 'year_begin', 'year_end' ] },
		serie: { table: 'car_serie', fields: [ 'id', 'name' ] },
		modification: { table: 'car_modification', fields: [ 'id', 'name', 'year_begin', 'year_end' ] },
	};

	static async getCars(user: number): Promise<Array<ICar>> {
		return await db.aggregate('SELECT id, user, mark, model, year, generation, serie, modification, image ' +
			' FROM cars WHERE user = ?', [ user ], Garage.rules);
	}

	static async addCar(user: number, {
		mark = null, model = null, generation = null, modification = null,
		serie = null, year = null, image = null,
	} = {}): Promise<Boolean> {
		return await db.insert('cars', { user, mark, model, generation, modification, serie, year, image });
	}

	static async updateCar(id: number, data: {} = {}): Promise<boolean> {
		return await db.update('cars', id, data);
	}

	static async getCar(id: number): Promise<ICar> {
		let res = await db.aggregateOne('SELECT id, user, mark, model, year, generation, serie, modification, image ' +
			' FROM cars WHERE id = ?', [ id ], Garage.rules);
		if (!res) error('Машина не существует', 404);
		return res;
	}

	static async deleteCar(id: number): Promise<Boolean> {
		return await db.delete('cars', id);
	}

}
