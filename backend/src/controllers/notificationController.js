const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {

  try {

    const notifications = await Notification.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.markAsRead = async (req, res) => {

  try {

    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    res.json(notification);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
