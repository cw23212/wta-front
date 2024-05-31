const chapterId = sessionStorage.getItem("chapterId");
const url = `http://n2.psj2867.com:18080/api/data/screen/meta?id=${encodeURIComponent(
  chapterId
)}`;

let sid;
let width;
let height;
let id;

document.addEventListener("DOMContentLoaded", function () {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      sid = data.sid;
      width = parseInt(data.width);
      height = parseInt(data.height);
      id = "screen";

      requestImage(sid, id);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function requestImage(sid, id) {
    let imageData = null;

    fetch(`http://n2.psj2867.com:18080/api/data/screen/image?sid=${sid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        imageData = URL.createObjectURL(blob);
        document.querySelector("#imgDiv").style.width = `${width + 100}px`;
        document.querySelector(".card-body").style.height = `${height + 50}px`;
        const imgElement = document.getElementById(id);
        imgElement.src = imageData;
        imgElement.onload = () => {
          drawHeatmap();
        };
      })
      .catch((error) => console.error("Error fetching image:", error));
  }

  let data = [];
  let instance = visualHeatmap("#canvas", {
    size: 15.0,
    max: 100,
    intensity: 1.0,
    gradient: [
      {
        color: [0, 0, 0, 0.0],
        offset: 0,
      },
      {
        color: [0, 0, 255, 0.2],
        offset: 0.2,
      },
      {
        color: [0, 255, 0, 0.5],
        offset: 0.45,
      },
      {
        color: [255, 255, 0, 1.0],
        offset: 0.85,
      },
      {
        color: [255, 0, 0, 1.0],
        offset: 1.0,
      },
    ],
  });

  function drawHeatmap() {
    let imgElement = document.getElementById(id);
    screenX = imgElement.width;
    screenY = imgElement.height;

    const heatmapURL = `http://n2.psj2867.com:18080/api/data/eye/heatmap/chapter?id=${encodeURIComponent(
      chapterId
    )}&width=${encodeURIComponent(screenX)}&height=${encodeURIComponent(
      screenY
    )}`;

    fetch(heatmapURL)
      .then((response) => response.json())
      .then((data) => {
        let heatmapData = generateData(data);
        instance.renderData(heatmapData);
      })
      .catch((error) => console.error("히트맵 데이터 가져오기 오류:", error));
  }

  function makeInstance(screenX, screenY) {
    let instance = visualHeatmap("#canvas", {
      size: 15.0,
      max: 100,
      intensity: 1.0,
      gradient: [
        {
          color: [0, 0, 0, 0.0],
          offset: 0,
        },
        {
          color: [0, 0, 255, 0.2],
          offset: 0.2,
        },
        {
          color: [0, 255, 0, 0.5],
          offset: 0.45,
        },
        {
          color: [255, 255, 0, 1.0],
          offset: 0.85,
        },
        {
          color: [255, 0, 0, 1.0],
          offset: 1.0,
        },
      ],
    });

    return instance;
  }

  function generateData(data) {
    var datas = [];
    let val = 1;
    for (let i = 0; i < data.length; i++) {
      let val = Math.random() * 100;
      datas.push({
        x: data[i].ratioX * screenX,
        y: data[i].ratioY * screenY,
        velX: random(0, 0),
        velY: random(0, 0),
        value: val,
        label: "label_" + i,
      });
    }
    return datas;
  }

  function random(min, max) {
    var num = Math.random() * (max - min) + min;
    return num;
  }
});
