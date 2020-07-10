// Selectors
var continueButton = document.querySelector('.continue');
var cityInput = document.querySelector('#city');
var leavingDate = document.querySelector('#leaving');
var returningDate = document.querySelector('#returning');
var searchBox = document.querySelector('.search_box');
var resultBox = document.querySelector('.result_box');
var img = document.querySelector('#img');
var countryText = document.querySelector('#country_info');
var cityText = document.querySelector('#city_info');
var weatherDataText = document.querySelector('#weather_info');

// Variables
const weatherKey = '34bc3d5d80dd4248923dfc2e65a0ad63';
const pixKey = '16992641-bb3cab3a06cd465afa4715255';
const usernameGeoNames = 'onono';
var city = '';
var cityFoundByGeoNames = '';
var cityLat = 0;
var cityLng = 0;
var canBeFound = false;
var firstDate = 0;
var secondDate = 0;
var currentDate = new Date();
const milisecondsInOneDay = 1000 * 60 * 60 * 24;

//Continue Button And Inputs check
continueButton.addEventListener('click', function (clicked) {
  let inputsCounter = 0;

  if(cityInput.value !== '') {
    removeRedBorderError(cityInput);
    inputsCounter++;
  } else {
    addRedBorderError(cityInput);
  }
  // it checks if the year, month and day are after the current day
  if(leavingDate.value !== '') {
    firstDate = new Date(leavingDate.value);
    let yearIsMore = firstDate.getYear() > currentDate.getYear();
    let yearIsEqual = firstDate.getYear() === currentDate.getYear();
    let monthIsMore = firstDate.getMonth() > currentDate.getMonth();
    let monthIsEqual = firstDate.getMonth() === currentDate.getMonth();
    let dayIsMoreOrEqual = firstDate.getDate() >= currentDate.getDate();

    if(yearIsMore) {
      removeRedBorderError(leavingDate);
      inputsCounter++;
    } else if(yearIsEqual) {

      if(monthIsMore) {
        removeRedBorderError(leavingDate);
        inputsCounter++;
      } else if(monthIsEqual) {

        if(dayIsMoreOrEqual) {
          removeRedBorderError(leavingDate);
          inputsCounter++;
        } else {
          addRedBorderError(leavingDate);
        }
      } else {
        addRedBorderError(leavingDate);
      }
    } else {
      addRedBorderError(leavingDate);
    }
  } else {
    addRedBorderError(leavingDate);
  }

  if(returningDate.value !== '') {
    secondDate = new Date(returningDate.value);
    if(secondDate > firstDate) {
      removeRedBorderError(returningDate);
      inputsCounter++;
    } else {
      addRedBorderError(returningDate);
    }
  } else {
    addRedBorderError(returningDate);
  }

  // if every input is filled correctly, get city details
  if(inputsCounter === 3) {
    city = cityInput.value.toLowerCase();
    getDetails();
  }

});

async function getDetails() {
  if(city) {
    await getCityCoordinates(city);
    if(canBeFound) {
      getWeatherData(cityFoundByGeoNames);
      getCityPicture(cityFoundByGeoNames);
      resultBox.classList.remove('hidden');
    }
  }
}

async function getCityCoordinates(currentCity) {
  return new Promise((resolve, reject) => {
    let encodedCity = encodeURI(currentCity);
    let geoNamesUrl = `http://api.geonames.org/postalCodeSearchJSON?placename=${encodedCity}&maxRows=1&username=${usernameGeoNames}`;
    fetch(geoNamesUrl)
      .then((data) => data.json())
      .then((data) => {
        if(data.postalCodes.length !== 0) {
          canBeFound = true;
          cityLat = data.postalCodes[0].lat;
          cityLng = data.postalCodes[0].lng;
          cityFoundByGeoNames = data.postalCodes[0].placeName;
          getCountryName(data.postalCodes[0].countryCode)
            .then((countryName) => {
              countryText.textContent = countryName;
            })
            .catch((err) => {
              console.log(err);
            });

          cityInput.value = cityFoundByGeoNames;
          cityText.textContent = cityFoundByGeoNames;
          removeRedBorderError(cityInput);
        } else {
          addRedBorderError(cityInput);
          canBeFound = false;
        }
        resolve(1);
      })

      .catch((err) => {
        console.log(err);
      });
  });

}

function getCountryName(countryCode) {
  return new Promise((resolve, reject) => {
    let geoNamesUrl = `http://api.geonames.org/postalCodeCountryInfoJSON?formatted=true&&username=${usernameGeoNames}&style=full`;
    fetch(geoNamesUrl)
      .then((data) => data.json())
      .then((data) => {
        let countryNameArr = data.geonames.filter((item) => {
          return item.countryCode === countryCode;
        });
        resolve(countryNameArr[0].countryName);
      })
      .catch((err) => {
        console.log(err);
      });
  });

}

function getWeatherData(currentCity) {
  let daysBeforeVacation = calculateDateDifference(currentDate, firstDate);
  daysBeforeVacation += 2;
  let weatherUrl = '';
  weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${currentCity}&key=${weatherKey}&days=${daysBeforeVacation}`;
  fetch(weatherUrl)
    .then((data) => data.json())
    .then((data) => {
      if(data.data.length !== 0) {
        let weatherDataArr = data.data;
        let weatherData = weatherDataArr[weatherDataArr.length - 1];
        weatherDataText.textContent = `${weatherData.max_temp}° C / ${weatherData.min_temp}° C, ${weatherData.weather.description}`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function calculateDateDifference(first, second) {
  let differenceInMs = second - first;
  return Math.round(differenceInMs / milisecondsInOneDay);
}

function getCityPicture(currentCity) {
  let pictureUrl = `https://pixabay.com/api/?key=${pixKey}&q=${currentCity}&image_type=photo&category=travel`;
  fetch(pictureUrl)
    .then((data) => data.json())
    .then((data) => {
      if(data.total !== 0) {
        img.src = data.hits[0].webformatURL;
        img.style.border = '1px solid white';
      } else {
        pictureUrl = `https://pixabay.com/api/?key=${pixKey}&q=luggage&image_type=photo`;
        fetch(pictureUrl)
          .then((data) => data.json())
          .then((data) => {
            img.src = data.hits[0].webformatURL;
            img.style.border = '1px solid white';
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// Input Error Red Border
function addRedBorderError(currentInput) {
  currentInput.style.border = '1px solid rgb(189, 25, 25)';
  currentInput.style.borderRadius = '2px';
}

function removeRedBorderError(currentInput) {
  currentInput.style.border = '1px solid black';
}
