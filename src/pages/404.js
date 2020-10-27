import React from "react"
import { CssBaseline, Container, Typography, Button } from "@material-ui/core"
import Provider from "../components/Provider"

export default function Home() {
  return (
    <Provider>
      <CssBaseline />
      <Container>
        <Typography variant="h3">Page not found</Typography>
        <Button href="/" variant="contained" color="primary">
          Go Back
        </Button>
      </Container>
    </Provider>
  )
}
