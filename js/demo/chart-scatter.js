Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
const chapterId = sessionStorage.getItem("chapterId");
const url = `http://n2.psj2867.com:18080/api/data/screen/meta?id=${encodeURIComponent(
  chapterId
)}`;

function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.round(n * k) / k;
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }

  
  Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';

  function number_format(number, decimals, dec_point, thousands_sep) {
      number = (number + '').replace(',', '').replace(' ', '');
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
          var k = Math.pow(10, prec);
          return '' + Math.round(n * k) / k;
        };
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
  }



  document.addEventListener("DOMContentLoaded", function () {
    fetch(url)
        .then(response => response.json())
        .then(data => {
          const sid = data.sid;
          const width = parseInt(data.width);
          const height = parseInt(data.height);
          console.log(width, height);
          
          document.querySelector(".canvas").style.width = `${width + 100}px`;
          document.querySelector(".canvas").style.height = `${height + 50}px`;
  
          const ctx = document.getElementById("myScatterChart").getContext('2d');
          const image = new Image();
          image.src = `http://n2.psj2867.com:18080/api/data/screen/image?sid=${sid}`;
  
          image.onload = function() {
            const plugin = {
              id: 'customCanvasBackgroundImage',
              beforeDraw: (chart) => {
                if (image.complete) {
                  const {left, top, width: chartWidth, height: chartHeight} = chart.chartArea;
                  const x = left;
                  const y = top;
                  ctx.drawImage(image, x, y, width, height);
                }
              }
            };
  
            new Chart(ctx, {
              type: 'scatter',
              data: {
                datasets: [{
                  label: '감정',
                  backgroundColor: "rgba(78, 115, 223, 0.05)",
                  borderColor: "rgba(78, 115, 223, 1)",
                  pointRadius: 5,
                  pointBackgroundColor: "rgba(251, 80, 80, 1)",
                  pointBorderColor: "rgba(251, 80, 80, 1)",
                  pointHoverRadius: 7,
                  pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                  pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                  pointHitRadius: 10,
                  pointBorderWidth: 2,
                  data: [
                    {x: 1, y: 5, emotion: 'happy'},
                    {x: 2, y: 3, emotion: 'sad'},
                    {x: 3, y: 4, emotion: 'neutral'},
                    {x: 4, y: 2, emotion: 'angry'},
                    {x: 5, y: 6, emotion: 'test'}
                  ]
                }]
              },
              plugins: [plugin],
              options: {
                maintainAspectRatio: false,
                scales: {
                  xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    gridLines: {
                      display: true,
                      drawBorder: false
                    },
                    ticks: {
                      maxTicksLimit: 7
                    }
                  }],
                  yAxes: [{
                    ticks: {
                      maxTicksLimit: 5,
                      padding: 10,
                      callback: function(value) {
                        return '$' + value;
                      }
                    },
                    gridLines: {
                      color: "rgb(234, 236, 244)",
                      zeroLineColor: "rgb(234, 236, 244)",
                      drawBorder: false,
                      borderDash: [2],
                      zeroLineBorderDash: [2]
                    }
                  }],
                },
                legend: {
                  display: false
                },
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                      var emotion = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].emotion;
                      return datasetLabel + ': ' + ' (' + emotion + ')';
                    }
                  }
                }
              }
            });
          };
        })
  });
  