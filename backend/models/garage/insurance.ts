import db from '../../utils/db';
import { error, filterKeys } from '../../utils';
import { ICar } from '../cars';

enum InsuranceType {
	regular = 'regular',
	casco = 'casco'
}

export interface IInsurance {
	id?: number,
	car: number,
	notify: boolean,
	edate?: Date,
	type: InsuranceType
}

export default class Insurance {

	public id: number;
	public data: IInsurance;

	constructor(data: IInsurance) {
		this.id = data.id;
		this.data = data;
	}

	public async update(data: IInsurance): Promise<boolean> {
		this.data = <IInsurance>filterKeys(Object.assign(this.data, data), [ 'notify', 'edate', 'type' ]);
		return await this.save();
	}

	public async save(): Promise<boolean> {
		return await db.update('cars_insurance', this.data, this.id);
	}

	public async delete(): Promise<boolean> {
		return await db.delete('cars_insurance', this.id);
	}

	// Static

	public static async list(car: ICar): Promise<Array<IInsurance>> {
		let data = await db.query('SELECT * FROM cars_insurance WHERE car = ?', car.id);
		if(!data.length) {
			await Insurance.add({
				car: car.id,
				notify: false,
				edate: null,
				type: InsuranceType.regular,
			});
			await Insurance.add({
				car: car.id,
				notify: false,
				edate: null,
				type: InsuranceType.casco,
			});
			return await Insurance.list(car);
		}
		return data;
	}

	public static async add(data: IInsurance): Promise<number> {
		return await db.insert('cars_insurance', filterKeys(data, [ 'car', 'notify', 'edate', 'type' ]));
	}

	public static async get(id: number): Promise<Insurance> {
		let data = await db.one('SELECT * FROM cars_insurance WHERE id = ?', [ id ]);
		if (!data) error('Страховка не существует', 404);
		return new Insurance(data);
	}

}
