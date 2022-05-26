import React, { useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../../Redux/Actions";
import { Menu, LogoutOutlined, AccountCircle } from "@mui/icons-material";
import {
  IconButton,
  Box,
  Drawer,
  Tooltip,
  Avatar,
  Typography,
  Menu as MuiMenu,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from "@mui/material";
import DummyUserImage from "../../assets/images/user.png";
import { projectName } from "../../theme/themeConfig";
import "./header.scss";

// lazy loading
const SideBar = lazy(() => import("../Sidebar/SideBar"));

const Header = ({ drawerWidth }) => {
  // state
  const navigate = useNavigate();
  const [sidebarMenu, setSidebarMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menu = Boolean(anchorEl);

  // redux
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(userLogout());
    navigate("/");
  };

  const handleSidebarDrawerOpen = () => {
    setSidebarMenu(true);
  };

  const handleSidebarDrawerClose = () => {
    setSidebarMenu(false);
  };

  const handleOpenMenu = (element) => {
    setAnchorEl(element);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="header-box">
      <Box className="header-title-btn">
        <Tooltip title="Menu" arrow={true} placement="right">
          <IconButton
            sx={{
              color: "white",
              display: {
                xs: "block",
                md: "none",
              },
            }}
            onClick={handleSidebarDrawerOpen}
          >
            <Menu />
          </IconButton>
        </Tooltip>
        <Typography className="header-title">{projectName}</Typography>
      </Box>
      <Avatar
        src={DummyUserImage}
        onClick={(e) => handleOpenMenu(e.currentTarget)}
        className="header-avatar"
      />
      <MuiMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={menu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          sx: { width: 150, maxWidth: "100%" },
        }}
      >
        <MenuList dense>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </MenuList>
      </MuiMenu>
      <Drawer
        open={sidebarMenu}
        variant="temporary"
        onClose={handleSidebarDrawerClose}
      >
        <SideBar
          handleSidebarDrawerClose={handleSidebarDrawerClose}
          drawerWidth={drawerWidth}
          headerSidebar={true}
        />
      </Drawer>
    </Box>
  );
};

export default Header;
