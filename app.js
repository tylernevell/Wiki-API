const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

// Get route to fetch articles
app.route("/articles")

    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article");
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });

app.route("/articles/:articleTitle")

    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else if (err) {
                res.send(err);
            } else {
                res.send("No article found.");
            }
        });
    })

    .put((req, res) => {
        Article.replaceOne(
            {title: req.params.articleTitle},
            req.body,
            (err) => {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            });
    })

    .patch();

app.listen(3000, function() {
    console.log("Server started on port 3000");
});