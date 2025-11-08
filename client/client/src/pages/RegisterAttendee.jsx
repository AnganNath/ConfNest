import { useState } from "react"
import API from "../api"
import { TextField, Button, Card, CardContent, Typography } from "@mui/material"

export default function RegisterAttendee(){
  const [payload, setPayload] = useState({ name:"", email:"", password:"" })

  async function submit(e){
    e.preventDefault()
    await API.post("/attendee/register", payload)
    alert("Attendee Registered! Now login.")
    window.location="/login"
  }

  return (
    <Card sx={{maxWidth:400, margin:"40px auto", p:2}}>
      <CardContent>
        <Typography variant="h5" sx={{mb:2}}>Register as Attendee</Typography>
        <form onSubmit={submit} style={{display:"grid", gap:16}}>
          <TextField label="Name" value={payload.name}
            onChange={e=>setPayload({...payload,name:e.target.value})} required/>
          <TextField label="Email" value={payload.email}
            onChange={e=>setPayload({...payload,email:e.target.value})} required/>
          <TextField label="Password" type="password" value={payload.password}
            onChange={e=>setPayload({...payload,password:e.target.value})} required/>
          <Button type="submit" variant="contained">Register Attendee</Button>
        </form>
      </CardContent>
    </Card>
  )
}
