import * as Router from "koa-router";
import Geo from "../models/geo";

const router = new Router();

router.post("/geo/regions", async (ctx) => {
	ctx.body = await Geo.getRegions();
});

router.post("/geo/districts", async (ctx) => {
	let id = ctx.request.body.region;//ctx.checkBody('region').notEmpty().toInt().value;
	ctx.body = await Geo.getDistricts(id);
});

router.post("/geo/cities", async (ctx) => {
	let region = ctx.request.body.region;//ctx.checkBody('region').default(0).toInt().value;
	let district = ctx.request.body.district;//ctx.checkBody('district').default(0).toInt().value;
	let name = ctx.request.body.name;//ctx.checkBody('name').optional().value;
	ctx.body = await Geo.getCities({ region, district, name });
});

export default router.routes();
