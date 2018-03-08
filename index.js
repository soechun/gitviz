var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("background","white")
    .style("padding", "3px")
    .style("opacity", 0)
    .text("a simple tooltip");