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
function drawPerHourGraph(data) {
    console.log(data);
}
// data for commit per hour per day
$.ajax({
  url:
    "https://api.github.com/repos/torvalds/linux/stats/punch_card?access_token="+access_token,
  success: function(result) {
    var data = processPerHourData(result);
    drawPerHourGraph(data);
  }
});
