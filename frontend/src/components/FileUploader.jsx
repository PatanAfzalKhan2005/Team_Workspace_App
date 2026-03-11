import API from "../api/api";

export default function FileUploader({channelId}){

const upload = async(e)=>{

const form = new FormData();

form.append("file",e.target.files[0]);
form.append("channelId",channelId);

await API.post("/file/upload",form);

alert("File uploaded");

};

return(

<input type="file" onChange={upload}/>

)

}
