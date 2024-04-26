import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navigation-container">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <>
          <li>
            <ProfileButton user={sessionUser} />
          </li>
          <li>
            {sessionUser && (
              <NavLink to="/spots/new">
                <button className="create-spot-link">Create a New Spot</button>
              </NavLink>
            )}
          </li>
        </>
      )}
    </ul>
  );
}

export default Navigation;
