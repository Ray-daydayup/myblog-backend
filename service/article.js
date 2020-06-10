const articles = require('../controllers/articles')
const articlesTags = require('../controllers/articles_tags')
const {
  selectList,
  selectOne,
  selectBYTagId,
  selectCount
} = require('../controllers/article_view')
const {
  SUCCESS,
  USER_NO_PERMISSION,
  USER_ACCOUNT_ALREADY_EXIST
} = require('../utils/resCode')

async function selectCountService(ctx) {
  const data = await selectCount()
  const result = {
    ...data[0][0],
    ...data[1][0],
    ...data[2][0]
  }

  await SUCCESS(ctx, result)
}
async function selectListService(ctx, params) {
  let page = params.page
  params.page = (page - 1) * params.pagesize
  let result = []
  if (params.hasOwnProperty('tagId')) {
    result = await selectBYTagId(params)
  } else {
    result = await selectList(params)
  }
  await SUCCESS(ctx, removeDuplicates(result))
}

async function selectOneService(ctx, params) {
  const result = await selectOne(params)
  await SUCCESS(ctx, removeDuplicates(result)[0])
}

async function delService(ctx, params) {
  const userInfo = ctx.state.user
  if (userInfo.permission !== 1) {
    await USER_NO_PERMISSION(ctx)
    return
  }
  const articlesResult = await articles.del(params)
  await SUCCESS(ctx, {
    articlesLine: articlesResult.affectedRows
  })
}

async function updateService(ctx, params) {
  const userInfo = ctx.state.user
  if (userInfo.permission !== 1) {
    await USER_NO_PERMISSION(ctx)
    return
  }
  if (params.hasOwnProperty('title')) {
    const selectRes = await articles.select(params.title)
    if (selectRes[0]) {
      await USER_ACCOUNT_ALREADY_EXIST(ctx, '文章标题已存在')
      return
    }
  }
  const articlesResult = await articles.update(params)
  await SUCCESS(ctx, {
    line: articlesResult.affectedRows || articlesResult[0].affectedRows
  })
}
async function insertService(ctx, params) {
  const userInfo = ctx.state.user
  if (userInfo.permission !== 1) {
    await USER_NO_PERMISSION(ctx)
    return
  }
  const selectRes = await articles.select(params.title)
  if (selectRes[0]) {
    await USER_ACCOUNT_ALREADY_EXIST(ctx, '文章标题已存在')
    return
  }
  const articlesRes = await articles.insert(params)
  const articlesTagsParams = {
    articleId: articlesRes.insertId,
    tagsId: params.tagsId
  }
  const articlesTagsRes = await articlesTags.insert(articlesTagsParams)
  await SUCCESS(ctx, { articleId: articlesRes.insertId })
}

/**
 * 文章去重 （顺序没保障）
 *
 * @param {Array} arr 数组
 * @param {Boolean} flag 是否保存tag
 * @returns
 */
function removeDuplicates(arr, flag) {
  const result = {}
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i]
    let temp = {
      tagId: element.tag_id,
      name: element.tag
    }
    if (!result[element.article_id]) {
      delete element.tag
      delete element.tag_id
      result[element.article_id] = element
      result[element.article_id].tags = []
    }
    result[element.article_id].tags.push(temp)
  }
  return Object.values(result)
}
module.exports = {
  delService,
  updateService,
  insertService,
  selectListService,
  selectOneService,
  selectCountService
}
