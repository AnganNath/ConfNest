import { useAuth } from "../auth/AuthContext"
import { Link } from "react-router-dom"

export default function Home() {
  const { user } = useAuth()

  console.log("HOME USER =", user)   // <-- DEBUG print

  if (!user) return (
    <div style={{padding:20}}>
      <h2>Welcome to ConfNest</h2>
      <p>Please <Link to="/login">login</Link> to continue.</p>
    </div>
  )

  return (
    <div style={{padding:20}}>
      <h2>Hello {user.name}</h2>
      <p>Your role: {user.role}</p>
      <p>Select an option from the menu.</p>
    </div>
  )
}
