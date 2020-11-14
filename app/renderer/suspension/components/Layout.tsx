import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

interface LayoutProps {
  className?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    maxWidth: 260,
    position: 'relative',
    overflow: 'hidden',
  },
  border: {
    position: 'absolute',
    top: -9,
    left: -9,
    width: `calc(100% + 18px)`,
    height: `calc(100% + 23px)`,
    zIndex: 2,
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: '27px 27px 31px',
    borderImage: `url("${
      require('@shared/assets/images/border.png').default
    }") 27 27 31 fill stretch`,
  },
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    background: `url('${
      require('@shared/assets/images/background.png').default
    }') repeat-y`,
    backgroundSize: '100%',
    overflow: 'hidden',
    borderRadius: 25,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    height: 142,
    padding: 27,
    background: `url('${
      require('@shared/assets/images/logo.png').default
    }') no-repeat center`,
    backgroundSize: '80%',
    marginTop: theme.spacing(4),
    '-webkit-app-region': 'drag',
  },
  content: {
    width: '100%',
    flex: 1,
    padding: '0 27px',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
}));

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.border} />
      <div className={classes.container}>
        <div className={classes.header} />
        <div className={clsx(classes.content, className)}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
