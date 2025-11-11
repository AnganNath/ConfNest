import { useEffect, useState } from "react";
import API from "../api";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function PendingDecisions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await API.get("/submissions/pending-decisions");
      // populate reviews for each submission
      const withReviews = await Promise.all(
        res.data.map(async s => {
          const revs = await API.get(`/reviews/bySubmission/${s._id}`);
          return { ...s, reviews: revs.data };
        })
      );
      setSubs(withReviews);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 850, margin: "30px auto" }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Pending Decisions
      </Typography>

      {loading && <Typography>Loading…</Typography>}
      {!loading && subs.length === 0 && <Typography>No pending decisions 🎉</Typography>}

      {subs.map(s => (
        <Card key={s._id} sx={{ borderRadius: 3, boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{s.title}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>{s.abstract}</Typography>

            {s.fileUrl && (
              <Button
                variant="outlined"
                sx={{ mb: 2 }}
                onClick={() => window.open(s.fileUrl, "_blank")}
              >
                View Paper
              </Button>
            )}

            <Typography variant="subtitle2" sx={{ mb: 1, color: "#555" }}>
              Reviews:
            </Typography>
            {s.reviews?.length > 0 ? (
              s.reviews.map(r => (
                <div
                  key={r._id}
                  style={{
                    marginBottom: 10,
                    background: "#f7f9fc",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <Typography variant="body2">
                    <strong>Score:</strong> {r.score}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Comments:</strong> {r.comments}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "#777" }}>
                No reviews yet
              </Typography>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <Button
                variant="contained"
                color="success"
                sx={{ borderRadius: "20px" }}
                onClick={() =>
                  API.post(`/submissions/${s._id}/decision`, { decision: "ACCEPTED" })
                    .then(() => load())
                }
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ borderRadius: "20px" }}
                onClick={() =>
                  API.post(`/submissions/${s._id}/decision`, { decision: "REJECTED" })
                    .then(() => load())
                }
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
