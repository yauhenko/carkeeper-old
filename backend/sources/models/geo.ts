import db from '../utils/db';

export default class Geo {

    static cache = {};

    static async getRegions(): Promise<Array<{}>> {
        return await db.query('SELECT id, name FROM geo_regions ORDER BY name ASC');
    }

    static async getDistricts(region: number): Promise<Array<{}>> {
        return await db.query('SELECT id, name FROM geo_districts WHERE region = ? ORDER BY name ASC', [region]);
    }

    static async getCities({ region = null, district = null, name = null} = {}): Promise<Array<{}>> {
        return await db.query('SELECT c.id, c.name, c.type, r.name region, d.name district FROM geo_cities c '
            + ' LEFT JOIN geo_regions r ON r.id = c.region'
            + ' LEFT JOIN geo_districts d ON d.id = c.district'
            + ' WHERE TRUE '
            + (region ? ' AND c.region = ' + db.escape(region) : '')
            + (district ? ' AND c.district = ' + db.escape(district) : '')
            + (name ? ' AND c.name LIKE ' + db.escape(name).replace(/'$/, "%'") : '')
            + ' ORDER BY c.district IS NULL DESC, c.type = "г." DESC, c.type = "гп." DESC, c.type = "аг." DESC, c.name ASC LIMIT 100');
    }

    static async getCity(id: number): Promise<{}> {
        let data = Geo.cache[id] || await db.aggregateOne('SELECT * FROM geo_cities WHERE id = ?', [id], {
            region: { table: 'geo_regions', fields: ['id', 'name'] },
            district: { table: 'geo_districts', fields: ['id', 'name'] },
        });
        return Geo.cache[id] = data;
    }

}
