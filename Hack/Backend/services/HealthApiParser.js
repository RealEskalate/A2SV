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
    let results = await getRate(req.query.criteria, startDate, endDate);
    return results;
}

exports.getHealthStatistics = async (req) => {
    request_url = "";

    if (req.query.country.toLowerCase() =="world"){
        request_url="https://datahub.io/core/covid-19/r/worldwide-aggregated.csv"
        start_date= new Date(Date.parse(set_start_date_for_countries(req).slice(6)));
        end_date= new Date(Date.parse(set_end_date_for_countries(req).slice(4) ));

        results=[]
        let result = await parse_csv_data(request_url,results,start_date,end_date, req.query.criteria)
        return results
    }else{
        request_url+="https://api.covid19api.com/total/country/"+req.query.country.toLowerCase();
        start_date= new Date(Date.parse(set_start_date_for_countries(req).slice(6)));
        end_date= new Date(Date.parse(set_end_date_for_countries(req).slice(4)));
        results=[]
        let result = await do_api_call(request_url, req.query.criteria,start_date, end_date,results);
        return results;
    }

}


function set_start_date_for_countries(req) {
    if (req.query.start_date != null) {
        return "?from=" + req.query.start_date;
    } else {
        date = new Date()
        date.setDate(date.getDate()-7)
        return "?from="+date.toISOString().slice(0,10)
    }
}


function set_end_date_for_countries(req) {
    // let set the end date for today since we are not yet able to do projection
    end_date= new Date(req.query.end_date)
    date = new Date();
    date.setHours(date.getHours() - 7 + (date.getTimezoneOffset() / 60));

    if (req.query.end_date != null && end_date < date) {
        return "&to=" + req.query.end_date;
    } else {
        return "&to=" + date.toISOString().slice(0, 10)
    }
}


const do_api_call= async(request_url,criteria,start_date, end_date, results)=>{
    console.log(criteria,request_url)
    try {
        const result = await axios.get(request_url).then(response => {
            let data = response.data;
            if (!data) {
                return [];
            }
            data.forEach((item)=>{
                date= new Date(item.Date)

                if ( date >= start_date && date <= end_date){
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
