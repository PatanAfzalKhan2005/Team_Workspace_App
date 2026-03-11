const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { content, channelId } = req.body;
    const message = await Message.create({
      content,
      channel: channelId,
      sender: req.user.id
    });
    res.json({
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channel: channelId })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .populate("channel", "name")
      .populate("sender", "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};