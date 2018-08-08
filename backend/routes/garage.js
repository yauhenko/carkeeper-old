import Router from 'koa-router';
import Garage from '../models/garage';
import Sessions from '../models/sessions';
import error from '../utils/error';

const router = new Router();

router.post('/garage/cars', async (ctx) => {
    await Sessions.check(ctx);
    ctx.body = await Garage.getCars(ctx.user.id)
});

router.post('/garage/cars/get', async (ctx) => {
    await Sessions.check(ctx);
    let id = ctx.checkBody('id').notEmpty().toInt().value;
    let car = await Garage.getCar(id);
    if(ctx.errors) error(ctx.errors);
    if(car.user !== ctx.user.id) error('В доступе отказано', 403);
    ctx.body = car;
});

router.post('/garage/cars/add', async (ctx) => {
    await Sessions.check(ctx);
    ctx.body = await Garage.addCar(ctx.user.id, ctx.request.body);
});

router.post('/garage/cars/update', async (ctx) => {
    await Sessions.check(ctx);
    let id = ctx.checkBody('id').notEmpty().toInt().value;
    let car = await Garage.getCar(id);
    if(ctx.errors) error(ctx.errors);
    if(car.user !== ctx.user.id) error('В доступе отказано', 403);
    ctx.body = await Garage.updateCar(car.id, ctx.request.body);
});

router.post('/garage/cars/delete', async (ctx) => {
    await Sessions.check(ctx);
    let id = ctx.checkBody('id').notEmpty().toInt().value;
    let car = await Garage.getCar(id);
    if(ctx.errors) error(ctx.errors);
    if(car.user !== ctx.user.id) error('В доступе отказано', 403);
    ctx.body = await Garage.deleteCar(car.id);
});

module.exports = router.routes();
