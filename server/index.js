const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { register, login, setAvatar, getAllUsers } = require('./controllers/usersController');
const userRoutes = require('./routes/userRoutes');
const messagesRoute = require('./routes/messagesRoute');
const { getAllMessage } = require('./controllers/messagesController');
const socket = require('socket.io');

require('dotenv').config();

app.use(cors({origin: true, credentials: true}));
app.get('/', (req,res) => {
    res.send("hello");
})

app.use(express.json());
// app.use('/api/auth',userRoutes)
app.post('/api/auth/register', register)
app.post('/api/auth/login', login);
app.post('/api/auth/setavatar/:id', setAvatar)

app.get('/api/auth/allusers/:id', getAllUsers);

app.use('/api/messages', messagesRoute);

app.use('/api/messages/getmsg', getAllMessage);


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(() => {
    console.log('Server has been started');
}).catch((err) => {
    console.log(err);
})
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})


const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials:true
    }
})


global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    });



});

