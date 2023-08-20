const down_nav_arrow = document.querySelector("#down_nav_arrow");
const stats_page_wrapper = document.querySelector("#stats_page_wrapper");


down_nav_arrow.addEventListener("click", () => {
    stats_page_wrapper.scrollIntoView({ behavior: "smooth"});
});

fetch('http://127.0.0.1:8000/api/country_course_count/')
  .then(response => response.json())
  .then(data => {
    
    const categories = data.map(item => item.country_name);
    const courseCounts = data.map(item => item.course_count);

    const options = {
      series: [{ data: courseCounts }],
      chart: { type: 'bar', height: 350 },
      plotOptions: { bar: { borderRadius: 4, horizontal: true } },
      dataLabels: { enabled: false },
      xaxis: { categories: categories },
    };

    const chart = new ApexCharts(document.querySelector("#bargraph"), options);
    chart.render();
  })
  .catch(error => console.error('Error fetching data:', error));
