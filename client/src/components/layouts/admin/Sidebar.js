import React from "react";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import classNames from "classnames";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiType,
  FiBell,
} from "react-icons/fi";
import { ImBlocked } from "react-icons/im";
import { GoReport } from "react-icons/go";
import "../../../css/admin/adminsidebar.css";
import { faList} from "@fortawesome/free-solid-svg-icons";

// import '../../../css/admin/adminsidebar.css';
const SideBar = ({ isOpen, toggle }) => {
  const pathname = window.location.pathname;
  console.log(pathname);
  return (
    <>
      <div className={classNames("sidebar", { "is-open": isOpen })}>
        <div className="sidebar-header">
          <span color="info" onClick={toggle} style={{ color: "#fff" }}>
            &times;
          </span>
          {/* <h3><Link to="/admin-dashboard">MENTORS</Link></h3> */}
          <div className="admin-sidebar-logo">
            <Link to="/admin-dashboard">
              <img
                src="../../../../images/logo-teachify.png"
                className="w-100"
                style={{ height: "100%" }}
              />
            </Link>
          </div>
        </div>
        <div className="side-menu">
          <nav aria-label="main-nav" className="side-navi">
            <List>
              <Link to="/admin-dashboard" className="sidenavbar">
                <ListItem disablePadding>
                  <ListItemButton
                    className={pathname == "/admin-dashboard" && "active"}
                  >
                    <ListItemIcon>
                      <FiHome />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link to="/users">
                <ListItem disablePadding>
                  <ListItemButton
                    className={
                      (pathname == "/users" ||
                        pathname == "/new-user" ||
                        pathname.split("/")[1] == "user-details") &&
                      "active"
                    }
                  >
                    <ListItemIcon>
                      <FiUsers />
                    </ListItemIcon>
                    <ListItemText primary="User Management" />
                  </ListItemButton>
                </ListItem>
              </Link>

              <Link to="/sessions">
                <ListItem disablePadding>
                  <ListItemButton
                    className={
                      (pathname == "/sessions" ||
                        pathname == "/calendar-sessions/" ||
                        pathname.split("/")[1] == "session-details") &&
                      "active"
                    }
                  >
                    <ListItemIcon>
                      <FiCalendar />
                    </ListItemIcon>
                    <ListItemText primary="Session Management" />
                  </ListItemButton>
                </ListItem>
              </Link>
              {/* <SubMenu title="Session Management" icon={<FiCalendar/>} items={submenus[0]} /> */}
              <Link to="/payments">
                <ListItem disablePadding>
                  <ListItemButton
                    className={pathname == "/payments" && "active"}
                  >
                    <ListItemIcon>
                      <FiDollarSign />
                    </ListItemIcon>
                    <ListItemText primary="Financial Management" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link to="/content-management">
                <ListItem disablePadding>
                  <ListItemButton
                    className={pathname == "/content-management" && "active"}
                  >
                    <ListItemIcon>
                      <FiType />
                    </ListItemIcon>
                    <ListItemText primary="Content Management" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link to="/notification-management">
                <ListItem disablePadding>
                  <ListItemButton
                    className={
                      pathname == "/notification-management" && "active"
                    }
                  >
                    <ListItemIcon>
                      <FiBell />
                    </ListItemIcon>
                    <ListItemText primary="Notification Management" />
                  </ListItemButton>
                </ListItem>
              </Link>
              {/* <Link to="/report-management">
                <ListItem disablePadding>
                  <ListItemButton
                    className={
                      pathname == "/report-management" && "active"
                    }
                  >
                    <ListItemIcon>
                      <GoReport />
                    </ListItemIcon>
                    <ListItemText primary="Report User Management" />
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link to="/block-management">
                <ListItem disablePadding>
                  <ListItemButton
                    className={
                      pathname == "/block-management" && "active"
                    }
                  >
                    <ListItemIcon>
                      <ImBlocked />
                    </ListItemIcon>
                    <ListItemText primary="Blocked User Management" />
                  </ListItemButton>
                </ListItem>
              </Link> */}
            </List>
          </nav>
        </div>
      </div>
    </>
  );
};

const submenus = [
  [
    {
      title: "Session List",
      target: "sessions",
      icon: faList,
    },
    {
      title: "Session Details",
      target: "session-details",
      icon: faList,
    },
  ],
  [
    {
      title: "Session Details",
      target: "Page-1",
      icon: faList,
    },
    {
      title: "Page 2",
      target: "Page-2",
    },
  ],
];

export default SideBar;
