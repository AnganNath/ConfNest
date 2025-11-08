import { useEffect, useState } from "react"
import API from "../api"
import { Card, CardContent, Typography } from "@mui/material"

export default function ViewConferences() {
    const [confs, setConfs] = useState([])

    useEffect(() => {
        API.get("/conferences").then(res => {
            console.log("CONFERENCES:", res.data)
            setConfs(res.data)
        })
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h2>Debug: ViewConferences Loaded</h2>
            <div style={{ maxWidth: 800, margin: "30px auto", display: "grid", gap: 20 }}>
                {confs.map(c =>
                    <Card key={c._id}>
                        <CardContent onClick={() => window.location = `/conference/${c._id}`} style={{ cursor: "pointer" }}>
                            <Typography variant="h6">{c.title}</Typography>
                            <Typography variant="body2">{c.description}</Typography>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
