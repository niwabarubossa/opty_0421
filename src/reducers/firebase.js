import { 
    FIREBASELOGIN,LOGINSTATUS,FIREBASELOGOUT,SUBMITTWEET,GET_TWEETS,GET_POSTS_REQUEST, GET_POSTS_SUCCESS,HANDLE_DRAWER_TOGGLE,HANDLE_DRAWER_TOGGLE_RESET, LOGIN_WITH_TWITTER, LOGIN_WITH_TWITTER_SUCCESS, GET_CURRENT_STATE,GET_USER_INFORMATION,GET_USER_INFORMATION_SUCCESS
 } from '../actions'
import firebase from 'firebase';
import { firestore } from '../plugins/firebase'
import 'firebase/firestore';

const initialState = {
    isFetching: false,
    items: [],
    mobileOpen: false,
    user: null
  }

export default ( state = [initialState] , action ) => {
    console.log(action)
    switch(action.type){
        case FIREBASELOGIN:
            console.log('----------------------firebase login action-----------------------')
            firebase.auth().signInAnonymously()
            return state
        case FIREBASELOGOUT:
            firebase.auth().signOut()
            .then(_ => {
                console.log('logout complete')
            }, err => {
            // エラーを表示する等
            });
            return state
        case LOGINSTATUS:
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                console.log('ログイン中')
                console.log(user)
                console.log(user.uid)
                } else {
                console.log('ログアウト中。')
                }
            });
            return state
        case SUBMITTWEET:
            console.log(state)
            firestore.collection('tweets').add({
                title: action.input.title,
                body: action.input.body,
                created_at: new Date(),
              }).then(() => {
              });
            return state 
        case GET_TWEETS:
            const temperature = []
            firestore.collection("tweets").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.data());
                    temperature.push(doc.data())
                });
            });
            return state
        case GET_POSTS_REQUEST:
            return [
              ...state,
              {
                isFetching: true,
                items: []
              }
            ]
        case GET_POSTS_SUCCESS:
            return Object.assign({}, state, {
                mobileOpen: state.mobileOpen,
                isFetching: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            })
        case HANDLE_DRAWER_TOGGLE:
            return Object.assign({}, state, {
                mobileOpen: !state.mobileOpen,
                isFetching: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            })
        case HANDLE_DRAWER_TOGGLE_RESET:
            return Object.assign({}, state, {
                mobileOpen: false,
                isFetching: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            })
        case LOGIN_WITH_TWITTER:
            return state
        case LOGIN_WITH_TWITTER_SUCCESS:
            return Object.assign({}, state, {
                user: action.user
            })
        case GET_CURRENT_STATE:
            console.log(state)
            return state     
        case GET_USER_INFORMATION:
            return state
        case GET_USER_INFORMATION_SUCCESS:
            return Object.assign({}, state, {
                user: action.user
            })
        default: 
            return state
    }
}