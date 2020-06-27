const Router = require("express").Router();
const UpdatesController = require("./../controllers/UpdatesController");

Router.post("/api/update", UpdatesController.startUpdates)
