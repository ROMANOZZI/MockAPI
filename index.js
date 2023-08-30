import mongoose from "mongoose";
import express from "express";
import cors from "cors";
const app = express();

import "dotenv/config";

// Middlewares
app.use(cors());
app.use(express.json());
// Connect to DB
mongoose
  .connect(process.env.MONGO_DB_URL )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Not Connected to database", err);
  });
// Schema
const schema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  isCompleted: Boolean,
  tag: String,
});

const task = mongoose.model(process.env.COLLECTION_NAME , schema);
// Routes
// get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await task.find({});
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get task by id
app.get("/tasksbyId", async (req, res) => {
  try {
    const required = await task.find({ _id: req.body.id });
    res.status(200).send(required);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// add task
app.post("/addtask", async (req, res) => {
  try {
    const newTask = new task({
      taskName: req.body.taskName,
      description: req.body.description,
      dueDate: req.body.dueDate,
      isCompleted: req.body.isCompleted,
      tag: "",
    });
    await newTask.save();
    res.status(200).send(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// update task
app.put("/updatetask", async (req, res) => {
  try {
    const updatedTask = await task.updateOne(
      { _id: req.body._id },
      {
        taskName: req.body.taskName,
        description: req.body.description,
        dueDate: req.body.dueDate,
        isCompleted: req.body.isCompleted,
      }
    );
    res.status(200).send(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put("/taskCompleted", async (req, res) => {
  try {
    const updatedTask = await task.updateOne(
      { _id: req.body.id },
      { isCompleted: req.body.isCompleted }
    );

    res.status(200).send(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// delete task

// delete task
app.delete("/deletetask/:id", async (req, res) => {
  task
    .findByIdAndDelete(JSON.parse(req.params.id).id)
    .exec()
    .then(() => {
      res.status(200).send(req.params.id + "  deleted successfully");
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});
app.put("/addtag", async (req, res) => {
  const updatedTask = await task
    .updateOne(
      {
        _id: req.body._id,
      },
      {
        tag: req.body.tag,
      }
    )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});
// Start the server

app.listen(process.env.PORT_NUMBER, () => {
  return console.log(`server is listening on ${process.env.PORT_NUMBER}`);
});
