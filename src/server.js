const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");




app.use(express.json());
app.use(cors());

const DatabaseName = 'my-blogs';
const CollectionName = 'articles';
const ConnectionString = `mongodb://127.0.0.1:27017/my-blogs`
let db;





MongoClient.connect(ConnectionString, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log(`Connection is not done`);
        console.log(error)
        return;
    } else {
        console.log(`Connection Successfull`)
        db = client.db(DatabaseName);
        app.listen(4000, () => {
            console.log(`Server Started succesfully`)
        })

    }
});





app.get("/api/article/:name", async (req, res) => {
    const articleName = req.params.name;
    const articleInfo = await db
        .collection("articles")
        .findOne({ name: articleName });
    res.status(200).json(articleInfo);
});


app.post("/api/article/:name/add-comments", async (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;


    const articleInfo = await db.collection("articles").findOne({ name: articleName });
    await db.collection("articles").updateOne({ name: articleName }, {
        $set: {
            comments: articleInfo.comments.concat({ username, text }),
        }
    })
    const updatedArticleInfo = await db.collection("articles").findOne({ name: articleName });
    res.status(200).json(updatedArticleInfo);

})





