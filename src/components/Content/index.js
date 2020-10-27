import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Box, Tab, Tabs } from "@material-ui/core"

import List from "./List"
import Statistics from "./Statistics"

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      style={{ flex: 1 }}
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}))
export default function Content() {
  const classes = useStyles()

  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <Tabs
        className={classes.tabs}
        value={value}
        onChange={handleChange}
        orientation="vertical"
        variant="scrollable"
      >
        <Tab label="今日战绩" />
        <Tab label="统计" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <List />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Statistics />
      </TabPanel>
    </div>
  )
}
