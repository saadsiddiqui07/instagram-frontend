import React, { useState, useEffect } from "react";
import "./App.css";
import { Button, makeStyles, Modal, Input } from "@material-ui/core";
import Post from "./components/Post";
import { db, auth } from "./firebase";
import CameraAltOutlinedIcon from "@material-ui/icons/CameraAltOutlined";
import ImageUpload from "./components/ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        setPosts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data()
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out....
        setUser(null);
      }
    });
    return () => {
      // clean up actions
      unsubscribe();
    };
  }, [user, username]); // dependencies

  // FUNCTION FOR CREATING A NEW USER
  const signUp = e => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch(err => alert(err.message));
    setOpenSignup(false);
  };

  // FUNCTION FOER LOGGING IN
  const login = e => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => alert(err.message));
    setOpenLogin(false);
  };

  console.log(user);

  return (
    <div className="app">
      {/* SIGNUP  */}
      <Modal open={openSignup} onClose={() => setOpenSignup(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <img
              className="app__headerImage"
              alt=""
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/120px-Instagram_logo.svg.png"
            />
            <center className="app__signUpCenter">
              <Input
                className="app__signUpCenterInput"
                placeholder="Enter username..."
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Input
                className="app__signUpCenterInput"
                placeholder="Enter email..."
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                className="app__signUpCenterInput"
                placeholder="Enter password..."
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </center>
            <Button
              className="app__signUpButton"
              type="submit"
              onClick={signUp}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      {/* LOGIN */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <img
              className="app__headerImage"
              alt=""
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/120px-Instagram_logo.svg.png"
            />
            <center className="app__signUpCenter">
              <Input
                className="app__signUpCenterInput"
                placeholder="Enter email..."
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                className="app__signUpCenterInput"
                placeholder="Enter password..."
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </center>
            <Button className="app__LoginButton" type="submit" onClick={login}>
              Login
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <div className="app__headerLeft">
          <CameraAltOutlinedIcon className="app__headerLeftIcon" />
          <img
            className="app__headerImage"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/120px-Instagram_logo.svg.png"
            alt=""
          />
        </div>
        <div className="app__headerButtons">
          {user ? (
            <Button
              className="appheader__logoutButton"
              variant="contained"
              onClick={() => auth.signOut()}
            >
              Logout
            </Button>
          ) : (
            <div>
              <Button
                variant="contained"
                className="appheader__btn1"
                onClick={() => setOpenSignup(true)}
              >
                Sign Up
              </Button>
              <Button
                variant="contained"
                className="appheader__btn2"
                onClick={() => setOpenLogin(true)}
              >
                Log In
              </Button>
            </div>
          )}
        </div>
      </div>

      {posts.map(({ id, post }) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
          avatar={post.avatar}
        />
      ))}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Please login or sign up to upload</h3>
      )}
    </div>
  );
}

export default App;
