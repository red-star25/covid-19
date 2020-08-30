import {Circle,Popup} from "react-leaflet"
import {numeral} from "numeral"
import React from 'react'


const casesTypeColors = {
    cases:{
        hex:"#CC1034",
        multiplier:800,
    },
    
    recovered:{
        hex:"#7dd71d",
        multiplier:1200,
    },
    cases:{
        hex:"#fb4443",
        multiplier:2000,
    },

}
 
export const sortData = (data)=>{
    const sortedData = [...data];
    sortedData.sort((a,b)=>{
        if(a.cases>b.cases){
            return -1;
        }
        else{
            return 1;
        }
    });
    return sortedData
};

export const showDataOnMap = (data,casesType = "cases")=> 
    data.map((country)=>(
        <Circle
        center={[country.countryInfo.lat,country.countryInfo.long]}
        fillOpacity={0.4}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        radius={Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier}
        >
            <Popup>
                <div>
                    <div className="info__flag" style={{backgroundImage:`url(${country.countryInfo.flag})`}}/>
                    <div className="info__country">{country.country}</div>
                    <div className="info__cases">Cases : {country.cases}</div>
                    <div className="info__recovered">Recovered : {country.recovered}</div>
                    <div className="info__deaths">Cases : {country.deaths}</div>
                </div>
            </Popup>
        </Circle>
    ))