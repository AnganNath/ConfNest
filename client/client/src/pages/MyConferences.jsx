import { useEffect, useState } from "react"
import API from "../api"
import { Card, CardContent, Typography } from "@mui/material"

export default function MyConferences(){
  const [list, setList] = useState([])

  useEffect(()=>{
    API.get("/confreg/mine").then(res=>setList(res.data))
  },[])

  return (
    <div style={{padding:20}}>
      <Typography variant="h5" sx={{mb:3}}>My Registered Conferences</Typography>

      <div style={{display:"grid", gap:20, maxWidth:600}}>
        {list.map(r=>
          <Card key={r._id} onClick={()=>window.location=`/conference/${r.conference._id}`} style={{cursor:"pointer"}}>
            <CardContent>
              <Typography variant="h6">{r.conference.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {r.conference.description}
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
