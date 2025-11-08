import { useEffect, useState } from "react"
import API from "../api"
import { Card, CardContent, Typography, Button } from "@mui/material"
import { useAuth } from "../auth/AuthContext"

export default function ViewConferences() {
  const [confs, setConfs] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    API.get("/conferences").then(res => {
      console.log("CONFERENCES:", res.data)
      setConfs(res.data)
    })
  }, [])

  async function registerToConf(id){
  try{
    await API.post(`/confreg/${id}`)
    alert("Registered as Attendee!")
  }catch(err){
    if(err.response?.data?.message === "Already Registered"){
      alert("You are already registered in this conference")
    }else{
      alert("Error registering")
    }
  }
}


  return (
    <div style={{ padding: 20 }}>
        <Typography variant="h5" sx={{mb:3}}>Available Conferences</Typography>

        <div style={{ maxWidth: 800, margin: "30px auto", display: "grid", gap: 20 }}>
            {confs.map(c =>
                <Card key={c._id}>
                    <CardContent>
                        <Typography 
                          variant="h6" 
                          sx={{cursor:"pointer"}}
                          onClick={() => window.location = `/conference/${c._id}`}
                        >
                          {c.title}
                        </Typography>

                        <Typography variant="body2" sx={{mb:2}} color="text.secondary">
                          {c.description}
                        </Typography>

                        {user?.role === "ATTENDEE" && (
                          <Button 
                            variant="outlined"
                            onClick={()=>registerToConf(c._id)}
                          >
                            Register for this Conference
                          </Button>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  )
}
