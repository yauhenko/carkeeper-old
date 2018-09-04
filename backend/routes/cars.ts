import * as Router from 'koa-router';
import Cars from '../models/cars';
import { error } from '../utils';

const router = new Router();

router.post('/cars/marks', async (ctx) => {
	ctx.body = await Cars.getMarks();
});

router.post('/cars/models', async (ctx) => {
	let id = ctx.request.body.mark;//ctx.checkBody('mark').notEmpty().toInt().value;
	if (ctx.errors) error(ctx.errors);
	ctx.body = await Cars.getModels(id);
});

router.post('/cars/generations', async (ctx) => {
	let id = ctx.request.body.model;//ctx.checkBody('model').notEmpty().toInt().value;
	if (ctx.errors) error(ctx.errors);
	ctx.body = await Cars.getGenerations(id);
});

router.post('/cars/series', async (ctx) => {
	let id = ctx.request.body.generation;//ctx.checkBody('generation').notEmpty().toInt().value;
	if (ctx.errors) error(ctx.errors);
	ctx.body = await Cars.getSeries(id);
});

router.post('/cars/modifications', async (ctx) => {
	let id = ctx.request.body.serie;//ctx.checkBody('serie').notEmpty().toInt().value;
	if (ctx.errors) error(ctx.errors);
	ctx.body = await Cars.getModifications(id);
});


export default router.routes();