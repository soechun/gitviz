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
    temp.push({week: weekNo, owner: ownerCommitCount, nonOwner: nonOwnerCommitCount, all: allCommitCount});
    temp['columns'] = ['week', 'owner', 'nonOwner'];
  }
  return temp;
}
function drawParticipationGraph(data) {

  console.log(data)

  var svg = d3.select("#svg"),
    margin = {
      top: 20,
      right: 80,
      bottom: 100,
      left: 50
    },
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + 20 + ")");

  var x = x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3
        .scaleLinear()
        .range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory10);

  var line = d3
    .line()
    .curve(d3.curveBasis)
    .x(function (d) {
      return x(d.week);
    })
    .y(function (d) {
      return y(d.commitCount);
    });

  var keys = data
    .columns
    .slice(1, 3);
  console.log(data.map(function (d) {
    return d.week;
  }));
  var userCategories = data
    .columns
    .slice(1)
    .map(function (id) {
      return {
        id: id,
        values: data.map(function (d) {
          return {week: d.week, commitCount: d[id]};
        })
      };
    });

  x.domain(data.map(function(d) { return d.week; }));

  y.domain([
    d3
      .min(userCategories, function (c) {
        return d3.min(c.values, function (d) {
          return d.commitCount;
        });
      }),
    d3.max(userCategories, function (c) {
      return d3.max(c.values, function (d) {
        return d.commitCount;
      });
    })
  ]);

  z.domain(userCategories.map(function (c) {
    return c.id;
  }));

  g
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  g
    .append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Number of commits");

  var user = g
    .selectAll(".user")
    .data(userCategories)
    .enter()
    .append("g")
    .attr("class", "user");

  user
    .append("path")
    .attr("class", "line")
    .attr("d", function (d) {
      return line(d.values);
    })
    .style("stroke", function (d) {
      return z(d.id);
    });

  var legend = g
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function (d) {
      return d;
    });

}
// data for commit per owner/all
$.ajax({
  url: "https://api.github.com/repos/torvalds/linux/stats/participation?access_token=" + access_token,
  data: {},
  success: function (result) {
    var data = processParticipationData(result);
    drawParticipationGraph(data);
  }
});
