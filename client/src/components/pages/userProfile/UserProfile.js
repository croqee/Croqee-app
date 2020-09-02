import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { getUsersScore, getScoredModels } from '../../../js/actions';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import axios from 'axios';
import config from '../../../modules/config';
import ProfileAvatar from '../../child/profile/ProfileAvatar';
import { Typography } from '@material-ui/core';
// import default_image from '../../../img/default-image.png';
import PersonSharpIcon from '@material-ui/icons/PersonSharp';
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRank: '',
      userScore: '',
      userInfo: {},
    };
    this.props.getUsersScore(1);
  }

  componentDidMount() {
    const paramsId = this.props.location.pathname.substring(13);
    let athorizedHeader = config.AuthorizationHeader();
    axios
      .get('/api/user/' + paramsId, athorizedHeader)
      .then((res) => {
        this.setState({
          userInfo: res.data,
        });
      })
      .catch((err) => console.log(err));
  }
  componentDidUpdate(prevProps) {
    if (this.props.usersScore !== prevProps.usersScore) {
      const paramsId = this.props.location.pathname.substring(13);
      this.props.usersScore.data.forEach((user) => {
        if (user._id === paramsId) {
          this.setState({
            userRank: user.rank,
            userScore: user.total,
          });
        }
      });
    }
  }
  render() {
    const { userInfo, userRank, userScore } = this.state;
    return (
      <Fragment>
        {userInfo && (
          <div className='userProfile'>
            <div className='profile__img-name-wrapper'>
              <div className='profile__img-name-wrapper__img'>
                {userInfo.image_data ?
                  <ProfileAvatar
                    imageSrc={`/user-image/${userInfo.image_data}`}
                  />:
                  <ProfileAvatar><PersonSharpIcon /></ProfileAvatar>}
              </div>
              <div className='profile__img-name-wrapper__name'>
                <span>Name</span>
                <h1>{userInfo.name}</h1>
              </div>
            </div>
            <div className='profile__ranking'>
              <h2>
                Rank #
                <span className='profile__ranking__highlight'>{userRank}</span>
              </h2>
              <h2>
                Score{' '}
                <span className='profile__ranking__highlight'>{userScore}</span>
              </h2>
            </div>
            <div className='profile__userInfo'>
              <span>Email</span>
              <div className='profile__userInfo__container'>
                <Typography variant='body2' style={{ fontSize: '1rem' }}>
                  {userInfo.email}
                </Typography>
              </div>
            </div>
            <div className='profile__userInfo'>
              <span>Location</span>
              <div className='profile__userInfo__container'>
                <Typography variant='body2' style={{ fontSize: '1rem' }}>
                  {userInfo.city ? userInfo.city : 'Unspecified'}
                </Typography>
              </div>
            </div>
            {/* <div className='profile__userInfo'>
              <span>Birthdate</span>
              <div className='profile__userInfo__container'>
                <Typography variant='body2' style={{ fontSize: '1rem' }}>
                  {userInfo.birthDate
                    ? userInfo.birthDate.substring(0, 10)
                    : 'Unspecified.'}
                </Typography>
              </div>
            </div> */}
            <div className='profile__links'>
              <p>Links</p>
            </div>
            {userInfo.behance !== undefined && (
              <a href={userInfo.behance} className='profile__links__icons'>
                <i className={'fab fa-2x fa-behance '} />
              </a>
            )}
            {userInfo.facebook !== undefined && (
              <a href={userInfo.facebook} className='profile__links__icons'>
                <i
                  className={'fab fa-2x fa-facebook'}
                // style={{ color: "#b8b8b8", margin: "1rem" }}
                />
              </a>
            )}
            {userInfo.instagram !== undefined && (
              <a href={userInfo.instagram} className='profile__links__icons'>
                <i
                  className={'fab fa-2x fa-instagram'}
                //style={{ color: "#b8b8b8", margin: "1rem" }}
                />
              </a>
            )}
            {userInfo.website !== undefined && (
              <a href={userInfo.website} className='profile__links__icons'>
                <i
                  className={'far fa-2x fa-user-circle'}
                // style={{ color: "#b8b8b8", margin: "1rem" }}
                />
              </a>
            )}
          </div>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  const { usersScore, user } = state;
  return { usersScore, user };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getUsersScore: (page) => dispatch(getUsersScore(page)),
    getScoredModels: () => dispatch(getScoredModels()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
