Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
const chapterId = sessionStorage.getItem("chapterId");
const url = `https://back.psj2867.com/api/data/screen/meta?id=${encodeURIComponent(
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

  var emotionUrl;

  document.addEventListener("DOMContentLoaded", function () {
    fetch(url)
        .then(response => response.json())
        .then(data => {
          const sid = data.sid;
          const width = parseInt(data.width);
          const height = parseInt(data.height);
          emotionUrl = `https://back.psj2867.com/api/data/exp/heatmap?id=${encodeURIComponent(
            chapterId)}&x=5&y=15`;
          console.log(width, height);
          
          document.querySelector(".canvas").style.width = `${width + 100}px`;
          document.querySelector(".canvas").style.height = `${height + 50}px`;
  
          const ctx = document.getElementById("myScatterChart").getContext('2d');
          const image = new Image();
          image.src = `https://back.psj2867.com/api/data/screen/image?sid=${sid}`;
  
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

            getEmotionData(plugin);
          };
        })

    function getEmotionData(plugin)
    {
      fetch(emotionUrl)
      .then((response) => response.json())
      .then((data) => {
          const emotionData = processEmotionData(data);
          createEmotionsChart(emotionData, plugin);
          console.log(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
    }
    
    
    function processEmotionData(data) {
        const result = [];
    
        data.forEach((item) => {
          var randomXOffset = (Math.random() * 0.1 - 0.05).toFixed(2);
          var randomYOffset = (Math.random() * 0.05 - 0.025).toFixed(2);
  
          let maxEmotion = null;
          let maxValue = 0;
  
          Object.keys(item).forEach((key) => {
              if (key !== 'x' && key !== 'y' && key !== 'table' && key !== 'le' && item[key] > maxValue) {
                  maxEmotion = key;
                  maxValue = item[key];
              }
          });
  
          result.push({
              x: parseFloat(item.x) + parseFloat(randomXOffset),
              y: parseFloat(item.y) + parseFloat(randomYOffset),
              emotion: maxEmotion,
              value: maxValue
          });
      });
    
        return result;
    }
    
    function createEmotionsChart(emotionData, plugin) {
      const ctx = document.getElementById("myScatterChart").getContext("2d");

      const existingDatasets = {}; 

    emotionData.forEach(item => {
        const label = item.emotion;
        const dataset = {
            label: label,
            data: [{ x: item.x, y: item.y, value: item.value}],
            backgroundColor: getBackgroundColor(label),
            borderColor: getBorderColor(label),
            pointRadius: 5
        };

        if (existingDatasets[label]) {
            existingDatasets[label].data.push({ x: item.x, y: item.y, value: item.value });
        } else {
            existingDatasets[label] = dataset;
        }
    });

    const datasets = Object.values(existingDatasets);
  
      new Chart(ctx, {
          type: 'scatter',
          data: { datasets: datasets },
          plugins: [plugin],
          options: {
              maintainAspectRatio: false,
              scales: {
                xAxes: [{
                  gridLines: {
                      display:false
                  }
                }],
                yAxes: [{
                    gridLines: {
                        display:true
                    }   
                }],
              },
              legend: {
                  display: true
              },
              tooltips: {
                  callbacks: {
                      label: function(tooltipItem, data) {
                          const dataset = data.datasets[tooltipItem.datasetIndex];
                          const point = dataset.data[tooltipItem.index];
                          return `${dataset.label}: (값: ${(point.value * 100).toFixed(4)})`;
                      }
                  }
              }
          }
      });
  }
  
  function getBackgroundColor(emotion) {
    switch (emotion) {
        case '기쁨':
            return "rgba(255, 99, 132, 0.6)"; // 분홍색
        case '분노':
            return "rgba(255, 255, 0, 0.6)"; // 뻘건색
        case '불안':
            return "rgba(75, 192, 192, 0.6)"; // 초록색
        case '슬픔':
            return "rgba(54, 162, 235, 0.6)"; // 파란색
        case '중립':
            return "rgba(153, 102, 255, 0.6)"; // 보라색
        default:
            return "rgba(0, 0, 0, 0.6)"; // 검은색
    }
}

function getBorderColor(emotion) {
    switch (emotion) {
        case '기쁨':
            return "rgba(255, 99, 132, 1)"; // 분홍색
        case '분노':
            return "rgba(255, 255, 0, 1)"; // 뻘건색
        case '불안':
            return "rgba(75, 192, 192, 1)"; // 초록색
        case '슬픔':
            return "rgba(54, 162, 235, 1)"; // 파란색
        case '중립':
            return "rgba(153, 102, 255, 1)"; // 보라색
        default:
            return "rgba(0, 0, 0, 1)"; // 검은색
    }
}
  });
  