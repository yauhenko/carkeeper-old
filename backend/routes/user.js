import Router from 'koa-router';
import User from '../models/user';
import Sessions from '../models/sessions';
import { error } from '../utils';

const router = new Router();

router.post('/users/list', async (ctx) => {
    await Sessions.check(ctx);
    ctx.body = await User.list(ctx.request.body);
});

router.post('/users/login', async (ctx) => {
    const password = ctx.checkBody('password').notEmpty().len(6).value;
    const tel = ctx.checkBody('tel').notEmpty().value;
    const ttl = ctx.checkBody('ttl').default(3600).toInt().value;
    const noip = ctx.checkBody('noip').default(false).toBoolean().value;
    console.log('noip', noip);
    if (ctx.errors) error(ctx.errors);
    ctx.body = await User.login(tel, password, noip ? null : ctx.ip, ttl);
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
    const ttl = ctx.checkBody('ttl').default(3600).toInt().value;
    const noip = ctx.checkBody('noip').default(false).toBoolean().value;
    if (ctx.errors) error(ctx.errors);
    let id = await User.create(role, tel, password, email);
    ctx.body = { user: await User.get(id), token: await Sessions.create(id, noip ? null : ctx.ip, ttl) };
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
    let avatar = ctx.checkBody('avatar').optional().len(36, 36).value;
    let name = ctx.checkBody('name').optional().len(2, 50).value;
    let username = ctx.checkBody('username').optional().match(/^[a-z][a-z0-9-_.]{1,18}$/i).value;
    if (ctx.errors) error(ctx.errors);
    if (password) await User.setPassword(id, password);
    let update = {};
    if (email) update.email = email;
    if (avatar) update.avatar = avatar;
    if (name) update.name = name;
    if (username) update.username = username;

    ctx.body = {
        updated: Boolean(await User.update(id, update)),
    };
});

module.exports = router.routes();
