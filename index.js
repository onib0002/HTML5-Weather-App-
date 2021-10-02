import { getForecast, createWeatherIcon } from './weather.service.js'
import { getGeolocation } from './map.service.js'
var data = []
var x, y//interval variable declaration
function main () {
  try {
    const getWeather = document.getElementById('getWeather')
    getWeather.addEventListener('click', search)

    let currentLocation = document.getElementById('getLocation')
    currentLocation.addEventListener('click', getCurrentLocation)

    const getHourly = document.getElementById('getHourly')
    getHourly.addEventListener('click', hourlyWeather)

    const getDaily = document.getElementById('getDaily')
    getDaily.addEventListener('click', dailyWeather)
  } catch (error) {
    console.log(error.message)
  }
}
function getCurrentLocation () {
  //localStorage.setItem(findCity, JSON.stringify(forecast))
  let opts = {
    enableHighAccuracy: true,
    timeout: 1000 * 10, //10 seconds
    maximumAge: 1000 * 60 * 5 //5 minutes
  }
  navigator.geolocation.getCurrentPosition(ftw, wtf, opts)
}
async function ftw (position) {
  //got position
  let latitude = position.coords.latitude.toFixed(2)
  //console.log(position.coords.latitude.toFixed(2))
  let longitude = position.coords.longitude.toFixed(2)
  //console.log(position.coords.longitude.toFixed(2))
  let currentLocation = await getForecast({ latitude, longitude })
  console.log(currentLocation)
  let location = []
  location.push(currentLocation.current)
  console.log(location)
  //currentLocation.current
  showWeather(location)
}
function wtf (err) {
  //geolocation failed
  console.error(err)
}

async function search (event) {
  //event.preventDefault()
  console.log('search location')
  const findCity = document.getElementById('city').value
  let coord = await getGeolocation(findCity)
  let forecast = await getForecast({ coord })
  data = forecast
  if (findCity == '') {
    console.log('enter location')
    document.getElementById('.container').innerHTML = 'getCurrentLocation'
  } else {
    localStorage.setItem(findCity, JSON.stringify(forecast))
    console.log(forecast)
    let displayCurrent = []
    displayCurrent.push(forecast.current)
    showWeather(displayCurrent)
  }
}

function showWeather (resp) {
  console.log(resp)
  let row = document.querySelector('.container')
  //clear out the old weather and add the new
  row.innerHTML = resp
    .map((day, idx) => {
      console.log(day)
      if (idx <= 5) {
        let dt = new Date(day.dt * 1000) //timestamp * 1000
        let time = getTime(dt.getHours())
        let sr = new Date(day.sunrise * 1000).toTimeString()
        let ss = new Date(day.sunset * 1000).toTimeString()
        return `<div class="col">
            <div class="card">
            <h5 class="card-title p-2">${dt.toDateString()}</h5>
            <h5 class="card-title p-2">${time}</h5>
              <img
                src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@4x.png"
                class="card-img-top"
                alt="${day.weather[0].description}"
              />
              <div class="card-body">
                <h3 class="card-title">${day.weather[0].main}</h3>
                <p class="card-text">Temp ${day.temp.max || day.temp}&deg;C</p>
                <p class="card-text">High Feels like ${day.feels_like.day ||
                  day.feels_like}&deg;C</p>
                <p class="card-text">Pressure ${day.pressure}mb</p>
                <p class="card-text">Humidity ${day.humidity}%</p>
                <p class="card-text">UV Index ${day.uvi}</p>
                <p class="card-text">Precipitation ${day.pop * 100}%</p>
                <p class="card-text">Dewpoint ${day.dew_point}</p>
                <p class="card-text">Wind ${day.wind_speed}m/s, ${
          day.wind_deg
        }&deg;</p>
                <p class="card-text">Sunrise ${sr}</p>
                <p class="card-text">Sunset ${ss}</p>
              </div>
            </div>
          </div>
        </div>`
      }
    })
    .join(' ')
}
function hourlyWeather () {
  clearInterval(x)
  clearInterval(y)
  x = setInterval(hourlyWeather, 5000)
  let displayHourly = []
  //displayHourly.push(data.hourly)
  displayHourly = data.hourly
  console.log(displayHourly)
  showWeather(displayHourly)
}
function dailyWeather () {
  clearInterval(x)
  clearInterval(y)
  y = setInterval(dailyWeather, 5000)
  let displayDaily = []
  //displayHourly.push(data.hourly)
  displayDaily = data.daily
  console.log(displayDaily)
  showWeather(displayDaily)
}
function getTime (hour) {
  let time = ''
  if (hour > 12) {
    time = `${(hour -= 12)}:00 PM`
  } else if (hour === 0) {
    time = '12:00 AM'
  } else {
    time = `${hour}:00 AM`
  }
  return time
}
document.addEventListener('DOMContentLoaded', main)
