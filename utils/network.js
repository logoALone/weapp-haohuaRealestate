const URI = 'https://house.haowuwang.cn/house/infa'
const fetch = require('./fetch')

/**
 * 抓取豆瓣电影特定类型的API
 * https://developers.douban.com/wiki/?title=movie_v2
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise 
 */
function fetchApi(path, params) {
  return fetch(URI, path, params)
}

function login(code) {
  const params = { code: code }
  return fetchApi('login', params).then(res => res.data)
}

function loadHomedata(cityname, openid) {
  const params = { cityname: cityname, openid: openid }
  return fetchApi('index', params).then(res => res.data)
}
 
function signin(userid) {
  const params = { userid: userid }
  return fetchApi('signin', params).then(res => res.data)
}

function houseDetail(houseid, userid) {
  const params = { 
                    houseid: houseid,
                    userid: userid 
                  }
  return fetchApi('houseDetail', params).then(res => res.data)
}

module.exports = { login, loadHomedata, signin }