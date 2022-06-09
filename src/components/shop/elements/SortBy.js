import PropType from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
const SortBy = () => {
  const router = useRouter();
  function handleChange(e) {
    const price = e.target.value;
    router.push({
      pathname: "/shop/left-sidebar",
      query: { ...router.query, price },
    });
  }
  const removeprice = () => {
    delete router?.query?.price;
    router.push({
      pathname: "/shop/left-sidebar",
      query: router?.query,
    });
  };
  return (
    <>
      <select name="lang" id="lang" onChange={handleChange}>
        <option value="#"> </option>
        <option value="price">Price-Desc </option>
      </select>
      {router?.query?.price ? (
        <button
          onClick={removeprice}
          style={{
            marginLeft: "20px",
            fontSize: "10px",
            border: "none",
          }}
        >
          ❌
        </button>
      ) : null}
    </>
  );
};
// delete router.query.something;
// router.push(router);
// SortBy.propTypes = {
//   onSortHandler: PropType.func.isRequired,
// };

export default SortBy;
