import React, { Component } from "react";
import { Link } from "react-router-dom";

class NavbarDashboard extends Component {
  render() {
    return (
      <div className={this.props.mode}>
        <nav>
          <Link className="nav-link" to="/">
            <img src="logo.png" alt="logo" className="nav--logo"></img>
          </Link>
          <ul className="nav--list">
            <li></li>
            <li>
              <Link className="nav-link" to="/dashboard">
                DASHBOARD
              </Link>
            </li>

            <li>
              <Link className="nav-link" to="/leave">
                LEAVE
              </Link>
            </li>

            <li>
              <Link className="nav-link" to="/">
                LOGOUT
              </Link>
            </li>

            <li>
              <Link className="nav-link">ABOUT</Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default NavbarDashboard;
