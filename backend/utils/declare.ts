import { Context } from 'koa'
import { Files } from 'formidable';

declare module 'koa' {

	interface Context {
		user: { id: number, role: string };
		errors: Array<any>,
		token: string,
		role: any,
		render(template: string, data?: {}): any,
		request: Request,
		session?: any,
	}

	interface Request {
		body?: any;
		files?: Files;
	}

}
