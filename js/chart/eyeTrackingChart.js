const chapterId = sessionStorage.getItem("chapterId");
const url = `https://back.psj2867.com/api/data/screen/meta?id=${encodeURIComponent(
  chapterId
)}`;

let sid;
let width;
let height;
let id;
let instance;

document.addEventListener("DOMContentLoaded", function () {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      sid = data.sid;
      width = parseInt(data.width);
      height = parseInt(data.height);
      console.log(width, height);
      id = "screen";

      document.querySelector("#canvas").style.width = `${width + 100}px`;
      document.querySelector("#canvas").style.height = `${height + 50}px`;

      // requestImage(sid, id);
      drawHeatmap();
      instance = visualHeatmap("#canvas", {
        size: 50.0,
        max: 100,
        intensity: 1.0,
        opacity: 0.7,
        backgroundImage: {
          url: `https://back.psj2867.com/api/data/screen/image?sid=${sid}`,
          x: 0,
          y: 0,
          width: width,
          height: height,
        },
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
    })
    .catch((error) => console.error("Error fetching data:", error));

  let data = [];

  function drawHeatmap() {
    let imgElement = document.getElementById(id);
    screenX = imgElement.width;
    screenY = imgElement.height;

    const heatmapURL = `https://back.psj2867.com/api/data/eye/raw/chapter?id=${encodeURIComponent(
      chapterId
    )}`;

    fetch(heatmapURL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let heatmapData = generateData(data);
        instance.renderData(heatmapData);
      })
      .catch((error) => console.error("히트맵 데이터 가져오기 오류:", error));
  }

  function generateData(data) {
    var datas = [];
    let val = 30;
    const maxRatioY = getMaxRatioY(data);
    console.log(maxRatioY);
    for (let i = 0; i < data.length; i++) {
      let val = Math.random() * 100;
      datas.push({
        x: data[i].ratioX * width,
        y: data[i].ratioY * height,
        velX: random(0, 0),
        velY: random(0, 0),
        value: val,
        label: "label_" + i,
      });
    }
    return datas;
  }

  function getMaxRatioY(data) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Input must be a non-empty array");
    }

    return data.reduce((max, item) => {
      if (item.ratioY > max) {
        return item.ratioY;
      }
      return max;
    }, -Infinity);
  }

  function random(min, max) {
    var num = Math.random() * (max - min) + min;
    return num;
  }
});
