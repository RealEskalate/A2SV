const { SymptomLog } = require("../models/SymptomLogModel");
const { User } = require("../models/UserModel");
const { LocationUser } = require("../models/LocationUserModel");

exports.registerLog = async (user_id, symptoms, current_date, source) => {
    let symptom_log = await SymptomLog.findOne({user_id : user_id});
    let user = await User.findById(user_id);
    let location_user = await LocationUser.findById(user.latest_location_user);
    
    if(!symptom_log && symptoms.length == 0){
        return;
    }

    if(!symptom_log){
        symptom_log = new SymptomLog({
            user_id : user_id,
            status: "SYMPTOM_SUBMITTED"
        });
    }else{
        symptom_log.status = symptoms.length == 0 ? "SYMPTOMS_REMOVED" : "SYMPTOM_UPDATED";     
    }

    if(symptoms.length != 0){
        let new_log = {
            date: current_date,
            symptoms: symptoms,
            source: source,
        };

        let location = {
            country: user.current_country
        }
        if(location_user){
            location.district = location_user.location.district
        }
        new_log.location = location;

        if(symptom_log.current_symptoms){
            if(symptom_log.history){
                symptom_log.history.push(symptom_log.current_symptoms);
            }else{
                symptom_log.history = [symptom_log.current_symptoms];
            }
            
        }     

        symptom_log.current_symptoms = new_log;    
        
    }
    
    symptom_log.save();

    return symptom_log;
}

exports.setLogLocation = async(location_user) => {
    let symptom_log = await SymptomLog.findOne({user_id: location_user.user_id});
    if(symptom_log.status != "SYMPTOMS_REMOVED"){
        let user = await User.findById(location_user.user_id);
        let location = {
            country : user.current_country,
            district : location_user.location.district
        }
    
        symptom_log.current_symptoms.location = location;
        symptom_log.current_symptoms.risk_score = location_user.probability;
        await symptom_log.markModified("current_symptoms");
    
        symptom_log.save();
    }    
}