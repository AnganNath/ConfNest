import { useEffect, useState } from 'react';
import API from '../api';

export default function Home(){
  const [api, setApi] = useState('...');
  useEffect(()=>{
    fetch(import.meta.env.VITE_API_URL.replace('/api','/')).then(r=>r.text()).then(setApi);
  },[]);
  return (
    <div>
      <h1>ConfNest</h1>
      <p>Backend says: {api}</p>
    </div>
  );
}
