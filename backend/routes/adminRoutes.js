const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Task = require("../models/createTaskModel")
const Users = require("../models/userModel");

router.get("/tasks", auth, role("admin"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status || "all";
    const users = await Users.find({
      name: { $regex: search, $options: "i" }
    });
    const userIds = users.map(u => u._id);
    let query = {
      $or: [
        { title: { $regex: search, $options: "i" } }, // search by task title
        { userId: { $in: userIds } } // search by user name
      ]
    };
    if (status !== "all") {
      query.status = status;
    }
    const tasks = await Task.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Task.countDocuments(query);
    res.json({ tasks, currentPage: page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats", auth, role("admin"), async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: "completed" });
    const pending = await Task.countDocuments({ status: "pending" });
    const users = await Task.distinct("userId");

    res.json({
      users: users.length,
      total: totalTasks,
      completed,
      pending
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.delete("/tasks/:id", auth, role("admin"), async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router