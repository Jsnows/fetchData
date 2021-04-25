const xlsx = require('node-xlsx');
const fs = require('fs');
let fileName = '50000';
// const workSheetsFromFile = xlsx.parse(`${__dirname}/${fileName}.xlsx`);
// const allData = workSheetsFromFile[0].data;
let all = 137566;

let workSheetsFromFile = [{
  name: 'sheet1',
  data: Array(all)
}]
const allData = workSheetsFromFile[0].data;
for (let i = 0; i < allData.length; i++){
  allData[i] = [];
}

const dataKey = ['reader_count_by_country', 'reader_count_by_subject_area'][0];

let startCol = allData[0].length + 1;
let status = {};

console.log('读取完成');
for (let i = 1; i < all; i++) {
  let data = require(`./data/${i-1}.json`)[0] || {};
  
  // if (data.identifiers && allData[i][0] && allData[i][0].toLowerCase() != data.identifiers.doi.toLowerCase()) {
  //   console.log(i, '不相等');
  //   console.log(`${allData[i][0]} - ${data.identifiers.doi}`);
  // }
  if (i % 10000 === 0) {
    console.log(i);
  }
  let itemData = data[dataKey];
  if (itemData) {
    let keys = Object.keys(itemData);
    keys.forEach(key => {
      let colNum = status[key];
      if (colNum !== undefined) {
        // if (!allData[i][colNum]) {
          try{
            allData[i][colNum] = itemData[key];
          }catch(err){
            console.log(i);
            console.log(allData[i]);
            console.log(colNum);
            console.log(`${key} - ${itemData[key]}`);
          }
        // }
      } else {
        status[key] = startCol;
        allData[0][startCol] = key;
        allData[i][startCol] = itemData[key];
        startCol++;
      }
    });
  }
  
}
let nData = xlsx.build([workSheetsFromFile[0]]);
fs.writeFileSync('./nData.xlsx', nData);
