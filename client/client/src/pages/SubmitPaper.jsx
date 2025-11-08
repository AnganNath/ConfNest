import { useState, useEffect } from "react"
import API from "../api"
import { TextField, Button, Card, CardContent, Typography, MenuItem } from "@mui/material"

export default function SubmitPaper() {
  const [conferences, setConferences] = useState([])
  const [conference, setConference] = useState("")
  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [fileUrl, setFileUrl] = useState("")

  useEffect(() => {
    API.get("/conferences").then(res => setConferences(res.data))
  }, [])

  async function submit(e) {
    e.preventDefault()
    await API.post("/submissions", {
      conference,
      title,
      abstract,
      fileUrl
    })
    alert("Paper Submitted!")
    setConference("")
    setTitle("")
    setAbstract("")
    setFileUrl("")
  }

  return (
    <Card sx={{ maxWidth: 500, margin:"30px auto", padding:2 }}>
      <CardContent>
        <Typography variant="h5" sx={{mb:2}}>Submit Paper</Typography>
        <form onSubmit={submit} style={{ display:"grid", gap:15 }}>
          
          <TextField
            select
            label="Select Conference"
            value={conference}
            onChange={e=>setConference(e.target.value)}
            required
          >
            {conferences.map(c=>(
              <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
            ))}
          </TextField>

          <TextField label="Paper Title" value={title} onChange={e=>setTitle(e.target.value)} required/>

          <TextField 
            label="Abstract" 
            multiline rows={2}
            value={abstract} onChange={e=>setAbstract(e.target.value)}
            required
          />

          <TextField
            label="File URL (e.g. Google Drive link)"
            value={fileUrl}
            onChange={e=>setFileUrl(e.target.value)}
            required
          />

          <Button variant="contained" type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  )
}
