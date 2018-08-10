import { Context } from 'koa'

declare module 'koa' {
    interface Context {
        user: { id: number };
        errors: Array<any>,
        token: string,
        role: string
    }
}
