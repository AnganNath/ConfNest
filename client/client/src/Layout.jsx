import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Nav from "./components/Nav"

export default function Layout({ children }) {
  return (
    <>
      <Nav />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          {children}
        </Box>
      </Container>
    </>
  )
}
