import { useState } from 'react';
import API from '../api';
import useAuth from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    const { data } = await API.post('/auth/login', { email, password });
    login(data);
    nav('/');
  }
  return (
    <form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:320}}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}
