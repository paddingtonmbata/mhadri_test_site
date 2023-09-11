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
          fontFamily: 'IBM Plex Mono, monospace',
          events: {
            dataPointSelection: async function (event, chartContext, config) {
              const country_name = config.w.config.xaxis.categories[config.dataPointIndex];
              console.log(country_name)
              // Fetch and render courses for the clicked category
              const courseResponse = await fetch(`http://127.0.0.1:8000/api/country_by_name/${country_name}`);
              const countryCourses = await courseResponse.json();
              const coursesContainer = $('.courses');
              coursesContainer.get(0).scrollIntoView({ behavior: 'smooth'});
              renderCourses(countryCourses); // Implement the renderCourses function to display courses              
            }
          }
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
// Assuming you have a chart instance globally defined, e.g., chart1 and chart2

async function createPieChart(chartId, data, chartType, legend_height, pieColor, title, code) {
  const options = {
      series: data.data,
      labels: data.labels,
      dataLabels: {
          enabled: false,
      },
      legend: {
          position: 'right',
          height: legend_height,
      },
      responsive: [
          {
              breakpoint: 480,
              options: {
                  chart: {
                      width: '100%',
                  },
                  legend: {
                      position: 'bottom',
                  },
              },
          },
      ],
      title: {
          text: title,
          align: 'center',
          style: {
              fontSize: '14px',
              fontFamily: 'IBM Plex Mono, monospace',
          },
      },
      theme: {
          monochrome: {
              enabled: true,
              color: pieColor,
              shadeTo: 'light',
              shadeIntensity: 0.9,
          },
      },
      chart: {
        type: chartType,
        height: '369px',
        events: {
            dataPointSelection: async function (event, chartContext, config) {
                // Check if the clicked element is a pie slice
                if (code) {
                  if (config.w.config.chart.type === 'donut') {
                    // Extract the category from the clicked slice
                    const category = config.w.config.labels[config.dataPointIndex];

                    // Fetch and render courses for the clicked category
                    const courseResponse = await fetch(`http://127.0.0.1:8000/api/courses_by_category_code/${code}/${category}`);
                    const categoryCourses = await courseResponse.json();
                    const coursesContainer = $('.courses');
                    coursesContainer.get(0).scrollIntoView({ behavior: 'smooth'});
                    renderCourses(categoryCourses); // Implement the renderCourses function to display courses
                  }
                } else {
                  if (config.w.config.chart.type === 'donut') {
                    // Extract the category from the clicked slice
                    const category = config.w.config.labels[config.dataPointIndex];

                    // Fetch and render courses for the clicked category
                    const courseResponse = await fetch(`http://127.0.0.1:8000/api/courses_by_category/${category}`);
                    const categoryCourses = await courseResponse.json();
                    const coursesContainer = $('.courses');
                    coursesContainer.get(0).scrollIntoView({ behavior: 'smooth'});
                    renderCourses(categoryCourses); // Implement the renderCourses function to display courses
                  }
                }
            },
        },
      },
  };

  // Check if the chart instance exists
  if (typeof window[chartId] === 'undefined') {
      // Create a new chart instance
      window[chartId] = new ApexCharts(document.querySelector(chartId), options);
      await window[chartId].render();
  } else {
      // Update the existing chart instance
      await window[chartId].updateSeries(data.data, true); // Update series data
      await window[chartId].updateOptions(options);
  }
}

  
    function createFilterMap(id) {
      var selectedRegion = null;
      var originalFillColors = {};
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
          if (selectedRegion) {
            var prevRegionElement = $(id).find(`[data-code="${selectedRegion}"]`);
            prevRegionElement.css('fill', originalFillColors[selectedRegion]);
          }

          // Toggle the highlighting state for the clicked region
          if (selectedRegion !== code) {
              selectedRegion = code;
              var currentRegionElement = $(id).find(`[data-code="${selectedRegion}"]`);
              // Store the original fill color before changing it
              originalFillColors[selectedRegion] = currentRegionElement.css('fill');
              currentRegionElement.css('fill', 'rgb(0, 143, 255)'); // Change to your desired highlight color
          } else {
              selectedRegion = null; // Reset the selected region
          } 
          // Fetch courses from the clicked country
          try {
            // Remove the previously highlighted region
            $('.jvectormap-region.active').removeClass('active');
            
            // Add the active class to the clicked region
            //$(event.target).addClass('active');

            const courseResponse = await fetch(`http://127.0.0.1:8000/api/courses_by_country/${code}`);
            const data = await courseResponse.json();
            renderCourses(data, true)          
            

          } catch (error) {
            console.error(`Error fetching course data: ${error}`);
          }
        }
      });
      const g = document.querySelector(`${id} svg g`);
      g.setAttribute("transform", "scale(1.1311111111111112) translate(-1.0050899209180199e-13, 0.6684556298980835)");
    }
    function createMap(id, data) {
      
        let mapData = {};
        var selectedRegion = null;
        var originalFillColors = {};
        
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
          // when a country is clicked on the first map
          onRegionClick: async function(event, code) {
            console.log(`Clicked on: ${code}`);

            if (selectedRegion) {
              var prevRegionElement = $(id).find(`[data-code="${selectedRegion}"]`);
              prevRegionElement.css('fill', originalFillColors[selectedRegion]);
            }

            // Toggle the highlighting state for the clicked region
            if (selectedRegion !== code) {
                selectedRegion = code;
                var currentRegionElement = $(id).find(`[data-code="${selectedRegion}"]`);
                // Store the original fill color before changing it
                originalFillColors[selectedRegion] = currentRegionElement.css('fill');
                currentRegionElement.css('fill', 'rgb(0, 143, 255)'); // Change to your desired highlight color
            } else {
                selectedRegion = null; // Reset the selected region
            }                 
        
            try {
                // Fetch teaching mechanism counts
                const teachingMechanismResponse = await fetch(`http://127.0.0.1:8000/api/teaching_mechanism_counts_by_code/${code}`);
                const teachingMechanismData = await teachingMechanismResponse.json();
                createPieChart("#piechart1", teachingMechanismData, 'donut', 200, '#0071A4', 'Teaching mechanisms', code);
        
                const efTeachingUl = document.querySelector('.ef-teaching');
                efTeachingUl.innerHTML = ''; // Clear the list
                for (let i = 0; i < teachingMechanismData.labels.length; i++) {
                    const label = teachingMechanismData.labels[i];
                    const count = teachingMechanismData.data[i];
                    const listItem = document.createElement('li');
                    listItem.textContent = `${label} (${count})`;
                    efTeachingUl.appendChild(listItem);
                }
        
                // Fetch type of course counts
                const typeOfCourseResponse = await fetch(`http://127.0.0.1:8000/api/type_of_course_counts_by_code/${code}`);
                const typeOfCourseData = await typeOfCourseResponse.json();
                createPieChart("#piechart2", typeOfCourseData, 'donut', 250, '#fc0356', 'Type of courses', code);
        
                const efTypeUl = document.querySelector('.ef-type');
                efTypeUl.innerHTML = ''; // Clear the list
                for (let i = 0; i < typeOfCourseData.labels.length; i++) {
                    const label = typeOfCourseData.labels[i];
                    const count = typeOfCourseData.data[i];
                    const listItem = document.createElement('li');
                    listItem.textContent = `${label} (${count})`;
                    efTypeUl.appendChild(listItem);
                }
        
                // Fetch thematic focus counts
                const thematicFocusResponse = await fetch(`http://127.0.0.1:8000/api/thematic_focus_counts_by_code/${code}`);
                const thematicFocusData = await thematicFocusResponse.json();
        
                const efThematicUl = document.querySelector('.ef-thematic');
                efThematicUl.innerHTML = ''; // Clear the list
                for (let i = 0; i < thematicFocusData.labels.length; i++) {
                    const label = thematicFocusData.labels[i];
                    const count = thematicFocusData.data[i];
                    const listItem = document.createElement('li');
                    listItem.textContent = `${label} (${count})`;
                    efThematicUl.appendChild(listItem);
                }
        
                // Fetch target audience counts
                const targetAudienceResponse = await fetch(`http://127.0.0.1:8000/api/target_audience_counts_by_code/${code}`);
                const targetAudienceData = await targetAudienceResponse.json();
        
                const efTargetUl = document.querySelector('.ef-target');
                efTargetUl.innerHTML = ''; // Clear the list
                for (let i = 0; i < targetAudienceData.labels.length; i++) {
                    const label = targetAudienceData.labels[i];
                    const count = targetAudienceData.data[i];
                    const listItem = document.createElement('li');
                    listItem.textContent = `${label} (${count})`;
                    efTargetUl.appendChild(listItem);
                }
        
                // Fetch and render courses
                const courseResponse = await fetch(`http://127.0.0.1:8000/api/courses_by_country/${code}`);
                const clickedCountryCoursedata = await courseResponse.json();
                renderCourses(clickedCountryCoursedata);
            } catch (error) {
                console.error('Error fetching or rendering data: ', error);
            }
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
        createPieChart("#piechart1", data, 'donut', 200, '#0071A4', 'Teaching mechanisms', false);
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
        createPieChart("#piechart2", data, 'donut', 250, '#fc0356', 'Type of courses', false);
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

    async function fetchAndDisplayCourses() {
      try {
        // Check if the data is cached
        const cachedData = localStorage.getItem('cachedCourses');
        if (cachedData) {
          // Use cached data
          const data = JSON.parse(cachedData);
          renderCourses(data, false);
        } else {
          // Fetch data from the server if not cached
          const response = await fetch('http://127.0.0.1:8000/api/course_data/', {
            method: 'GET',
            headers: {
              'X-API-KEY': '2c5aa8423852a993f670fe8e05570c627c3980654ce03e38378bbbd937030322'
            },
          });
          const data = await response.json();
          console.log(`data: ${JSON.stringify(data)}`);

          // Cache the fetched data
          localStorage.setItem('cachedCourses', JSON.stringify(data));

          // Render the data
          renderCourses(data, false);
        }
      } catch (error) {
        console.error('Error fetching or rendering data: ', error);
        loadingButton.text('Error fetching data');
      }
    }

    function renderCourses(data, isSecondMap) {

      const coursesContainer = $('.courses');
      const loadingButton = $('#loading-button');

      coursesContainer.empty();
      loadingButton.show();

      data.forEach(async (course) => {
        const courseDiv = $('<div>').addClass('course');

        try {
          // Fetch country data
          const countryResponse = await fetch(`http://127.0.0.1:8000/api/country/${course.institution_location}`);
          const countryData = await countryResponse.json();
          loadingButton.hide();
          
          const courseTitleDiv = $(document.createElement('div')).addClass('course-title-container');
          const courseRowOne = $(document.createElement('div')).addClass('row-1');
          const courseColOne = $(document.createElement('div')).addClass('col-1');
          const courseColTwo = $(document.createElement('div')).addClass('col-2').addClass('hidden');
          const courseRowTwo = $(document.createElement('div')).addClass('row-2');
          const hiddenRow = $(document.createElement('div')).addClass('hidden')
          
          courseTitleDiv.append($('<h3>').html(`<strong><a href="${course.source}"><i class="fa fa-link" aria-hidden="true"></i></a> ${course.institution_name}</strong>`));
          courseTitleDiv.append($('<p>').html(`${countryData.country_name}`));
          courseDiv.append(courseTitleDiv);
          
          courseColOne.append($('<p>').html('<strong> Type of course: </strong> ' + course.type_of_course));
          courseColOne.append($('<p>').html('<strong> Thematic Focus: </strong> ' + course.thematic_focus));          
          courseColOne.append($('<p>').html('<strong> Teaching mechanism: </strong> ' + course.teaching_mechanism));

          hiddenRow.append($('<p>').html('<strong> Target audience: </strong> ' + course.target_audience));
          hiddenRow.append($('<p>').html('<strong> Target population: </strong> ' + course.target_population));
          hiddenRow.append($('<p>').html('<strong> Objective of training: </strong> ' + course.objective_of_training));
          courseColOne.append(hiddenRow)
          
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

          const expandButton = $('<button>').addClass('expand-button').text('Read more');
    
          expandButton.on('click', function () {
            hiddenRow.toggleClass('expanded')
            courseColTwo.toggleClass('expanded');
            courseDiv.toggleClass('expandedCourse')
            // Change the button text based on whether it's expanded or collapsed
            if (courseColTwo.hasClass('expanded')) {
              expandButton.text('Read less');
              courseDiv.get(0).scrollIntoView({behavior: 'smooth'})
            } else {
              expandButton.text('Read more');
              courseDiv.get(0).scrollIntoView({behavior: 'smooth'})
            }
          });
          courseDiv.append(expandButton)

          coursesContainer.append(courseDiv);

          if (isSecondMap) {
            coursesContainer.get(0).scrollIntoView({ behavior: "smooth" });
          }
        } catch (error) {
          console.error('Error fetching country data:', error);
          loadingButton.text('Error fetching data');
        }
      });
      

      console.log('courses rendered!!!');
    }
    // Function to clear the cache (if needed)
    function clearCache() {
      localStorage.clear();
    }  
    const coursesDiv = $('.courses');
    const loadingButton = $('<button>').text('Loading...').prop('disabled', true);
    coursesDiv.append(loadingButton);

    $(document).ready(function() {
      // Add an event listener for the form submission
      $('.search').submit(async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Retrieve the search term from the input field
        const searchTerm = $('#searchbar').val();
        console.log('searched something')
        const coursesContainer= $('.courses')

        // Check if the data is cached
        const cachedSearchData = localStorage.getItem(`cachedSearchResults_${searchTerm}`);
        if (cachedSearchData) {
          console.log(`Search term: ${searchTerm} \n cachedSearchResults: ${cachedSearchData}`)
          // Use cached data
          const data = JSON.parse(cachedSearchData);
          renderCourses(data, false);
          coursesContainer.get(0).scrollIntoView({ behavior: "smooth" });
          console.log('finished rendering courses')
        } else {
          // Make an AJAX request to fetch courses using the search term
          try {
            const response = await fetch(`http://127.0.0.1:8000/api/course_data/?search=${searchTerm}`, {
              method: 'GET',
              headers: {
                'X-API-KEY': '2c5aa8423852a993f670fe8e05570c627c3980654ce03e38378bbbd937030322'
              },
            });
            const data = await response.json();

            // Cache the fetched data
            localStorage.setItem(`cachedSearchResults_${searchTerm}`, JSON.stringify(data));
            renderCourses(data, false);
            coursesContainer.get(0).scrollIntoView({ behavior: "smooth" });
          } catch (error) {
            console.error('Error fetching or rendering data: ', error);
            loadingButton.text('Error fetching data');
            
          }
        }
      });
    });


    fetchAndDisplayCourses();
  
  })();
  