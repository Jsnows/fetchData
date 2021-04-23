const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});
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

function main(access_token) {
  console.log(access_token);
}


function getCode(url) {
  let urlJson = new URL(url);
  let code = urlJson.searchParams.get('code');
  getToken(code, (access_token) => {
    main(access_token);
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
