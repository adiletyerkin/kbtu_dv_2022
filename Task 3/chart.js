async function buildPlot() {
    var dimension = {
        width: window.innerWidth * 0.9,
        height: 800,
        margin: {
            top: 30,
            left: 30,
            bottom: 20,
            right: 30
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;


    const wrapper = d3.select("#wrapper");

    const svg = wrapper.append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height);

    const bounds = svg.append("g")
        .style("translate", `translate(${dimension.margin.left}px,${dimension.margin.top}px)`);

    const xAcc = d => d.x;
    const yAcc = d => d.y;

    var dataset1 = [];
    for (var i = 0; i < 50; i++) {
        var x = Math.floor((Math.random() * 10) + 1);
        var y = Math.floor((Math.random() * 10) + 1);
        dataset1.push({
            "x": x,
            "y": y
        });
    };


    var dataset2 = [];
    for (var i = 0; i < 50; i++) {
        var x = Math.floor((Math.random() * 10) + 1);
        var y = Math.floor((Math.random() * 10) + 1);
        dataset2.push({
            "x": x,
            "y": y
        });
    };

    let dataset3 = d3.merge([dataset1, dataset2])

    let xScale = d3.scaleLinear()
        .domain(d3.extent(dataset3, xAcc))
        .range([dimension.margin.left, dimension.boundedWidth]);
    let yScale = d3.scaleLinear()
        .domain(d3.extent(dataset3, yAcc))
        .range([dimension.margin.top, dimension.boundedHeight]);


    const xAxisGenerator = d3.axisBottom()
        .scale(yScale);

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimension.boundedHeight}px)`);

    const yAxisGenerator = d3.axisLeft()
        .scale(xScale);

    const yAxis = bounds.append("g")
        .call(yAxisGenerator)
        .style("transform", `translateX(${dimension.margin.left}px)`);


    let circles = bounds.selectAll("circle")
        .data(dataset1)
        .enter()
        .append("path")
        .attr("class", "circle")
        .attr("cx", d => xScale(xAcc(d)))
        .attr("cy", d => yScale(yAcc(d)))
        .attr("r", "1")
        .attr("stroke", "green")
        .attr("stroke-width", 1)
        .attr("fill", "#FFFFFF")
        .attr("d", d3.symbol().type(d3.symbolCircle));

    let rhombus = bounds.selectAll("rhombus")
        .data(dataset2)
        .enter()
        .append("path")
        .attr("class", "rhombus")
        .attr("cx", d => xScale(xAcc(d)))
        .attr("cy", d => yScale(yAcc(d)))
        .attr("r", "1")
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("fill", "#FFFFFF")
        .attr("d", d3.symbol().type(d3.symbolDiamond));


}

async function clean() {
    d3.select("svg").remove();
}

buildPlot()
