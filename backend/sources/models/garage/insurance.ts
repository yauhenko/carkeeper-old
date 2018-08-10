import { ICar } from '.';
import db from "../../utils/db";
import {error} from "../../utils";

enum InsuranceType {
    regular,
    casco
}

export interface IInsurance {
    id?: number,
    car?: number,
    notify?: boolean,
    edate?: Date,
    type?: InsuranceType
}

export default class Insurance {

    constructor(public data: IInsurance) {

    }

    public async update(data: IInsurance): Promise<boolean> {
        this.data = Object.assign(this.data, data);
        return await this.save();
    }

    public async save(): Promise<boolean> {
        return await db.update('cars_insurance', this.data, this.data.id);
    }

    public async delete(): Promise<boolean> {
        return await db.delete('cars_insurance', this.data.id);
    }

    public static async add(data: IInsurance): Promise<number> {
        return await db.insert('cars_insurance', data);
    }

    public static async list(car: ICar): Promise<Array<IInsurance>> {
        return await db.query('SELECT * FROM cars_insurance WHERE car = ?', car.id);
    }

    public static async get(id: number): Promise<Insurance> {
        let data = await db.one('SELECT * FROM cars_insurance WHERE id = ?', [id]);
        if(!data) error('Страховка не существует', 404);
        return new Insurance(data);
    }

}
