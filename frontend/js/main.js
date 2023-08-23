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

let mapObject;

$(function() {
  $.getJSON('http://127.0.0.1:8000/api/country_chloropleth/', function(data) {
    console.log(`chloropleth data: ${JSON.stringify(data)}`);

    var mapData = {};
    for (var i = 0; i < data.length; i++) {
      var countryCode = Object.keys(data[i])[0];
      var courseCount = data[i][countryCode];
      mapData[countryCode] = courseCount;
    }

    mapObject = $('#map').vectorMap({
      map: 'world_mill',
      backgroundColor: 'transparent',
      zoomOnScroll: false,
      series: {
        regions: [{
          values: mapData,
          scale: ['#C8EEFF', '#0071A4'],
          normalizeFunction: 'polynomial',
          min: 0,
          max: Math.max(...Object.values(mapData)),
          defaultFill: '#727272' 
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
      },
      onMarkerTipShow: function(event, label, index) {
        label.html(markers[index].name + ': ' + mapData[markers[index].name]);
      }
    });


    $('#zoom-NA').click(function() {
      mapObject.zoomIn({
        region: 'NA', // North America ISO code
        animate: true
      });
    });

    $('#zoom-SA').click(function() {
      mapObject.setFocus({
        region: 'SA', // South America ISO code
        animate: true
      });
    });

    $('#zoom-EU').click(function() {
      mapObject.setFocus({
        region: 'EU', // Europe ISO code
        animate: true
      });
    });

    $('#zoom-AF').click(function() {
      mapObject.setFocus({
        region: 'AF', // Africa ISO code
        animate: true
      });
    });

    $('#zoom-AU').click(function() {
      console.log('button clicked : ' + this)
      mapObject.setFocus({
        region: 'AU', // Australia ISO code
        animate: true
      });
    });

    $('#zoom-AS').click(function() {
      console.log('button clicked : ' + this)
      mapObject.setFocus({
        region: 'AS', // Asia ISO code
        animate: true
      });
    });

    $('#zoom-RESET').click(function() {
      console.log('button clicked : ' + this)
      mapObject.setFocus({
        scale: 1, // Reset zoom to default
        x: 0.5, // Center X-coordinate
        y: 0.5, // Center Y-coordinate
        animate: true
      });
    });

    const svg = document.querySelector('#map svg');
    const g = document.querySelector('#map svg g');
    g.setAttribute("transform", "scale(0.85) translate(0, 150)");

  });
});

const courses = document.querySelector('.courses');
const newCourseContainer = document.createElement('div')



$(function() {
  $.getJSON('http://127.0.0.1:8000/api/course_data/', function(data) {
    console.log(`courses data: ${JSON.stringify(data)}`);
    
    var coursesContainer = $('.courses');
    
    data.forEach(function(course) {
      var courseDiv = $('<div>').addClass('course');
      courseDiv.append($('<h3>').text(course.course_name));
      courseDiv.append($('<p>').text('Institution: ' + course.institution_name));
      courseDiv.append($('<p>').text('Location: ' + course.institution_location));
      courseDiv.append($('<p>').text('Type of course: ' + course.type_of_course));
      courseDiv.append($('<p>').text('Thematic Focus: ' + course.thematic_focus));
      courseDiv.append($('<p>').text('Target population: ' + course.target_population));
      courseDiv.append($('<p>').text('Scope: ' + course.scope));
      courseDiv.append($('<p>').text('Objective of training: ' + course.objective_of_training));
      courseDiv.append($('<p>').text('Target audience: ' + course.target_audience));
      courseDiv.append($('<p>').text('Teaching mechanism: ' + course.teaching_mechanism));
      courseDiv.append($('<p>').text('Teaching approach: ' + course.teaching_approach));
      courseDiv.append($('<p>').text('Frequency of Training: ' + course.frequency_of_training));
      courseDiv.append($('<p>').text('Funding Schemes: ' + course.funding_schemes));
      courseDiv.append($('<p>').text('Sustainibility factors: ' + course.sustainibility_factors));
      courseDiv.append($('<p>').text('Key Challenges: ' + course.key_challenges));
      
      coursesContainer.append(courseDiv);
    });
  });
});