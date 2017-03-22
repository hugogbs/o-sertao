  var
            width = 1000,
            height = 500;

        var svg = d3.select("#chart")
                .append("svg")
                .attr('version', '1.1')
                .attr('viewBox', '0 0 '+width+' '+height)
                .attr('width', '100%')
                .attr('class', 'map-chart');

        var projection = d3.geoAlbers()
        .center([-41.083760, -9.309294])
        .rotate([0, 0])
        .parallels([0, 0])
        .scale(1700);

        var path = d3.geoPath().projection(projection);

        var color = d3.scaleThreshold();
        var subtitleScale = d3.scaleOrdinal([d3.rgb(1, 87, 155, 1.0), d3.rgb(1, 87, 155, 0.8), d3.rgb(1, 87, 155, 0.6),
         d3.rgb(1, 87, 155, 0.4), d3.rgb(1, 87, 155, 0.2), d3.rgb(244,67,54), "#9E9E9E"]);


        g = svg.append("g")
        .attr("transform", "translate(20,20)");

        d3.queue()
            .defer(d3.json, "data/municipios_sab.json")
            .defer(d3.csv, "data/dados_sab.csv")
            .await(draw);

        function draw(error, sab, dados_sab) {
            if (error) throw error;

            var municipios = topojson.feature(sab, sab.objects.municipios_sab);

            color
                .domain([0.5, 500, 1000, 5000, 10000, 20000])
                .range([d3.rgb(244,67,54), d3.rgb(1, 87, 155, 0.2), d3.rgb(1, 87, 155, 0.4),
                 d3.rgb(1, 87, 155, 0.6), d3.rgb(1, 87, 155, 0.8), d3.rgb(1, 87, 155, 1.0)]);

              svg.selectAll(".municipios")
                .data(municipios.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("id", function(d) { return "area-"+d.properties.ID; });

                for (var i = 0; i < dados_sab.length; i++) {
                    svg.select("#area-"+dados_sab[i].geocodigo)
                        .attr("fill", function() {
                            if (isNaN(dados_sab[i].consumo_agua_1000m3)) {
                                return "#9E9E9E";
                            } else {
                                return color(+dados_sab[i].consumo_agua_1000m3);
                            }
                        })
                }

                 var legend = g.selectAll(".legend")
                    .data(["Acima de 10 milhões m³", "Entre 5 e 10 milhões m³", "Entre 1 e 5 milhões m³", "Entre 500.000 e 1 milhão m³",
                     "Abaixo de 500.000 m³", "0 m³", "Não Há Dados"])
                    .enter().append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(-" + 30 * 10 + ", " + (i+5) * 20 + ")"; })
                      .style("font", "14px sans-serif");

                  legend.append("rect")
                      .attr("x", width + 18)
                      .attr("width", 18)
                      .attr("height", 18)
                      .attr("fill", subtitleScale);

                  legend.append("text")
                      .attr("x", width + 44)
                      .attr("y", 9)
                      .attr("dy", ".35em")
                      .attr("text-anchor", "start")
                      .text(function(d) { return d; });
    }

