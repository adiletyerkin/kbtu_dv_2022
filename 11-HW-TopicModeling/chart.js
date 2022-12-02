async function buildPlot() {
    console.log("Hello world");
    const data = await d3.csv("spacearxiv_new.csv");

    const yAccessor = (d) => d.y;
    const xAccessor = (d) => d.x;


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
    

    let xScaler = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return +d.x}, xAccessor))
        .range([dimension.margin.left, dimension.boundedWidth]);
    let yScaler = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return +d.y}, yAccessor))
        .range([dimension.margin.top, dimension.boundedHeight]);


    const yAxisGenerator = d3.axisLeft().scale(yScaler);
    const xAxisGenerator = d3.axisBottom().scale(xScaler);

    svg.append("g")
        .call(yAxisGenerator)
        .style("transform", `translateX(${dimension.margin.left}px)`) ;

    svg.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimension.boundedHeight}px)`);









}

buildPlot();