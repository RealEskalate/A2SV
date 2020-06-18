const fs = require("fs");
const path = require("path");

let cities_all;
let cities_listed;

fs.readFile(path.join(__dirname, "assets", "listed.json"), (err, data) => {
    if (err) {
        console.log(err.toString());
    }
    cities_listed = JSON.parse(data);
});

fs.readFile(path.join(__dirname, "assets", "result.json"), (err, data) => {
    if (err) {
        console.log(err.toString());
    }
    cities_all = JSON.parse(data);
});

exports.get_cities_list = (req, res) => {
    res.send(cities_listed);
}

exports.lookup_cities = (req, res) => {
    if (req.query.filter){
        if (cities_all[req.query.filter] == undefined){
            return res.status(400).send("City not found");
        }
        return res.send(cities_all[req.query.filter]);
    }
    if (req.query.matches) {
        var arr = [];
        let limit = req.query.limit || 10;
        let keys = Object.keys(cities_all);
        for (let ind = 0; ind < keys.length; ind++) {
            if (arr.length == limit) {
                break;
            }
            let key = keys[ind];
            if (key.toLowerCase().includes(req.query.matches.toLowerCase())) {
                for (let i = 0; i < cities_all[key].length; i++) {
                    let item = cities_all[key][i];
                    if (arr.length == limit) {
                        break;
                    }
                    arr.push(item);
                }
            } 
            else {
                for (let i = 0; i < cities_all[key].length; i++) {
                    let item = cities_all[key][i];
                    if (arr.length == limit) {
                        break;
                    }
                    if (
                        item.country.toLowerCase().includes(req.query.matches.toLowerCase())
                    ) {
                        arr.push(item);
                    }
                }
            }
        }
        return res.send(arr);
    }
    return res.send(cities_all);
}
