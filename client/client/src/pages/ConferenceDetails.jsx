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
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    API.get(`/conferences/${id}`).then(res => setConf(res.data))
    API.get(`/submissions/byConf/${id}`).then(res => setSubs(res.data))

    if (user?.role === "ATTENDEE") {
      API.get("/confreg/mine").then(res => {
        const reg = res.data.find(r => r.conference._id === id)
        if (reg) setIsRegistered(true)
      })
    }

  }, [id, user])

  async function regNow() {
    try {
      await API.post(`/confreg/${id}`)
      alert("Registered for this conference")
      setIsRegistered(true)
    } catch (err) {
      if (err.response?.data?.message === "Already Registered") {
        alert("You are already registered")
      } else {
        alert("Error registering")
      }
    }
  }

  async function closeNow() {
    await API.post(`/conferences/${id}/close`)
    alert("Conference closed")
    window.location.reload()
  }

  if (!conf) return <Typography sx={{ p: 4 }}>Loading...</Typography>

  return (
    <>
      <Typography variant="h4" sx={{ mb: 1 }}>{conf.title}</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
        {conf.description}
      </Typography>

      {/* SHOW STATUS */}
      <Typography sx={{ mb: 3, fontWeight: "bold" }}>
        Status: {conf.status}
      </Typography>

      {/* CHAIR BUTTONS only if open */}
      {user?.role === "CHAIR" && conf.status === "OPEN" && (
        <div style={{ marginBottom: 20 }}>


          <Button
            variant="contained"
            color="error"
            onClick={closeNow}
          >
            Close Conference
          </Button>
        </div>
      )}

      {/* ATTENDEE REGISTER BUTTON (only if open & not registered) */}
      {user?.role === "ATTENDEE" && conf.status === "OPEN" && !isRegistered && (
        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={regNow}
        >
          Register for this Conference
        </Button>
      )}
      {user?.role === "ATTENDEE" && isRegistered && (
        <Typography sx={{ mb: 3, color: "green" }}>You are registered for this conference</Typography>
      )}

      <Typography variant="h6" sx={{ mb: 1 }}>Tracks</Typography>
      <ul>
        {conf.tracks.map(t => <li key={t}>{t}</li>)}
      </ul>

      {/* AUTHOR submit paper only if registered AND open */}
      {user?.role === "AUTHOR" && conf.status === "OPEN" && (
        <Button
          variant="contained"
          sx={{ mt: 2, mb: 3 }}
          onClick={() => window.location = `/submit/${id}`}
        >
          Submit Paper
        </Button>
      )}

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Submissions</Typography>
      <div style={{ display: "grid", gap: 20, maxWidth: 600 }}>
        {subs.map(s =>
          <Card key={s._id} sx={{ p: 1 }}>
            <CardContent>
              <Typography variant="subtitle1">{s.title}</Typography>
              <Typography variant="body2" color="text.secondary">{s.abstract}</Typography>

              {(s.status === "ACCEPTED" || user?.role === "CHAIR") && s.fileUrl && (
                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => window.open(s.fileUrl, "_blank")}
                >
                  View Paper
                </Button>
              )}

              <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                Status: {s.status}
              </Typography>

              <ReviewsBlock submissionId={s._id} />

              {/* decision buttons only if chair AND conference is open */}
              {user?.role === "CHAIR" && conf.status === "OPEN" && (
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
