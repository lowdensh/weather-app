import { h, render, Component } from 'preact';
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
import Button from '../button';

export default class CurrentWeatherPage extends Component {

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

    // current weather by id: Mile End:
    //var url = "http://api.openweathermap.org/data/2.5/weather?id=2642541&units=metric&APPID=7d36dffbf1218e01f28b1df7a65231c9";

    // current weather by city: London:
    //var url = "http://api.openweathermap.org/data/2.5/weather?q=London,uk&units=metric&APPID=7d36dffbf1218e01f28b1df7a65231c9";

    // current weather by lat and lon: current location of the user:
    var url1 = "http://api.openweathermap.org/data/2.5/weather?lat=";
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

	parseWeatherResponse = (parsed_json) => {
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var conditions = parsed_json['weather']['0']['description'];
		var weatherIcon = parsed_json['weather']['0']['id'];
		var drawline = JSON.parse(localStorage.getItem("FaveHtml"))

		this.setState({
			locate: location,
			temp: Math.round(temp_c),
			cond: conditions,
			icon: weatherIcon,
			faveLoc:drawline
		});
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
		const tempStyles = this.state.temp ? `${style.ctemp} ${style.cfilled}` : style.ctemp;
		return (
			<div class = { style.container }>

        <div class = { style.nav }>
          <img src = "https://img.icons8.com/ios/50/000000/circled-filled.png" height="12" width="12" />
          <img src = "https://img.icons8.com/ios/50/000000/filled-circle-filled.png" height="12" width="12" />
          <img src = "https://img.icons8.com/ios/50/000000/circled-filled.png" height="12" width="12" />
        </div>

				<div class = { style.main }>
  				<div class = { style.clocation }>
						{ this.state.locate }
          </div>
  				<div class = { style.cicon }>
            { this.iconChoice(this.state.icon) }
          </div>
  				<div class = { style.cconditions }>
            { this.state.cond }
          </div>
  				<div class = { style.ctemp }>
  				  <span class = { tempStyles }>{ this.state.temp }</span>
          </div>
        </div>

        <div class = { style.favourites }>
					{this.state.faveLoc}
        </div>

      </div>
		);
	}

}
