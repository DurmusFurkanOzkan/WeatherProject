const express = require('express');
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();


const contacts = new Map();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saterday",
  "Sunday"
];
const api = "ac91528b0cfbbbed4a4008ebfea14da4";

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  weather("Ankara", res);
});

app.post("/", function(req, res) {

  const query = req.body.cityName;
  weather(query, res);

});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})

function weather(CityName, res) {

  const d = new Date();
  var date = dayNames[d.getDay()] + " " + d.getDay() + " " + monthNames[d.getMonth()];

  const cityNameUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + CityName + "&appid=" + api;

  https.get(cityNameUrl, function(response) {
    response.on("data", function(data) {
      const weatherDatax = JSON.parse(data);
      const lon = weatherDatax.coord.lon;
      const lat = weatherDatax.coord.lat;
      const unit = "metric";
      const url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&cnt=6" + "&appid=" + api + "&units=" + unit;

      https.get(url, function(response) {
        response.on("data", function(data) {

          const weatherData = JSON.parse(data)
          const temp = (parseInt(weatherData.list[0].main.temp_min) + parseInt(weatherData.list[0].main.temp_min)) / 2;
          const tempMax = parseInt(weatherData.list[0].main.temp_max);
          const tempMin = parseInt(weatherData.list[0].main.temp_min);
          const windSpeed = parseInt(parseInt(weatherData.list[0].wind.speed, 10) * 2.23693629);
          const rainPop = parseInt(weatherData.list[0].pop * 100);
          const sunrise = CreateDate(parseInt(weatherData.city.sunrise));
          const sunset = CreateDate(parseInt(weatherData.city.sunset));
          const description = weatherData.list[0].weather[0].description;
          const icon = weatherData.list[0].weather[0].icon;
          const imageUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
          for (let i = 0; i < 6; i++) {

            contacts.set(i, {
              hour: weatherData.list[i].dt_txt.slice(11, 16),
              icon: "https://openweathermap.org/img/wn/" + weatherData.list[i].weather[0].icon + "@2x.png",
              degree: (parseInt(weatherData.list[i].main.temp_min) + parseInt(weatherData.list[i].main.temp_min)) / 2
            });
          }

          res.render("main", {
            cityNameEjs: CityName,
            dateEjs: date,
            imageUrlEjs: imageUrl,
            tempUrlEjs: temp,
            descriptionUrlEjs: description,
            tempMaxEjs: tempMax,
            windSpeedEjs: windSpeed,
            sunriseEjs: sunrise,
            tempMinEjs: tempMin,
            rainPopEjs: rainPop,
            sunsetEjs: sunset,
            contactsEjs: contacts
          });
        });
      });

    });
  });

}

function CreateDate(sun) {
  var date = new Date(sun * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var formattedTime = hours + ':' + minutes.substr(-2);

  return formattedTime;
}
