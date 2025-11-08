import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api"
import { Card, CardContent, Typography, Button } from "@mui/material"
import { useAuth } from "../auth/AuthContext"
import ReviewsBlock from "../components/ReviewsBlock"


export default function ConferenceDetails() {
  const { user } = useAuth()
  const { id } = useParams()
  const [conf, setConf] = useState(null)
  const [subs, setSubs] = useState([])

  useEffect(() => {
    API.get(`/conferences/${id}`).then(res => setConf(res.data))
    API.get(`/submissions/byConf/${id}`).then(res => setSubs(res.data))
  }, [id])

  if (!conf) return <Typography sx={{ p: 4 }}>Loading...</Typography>

  return (
    <>
      <Typography variant="h4" sx={{ mb: 1 }}>{conf.title}</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {conf.description}
      </Typography>

      {user?.role === "CHAIR" && (
        <Button
          variant="outlined"
          sx={{ mb: 4 }}
          onClick={() => window.location = `/conference/${id}/assign`}
        >
          Assign Reviewers
        </Button>
      )}

      <Typography variant="h6" sx={{ mb: 1 }}>Tracks</Typography>
      <ul>
        {conf.tracks.map(t => <li key={t}>{t}</li>)}
      </ul>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Submissions</Typography>
      <div style={{ display: "grid", gap: 20, maxWidth: 600 }}>
        {subs.map(s =>
          <Card key={s._id} sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="subtitle1">{s.title}</Typography>
              <Typography variant="body2" color="text.secondary">{s.abstract}</Typography>

              {s.fileUrl && (
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: 8, color: "#1976d2" }}
                >
                  View Paper
                </a>

              )}
              <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                Status: {s.status}
              </Typography>

              <ReviewsBlock submissionId={s._id} />
              {user?.role === "CHAIR" && (
                <div style={{ marginTop: 12 }}>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ marginRight: 1 }}
                    onClick={() => API.post(`/submissions/${s._id}/decision`, { decision: "ACCEPTED" }).then(() => window.location.reload())}
                  >
                    Accept
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => API.post(`/submissions/${s._id}/decision`, { decision: "REJECTED" }).then(() => window.location.reload())}
                  >
                    Reject
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
