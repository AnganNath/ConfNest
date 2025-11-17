import { useEffect, useState } from "react";
import API from "../api";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function PendingReviews() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await API.get("/submissions/pending-reviews");
      setSubs(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 800, margin: "30px auto" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Pending Reviews
      </Typography>

      {loading && <Typography>Loading…</Typography>}
      {!loading && subs.length === 0 && (
        <Typography>No pending reviews 🎉</Typography>
      )}

      {subs.map(s => (
        <Card key={s._id} sx={{ borderRadius: 3, boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {s.title}
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, color: "#555" }}>
              {s.abstract}
            </Typography>

            {/* VIEW PAPER BUTTON */}
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

            {/* REVIEW BUTTON */}
            <Button
              variant="contained"
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                background: "#1565c0",
                "&:hover": { background: "#0d47a1" }
              }}
              onClick={() => window.location = `/review/${s._id}`}
            >
              Review Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
