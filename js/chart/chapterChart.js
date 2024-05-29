const chapterId = sessionStorage.getItem('chapterId');

document.addEventListener('DOMContentLoaded', function() {
    // Fetching the JSON data and initializing the chart
    const url1 = `http://n2.psj2867.com:18080/api/data/main/duration/chapter?id=${encodeURIComponent(chapterId)}`;
    const url2 = `http://n2.psj2867.com:18080/api/data/exp/sum/chapter?id=${encodeURIComponent(chapterId)}`;
    const url3 = `http://n2.psj2867.com:18080/api/data/main/exit/page?id=${encodeURIComponent(chapterId)}`;

    fetch(url1)
        .then(response => response.json())
        .then(data => {
            // Process the data and create the chart
            const processedData = processOnPageData(data);
            createOnPageChart(processedData);
            console.log(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Process JSON data to match the chart's data format
    function processOnPageData(data) {
        // Assuming data format as given in the question
        const result = [];
        const ranges = [2, 4, 6, 8, 'inf'];

        ranges.forEach(range => {
            const entry = data.find(item => item.le == range);
            result.push(entry ? entry._value : 0);
        });

        return result;
    }

    fetch(url2)
        .then(response => response.json())
        .then(data => {
            // Process the data and create the chart
            const processedData = processExpSumData(data);
            createExpSumChart(processedData);
            console.log(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Process JSON data to match the chart's data format
    function processExpSumData(data) {
        const emotionLabels = ["neutral", "happy", "sad", "angry", "fearful", "disgusted", "surprised"];
        const result = emotionLabels.map(emotion => data[0][emotion] || 0);
        console.log(result);
        return result;
    }

    fetch(url3)
        .then(response => response.json())
        .then(data => {
            createBounceRateChart(data);
            console.log(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Create the chart with the processed data
    function createOnPageChart(data) {
        var ctx = document.getElementById("timeOnPage").getContext('2d');
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["0 ~ 2분", "2 ~ 4분", "4 ~ 6분", "6 ~ 8분", "8분 이상"],
                datasets: [{
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
                    data: data,
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: '분'
                        },
                        gridLines: {
                            display: false,
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
                            callback: function(value, index, values) {
                                return number_format(value) + '명';
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
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function(tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': ' + number_format(tooltipItem.yLabel) + '명';
                        }
                    }
                }
            }
        });
    }

    function createExpSumChart(data) {
        var ctx = document.getElementById("expSumChart").getContext('2d');
        var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["무표정", "행복", "슬픔", "화남", "두려움", "역겨움", "놀람"],
                datasets: [{
                    label: "Emotion Levels",
                    backgroundColor: "#4e73df",
                    hoverBackgroundColor: "#2e59d9",
                    borderColor: "#4e73df",
                    data: data,
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'emotion'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        },
                        maxBarThickness: 25,
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: Math.max(1, ...data), // Adjust the max value based on the data
                            maxTicksLimit: 5,
                            padding: 10,
                            callback: function(value, index, values) {
                                return value.toFixed(6); // Format the ticks with six decimal places
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
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                    callbacks: {
                        label: function(tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': ' + tooltipItem.yLabel.toFixed(6); // Format the tooltip values with six decimal places
                        }
                    }
                }
            }
        });
    }

function createBounceRateChart(data)
{
    const total = data[0].total;
    const exit = data[0].exit;
    const bounce = exit / total;
    const retention = 1 - bounce;

    var ctx = document.getElementById("bounceRate").getContext('2d');
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["이탈", "잔류"],
            datasets: [{
                data: [bounce, retention],
                backgroundColor: ['#4e73df', '#1cc88a'],
                hoverBackgroundColor: ['#2e59d9', '#17a673'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });
}



    // Helper function to format numbers
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
});