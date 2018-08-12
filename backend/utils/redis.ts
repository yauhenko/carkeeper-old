import * as Redis from 'redis';
const asyncRedis = require('async-redis');

const redis = Redis.createClient();
asyncRedis.decorate(redis);

export default {

	get: async (key: string): Promise<any> => {
		let data = await redis.get(key);
		return JSON.parse(String(data) || 'null');
	},

	set: async (key: string, data: any, ttl: number = 0): Promise<void> => {
		await redis.set(key, JSON.stringify(data), 'EX', ttl);
	},

	del: async (key: string): Promise<void> => {
		await redis.del(key);
	},

	core: redis

};
