const dois = require('./dois.json');
const fs = require('fs');
const main = function (getData) {
  let g = getGroup(dois.list, 30);
  g.forEach((list, index) => {
    getListData(list, getData);
  });
  // getData(`10.1016/j.molcel.2009.09.013`, (data) => {
  //   console.log(data);
  // });
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
    console.log(item.index + '已经存在');
    index ++;
    getListData(list, getData, index);
  }
  
}
const getGroup = function (list, num) {
  let group = [];
  for (let i = 0; i < num; i++) {
    group.push([]);
  };
  list.forEach((item, index) => {
    group[index % num].push({
      index: index,
      doi: item
    });
  });
  return group;
}
const writeData = function (index, data) {
  try{
    data = JSON.stringify(data);
  }catch(err){
    console.log(data);
    console.log(`解析错误 ${index}`);
  }
  try{
    fs.writeFileSync(`./data/${index}.json`, data);
  }catch(err){
    console.log(err);
    console.log(`写入错误 ${index}`);
  }
}
module.exports.main = main;