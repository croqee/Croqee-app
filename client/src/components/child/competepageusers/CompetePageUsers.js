import React, { Component } from 'react';

class CompetePageUsers extends Component {
	render() {
        let playingUsers = this.props.playingUsers;
		return (
            <div className="compete-page-users">
            {playingUsers.length != 0 &&
                playingUsers.map((user, i) => {
                    return (
                        <React.Fragment>
                        {i > 0 && <div className="compete-page-users__user-splitter" />}
                        <div className="compete-page-users__user" key={user._id}>
                            <div className="compete-page-users__user__name">{user.name} </div>
                            <div className="compete-page-users__user__score">
                                {' '}
                                {'last score: '}
                                {user.status == 'recently joined' ? <div>Recently joined</div> : <span className="compete-page-users__user__score__number">{user.score}</span>}
                            </div>
                        </div>
                        </React.Fragment>
                    );
                })}
        </div>
		
		);
	}
}
export default CompetePageUsers;
