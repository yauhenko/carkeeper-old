import * as Router from "koa-router";
import Garage from "../models/garage";
import Sessions from "../models/sessions";
import Insurance from "../models/garage/insurance";
import { error } from "../utils";
import Checkup from "../models/garage/checkup";

const router = new Router();

router.post("/garage/cars", async (ctx) => {
	await Sessions.check(ctx);
	ctx.body = await Garage.getCars(ctx.user.id)
});

router.post("/garage/cars/get", async (ctx) => {
	await Sessions.check(ctx);
	let car = await Garage.getCar(ctx.request.body.id || 0);
	car.insurance = await Insurance.list(car);
	car.checkup = await Checkup.get(car.id);
	if (car.user !== ctx.user.id) error("В доступе отказано", 403);
	ctx.body = car;
});

router.post("/garage/cars/add", async (ctx) => {
	await Sessions.check(ctx);
	ctx.body = await Garage.addCar(ctx.user.id, ctx.request.body);
});

router.post("/garage/cars/update", async (ctx) => {
	await Sessions.check(ctx);
	let car = await Garage.getCar(ctx.request.body.id || 0);
	if (car.user !== ctx.user.id) error("В доступе отказано", 403);
	ctx.body = await Garage.updateCar(car.id, ctx.request.body);
});

router.post("/garage/cars/delete", async (ctx) => {
	await Sessions.check(ctx);
	let car = await Garage.getCar(ctx.request.body.id || 0);
	if (car.user !== ctx.user.id) error("В доступе отказано", 403);
	ctx.body = await Garage.deleteCar(car.id);
});

router.post("/garage/cars/insurance", async (ctx) => {
	await Sessions.check(ctx);
	let car = await Garage.getCar(ctx.request.body.car || 0);
	if (car.user !== ctx.user.id) error("В доступе отказано", 403);
	ctx.body = await Insurance.list(car);
});

router.post("/garage/cars/insurance/create", async (ctx) => {
	await Sessions.check(ctx);
	let car = await Garage.getCar(ctx.request.body.car || 0);
	if (car.user !== ctx.user.id) error("В доступе отказано", 403);
	ctx.body = { created: true, id: await Insurance.add(ctx.request.body) };
});

router.post("/garage/cars/insurance/update", async (ctx) => {
	await Sessions.check(ctx);
	const insurance = await Insurance.get(ctx.request.body.id || 0);
	let car = await Garage.getCar(insurance.data.car);
	if (car.user !== ctx.user.id) error("В доступе отказано", 403);
	ctx.body = { updated: await insurance.update(ctx.request.body) };
});

router.post("/garage/cars/insurance/delete", async (ctx) => {
	await Sessions.check(ctx);
	const insurance = await Insurance.get(ctx.request.body.id || 0);
	let car = await Garage.getCar(insurance.data.car);
	if (car.user !== ctx.user.id) error("В доступе отказано", 403);
	ctx.body = { deleted: await insurance.delete() };
});

router.post("/garage/cars/checkup/get", async (ctx) => {
	await Sessions.check(ctx);
	let car = await Garage.getCar(ctx.request.body.car || 0);
	if (car.user !== ctx.user.id) error("В доступе отказано", 403);
	ctx.body = await Checkup.get(car.id);
});


router.post("/garage/cars/checkup/update", async (ctx) => {
	await Sessions.check(ctx);
	let car = await Garage.getCar(ctx.request.body.car || 0);
	if (car.user !== ctx.user.id) error("В доступе отказано", 403);
	ctx.body = { updated: await Checkup.update(car.id, ctx.request.body) };
});

export default router.routes();
