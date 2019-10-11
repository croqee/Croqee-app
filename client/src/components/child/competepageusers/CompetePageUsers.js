import React, { Component } from 'react';

class CompetePageUsers extends Component {
	render() {
        let playingUsers = this.props.playingUsers;
		return (
            <div className="compete-page-users">
            {playingUsers.length != 0 &&
                playingUsers.map((user, i) => {
                    return (
                        <div className="compete-page-users__user" key={user._id}>
                            {i > 0 && <div className="compete-page-users__user__splitter" />}
                            <div className="compete-page-users__user__name">{user.name} </div>
                            <div className="compete-page-users__user__score">
                                {' '}
                                {'last score: '}
                                {user.status == 'just entered' ? <div>just entered</div> : user.score}
                            </div>
                        </div>
                    );
                })}
        </div>
		
		);
	}
}
export default CompetePageUsers;
