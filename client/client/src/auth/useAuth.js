import { useState } from 'react';

export default function useAuth(){
  const [user, setUser] = useState(()=>{
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    return token ? { token, role, name } : null;
  });
  function login({token, role, name}) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    setUser({ token, role, name });
  }
  function logout(){
    localStorage.clear();
    setUser(null);
  }
  return { user, login, logout };
}
