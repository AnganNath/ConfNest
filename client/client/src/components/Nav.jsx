import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function Nav() {
  const { user, logout } = useAuth()

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar sx={{ display: "flex", gap: 2 }}>

        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold", fontSize: 18 }}>ConfNest</Link>

        {user ? (
          <>
            {/* CHAIR MENU */}
            {user.role === "CHAIR" && (
              <>
                <Link to="/create-conference">Create Conference</Link>
                <Link to="/conferences">Conferences</Link>
              </>
            )}

            {/* AUTHOR MENU */}
            {user.role === "AUTHOR" && (
              <>
                <Link to="/submit">Submit Paper</Link>
                <Link to="/conferences">Conferences</Link>
              </>
            )}

            {/* REVIEWER MENU */}
            {user.role === "REVIEWER" && (
              <>
                <Link to="/assigned">My Assigned Papers</Link>
              </>
            )}

            <Button onClick={logout} variant="outlined" size="small" sx={{ ml: "auto" }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/register" style={{ marginLeft: "auto" }}>Register</Link>
            <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
              <Link to="/register-attendee">Attendee Register</Link>
              <Link to="/login">Login</Link>
            </div>
          </>
        )
        }

      </Toolbar>
    </AppBar>
  )
}
