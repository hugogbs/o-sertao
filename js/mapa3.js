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
        .scale(1800);

          g = svg.append("g")
        .attr("transform", "translate(20,20)");

        var div = d3.select("#chart").append("div")
          .attr("class", "tooltip")
          .style("opacity", 1);

        var path = d3.geoPath().projection(projection);

        var color = d3.scaleThreshold();
        var subtitleScale = 
            d3.scaleOrdinal([d3.rgb(153, 0, 102, 1.0), 
                            d3.rgb(153, 0, 102, 0.8), 
                            d3.rgb(153, 0, 102, 0.6), 
                            d3.rgb(153, 0, 102, 0.4), 
                            d3.rgb(153, 0, 102, 0.2),
                            "#3333CC"]);



        d3.queue()
            .defer(d3.json, "https://rawgit.com/hugogbs/o-sertao/master/data/municipios_sab.json")
            .defer(d3.csv,  "https://raw.githubusercontent.com/hugogbs/o-sertao/master/data/municipios_sab.csv")
            .await(draw);

        function draw(error, sab, dados_sab) {
            if (error) throw error;


            // desenhando municipios
            var municipios = topojson.feature(sab, sab.objects.municipios_sab);

            var text = svg.append("text").attr('class', 'label');

            color
                .domain([0, 500, 1000, 10000, 20000, 40000])
                .range([d3.rgb(153, 0, 102, .2), d3.rgb(153, 0, 102, .4), d3.rgb(153, 0, 102, .6), d3.rgb(153, 0, 102, .8), d3.rgb(153, 0, 102, 1.0)]);


            svg.selectAll(".municipios")
                .data(municipios.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("id", function(d) { return "area-"+d.properties.ID.toString()})
                .attr('class', 'municipio')
                .on("mouseover", function(d){ 
                  text
                  .attr('x', 100)
                  .attr('y', 100)
                  .attr("transform", "translate(10, 25)")
                  .text(getData(d.properties.ID).MUNICIPIO + " (" + 
                    getData(d.properties.ID).UF  + "), " +
                    getData(d.properties.ID).Vol_agua_ano *1000 +  ' m³ por ano')
                })

              for (var i = 0; i < dados_sab.length; i++) {
                 cidade = dados_sab[i]
                 svg.select("#area-"+cidade.GEOCODIGO )
                  .attr("fill", function() {
                if (isNaN(cidade.Vol_agua_ano)) {
                   return "#3333CC";
                } else {
                   return color(+cidade.Vol_agua_ano);
                 }
                })
              }

              var legend = g.selectAll(".legend")
                .data(["Acima de 20.000.001 m³/ano", "Entre 10.000.001 e 20.000.000 m³/ano", "Entre 1.000.001 e 10.000.000 m³/ano", "Entre 500.001 e 1.000.000 m³/ano", "Entre 0 e 500.000 m³/ano" , "Não há dados" ])
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(-" + 220 + ", " + (i+5) * 20 + ")"; })
                .style("font", "14px sans-serif");

                legend.append("rect")
                .attr("x", width - 100)
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", subtitleScale);

                legend.append("text")
                .attr("x", width - 75)
                .attr("y", 9)
                .attr("dy", ".35em")
                .attr("text-anchor", "start")
                .text(function(d) { return d; });
    
    function getData(id){
      for (var i = 0 ; i <dados_sab.length; i++){      
        if (dados_sab[i].GEOCODIGO == id){
          return dados_sab[i];
          break;
        }
      }
    }
  }



