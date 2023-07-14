import React, { useState } from "react";
import classNames from "classnames";
import { Collapse, NavItem, NavLink } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chip from '@mui/material/Chip';
import { Link } from "react-router-dom";

const SubMenu = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggle = () => setCollapsed(!collapsed);
  const { icon, title, items } = props;

  return (
    <div className="submenu-area">
      <NavItem
        onClick={toggle}
        className={classNames({ "menu-open": !collapsed })}
      >
        <NavLink className="dropdown-toggle">
          {/* <FontAwesomeIcon icon={icon} className="mr-2" /> */}
          <Chip icon={icon} />
          {title}
        </NavLink>
      </NavItem>
      <Collapse
        isOpen={!collapsed}
        navbar
        className={classNames("items-menu", { "mb-1": !collapsed }, "sub-menu-items")}
      >
        {items.map((item, index) => (
          <NavItem key={index} className="ext-sub-items">
            <NavLink tag={Link} to={item.target}>
              {item.icon &&
                <FontAwesomeIcon icon={item.icon} />
              }
              {item.title}
            </NavLink>
          </NavItem>
        ))}
      </Collapse>
    </div>
  );
};

export default SubMenu;
