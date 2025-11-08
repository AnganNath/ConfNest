import { useState } from "react"
import API from "../api"
import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import { TextField, Button, Card, CardContent, Typography } from "@mui/material"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    const res = await API.post("/auth/login", { email, password })
    
    // Store user data correctly
    login({ token: res.data.token, role: res.data.role, name: res.data.name })
    localStorage.setItem("token", res.data.token)   

    nav("/")
  }

  return (
    <Card sx={{ maxWidth: 400, margin:"30px auto", padding:2 }}>
      <CardContent>
        <Typography variant="h5" sx={{mb:2}}>Login</Typography>
        <form onSubmit={submit} style={{ display:"grid", gap:15 }}>
          <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <TextField type="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <Button type="submit" variant="contained">Login</Button>
        </form>
      </CardContent>
    </Card>
  )
}
