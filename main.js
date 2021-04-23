const main = function (getData) {
  getData(`10.1016/j.molcel.2009.09.013`, (data) => {
    console.log(data);
  });
}
module.exports.main = main;