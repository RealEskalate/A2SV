const {PublicResourcesData} = require("../models/PublicResourcesModel");
const http = require('http');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const XLSX = require('xlsx');
var path = require('path');
var root = path.dirname(require.main.filename);

const schedule = require('node-schedule');

exports.getPublicResources = async(req, res) => {
    let urls = [
        "https://api.worldbank.org/v2/en/indicator/SH.MED.BEDS.ZS?downloadformat=excel",
        "https://api.worldbank.org/v2/en/indicator/SH.MED.NUMW.P3?downloadformat=excel",
        "https://api.worldbank.org/v2/en/indicator/SH.UHC.SRVS.CV.XD?downloadformat=excel"
    ];
    // urls.forEach((url)=>{
        await fetchResources(urls[0]);
    // })
}



// fetch public resources every day
// schedule.scheduleJob('0 0 * * *', function (){
//     let urls = [
//         "https://api.worldbank.org/v2/en/indicator/SH.MED.BEDS.ZS?downloadformat=excel",
//         "https://api.worldbank.org/v2/en/indicator/SH.MED.NUMW.P3?downloadformat=excel",
//         "https://api.worldbank.org/v2/en/indicator/SH.UHC.SRVS.CV.XD?downloadformat=excel"
//     ];
//     urls.forEach((url)=>{
//         fetchResources(url);
//     })
// });

// download public resources dataset
async function fetchResources(url){
    let data;
    let result = await axios.get(url,{
        responseType: 'arraybuffer',
        headers: {
        'Content-Type': 'blob',
        },
      }).then((result) => {
          data = result.data
    });
    const outputFilename = path.join(root, 'assets', url.substring(45,56)+".xlsx");
    try {
        fs.mkdirSync(path.join(root, 'assets'), { recursive: true } );
    } catch (e) {
        console.log('Cannot create folder ', e);
    }
    fs.writeFile(outputFilename, Buffer.from(data), (err) => {
        if (err) throw err;
    });
    populateDatabase(url.substring(45,56)+".xlsx");
}
// populate database with data from excel sheet
async function populateDatabase(filePath){    
    var workbook = XLSX.readFile(path.join(root, 'assets', filePath), {sheetStubs: true, cellDates: true});
    var worksheet = workbook.Sheets["Data"];
    var headers = {};
    var currentRow = 0;
    var currentResource;
    for(z in worksheet) {
        if(z[0] === '!' || worksheet[z].v == undefined) continue;
        if(isNaN(z[1])){
            var col = z[0] + z[1];
            var row = parseInt(z.substring(2));
        }else{
            var col = z[0];
            var row = parseInt(z.substring(1));
        }

        var value = worksheet[z].v;
        
        if (isNaN(row) || row < 4) continue;
        // Headers are at row 4
        if(row == 4 && value) {
            headers[col] = value;
            continue;
        }
        if(row != currentRow){
            // Save the previous resource
            // if(currentResource) 
            // currentResource.save();          
            console.log(currentResource);
            currentResource = {
                Country: " ",
                Indicator: " ",
                TimeSeries: {}
            };
            currentRow = row;
        }

        switch(headers[col]){
            case "Country Name":
                currentResource.Country = value;
                break;
            case "Indicator Name":
                currentResource.Indicator = value;
                break;
        }
        // Handle the numbers bit
        if (!isNaN(headers[col])){
            currentResource.TimeSeries[headers[col]] = value;
        }
        
    }
    if(currentResource) currentResource.save();  
    console.log(currentResource);
}