var Days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
];
function processPerHourData(result) {
  var length = result.length;
  var temp = [];
  for (var i = 0; i < length; i++) {
    var item = result[i];
    var day = Days[item[0]];
    var time = item[1];
    var commits = item[2];
    if (time >= 7 && time <= 19) {
      temp.push({
        day: day,
        time: time,
        commits: commits
      });
    }
  }
  return temp;
}
// data for commit per hour per day
// $.ajax({
//   url:
//     "https://api.github.com/repos/torvalds/linux/stats/punch_card?access_token=97642aeb49b46b4815569d492d3380e53129b90e",
//   success: function(result) {
//     console.log(processPerHourData(result));
//   }
// });
