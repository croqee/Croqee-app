import axios from "axios";
import config from "../../modules/config";
import {
  SET_USER,
  GET_USER_ASYNC,
  AUTHENTICATE,
  SET_TIMER,
  SHOW_SCORE,
  HIDE_SCORE,
  REMOVE_SCORE,
  SET_IMAGE_PROCESSING,
  SET_HAND_SIDE,
  SET_TIMER_DONE,
  SET_START_IMAGE_PROCESSING,
  SET_PAGE_TO_NAVIGATE_AFTER_LOGIN,
  SET_ACTIVE_MODEL,
  SET_ACTIVE_MODEL_DRAWN,
  GET_USERS_SCORE_ASYNC,
  GET_SCORED_MODELS_ASYNC,
  SET_CANVAS_DIMENSION,
  SET_INNER_MODEL_DIMENSION
} from "./action-types";
import Auth from "../../modules/Auth";

//Get User
function getUserAsync(payload) {
  return { type: GET_USER_ASYNC, user: payload.user };
}
export function getUser() {
  return dispatch => {
    let AuthorizationHeader = config.AuthorizationHeader();

    //Set the authorization header as axios default header and delete that on log out
    axios.get("/api/getuser", AuthorizationHeader).then(response => {
      dispatch(authenticate(true));
      let user = response.data;
      dispatch(getUserAsync(user));
    });
  };
}

//Set User
export function setUser(payload) {
  return { type: SET_USER, user: payload };
}
export function authenticate(payload) {
  return { type: AUTHENTICATE, isAuthenticated: payload };
}

//Timer
export function setTimer(payload) {
  return {
    type: SET_TIMER,
    showTimer: payload.showTimer,
    timer: payload.timer
  };
}
export function setTimerDone(payload) {
  return { type: SET_TIMER_DONE, done: payload };
}

//Invoke Score
export function invokeScore(payload) {
  return dispatch => {
    dispatch(showScore(payload));
    setTimeout(() => {
      dispatch(hideScore());
      setTimeout(() => {
        dispatch(setTimerDone(true));
        dispatch(setStartImageProcessing(false));
        dispatch(setActiveModelDrawn());
      }, 1000);
    }, 4500);
  };
}
export function showScore(payload) {
  return { type: SHOW_SCORE, score: payload };
}
export function hideScoreAsync() {
  return { type: HIDE_SCORE };
}
export function removeScoreAsync() {
  return { type: REMOVE_SCORE };
}
export function hideScore() {
  return dispatch => {
    dispatch(hideScoreAsync());
    setTimeout(() => {
      dispatch(removeScoreAsync());
    }, 500);
  };
}

export function setImageProcessing(payload) {
  return { type: SET_IMAGE_PROCESSING, imageProcessing: payload };
}

export function setHandSide(payload) {
  return { type: SET_HAND_SIDE, side: payload };
}
export function setStartImageProcessing(payload) {
  return { type: SET_START_IMAGE_PROCESSING, startImageProcessing: payload };
}
export function setPageToNavigateAfterLogin(payload) {
  return {
    type: SET_PAGE_TO_NAVIGATE_AFTER_LOGIN,
    pageToNavigateAfterLogin: payload
  };
}
export function setActiveModel(payload) {
  return { type: SET_ACTIVE_MODEL, activeModel: payload };
}
export function setActiveModelDrawn() {
  return { type: SET_ACTIVE_MODEL_DRAWN };
}

//Get UsersScore
function getUsersScoreAsync(payload) {
  return { type: GET_USERS_SCORE_ASYNC, usersScore: payload };
}
export function getUsersScore() {
  return dispatch => {
    axios
      .get("/score/userscore", {
        headers: {
          Authorization: "Bearer " + Auth.getToken()
        }
      })
      .then(response => {
        const usersScore = response.data.usersScore;
        dispatch(getUsersScoreAsync(usersScore));
      });
  };
}

//Get ScoredModels
function getScoredModelsAsync(payload) {
  return { type: GET_SCORED_MODELS_ASYNC, scoredModels: payload };
}

export function getScoredModels() {
  return dispatch => {
    axios
      .get("/score/scoredmodels", {
        headers: {
          Authorization: "Bearer " + Auth.getToken()
        }
      })
      .then(response => {
        const scoredModels = response.data.scoredModels;
        dispatch(getScoredModelsAsync(scoredModels));
      });
  };
}

export function setCanvasDimension(payload){
  return { type: SET_CANVAS_DIMENSION, dimension: payload };
}


export function setInnerModelDimension(payload){
  return { type: SET_INNER_MODEL_DIMENSION, dimension: payload };
}