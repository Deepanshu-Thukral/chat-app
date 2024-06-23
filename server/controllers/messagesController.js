const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await messageModel.create({
            message: { text: message },
            users: [from, to],
            sender: from
        });
        if (data) return res.json({ msg: "Message added successfully." });
        return res.json({ msg: "Failed to add message to the database" });
        
    }
    catch(ex) {
        next(ex); 
    }
 };

module.exports.getAllMessage = async (req, res, next) => { 
    console.log('request is coming at getAllMessage');
    try {
        const { from, to } = req.body;
        console.log(from);
        const messages = await messageModel.find({
            
            // users: [from, to],
            // users:[to,from]
            users: {
                $all: [from, to],
              }
        })
            //     user: {
            //         $all: [from, to],
            //     }
            // })
            .sort({ updatedAt: 1 });
            console.log('messages data - ', messages);

        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            }
        });
        console.log(projectMessages);
        res.json(projectMessages);
        
    }
    catch (error) {
        console.log(error);
    }
};