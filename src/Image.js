import Spinner from "./Spinner";

const Image = ({ src }) =>
  src ? <img src={src} alt="user avatar" /> : <Spinner />;

export default Image;
