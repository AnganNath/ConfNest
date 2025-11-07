import { useState } from 'react';
import API from '../api';

export default function SubmitPaper(){
  const [payload, setPayload] = useState({ conference:'', title:'', abstract:'', fileUrl:'' });
  async function submit(e){
    e.preventDefault();
    await API.post('/submissions', payload);
    alert('Submitted!');
  }
  return (
    <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:480}}>
      <h2>Submit Paper</h2>
      <input placeholder="Conference ID" value={payload.conference} onChange={e=>setPayload({...payload, conference:e.target.value})}/>
      <input placeholder="Title" value={payload.title} onChange={e=>setPayload({...payload, title:e.target.value})}/>
      <textarea placeholder="Abstract" value={payload.abstract} onChange={e=>setPayload({...payload, abstract:e.target.value})}/>
      <input placeholder="File URL" value={payload.fileUrl} onChange={e=>setPayload({...payload, fileUrl:e.target.value})}/>
      <button>Submit</button>
    </form>
  );
}
