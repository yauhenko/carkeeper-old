import db from "../../utils/db";
import { filterKeys } from "../../utils";

export interface ICheckup {
	car: number,
	notify: boolean,
	edate: Date | null,
}

export default class Checkup {

	public static async get(car: number): Promise<ICheckup> {
		let data = await db.one("SELECT * FROM cars_checkup WHERE car = ?", [ car ]);
		if(!data) {
			data = {
				car: car,
				notify: false,
				edate: null
			}
		}
		return <ICheckup>data;
	}

	public static async update(car: number, data: ICheckup): Promise<boolean> {
		data = <ICheckup>filterKeys(data, [ "notify", "edate" ]);
		data.car = car;
		await db.delete('cars_checkup', car, 'car');
		await db.insert('cars_checkup', data);
		return true;
	}
}
