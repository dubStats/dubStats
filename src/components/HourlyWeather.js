import React, { Component } from "react";
import { Carousel, Card, Image, CardGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from "react-redux";
import "./styles/HourlyWeather.css";

class HourlyWeather extends Component {
  constructor() {

    super();
    this.mapHourly = this.mapHourly.bind(this)
    this.get24Hours = this.get24Hours.bind(this)
    this.getMonth = this.getMonth.bind(this)
    this.hourConverter = this.hourConverter.bind(this)
    this.addZeroToTemp = this.addZeroToTemp.bind(this)
    this.rainPercentageToColor = this.rainPercentageToColor.bind(this)
  }

  getMonth(num){
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    return months[parseInt(num)+1]
  }
  hourConverter(time){
    let hour = parseInt(time)
    if(hour === 0){
      return "12:00 AM"
    } else if(hour < 13){
      return `${hour}:00 AM`
    } else {
      return `${hour - 12}:00 PM`
    }
  }
  addZeroToTemp(temp){
    let newTemp = parseFloat(temp)
    if(newTemp % 1 !== 0){
      return `${newTemp}`
    }
    return `${newTemp}.0`
  }
  rainPercentageToColor(perc){
    let newPerc = parseInt(perc)
    if(0<=newPerc && newPerc<=10){
      return "hourRainVeryLittle"
    } else if (11<=newPerc && newPerc<=20){
      return "hourRainLittle"
    } else if (21<=newPerc && newPerc<=40){
      return "hourRainMild"
    } else if (41<=newPerc && newPerc<=60){
      return "hourRainPouring"
    } else if (61<=newPerc && newPerc<=80){
      return "hourRainHeavy"
    } else {
      return "hourRainVeryHeavy"
    }

  }
  get24Hours(arr) {
    var today = new Date();
    var myTime = today.getHours();
    let carItem = 0;
    let result = [];
    for (let i = myTime; i < 24; i++) {
      if (carItem === 0) {
        carItem++;
        result.push([arr[0].hour[i]]);
      } else if (carItem === 3) {
        carItem = 0;
        result[result.length - 1].push(arr[0].hour[i]);
      } else {
        carItem++;
        result[result.length - 1].push(arr[0].hour[i]);
      }
    }
    for (let i = 0; i < myTime; i++) {
      if (carItem === 0) {
        carItem++;
        result.push([arr[1].hour[i]]);
      } else if (carItem === 3) {
        carItem = 0;
        result[result.length - 1].push(arr[1].hour[i]);
      } else {
        carItem++;
        result[result.length - 1].push(arr[1].hour[i]);
      }
    }
    return result;
  }

  mapHourly(arr) {
    return (
      <div>
        <Carousel prevLabel="" nextLabel="" variant="dark" interval={null} next ={<span className="testing"></span>} prev={<span className="testing"></span>}>
          {this.get24Hours(arr).map((el) => {
            return (
              <Carousel.Item key={el[0].time}>
                <CardGroup className="fourHourSection">
                  {el.map((hours) => {
                    return (
                      <Card className="text-center" key={hours.time}>
                        <Card.Body id="hourDate" className="alignCenter">{this.getMonth(hours.time.slice(5,7))}-{hours.time.slice(8,10)}-{hours.time.slice(0,4)}</Card.Body>
                        <Card.Body id="hourTime" className="alignCenter">{this.hourConverter(hours.time.slice(11,13))}</Card.Body>
                        <Card.Body id="HourImage" className="alignCenter"> 
                          <Image src={hours.condition.icon} roundedCircle id="HourImageIcon" className="alignCenter"/>
                        </Card.Body>
                        <Card.Body id="hourTemp" className="alignCenter">{this.addZeroToTemp(hours.temp_f)}</Card.Body>
                        <Card.Body id="hourTempType" className="alignCenter">°F</Card.Body>
                        <Card.Body id="hourWeatherCondition" className="alignCenter"> {hours.condition.text}</Card.Body>
                        <Card.Body id={this.rainPercentageToColor(hours.chance_of_rain)} className="alignCenter" >{hours.chance_of_rain}% Chance of Rain</Card.Body>
                      </Card>
                    );
                  })}
                </CardGroup>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>
    );
  }

  render() {
    if (this.props.forecast.length === 0) {
      return <div>loading</div>;
    }
    return (
      <div>
        {this.mapHourly(this.props.forecast)}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    searchValue: state.landingPage.searchValue,
    current: state.landingPage.current,
    location: state.landingPage.location,
    forecast: state.landingPage.forecast,
  };
};

export default connect(mapState, null)(HourlyWeather);
