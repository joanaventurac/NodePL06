var express = require('express');
var app = express();
var mysql = require('./Business/mysqlfunctions.js');

app.use(express.json());

app.post("/club/new", (req, res) => {

    res.send(mysql.NewClub(req.body));

});

app.post("/player/new", (req, res) => {
    res.send(mysql.NewPlayer(req.body));

});

app.post("/newGame", (req, res) => {
    res.send(mysql.NewGame(req.body));

});

app.get("/player/:id", (req, res) => {
    var id = req.params.id;
    mysql.PlayerDetails(id, function (result) {
        console.log(result);
        res.json(result);
    });
});

app.get("/club/:id", (req, res) => {
    var id = req.params.id;
    mysql.ClubDetails(id, function (result) {
        console.log(result);
        res.json(result);
    });
});

app.get("/classification/games", (req, res) => {
    mysql.NumberGames(function (result) {  
            console.log(result);
            res.json(result);
        
    });
});

app.get("/classification/tabelResults", (req, res) => {
    mysql.WinLoseDraw(function (result) {  
            console.log(result);
            res.json(result);
        
    });
});

app.get("/classification/points", (req, res) => {
    mysql.Pontuacao(function (result) {  
            console.log(result);
            res.json(result);
        
    });
});

app.listen(3000);
