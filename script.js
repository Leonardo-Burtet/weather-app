if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getDados(lat, lon);
    //getDados();
  });
}

async function getDados(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=decfdd61b5ac2ba68b3b549d378565d0&units=metric`
      //`https://api.openweathermap.org/data/2.5/weather?q=jamaica&appid=decfdd61b5ac2ba68b3b549d378565d0&units=metric&lang=pt_br`
    );
    const responseJSON = await response.json();
    console.log(responseJSON);

    const city = document.querySelector(".city h1");
    const today = document.querySelector(".city h2");
    const date = new Date();
    console.log(date / 1000);
    console.log(responseJSON.sys.sunrise);
    console.log(responseJSON.sys.sunset);
    city.innerText = `${responseJSON.name}, ${responseJSON.sys.country}`;
    today.innerText = date;
    const degrees = document.querySelector(".degrees");
    degrees.innerText = `${responseJSON.main.temp.toFixed(0)}°`;

    const weather = document.querySelector(".weather-app p:last-child");
    weather.innerText = responseJSON.weather[0].description.toUpperCase();

    const max = document.querySelector(".max p");
    max.innerText = `${responseJSON.main.temp_max.toFixed(0)}°`;

    const visibility = document.querySelector(".visibility p");
    visibility.innerText = `${(responseJSON.visibility / 1000).toFixed(0)}Km`;

    const min = document.querySelector(".min p");
    min.innerText = `${Math.trunc(responseJSON.main.temp_min)}°`;
    const humidity = document.querySelector(".humidity p");
    humidity.innerText = `${responseJSON.main.humidity}%`;

    const body = document.querySelector("body");
    const img = document.querySelector(".weather-app img");
    const info = document.querySelectorAll(".info h3");

    if (responseJSON.weather[0].main === "Clear") {
      if (
        date / 1000 > responseJSON.sys.sunrise &&
        date / 1000 < responseJSON.sys.sunset
      ) {
        img.src = "img/sun.png";
        body.classList.add("clear");
      } else {
        img.src = "img/moon.png";
        body.classList.add("clearNight");
      }
    } else if (responseJSON.weather[0].main === "Clouds") {
      img.src = "img/cloud.png";
      if (
        date / 1000 > responseJSON.sys.sunrise &&
        date / 1000 < responseJSON.sys.sunset
      ) {
        body.classList.add("cloud");
      } else {
        city.style.color = "white";
        body.classList.add("cloudNight");
        info.forEach((item) => (item.style.color = "white"));
      }
    } else if (responseJSON.weather[0].main === "Rain") {
      body.classList.add("rain");
      img.src = "img/rain.png";
      info.forEach((item) => (item.style.color = "white"));
      city.style.color = "white";
    }
  } catch (erro) {
    console.log(erro);
  }
}
