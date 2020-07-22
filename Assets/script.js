$(document).ready(function(){

let today = moment().format("MMM Do YY"); 
let city;
var main = $(".main-dash");

//Retrieve any saved locations into loal storage
let lastSearched = localStorage.getItem("city");

if(lastSearched) {
let savedBtn = $('<button>');

    savedBtn.attr("id", lastSearched);
    savedBtn.addClass("city-button");
    savedBtn.text(lastSearched);

    $("#city-buttons").append(savedBtn);
}

function findWeather() {
    event.preventDefault();

    main.attr("style", "opacity: 1;")

    var apiKey = "2b0a60281cd72b23b54eac2117dc2c30";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        $(".city-name").text(`${response.name} (${today})`);
        $(".temp").text("Temperature: " + Math.floor((response.main.temp - 273.15) * 1.80 + 32) + "\xB0F");
        $(".humidity").text("Humidity: " + response.main.humidity + "%");
        $(".wind").text("Wind Speed: " + Math.floor((response.wind.speed)*2.237) + "mph");
    
    let lat = response.coord.lat;
    let lon = response.coord.lon;
    var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        let uvIndex = response.current.uvi;
        $("#uvIndexSpan").text(uvIndex);

        if(uvIndex < 3) {
            $("#uvIndexSpan").attr("style", "background-color: rgb(0, 190, 0);");
        } else if (uvIndex > 5) {
            $("#uvIndexSpan").attr("style", "background-color: rgb(212, 7, 7);");
        } else {
            $("#uvIndexSpan").attr("style", "background-color: yellow;");
        }

        for(let i = 0; i < 6; i++){
            let date = moment().add(i+1, 'days').calendar();
            let day = date.split(" ", 1);
            $(`#date${i}`).text(day);

            let icon = response.daily[i].weather[0].icon;
            $(`.weather-icon${i}`).attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);

            let futureTempMin = Math.floor((response.daily[i].temp.min - 273.15) * 1.80 + 32);
            let futureTempMax = Math.floor((response.daily[i].temp.max - 273.15) * 1.80 + 32);
            $(`#temp${i}`).text(futureTempMin + "\xB0F/" + futureTempMax + "\xB0F");

            let futureHumidity = response.daily[i].humidity;
            $(`#humidity${i}`).text("Humidity: " + futureHumidity + "%");
        }
    });

    });
}

$("#search-button").on("click", function(event){
    city = $(".search-input").val();

    localStorage.setItem("city", city);

    let newBtn = $('<button>');

    newBtn.attr("id", city);
    newBtn.addClass("city-button");
    newBtn.text(city);

    $("#city-buttons").append(newBtn);

    findWeather();
});

$(".city-button").on("click", function(event){
    city = $(this).attr("id");
    
    findWeather();
});

});