import db from '../utils/db';
import { error } from '../utils';
import Sessions from './sessions';

class User {

  static brief = ['id', 'role', 'tel', 'email', 'avatar', 'name', 'username', 'city'];

  static async list () {
    return await db.query('SELECT ?? FROM users', [User.brief]);
  }

  static async login (tel, password, ip = null, ttl = 3600) {
    tel = String(tel).replace(/[^0-9]/g, '');
    let user = await db.one('SELECT ?? FROM users WHERE tel = ? AND `password` = PASSWORD(?)', [User.brief, tel, password]);
    if(!user) error(`Неправильный tel или пароль`);
    return {
      token: await Sessions.create(user.id, ip, ttl),
      user
    };
  }

  static async get (id, field = 'id', silent = false) {
    let user = await db.one('SELECT ?? FROM users WHERE ?? = ?', [User.brief, field, id]);
    if(user) return user;
    if(silent) return null;
    error(`Нет пользователя с ${field} ${id}`);
  }

  static async create (role, tel, password, email) {
    tel = String(tel).replace(/[^0-9]/g, '');
    if (!tel.match(/^375(25|29|33|44|24)[0-9]{7}$/)) error('Кривой номер телефона', 40001);
    if (await db.get('users', tel, { pk: 'tel', fields: 'id'})) error('Телефон уже зарегистрирован', 40002);
    if (await db.get('users', email, { pk: 'email', fields: 'id'})) error('E-mail уже зарегистрирован', 40003);
    const res = await db.query(`INSERT INTO users (role, tel, password, email) VALUES (?, ?, PASSWORD(?), ?)`,
        [role, tel, password, email]);
    return res.insertId;
  }

  static async delete (id) {
    return await db.delete('users', id);
  }

  static async setPassword(id, password) {
    await db.query('UPDATE users SET password = PASSWORD(?) WHERE id = ?', [password, id]);
  }

  static async update (id, data) {
    return await db.update('users', data, id);
  }

}

export default User;
