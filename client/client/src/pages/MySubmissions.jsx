import { useEffect, useState } from "react";
import API from "../api";
import { Card, CardContent, Typography, Chip } from "@mui/material";

export default function MySubmissions() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    API.get("/submissions").then(res => setSubs(res.data));
  }, []);

  return (
    <div style={{ paddingTop: 30 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "#084d8d", textAlign: "center" }}>
        My Submissions
      </Typography>

      <div style={{ display: "grid", gap: 20, maxWidth: 700, margin: "0 auto" }}>
        {subs.length === 0 && (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
            You haven't submitted any papers yet.
          </Typography>
        )}

        {subs.map(s => (
          <Card key={s._id} sx={{ p: 1, borderRadius: 3, boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{s.title}</Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                Conference: {s.conference?.title || "Unknown Conference"}
              </Typography>
              <Chip 
                label={s.status.replace("_", " ")} 
                color={
                  s.status === "ACCEPTED" ? "success" :
                  s.status === "REJECTED" ? "error" :
                  "info"
                }
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
