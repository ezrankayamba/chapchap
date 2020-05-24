// connects/user.js
import { connect } from "react-redux";
import { logout } from "../../redux/auth/actions";

const UseUser = (Component) => {
  return connect(
    (state) => {
      return {
        user: state.auth.user,
        loggedIn: state.auth.loggedIn,
        shop: state.shop,
      };
    },
    { logout: logout }
  )(Component);
};

export default UseUser;
