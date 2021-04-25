const dois = require('./dois.json');
const fs = require('fs');
const main = function (getData) {
  // getData('10.1007/978-3-319-66673-0', (data) => {
  //   console.log(data);
  // })
  let g = getGroup(dois.list, 30);
  g.forEach((list, index) => {
    getListData(list, getData);
  });
}

const getListData = function (list, getData, index) {
  index = index || 0;
  let item = list[index];
  if (!item) {
    console.log('完成');
    return
  }
  let filePath = `${__dirname}/data/${item.index}.json`;
  if (!fs.existsSync(filePath)) {
    getData(item.doi, (data) => {
      console.log(item.index);
      writeData(item.index, data);
      index ++;
      getListData(list, getData, index);
    });
  } else {
    // console.log(item.index + '已经存在');
    index ++;
    getListData(list, getData, index);
  }
  
}
const getGroup = function (list, num) {
  let group = [];
  for (let i = 0; i < num; i++) {
    group.push([]);
  };
  let _num = 0;
  list.forEach((item, index) => {
    let filePath = `${__dirname}/data/${index}.json`;
    if (!fs.existsSync(filePath)) {
      group[(index - _num) % num].push({
        index: index,
        doi: item
      });
    } else {
      _num ++;
    }
  });
  return group;
}
const writeData = function (index, data) {
  // try{
  //   data = JSON.stringify(data);
  // }catch(err){
  //   console.log(data);
  //   console.log(`解析错误 ${index}`);
  // }
  try{
    fs.writeFileSync(`./data/${index}.json`, data);
  }catch(err){
    console.log(err);
    console.log(`写入错误 ${index}`);
  }
}
// main();
module.exports.main = main;