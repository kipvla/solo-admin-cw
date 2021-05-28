import React, {useState} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';

// @material-ui/core components
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import styles from '../../../assets/jss/material-dashboard-react/components/sidebarStyle.js';
import ListItemText from '@material-ui/core/ListItemText';
import AdminNavbarLinks from '../Navbars/AdminNavbarLinks.js';
import {Collapse} from '@material-ui/core';
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  List as ListIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  const {color, image} = props;
  const [openCollapse, setOpenCollapse] = useState('');

  function activeRoute(routeName) {
    return window.location.pathname === routeName ? true : false;
  }

  const CustomLink = (path, name, CustomIcon) => {
    const listItemClasses = classNames({
      [' ' + classes[color]]: activeRoute(path),
    });

    const whiteFontClasses = classNames({
      [' ' + classes.whiteFont]: activeRoute(path),
    });

    return (
      <NavLink to={path} className={classes.item} activeClassName="active">
        <ListItem button className={classes.itemLink + listItemClasses}>
          <CustomIcon
            className={classNames(classes.itemIcon, whiteFontClasses)}
          />
          <ListItemText
            primary={name}
            className={classNames(classes.itemText, whiteFontClasses)}
            disableTypography={true}
          />
        </ListItem>
      </NavLink>
    );
  };

  function CustomMainLink(props) {
    return (
      <ListItem
        button
        onClick={() =>
          setOpenCollapse(props.clue === openCollapse ? '' : props.clue)
        }>
        <ListItemText style={{color: 'white'}} primary={props.label} />
        {openCollapse === props.clue ? (
          <ExpandLess style={{color: 'white'}} />
        ) : (
          <ExpandMore style={{color: 'white'}} />
        )}
      </ListItem>
    );
  }

  const Links = (
    <List className={classes.list}>
      {CustomLink('/dashboard', 'Dashboard', Dashboard)}
      <hr />
      <h6 style={{color: 'white', marginLeft: '15px', marginTop: '15px'}}>
        <b>ADMINISTRATION</b>
      </h6>
      <CustomMainLink clue="clients" label="Clients" />
      <Collapse in={openCollapse === 'clients'} timeout="auto" unmountOnExit>
        <List className={classes.list}>
          {CustomLink('/admin/clients', 'List', ListIcon)}
        </List>
      </Collapse>
    </List>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="right"
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}>
          <div className={classes.sidebarWrapper}>
            <AdminNavbarLinks />
            {Links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{backgroundImage: 'url(' + image + ')'}}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="left"
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper),
          }}>
          <div className={classes.sidebarWrapper}>{Links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{backgroundImage: 'url(' + image + ')'}}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(['purple', 'blue', 'green', 'orange', 'red']),
  logo: PropTypes.string,
  image: PropTypes.string,
  open: PropTypes.bool,
  clue: PropTypes.string,
  label: PropTypes.string,
  color: PropTypes.string,
};
