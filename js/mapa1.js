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
            d3.scaleOrdinal([d3.rgb(204, 0, 0, 1.0), 
                            d3.rgb(204, 0, 0, 0.8), 
                            d3.rgb(204, 0, 0, 0.6), 
                            d3.rgb(204, 0, 0, 0.4), 
                            d3.rgb(204, 0, 0, 0.2)]);



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
                .domain([0, 10000, 20000, 30000, 40000, 50000])
                .range([d3.rgb(204, 0, 0, .2), d3.rgb(204, 0, 0, .4), d3.rgb(204, 0, 0, .6), d3.rgb(204, 0, 0, .8), d3.rgb(204, 0, 0, 1.0)]);


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
                    getData(d.properties.ID).UF  + '), ' +  
                    getData(d.properties.ID).POPULACAO_TOTAL +  ' habitantes')
                });

              for (var i = 0; i < dados_sab.length; i++) {
                 cidade = dados_sab[i]
                 svg.select("#area-"+cidade.GEOCODIGO )
                  .attr("fill", function() {
                if (isNaN(cidade.POPULACAO_URBANA)) {
                   return "#3333CC";
                } else {
                   return color(+cidade.POPULACAO_URBANA);
                 }
                })
              }

              var legend = g.selectAll(".legend")
                .data(["Entre 40001 e 50000", "Entre 30001 e 40000", "Entre 20001 e 30000", "Entre 10001 e 20000", "Entre 0 e 10000"  ])
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
    
    function getData(id){
      for (var i = 0 ; i <dados_sab.length; i++){      
        if (dados_sab[i].GEOCODIGO == id.toString()){
          return dados_sab[i];
          break;
        }
      }
    }
  }



