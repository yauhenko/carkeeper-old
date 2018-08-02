import Router from 'koa-router';
import Garage from '../models/garage';
import Sessions from '../models/sessions';

const router = new Router();

router.post('/garage/cars', async (ctx) => {
    await Sessions.check(ctx);
    ctx.body = await Garage.getCars(ctx.user.id)
});

router.post('/garage/cars/add', async (ctx) => {
    await Sessions.check(ctx);
    ctx.body = await Garage.addCar(ctx.user.id, ctx.request.body);
});

module.exports = router.routes();
