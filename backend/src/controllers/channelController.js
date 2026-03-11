const Channel = require("../models/Channel");

exports.createChannel = async (req, res) => {
  try {
    const { name, workspaceId } = req.body;
    const channel = await Channel.create({
      name,
      workspace: workspaceId,
      createdBy: req.user.id
    });
    res.json({
      message: "Channel created successfully",
      channel
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChannels = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const channels = await Channel.find({ workspace: workspaceId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ createdBy: req.user.id })
      .populate("workspace", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};