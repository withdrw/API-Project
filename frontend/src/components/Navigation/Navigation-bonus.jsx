import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";
import ferbnb from "/ferbnb.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navigation-container">
      <div className="img">
        <NavLink to="/">
          <img className="ferbnb-logo" src={ferbnb} alt="ferbnb logo"></img>
        </NavLink>
      </div>
      <div className="right-navigation">
        <div className="create-new-spot">
          {sessionUser && (
            <NavLink to="/spots/new">
              <button className="create-spot-link">Create a New Spot</button>
            </NavLink>
          )}
        </div>
        {isLoaded && (
          <>
            <ProfileButton user={sessionUser} />
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
