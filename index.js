/*
colors[n][0] : Primary color
colors[n][1] : Primary light color
colors[n][2] : Primary backgroud color
colors[n][3] : Primary light backgroud color
colors[n][4] : Text color
*/
let prevPalette;
const colors = [
  [
    "#4a148c",
    "#7c43bd",
    "linear-gradient(145deg, #43127e, #4f1596)",
    "linear-gradient(145deg, #703caa, #8548ca)",
    "#12005e",
  ],
  [
    "#1a237e",
    "#534bae",
    "linear-gradient(145deg, #172071, #1c2587)",
    "linear-gradient(145deg, #4b449d, #5950ba)",
    "#000051",
  ],
  [
    "#880e4f",
    "#bc477b",
    "linear-gradient(145deg, #7a0d47, #920f55)",
    "linear-gradient(145deg, #a9406f, #c94c84)",
    "#560027",
  ],
  [
    "#004d40",
    "#38786a",
    "linear-gradient(145deg, #00453a, #005244)",
    "linear-gradient(145deg, #326c5f, #3c8071)",
    "#002419",
  ],
  [
    "#212121",
    "#484848",
    "linear-gradient(145deg, #1e1e1e, #232323)",
    "linear-gradient(145deg, #414141, #4d4d4d)",
    "#000000",
  ],
  [
    "#263238",
    "#4f5b62",
    "linear-gradient(145deg, #222d32, #29363c)",
    "linear-gradient(145deg, #475258, #556169)",
    "#000a12",
  ],
];
const keys = [
  "primary",
  "primary-l",
  "primary-bg",
  "primary-bg-l",
  "text-color",
];

const name = document.querySelector("#name"),
  country = document.querySelector("#country"),
  tempText = document.querySelector("#temp-text"),
  descriptionText = document.querySelector("#description-text"),
  humidityText = document.querySelector("#humidity-text"),
  changeUnitBtn = document.querySelector("#changeUnit"),
  windText = document.querySelector("#wind-text"),
  minText = document.querySelector("#min-text"),
  maxText = document.querySelector("#max-text"),
  temp = document.querySelector("#temp"),
  humidity = document.querySelector("#humidity"),
  wind = document.querySelector("#wind"),
  min = document.querySelector("#min"),
  max = document.querySelector("#max"),
  colorController = document.querySelector(".rand-color");

const weatherInfoNodes = [humidity, max, min, wind];
const btns = [colorController, changeUnitBtn];
const tempTextNodes = [tempText, minText, maxText];

const removeAnimations = (node, className) => {
    node.addEventListener('animationend', e => {
        node.classList.remove(className);
    })
}

tempTextNodes.forEach(node => {
    removeAnimations(node, 'increaseXText');
})

btns.forEach(btn=>{
    removeAnimations(btn, 'clicked');
})

removeAnimations(temp, 'incrementY');

weatherInfoNodes.forEach(node => {
  removeAnimations(node, 'incrementX');
});
let temperature = {
  main: 0,
  max: 0,
  min: 0,
};
const fahrStr = "° F";
const celStr = "° C";

const celsToFahr = (temp) => temp * 1.8 + 32;
const fahrToCels = (temp) => (temp - 32) / 1.8;

let isCelsius = true;
function changeCelsius(e) {
  const convUnit = isCelsius ? celsToFahr : fahrToCels;
  const neutral = isCelsius ? fahrStr : celStr;

  for (let key in temperature) {
    temperature[key] = convUnit(temperature[key]);
  }

  tempText.innerText = Math.round(temperature.main);
  minText.innerText = Math.round(temperature.min) + neutral;
  maxText.innerText = Math.round(temperature.max) + neutral;
  this.innerText = neutral;
  isCelsius = !isCelsius;

  tempTextNodes.forEach(node => {
      node.classList.add('increaseXText');
  })
}

function changeDate() {
  const now = new Date();

  const dateStr = `${now.toGMTString().slice(0, 16)}`;
  const timeStr = `${(now.getHours() < 10 ? "0" : "") + now.getHours()}:${
    (now.getMinutes() < 10 ? "0" : "") + now.getMinutes()
  }:${(now.getSeconds() < 10 ? "0" : "") + now.getSeconds()} hrs`;

  document.querySelector("#date-text").innerText = dateStr;
  document.querySelector("#time-text").innerText = timeStr;
  setTimeout(changeDate, 1000);
}
async function getWeather(latitude, longitude) {
  let res = await fetch(
    `https://fcc-weather-api.glitch.me//api/current?lon=${longitude}&lat=${latitude}`
  );
  let data = await res.json();

  return data;
}
function setupUIColors() {
  let root = document.documentElement;
  const palette = colors[Math.round(Math.random() * (colors.length - 1))];

  if(prevPalette == palette[0]){
      setupUIColors()
      return;
  }
  prevPalette = palette[0];
  keys.forEach((key, i) => {
    root.style.setProperty(`--${key}`, `${palette[i]}`);
  });
  temp.classList.add("incrementY");
  weatherInfoNodes.forEach(node => {
      node.classList.add('incrementX');
  })
}
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      getWeather(latitude, longitude).then((data) => {
        temperature.main = +data.main.temp;
        temperature.max = +data.main.temp_max;
        temperature.min = +data.main.temp_min;

        minText.innerText = Math.round(temperature.min) + celStr;
        maxText.innerText = Math.round(temperature.max) + celStr;
        name.innerText = data.name;
        country.innerText = data.sys.country;
        tempText.innerText = Math.round(temperature.main);
        descriptionText.innerText = data.weather[0].main;
        humidityText.innerHTML += data.main.humidity + "%";
        changeUnitBtn.innerText = celStr;
        windText.innerText = data.wind.speed + " km";

        const funcs = [setupUIColors, changeCelsius];

        btns.forEach((btn, i)=> {
            btn.addEventListener('click', ()=>{
                btn.classList.add('clicked');

                funcs[i]();
            })
        })

        changeDate();
        document.querySelector('.enable-geo').style.setProperty('display', 'none');
        document.querySelector(".weather").style.setProperty("display", "flex");
        setupUIColors();
      });
    }
  );
}
