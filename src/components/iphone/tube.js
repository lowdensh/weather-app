import { h, render, Component } from 'preact';
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
import Button from '../button';

export default class TubeStatusPage extends Component {

	constructor(props){
		super(props);
		//generates local storage to allow user to store their favorite tube lines
		if(localStorage.getItem("favel1") == null){
			localStorage.setItem("favel1",-1)
		}
		if(localStorage.getItem("favel2") == null){
			localStorage.setItem("favel2",-1)
		}
		//if there is an issue where the total number of lines is less than 0 it will reset the favorited
		if(localStorage.getItem("tfavLines") == null || localStorage.getItem('tfavLines') < 0){
			localStorage.setItem("tfavLines",0)
			localStorage.setItem("favel1",-1)
			localStorage.setItem("favel2",-1)
		}
		//gets the tube stats date from the tfl api
		this.fetchTrainData();
	}

	//creates the tube lines in html format so that it give it the
	//correct inforamtion e.g. the name will have the correct style
	createDivs= () =>{

		let drawline = []

		for(let i = 0; i < 11; i++){

			let lineName = this.returnName(i);
			let staleVal = this.returnServStat(i);
			drawline.push(
				<div class ={ style.lineContainer } id = {this.containerName(lineName)}>
					<div id = {this.decideNameCol(lineName)} class = {style.lineName}>{lineName}</div>
					<div class = { this.decideServiceStyle(staleVal)}>{staleVal}</div>
					<button class = {this.filStart(i)} onClick ={this.updateFaves(i)}/>
				</div>
			)
		}
		return drawline
	}

	//makes the star filled if it is favorited
	filStart=(data)=>{
		for(let i =0;i<2;i++){
			if(data == this.listFaves(i))
			{
				return style.isFavourite;
			}
		}
		return style.addFavourite;
	}

	//returns the favorite depending on the number taken in
	listFaves = (num) => {
		switch (num) {
			case 0: return localStorage.getItem('favel1');
			case 1: return localStorage.getItem('favel2');
		}
	}
	//assignes the favorite tube line depending on the number and the value store the tube line
	assigneto = (num,val)=>{
		switch (num) {
			case 0: localStorage.setItem('favel1',val);break;
			case 1: localStorage.setItem('favel2',val);break;

		}
	}

	//checks the name of the current station to see if its already in the favorites
	//and if it is it removes it finishing by returning false otherwise it will return true
	checkName = (nameOfStaytion) => {
		for(let i = 0;i < 2;i++){
			if(nameOfStaytion == this.listFaves(i)){
				localStorage.setItem('tfavLines',parseInt(localStorage.getItem('tfavLines'))-1)
				if(i == 0){
						this.assigneto(i,localStorage.getItem('favel2'));
						this.assigneto(i+1,-1);
				}else{
						this.assigneto(i,-1);
				}
				return false
			}
		}
		return true
	}

	//assignes the tube to the favorites  if checkName returns true otherwise
	//updates the favourites in all pages its present in
	updateFaves = (lName) => () => {
		if(this.checkName(lName)){
			for(let i = 0;i < 2;i++){
				if(-1 == this.listFaves(i)){
					localStorage.setItem('tfavLines',parseInt(localStorage.getItem('tfavLines'))+1)
					this.assigneto(i,lName);
					break
				}
			}
		}
		this.updateFave();
   	location.reload(true);
	}

	//handles the visual update of the favourites
	updateFave= ()=>{
		let faveLayout = this.createFavs();
		this.setState({faveLocation:faveLayout});
	}


	//creates the html code for the favourite tube lines
	createFavs= () =>{

		let drawline = []
		for(let i = 0;i < parseInt(localStorage.getItem('tfavLines'));i++){
			let lineName = ""
			let staleVal = ""
			let numval = this.listFaves(i);

			lineName = this.linesName[numval];
			staleVal = this.linesStats[numval];

			drawline.push(
				<div class ={ style.lineContainer } id = {this.containerName(lineName)}>
					<div id = {this.decideNameCol(lineName)} class = {style.lineName}>{lineName}</div>
					<div class = { this.decideServiceStyle(staleVal)}>{staleVal}</div>
				</div>
			)
		}

		//stores the html allowin so that it can be used in the CurrentWeatherPage
		localStorage.setItem("FaveHtml",JSON.stringify(drawline));
		return drawline;
	}

	//fetches the ALL the API data from the tube
	fetchTrainData = () => {
		var url = "https://api.tfl.gov.uk/Line/Mode/tube/Status?detail=false"
		$.ajax({
			url: url,
			dataType: "json",
			success : this.lineTest,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
	}

	lineTest = (data) => {
		//Creates arrays that will store the information for the API
		let lineName = [];
		this.linesName = lineName
		let lineStats = [];
		this.linesStats = lineStats;
		//stores the information from the API of the TUBE into an array
		for (let i = 0; i < 11; i++) {
			lineName.push(data[String(i)]['name']);
			lineStats.push(data[String(i)]['lineStatuses'][0]['statusSeverityDescription']);
		}

		//Stores the information into the section its dedecated to
		for (let i = 0; i< 11;i++){
			//console.log("line " + i + " updated")
			let Lnamee = "lineN".concat(i);
			let Lstats = "lineS".concat(i);
			this.setState({[Lnamee]:lineName[i]});
			this.setState({[Lstats]:lineStats[i]});
		}

		this.updateFave();
	}


	//assignes the correct state to the correct line
	containerName= (data) =>{
		switch (data) {
			case "Bakerloo"			     	: return this.state.contBakerLoo;
			case "Central"				   	: return this.state.contcentral;
			case "Circle"				    	: return this.state.contcircle;
			case "District"			     	: return this.state.contdistrict;
			case "Hammersmith & City"		: return this.state.conthamerACity;
			case "Jubilee"			  			: return this.state.contjubilee;
			case "Metropolitan"  			: return this.state.contmetropolitan;
			case "Northern"		    		: return this.state.contnorthern;
			case "Piccadilly"	   			: return this.state.contpiccadilly;
			case "Victoria"			     	: return this.state.contvictoria;
			case "Waterloo & City"			: return this.state.contwaterCity;
			default:
			return "error"
		}
	}

	//assigns the correct lineN to each tube line
	returnName= (n) =>{
		switch (n) {
			case 0:	return this.state.lineN0;
			case 1:	return this.state.lineN1;
			case 2:	return this.state.lineN2;
			case 3:	return this.state.lineN3;
			case 4:	return this.state.lineN4;
			case 5:	return this.state.lineN5;
			case 6:	return this.state.lineN6;
			case 7:	return this.state.lineN7;
			case 8:	return this.state.lineN8;
			case 9:	return this.state.lineN9;
			case 10:	return this.state.lineN10;
			default:
			return "be thy name"
			break;
		}
		return "dam"
	}

	//assigns the correct lineS to each tube line
	returnServStat= (n) =>{
		switch (n) {
			case 0:	return this.state.lineS0;
			case 1:	return this.state.lineS1;
			case 2:	return this.state.lineS2;
			case 3:	return this.state.lineS3;
			case 4:	return this.state.lineS4;
			case 5:	return this.state.lineS5;
			case 6:	return this.state.lineS6;
			case 7:	return this.state.lineS7;
			case 8:	return this.state.lineS8;
			case 9:	return this.state.lineS9;
			case 10:	return this.state.lineS10;
			default:
			return "error"
			break;
		}
	}

	//returns the correct style for the each tube line
	decideNameCol = (data) => {
		switch (data) {
			case "Bakerloo"			     	: return style.bakerloo;
			case "Central"				   	: return style.central;
			case "Circle"				    	: return style.circle;
			case "District"			     	: return style.district;
			case "Hammersmith & City"		: return style.hammersmith;
			case "Jubilee"						  : return style.jubilee;
			case "Metropolitan"		   	: return style.metropolitan;
			case "Northern"			     	: return style.northern;
			case "Piccadilly"			   	: return style.piccadilly;
			case "Victoria"			     	: return style.victoria;
			case "Waterloo & City"			: return style.waterloo;
			default:
			return "error"
		}
	}

	//depending on the service it will ither allow the style that returns to be good or bad.
	decideServiceStyle = (data) => {
		if (data=="Good Service") {
			return style.serviceGood;
		} else {
			return style.serviceBad;
		}
	}

	render() {

		return (
			<div class = { style.container }>

        <div class = { style.nav }>
          <img src = "https://img.icons8.com/ios/50/000000/filled-circle-filled.png" height="12" width="12" />
          <img src = "https://img.icons8.com/ios/50/000000/circled-filled.png" height="12" width="12" />
          <img src = "https://img.icons8.com/ios/50/000000/circled-filled.png" height="12" width="12" />
        </div>

        <div class = {style.main} >
  				<div class = {style.tubeList} >
  					{this.createDivs()}
  				</div>
        </div>

				<div class = { style.favourites }>
					{this.state.faveLocation}
				</div>

			</div>
		);
	}

}
