import Router from 'koa-router';
import Geo from '../models/geo';
import { error } from '../utils';

const router = new Router();

router.post('/geo/regions', async (ctx) => {
  ctx.body = await Geo.getRegions();
});

router.post('/geo/districts', async (ctx) => {
    let id = ctx.checkBody('region').notEmpty().toInt().value;
    if(ctx.errors) error(ctx.errors);
    ctx.body = await Geo.getDistricts(id);
});

router.post('/geo/cities', async (ctx) => {
    let region = ctx.checkBody('region').default(0).toInt().value;
    let district = ctx.checkBody('district').default(0).toInt().value;
    let name = ctx.checkBody('name').optional().value;
    if(ctx.errors) error(ctx.errors);
    ctx.body = await Geo.getCities({ region, district, name });
});

module.exports = router.routes();
