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
      <Typography variant="h5">Pending Reviews</Typography>

      {loading && <Typography>Loading…</Typography>}
      {!loading && subs.length === 0 && <Typography>No pending reviews 🎉</Typography>}

      {subs.map(s => (
        <Card key={s._id}>
          <CardContent>
            <Typography variant="h6">{s.title}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>{s.abstract}</Typography>
            <Button
              variant="contained"
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
