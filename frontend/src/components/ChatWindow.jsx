import {useState} from "react";
import API from "../api/api";

export default function ChatWindow({channelId}){

const [text,setText]=useState("");

const send = async()=>{

await API.post("/message/send",{
content:text,
channelId
});

setText("");

};

return(

<div>

<input
value={text}
onChange={e=>setText(e.target.value)}
placeholder="Type message"
/>

<button onClick={send}>Send</button>

</div>

)

}
