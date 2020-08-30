import React, { useState,useEffect } from 'react';
import './App.css';
import {FormControl,MenuItem,Select,Card,CardContent} from "@material-ui/core"
import InfoBox from './InfoBox.';
import Map from "./Map";
import Table from "./Table"
import {sortData} from "./utils"
import Linegraph from "./Linegraph"
import "leaflet/dist/leaflet.css"

function App() {
  const [countries,setCountries] = useState([]);
  const [country,setCountry]= useState("worldwide");
  const [countryInfo,setCountryInfo]= useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({lat:34.80746,lng:-40.4796})
  const [mapZoom,setMapZoom] = useState(3)
  const [mapCountries,setMapCountries] = useState([]);

  useEffect(()=>{
   fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    })

  },[]);

  useEffect(()=>{
    const getCountriesData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2
          }
        ));
        const sortedData= sortData(data);
        setTableData(sortedData);
      setMapCountries(data);

        setCountries(countries);
      });
    }
    getCountriesData();
  },[])

  const onCountryChange = async(event)=>{
    const countryCode = event.target.value;

    const url = countryCode === "worldwide" ?"https://disease.sh/v3/covid-19/all" :`https://disease.sh/v3/covid-19/countries/${countryCode}`;
    // console.log(url);
    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long])
      setMapZoom(4)
    });
  }

  return (
    <div className="app">
    <div className="app__left">
      <div className="app__header">
      {/*Header*/}   
      <h1>Covid 19 Tracker</h1>
      <FormControl className="app__dropdown">
      {/*Title + Select Country DropDown */}
      <Select variant="outlined" value={country} onChange={onCountryChange}>
      <MenuItem value="worldwide">Worldwide</MenuItem>
        {countries.map(country=><MenuItem value={country.value}>{country.name}</MenuItem>)}
        {/* <MenuItem value="worldwide">WorldWide</MenuItem>
        <MenuItem value="worldwide">Option 2</MenuItem>
        <MenuItem value="worldwide">Option 3</MenuItem> */}
      </Select>
      </FormControl>
      </div>

      <div className="app__stats">
      {/*InfoBox*/}   
      <InfoBox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} ></InfoBox>
      <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} ></InfoBox>
      <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} ></InfoBox>
      </div>
      
      {/*Map */}   
      <Map center={mapCenter} zoom={mapZoom} countries={mapCountries}></Map>
    </div>
    <Card className="app__right">
    <h3>Live Cases by Country</h3>
    <Table countries={tableData}/>
    <h3>Worldwide new </h3>
    <Linegraph    />
      {/*Graph*/}   

    </Card>
    </div>
  );
}

export default App;
