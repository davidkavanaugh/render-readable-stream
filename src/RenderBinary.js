import Button from "./Button";
import Image from "./Image";
import { useState } from "react";
import css from "./RenderStream.module.css";

const RenderBinary = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const [isImgVisible, setIsImgVisible] = useState(false);

  const renderImage = () => {
    setIsImgVisible(true);
    setImgSrc(null);
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function (event) {
      fileToDataUrl(event.target.response, function (result) {
        console.log(result);
        setImgSrc(result);
      });
    };
    xhr.open("GET", process.env.REACT_APP_GET_USER_PIC_ENDPOINT, true);
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${process.env.REACT_APP_TOKEN}`
    );
    xhr.send();

    function fileToDataUrl(fileObj, callback) {
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          console.log("result");
          callback(reader.result);
        },
        false
      );
      reader.readAsDataURL(fileObj);
    }
  };

  return (
    <div className={css.userProfile}>
      <h1>Render Binary with XMLHttpRequest</h1>
      <Button className={css.getImgBtn} onClick={(event) => renderImage(event)}>
        Get Image
      </Button>
      {isImgVisible ? <Image src={imgSrc} /> : null}
    </div>
  );
};

export default RenderBinary;
