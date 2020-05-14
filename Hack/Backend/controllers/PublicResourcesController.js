const { PublicResourcesData } = require("../models/PublicResourcesModel");
const fs = require("fs");
const axios = require("axios");
const XLSX = require("xlsx");
var path = require("path");
// require.main.filename returns the path to entry point of the application
// but we want the directory this file is in (for consistency)
var root = __dirname;

const schedule = require("node-schedule");

exports.getPublicResources = async (req, res) => {
  let result;
  try{
    result = await PublicResourcesData.find({Country: req.params.country});    
    let reorderedResult = [{}, {}, {}, {}];
    result.forEach((item) => {
      switch (item.Indicator){
        case 'Physicians (per 1,000 people)':
          reorderedResult[0] = item;
          break;
        case 'Nurses and midwives (per 1,000 people)':
          reorderedResult[1] = item;
          break;
        case 'Hospital beds (per 1,000 people)':
          reorderedResult[2] = item;
          break;
        case 'UHC service coverage index':
          reorderedResult[3] = item;
      }
    });
    return res.send(reorderedResult);
  }
  catch(err){
      res.status(500).send(err.toString());
  }
}

// fetch public resources every day
schedule.scheduleJob("0 0 * * *", async function () {
  let urls = [
    //Hospital beds (per 1,000 people)
    "https://api.worldbank.org/v2/en/indicator/SH.MED.BEDS.ZS?downloadformat=excel",
    //Nurses and midwives (per 1,000 people)
    "https://api.worldbank.org/v2/en/indicator/SH.MED.NUMW.P3?downloadformat=excel",
    //UHC service coverage index
    "https://api.worldbank.org/v2/en/indicator/SH.UHC.SRVS.CV.XD?downloadformat=excel",
    //Physicians (per 1,000 people)
    "https://api.worldbank.org/v2/en/indicator/SH.MED.PHYS.ZS?downloadformat=excel",
  ];
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];
    await fetchResources(url);
    console.log("Finished Saving Public Resources for " + url)
  }
  console.log("Finished Saving Data");
});

// download public resources dataset
async function fetchResources(url) {
  let data;
  let result = await axios
    .get(url, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "blob",
      },
    })
    .then((result) => {
      data = result.data;
    });
  const outputFilename = path.join(
    root,
    "assets",
    url.substring(45, 56) + ".xls"
  );
  // Create folder in current directory
  try {
    fs.mkdirSync(path.join(root, "assets"), { recursive: true });
  } catch (e) {
    console.log("Cannot create folder ", e);
  }
  fs.writeFileSync(outputFilename, Buffer.from(data));
  await populateDatabase(url.substring(45, 56) + ".xls");
}
// populate database with data from excel sheet
async function populateDatabase(filePath) {
  var workbook = XLSX.readFile(path.join(root, "assets", filePath), {
    sheetStubs: true,
    cellDates: true,
  });

  var worksheet = workbook.Sheets["Data"];
  var headers = {};
  var currentRow = 0;
  var currentResource;
  
  // Iterate through each cell
  for (z in worksheet) {
    if (z[0] === "!" || worksheet[z].v == undefined) continue;
    if (isNaN(z[1])) {
      var col = z[0] + z[1];
      var row = parseInt(z.substring(2));
    } else {
      var col = z[0];
      var row = parseInt(z.substring(1));
    }

    var value = worksheet[z].v;

    if (isNaN(row) || row < 4) continue;
    // Headers are at row 4
    if (row == 4 && value) {
      headers[col] = value;
      continue;
    }
    if (row != currentRow) {
      // Save the previous resource
      if(currentResource){
          let check = await PublicResourcesData.findOne({Country: currentResource.Country, Indicator: currentResource.Indicator});
          if(!check){
            await currentResource.save();
          }
          else{
            check.set({
              TimeSeries: currentResource.TimeSeries
            })
            check.markModified('TimeSeries')
            await check.save();
          }
      }
      currentResource = new PublicResourcesData({
        Country: " ",
        Indicator: " ",
        TimeSeries: {},
      });
      currentRow = row;
    }

    switch (headers[col]) {
      case "Country Name":
        currentResource.Country = value;
        break;
      case "Indicator Name":
        currentResource.Indicator = value;
        break;
    }
    // Handle the numbers bit
    if (!isNaN(headers[col])) {
        if(value){
            currentResource.TimeSeries[headers[col]] = value;    
        }
        else{
            currentResource.TimeSeries[headers[col]] = 0;    
        }
    }
  }
  if(currentResource){
    let check = await PublicResourcesData.findOne({Country: currentResource.Country, Indicator: currentResource.Indicator});
    if(!check){
      await currentResource.save();
    }
    else{
      check.set({
        TimeSeries: currentResource.TimeSeries
      })
      check.markModified('TimeSeries')
      await check.save();
    }
}
  return 0;
}
