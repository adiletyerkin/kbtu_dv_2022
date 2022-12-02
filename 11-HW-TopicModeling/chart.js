async function buildPlot() {
    console.log("Hello world");
    const data = await d3.csv("spacearxiv.csv");

    const dateParser = d3.timeParse("%Y-%m-%d");

    const yAccessor = d => d.y;
    const xAccessor = (d) => dateParser(d.date_publ2);
    let category = "cluster";

    var dimension = {
        width: window.innerWidth*0.9,
        height: 600,
        margin: {
            top: 30,
            left: 30,
            bottom: 30,
            right: 30
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    let wrapper = d3.select("#wrapper").append("svg");
    wrapper.attr("width", dimension.width);
    wrapper.attr("height", dimension.height);
    let container = wrapper.append("g");
    container.attr("transform", `translate(${dimension.margin.left}, ${dimension.margin.top})`);


    let xScaler = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([dimension.margin.left, dimension.boundedWidth]);
    let yScaler = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return +d.y}, yAccessor))
        .range([dimension.margin.top, dimension.boundedHeight]);


    const yAxisGenerator = d3.axisLeft().scale(yScaler);
    const xAxisGenerator = d3.axisBottom().scale(xScaler);

    container.append("g")
        .call(yAxisGenerator)
        .style("transform", `translateX(${dimension.margin.left}px)`) ;

    container.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimension.boundedHeight}px)`);

    let colorsheme = d3.scaleOrdinal(d3.schemeCategory10);

    let circles = container.selectAll("circle")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "circle")
        .attr("cx", d => xScaler(xAccessor(d)))
        .attr("cy", d => yScaler(yAccessor(d)))
        .attr("r", "1")
        .attr("stroke-width", 1)
        .style("fill", function(d) {
            return colorsheme(d[category])})
        .attr("d", d3.symbol().type(d3.symbolCircle))
        .attr("transform", function (d) {
            return "translate(" + xScaler(xAccessor(d)) + ","
                + yScaler(yAccessor(d)) + ")";
        });

    container.append('text')
        .attr('x', dimension.boundedWidth / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-size', 20)
        .text('Timeline');
    container.append('text')
        .attr('x', dimension.boundedWidth + 8)
        .attr('y', dimension.boundedHeight -2)
        .attr('text-anchor', 'middle')
        .style('font-size', 12)
        .text('timeline');
    container.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(0, 20)')
        .style('font-size', 12)
        .text('Y- value');

}

buildPlot();