const File = require("../models/File");

exports.uploadFile = async (req, res) => {

  try {

    const { channelId } = req.body;

    const file = await File.create({
      filename: req.file.filename,
      filepath: req.file.path,
      channel: channelId,
      uploadedBy: req.user.id
    });

    res.json({
      message: "File uploaded successfully",
      file
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};