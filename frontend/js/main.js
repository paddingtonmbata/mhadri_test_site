const down_nav_arrow = document.querySelector("#down_nav_arrow");
const stats_page_wrapper = document.querySelector("#stats_page_wrapper");


down_nav_arrow.addEventListener("click", () => {
    stats_page_wrapper.scrollIntoView({ behavior: "smooth"});
});

// bargraph
fetch('http://127.0.0.1:8000/api/country_course_count/')
  .then(response => response.json())
  .then(data => {
    
    const categories = data.map(item => item.country_name);
    const courseCounts = data.map(item => item.course_count);

    const options = {
      series: [
        {
          data: courseCounts 
        }
      ],
      title: {
        text: "Number of institution by location",
        align: 'center'
      },
      chart: {
        type: 'bar', 
        height: 500, 
        fontFamily: 'IBM Plex Mono, monospace'
      },
      plotOptions: { 
        bar: { 
          borderRadius: 4, 
          horizontal: true 
        } 
      },
      dataLabels: { 
        enabled: false 
      },
      xaxis: { 
        categories: categories 
      },
      grid: {
        show: true,
        yaxis: {
          lines: {
            show: false
          }
        },
        xaxis: {
          lines: {
            show: true
          }
        },
        columns: {
          opacity: 0.5
        }
      },
      tooltip: {
        followCursor: true,
        x: {
          show: false
        },
        marker: {
          show: false
        },
        y: {
          title: {
            formatter: (seriesName) => ""
          },
        },
      },
    };

    const chart = new ApexCharts(document.querySelector("#bargraph"), options);
    chart.render();
  })
  .catch(error => console.error('Error fetching data:', error));

//pie charts
const p1_options = {
  series: [51, 22, 100],
  labels: ["Online", "Both", "Face to Face"],
  chart: {
    type: "donut",
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: 'right',
    height: 200
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: '100%'
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
};
const piechart1 = new ApexCharts(document.querySelector("#piechart1"), p1_options);
piechart1.render();
const p2_options = {
  series: [51, 22, 100],
  labels: ["Online", "Both", "Face to Face"],
  chart: {
    type: "donut",
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: 'right',
    height: 200
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: '100%'
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
};
const piechart2 = new ApexCharts(document.querySelector("#piechart2"), p2_options);
piechart2.render();
const p3_options = {
  series: [51, 22, 100],
  labels: ["Online", "Both", "Face to Face"],
  chart: {
    type: "donut",
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: 'right',
    height: 200
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: '100%'
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
};
const piechart3 = new ApexCharts(document.querySelector("#piechart3"), p3_options);
piechart3.render();

$(function() {
  $.getJSON('http://127.0.0.1:8000/api/country_chloropleth/', function(data) {
    console.log(`chloropleth data: ${JSON.stringify(data)}`);

    var mapData = {};
    for (var i = 0; i < data.length; i++) {
      var countryCode = Object.keys(data[i])[0];
      var courseCount = data[i][countryCode];
      mapData[countryCode] = courseCount;
    }

    $('#map').vectorMap({
      map: 'world_mill',
      series: {
        regions: [{
          values: mapData,
          scale: ['#C8EEFF', '#0071A4'],
          normalizeFunction: 'polynomial'
        }]
      },
      markers: [],
      onRegionTipShow: function(e, el, code) {
        var countryName = $('#map').vectorMap('get', 'mapObject').getRegionName(code);
        var courseCount = mapData[code];
        if (courseCount) {
          el.html(countryName + ' - ' + courseCount);
        } else {
          el.html(countryName + ' - N/A');
        }
      }
    });

    // Add bubble markers
    var markers = [];
    for (var countryCode in mapData) {
      var courseCount = mapData[countryCode];
      if (courseCount) {
        markers.push({
          latLng: [parseFloat($.fn.vectorMap.maps['world_mill'].paths[countryCode].lat), parseFloat($.fn.vectorMap.maps['world_mill'].paths[countryCode].lng)],
          name: countryCode,
          radius: Math.sqrt(courseCount) * 5,  // Adjust the factor as needed
          fill: 'rgba(255, 0, 0, ' + (courseCount / 100) + ')'  // Adjust the alpha value
        });
      }
    }

    $('#map').vectorMap('addMap', 'world_mill', $.fn.vectorMap.maps.world_mill);
    $('#map').vectorMap('addMarkers', markers);
  });
});
