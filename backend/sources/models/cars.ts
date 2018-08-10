import db from "../utils/db";
import { ICarGeneration, ICarMark, ICarModel, ICarModification, ICarSerie } from "./garage";

export default class Cars {

	static async getMarks(): Promise<Array<ICarMark>> {
		return await db.query("SELECT id, name FROM car_mark ORDER BY name ASC");
	}

	static async getModels(mark: number): Promise<Array<ICarModel>> {
		return await db.query("SELECT id, name FROM car_model WHERE mark = ? ORDER BY name ASC", [ mark ])
	}

	static async getGenerations(model: number): Promise<Array<ICarGeneration>> {
		return await db.query("SELECT id, name, year_begin, year_end FROM car_generation WHERE model = ? " +
			" ORDER BY year_begin ASC, name ASC", [ model ]);
	}

	static async getSeries(generation: number): Promise<Array<ICarSerie>> {
		return await db.query("SELECT id, name FROM car_serie WHERE generation = ? ORDER BY name ASC", [ generation ]);
	}

	static async getModifications(serie: number): Promise<Array<ICarModification>> {
		return await db.query("SELECT id, name, year_begin, year_end FROM car_modification WHERE serie = ? " +
			" ORDER BY name ASC", [ serie ]);
	}

}
