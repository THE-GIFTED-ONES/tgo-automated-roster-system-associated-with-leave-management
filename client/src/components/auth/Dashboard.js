import React, { Component } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";

class Dashboard extends Component {
  state = {
    time: new Date().toLocaleTimeString(),
    profilePicture: null,
    filePreview: null,
  };

  componentDidMount() {
    this.intervalID = setInterval(() => {
      this.setState({ time: new Date().toLocaleTimeString() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    const { auth } = this.props;
    const { filePreview } = this.state;
    return (
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={this.props.mode}
      >
        <div className="row">
          <div className="col s12">
            <h1>Dashboard</h1>
            <img
              src={filePreview || auth.user.avatar}
              alt="Profile"
              className="dashboard--profilePhoto"
            />
          </div>
        </div>
        <div className="dashboard--greetings">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {auth.user.name.split(" ")[0]}
            </h4>
            <h4>
              <p>Current Time: {this.state.time}</p>
            </h4>
          </div>
        </div>
        <Link to="/leave">
          <button className="dashboard--leaveButton">Request Leave</button>
        </Link>
        <button
          style={{
            width: "150px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            marginTop: "1rem",
          }}
          onClick={this.handleLogout}
        >
          Logout
        </button>
      </motion.div>
    );
  }

  handleLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
