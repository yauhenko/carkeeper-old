import Router from 'koa-router';
import User from '../models/user';
import error from '../module/error';
import Sessions from '../models/sessions';

const router = new Router();

router.post('/users/list', async (ctx) => {
    await Sessions.check(ctx);
    ctx.body = await User.list(ctx.request.body);
});

router.post('/users/login', async (ctx) => {
    const password = ctx.checkBody('password').notEmpty().len(6).value;
    const tel = ctx.checkBody('tel').notEmpty().value;
    if (ctx.errors) error(ctx.errors);
    ctx.body = await User.login(tel, password, ctx.ip);
});

router.post('/users/get', async (ctx) => {
    let id = ctx.checkBody('id').notEmpty().toInt().value;
    if (ctx.errors) error(ctx.errors);
    ctx.body = await User.get(id);
});

router.post('/users/create', async (ctx) => {
    const role = ctx.checkBody('role').notEmpty().in(['seller', 'buyer']).value;
    const tel = ctx.checkBody('tel').notEmpty().value;
    const password = ctx.checkBody('password').notEmpty().len(6).value;
    const email = ctx.checkBody('email').notEmpty().isEmail().value;
    if (ctx.errors) error(ctx.errors);

    let id = await User.create(role, tel, password, email);

    ctx.body = { user: await User.get(id), token: await Sessions.create(id, ctx.ip) };
});

router.post('/users/delete', async (ctx) => {
    await Sessions.check(ctx, ['admin']);
    let id = ctx.checkBody('id').notEmpty().toInt().value;
    if (ctx.errors) error(ctx.errors);
    ctx.body = {
        deleted: Boolean(await User.delete(id)),
    };
});

router.post('/users/update', async (ctx) => {
    let id = null;
    await Sessions.check(ctx);

    if (ctx.role !== 'admin') {
        id = ctx.user.id;
    } else {
        id = ctx.checkBody('id').notEmpty().value;
    }

    let password = ctx.checkBody('password').optional().len(6).value;
    let email = ctx.checkBody('email').optional().isEmail().value;
    let avatar = ctx.checkBody('email').optional().len(36, 36).value;

    if (ctx.errors) error(ctx.errors);
    if (password) await User.setPassword(id, password);

    let update = {};
    if (email) update.email = email;
    if (avatar) update.avatar = avatar;

    ctx.body = {
        updated: Boolean(await User.update(id, update)),
    };
});

module.exports = router.routes();
