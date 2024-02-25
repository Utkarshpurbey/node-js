const express = require("express");
const user_data = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 8088;

app.use(express.urlencoded({ extended: false }));

app.get("/users", (req, res) => {
  res.send(user_data);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const id_specific_data = user_data.find((user_data) => user_data.id === id);
  res.send(id_specific_data);
});

app
  .route("/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const id_specific_data = user_data.find((user_data) => user_data.id === id);
    res.send(id_specific_data);
  })
  .post((req, res) => {
    const id = Number(req.params.id);
    let already_existing_user = false;

    user_data.forEach((item) => {
      if (item.id === id) {
        already_existing_user = true;
      }
    });
    if (already_existing_user) {
      return res.send(`user Already exist for id ${id}`);
    }
    user_data.push({ id: id, ...req.body });
      console.log(user_data[user_data.length - 1]);
      fs.writeFile('./MOCK_DATA.json', JSON.stringify(user_data), (err) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.send(`Data written to file successfully for id ${id}`);
        }
      });
  });

app.listen(PORT, () => {
  console.log("SERVER AT PORT " + PORT);
});
