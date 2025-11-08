import { useEffect, useState } from "react"
import API from "../api"
import { Typography } from "@mui/material"
import { useAuth } from "../auth/AuthContext"

export default function ReviewsBlock({ submissionId }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])

  // only chair loads reviews
  useEffect(()=>{
    if(user?.role === "CHAIR"){
      API.get(`/reviews/forSubmission/${submissionId}`).then(res=>setReviews(res.data))
    }
  },[submissionId, user])

  // if not chair or no reviews, show nothing
  if(!user || user.role !== "CHAIR" || !reviews.length) return null

  const avg = reviews.reduce((sum,r)=>sum+r.score,0) / reviews.length

  return (
    <div style={{marginTop:12, paddingTop:12, borderTop:"1px solid #eee"}}>
      <Typography variant="subtitle2" sx={{mb:1}}>
        Reviews (avg: {avg.toFixed(1)})
      </Typography>
      {reviews.map(r=>(
        <div key={r._id} style={{fontSize:14, marginBottom:8}}>
          <b>{r.reviewer.name}</b>: {r.score}/10
          <div style={{color:"#666"}}>{r.comments}</div>
        </div>
      ))}
    </div>
  )
}
