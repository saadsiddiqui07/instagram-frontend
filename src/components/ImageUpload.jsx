import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./ImageUpload.css";
import { storage, db } from "../firebase";
import firebase from "firebase";
import axios from "../axios.js";

function ImageUpload({ username }) {
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  // this fiunction will select the first picture which will be selected
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // THIS FUNCTION WILL HANDLE TO UPLOAD THE PICTURE
  const upload = (e) => {
    e.preventDefault();
    const uploadImage = storage.ref(`images/${image.name}`).put(image);
    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error.message);
        alert(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            axios.post("/upload", {
              user: username,
              image: url,
              caption: caption,
            });

            db.collection("posts").add({
              caption: caption,
              imageUrl: url,
              username,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div>
      {" "}
      <form className="imageupload">
        {" "}
        <LinearProgress
          className="imageupload__progress"
          variant="determinate"
          value={progress}
          onChange={handleChange}
        />{" "}
        <TextField
          type="file"
          onChange={handleChange}
          className="imageupload__input"
        />{" "}
        <TextField
          type="text"
          className="imageupload__input"
          placeholder="Enter caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />{" "}
        <Button
          className="imageupload__button"
          variant="contained"
          onClick={upload}
          type="submit"
          disabled={!image}
        >
          {" "}
          <PublishIcon className="imageupload__buttonIcon" /> Upload{" "}
        </Button>{" "}
      </form>{" "}
    </div>
  );
}
export default ImageUpload;
