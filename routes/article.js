const router = require('koa-router')()
const ParamCheck = require('../middleWares/paramCheck')
const {
  selectListService,
  selectOneService,
  insertService,
  delService,
  updateService,
  selectCountService
} = require('../service/article')

router.prefix('/article')

router.post('/list/:page/:pagesize', async function (ctx, next) {
  const params = {
    page: parseInt(ctx.params.page),
    pagesize: ctx.params.pagesize ? parseInt(ctx.params.pagesize) : 10,
    ...ctx.request.body
  }
  console.log(params)
  let schema = {
    page: new ParamCheck().isNumber().min(1).isRequired(),
    pagesize: new ParamCheck().isNumber().min(1).isRequired(),
    moreDetail: new ParamCheck().isBoolean().isRequired(),
    tagId: new ParamCheck().isNumber().min(1),
    categoryId: new ParamCheck().isNumber().min(1)
  }
  await ParamCheck.check(params, schema, ctx)
  await selectListService(ctx, params)
})

router.get('/list/count', async function (ctx, next) {
  await selectCountService(ctx)
})
router.get('/list/search', async function (ctx, next) {
  const params = ctx.request.body
  let schema = {
    page: new ParamCheck().isNumber().min(1).isRequired(),
    pagesize: new ParamCheck().isNumber().min(1).isRequired()
  }
  await ParamCheck.check(params, schema, ctx)
  await selectListService(ctx, params)
})

router.get('/list/:id', async function (ctx, next) {
  const params = {
    articleId: parseInt(ctx.params.id)
  }
  let schema = {
    articleId: new ParamCheck().isNumber().min(1).isRequired()
  }
  await ParamCheck.check(params, schema, ctx)
  await selectOneService(ctx, params)
})
router.post('/add', async function (ctx, next) {
  const params = ctx.request.body
  let schema = {
    title: new ParamCheck().isString().min(1).isRequired(),
    abstract: new ParamCheck().isString().min(1).isRequired(),
    content: new ParamCheck().isString().min(1).isRequired(),
    createtime: new ParamCheck().isNumber().min(1).isRequired(),
    categoryid: new ParamCheck().isNumber().min(1).isRequired(),
    state: new ParamCheck().isNumber().isRequired(),
    tagsId: new ParamCheck().isArray().min(1).isRequired()
  }
  await ParamCheck.check(params, schema, ctx)
  await insertService(ctx, params)
})
router.post('/update', async function (ctx, next) {
  const params = ctx.request.body
  let schema = {
    articleId: new ParamCheck().isNumber().min(1).isRequired(),
    title: new ParamCheck().isString().min(1),
    abstract: new ParamCheck().isString().min(1),
    content: new ParamCheck().isString().min(1),
    modifiedtime: new ParamCheck().isNumber().min(1),
    categoryid: new ParamCheck().isNumber().min(1),
    state: new ParamCheck().isNumber(),
    tagsId: new ParamCheck().isArray().min(1)
  }
  await ParamCheck.check(params, schema, ctx)
  await updateService(ctx, params)
})
router.post('/del/:id', async function (ctx, next) {
  const params = {
    articleId: parseInt(ctx.params.id)
  }
  let schema = {
    articleId: new ParamCheck().isNumber().min(1).isRequired()
  }
  await ParamCheck.check(params, schema, ctx)
  await delService(ctx, params)
})

module.exports = router
