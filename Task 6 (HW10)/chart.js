async function buildPlot() {
    console.log("Hello world");
    const data = await d3.csv("data.csv");
    const data_umap = await d3.csv("data_umap.csv");

    const yAccessor = (d) => d.y;
    const xAccessor = (d) => d.x;
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 500,
        margin: {
            top: 15,
            left: 30,
            bottom: 15,
            right: 10
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);

    let data_all = d3.merge([data, data_umap])

    let xScaler = d3.scaleLinear()
        .domain(d3.extent(data_all, function(d) { return +d.x}, xAccessor))
        .range([dimension.margin.left, dimension.boundedWidth]);
    let yScaler = d3.scaleLinear()
        .domain(d3.extent(data_all, function(d) { return +d.y}, yAccessor))
        .range([dimension.margin.top, dimension.boundedHeight]);


    const yAxisGenerator = d3.axisLeft().scale(yScaler);
    const xAxisGenerator = d3.axisBottom().scale(xScaler);

    svg.append("g")
        .call(yAxisGenerator)
        .style("transform", `translateX(${dimension.margin.left}px)`) ;

    svg.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimension.boundedHeight}px)`);

    svg.append('text')
        .attr('x', dimension.boundedWidth + 20)
        .attr('y', dimension.boundedHeight)
        .attr('text-anchor', 'middle')
        .style('font-size', 12)
        .text('X axis');

    svg.append('text')
        .attr('x', 25)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .style('font-size', 12)
        .text('Y axis');

    var color = d3.scaleOrdinal()
        .domain(['0', '1', '2'])
        .range(["#53c433", "#d24572", "#fde725ff"])

    let circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "circle")
        .attr("cx", d => xScaler(xAccessor(d)))
        .attr("cy", d => yScaler(yAccessor(d)))
        .attr("r", "1")
        .attr("stroke", "green")
        .attr("fill", function (d) { return color(d.label)})
        .attr("d", d3.symbol().type(d3.symbolCircle))
        .attr("transform", function (d) {
            return "translate(" + xScaler(xAccessor(d)) + "," + yScaler(yAccessor(d)) + ")";
        });


    let square = svg.selectAll("square")
        .data(data_umap)
        .enter()
        .append("path")
        .attr("class", "square")
        .attr("cx", d => xScaler(xAccessor(d)))
        .attr("cy", d => yScaler(yAccessor(d)))
        .attr("r", "1")
        .attr("fill", function (d) { return color(d.label)})
        .attr("d", d3.symbol().type(d3.symbolSquare))
        .attr("transform", function (d) {
            return "translate(" + xScaler(xAccessor(d)) + "," + yScaler(yAccessor(d)) + ")";
        });

}

buildPlot();