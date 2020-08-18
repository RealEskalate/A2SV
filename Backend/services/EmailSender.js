const {SocketLabsClient, BulkMessage, BulkRecipient } = require('@socketlabs/email');
const { StatisticsResource} = require("../models/StatisticsResourceModel.js");

exports.sendActivationLink= async ( req, usersData ) =>{
    let language= (req.query.language) ? req.query.language : "English"

    let emailTemplate = await StatisticsResource.findOne({
        language: language,
        title: "create-account-template",
    });

    if (emailTemplate) {
        emailTemplate = emailTemplate.fields[0];
    }

    var client = new SocketLabsClient(parseInt(process.env.APP_EMAIL_SERVER_ID), process.env.APP_EMAIL_API_KEY);
    let bulkMessage = new BulkMessage();

    bulkMessage.apiTemplate = emailTemplate.id;
    bulkMessage.subject = emailTemplate.subject;
    bulkMessage.setFrom(process.env.APP_EMAIL_ADDRESS);

    for (let index = 0; index < usersData.length; index++) {
        let userInfo = usersData[index];
        
        let user = new BulkRecipient(userInfo.email);
        user.addMergeData("link", userInfo.activationLink);
        user.addMergeData("SenderAddress",process.env.APP_EMAIL_ADDRESS);
        bulkMessage.to.push(user);
        
    }

    return client.send(bulkMessage);
}


exports.sendResetPassword= async (req,userInfo) =>{
    let language= (req.query.language) ? req.query.language : "English"

    let emailTemplate = await StatisticsResource.findOne({
        language: language,
        title: "reset-password-template",
    });

    if (emailTemplate) {
        emailTemplate = emailTemplate.fields[0];
    }

    var client = new SocketLabsClient(parseInt(process.env.APP_EMAIL_SERVER_ID), process.env.APP_EMAIL_API_KEY);

    let basicMessage = new BulkMessage();

    basicMessage.apiTemplate = emailTemplate.id;
    basicMessage.subject = emailTemplate.subject;
    basicMessage.setFrom(process.env.APP_EMAIL_ADDRESS);
    
    
    let user = new BulkRecipient(userInfo.email);
    user.addMergeData("link", userInfo.activationLink);
    user.addMergeData("SenderAddress",process.env.APP_EMAIL_ADDRESS);
    basicMessage.to.push(user);

    return client.send(basicMessage);
}
