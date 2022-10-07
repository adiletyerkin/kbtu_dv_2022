async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("./my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    // const yAccessor = (d) => d.temperatureMin;
    // const yAccessorHigh = (d) => d.temperatureHigh;
    // const xAccessor = (d) => dateParser(d.date);
    const xAccessor = d => d[temp];
    const yAccessor = d => d.length;
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");

    const bounds = wrapper.append("g")
        .style("translate",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(dataset,humidityAccessor))
        .range([0,dimensions.boundedWidth])
        .nice()

    const binsGen = d3.bin()
        .domain(xScaler.domain())
        .value(humidityAccessor)
        .thresholds(12);

    const bins = binsGen(dataset);
    console.log(bins);

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimensions.boundedHeight,0])

    const binGroup = bounds.append("g");
    const binGroups = binGroup.selectAll("g")
        .data(bins)
        .enter()
        .append("g");


    const barPadding = 1
    const barRect = binGroups.append("rect")
        .attr("x", d => xScaler(d.x0) + barPadding/2)
        .attr("y", d => yScaler(yAccessor(d)))
        .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
        .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)))
        .attr("fill", "#AAAAEE");

    const mean = d3.mean(dataset,humidityAccessor);
    console.log(mean);
    const meanLine = bounds.append("line")
        .attr("x1", xScaler(mean))
        .attr("x2", xScaler(mean))
        .attr("y1", -15)
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke","black")
        .attr("stroke-dasharray","2px 4px");

    const meanLabel = bounds.append("text")
        .attr("x",xScaler(mean))
        .attr("y",10)
        .text("Mean")
        .attr("fill","maroon")
        .attr("font-size","12px")
        .attr("text-anchor","middle");

    const xAxisGen = d3.axisBottom()
        .scale(xScaler);
    const xAxis = bounds.append("g")
        .call(xAxisGen)
        .style("transform",`translateY(${dimensions.boundedHeight}px)`);

    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => xScaler(d.x0) + (xScaler(d.x1)-xScaler(d.x0))/2)
        .attr("y", d => yScaler(yAccessor(d)) - 5)
        .text(yAccessor)
        .attr("fill","darkgrey")
        .attr("font-size","12px")
        .attr("text-anchor","middle");


}

buildPlot();