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
  $.getJSON('http://127.0.0.1:8000/api/country_course_count/', function(data) {
    console.log(data)
  });
});