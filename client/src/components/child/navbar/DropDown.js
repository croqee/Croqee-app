import React from 'react';
import { connect } from "react-redux";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import default_image from '../../../img/default-image.png';

const DropDown = (props) => {

    return (
        <React.Fragment>
            <div className="user-info">
                <div className="user-img medium" >
                    {props.user.img ? (<Avatar src={"/user-image/" + props.user.img.image_data} alt="profile image" />) : (<Avatar src={default_image} alt="profile image" />)}
                </div>
                <div className="user-details">
                    <ul>
                        <li style={{ textTransform: 'capitalize', fontSize: '18px' }}>{props.user.name}</li>
                        <li>{props.user.email}</li>
                        <li>score: {props.score.totalScores}</li>
                    </ul>
                </div>

            </div>
            <div className="profile-links">
                <ul>
                    <li><Link to={"/account/profile"}>Croqee profile</Link></li>
                    <li><Link to="/account/password">Account Settings</Link></li>
                    <li><Link to="/account/privacy">Privacy</Link></li>
                    <li><Link to="/LogOut">Sign Out</Link></li>
                </ul>

            </div>

        </React.Fragment>
    )
}
const mapStateToProps = state => ({ user: state.user, score: state.usersScore })

export default connect(mapStateToProps)(DropDown);