var svg1 = d3.select("#svg1"),
    margin = {
        top: 40,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = +svg1.attr("width") - margin.left - margin.right,
    height = +svg1.attr("height") - margin.top - margin.bottom,
    g = svg1
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3
    .scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3
    .scaleBand()
    .padding(0.05);

// var y = d3
//     .scaleLinear()
//     .rangeRound([height, 0]);

var z = d3
    .scaleOrdinal()
    .range([
        "#55efc4",
        "#81ecec",
        "#74b9ff",
        "#a29bfe",
        "#dfe6e9",
        "#00b894",
        "#00cec9",
        "#0984e3",
        "#6c5ce7",
        "#b2bec3",
        "#ffeaa7",
        "#fab1a0",
        "#ff7675",
        "#fd79a8",
        "#636e72",
        "#fdcb6e",
        "#e17055",
        "#d63031",
        "#e84393",
        "#2d3436",
        "#f3a683",
        "#f19066",
        "#786fa6",
        "#574b90",
        "#f8a5c2",
        "#f78fb3",
        "#63cdda",
        "#3dc1d3",
        "#ea8685",
        "#e66767",
        "#f7d794",
        "#f5cd79",
        "#778beb",
        "#546de5"
    ]);

function processLanguages(result) {
    let repoSet = new Set();
    let langSet = new Set();
    var temp = [];
    var dataset = [];
    var test = [];
    for (var i = 0; i < result.length; i++) {
        var item = result[i]

        test.push($.ajax({
            url: item['languages_url'] + "?access_token=" + access_token,
            _repo: item.name
        }).then(function (data) {
            var tem = {};
            tem['repo'] = this._repo;
            for (var key in data) {
                repoSet.add(this._repo);
                langSet.add(key);
                tem[key] = data[key];
            }
            dataset.push(tem)
            dataset['repoSet'] = repoSet;
            dataset['langSet'] = langSet;
            console.log(tem)
        }));
    }
    $
        .when
        .apply(this, test)
        .then(function () {
            console.log('temp', dataset.length);
            drawLanguageGraph(dataset)
        });
    console.log(temp);
    return temp
}
function drawLanguageGraph(data) {
    console.log(data[0]);
    // var keys = data.columns.slice(1, -1);
    let keys = Array.from(data.langSet);
    x0.domain(data.map(function (d) {
        return d.repo;
    }));
    x1
        .domain(keys)
        .rangeRound([
            0, x0.bandwidth()
        ]);
    var y = d3.scaleLog().domain([10000000,d3.max(data, function(d) {
        return d3.max(keys, function(key) {
            return d[key];
        })
    })])
    .range([height,0])
    // y.domain([
    //     0,
    //     d3.max(data, function (d) {
    //         return d3.max(keys, function (key) {
    //             return d[key];
    //         });
    //     })
    // ]).nice();

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
            return keys.map(function (key) {
                return {key: key, value: d[key]};
            });
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x1(d.key);
        })
        .attr("y", function (d) {
            return y(d.value
                ? d.value
                : 0);
        })
        .attr("width", x1.bandwidth())
        .attr("height", function (d) {
            return height - y(d.value
                ? d.value
                : 0);
        })
        .attr("fill", function (d) {
            return z(d.key);
        });

    g
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    g
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 10)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Total bytes for the language");

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
$.ajax({
    url: "https://api.github.com/users/torvalds/repos?access_token=" + access_token,
    success: function (result) {
        var data = processLanguages(result);
        // drawLanguageGraph(data)
    }
})
