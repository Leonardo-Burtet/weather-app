const currentDate = new Date();
const day = dayString(currentDate.getDay());
const cityH1 = document.querySelector(".city h1");
const today = document.querySelector(".city h2");
const degrees = document.querySelector(".degrees");
const max = document.querySelector(".max p");
const min = document.querySelector(".min p");
const body = document.querySelector("body");
const info = document.querySelectorAll(".info h3");
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
    const dataCity = await responseCity.json();
    const data = await response.json();

    weatherApp(data, dataCity);
  } catch (erro) {
    console.log(erro);
  }
}

function addNextForecast(data) {
  let index = 0;
  console.log(nextDay);
  nextDay.forEach((element) => {
    element.children[1].innerText = data.daily[index].weather[0].main;
    element.children[3].innerText = data.daily[index].temp.max.toFixed(0);
    element.children[5].innerText = data.daily[index].temp.min.toFixed(0);
    index++;
  });
}

function nextForecast(data) {
  let i = 0;
  console.log(data);
  const nextDate = currentDate.getDay() + 1;
  if (nextDate <= 4) {
    nextDay.forEach((element) => {
      element.children[0].innerText = dayString(nextDate + i++);
    });
    addNextForecast(data);
  }

  if (nextDate === 5) {
    nextDay[0].children[0].innerText = dayString(5);
    nextDay[1].children[0].innerText = dayString(6);
    nextDay[2].children[0].innerText = dayString(7);
    addNextForecast(data);
  }

  if (nextDate === 6) {
    nextDay[0].children[0].innerText = dayString(6);
    nextDay[1].children[0].innerText = dayString(7);
    nextDay[2].children[0].innerText = dayString(1);
    addNextForecast(data);
  }

  if (nextDate === 7) {
    nextDay[0].children[0].innerText = dayString(7);
    nextDay[1].children[0].innerText = dayString(1);
    nextDay[2].children[0].innerText = dayString(2);
    addNextForecast(data);
  }

  if (nextDate === 8) {
    nextDay[0].children[0].innerText = dayString(1);
    nextDay[1].children[0].innerText = dayString(2);
    nextDay[2].children[0].innerText = dayString(3);
    addNextForecast(data);
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

function weatherApp(data, dataCity) {
  nextForecast(data);
  function getWeather(data) {
    if (data.current.weather[0].main === "Clear") {
      if (
        currentDate / 1000 > data.current.sunrise &&
        currentDate / 1000 < data.current.sunset
      ) {
        body.classList.add("clear");
      } else {
        body.classList.add("clearNight");
      }
    }

    if (data.current.weather[0].main === "Clouds") {
      if (
        currentDate / 1000 > data.current.sunrise &&
        currentDate / 1000 < data.current.sunset
      ) {
        body.classList.add("cloud");
      } else {
        cityH1.style.color = "white";
        body.classList.add("cloudNight");
        info.forEach((item) => (item.style.color = "white"));
      }
    }

    if (data.current.weather[0].main === "Rain") {
      body.classList.add("rain");
      info.forEach((item) => (item.style.color = "white"));
    }
  }
  getWeather(data, dataCity);
  cityH1.innerText = `${dataCity.name}, ${dataCity.sys.country}`;
  today.innerText = `${day}
  ${currentDate.getHours()}:${
    currentDate.getMinutes() < 10
      ? "0" + currentDate.getMinutes()
      : currentDate.getMinutes()
  }`;
  degrees.innerText = `${data.current.temp.toFixed(0)}°`;
  max.innerText = `${data.daily[0].temp.max.toFixed(0)}°`;
  min.innerText = `${Math.trunc(data.daily[0].temp.min)}°`;
}
