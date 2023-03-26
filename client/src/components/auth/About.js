import React, { Component } from "react";
import { motion } from "framer-motion";

class About extends Component {
  render() {
    return (
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={this.props.mode}
      >
      <div className="devider"></div>
            <div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <h2 className="about-topic">About OrangeHRM</h2>
          <p className="about-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis luctus nibh ac nulla congue, id commodo sapien commodo. Ut viverra diam eget venenatis rutrum.</p>
        </div>
        <div className ="team-img">
          <img src="https://www.thepolyglotgroup.com/wp-content/uploads/2018/09/Human-Resources-2.png" 
          alt="success" 
           className="team-img1"/>
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: '1em' }}>
        <div className = "success-img">
          <img src="https://www.pctonline.com/fileuploads/publications/18/issues/103003/articles/images/ThinkstockPhotos-576921084_human_resources_fmt.png" alt="teamwork" 
           className="team-img1"/>
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="about-topic">Leave Management</h2>
          <p className="about-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis luctus nibh ac nulla congue, id commodo sapien commodo. Ut viverra diam eget venenatis rutrum.</p>
        </div>
      </div>
    </div>
    

    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <h2 className="about-topic">Download Our Mobile App</h2>
          <p className="about-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis luctus nibh ac nulla congue, id commodo sapien commodo. Ut viverra diam eget venenatis rutrum.</p>
        </div>
        <div className ="team-img">
          <img src="https://www.pngarts.com/files/7/Management-Transparent-Images.png" 
          alt="success" 
           className="team-img1"/>
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: '1em' }}>
        <div className = "success-img">
          <img src="https://freepngimg.com/save/92393-human-management-business-student-behavior-hq-image-free-png/1500x1500" alt="teamwork" 
           className="team-img1"/>
        </div>
        <div style={{ flex: 1 }}>
          <h2 className="about-topic">Get Notified</h2>
          <p className="about-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis luctus nibh ac nulla congue, id commodo sapien commodo. Ut viverra diam eget venenatis rutrum.</p>
        </div>
      </div>
    </div>


 </motion.div>
    );
  }
}

export default About;
