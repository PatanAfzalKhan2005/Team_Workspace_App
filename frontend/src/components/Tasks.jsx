import { useState } from "react";
import API from "../api/api";

export default function Tasks({ channelId }) {
  const [title, setTitle] = useState("");

  const createTask = async () => {
    await API.post("/task/create", { title, channelId });

    alert("Task created");
  };

  return (
    <div>
      <input
        placeholder="Task"
        onChange={e => setTitle(e.target.value)}
      />

      <button onClick={createTask}>Add Task</button>
    </div>
  );
}
