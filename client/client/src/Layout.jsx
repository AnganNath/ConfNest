import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Nav from "./components/Nav"

export default function Layout({ children }) {
  return (
    <>
      <Nav />
      <Box sx={{ background:"#F5F9FF", minHeight:"100vh", pt:4 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </>
  )
}
