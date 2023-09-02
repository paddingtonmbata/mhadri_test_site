(function() {
    // Variable Declarations
    const down_nav_arrow = document.querySelector("#down_nav_arrow");
    const stats_page_wrapper = document.querySelector("#stats_page_wrapper");
    let mapObject;
    const expandButtons = document.querySelectorAll('.expand_filter_button');

    // Event listeners

    //toggles the expanded filters
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const expandedFilter = button.nextElementSibling;
            const icon = button.querySelector('i');
            if (expandedFilter.style.display === 'block') {
                expandedFilter.style.display = 'none';
                icon.classList.remove('fa-angle-up');
                icon.classList.add('fa-angle-down');
            } else {
                expandedFilter.style.display = 'block';
                icon.classList.remove('fa-angle-down');
                icon.classList.add('fa-angle-up');
            }
        });
    });

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
  
    function createPieChart(elementId, data, type, legend_height, pieColor, title) {
        console.log(`create piechart: ${JSON.stringify(data)}`)
      const piechart = new ApexCharts(document.querySelector(elementId), {
        series: data.data,
        labels: data.labels,
        chart: {
            type: type,
        },
        title: {
          text: title,
          align: 'center',
          style: {
            fontSize: '14px',
            fontFamily: 'IBM Plex Mono, monospace'
          }
        },
        theme: {
          monochrome: {
            enabled: true,
            color: pieColor,
            shadeTo: 'light',
            shadeIntensity: 0.9
          }
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
    function createFilterMap(id) {
      mapObject = $(id).vectorMap({
        map: 'world_mill',
        backgroundColor: 'transparent',
        zoomOnScroll: false,
        onRegionTipShow: function(e, el, code) {
          var countryName = $(id).vectorMap('get', 'mapObject').getRegionName(code);
          el.html(countryName);
        },
        regionStyle: {
          initial: {
            fill: '#727272',
            'fill-opacity': 1,
          },
          hover: {
            'fill-opacity': 0.6
          },
          selected: {
            fill: 'white'
          }
        },
        onRegionClick: async function(event, code) {
          // Fetch courses from the clicked country
          try {
            // Remove the previously highlighted region
            $('.jvectormap-region.active').removeClass('active');
            
            // Add the active class to the clicked region
            //$(event.target).addClass('active');

            const courseResponse = await fetch(`http://127.0.0.1:8000/api/courses_by_country/${code}`);
            const data = await courseResponse.json();

            const coursesContainer = $('.courses');
            const loadingButton = $('#loading-button');

            coursesContainer.empty();
            loadingButton.show();
            

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

            coursesContainer.get(0).scrollIntoView({ behavior: "smooth" });

          } catch (error) {
            console.error(`Error fetching course data: ${error}`);
          }
        }
      });
      const g = document.querySelector(`${id} svg g`);
      g.setAttribute("transform", "scale(1.1311111111111112) translate(-1.0050899209180199e-13, 0.6684556298980835)");
    }
  
    function createMap(id, data) {
        console.log(`chloropleth data: ${JSON.stringify(data)}`);
      
        var mapData = {};
        
        for (var i = 0; i < data.length; i++) {
        var countryCode = Object.keys(data[i])[0];
        var courseCount = data[i][countryCode];
        mapData[countryCode] = courseCount;
        }
        
        mapObject = $(id).vectorMap({
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
          onRegionTipShow: function(e, el, code) {
            var countryName = $(id).vectorMap('get', 'mapObject').getRegionName(code);
            var courseCount = mapData[code];
            if (courseCount) {
              el.html(countryName + ' - ' + courseCount);
            } else {
              el.html(countryName + ' - O');
            }
          },
          
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
        createPieChart("#piechart1", data, 'donut', 200, '#0071A4', 'Teaching mechanisms');
        const efTeachingUl = document.querySelector('.ef-teaching');
        for (let i = 0; i < data.labels.length; i++) {
          const label = data.labels[i];
          const count = data.data[i];
          const listItem = document.createElement('li');
          listItem.textContent = `${label} (${count})`;
          efTeachingUl.appendChild(listItem);
        }
      });
  
      $.getJSON('http://127.0.0.1:8000/api/type_of_course_counts/', function(data) {
        createPieChart("#piechart2", data, 'donut', 250, '#fc0356', 'Type of courses');
        const efTypeUl = document.querySelector('.ef-type');
        for (let i = 0; i < data.labels.length; i++) {
          const label = data.labels[i];
          const count = data.data[i];
          const listItem = document.createElement('li');
          listItem.textContent = `${label} (${count})`;
          efTypeUl.appendChild(listItem);
        }
      });
      $.getJSON('http://127.0.0.1:8000/api/thematic_focus_counts/', function(data) {
        const efThematicUl = document.querySelector('.ef-thematic');
        for (let i = 0; i < data.labels.length; i++) {
          const label = data.labels[i];
          const count = data.data[i];
          const listItem = document.createElement('li');
          listItem.textContent = `${label} (${count})`;
          efThematicUl.appendChild(listItem);
        }
      });
      $.getJSON('http://127.0.0.1:8000/api/target_audience_counts/', function(data) {
        const efTargetUl = document.querySelector('.ef-target');
        for (let i = 0; i < data.labels.length; i++) {
          const label = data.labels[i];
          const count = data.data[i];
          const listItem = document.createElement('li');
          listItem.textContent = `${label} (${count})`;
          efTargetUl.appendChild(listItem);
        }
      });
    });
  
    $(document).ready(function() {
      $.getJSON('http://127.0.0.1:8000/api/country_chloropleth/', function(data) {
        createMap('#map',data, true);
      });
    });
    $(document).ready(function() {
      createFilterMap('#filtermap');
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

    $(document).ready(function () {

    });
  
    fetchAndDisplayCourses();
  
  })();
  