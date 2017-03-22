        var   width = 1000,
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
        .scale(12000);

          g = svg.append("g")
        .attr("transform", "translate(20,20)");

        var div = d3.select("#chart").append("div")
          .attr("class", "tooltip")
          .style("opacity", 1);

        var path = d3.geoPath().projection(projection);

        var color = d3.scaleThreshold();
        var subtitleScale = d3.scaleOrdinal([d3.rgb(0, 96, 100, 1.0), d3.rgb(0, 96, 100, 0.8), d3.rgb(0, 96, 100, 0.6), d3.rgb(0, 96, 100, 0.4), d3.rgb(0, 96, 100, 0.2), "#FFAB91"]);

        d3.queue()
            .defer(d3.json, "data/municipios_sab.json")
            .defer(d3.csv, "data/municipios_sab.csv")
            .await(draw);

        function draw(error, sab, dados_sab) {
            if (error) throw error;

            // desenhando municipios

            var municipios = topojson.feature(sab, sab.objects.municipios_sab);

            color
                .domain([20, 40, 60, 80, 100])
                .range([d3.rgb(0, 96, 100, 1.0), d3.rgb(0, 96, 100, 0.8), d3.rgb(0, 96, 100, 0.6), d3.rgb(0, 96, 100, 0.4), d3.rgb(0, 96, 100, 0.2)]);



              svg.selectAll(".municipios")
                .data(municipios.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr('class', 'municipio')
                .attr("id", function(d) { return "area-"+d.properties.ID; });

                for (var i = 0; i < dados_sab.length; i++) {
                    svg.select("#area-"+dados_sab[i].GEOCODIGO1)
                        .attr("fill", function() {
                            if (isNaN(dados_sab[i].POPULACAO_URBANA)) {
                                return "#FFAB91";
                            } else {
                                 return color(+dados_sab[i].POPULACAO_URBANA);
                            }
                        })
                }

                  var legend = g.selectAll(".legend")
                    .data(["Entre 81% e 100%", "Entre 61% e 80%", "Entre 41% e 60%", "Entre 21% e 40%", "20% ou menos", "Não Há Dados"])
                    .enter().append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(-" + 220 + ", " + (i+5) * 20 + ")"; })
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

