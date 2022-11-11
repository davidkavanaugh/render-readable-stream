import Button from "./Button";
import Image from "./Image";
import { useState } from "react";
import fetch from "node-fetch";
import css from "./Card.module.css";
import Spinner from "./Spinner";

const Card = () => {
  const [imgSrcUrls, setImgSrcUrls] = useState([]);
  const [areImagesVisible, setAreImagesVisible] = useState(false);

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

  const renderImages = async (event) => {
    try {
      setImgSrcUrls([]);
      setAreImagesVisible(true);

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
      setImgSrcUrls([imgUrl]);
    } catch (err) {
      console.error("error rendering image", err);
    }
  };

  return (
    <div className={css.card}>
      <h1>Get Many Images</h1>
      <Button
        className={css.getImagesBtn}
        onClick={(event) => renderImages(event)}
      >
        Get Images
      </Button>
      {areImagesVisible && imgSrcUrls.length === 0 ? (
        <Spinner />
      ) : (
        imgSrcUrls.map((url, idx) => {
          return <Image src={url} key={idx} />;
        })
      )}
    </div>
  );
};

export default Card;
