import * as Router from "koa-router";
import { render } from "../utils";
import { Context } from "koa";

const router = new Router();

router.get("/admin/", async (ctx) => {
	ctx.body = await render('admin/index', { user: { name : 'abc'}});
});

router.post("/admin/", async (ctx: Context) => {
	if(ctx.request.body.username === 'admin' && ctx.request.body.password === 'admin') {
		ctx.body = 'ok';
	} else {
		ctx.body = await render('admin/index', { error: 'Access Forbidden'});
	}
});


export default router.routes();
