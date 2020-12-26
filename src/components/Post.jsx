import React, { useState, useEffect } from "react";
import { Avatar, Button, Input } from "@material-ui/core";
import "./Post.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { db } from "../firebase";
import firebase from "firebase";

function Post({ caption, username, imageUrl, avatar, postId, user }) {
  const [comments, setComments] = useState(["This is awesome"]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    // performs a clean up action
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" src={avatar} />
        <h3>{username}</h3>
        <MoreVertIcon className="post__icon" />
      </div>
      <img className="post__image" src={imageUrl} alt="" />
      <div className="post__icons">
        <FavoriteBorderOutlinedIcon className="post__iconsButton" />
        <ChatBubbleOutlineRoundedIcon className="post__iconsButton" />
        <SendRoundedIcon className="post__iconsButton" />
      </div>
      <h4 className="post__caption">
        <strong>{username} </strong>
        {caption}
      </h4>
      {comments.length >= 1 ? (
        <p className="post__commentHeader">comments..</p>
      ) : (
        ""
      )}

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username} </strong>
            {comment.text}
          </p>
        ))}
      </div>
      <form className="post__commentBox">
        <Input
          className="post__commentInput"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter a comment..."
        />
        <Button
          className="post__commentButton"
          type="submit"
          disabled={!comment && !user}
          onClick={postComment}
          color="primary"
        >
          Post
        </Button>
      </form>
    </div>
  );
}

export default Post;
