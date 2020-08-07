const { MapData } = require("../models/MapDataModel");

//Fetch Map Data
exports.getMapData = async (req, res) => {
  try {
    let map_data = await MapData.find({});
    let result = [];
    for (let i = 0; i < map_data.length; i++) {
      let data = map_data[i];
      if (data.Data.Country != null) {
        let provinces = data.Data.Unique_Provinces;
        let lat = 0;
        let long = 0;
        Object.keys(provinces).forEach((item) => {
          lat += provinces[item][0];
          long += provinces[item][1];
        });
        lat /= Object.keys(provinces).length;
        long /= Object.keys(provinces).length;
        let map_data_item = data.Data;
        map_data_item.lat = lat;
        map_data_item.long = long;
        delete map_data_item["Unique_Provinces"];
        result.push(map_data_item);
      }
    }
    return res.status(200).send(result);
  } catch (err) {
    console.log(err.toString());
    return res.status(500).send(err);
  }
};
