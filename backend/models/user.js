import db from "../utils/db";
import error from "../module/error";
import Sessions from "./sessions";

class User {

  static async list () {
    return await db.query("SELECT id, role, tel, email FROM users");
  }

  static async login (tel, password, ip = null) {
    tel = String(tel).replace(/[^0-9]/g, "");
    let response = await db.query("SELECT id, role, tel, email FROM users WHERE tel=? AND `password` = PASSWORD(?)", [tel, password]);
    if(!response.length) error(`Неправильный tel или пароль`);
    return {
      token: await Sessions.create(response[0].id, ip),
      user: response[0]
    };
  }

  static async get (id, field = "id", silent = false) {
    let response = await db.query("SELECT id, role, tel, email FROM users WHERE ?? = ?", [field, id]);
    if(response.length) return response[0];

    if(silent) return null;
    error(`Нет пользователя с ${field} ${id}`);
  }

  static async create (role, tel, password, email) {
    tel = String(tel).replace(/[^0-9]/g, "");
    if (!tel.match(/^375(25|29|33|44|24)[0-9]{7}$/)) error("Кривой номер телефона", 40001);
    if (await db.get('users', tel, { pk: 'tel', fields: 'id'})) error("Телефон уже зарегистрирован", 40002);
    if (await db.get('users', email, { pk: 'email', fields: 'id'})) error("E-mail уже зарегистрирован", 40003);
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

  static async update (id, { tel, email } = {}) {
    return await db.update('users', { tel, email }, id);
  }

}

export default User;
