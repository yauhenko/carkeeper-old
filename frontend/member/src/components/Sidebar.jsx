import React from 'react';
import {NavLink} from 'react-router-dom';
import '../assets/css/sidebar.css';

const Sidebar = () => (
  <div className="sidebar">
    <div className="sidebar__logo text-center">
      <img src={require('../assets/images/logo.png')} width="200" alt=""/>
    </div>
    <ul className="sidebar__menu">
      <li className="sidebar__menu_li">
        <NavLink exact to="/">Гараж</NavLink>
      </li>
      <li className="sidebar__menu_li">
        <NavLink to="/card">Автокарта</NavLink>
      </li>
    </ul>
  </div>
);

export default Sidebar;