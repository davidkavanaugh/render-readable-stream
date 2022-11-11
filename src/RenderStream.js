import Button from "./Button";
import Image from "./Image";
import { useState } from "react";
import fetch from "node-fetch";
import css from "./RenderStream.module.css";

const RenderStream = () => {
  const [imgSrc, setImgSrc] = useState(null);
  const [isImgVisible, setIsImgVisible] = useState(false);

  const getImageStream = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_GET_USER_PIC_ENDPOINT,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
          },
        }
      );
      return response.body;
    } catch (err) {
      console.error("error fetching user avatar from api");
      throw err;
    }
  };

  const renderImage = async (event) => {
    try {
      setImgSrc(null);
      setIsImgVisible(true);

      // fetch from api
      const response = await getImageStream();

      // get readable stream from response body
      const reader = response.getReader();
      const stream = new ReadableStream({
        start(controller) {
          (async function pump() {
            const chunk = await reader.read();
            if (chunk.done) {
              controller.close();
              return;
            }
            controller.enqueue(chunk.value);
            return pump();
          })();
        },
      });

      // create a new response out of the stream
      const streamedResponse = new Response(stream);

      // create a blob (binary large object) from the response
      const blob = await streamedResponse.blob();

      // create url from the blob
      const imgUrl = URL.createObjectURL(blob);

      // set image url src
      setImgSrc(imgUrl);
    } catch (err) {
      console.error("error rendering image", err);
    }
  };

  return (
    <div className={css.userProfile}>
      <h1>Render Stream with node Fetch</h1>
      <Button className={css.getImgBtn} onClick={(event) => renderImage(event)}>
        Get Image
      </Button>
      {isImgVisible ? <Image src={imgSrc} /> : null}
    </div>
  );
};

export default RenderStream;
