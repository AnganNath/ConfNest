import { useEffect, useState } from "react"
import API from "../api"
import { Card, CardContent, Typography, Button } from "@mui/material"

export default function MyAssigned() {
  const [subs, setSubs] = useState([])

  useEffect(()=>{
    API.get("/submissions").then(res=>setSubs(res.data))
  },[])

  return (
    <div style={{display:"grid", gap:20}}>
      <Typography variant="h5" sx={{mb:2}}>My Assigned Submissions</Typography>

      {subs.map(s=>
        <Card key={s._id}>
          <CardContent>
            <Typography variant="h6">{s.title}</Typography>
            <Typography variant="body2" sx={{mb:1}}>{s.abstract}</Typography>

            {s.fileUrl && (
              <a 
                href={s.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display:"inline-block", marginBottom:12, color:"#1976d2" }}
              >
                View Paper
              </a>
            )}

            <Button 
              variant="contained"
              onClick={()=>window.location=`/review/${s._id}`}
            >
              Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
