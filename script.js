const dateNow = new Date();
const day = dayString(dateNow);
const cityH1 = document.querySelector(".city h1");
const today = document.querySelector(".city h2");
const degrees = document.querySelector(".degrees");
const weather = document.querySelector(".weather-app p:last-child");
const max = document.querySelector(".max p");
const visibility = document.querySelector(".visibility p");
const min = document.querySelector(".min p");
const humidity = document.querySelector(".humidity p");
const body = document.querySelector("body");
const info = document.querySelectorAll(".info h3");

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getData(lat, lon);
  });
} else {
  alert(
    "I'm sorry, but geolocation services are not supported by your browser."
  );
}

async function getData(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=decfdd61b5ac2ba68b3b549d378565d0&units=metric`
    );
    const data = await response.json();
    weatherApp(data);
  } catch (erro) {
    console.log(erro);
  }
}

function dayString(dateNow) {
  switch (dateNow.getDay()) {
    case 1:
      return "Monday";

    case 2:
      return "Tuesday";

    case 3:
      return "Wednesday";

    case 4:
      return "Thursday";

    case 5:
      return "Friday";

    case 6:
      return "Saturday";

    case 7:
      return "Sunday";
  }
}

function weatherApp(data) {
  function getWeather(data) {
    if (data.weather[0].main === "Clear") {
      if (
        dateNow / 1000 > data.sys.sunrise &&
        dateNow / 1000 < data.sys.sunset
      ) {
        body.classList.add("clear");
      } else {
        body.classList.add("clearNight");
      }
    }

    if (data.weather[0].main === "Clouds") {
      if (
        dateNow / 1000 > data.sys.sunrise &&
        dateNow / 1000 < data.sys.sunset
      ) {
        body.classList.add("cloud");
      } else {
        cityH1.style.color = "white";
        body.classList.add("cloudNight");
        info.forEach((item) => (item.style.color = "white"));
      }
    }

    if (data.weather[0].main === "Rain") {
      body.classList.add("rain");
      info.forEach((item) => (item.style.color = "white"));
    }
  }
  getWeather(data);
  cityH1.innerText = `${data.name}, ${data.sys.country}`;
  today.innerText = `${day}
  ${dateNow.getHours()}:${
    dateNow.getMinutes() < 10
      ? "0" + dateNow.getMinutes()
      : dateNow.getMinutes()
  }`;
  degrees.innerText = `${data.main.temp.toFixed(0)}°`;
  weather.innerText = data.weather[0].description;
  max.innerText = `${data.main.temp_max.toFixed(0)}°`;
  visibility.innerText = `${(data.visibility / 1000).toFixed(0)}Km`;
  min.innerText = `${Math.trunc(data.main.temp_min)}°`;
  humidity.innerText = `${data.main.humidity}%`;
}
