const Nightmare = require('nightmare');
const nightmare = Nightmare();
const accountInfo = require('./account.json');
const { account, pwd, secret, id } = accountInfo;
const https = require('https');

let authUrl = 'https://api.mendeley.com/oauth/authorize' +
              '?client_id=9529' +
              '&redirect_uri=' + encodeURIComponent('https://www.baidu.com')+
              '&response_type=code'+
              '&scope=all'+
              '&state=' + Date.now()

let access_token = '';
let refresh_token = '';
let refreshing = false;
let task = [];

nightmare
  .goto(authUrl)
  .wait('#bdd-email')
  .type('#bdd-email', account)
  .click('#bdd-elsPrimaryBtn')
  .wait('#bdd-password')
  .type('#bdd-password', pwd)
  .click('#bdd-elsPrimaryBtn')
  .wait('#kw')
  .evaluate(() => {
    return window.location.href;
  })
  .end()
  .then(getCode);

function main() {
  getData(`10.1016/j.molcel.2009.09.013`, (data) => {
    console.log(data);
  });
  
}

function getData(doi, cb) {
  if (refreshing) {
    setTimeout(() => {
      console.log('监测到正在刷新token');
      getData(doi, cb);
    }, 1000);
  } else {
    let url = `https://api.mendeley.com/catalog/?doi=${doi}&view=stats`;
    let req = https.request(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    }, (res) => {
      let data = [];
      res.on('data', (chunk) => {
        data.push(chunk);
      });
      res.on('end', () => {
        data = JSON.parse(data.toString());
        cb(data);
      });
      res.on('error', (err) => {
        console.log(err);
      });
    });
    req.end();
  } 
}


function getCode(url) {
  console.log('登陆成功');
  let urlJson = new URL(url);
  let code = urlJson.searchParams.get('code');
  getToken(code, (access_token) => {
    refreshing = true;
    setTimeout(() => {
      getToken(refresh_token,() =>{
        refreshing = false;
      }, true);
    }, 5000);
    main();
  });
};

function getToken(code, cb, refresh) {
  let req = https.request('https://api.mendeley.com/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }, (res) => {
    let data = [];
    res.on('data', (chunk) => {
      data.push(chunk);
    });
    res.on('end', () => {
      let tokens = JSON.parse(data.toString());
      access_token = tokens.access_token;
      refresh_token = tokens.refresh_token;
      cb(access_token);
      // 50分钟刷新一次
      setTimeout(() => {
        refreshing = true;
        getToken(refresh_token,() =>{
          refreshing = false;
        }, true);
      }, 1000 * 60 * 50);
    });
    res.on('error', (err) => {
      console.log(err);
    })
  });
  req.write(`grant_type=${refresh ? 'refresh_token' : 'authorization_code'}&redirect_uri=${encodeURIComponent('https://www.baidu.com')}&${refresh ? 'refresh_token' : 'code'}=${code}`);
  req.end();
}


// const url = 'https://' + accountInfo.account + ':' + accountInfo.pwd + '@api.mendeley.com/oauth/token';

// request.get({url}, function (error, response, body) {
//    console.log(body);
// });
