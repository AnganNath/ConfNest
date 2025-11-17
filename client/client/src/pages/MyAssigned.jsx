import { useEffect, useState } from "react"
import API from "../api"
import { Card, CardContent, Typography, Button } from "@mui/material"

export default function MyAssigned() {
  const [subs, setSubs] = useState([])

  useEffect(() => {
    API.get("/submissions").then(res => setSubs(res.data))
  }, [])

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>My Assigned Submissions</Typography>

      {subs.map(s =>
        <Card key={s._id}>
          <CardContent>
            <Typography variant="h6">{s.title}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>{s.abstract}</Typography>

            {s.fileUrl && (
              <Button
                variant="outlined"
                sx={{
                  mr: 2,
                  borderRadius: "20px",
                  textTransform: "none",
                  borderColor: "#1565c0",
                  color: "#1565c0",
                  "&:hover": { background: "#e3f2fd" }
                }}
                onClick={() => window.open(s.fileUrl, "_blank")}
              >
                View Paper
              </Button>
            )}

            <Button
              variant="contained"
              onClick={() => window.location = `/review/${s._id}`}
            >
              Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
