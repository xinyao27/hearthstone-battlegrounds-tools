import React from "react"
import { ThemeProvider } from "@material-ui/core"
import { createMuiTheme, makeStyles } from "@material-ui/core/styles"
import blue from "@material-ui/core/colors/blue"
import red from "@material-ui/core/colors/red"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: red[500],
    },
  },
})

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
  },
}))

export default function Provider({ children }) {
  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>{children}</div>
    </ThemeProvider>
  )
}
