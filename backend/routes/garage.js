import Router from 'koa-router';
import Garage from '../models/garage';
//import Sessions from '../models/sessions';

const router = new Router();

router.post('/garage/cars', async (ctx) => {
    //await Sessions.check(ctx);
    ctx.body = await Garage.getCars(4)
});

router.post('/garage/cars/add', async (ctx) => {
    //await Sessions.check(ctx);
    ctx.body = await Garage.addCar(4, ctx.request.body);
});

module.exports = router.routes();
