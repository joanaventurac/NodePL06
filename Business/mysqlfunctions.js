function NewClub(object) {
    
    var mysql = require('mysql'); 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pl06"
    });

    
    con.connect(function (err) {
        if (err) console.log(err);

        console.log("OK");

        var sql = "INSERT INTO clube (Id, NomeClube) VALUES (?)";
        var convertedObject = [[object.Id, object.NomeClube]];
        con.query(sql, convertedObject, function (err, result) {
            if (err){
                console.log(err);
            } else {
                console.log("Rows inserted: " + result.affectedRows);
                return 'OK';
            }
        });
    });
};

function NewPlayer(object) {
    var mysql = require('mysql'); 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pl06"
    });

    con.connect(function (err) {
        if (err) console.log(err);

        console.log("OK");

        var sql = "INSERT INTO jogador (Id, NomeJogador, Clube) VALUES (?)";
        var convertedObject = [[object.Id, object.NomeJogador, object.Clube]];
        con.query(sql, convertedObject, function (err, result) {
            if (err){
                console.log(err);
            } else {
                console.log("Rows inserted: " + result.affectedRows);
                return 'OK';
            }
        });
    });
}

function NewGame(object) {
    var mysql = require('mysql'); 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pl06"
    });

    con.connect(function (err) {
        if (err) console.log(err);

        console.log("OK");

        var sql = "INSERT INTO resultado (Id, HomeClub, AwayClub, score) VALUES (?)";
        var convertedObject = [[object.Id, object.HomeClub, object.AwayClub, object.Score]];
        con.query(sql, convertedObject, function (err, result) {
            if (err){
                console.log(err);
            } else {
                console.log("Rows inserted: " + result.affectedRows);
                return 'OK';
            }
        });
    });
}

function PlayerDetails(id, callback){
    var mysql = require('mysql'); 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pl06"
    });

    con.connect(function (err) {
        if (err) console.log(err);

        console.log("OK");

        var sql = "SELECT nomeJogador, id from jogador where id = ?";
         con.query(sql, id, function (err, detalhesJogador) {
            console.log(detalhesJogador);
            if (err)
                callback(err);
            else {
                var object = require('../Models/Jogador.js');
                object.id = detalhesJogador[0].id;
                object.nomeJogador = detalhesJogador[0].nomeJogador;
                callback(object);
            }
        });
    });
}


function ClubDetails(callback){
    var mysql = require('mysql'); 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pl06"
    });

    con.connect(function (err) {
        if (err) console.log(err);

        console.log("OK");

        var sql = "SELECT jogador.NomeJogador, clube.NomeClube from jogador JOIN clube ON jogador.Clube = clube.Id where jogador.Id = ?";
         con.query(sql, id, function (err, detalhesClube) {
            console.log(detalhesClube);
            if (err)
                callback(err);
            else {
                var object = require('../Models/Clube.js');
                object.nomeJogador = detalhesClube[0].nomeJogador;
                object.nomeClube = detalhesClube[0].nomeClube;
                callback(object);
            }
        });
    });
}

function NumberGames(callback){
    var mysql = require('mysql'); 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pl06"
    });

    con.connect(function (err) {
        if (err) console.log(err);

        console.log("OK");

        var sql = "SELECT COUNT(resultado.score) AS TotalJogos, clube.nomeClube FROM resultado JOIN clube ON (resultado.homeClub=clube.id OR resultado.awayClub = clube.id) GROUP BY clube.nomeClube;";
         con.query(sql, function (err, totalJogos) {
            if (err)
                callback(err);
            else {
          
                totalJogosEquipa = {...totalJogos};
                console.log(totalJogosEquipa);

                callback(totalJogosEquipa);
            }
        });
    });
}


function WinLoseDraw(callback){
    var mysql = require('mysql'); 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pl06"
    });

    con.connect(function (err) {
        if (err) console.log(err);

        console.log("OK");

        var sql = "SELECT clube.NomeClube, SUM(CASE WHEN resultado.Score = '0' AND resultado.HomeClub = clube.Id THEN 1 WHEN resultado.Score = '1' AND resultado.AwayClub = clube.Id THEN 1 ELSE 0 END) AS Win, SUM(CASE WHEN resultado.Score = '1' AND resultado.HomeClub = clube.Id THEN 1 WHEN resultado.Score = '0' AND resultado.AwayClub = clube.Id THEN 1 ELSE 0 END) AS Lose, SUM(CASE WHEN resultado.Score = 'x' AND (resultado.HomeClub = clube.Id OR resultado.AwayClub = clube.Id) THEN 1 ELSE 0 END) AS Draw FROM resultado JOIN clube ON clube.Id IN (resultado.HomeClub, resultado.AwayClub) GROUP BY clube.NomeClube;";
         con.query(sql, function (err, totalJogos) {
            if (err)
                callback(err);
            else {
          
                totalJogosEquipa = {...totalJogos};
                console.log(totalJogosEquipa);

                callback(totalJogosEquipa);
            }
        });
    });
}

function Pontuacao(callback){
    var mysql = require('mysql'); 
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pl06"
    });

    con.connect(function (err) {
        if (err) console.log(err);

        console.log("OK");

        var sql = "SELECT clube.NomeClube, SUM(CASE WHEN resultado.Score = '0' AND resultado.HomeClub = clube.id THEN 3 WHEN resultado.Score = '1' AND resultado.AwayClub = clube.id THEN 3 WHEN resultado.Score = 'x' AND (resultado.HomeClub = clube.id OR resultado.AwayClub = clube.id) THEN 1 ELSE 0 END) AS Pontuacao FROM resultado JOIN clube ON clube.id IN (resultado.HomeClub, resultado.AwayClub) GROUP BY clube.NomeClube ORDER BY SUM(CASE WHEN resultado.Score = '0' AND resultado.HomeClub = clube.id THEN 3 WHEN resultado.Score = '1' AND resultado.AwayClub = clube.id THEN 3 WHEN resultado.Score = 'x' AND (resultado.HomeClub = clube.id OR resultado.AwayClub = clube.id) THEN 1 ELSE 0 END) DESC;";
         con.query(sql, function (err, totalJogos) {
            if (err)
                callback(err);
            else {
          
                totalJogosEquipa = {...totalJogos};
                console.log(totalJogosEquipa);

                callback(totalJogosEquipa);
            }
        });
    });
}


module.exports = {
    WinLoseDraw,
    Pontuacao,
    NumberGames,
    NewClub,
    NewPlayer,
    NewGame,
    PlayerDetails,
    ClubDetails,
    NumberGames
    
}