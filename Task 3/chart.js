
let dimension = {
    width: window.innerWidth * 0.6,
    height: 800,
    margin: {
        top: 30,
        left: 30,
        bottom: 20,
        right: 30
    }
}
dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

function clean() {
    d3.select("svg").remove();
}


function buildPlot() {
    clean();
    const wrapper = d3.select("#wrapper");

    const svg = wrapper.append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height);

    const bounds = svg.append("g")
        .style("translate", `translate(${dimension.margin.left}px,${dimension.margin.top}px)`);

    const xAcc = d => d.x;
    const yAcc = d => d.y;

    let dataset1 = [];
    for (let i = 0; i < 50; i++) {
        let x = Math.floor((Math.random() * 10) + 1);
        let y = Math.floor((Math.random() * 10) + 1);
        dataset1.push({
            "x": x,
            "y": y
        });
    }


    let dataset2 = [];
    for (let i = 0; i < 50; i++) {
        let x = Math.floor((Math.random() * 10) + 1);
        let y = Math.floor((Math.random() * 10) + 1);
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
        .scale(xScale);

    const xAxis = svg.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimension.boundedHeight}px)`);

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale);

    const yAxis = svg.append("g")
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
        .attr("fill", "#FFFFFF")
        .attr("d", d3.symbol().type(d3.symbolCircle))
        .attr("transform", function (d) {
            return "translate(" + xScale(xAcc(d)) + "," + yScale(yAcc(d)) + ")";
        });

    let rhombus = bounds.selectAll("rhombus")
        .data(dataset2)
        .enter()
        .append("path")
        .attr("class", "rhombus")
        .attr("cx", d => xScale(xAcc(d)))
        .attr("cy", d => yScale(yAcc(d)))
        .attr("r", "1")
        .attr("stroke", "blue")
        .attr("fill", "#FFFFFF")
        .attr("d", d3.symbol().type(d3.symbolDiamond))
        .attr("transform", function (d) {
            return "translate(" + xScale(xAcc(d)) + "," + yScale(yAcc(d)) + ")";
        });


}


buildPlot()


