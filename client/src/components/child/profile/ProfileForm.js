import React, { Fragment } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { theme } from '../MuiTheme';
import { Typography } from '@material-ui/core';

export default function ProfileForm({
  onchange,
  onsubmit,
  setToggleState,
  name,
  toggle,
  userProfileData,
  state,
  _errors,
}) {
  console.log(_errors);
  return (
    <Fragment>
      <div className='profile__userInfo'>
        <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
        <div className='profile__userInfo__container'>
          {toggle ? (
            <form
              noValidate
              className='profile__userInfo__container__form'
              onSubmit={onsubmit(name)}
            >
              <MuiThemeProvider theme={theme}>
                <TextField
                  className='profile__userInfo__container__form__input'
                  onChange={onchange}
                  name={name}
                  id='filled-error'
                  inputProps={{
                    pattern:
                      name === 'website'
                        ? `https://.*`
                        : name === 'behance'
                        ? `https://${name}.net/.*`
                        : `https://${name}.com/.*`,
                  }}
                  error={Boolean(Object.keys(_errors).length !== 0)}
                  helperText={
                    _errors[`${name}`] !== undefined && _errors[`${name}`]
                  }
                  defaultValue={state}
                  placeholder={
                    state === undefined || '' ? `https://${name}.com/` : ''
                  }
                />
              </MuiThemeProvider>
              <button
                type='submit'
                className='profile__userInfo__container__form__btn'
              >
                Update
              </button>
            </form>
          ) : (
            <Fragment>
              <Typography variant='body2' style={{ fontSize: '1rem' }}>
                {userProfileData ? (
                  <a href={userProfileData} className='profile__links__data'>
                    {userProfileData} <span></span>
                  </a>
                ) : (
                  `Link your ${name} account`
                )}
              </Typography>

              <a
                onClick={() => {
                  setToggleState(name, true);
                }}
              >
                Edit
              </a>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}
