var svgWidth = 960;
var svgHeight = 540;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 70
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function (census) {

    census.forEach
        (function (data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
        });

    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.min(census, d => d.poverty)])
        .range([width, 0]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(census, d => d.healthcare)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g").call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(census)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "11")

    chartGroup.append("g")
        .selectAll('text')
        .data(census)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .classed(".stateText", true)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .style("font-weight", "bold")
        .attr("alignment-baseline", "central");

    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
        return `${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`;
      });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "aText active")
        .text("Lacks Healthcare (%)");

    chartGroup
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText active")
        .text("In Poverty (%)");
})
