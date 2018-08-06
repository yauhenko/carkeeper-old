import koa from 'koa';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import koaValidate from 'koa-validate';
import './utils/cron';

const app = new koa();

app.use(koaStatic(__dirname + '/public'));
app.use(koaBody());

koaValidate(app);

app.use(async (ctx, next)=>{
  console.log(ctx.req.url, ctx.request.body);

  try {
    await next();
    ctx.body = {result: ctx.body}
  } catch (e) {
    console.log(e);
    ctx.body = {error: e}
  }

  console.log(ctx.body)
});

app.use(require('./routes/user'));
app.use(require('./routes/auth'));
app.use(require('./routes/cars'));
app.use(require('./routes/garage'));
app.use(require('./routes/uploads'));

app.listen(8000);

console.log('Server listening on port 8000');
