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

  async function deleteNow() {
    if (window.confirm("⚠️ This will permanently delete the conference and all related data.\nAre you sure you want to continue?")) {
      try {
        await API.delete(`/conferences/${id}`)
        alert("Conference deleted successfully.")
        window.location = "/conferences"
      } catch (err) {
        alert("Error deleting conference")
      }
    }
  }

  if (!conf) return <Typography sx={{ p: 4 }}>Loading...</Typography>

  return (
    <div style={{ paddingTop: 30 }}>

      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, textAlign: "center", color: "#084d8d" }}>
        {conf.title}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
        {conf.description}
      </Typography>

      {/* SHOW STATUS */}
      <Typography sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        Status: {conf.status}
      </Typography>

      {/* CHAIR BUTTONS */}
      {user?.role === "CHAIR" && (
        <div style={{ marginBottom: 20, textAlign: "center", display: "flex", justifyContent: "center", gap: "12px" }}>
          {conf.status === "OPEN" && (
            <Button
              variant="contained"
              color="error"
              onClick={closeNow}
              sx={{ borderRadius: "20px", fontWeight: 600 }}
            >
              Close Conference
            </Button>
          )}

          <Button
            variant="outlined"
            color="error"
            sx={{
              borderRadius: "20px",
              fontWeight: 600,
              borderColor: "#b71c1c",
              color: "#b71c1c",
              "&:hover": { background: "#b71c1c", color: "white" }
            }}
            onClick={deleteNow}
          >
            Delete Conference
          </Button>
        </div>
      )}

      {/* ATTENDEE REGISTER BUTTON */}
      {user?.role === "ATTENDEE" && conf.status === "OPEN" && !isRegistered && (
        <div style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{ mb: 3, borderRadius: "20px", background: "#1464c5" }}
            onClick={regNow}
          >
            Register for this Conference
          </Button>
        </div>
      )}
      {user?.role === "ATTENDEE" && isRegistered && (
        <Typography sx={{ mb: 3, color: "green", textAlign: "center" }}>
          You are registered for this conference
        </Typography>
      )}

      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Tracks</Typography>
      <ul style={{ marginBottom: 30, color: "#333", lineHeight: "1.6rem" }}>
        {conf.tracks.map(t => <li key={t}>{t}</li>)}
      </ul>

      {/* AUTHOR submit paper only if registered AND open */}
      {user?.role === "AUTHOR" && conf.status === "OPEN" && (
        <div style={{ marginBottom: 20 }}>
          <Button
            variant="contained"
            sx={{ mt: 2, mb: 3, borderRadius: "20px", background: "#1464c5" }}
            onClick={() => window.location = `/submit/${id}`}
          >
            Submit Paper
          </Button>
        </div>
      )}

      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>Submissions</Typography>
      <div style={{ display: "grid", gap: 20, maxWidth: 650 }}>
        {subs.map(s =>
          <Card key={s._id} sx={{ p: 1, borderRadius: 3, boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{s.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{s.abstract}</Typography>

              {(s.status === "ACCEPTED" || user?.role === "CHAIR") && s.fileUrl && (
                <Button
                  size="small"
                  sx={{ mt: 1, borderRadius: "20px", background: "#1464c5" }}
                  variant="contained"
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
                    sx={{ marginRight: 1, borderRadius: "20px" }}
                    onClick={() =>
                      API.post(`/submissions/${s._id}/decision`, { decision: "ACCEPTED" }).then(() => window.location.reload())
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: "20px" }}
                    onClick={() =>
                      API.post(`/submissions/${s._id}/decision`, { decision: "REJECTED" }).then(() => window.location.reload())
                    }
                  >
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
