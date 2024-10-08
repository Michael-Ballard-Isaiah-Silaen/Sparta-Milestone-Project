import { useContext } from "react";
import { CurrentUserContext } from "../lib/contexts/CurrentUserContext";
import { NavLink } from "react-router-dom";
import logopic from "../pages/images/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const currentUserContext = useContext(CurrentUserContext);
  console.log("email: ", currentUserContext?.currentUser?.email);
  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/" activeClassName="active">
          <img src={logopic} alt="Logo" width="60%" />
        </NavLink>
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
            to={`/profile/edit/${currentUserContext?.currentUser?.email}`}
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
            <NavLink to="/profile">
              <div className="profile-btn reverse">
                <div className="profile-img"></div>
                <div className="username">
                  <span className="username">
                    {currentUserContext?.currentUser?.displayName}
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
