const axios = require("axios");

exports.getHealthStatistics = async(req) =>{
    request_url= "";

    if (req.body.country =="world"){
        request_url+="https://api.covid19api.com/world";
        // still looking for api which return total world cases for each day since this one only contain data for the past 10 min.
    
    }else{
        request_url+="https://api.covid19api.com/country/"+req.body.country.toLowerCase();
        request_url+= set_start_date_for_countries(req) //+"T00:00:00Z"
        request_url+= set_end_date_for_countries(req) //+"T00:00:00Z"
        let results = await do_api_call(request_url, req.body.criteria);
        return results;
    }

}


function set_start_date_for_countries(req){
    if (req.body.start_date!=null){
        return "?from="+req.body.start_date;
    }else{
        date = new Date()
        date.setDate(date.getDate()-7)
        date_formatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
        date = date_formatter.formatToParts(date)
        start_date= date[4]["value"]+"-"+date[0]["value"]+"-"+date[2]["value"] 
        return "?from="+start_date
    }
}


function set_end_date_for_countries(req){
    // let set the end date for today since we are not yet able to do projection
    date = new Date()
    date_formatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
    date = date_formatter.formatToParts(date);
    end_date= date[4]["value"]+"-"+date[0]["value"]+"-"+date[2]["value"];
    return "&to="+end_date;
}



const do_api_call= async(request_url,criteria)=>{
    criteria= criteria.charAt(0).toUpperCase() + criteria.slice(1)
    console.log(criteria,request_url)
    let results = [];
    try {
        const result = await axios.get(request_url).then(response => {
            let data = response.data;
            if(!data){
                return [];
            }
            data.forEach((item)=>{
                results.push({
                    "t": item.Date,
                    "y": item[`${criteria}`]
                });
            });
        }).catch(error => { console.log(error); });
    }catch (err){
        console.log(err);
    }
    return results;
}