(function() {
    // Variable Declarations
    const down_nav_arrow = document.querySelector("#down_nav_arrow");
    const stats_page_wrapper = document.querySelector("#stats_page_wrapper");
    let mapObject;
  
    // Event Listeners
    down_nav_arrow.addEventListener("mouseover", () => {
      down_nav_arrow.classList.remove('fa-bounce');
    });
    
    down_nav_arrow.addEventListener("mouseout", () => {
      down_nav_arrow.classList.add('fa-bounce');
    });
    
    down_nav_arrow.addEventListener("click", () => {
      stats_page_wrapper.scrollIntoView({ behavior: "smooth" });
    });
  
    // Fetch Data and Chart Creation
    function createBarGraph(data) {
      const categories = data.map(item => item.country_name);
      const courseCounts = data.map(item => item.course_count);
      console.log(`create bargraph: ${JSON.stringify(data)}`)
  
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
    }
  
    function createPieChart(elementId, data, type, legend_height) {
        console.log(`create piechart: ${JSON.stringify(data)}`)
      const piechart = new ApexCharts(document.querySelector(elementId), {
        series: data.data,
        labels: data.labels,
        chart: {
            type: type,
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: 'right',
            height: legend_height
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
        });
      piechart.render();
    }
  
    function createMap(data, isChloropleth) {
        console.log(`chloropleth data: ${JSON.stringify(data)}`);
      
        var mapData = {};
        if (isChloropleth) {
            for (var i = 0; i < data.length; i++) {
            var countryCode = Object.keys(data[i])[0];
            var courseCount = data[i][countryCode];
            mapData[countryCode] = courseCount;
            }
        }
        mapObject = $('#map').vectorMap({
          map: 'world_mill',
          backgroundColor: 'transparent',
          zoomOnScroll: true,
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
              el.html(countryName + ' - O');
            }
          },
          onMarkerTipShow: function(event, label, index) {
            label.html(markers[index].name + ': ' + mapData[markers[index].name]);
          }
        });
      
        const g = document.querySelector('#map svg g');
        g.setAttribute("transform", "scale (1.1685786825480715) translate (45.04582672908927,0)");
      }
      
  
    fetch('http://127.0.0.1:8000/api/country_course_count/')
      .then(response => response.json())
      .then(data => {
        createBarGraph(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  
    $(document).ready(function() {
      $.getJSON('http://127.0.0.1:8000/api/teaching_mechanism_counts/', function(data) {
        createPieChart("#piechart1", data, 'donut', 200);
      });
  
      $.getJSON('http://127.0.0.1:8000/api/type_of_course_counts/', function(data) {
        createPieChart("#piechart2", data, 'donut', 250);
      });
    });
  
    $(document).ready(function() {
      $.getJSON('http://127.0.0.1:8000/api/country_chloropleth/', function(data) {
        createMap(data, true);
      });
    });
  
    // Dynamic Dashboard Implementation
    async function fetchAndDisplayCourses() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/course_data/');
        const data = await response.json();
        
        const coursesContainer = $('.courses');
        data.forEach(async course => {
            const courseDiv = $('<div>').addClass('course');
            
            try {
            const countryResponse = await fetch(`http://127.0.0.1:8000/api/country/${course.institution_location}`);
            const countryData = await countryResponse.json();
            
            loadingButton.hide();
            
            const courseTitleDiv = $(document.createElement('div')).addClass('course-title-container');
            const courseRowOne = $(document.createElement('div')).addClass('row-1');
            const courseColOne = $(document.createElement('div')).addClass('col-1');
            const courseColTwo = $(document.createElement('div')).addClass('col-2');
            const courseRowTwo = $(document.createElement('div')).addClass('row-2');
            
            courseTitleDiv.append($('<h3>').html(`<strong><a href="${course.source}"><i class="fa fa-link" aria-hidden="true"></i></a> ${course.institution_name}</strong>`));
            courseTitleDiv.append($('<p>').html(`${countryData.country_name}`));
            courseDiv.append(courseTitleDiv);
            
            courseColOne.append($('<p>').html('<strong> Type of course: </strong> ' + course.type_of_course));
            courseColOne.append($('<p>').html('<strong> Thematic Focus: </strong> ' + course.thematic_focus));
            courseColOne.append($('<p>').html('<strong> Target audience: </strong> ' + course.target_audience));
            courseColOne.append($('<p>').html('<strong> Target population: </strong> ' + course.target_population));
            courseColOne.append($('<p>').html('<strong> Objective of training: </strong> ' + course.objective_of_training));
            courseColOne.append($('<p>').html('<strong> Teaching mechanism: </strong> ' + course.teaching_mechanism));
            
            courseColTwo.append($('<p>').html('<strong> Teaching approach: </strong> ' + course.teaching_approach));
            courseColTwo.append($('<p>').html('<strong> Frequency of Training: </strong> ' + course.frequency_of_training));
            courseColTwo.append($('<p>').html('<strong> Funding Schemes: </strong> ' + course.funding_schemes));
            courseColTwo.append($('<p>').html('<strong> Sustainibility factors: </strong> ' + course.sustainibility_factors));
            courseColTwo.append($('<p>').html('<strong> Key Challenges: </strong> ' + course.key_challenges));
            
            courseRowOne.append(courseColOne);
            courseRowOne.append(courseColTwo);
            courseDiv.append(courseRowOne);
            
            courseRowTwo.append($('<p>').html('<strong> Scope: </strong> ' + course.scope));
            courseDiv.append(courseRowTwo);
            
            } catch (error) {
            console.error('Error fetching country data:', error);
            loadingButton.text('Error fetching data');
            }
        
            coursesContainer.append(courseDiv);
        });
      } catch (error) {
        console.error('Error fetching course data: ', error);
        loadingButton.text('Error fetching data');
      }
    }
  
    const coursesDiv = $('.courses');
    const loadingButton = $('<button>').text('Loading...').prop('disabled', true);
    coursesDiv.append(loadingButton);
  
    fetchAndDisplayCourses();
  
  })();
  