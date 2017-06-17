'use strict';

const db = require('../common/db');
const Analyzed = db.models.analyzed;
const moment = require('moment');
const _ = require('lodash');

module.exports = function (router) {
  // top5 pv
  router.get('/1/1', async function(ctx){
    const from = ctx.query.from;
    const to = ctx.query.to;
    if (!from || !to) {
      ctx.body = '';
      return;
    }
    const fromTime = moment.unix(from);
    const toTime = moment.unix(to);
    // top
    let replacements = {
      from: fromTime.toDate(),
      to: toTime.toDate(),
    }
    const top5 = await db.query(`
      SELECT \`host\`,
            path,
            count(*) as pv
      FROM analyzed
      WHERE \`time\` BETWEEN :from AND :to
      GROUP BY \`host\`,
              path
      ORDER BY count(*) DESC
      LIMIT 5;
    `, {
      replacements: replacements,
      type: db.QueryTypes.SELECT,
      raw: true,
    });

    // 时间分成24等份
    for (const one of top5) {
      replacements.host = one.host;
      replacements.path = one.path;

      const accessTimes = await db.query(`
        SELECT \`time\`
        FROM analyzed
        WHERE \`time\` BETWEEN :from AND :to AND \`host\` = :host AND path = :path;
      `, {
        replacements: replacements,
        type: db.QueryTypes.SELECT,
        raw: true,
      });

      const scopeTimes = _.groupBy(accessTimes, (accessTime) => {
        return moment(accessTime.time).hour()
      });
      one.scopeCount = _.map(scopeTimes, 'length');
    }
    ctx.body = top5;
  });

  // router.get('1/2', async function(ctx){
  //   const from = ctx.query.from;
  //   const to = ctx.query.to;
  //   if (!from || !to) {
  //     ctx.body = '';
  //     return;
  //   }
  //   const fromTime = moment(from);
  //   const toTime = moment(to);
  //   // top
  //   let replacements = {
  //     from: fromTime.toDate(),
  //     to: toTime.toDate(),
  //   }
  //   const top5 = await db.query(`
  //     SELECT \`host\`,
  //           path,
  //           count(*) as pv
  //     FROM analyzed
  //     WHERE \`time\` BETWEEN :from AND :to
  //     GROUP BY \`host\`,
  //             path
  //     ORDER BY count(*) DESC
  //     LIMIT 5;
  //   `, {
  //     replacements: replacements,
  //     type: db.QueryTypes.SELECT,
  //     raw: true,
  //   });
  // });

  // 搜索统计
  router.get('/3', async function(ctx){
    const from = ctx.query.from;
    const to = ctx.query.to;
    if (!from || !to) {
      ctx.body = '';
      return;
    }
    const fromTime = moment.unix(from);
    const toTime = moment.unix(to);

    let replacements = {
      from: fromTime.toDate(),
      to: toTime.toDate(),
    }
    const topSearch = await db.query(`
      SELECT search,
            path,
            count(*) as count
      FROM analyzed
      WHERE \`time\` BETWEEN :from AND :to and search != '' 
      GROUP BY search,
              path
      ORDER BY count(*) DESC;
    `, {
      replacements: replacements,
      type: db.QueryTypes.SELECT,
      raw: true,
    });

    ctx.body = topSearch;
  });

  // 设备统计
  router.get('/4', async function(ctx){
    
    const country = await db.query("select country, count(*) as count from  analyzed where country != '' group by country;", {
      type: db.QueryTypes.SELECT,
      raw: true,
    });
    const deviceType = await db.query("select deviceType, count(*) as count from  analyzed where deviceType != '' group by deviceType;", {
      type: db.QueryTypes.SELECT,
      raw: true,
    });
    const deviceVendor = await db.query("select deviceVendor, count(*) as count from  analyzed where deviceVendor != '' group by deviceVendor;", {
      type: db.QueryTypes.SELECT,
      raw: true,
    });
    const province = await db.query("select province, count(*) as count from  analyzed where province != '' and city !='' group by province;", {
      type: db.QueryTypes.SELECT,
      raw: true,
    });

    ctx.body = {
      country,
      deviceType,
      deviceVendor,
      province,
    };
  });
}