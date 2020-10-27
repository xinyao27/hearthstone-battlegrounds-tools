import React from "react"
import { CssBaseline } from "@material-ui/core"
import Provider from "../components/Provider"
import Header from "../components/Header"
import Content from "../components/Content"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <Provider>
      <CssBaseline />

      <Header />
      <Content />
      <Footer />
    </Provider>
  )
}
