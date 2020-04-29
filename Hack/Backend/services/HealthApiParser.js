const axios = require("axios");
var csvjson = require('csvjson');

const getRate = async (criteria, startDate, endDate) => {
    let stats = [];
    let result = await axios.get('https://covidtracking.com/api/v1/us/daily.json')
        .then(response => {
            let datas = response.data;
            datas.forEach(data => {
                let stat = {
                    t: new Date(Date.parse(data.dateChecked))
                };
                if (criteria == "Hospitalization") {
                    stat.y = data.hospitalizedCurrently || 0;
                }
                else if (criteria == "ICU") {
                    stat.y = data.inIcuCurrently || 0;
                }
                stats.push(stat);
            });
        })
        .catch(err => {
            console.log(err);
        });
    var filteredStats = stats.filter(function (stat) {
        var date = new Date(stat.t);
        console.log(date >= startDate && date <= endDate);
        return (date >= startDate && date <= endDate);
    });
    return filteredStats;
}
exports.getCriticalStatistics = async (req) => {
    let startDate = new Date(Date.parse(set_start_date_for_countries(req).slice(6) + "T21:00:00.000Z"));
    let endDate = new Date(Date.parse(set_end_date_for_countries(req).slice(4) + "T21:00:00.000Z"));
    let results = await getRate(req.body.criteria, startDate, endDate);
    return results;
}

exports.getHealthStatistics = async (req) => {
    request_url = "";

    if (req.body.country =="world"){
        request_url="https://datahub.io/core/covid-19/r/worldwide-aggregated.csv"
        // request_url="https://datahub.io/core/covid-19/r/worldwide-aggregated.json"
        start_date= new Date(Date.parse(set_start_date_for_countries(req).slice(6)));
        end_date= new Date(Date.parse(set_end_date_for_countries(req).slice(4) ));
        
        results=[]
        let result = await parse_csv_data(request_url,results,start_date,end_date, req.body.criteria)
        return results
    }else{
        request_url+="https://api.covid19api.com/country/"+req.body.country.toLowerCase();
        request_url+= set_start_date_for_countries(req) //+"T00:00:00Z"
        request_url+= set_end_date_for_countries(req) //+"T00:00:00Z"
        results=[]
        let result = await do_api_call(request_url, req.body.criteria,false,results);
        return results;
    }

}

calculate_with_date_for_world = async(req, url) =>{
    startDate= set_start_date_for_countries(req).slice(6)
    start_date= new Date(startDate)

    end_date= new Date(set_end_date_for_countries(req).slice(4))
    end_date.setDate(end_date.getDate()-1)
    
    console.log(startDate,end_date.toISOString().slice(0,10))

    result=[]
    while (start_date <= end_date){
        request_url=url+start_date.toISOString().slice(0,10)
        let current_result= await do_api_call(request_url, req.body.criteria.toLowerCase(),true, result);
        start_date.setDate(start_date.getDate()+1)
    }

    return result
}

function set_start_date_for_countries(req) {
    if (req.body.start_date != null) {
        return "?from=" + req.body.start_date;
    } else {
        date = new Date()
        date.setDate(date.getDate()-7)
        return "?from="+date.toISOString().slice(0,10)
    }
}


function set_end_date_for_countries(req) {
    // let set the end date for today since we are not yet able to do projection
    date = new Date();
    date.setHours( date.getHours() -7 + (date.getTimezoneOffset()/ 60) );
    return "&to="+date.toISOString().slice(0,10)
}


const do_api_call= async(request_url,criteria,world, results)=>{
    console.log(criteria,request_url)
    try {
        const result = await axios.get(request_url).then(response => {
            let data = response.data;
            if (!data) {
                return [];
            }
            else if(world){
                entry= { "t":response.data["data"]["date"],
                        "y":response.data["data"][criteria]}
                results.push(entry);
                return results
            }
            data.forEach((item)=>{
                results.push({
                    "t": item.Date,
                    "y": item[`${criteria}`]
                });
            });
        }).catch(error => { console.log(error); });
    } catch (err) {
        console.log(err);
    }
    return results;
}



const parse_csv_data= async(request_url,results,start_date,end_date,criteria)=>{
    console.log(request_url)
    try {
        const result = await axios.get(request_url).then(response => {
            let data = response.data;
            if (!data) {
                return [];
            }
            var options = { delimiter : ',' , quote : '"' };
            data = csvjson.toObject(data, options);
            data.forEach((item)=>{
                date= new Date(item.Date)
                if ( date >= start_date && date <= end_date) {
                    results.push({
                        "t": item.Date,
                        "y": item[`${criteria}`]
                    });
                }
            });
        }).catch(error => { console.log(error); });
    } catch (err) {
        console.log(err);
    }
    return results;
}
