import db from '../utils/db';
import User from './user';
import { passgen, error } from '../utils';

export default class Sessions {

	static async check(ctx, roles = []): Promise<void> {
		let token = ctx.request.body.token;
		ctx.token = token;
		if (!token) error('Токен не указан');
		let session = await <any>Sessions.get(token);
		if (session.ip && session.ip !== ctx.ip) error('IP изменился. Авторизуйтесь заново', 40101);
		ctx.user = await User.get(session.user);
		ctx.role = ctx.user.role;
		db.query('UPDATE sessions SET edate = DATE_ADD(NOW(), INTERVAL ttl SECOND) WHERE token = ?', [ token ]);
		if (roles.length && roles.indexOf(ctx.role) === -1) error('Ошибка доступа');
	}

	static async clean(): Promise<void> {
		await db.query('DELETE from sessions WHERE edate < NOW()')
	}

	static async get(token: string): Promise<{}> {
		let session = await db.query('SELECT * from sessions WHERE token = ?', [ token ]);
		if (session.length) return session[ 0 ];
		error('Invalid token')
	}

	static async create(id: number, ip: string = null, ttl: number = 3600): Promise<string> {
		const token = passgen(64);
		await db.query('INSERT INTO sessions (token, user, ip, edate, ttl) ' +
			' VALUES(?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND), ?)', [ token, id, ip, ttl, ttl ]);
		return token;
	}

	static async destroy(token): Promise<Boolean> {
		return await db.delete('sessions', token, 'token');
	}

}
