import { useAuth } from "../auth/AuthContext"
import { Link } from "react-router-dom"
import { Card, CardContent, Typography } from "@mui/material"
import GroupsIcon from '@mui/icons-material/GroupsOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'


export default function Home() {
  const { user } = useAuth()

  // NOT logged in → landing
  if (!user) return (
    <div style={{paddingTop:80, textAlign:"center"}}>
      <h1 style={{fontSize:36, color:"#133E87"}}>Welcome to ConfNest</h1>
      <p style={{fontSize:18, marginTop:12}}>Please <Link to="/login">login</Link> to continue.</p>
    </div>
  )

  // LOGGED IN dashboards
  const cards = []

  if (user.role==="CHAIR"){
    cards.push(
      {label:"Create Conference", icon:<AddCircleOutlineIcon/>, link:"/create-conference", sub:"setup CFP / Tracks / Deadlines"},
      {label:"View Conferences", icon:<FolderOpenOutlinedIcon/>, link:"/conferences", sub:"browse & manage"},
      {label:"Assign Reviewers", icon:<GroupsIcon/>, link:"/assign", sub:"allocate submissions"}
    )
  }

  if (user.role==="AUTHOR"){
    cards.push(
      {label:"View Conferences", icon:<FolderOpenOutlinedIcon/>, link:"/conferences", sub:"choose a conference"},
      {label:"My Submissions", icon:<AssignmentOutlinedIcon/>, link:"/submit", sub:"manage your papers"},
    )
  }

  if (user.role==="REVIEWER"){
    cards.push(
      {label:"My Assigned Papers", icon:<AssignmentOutlinedIcon/>, link:"/assigned", sub:"review pending papers"},
    )
  }

  if (user.role==="ATTENDEE"){
    cards.push(
      {label:"View Conferences", icon:<FolderOpenOutlinedIcon/>, link:"/conferences", sub:"register / browse / see accepted"},
      {label:"My Conferences", icon:<GroupsIcon/>, link:"/my-conferences", sub:"my registered confs"},
    )
  }


  return (
    <div style={{ textAlign:"center", paddingTop:60 }}>
      <Typography variant="h4" sx={{color:"#133E87", fontWeight:"600"}}>Welcome, {user.name}</Typography>
      <Typography sx={{color:"#6185C0", mb:5}}>{user.role} Dashboard</Typography>

      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:24,
        maxWidth:900,
        margin:"0 auto"
      }}>
        {cards.map(c=>(
          <Card 
            key={c.label}
            component={Link}
            to={c.link}
            sx={{
              p:2,
              textDecoration:"none",
              borderRadius:3,
              boxShadow:"0 4px 12px rgba(19,62,135,0.08)",
              display:"flex",
              alignItems:"center",
              transition:"0.2s",
              "&:hover":{ boxShadow:"0 4px 18px rgba(19,62,135,0.18)" }
            }}>
            <CardContent sx={{display:"flex", alignItems:"center", gap:2}}>
              <div style={{fontSize:36, color:"#1A4CA1"}}>{c.icon}</div>
              <div style={{textAlign:"left"}}>
                <Typography sx={{fontWeight:"600", color:"#133E87"}}>{c.label}</Typography>
                <Typography sx={{fontSize:13, color:"#5578A3"}}>{c.sub}</Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
