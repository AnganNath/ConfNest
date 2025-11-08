import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function Nav() {
  const { user, logout } = useAuth()

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar sx={{ display:"flex", gap:2 }}>

        <Link to="/" style={{ textDecoration:"none", fontWeight:"bold", fontSize:18 }}>ConfNest</Link>

        {user ? (
          <>
            {/* CHAIR MENU */}
            {user.role === "CHAIR" && (
              <>
                <Link to="/create-conference">Create Conference</Link>
                <Link to="/conferences">Conferences</Link>
                <Link to="/assign">Assign Reviewer</Link>
              </>
            )}

            {/* AUTHOR MENU */}
            {user.role === "AUTHOR" && (
              <>
                <Link to="/conferences">Conferences</Link>
              </>
            )}

            {/* REVIEWER MENU */}
            {user.role === "REVIEWER" && (
              <>
                <Link to="/assigned">My Assigned Papers</Link>
              </>
            )}

            {/* ATTENDEE MENU */}
            {user.role === "ATTENDEE" && (
              <>
                <Link to="/conferences">Conferences</Link>
                <Link to="/my-conferences">My Conferences</Link>
              </>
            )}

            <Button onClick={logout} variant="outlined" size="small" sx={{ ml:"auto" }}>
              Logout
            </Button>
          </>
        ) : (
          <div style={{ marginLeft:"auto", display:"flex", gap:12 }}>
            <Link to="/register">Register (Author)</Link>
            <Link to="/register-attendee">Register (Attendee)</Link>
            <Link to="/login">Login</Link>
          </div>
        )}

      </Toolbar>
    </AppBar>
  )
}
