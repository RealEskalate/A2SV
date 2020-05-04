const axios = require("axios");
const csvjson = require('csvjson');
const { MapData } = require("../models/MapDataModel");

const getRate = (criteria, startDate, endDate, res, respond) => {
    axios.get('https://covidtracking.com/api/v1/us/daily.json')
        .then(response => {
            let stats = [];
            let datas = response.data;
            datas.forEach(data => {
                let stat = {
                    t: new Date(Date.parse(data.dateChecked))
                };
                if (criteria === "Hospitalization") {
                    stat.y = data.hospitalizedCurrently || 0;
                } else if (criteria === "ICU") {
                    stat.y = data.inIcuCurrently || 0;
                }
                stats.push(stat);
            });

            let filteredStats = stats.filter(function (stat) {
                let date = new Date(stat.t);
                console.log(date >= startDate && date <= endDate);
                return (date >= startDate && date <= endDate);
            });
            respond(res, filteredStats, true)
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCriticalStatistics = (req, res, respond) => {
    let startDate = new Date(Date.parse(set_start_date_for_countries(req).slice(6) + "T21:00:00.000Z"));
    let endDate = new Date(Date.parse(set_end_date_for_countries(req).slice(4) + "T21:00:00.000Z"));
    getRate(req.query.criteria, startDate, endDate, res, respond);
};

exports.getHealthStatistics = (req, res, respond, rates = false) => {
    if (req.query.country.toLowerCase() === "world") {
        // request_url="https://datahub.io/core/covid-19/r/worldwide-aggregated.json"
        let request_url = "https://datahub.io/core/covid-19/r/worldwide-aggregated.csv";
        let start_date = new Date(Date.parse(set_start_date_for_countries(req).slice(6)));
        let end_date = new Date(Date.parse(set_end_date_for_countries(req).slice(4)));
        parse_csv_data(request_url, start_date, end_date, req.query.criteria, res, respond, rates);
    } else {
        const request_url = `https://api.covid19api.com/total/country/${req.query.country.toLowerCase()}`;
        const start_date = new Date(Date.parse(set_start_date_for_countries(req).slice(6)));
        const end_date = new Date(Date.parse(set_end_date_for_countries(req).slice(4)));
        do_api_call(request_url, req.query.criteria, start_date, end_date, res, respond, rates);
    }

};

function set_start_date_for_countries(req) {
    if (req.query.start_date != null) {
        return "?from=" + req.query.start_date;
    } else {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return "?from=" + date.toISOString().slice(0, 10)
    }
}


function set_end_date_for_countries(req) {
    // let set the end date for today since we are not yet able to do projection
    let end_date = new Date(req.query.end_date);
    let date = new Date();
    date.setHours(date.getHours() - 7 + (date.getTimezoneOffset() / 60));

    if (req.query.end_date != null && end_date < date) {
        return "&to=" + req.query.end_date;
    } else {
        return "&to=" + date.toISOString().slice(0, 10)
    }
}


const do_api_call = (request_url, criteria, start_date, end_date, res, respond, needRates) => {
    console.log(criteria, request_url);
    try {
        axios.get(request_url)
            .then(response => {
                if (!response.data) {
                    respond(res, [], needRates)
                } else if (criteria === "All") {
                    let results = [];
                    response.data.forEach((item) => {
                        const date = new Date(item.Date);

                        if (date >= start_date && date <= end_date) {
                            results.push({
                                "t": item.Date,
                                "Confirmed": item['Confirmed'],
                                "Recovered": item['Recovered'],
                                "Deaths": item['Deaths']
                            });
                        }
                    });
                    console.log("Fetched everything " + results);
                    respond(res, results, needRates)
                } else {
                    let results = [];
                    response.data.forEach((item) => {
                        const date = new Date(item.Date);
                        if (date >= start_date && date <= end_date) {
                            results.push({
                                "t": item.Date,
                                "y": item[`${criteria}`]
                            });
                        }
                    });
                    respond(res, results, needRates)
                }
            })
            .catch(error => {
                console.log(error);
            });
    } catch (err) {
        console.log(err);
    }
};


const parse_csv_data = (request_url, start_date, end_date, criteria, res, respond, rates) => {
    console.log(request_url);
    try {
        axios.get(request_url)
            .then(response => {
                let data = response.data;
                if (!data) {
                    respond(res, [], rates)
                }
                let results = [];
                const options = { delimiter: ',', quote: '"' };
                data = csvjson.toObject(data, options);
                data.forEach((item) => {
                    const date = new Date(item.Date);
                    if (date >= start_date && date <= end_date) {
                        if (criteria == "All") {
                            results.push({
                                t: item.Date,
                                Confirmed: item['Confirmed'],
                                Recovered: item['Recovered'],
                                Deaths: item['Deaths']
                            });
                        } else {
                            results.push({
                                t: item.Date,
                                y: item[criteria]
                            });
                        }
                    }
                });
                respond(res, results, rates)
            }).catch(error => {
                console.log(error);
            });
    } catch (err) {
        console.log(err);
    }
};


exports.countrySlugList = async (res, respond) => {
    try {
        // let results = await MapData.distinct('Country')
        // return respond(res, results)
        let results = [{"slug":"AF","name":"Afghanistan"},{"slug":"AX","name":"Åland Islands"},{"slug":"AL","name":"Albania"},{"slug":"DZ","name":"Algeria"},{"slug":"AS","name":"American Samoa"},{"slug":"AD","name":"Andorra"},{"slug":"AO","name":"Angola"},{"slug":"AI","name":"Anguilla"},{"slug":"AQ","name":"Antarctica"},{"slug":"AG","name":"Antigua and Barbuda"},{"slug":"AR","name":"Argentina"},{"slug":"AM","name":"Armenia"},{"slug":"AW","name":"Aruba"},{"slug":"AU","name":"Australia"},{"slug":"AT","name":"Austria"},{"slug":"AZ","name":"Azerbaijan"},{"slug":"BS","name":"Bahamas"},{"slug":"BH","name":"Bahrain"},{"slug":"BD","name":"Bangladesh"},{"slug":"BB","name":"Barbados"},{"slug":"BY","name":"Belarus"},{"slug":"BE","name":"Belgium"},{"slug":"BZ","name":"Belize"},{"slug":"BJ","name":"Benin"},{"slug":"BM","name":"Bermuda"},{"slug":"BT","name":"Bhutan"},{"slug":"BO","name":"Bolivia, Plurinational State of"},{"slug":"BQ","name":"Bonaire, Sint Eustatius and Saba"},{"slug":"BA","name":"Bosnia and Herzegovina"},{"slug":"BW","name":"Botswana"},{"slug":"BV","name":"Bouvet Island"},{"slug":"BR","name":"Brazil"},{"slug":"IO","name":"British Indian Ocean Territory"},{"slug":"BN","name":"Brunei Darussalam"},{"slug":"BG","name":"Bulgaria"},{"slug":"BF","name":"Burkina Faso"},{"slug":"BI","name":"Burundi"},{"slug":"KH","name":"Cambodia"},{"slug":"CM","name":"Cameroon"},{"slug":"CA","name":"Canada"},{"slug":"CV","name":"Cape Verde"},{"slug":"KY","name":"Cayman Islands"},{"slug":"CF","name":"Central African Republic"},{"slug":"TD","name":"Chad"},{"slug":"CL","name":"Chile"},{"slug":"CN","name":"China"},{"slug":"CX","name":"Christmas Island"},{"slug":"CC","name":"Cocos (Keeling) Islands"},{"slug":"CO","name":"Colombia"},{"slug":"KM","name":"Comoros"},{"slug":"CG","name":"Congo"},{"slug":"CD","name":"Congo, the Democratic Republic of the"},{"slug":"CK","name":"Cook Islands"},{"slug":"CR","name":"Costa Rica"},{"slug":"CI","name":"Côte d'Ivoire"},{"slug":"HR","name":"Croatia"},{"slug":"CU","name":"Cuba"},{"slug":"CW","name":"Curaçao"},{"slug":"CY","name":"Cyprus"},{"slug":"CZ","name":"Czech Republic"},{"slug":"DK","name":"Denmark"},{"slug":"DJ","name":"Djibouti"},{"slug":"DM","name":"Dominica"},{"slug":"DO","name":"Dominican Republic"},{"slug":"EC","name":"Ecuador"},{"slug":"EG","name":"Egypt"},{"slug":"SV","name":"El Salvador"},{"slug":"GQ","name":"Equatorial Guinea"},{"slug":"ER","name":"Eritrea"},{"slug":"EE","name":"Estonia"},{"slug":"ET","name":"Ethiopia"},{"slug":"FK","name":"Falkland Islands (Malvinas)"},{"slug":"FO","name":"Faroe Islands"},{"slug":"FJ","name":"Fiji"},{"slug":"FI","name":"Finland"},{"slug":"FR","name":"France"},{"slug":"GF","name":"French Guiana"},{"slug":"PF","name":"French Polynesia"},{"slug":"TF","name":"French Southern Territories"},{"slug":"GA","name":"Gabon"},{"slug":"GM","name":"Gambia"},{"slug":"GE","name":"Georgia"},{"slug":"DE","name":"Germany"},{"slug":"GH","name":"Ghana"},{"slug":"GI","name":"Gibraltar"},{"slug":"GR","name":"Greece"},{"slug":"GL","name":"Greenland"},{"slug":"GD","name":"Grenada"},{"slug":"GP","name":"Guadeloupe"},{"slug":"GU","name":"Guam"},{"slug":"GT","name":"Guatemala"},{"slug":"GG","name":"Guernsey"},{"slug":"GN","name":"Guinea"},{"slug":"GW","name":"Guinea-Bissau"},{"slug":"GY","name":"Guyana"},{"slug":"HT","name":"Haiti"},{"slug":"HM","name":"Heard Island and McDonald Islands"},{"slug":"VA","name":"Holy See (Vatican City State)"},{"slug":"HN","name":"Honduras"},{"slug":"HK","name":"Hong Kong"},{"slug":"HU","name":"Hungary"},{"slug":"IS","name":"Iceland"},{"slug":"IN","name":"India"},{"slug":"ID","name":"Indonesia"},{"slug":"IR","name":"Iran, Islamic Republic of"},{"slug":"IQ","name":"Iraq"},{"slug":"IE","name":"Ireland"},{"slug":"IM","name":"Isle of Man"},{"slug":"IL","name":"Israel"},{"slug":"IT","name":"Italy"},{"slug":"JM","name":"Jamaica"},{"slug":"JP","name":"Japan"},{"slug":"JE","name":"Jersey"},{"slug":"JO","name":"Jordan"},{"slug":"KZ","name":"Kazakhstan"},{"slug":"KE","name":"Kenya"},{"slug":"KI","name":"Kiribati"},{"slug":"KP","name":"Korea, Democratic People's Republic of"},{"slug":"KR","name":"Korea, Republic of"},{"slug":"KW","name":"Kuwait"},{"slug":"KG","name":"Kyrgyzstan"},{"slug":"LA","name":"Lao People's Democratic Republic"},{"slug":"LV","name":"Latvia"},{"slug":"LB","name":"Lebanon"},{"slug":"LS","name":"Lesotho"},{"slug":"LR","name":"Liberia"},{"slug":"LY","name":"Libya"},{"slug":"LI","name":"Liechtenstein"},{"slug":"LT","name":"Lithuania"},{"slug":"LU","name":"Luxembourg"},{"slug":"MO","name":"Macao"},{"slug":"MK","name":"Macedonia, the Former Yugoslav Republic of"},{"slug":"MG","name":"Madagascar"},{"slug":"MW","name":"Malawi"},{"slug":"MY","name":"Malaysia"},{"slug":"MV","name":"Maldives"},{"slug":"ML","name":"Mali"},{"slug":"MT","name":"Malta"},{"slug":"MH","name":"Marshall Islands"},{"slug":"MQ","name":"Martinique"},{"slug":"MR","name":"Mauritania"},{"slug":"MU","name":"Mauritius"},{"slug":"YT","name":"Mayotte"},{"slug":"MX","name":"Mexico"},{"slug":"FM","name":"Micronesia, Federated States of"},{"slug":"MD","name":"Moldova, Republic of"},{"slug":"MC","name":"Monaco"},{"slug":"MN","name":"Mongolia"},{"slug":"ME","name":"Montenegro"},{"slug":"MS","name":"Montserrat"},{"slug":"MA","name":"Morocco"},{"slug":"MZ","name":"Mozambique"},{"slug":"MM","name":"Myanmar"},{"slug":"NA","name":"Namibia"},{"slug":"NR","name":"Nauru"},{"slug":"NP","name":"Nepal"},{"slug":"NL","name":"Netherlands"},{"slug":"NC","name":"New Caledonia"},{"slug":"NZ","name":"New Zealand"},{"slug":"NI","name":"Nicaragua"},{"slug":"NE","name":"Niger"},{"slug":"NG","name":"Nigeria"},{"slug":"NU","name":"Niue"},{"slug":"NF","name":"Norfolk Island"},{"slug":"MP","name":"Northern Mariana Islands"},{"slug":"NO","name":"Norway"},{"slug":"OM","name":"Oman"},{"slug":"PK","name":"Pakistan"},{"slug":"PW","name":"Palau"},{"slug":"PS","name":"Palestine, State of"},{"slug":"PA","name":"Panama"},{"slug":"PG","name":"Papua New Guinea"},{"slug":"PY","name":"Paraguay"},{"slug":"PE","name":"Peru"},{"slug":"PH","name":"Philippines"},{"slug":"PN","name":"Pitcairn"},{"slug":"PL","name":"Poland"},{"slug":"PT","name":"Portugal"},{"slug":"PR","name":"Puerto Rico"},{"slug":"QA","name":"Qatar"},{"slug":"RE","name":"Réunion"},{"slug":"RO","name":"Romania"},{"slug":"RU","name":"Russian Federation"},{"slug":"RW","name":"Rwanda"},{"slug":"BL","name":"Saint Barthélemy"},{"slug":"SH","name":"Saint Helena, Ascension and Tristan da Cunha"},{"slug":"KN","name":"Saint Kitts and Nevis"},{"slug":"LC","name":"Saint Lucia"},{"slug":"MF","name":"Saint Martin (French part)"},{"slug":"PM","name":"Saint Pierre and Miquelon"},{"slug":"VC","name":"Saint Vincent and the Grenadines"},{"slug":"WS","name":"Samoa"},{"slug":"SM","name":"San Marino"},{"slug":"ST","name":"Sao Tome and Principe"},{"slug":"SA","name":"Saudi Arabia"},{"slug":"SN","name":"Senegal"},{"slug":"RS","name":"Serbia"},{"slug":"SC","name":"Seychelles"},{"slug":"SL","name":"Sierra Leone"},{"slug":"SG","name":"Singapore"},{"slug":"SX","name":"Sint Maarten (Dutch part)"},{"slug":"SK","name":"Slovakia"},{"slug":"SI","name":"Slovenia"},{"slug":"SB","name":"Solomon Islands"},{"slug":"SO","name":"Somalia"},{"slug":"ZA","name":"South Africa"},{"slug":"GS","name":"South Georgia and the South Sandwich Islands"},{"slug":"SS","name":"South Sudan"},{"slug":"ES","name":"Spain"},{"slug":"LK","name":"Sri Lanka"},{"slug":"SD","name":"Sudan"},{"slug":"SR","name":"Suriname"},{"slug":"SJ","name":"Svalbard and Jan Mayen"},{"slug":"SZ","name":"Swaziland"},{"slug":"SE","name":"Sweden"},{"slug":"CH","name":"Switzerland"},{"slug":"SY","name":"Syrian Arab Republic"},{"slug":"TW","name":"Taiwan, Province of China"},{"slug":"TJ","name":"Tajikistan"},{"slug":"TZ","name":"Tanzania, United Republic of"},{"slug":"TH","name":"Thailand"},{"slug":"TL","name":"Timor-Leste"},{"slug":"TG","name":"Togo"},{"slug":"TK","name":"Tokelau"},{"slug":"TO","name":"Tonga"},{"slug":"TT","name":"Trinidad and Tobago"},{"slug":"TN","name":"Tunisia"},{"slug":"TR","name":"Turkey"},{"slug":"TM","name":"Turkmenistan"},{"slug":"TC","name":"Turks and Caicos Islands"},{"slug":"TV","name":"Tuvalu"},{"slug":"UG","name":"Uganda"},{"slug":"UA","name":"Ukraine"},{"slug":"AE","name":"United Arab Emirates"},{"slug":"GB","name":"United Kingdom"},{"slug":"US","name":"United States"},{"slug":"UM","name":"United States Minor Outlying Islands"},{"slug":"UY","name":"Uruguay"},{"slug":"UZ","name":"Uzbekistan"},{"slug":"VU","name":"Vanuatu"},{"slug":"VE","name":"Venezuela, Bolivarian Republic of"},{"slug":"VN","name":"Viet Nam"},{"slug":"VG","name":"Virgin Islands, British"},{"slug":"VI","name":"Virgin Islands, U.S."},{"slug":"WF","name":"Wallis and Futuna"},{"slug":"EH","name":"Western Sahara"},{"slug":"YE","name":"Yemen"},{"slug":"ZM","name":"Zambia"},{"slug":"ZW","name":"Zimbabwe"}]
        return respond(res, results)
    } catch (err) {
        console.log(err);
    }
    respond(res, [])
};


exports.fetch_criteria = async(req, res, respond, needRates=false) => {
    let country = req.query.country;
    let start_date = new Date(Date.parse(set_start_date_for_countries(req).substring(6)));
    let end_date = new Date(Date.parse(set_end_date_for_countries(req).substring(4)));
    let stats_by_country = await MapData.find({Country: country});    
    let result = {};
    let criterions = {
        "Confirmed": 0,
        "Deaths": 1,
        "Recovered": 2
    }
    let chosen_criteria = req.query.criteria==='All' ? -1: criterions[`${req.query.criteria}`];
    for(let i = 0; i<stats_by_country.length;i++){
        let country_stats = stats_by_country[i];
        let timeseries = country_stats.TimeSeries;
        Object.keys(timeseries).forEach((date)=>{
            let check_date = new Date(Date.parse(date));
            if (check_date >= start_date && check_date <= end_date){
                if(chosen_criteria==-1){       
                    if(!result[`${date}`]){
                        result[`${date}`] = {
                            Confirmed : 0,
                            Deaths: 0,
                            Recovered: 0
                        }
                    }
                    result[`${date}`].Confirmed += timeseries[`${date}`][0];
                    result[`${date}`].Deaths += timeseries[`${date}`][1];
                    result[`${date}`].Recovered += timeseries[`${date}`][2];
                }
                else{
                    if(!result[`${date}`]){
                        result[`${date}`] = 0
                    }
                    result[`${date}`] += timeseries[`${date}`][chosen_criteria]
                }
            }
        });
    }
    const keys = Object.keys(result);
    let return_result = [];
    keys.forEach((key)=>{
        if(chosen_criteria==-1){
            return_result.push( {
                t: `${key}`,
                Confirmed: result[key].Confirmed, 
                Recovered: result[key].Recovered, 
                Deaths: result[key].Deaths, 
            })    
        }
        else{
            return_result.push( {
                t: `${key}`,
                y: result[key]            
            })
        }
    })
    respond(res, return_result, needRates)
}