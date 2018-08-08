import db from '../utils/db';
import error from "../utils/error";
import User from "./user";

export default class Sessions {
  static async check(ctx, roles = []) {
    let token = ctx.request.body.token;
    ctx.token = token;
    if(!token) error("Токен не указан");
    let session = await Sessions.get(token);
    if(session.ip && session.ip !== ctx.ip) error('IP изменился. Авторизуйтесь заново', 40101);
    ctx.user = await User.get(session.user);
    ctx.role = ctx.user.role;
    db.query('UPDATE sessions SET access_date = now() WHERE token = ?', [token]);
    if(roles.length && roles.indexOf(ctx.role) === -1) error('Ошибка доступа');
  }

  static async clean() {
    await db.query('DELETE from sessions WHERE timestampdiff(minute, access_date, now()) > 60')
  }

  static async get(token) {
    let session = await db.query('SELECT * from sessions WHERE token = ?', [token]);
    if(session.length) return session[0];
    error("Invalid token")
  }

  static async create(id, ip = null) {
    function generate_token(length){
      const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
      const b = [];
      for (let i=0; i<length; i++) {
        const j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
      }
      return b.join("");
    }

    let token = generate_token(32);
    await db.query('INSERT INTO sessions (token, user, ip) VALUES(?, ?, ?)', [token, id, ip]);
    return token;
  }

  static async destroy(token) {
    return await db.delete('sessions', token, 'token');
  }

}
