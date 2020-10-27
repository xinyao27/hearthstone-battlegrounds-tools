import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Button } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: 46,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}))

export default function Footer() {
  const classes = useStyles()

  return (
    <footer className={classes.root}>
      Made by{" "}
      <Button
        href="https://github.com/chenyueban"
        color="primary"
        target="_blank"
      >
        chenyueban
      </Button>
    </footer>
  )
}
