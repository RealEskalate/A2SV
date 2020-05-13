const axios = require("axios");
const {Cases} = require("./../models/test4");
populate_db = async() => {
    name = "Country"
    field = "Slug"
    request_url = "https://api.covid19api.com/countries"
    let results = []
    let response = await axios.get(request_url)

    if (response.data) {
        response.data.forEach((item) => {
            results.push({
                'name': item[name],
                'slug': item[field]
            });
        });
    }


    for (var country in results) {
        try {

            country_url = `https://api.covid19api.com/total/country/${results[country]['slug']}`;
            let country_data = await axios.get(country_url);

            if (country_data.data) {
                country_data.data.forEach(async(c_cases) => {
                    let date_found = new Date(c_cases.Date)
                    var record = await Cases.find({ country_slug: results[country]['slug'], date: date_found })
                    if (record.length == 0) {
                        let c = new Cases({
                            _id: mongoose.Types.ObjectId(),
                            country: results[country]['name'],
                            country_slug: results[country]['slug'],
                            confirmed: c_cases['Confirmed'],
                            deaths: c_cases['Deaths'],
                            recovered: c_cases['Recovered'],
                            date: new Date(c_cases.Date)
                        });
                        await c.save();
                    } else {
                        console.log("duplicate...")
                    }
                });
            }
            console.log(results[country]['name'], " done...")
        } catch (e) { console.log(results[country]['name'], " error...") }
    }
    console.log("Done...")
};
module.exports = populate_db;