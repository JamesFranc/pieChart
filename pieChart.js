// Used the following resources in building this pie chart 
// http://bl.ocks.org/d3noob/a22c42db65eb00d4e369 for tooltips
// Kent English's D3 Legend example https://github.com/zeroviscosity/d3-js-step-by-step/blob/master/step-3-adding-a-legend.html
// and http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart for a basic pie chart layout


var dataset = [{ 'label': "tests", 'value': 15 }, { 'label': "homework", 'value': 30 }, { 'label': "participation", 'value': 10 }, { 'label': "projects", 'value': 55 }
];
var colorPalette = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];

dataset.sort(function (a, b) {
    return a.value < b.value;
});

function getColorPalette() {
    return this.colorPalette;
}

var width,
    height = 200,
    radius,
    color = d3.scaleOrdinal().range(getColorPalette()),
    svg = d3.select('#pie-chart')
        .append('svg') 
        .attr('width', '100%');

width = d3.select('#pie-chart').node().offsetWidth;


var g = svg.attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + 100 + ',' + 100 + ')');

radius = Math.min(width, height) / 2;

var pie = d3.pie()
    .value(function (d) { return d.value; })
    .sort(null);

var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

var path = g.selectAll("path")
    .data(pie(dataset))
    .enter().append("path")
    .on("mouseover", function (d) {
        console.log(d);
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html(d.data.label + "<br/>" + d.value)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mousemove", function (d) {
        div.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
    })
    .attr('fill', function (d, i) {
        return color(i);
    })
    .transition()
    .duration(500)
    .attrTween('d', function (d) {
        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function (t) {
            d.endAngle = i(t);
            return arc(d);
        }
    });
var legendRectSize = 22;
var legendSpacing = 6;
var vert = 0;
var svgLegend = d3.select('#chart-legend')
        .append('svg')
        .attr('width', '100%');
var legend = svgLegend.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = height * color.domain().length / 2;
        // var horz = 2 * legendRectSize;
        vert = i * height;
        return 'translate(' + 0 + ',' + vert + ')';
    });

legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .attr("rx", 4)
    .attr("ry", 4)
    .style('stroke', color);
legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d, i) { return dataset[i].label; });
legend.append('text')
    .attr('x', 3)
    .attr('y', .5 * legendRectSize + legendSpacing)
    .style('fill', 'white')
    .text(function (d, i) { return dataset[i].value; });

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);