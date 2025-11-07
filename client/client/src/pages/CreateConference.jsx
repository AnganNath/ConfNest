import { useState } from "react"
import API from "../api"
import { TextField, Button, Card, CardContent, Typography } from "@mui/material"

export default function CreateConference() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tracks, setTracks] = useState("")
  const [deadline, setDeadline] = useState("")

  async function submit(e) {
    e.preventDefault()
    const body = {
      title,
      description,
      tracks: tracks.split(",").map(t => t.trim()),
      importantDates: { submissionDeadline: deadline }
    }
    await API.post("/conferences", body)
    alert("Conference Created")
    setTitle("")
    setDescription("")
    setTracks("")
    setDeadline("")
  }

  return (
    <Card sx={{ maxWidth: 500, margin: "30px auto", padding: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb:2 }}>Create Conference</Typography>
        <form onSubmit={submit} style={{ display:"grid", gap:15 }}>
          <TextField label="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
          <TextField label="Description" value={description} onChange={e=>setDescription(e.target.value)} required multiline rows={2}/>
          <TextField label="Tracks (comma separated)" value={tracks} onChange={e=>setTracks(e.target.value)} required/>
          <TextField type="date" label="Submission Deadline" InputLabelProps={{shrink:true}} value={deadline} onChange={e=>setDeadline(e.target.value)} required/>
          <Button variant="contained" type="submit">Create</Button>
        </form>
      </CardContent>
    </Card>
  )
}
