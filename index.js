const express = require('express');

const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("welcome to JWT tutorial");
});

app.post("/login", (req, res, next) => {
    const user = {
        id: 1,
        username: "admin",
        email: "admin@gmail.com",
        password: "admin"

    }

    if (req.body.username !== user.username || req.body.password !== user.password) {
        return res.status(403).send("username or password is wrong");
    }

    jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        res.json({
            token
        });
    });
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send("a token is required for authentication");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send("invalid token");
        }
        
        req.user = user;
        next();
    
    });

}

app.get("/protected", verifyToken, (req, res, next) => {

    const user = req.user;
    res.json({
        message: "Protected Route",
        user
    });
});

app.get("/unprotected", (req, res, next) => {

    const user = req.user;
    res.json({
        message: "Unprotected Route",
        user
    });
});


app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`));