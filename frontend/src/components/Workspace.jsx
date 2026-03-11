import { useState, useEffect } from "react";
import API from "../api/api";

export default function Workspace() {
  const [name, setName] = useState("");
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/workspace");

    setWorkspaces(res.data);
  };

  const createWorkspace = async (e) => {
    e.preventDefault();

    await API.post("/workspace/create", { name });

    setName("");

    load();
  };

  return (
    <div className="box">
      <h3>Create Workspace</h3>

      <form onSubmit={createWorkspace}>
        <input
          placeholder="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button>Create</button>
      </form>

      <h4>Existing Workspaces</h4>

      {workspaces.map(w => (
        <p key={w._id}>{w.name}</p>
      ))}
    </div>
  );
}
