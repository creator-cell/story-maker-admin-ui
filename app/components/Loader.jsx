import Image from "next/image";
import LoaderImage from "../../public/images/loader.gif";
export default function Loader() {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-75"
      style={{ zIndex: 2050 }}
    >
      <Image src={LoaderImage} alt="loader" />
      {/* <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div> */}
    </div>
  );
}
