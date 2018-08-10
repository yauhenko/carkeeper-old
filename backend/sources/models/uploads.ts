import db from '../utils/db';
import * as fs from 'fs';
import { uuid } from '../utils';
import { mkdirp } from 'mkdirp';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const realpath = promisify(fs.realpath);
const mkdir = promisify(mkdirp);

export default class Uploads {

    static async save(name, data) {
        const id = uuid();
        const pub_dir = await realpath(__dirname + '/../public');
        const dir = '/uploads/' + id.substr(0, 2) + '/' + id.substr(0, 4) + '/' + id;
        const path = dir + '/' + name;
        await mkdir(pub_dir + dir);
        await writeFile(pub_dir + path, data);
        await db.insert('uploads', { id, name, path });
        return id;
    }

    static async getPath(id) {
        return (await db.get('uploads', id, { fields: 'path' })).path || null;
    }

}
