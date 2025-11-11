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
  try {
    const res = await API.post("/auth/login", { email, password })
    login({ token: res.data.token, role: res.data.role, name: res.data.name })
    nav("/")
  } catch (err) {
    if(err.response?.data?.message){
      alert(err.response.data.message)   // << show backend error text
    } else {
      alert("Login failed")
    }
  }
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
