fetch('https://unpkg.com/world-atlas@2.0.2/countries-50m.json').then((response) => response.json()).then((world) => {
    const countries = ChartGeo.topojson.feature(world, world.objects.countries).features;

    const chart = new Chart(document.getElementById("myWorldChart").getContext("2d"), {
        type: 'choropleth',
        data: {
            labels: countries.map((d) => d.properties.name),
            datasets: [{
                label: 'Countries',
                outline: countries,
                data: countries.map((d) => ({feature: d, value: Math.random() * 10})),
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            },
            scales: {
                projection: {
                    axis: 'x',
                    projection: 'equalEarth'
                },
                color: {
                    axis: 'x',
                    quantize: 5,
                    legend: {
                        position: 'bottom-right',
                        align: 'bottom'
                    },
                }
            },
        }
    });
});