import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../../routes";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarKey } from "../../Redux/Actions/sidebarKey";
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import "./styles.scss";
import logo from '../../assets/images/logo.png'
const drawer = Object.freeze({
  open: 240,
  closed: 80,
});

const SideBar = ({
  drawerWidth,
  handleSidebarDrawerClose,
  headerSidebar,
  setDrawerWidth,
}) => {
  const dispatch = useDispatch();
  const [filterRoutes, setFilterRoutes] = useState([]);
  const role = useSelector((state) => state.user.role);
  const key = useSelector((state) => state.key);

  useEffect(() => {
    let arr = [];
    if (role !== "super") {
      arr = routes.filter((item) => item.layout !== "super");
    } else {
      arr = routes;
    }
    setFilterRoutes(arr);
  }, [role]);

  const handleListItemClick = (value) => {
    dispatch(setSidebarKey(value));
    if (headerSidebar) {
      handleSidebarDrawerClose();
    }
  };

  const toggleDrawer = () => {
    if (drawerWidth === drawer.closed) {
      setDrawerWidth(drawer.open);
    } else {
      setDrawerWidth(drawer.closed);
    }
  };

  return (
    <Box sx={{ width: drawerWidth }} className="sidebar">
      <Box className="logo-box">
        <Typography
          className="logo-heading"
          color="primary"
          textAlign="center"
          variant="h5"
        >
          <img className="logo-img" src={logo}/>
        </Typography>
      </Box>
      <Box className="links-box">
        <List>
          {filterRoutes.map((route) => (
            <NavLink to={route.path} className="navLink">
              <ListItemButton
                button
                sx={{
                  "&.Mui-selected svg": {
                    fill: "#2F4983",
                  },
                }}
                className="list-item"
                key={route.path}
                onClick={() => handleListItemClick(route.path)}
                selected={key === route.path}
              >
                <Tooltip
                  title={drawerWidth === drawer.closed ? route.name : ""}
                  placement="right"
                  arrow
                >
                  <ListItemIcon>{route.icon()}</ListItemIcon>
                </Tooltip>
                {drawerWidth === drawer.open && (
                  <ListItemText
                    primary={route.name}
                    secondary={route?.description ?? ""}
                  />
                )}
              </ListItemButton>
            </NavLink>
          ))}
        </List>
      </Box>
      {!headerSidebar && (
        <Box className="drawer-toggle-btn">
          <Button
            onClick={toggleDrawer}
            fullWidth
            color="primary"
            variant="contained"
          >
            {drawerWidth === drawer.open ? (
              <ArrowBackIos style={{ fontSize: 14 }} />
            ) : (
              <ArrowForwardIos style={{ fontSize: 14 }} />
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SideBar;
