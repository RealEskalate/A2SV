const { LocalPolicy } = require("./../models/LocalPolicyModel");


exports.get_local_policies = async (req, res) => {
    let filters = {};
    if(req.query.country){
        filters.country = req.query.country;
    }
    if(req.query.city){
        filters.city = req.query.city;
    }
    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;

    let policies = await LocalPolicy.find(
        filters, 
        {}, 
        {skip: (page - 1) * size, limit: size * 1});

    let result = {
        data_count: await LocalPolicy.countDocuments(filters),
        page_size: size,
        current_page: page,
        data: policies,
    };
    try {
        res.send(result);
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

exports.get_one_local_policy = async (req, res) => {
    let local_policy = await LocalPolicy.findById(req.params.id);
    if(!local_policy){
        res.status(500).send("Local Policy Not Found");
    }else{
        try {
            res.send(local_policy);
        } catch (err) {
            res.status(500).send(err.toString());
        }
    }    
}

exports.post_local_policy = async (req, res) => {
    const local_policy = new LocalPolicy({
        title: req.body.title,
        description: req.body.description,
        country: req.body.country,
        city: req.body.city,
        date_terminated: req.body.date_terminated
      });
      try {
        await local_policy.save();
        res.status(201).send(local_policy);
      } catch (err) {
        res.status(500).send(err.toString());
      }
}

exports.update_local_policy = async (req, res) => { //TODO: Handle not found
    let check = await LocalPolicy.findById(req.body.id);
    if(!check){
        res.status(404).send("Local Policy Not Found");
    }else{
        try {
            let local_policy = await LocalPolicy.findByIdAndUpdate({_id: req.body.id}, req.body, {new: true});
            res.status(201).send(local_policy);
        } catch (err) {
            res.status(500).send(err.toString());
        }
    }    
}

exports.delete_local_policy = async (req, res) => {
    let check = await LocalPolicy.findById(req.body.id);
    if(!check){
        res.status(404).send("Local Policy Not Found");
    }else{
        try {
            let local_policy = await LocalPolicy.findByIdAndDelete({_id : req.body.id},);
            res.status(201).send(local_policy);
        } catch (err) {
            res.status(500).send(err.toString());
        } 
    } 
}