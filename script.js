const currentDate = new Date();
const currentDay = dayString(currentDate.getDay());
const nameCity = document.querySelector(".weather__city h1");
const nameDay = document.querySelector(".weather__city h2");
const degrees = document.querySelector(".degrees");
const max = document.querySelector(".max p");
const min = document.querySelector(".min p");
const section = document.querySelector("section");
const body = document.querySelector("body");
const nextDay = document.querySelectorAll(".next-day");

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
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=decfdd61b5ac2ba68b3b549d378565d0&units=metric`
    );
    const responseCity = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=decfdd61b5ac2ba68b3b549d378565d0&units=metric`
    );
    const currentData = await responseCity.json();
    const forecastData = await response.json();

    weatherApp(forecastData, currentData);
  } catch (erro) {
    console.log(erro);
  }
}

function addNextForecast(forecastData) {
  let index = 0;

  nextDay.forEach((element) => {
    console.log(element.children[2].children[1]);
    element.children[1].innerText = forecastData.daily[index].weather[0].main;
    element.children[2].children[1].innerText =
      forecastData.daily[index].temp.max.toFixed(0);
    element.children[2].children[3].innerText =
      forecastData.daily[index].temp.min.toFixed(0);
    index++;
  });
}

function nextForecast(forecastData) {
  let i = 0;
  const nextDate = currentDate.getDay() + 1;
  if (nextDate <= 4) {
    nextDay.forEach((element) => {
      element.children[0].innerText = dayString(nextDate + i++);
    });
    addNextForecast(forecastData);
  }

  if (nextDate === 5) {
    nextDay[0].children[0].innerText = dayString(5);
    nextDay[1].children[0].innerText = dayString(6);
    nextDay[2].children[0].innerText = dayString(7);
    addNextForecast(forecastData);
  }

  if (nextDate === 6) {
    nextDay[0].children[0].innerText = dayString(6);
    nextDay[1].children[0].innerText = dayString(7);
    nextDay[2].children[0].innerText = dayString(1);
    addNextForecast(forecastData);
  }

  if (nextDate === 7) {
    nextDay[0].children[0].innerText = dayString(7);
    nextDay[1].children[0].innerText = dayString(1);
    nextDay[2].children[0].innerText = dayString(2);
    addNextForecast(forecastData);
  }

  if (nextDate === 8) {
    nextDay[0].children[0].innerText = dayString(1);
    nextDay[1].children[0].innerText = dayString(2);
    nextDay[2].children[0].innerText = dayString(3);
    addNextForecast(forecastData);
  }
}

function dayString(day) {
  switch (day) {
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

function getWeather(forecastData) {
  if (forecastData.current.weather[0].main === "Clear") {
    if (
      currentDate / 1000 > forecastData.current.sunrise &&
      currentDate / 1000 < forecastData.current.sunset
    ) {
      body.classList.add("clear");
    } else {
      body.classList.add("clearNight");
    }
  }

  if (forecastData.current.weather[0].main === "Clouds") {
    if (
      currentDate / 1000 > forecastData.current.sunrise &&
      currentDate / 1000 < forecastData.current.sunset
    ) {
      body.classList.add("cloud");
    } else {
      nameCity.style.color = "white";
      body.classList.add("cloudNight");
      nameDay.style.color = "white";
    }
  }

  if (forecastData.current.weather[0].main === "Rain") {
    body.classList.add("rain");
  }
}

function weatherApp(forecastData, currentData) {
  section.style.opacity = "1";
  section.style.transition = "1s";
  nextForecast(forecastData);
  getWeather(forecastData, currentData);
  nameCity.innerText = `${currentData.name}, ${currentData.sys.country}`;
  nameDay.innerText = `${currentDay}
  ${currentDate.getHours()}:${
    currentDate.getMinutes() < 10
      ? "0" + currentDate.getMinutes()
      : currentDate.getMinutes()
  }`;
  degrees.innerText = `${forecastData.current.temp.toFixed(0)}°`;
  max.innerText = `${forecastData.daily[0].temp.max.toFixed(0)}°`;
  min.innerText = `${Math.trunc(forecastData.daily[0].temp.min)}°`;
}
