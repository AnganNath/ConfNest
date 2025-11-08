import { useEffect, useState } from "react"
import API from "../api"
import { Card, CardContent, Typography, MenuItem, TextField, Button } from "@mui/material"


export default function AssignReviewer() {
  const [subs, setSubs] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [selected, setSelected] = useState({})

  useEffect(()=>{
    API.get("/submissions").then(res=>setSubs(res.data))
    API.get("/auth/reviewers").then(res=>setReviewers(res.data))
  },[])

  async function assign(subId){
    const reviewerId = selected[subId]
    if(!reviewerId) return alert("Select a reviewer first")

    await API.post(`/submissions/${subId}/assign`, { reviewers: [reviewerId] })
    alert("Assigned!")
  }

  return (
    <div style={{display:"grid", gap:20, maxWidth:800, margin:"30px auto"}}>
      <Typography variant="h5">Assign Reviewers</Typography>

      {subs.map(s =>
        <Card key={s._id}>
          <CardContent>
            <Typography variant="h6">{s.title}</Typography>
            <Typography variant="body2" sx={{mb:2}}>{s.abstract}</Typography>

            <TextField
              select
              label="Select Reviewer"
              value={selected[s._id] || ""}
              onChange={e=>setSelected({...selected, [s._id]:e.target.value})}
              sx={{mr:2, width:230}}
            >
              {reviewers.map(r=>(
                <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>
              ))}
            </TextField>

            <Button variant="contained" onClick={()=>assign(s._id)}>
              Assign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
