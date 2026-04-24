const Task = require("../models/createTaskModel");

//create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({
      title,
      description,
      userId: req.user.id
    })
    const savedTask = await task.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
//getTask 
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const stats = req.query.status || "all";
    const query = req.user.role === "admin" ? {} : { userId: req.user.id, title: { $regex: search, $options: "i" } };
    if(stats !=="all"){
      query.status = stats;
    }
    const tasks = await Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Task.countDocuments(query);
    if (page > Math.ceil(total / limit)) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//update
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      {
        _id: req.params.id, userId: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task Not Found" });
    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.deleteTask = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.id };
    const task = await Task.findOneAndDelete(query);
    if (!task) return res.status(404).json({ message: "Task Not Found" });
    res.json({ message: "Task Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}