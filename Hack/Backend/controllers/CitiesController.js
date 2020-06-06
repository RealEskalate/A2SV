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
        Object.keys(cities_all).forEach((key) => {
            if (key.includes(req.query.matches)) arr.push(cities_all[key]);
        });
        return res.send(arr);
    }

    return res.send(cities_all);
}
