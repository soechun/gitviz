var z = d3
    .scaleOrdinal()
    .range([
    "#abdbf2",
    "#84caec",
    "#5cbae5",
    "#27a3dd",
    "#1b7eac",
    "#156489",
    "#d7eaa2",
    "#c6e17d",
    "#b6d957",
    "#9dc62d",
    "#759422",
    "#5b731a",
    "#fde5bd",
    "#fbd491",
    "#fac364",
    "#f8ac29",
    "#dd8e07",
    "#b57506",
    "#d5dadc",
    "#bac1c4",
    "#9ea8ad",
    "#848f94",
    "#69767c",
    "#596468",
    "#f99494",
    "#f66364",
    "#f33334",
    "#dc0d0e",
    "#b90c0d",
    "#930a0a"
    ]);

function processLanguages(result) {
    let repoSet = new Set();
    let langSet = new Set();
    var temp = [];
    var dataset = [];
    var test = [];
    var size = 0;
    for (var i = 0; i < result.length; i++) {
        var item = result[i]

        test.push($.ajax({
            url: item['languages_url'] + "?access_token=" + access_token,
            _repo: item.name
        }).then(function (data) {
            var tem = {};
            tem['repo'] = this._repo;
            let tempLanSet = new Set();
            for (var key in data) {
                repoSet.add(this._repo);
                langSet.add(key);
                tempLanSet.add(key);
                tem[key] = data[key]/1000;
                size = size + 1;
            }
            tem['lanContained'] = tempLanSet;
            dataset.push(tem)
            dataset['repoSet'] = repoSet;
            dataset['langSet'] = langSet;
            dataset['len'] = size;
        }));
    }
    $
        .when
        .apply(this, test)
        .then(function () {
            drawLanguageGraph(dataset)
        });
    return temp
}
function drawLanguageGraph(data) {
    var svg1 = d3.select("#svg1"),
    margin = {
        top: 60,
        right: 100,
        bottom: 30,
        left: 100
    },

    width = +svg1.attr("width") - margin.left - margin.right,
    height = +svg1.attr("height") - margin.top - margin.bottom,
    
    g = svg1
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let keys = Array.from(data.langSet);
    var rangeList = [];
    var rangeAxisXList = [];
    barWidth = (width - 200) / (data.len) ;  
    var offset=20; 
    for (k = 0; k < data.length; k++) { 
        rangeList.push(offset); 
        rangeAxisXList.push(offset+data[k].lanContained.size * barWidth/2);
        offset = offset+data[k].lanContained.size * barWidth + 15;
    }

    var x0 = d3.scaleOrdinal()
        .domain(data.map(function (d) {
                return d.repo;
                }))
        .range(rangeList);

    var x0Axis = d3.scaleOrdinal()
        .domain(data.map(function (d) {
                return d.repo;
                }))
        .range(rangeAxisXList);


    var repoX1 = {};
    for (k = 0; k < data.length; k++) { 
        repoX1[data[k].repo] = d3
                .scaleBand()
                .padding(0.05).domain(Array.from(data[k].lanContained))
                .rangeRound([0, barWidth*(data[k].lanContained.size)]);
    }

   

    var y = d3.scaleLog().domain([0.01,d3.max(data, function(d) {
        return d3.max(keys, function(key) {
            return d[key];
        })
    })])
    .range([height,0])

    g
        .append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + x0(d.repo) + ",0)";
        })
        .selectAll("rect")
        .data(function (d) {
            return Array.from(d.lanContained).map(function (key) {
                return {repo: d.repo, key: key, value: d[key]};
            });
        })
 
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return repoX1[d.repo](d.key);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("width", function(d) {
          return repoX1[d.repo].bandwidth();
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr("fill", function (d) {
            return z(d.key);
        });

    g
        .append("g")
        .attr("class", "axis")
        .data(data)
        .attr("transform", "translate(0,"+height+")")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0Axis));

    g
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) -10)
        .attr("dy", "0.1em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Total kilobytes for the language");

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
            return "translate(65," + i * 20 + ")";
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
$.ajax({
    url: "https://api.github.com/users/torvalds/repos?access_token=" + access_token,
    success: function (result) {
        var data = processLanguages(result);
        // drawLanguageGraph(data)
    }
})
