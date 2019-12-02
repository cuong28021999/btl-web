import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Register from './views/Register'
import Profile from './views/Profile'
import Home from './views/Home'
import About from './views/About'
import ClassStudent from './views/classes/ClassStudent'
import ClassTeacher from './views/classes/ClassTeacher'
import InClassStudent from './views/classes/inClass/InClassStudent'
import InClassTeacher from './views/classes/inClass/InClassTeacher'
import InExamStudent from './views/classes/inClass/inExam/InExamStudent'
import InExamTeacher from './views/classes/inClass/inExam/InExamTeacher'


import verifyToken from './components/verifies/verifyToken'

import Cookies from 'js-cookie'


import Navbars from './components/Navbars/Navbars'
import { LoginProvider } from './contexts/Login'

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebaseApp.auth()

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
}

const Class = Cookies.get('permission') === 'teacher' ? ClassTeacher : ClassStudent
const InClass = Cookies.get('permission') === 'teacher' ? InClassTeacher : InClassStudent
const InExam = Cookies.get('permission') === 'teacher' ? InExamTeacher : InExamStudent

const HomeVerified = verifyToken(Home)
const AboutVerified = verifyToken(About)
const ClassVerified = verifyToken(Class)
const InClassVerified = verifyToken(InClass)
const InExamVerified = verifyToken(InExam)
const ProfileVerified = verifyToken(Profile)

function App() {
  return (
    <LoginProvider>
      <div className="App ">
        <Navbars />
        <Router>
          <Switch>
            <Route path="/about" exact>
              <AboutVerified />
            </Route>
            <Route path="/:userId/class" exact>
              <ClassVerified />
            </Route>
            <Route path="/:userId/class/:classId" exact>
              <InClassVerified />
            </Route>
            <Route path="/:userId/class/:classId/exam/:examId" exact>
              <InExamVerified />
            </Route>
            <Route path="/register" exact>
              <Register />
            </Route>
            <Route path="/:userId/profile" exact>
              <ProfileVerified />
            </Route>
            <Route path="/" exact>
              <HomeVerified />
            </Route>
          </Switch>
        </Router>
      </div>
    </LoginProvider>
  );
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App)
