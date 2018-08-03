import koa from 'koa';
import Body from 'koa-body';
import './utils/cron';

const app = new koa();

app.use(Body());

require('koa-validate')(app);

app.use(async (ctx, next)=>{
  console.log(ctx.req.url, ctx.request.body);

  try {
    await next();
    ctx.body = {result: ctx.body}
  } catch (e) {
    console.log(e);
    ctx.body = {error: e}
  }
});

app.use(require('./routes/user'));
app.use(require('./routes/auth'));
app.use(require('./routes/cars'));
app.use(require('./routes/garage'));

app.listen(8000);

console.log('Server listening on port 8000');
