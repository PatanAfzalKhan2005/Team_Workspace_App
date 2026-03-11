import { useState } from "react";
import API from "../api/api";

export default function Channel() {
  const [name, setName] = useState("");

  const createChannel = async (e) => {
    e.preventDefault();

    try {
      await API.post("/channel/create", { name });
      alert("Channel created");
      setName("");
    } catch (err) {
      alert("Error creating channel");
    }
  };

  return (
    <div>
      <h3>Create Channel</h3>

      <form onSubmit={createChannel}>
        <input
          placeholder="Channel name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
