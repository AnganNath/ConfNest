import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const pill = {
    background: "rgba(255,255,255,0.9)",
    color: "#1565c0",
    borderRadius: "22px",
    padding: "5px 16px",
    fontWeight: 600,
    textDecoration: "none",
    transition: "0.25s",
  };

  const pillHover = {
    background: "#0d47a1",
    color: "white",
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // Always return to homepage after logout
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "#42A5F5",
        fontFamily: "Inter, sans-serif",
        letterSpacing: "0.1px",
      }}
    >
      <Toolbar sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 22,
            color: "white",
          }}
        >
          ConfNest
        </Link>

        {/* right menu */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          {!user && (
            <>
              <Link
                to="/register"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Register Author
              </Link>
              <Link
                to="/register-attendee"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Register Attendee
              </Link>
              <Link
                to="/login"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Login
              </Link>
            </>
          )}

          {user?.role === "CHAIR" && (
            <>
              <Link
                to="/create-conference"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Create Conference
              </Link>
              <Link
                to="/conferences"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Conferences
              </Link>
              <Link
                to="/assign"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Assign Reviewers
              </Link>
              <Link
                to="/pending-decisions"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Pending Decisions
              </Link>
            </>
          )}

          {user?.role === "AUTHOR" && (
            <>
              <Link
                to="/conferences"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Conferences
              </Link>
              <Link
                to="/my-submissions"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                My Submissions
              </Link>
            </>
          )}

          {user?.role === "REVIEWER" && (
            <>
              <Link
                to="/assigned"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Assigned Papers
              </Link>
              <Link
                to="/pending-reviews"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Pending Reviews
              </Link>
            </>
          )}

          {user?.role === "ATTENDEE" && (
            <>
              <Link
                to="/conferences"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                Conferences
              </Link>
              <Link
                to="/my-conferences"
                style={pill}
                onMouseEnter={(e) =>
                  Object.assign(e.target.style, pillHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.target.style, pill)
                }
              >
                My Conferences
              </Link>
            </>
          )}

          {user && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: "white",
                color: "white",
                fontWeight: 600,
                borderRadius: "20px",
                "&:hover": { background: "white", color: "#1565c0" },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
