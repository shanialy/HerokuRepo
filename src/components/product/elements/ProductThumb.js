import PropTypes from "prop-types";

const ProductThumb = ({ thumbs, productName, className }) => {
  return thumbs.map((thumb, i) => (
    <div
      key={i}
      className={`   tt-img${i === 1 ? "-roll-over" : " "} ${
        className ? className : ""
      }`}
    >
      <div className="flexthumbbg">
        {/* <img src={thumb} alt={productName} /> */}
        {/* <img  src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtK4IUEFkehvBjaAIhEepwFSlanUQrWpIshg&usqp=CAU"} alt={productName}/> */}
        <div
          style={{
            backgroundImage: `url(${thumb})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            width: "250px",
            height: "300px",
          }}
        ></div>
      </div>
    </div>
  ));
};

ProductThumb.propTypes = {
  thumbs: PropTypes.array.isRequired,
  productName: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ProductThumb;
