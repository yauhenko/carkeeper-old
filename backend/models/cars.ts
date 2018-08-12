import db from "../utils/db";
import { IInsurance } from "./garage/insurance";
import { ICheckup } from "./garage/checkup";


export interface ICarMark {
	id: number,
	name: string
}

export interface ICarModel {
	id: number,
	mark: number,
	name: string
}

export interface ICarGeneration {
	id: number,
	model: number,
	name: string,
	year_begin: number | null,
	year_end: number | null
}

export interface ICarModification {
	id: number,
	model: number,
	serie: number,
	name: string,
	year_begin: number | null,
	year_end: number | null
}

export interface ICarSerie {
	id: number,
	model: number,
	generation: number,
	name: string,
}

export interface ICar {
	id: number,
	user: number,
	mark: ICarMark,
	model: ICarModel,
	year: number,
	generation: ICarGeneration | null,
	serie: ICarSerie | null,
	modification: ICarModification | null,
	image: string | null,
	insurance?: Array<IInsurance>,
	checkup?: ICheckup
}

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
