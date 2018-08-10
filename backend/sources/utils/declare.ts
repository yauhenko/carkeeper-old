import { Context } from "koa"

declare module "koa" {
	interface Context {
		user: { id: number, role: string };
		errors: Array<any>,
		token: string,
		role: any
	}
}
