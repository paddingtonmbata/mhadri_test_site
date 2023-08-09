const down_nav_arrow = document.querySelector("#down_nav_arrow");
const stats_page_wrapper = document.querySelector("#stats_page_wrapper");


down_nav_arrow.addEventListener("click", () => {
    stats_page_wrapper.scrollIntoView({ behavior: "smooth"});
});

zingchart.render({
    id: 'bargraph',
    data: {
      type: 'hbar',
      plot:{
        barWidth: 10
      },
      plotarea: {
        'adjust-layout':true
      },
      series: [
        { 
            values: [0, 0, 1, 1, 1, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6 , 8, 8, 9, 10, 11, 14, 18, 20, 21, 25],
            'hover-state': {
                'background-color': 'red'
            }
        
        }
      ],
      scaleX: {
        labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6', 'Label 7', 'Label 8', 'Label 9', 'Label 10', 'Label 11', 'Label 12', 'Label 13', 'Label 14', 'Label 15', 'Label 16', 'Label 17'],
        label: {
            text: "Countries"
        }
      }
    }
  });
    