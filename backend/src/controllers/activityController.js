const Message = require("../models/Message");
const Task = require("../models/Task");

exports.getActivityFeed = async (req, res) => {

  try {

    const messages = await Message.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          type: "message",
          text: "$content",
          user: "$user.name",
          createdAt: 1
        }
      }
    ]);

    const tasks = await Task.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          type: "task",
          text: "$title",
          user: "$user.name",
          createdAt: 1
        }
      }
    ]);

    const feed = [...messages, ...tasks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(feed);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
