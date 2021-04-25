const xlsx = require('node-xlsx');
const fs = require('fs');
let fileName = 'n';
const workSheetsFromFile = xlsx.parse(`${__dirname}/${fileName}.xlsx`);
const allData = workSheetsFromFile[0].data;

let startCol = 10;
let personStatus = {};

allData[0].forEach((item, index) => {
  if (index >= startCol) {
    personStatus[item] = index;
  };
});
startCol = allData[0].length;

for (let i = 1; i < 137566; i++) {
  let data = require(`./data/${i-1}.json`)[0] || {};
  let personData = data.reader_count_by_academic_status;
  if (personData) {
    allData[i][8] = data.title;
    allData[i][9] = data.reader_count;
    let keys = Object.keys(personData);
    keys.forEach(key => {
      let colNum = personStatus[key];
      if (colNum) {
        if (!allData[i][colNum]) {
          allData[i][colNum] = personData[key];
        }
      } else {
        personStatus[key] = startCol;
        allData[0][startCol] = key;
        allData[i][startCol] = personData[key];
        startCol++;
      }
    });
  }
  
}
let nData = xlsx.build([workSheetsFromFile[0]]);
fs.writeFileSync('./nData.xlsx', nData);
