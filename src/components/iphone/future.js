import { h, render, Component } from 'preact';
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
import Button from '../button';

export default class FutureWeatherPage extends Component {

	constructor(props){
		super(props);
		this.state.temp = "";
		this.fetchLocationData();
    var lat = localStorage.getItem("lat");
    var lon = localStorage.getItem("lon");
    this.fetchWeatherData(lat, lon);
	}

	fetchLocationData = () => {
		var url = "https://api.ipgeolocation.io/ipgeo?apiKey=d1445fb02bb84cf2bd348f8f08b8ef6a";
		$.ajax({
			url: url,
			dataType: "json",
			success : this.parseLocationResponse,
			error : function(req, err){ console.log('Location API call failed: ' + err); }
		})
	}

	parseLocationResponse = (data) => {
    localStorage.setItem("lat", data["latitude"]);
    localStorage.setItem("lon", data["longitude"]);
	}

  fetchWeatherData = (userlat, userlon) => {

    // weather forecast by id: Mile End:
    //var url = "http://api.openweathermap.org/data/2.5/forecast?id=2642541&units=metric&APPID=7d36dffbf1218e01f28b1df7a65231c9";

    // weather forecast by city: London:
    //var url = "http://api.openweathermap.org/data/2.5/forecast?q=London,uk&units=metric&APPID=7d36dffbf1218e01f28b1df7a65231c9";

    // weather forecast by lat and lon: current location of the user:
    var url1 = "http://api.openweathermap.org/data/2.5/forecast?lat=";
    var url2 = "&lon=";
    var url3 = "&units=metric&APPID=7d36dffbf1218e01f28b1df7a65231c9";
    var url = url1.concat(userlat,url2,userlon,url3);
    //console.log("Weather API call url with lat and lon: " + url);

    $.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseWeatherResponse,
			error : function(req, err){ console.log('Weather API call failed: ' + err); }
		})
	}

	parseWeatherResponse = (data) => {

		// need to store just 9am forecasts
		// in the api response, data['list']: forecasts in 3h intervals from midnight for next 5 days
		var i, responses9am = [];
		for (i = 0; i < data['list'].length; i++) {
      // if the current forecast in the array is for 9am
			if (data['list'][i].dt_txt.indexOf("09:00:00") !== -1) {
				responses9am.push(data['list'][i]);
			}
		}

		// extract required data for the next 4 forecasts
		var date = [], description = [], temperature = [], weatherID = []
		for (i = 0; i < 4; i++) {
			date.push(responses9am[i].dt_txt);
			description.push(responses9am[i].weather[0].description);
			temperature.push(responses9am[i].main.temp);
			weatherID.push(responses9am[i].weather[0].id);
		}

		this.setState({
			date1: this.getDay(date[0]),
			desc1: description[0],
			temp1: Math.round(temperature[0]),
			wid1: weatherID[0],

			date2: this.getDay(date[1]),
			desc2: description[1],
			temp2: Math.round(temperature[1]),
			wid2: weatherID[1],

			date3: this.getDay(date[2]),
			desc3: description[2],
			temp3: Math.round(temperature[2]),
			wid3: weatherID[2],

			date4: this.getDay(date[3]),
			desc4: description[3],
			temp4: Math.round(temperature[3]),
			wid4: weatherID[3]
		});
	}

	getDay = (dt_txt) => {
		// api response: "dt_txt": "2019-02-27 09:00:00"
		// get the first 10 characters and make a date
		var d = new Date(dt_txt.substring(0,11));
		var weekday = [];
		weekday[0] = "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
		return weekday[d.getDay()];
	}

	// https://openweathermap.org/weather-conditions
	iconChoice = (id) => {
		if (id >= 200 && id <= 232) {					//2xx thunderstorm
			return <img src="../../assets/icons/weather_2_thunderstorm.png"/>
		}
		else if (id >= 300 && id <= 321) {		//3xx drizzle
			return <img src="../../assets/icons/weather_3_drizzle.png"/>
		}
		else if (id >= 500 && id <= 531) {		//5xx rain
			return <img src="../../assets/icons/weather_5_rain.png"/>
		}
		else if (id >= 600 && id <= 622) {		//6xx snow
			return <img src="../../assets/icons/weather_6_snow.png"/>
		}
		else if (id >= 701 && id <= 781) {		//7xx atmosphere
			return <img src="../../assets/icons/weather_7_atmosphere.png"/>
		}
		else if (id==800) {										//800 clear
			return <img src="../../assets/icons/weather_8_clear.png"/>
		}
		else if (id >= 801 && id <= 804) {		//80x clouds
			return <img src="../../assets/icons/weather_8_clouds.png"/>
		}
    else {
      return <img src="../../assets/icons/error.png"/>
    }
	}

	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp1 ? `${style.ftemp} ${style.ffilled}` : style.ftemp;
		return (
			<div class={ style.container }>

				<div class={ style.nav }>
					<img src="https://img.icons8.com/ios/50/000000/circled-filled.png" height="12" width="12" />
					<img src="https://img.icons8.com/ios/50/000000/circled-filled.png" height="12" width="12" />
					<img src="https://img.icons8.com/ios/50/000000/filled-circle-filled.png" height="12" width="12" />
        </div>

				<div class={ style.forecast }>
					<div class={ style.ficon }>
						{ this.iconChoice(this.state.wid1) }
					</div>
					<div class={ style.ftext }>
						<div class={ style.fday }>
							{ this.state.date1 }
						</div>
						<div class={ style.fconditions }>
							{ this.state.desc1 }
						</div>
						<div class={ style.ftemp }>
							<span class={ tempStyles }>{ this.state.temp1 }</span>
						</div>
					</div>
				</div>

				<div class={ style.forecast }>
					<div class={ style.ficon }>
						{ this.iconChoice(this.state.wid2) }
					</div>
					<div class={ style.ftext }>
						<div class={ style.fday }>
							{ this.state.date2 }
						</div>
						<div class={ style.fconditions }>
							{ this.state.desc2 }
						</div>
						<div class={ style.ftemp }>
							<span class={ tempStyles }>{ this.state.temp2 }</span>
						</div>
					</div>
				</div>

				<div class={ style.forecast }>
					<div class={ style.ficon }>
						{ this.iconChoice(this.state.wid3) }
					</div>
					<div class={ style.ftext }>
						<div class={ style.fday }>
							{ this.state.date3 }
						</div>
						<div class={ style.fconditions }>
							{ this.state.desc3 }
						</div>
						<div class={ style.ftemp }>
							<span class={ tempStyles }>{ this.state.temp3 }</span>
						</div>
					</div>
				</div>

				<div class={ style.forecast }>
					<div class={ style.ficon }>
						{ this.iconChoice(this.state.wid4) }
					</div>
					<div class={ style.ftext }>
						<div class={ style.fday }>
							{ this.state.date4 }
						</div>
						<div class={ style.fconditions }>
							{ this.state.desc4 }
						</div>
						<div class={ style.ftemp }>
							<span class={ tempStyles }>{ this.state.temp4 }</span>
						</div>
					</div>
				</div>

			</div>
		);
	}

}
