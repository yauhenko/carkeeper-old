import * as Router from 'koa-router';
import Sessions from '../models/sessions';
import Uploads from '../models/uploads';
import { error } from '../utils';

const router = new Router();

router.post('/uploads/save', async (ctx) => {
  await Sessions.check(ctx);
  const name = ctx.request.body.name;//ctx.checkBody('name').notEmpty().value;
  const data = ctx.request.body.data;//ctx.checkBody('data').notEmpty().isBase64().value;
  if(ctx.errors) error(ctx.errors);
  ctx.body = { id: await Uploads.save(name, Buffer.from(data, 'base64')) };
});

router.get('/uploads/:id', async (ctx) => {
  let path = await Uploads.getPath(ctx.params.id);
  ctx.redirect(path);
});

export default router.routes();
