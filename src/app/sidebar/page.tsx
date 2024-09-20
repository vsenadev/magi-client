import React from 'react';
import '../styles/Sidebar.module.sass';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="icon icon-home" title="Home" />
      <div className="icon icon-search" title="Company" />
      <div className="icon icon-settings" title="Employees" />
      <div className="icon icon-profile" title="Delivery" />
    </div>
  );
};

export default Sidebar;
