const userId = sessionStorage.getItem("userId");

document.addEventListener("DOMContentLoaded", function () {
  if (userId == null) {
    window.location.href = "login.html";
  }

  // Fetching the JSON data and initializing the chart
  const url1 = `http://n2.psj2867.com:18080/api/data/main/views?id=${encodeURIComponent(
    userId
  )}`;
  const url2 = `http://n2.psj2867.com:18080/api/data/main/exps?id=${encodeURIComponent(
    userId
  )}`;

  fetch(url1)
    .then((response) => response.json())
    .then((data) => {
      // Process the data and create the chart
      const processedData = processOnPageData(data);
      createViewsChart(processedData);
      console.log(data);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function processOnPageData(data) {
    const result = [];

    data.forEach((item) => {
      const start = new Date(item._start);
      const date = formatDate(start); // Format date
      const value = item._value;

      result.push({
        date: date,
        value: value,
      });
    });

    const lastFiveDaysData = result.slice(-5);

    return lastFiveDaysData;
  }

  fetch(url2)
    .then((response) => response.json())
    .then((data) => {
        const emotionData = processEmotionData(data);
        createEmotionsChart(emotionData);
        console.log(data);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function processEmotionData(data) {
    const result = {
        dates: [],
        기쁨: [],
        분노: [],
        불안: [],
        슬픔: [],
        중립: []
    };

    data.forEach((item) => {
        if (item._start) {
            const start = new Date(item._start);
            const date = formatDate(start);

            result.dates.push(date);
            result.기쁨.push(item.기쁨);
            result.분노.push(item.분노);
            result.불안.push(item.불안);
            result.슬픔.push(item.슬픔);
            result.중립.push(item.중립);
        }
    });

    return result;
}

function formatDate(date) {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function createEmotionsChart(data) {
    var ctx = document.getElementById("emotionsChart").getContext("2d");

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [
                {
                    label: '기쁨',
                    data: data.기쁨,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: '분노',
                    data: data.분노,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: '불안',
                    data: data.불안,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: '슬픔',
                    data: data.슬픔,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    label: '중립',
                    data: data.중립,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Emotion Level'
                    }
                }
            }
        }
    });
}

  // Helper function to format date as "YYYY-MM-DD"
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month starts from 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Create the chart with the processed data
  function createViewsChart(data) {
    var ctx = document.getElementById("viewsChart").getContext("2d");
    var myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => item.date), // Use dates as labels
        datasets: [
          {
            label: "명",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 3,
            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: data.map((item) => item.value), // Use values for data
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0,
          },
        },
        scales: {
          xAxes: [
            {
              time: {
                unit: "date",
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                maxTicksLimit: 5, // Show maximum 5 ticks (last 5 days)
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                maxTicksLimit: 5,
                padding: 10,
                callback: function (value, index, values) {
                  return number_format(value) + "명";
                },
              },
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [2],
                zeroLineBorderDash: [2],
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: "#6e707e",
          titleFontSize: 14,
          borderColor: "#dddfeb",
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: "index",
          caretPadding: 10,
          callbacks: {
            label: function (tooltipItem, chart) {
              var datasetLabel =
                chart.datasets[tooltipItem.datasetIndex].label || "";
              return (
                datasetLabel + ": " + number_format(tooltipItem.yLabel) + "명"
              );
            },
          },
        },
      },
    });
  }

  // Helper function to format numbers
  function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + "").replace(",", "").replace(" ", "");
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
      dec = typeof dec_point === "undefined" ? "." : dec_point,
      s = "",
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return "" + Math.round(n * k) / k;
      };
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  }
});
