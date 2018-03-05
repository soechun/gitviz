/**
 *
 * @param {object} data
 * @return data of this format [{week:1, owner: commitCount, nonOwner: commitCount, all: commitCount}]
 */
function processParticipationData(data) {
  var temp = [];
  var all = data.all;
  var owner = data.owner;
  var length = all.length;
  for (var i = 0; i < length; i++) {
    var weekNo = length - i;
    var allCommitCount = all[i];
    var ownerCommitCount = owner[i];
    var nonOwnerCommitCount = allCommitCount - ownerCommitCount;
    temp.push({
      week: weekNo,
      owner: ownerCommitCount,
      nonOwner: nonOwnerCommitCount,
      all: allCommitCount
    });
  }
  return temp;
}
// data for commit per owner/all
// $.ajax({
//   url:
//     "https://api.github.com/repos/torvalds/linux/stats/participation?access_token=97642aeb49b46b4815569d492d3380e53129b90e",
//   data: {},
//   success: function(result) {
//     console.log(processParticipationData(result));
//   }
// });
