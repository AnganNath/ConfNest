import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/GroupsOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import API from "../api"; // use your existing api helper

export default function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // call backend login API
      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      // call AuthContext login with the expected object shape
      login({
        token: res.data.token,
        role: res.data.role,
        name: res.data.name
      });

      // go to home/dashboard
      navigate("/");
    } catch (err) {
      // show a clear message
      const msg =
        err?.response?.data?.message ||
        "Login failed — check email and password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // If not logged in: show landing (left description + right login card)
  if (!user)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #eaf3ff, #f8fbff)",
          fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <main
          style={{
            display: "flex",
            alignItems: "flex-start", // shifted up a bit
            justifyContent: "center",
            flex: 1,
            padding: "40px 60px",  // nudged up (previously larger)
            gap: "48px",
            flexWrap: "wrap",
            boxSizing: "border-box"
          }}
        >
          {/* Left side — Illustration & Description */}
          <div
            style={{
              flex: "1 1 420px",
              minWidth: 320,
              maxWidth: 640,
              textAlign: "left",
              paddingTop: 10
            }}
          >
            <img
              src="https://www.svgrepo.com/show/474781/conference-call.svg"
              alt="ConfNest illustration"
              style={{
                width: 120,
                display: "block",
                margin: "10px 0 18px 0",
                opacity: 0.95
              }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#0b407a",
                mb: 2
              }}
            >
              Welcome to ConfNest
            </Typography>
            <Typography
              sx={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "#333",
                mb: 2,
                maxWidth: 560
              }}
            >
              ConfNest helps you organize, review, and participate in academic
              conferences seamlessly. Manage papers, assign reviewers, and track
              progress — all in one place.
            </Typography>
            <Typography sx={{ fontSize: 15, color: "#444" }}>
              🎓 For Chairs, Reviewers, Authors, and Attendees alike.
            </Typography>
          </div>

          {/* Right side — Login Form */}
          <Card
            sx={{
              p: 4,
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              maxWidth: 420,
              minWidth: 300,
              textAlign: "center",
              backgroundColor: "#fff"
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 700, color: "#1565c0" }}
            >
              Login to Continue
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                fullWidth
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" }
                }}
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                fullWidth
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" }
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
                sx={{
                  background: "#1565c0",
                  borderRadius: "10px",
                  fontWeight: 600,
                  py: 1,
                  "&:hover": { background: "#0d47a1" }
                }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
              </Button>
            </form>

            <Typography sx={{ mt: 2, color: "#666", fontSize: 14 }}>
              Don’t have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#1565c0",
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                Register as Author
              </Link>{" "}
              or{" "}
              <Link
                to="/register-attendee"
                style={{
                  color: "#1565c0",
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                Register as Attendee
              </Link>
            </Typography>
          </Card>
        </main>

        <footer
          style={{
            textAlign: "center",
            padding: "14px",
            color: "#555",
            background: "#e3f2fd",
            fontSize: "14px"
          }}
        >
          © 2025 ConfNest — Simplifying Conference Management.
        </footer>
      </div>
    );

  // -------------------------
  // LOGGED-IN DASHBOARD
  // -------------------------
  const cards = [];

  if (user.role === "CHAIR") {
    cards.push(
      {
        label: "Create Conference",
        icon: <AddCircleOutlineIcon />,
        link: "/create-conference",
        sub: "Setup CFP / Tracks / Deadlines"
      },
      {
        label: "View Conferences",
        icon: <FolderOpenOutlinedIcon />,
        link: "/conferences",
        sub: "Browse & Manage"
      },
      {
        label: "Assign Reviewers",
        icon: <GroupsIcon />,
        link: "/assign",
        sub: "Allocate Submissions"
      },
      {
        label: "Pending Decisions",
        icon: <AssignmentOutlinedIcon />,
        link: "/pending-decisions",
        sub: "View Pending Decisions"
      }
    );
  }

  if (user.role === "AUTHOR") {
    cards.push(
      {
        label: "View Conferences",
        icon: <FolderOpenOutlinedIcon />,
        link: "/conferences",
        sub: "Choose a Conference"
      },
      {
        label: "My Submissions",
        icon: <AssignmentOutlinedIcon />,
        link: "/my-submissions",
        sub: "Manage Your Papers"
      }
    );
  }

  if (user.role === "REVIEWER") {
    cards.push(
      {
        label: "My Assigned Papers",
        icon: <AssignmentOutlinedIcon />,
        link: "/assigned",
        sub: "Your Assignments"
      },
      {
        label: "Pending Reviews",
        icon: <RateReviewOutlinedIcon />,
        link: "/pending-reviews",
        sub: "Review Pending Papers"
      }
    );
  }

  if (user.role === "ATTENDEE") {
    cards.push(
      {
        label: "View Conferences",
        icon: <FolderOpenOutlinedIcon />,
        link: "/conferences",
        sub: "Register / Browse / See Accepted"
      },
      {
        label: "My Conferences",
        icon: <GroupsIcon />,
        link: "/my-conferences",
        sub: "My Registered Conferences"
      }
    );
  }

  return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <Typography variant="h4" sx={{ color: "#133E87", fontWeight: "600" }}>
        Welcome, {user.name}
      </Typography>
      <Typography sx={{ color: "#6185C0", mb: 4 }}>{user.role} Dashboard</Typography>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          maxWidth: 920,
          margin: "0 auto"
        }}
      >
        {cards.map((c) => (
          <Card
            key={c.label}
            component={Link}
            to={c.link}
            sx={{
              p: 2,
              textDecoration: "none",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(19,62,135,0.06)",
              display: "flex",
              alignItems: "center",
              transition: "0.2s",
              "&:hover": { boxShadow: "0 6px 20px rgba(19,62,135,0.14)" }
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div style={{ fontSize: 32, color: "#1A4CA1" }}>{c.icon}</div>
              <div style={{ textAlign: "left" }}>
                <Typography sx={{ fontWeight: "600", color: "#133E87" }}>{c.label}</Typography>
                <Typography sx={{ fontSize: 13, color: "#5578A3" }}>{c.sub}</Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
