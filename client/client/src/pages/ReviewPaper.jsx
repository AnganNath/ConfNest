import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api"
import { TextField, Button, Typography, Card, CardContent } from "@mui/material"

export default function ReviewPaper() {
  const { id } = useParams()
  const [score, setScore] = useState("")
  const [comments, setComments] = useState("")

  useEffect(()=>{
    // load existing review (if any)
    API.get(`/reviews/bySubmission/${id}`).then(res=>{
      if(res.data){
        setScore(res.data.score)
        setComments(res.data.comments)
      }
    })
  },[id])

  async function submit(e){
    e.preventDefault()
    await API.post("/reviews", { submission:id, score, comments })
    alert("Review Submitted!")
    window.location="/assigned"
  }

  return (
    <Card sx={{maxWidth:500, margin:"30px auto", p:2}}>
      <CardContent>
        <Typography variant="h5" sx={{mb:2}}>Submit Review</Typography>

        <form onSubmit={submit} style={{display:"grid", gap:16}}>
          <TextField type="number" label="Score (1-10)" 
            value={score} onChange={e=>setScore(e.target.value)} required />

          <TextField label="Comments" multiline rows={3}
            value={comments} onChange={e=>setComments(e.target.value)} required />

          <Button variant="contained" type="submit">Submit Review</Button>
        </form>
      </CardContent>
    </Card>
  )
}
