const Workspace = require("../models/Workspace");

exports.createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;
    const workspace = await Workspace.create({
      name,
      owner: req.user.id,
      members: [req.user.id]
    });
    res.json({
      message: "Workspace created successfully",
      workspace
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    }).populate("owner", "name email").sort({ createdAt: -1 });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};