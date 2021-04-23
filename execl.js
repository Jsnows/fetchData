const xlsx = require('node-xlsx');
const fs = require('fs');
let fileName = 'n';
// const workSheetsFromFile = xlsx.parse(`${__dirname}/${fileName}.xlsx`);
// const allData = workSheetsFromFile[0].data;

function writeFile() {
  let bf = xlsx.build(workSheetsFromFile);
  fs.writeFile('./new.xlsx', bf);
};

function getDOIS(colIndex) {
  let arr = allData.map(item => {
    return item[colIndex];
  });
  let list = {list:arr};
  fs.writeFileSync('./dois.json', JSON.stringify(list));
}
// getDOIS(0);
console.log(require('./dois.json').list.length);
// console.log(allData.length);
module.exports.writeFile = writeFile;