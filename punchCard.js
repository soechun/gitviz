var Days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
var Times = [7,8,9,10,11,12,13,14,15,16,17,18,19];

const margin = {top: 50, right: 0, bottom: 100, left: 30},
          width = 500 - margin.left - margin.right,
          height = 400  - margin.top - margin.bottom,
          gridSize = Math.floor(width / 13),
          legendElementWidth = gridSize*1,
          buckets = 9,
          colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

const svg2 = d3.select("#svg2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const dayLabels = svg2.selectAll(".dayLabel")
    .data(Days)
    .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", (d, i) => i * gridSize)
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
      .attr("class", (d, i) => ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"));

const timeLabels = svg2.selectAll(".timeLabel")
    .data(Times)
    .enter().append("text")
      .text((d) => d)
      .attr("x", (d, i) => i * gridSize)
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + gridSize / 2 + ", -6)")
      .attr("class", (d, i) => ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"));

function processPertimeData(result) {
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
function drawPertimeGraph(data) {
    console.log(data);

    const colorScale = d3.scaleQuantile()
      .domain([0, buckets - 1, d3.max(data, (d) => d.commits)])
      .range(colors);

    const cards = svg2.selectAll(".time")
        .data(data, (d) => d.day+':'+d.time);
    console.log(cards)

    cards.append("title");

    cards.enter().append("rect")
        .attr("x", (d) =>  Times.indexOf(d.time) * gridSize)
        .attr("y", (d) => Days.indexOf(d.day)* gridSize)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "time bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0])
      .merge(cards)
        .transition()
        .duration(1000)
        .style("fill", (d) =>  colorScale(d.commits));

    cards.select("title").text((d) => d.commits);

    cards.exit().remove();

    const legend = svg2.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), (d) => d);

    const legend_g = legend.enter().append("g")
        .attr("class", "legend");

    legend_g.append("rect")
      .attr("x", (d, i) => legendElementWidth * i)
      .attr("y", height)
      .attr("width", legendElementWidth)
      .attr("height", gridSize / 2)
      .style("fill", (d, i) => colors[i]);

    legend_g.append("text")
      .attr("class", "mono")
      .text((d) => "≥ " + Math.round(d))
      .attr("x", (d, i) => legendElementWidth * i)
      .attr("y", height + gridSize);

    legend.exit().remove();
}


      

     
// data for commit per time per day
$.ajax({
  url:
    "https://api.github.com/repos/torvalds/linux/stats/punch_card?access_token="+access_token,
  success: function(result) {
    var data = processPertimeData(result);
    drawPertimeGraph(data);
  }
});
