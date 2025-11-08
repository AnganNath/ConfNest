import { useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api"
import { TextField, Button, Card, CardContent, Typography } from "@mui/material"

export default function SubmitPaper() {
  const { id } = useParams()           // conference ID from URL
  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [fileUrl, setFileUrl] = useState("")

  async function submit(e) {
    e.preventDefault()
    await API.post("/submissions", {
      conference: id,
      title,
      abstract,
      fileUrl
    })
    alert("Paper Submitted!")
    window.location = `/conference/${id}`
  }

  return (
    <Card sx={{ maxWidth: 500, margin:"30px auto", padding:2 }}>
      <CardContent>
        <Typography variant="h5" sx={{mb:2}}>Submit Paper</Typography>
        <form onSubmit={submit} style={{ display:"grid", gap:15 }}>
          
          <TextField label="Paper Title" value={title} onChange={e=>setTitle(e.target.value)} required/>

          <TextField 
            label="Abstract" 
            multiline rows={2}
            value={abstract} onChange={e=>setAbstract(e.target.value)}
            required
          />

          <TextField
            label="File URL (Google Drive etc)"
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
