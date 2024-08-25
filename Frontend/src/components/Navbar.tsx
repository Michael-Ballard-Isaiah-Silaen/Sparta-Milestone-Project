import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { CurrentUserContext } from "../lib/contexts/CurrentUserContext";
import { useContext } from "react";

const Navbar = () => {
  const currentUserContext = useContext(CurrentUserContext);
  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/">TaskLink</NavLink>
      </div>
      <ul className="navbar-list">
        <li>
          <NavLink to="/" activeClassName="active" className="hover:text-black">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/calendar"
            activeClassName="active"
            className="hover:text-black"
          >
            Calendar
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/findmybuddies"
            activeClassName="active"
            className="hover:text-black"
          >
            Find My Buddies
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile/edit"
            activeClassName="active"
            className="hover:text-black"
          >
            Settings
          </NavLink>
        </li>
      </ul>

      {/* Profile Section */}
      <div className="profile">
        <ul>
          <li>
            <NavLink to="/">
              <div className="profile-btn reverse">
                <div className="profile-img"></div>
                <div className="username">
                  <span className="username">
                    {currentUserContext?.currentUser?.role}
                  </span>
                </div>
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
