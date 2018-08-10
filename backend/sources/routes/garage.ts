import * as Router from 'koa-router';
import Garage from '../models/garage';
import Sessions from '../models/sessions';
import { error } from '../utils';
import Insurance from "../models/garage/insurance";

const router = new Router();

router.post('/garage/cars', async (ctx) => {
    await Sessions.check(ctx);
    ctx.body = await Garage.getCars(ctx.user.id)
});

router.post('/garage/cars/get', async (ctx) => {
    await Sessions.check(ctx);
    let id = ctx.request.body.id;//ctx.checkBody('id').notEmpty().toInt().value;
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
    let id = ctx.request.body.id;//ctx.checkBody('id').notEmpty().toInt().value;
    let car = await Garage.getCar(id);
    if(ctx.errors) error(ctx.errors);
    if(car.user !== ctx.user.id) error('В доступе отказано', 403);
    ctx.body = await Garage.updateCar(car.id, ctx.request.body);
});

router.post('/garage/cars/delete', async (ctx) => {
    await Sessions.check(ctx);
    let id = ctx.request.body.id;//ctx.checkBody('id').notEmpty().toInt().value;
    let car = await Garage.getCar(id);
    if(ctx.errors) error(ctx.errors);
    if(car.user !== ctx.user.id) error('В доступе отказано', 403);
    ctx.body = await Garage.deleteCar(car.id);
});

router.post('/garage/cars/insurance', async (ctx) => {
    await Sessions.check(ctx);
    let car = await Garage.getCar(Number(ctx.request.body.car || 0));
    if(car.user !== ctx.user.id) error('В доступе отказано', 403);
    ctx.body = await Insurance.list(car);
});

router.post('/garage/cars/insurance/create', async (ctx) => {
    await Sessions.check(ctx);
    let car = await Garage.getCar(Number(ctx.request.body.car || 0));
    if(car.user !== ctx.user.id) error('В доступе отказано', 403);
    let id = await Insurance.add({
        car: car.id,
        notify: Boolean(ctx.request.body.notify),
        type: ctx.request.body.type || 'regular',
        edate: ctx.request.body.edate
    });
    ctx.body = { created: true, id };
});

router.post('/garage/cars/insurance/update', async (ctx) => {
    await Sessions.check(ctx);
    const insurance = await Insurance.get(Number(ctx.request.body.id || 0));
    let car = await Garage.getCar(insurance.data.car);
    if(car.user !== ctx.user.id) error('В доступе отказано', 403);
    ctx.body = { updated: await insurance.update({
        notify: Boolean(ctx.request.body.notify),
        edate: ctx.request.body.edate
    })};
});

router.post('/garage/cars/insurance/delete', async (ctx) => {
    await Sessions.check(ctx);
    const insurance = await Insurance.get(Number(ctx.request.body.id || 0));
    let car = await Garage.getCar(insurance.data.car);
    if(car.user !== ctx.user.id) error('В доступе отказано', 403);
    ctx.body = { updated: await insurance.delete() };
});

export default router.routes();
