import { h, render, Component } from 'preact';
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
import Button from '../button';
import TubeStatusPage from './tube.js';
import CurrentWeatherPage from './current.js';
import FutureWeatherPage from './future.js';
import React from 'react';
//https://reactjsexample.com/a-pure-reactjs-carousel-component/
//https://github.com/FormidableLabs/nuka-carousel#readme
import Carousel from 'nuka-carousel';

export default class IPhone extends Component {

	constructor(props){
		super(props);
	}

  render() {
		return (
			/*slide function */
			<Carousel
			renderCenterLeftControls={null}
			renderCenterRightControls={null}
			renderBottomCenterControls={null}
			slideIndex = {1}
			>
				<TubeStatusPage />
				<CurrentWeatherPage />
				<FutureWeatherPage />
			</Carousel>
		);
	}

}
