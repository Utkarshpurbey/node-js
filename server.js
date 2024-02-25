const express = require("express");
const user_data = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 8088;

const check_already_existing_user = (id) => {
  let already_existing_user = false;
  user_data.forEach((item) => {
    if (item.id === id) {
      already_existing_user = true;
    }
  });
  return already_existing_user;
};

app.use(express.urlencoded({ extended: false }));

app.get("/users", (req, res) => {
  res.send(user_data);
});

app
  .route("/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    if (!check_already_existing_user(id))
      res.send("No Records for the user with id " + id);
    const id_specific_data = user_data.find((user_data) => user_data.id === id);
    res.send(id_specific_data);
  })
  .post((req, res) => {
    const id = Number(req.params.id);
    const already_existing_user = check_already_existing_user(id);
    if (already_existing_user) {
      return res.send(`User Already exist for id ${id}`);
    }
    user_data.push({ id: id, ...req.body });
    console.log(user_data[user_data.length - 1]);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user_data), (err) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(`Data written to file successfully for id ${id}`);
      }
    });
  })
  .patch((req, res) => {
    //TODO: Implement PATCH
    const id = Number(req.params.id);
    const already_existing_user = check_already_existing_user(id);
    if (!already_existing_user) res.send("Cannot Patch a new user");

    const body = req.body;
    let user_details = user_data;
    user_details.map((item) => {
      if (item.id === id) {
        item = { id: id, ...body };
      }
    });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(user_details), (err) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(`DATA UPATED FoR id ${id}`);
      }
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const isAlreadyUser = check_already_existing_user(id);
    if (!isAlreadyUser) res.send("No records found for id" + id);
    user_data_updated = user_data.filter((item) => item.id !== id);

    fs.writeFile(
      "./MOCK_DATA.json",
      JSON.stringify(user_data_updated),
      (err) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send(`DATA DELETED FoR id ${id}`);
        }
      }
    );
  });

app.listen(PORT, () => {
  console.log("SERVER AT PORT " + PORT);
});
