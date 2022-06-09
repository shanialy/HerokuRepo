import Link from "next/link";
import { useRouter } from "next/router";
import { useFilter, useWindowSize } from "@hooks";
import { toCapitalize } from "@utils/toCapitalize";
import { Fragment, useContext, useState } from "react";
import SortBy from "@components/shop/elements/SortBy";
import { ProductsContext } from "@global/ProductsContext";
import ShopWidget from "@components/shop/elements/ShopWidget";
import { arrSortByCharacter, getClosest, range } from "@utils/method";
import ProductPerPage from "@components/shop/elements/ProductPerPage";
import {
  getProductsUniqueTags,
  getProductsUniquePrices,
  getProductsUniqueSizes,
  getProductsUniqueColors,
  getProductsUniqueVendor,
  getProductsUniqueCategories,
} from "@utils/product";
import { gql, useQuery } from "@apollo/client";
import { useSearchkitVariables, useSearchkit } from "@searchkit/client";
import { versionInfo } from "graphql";
const querygql = gql`
  query resultSet(
    $query: String
    $filters: [SKFiltersSet]
    $page: SKPageInput
    $sortBy: String
  ) {
    results(query: $query, filters: $filters) {
      summary {
        total
        appliedFilters {
          id
          identifier
          display
          label
          ... on DateRangeSelectedFilter {
            dateMin
            dateMax
            __typename
          }
          ... on ValueSelectedFilter {
            value
            __typename
          }
          __typename
        }
        sortOptions {
          id
          label
          __typename
        }
        query
        __typename
      }
      hits(page: $page, sortBy: $sortBy) {
        page {
          total
          totalPages
          pageNumber
          from
          size
          __typename
        }
        sortedBy
        items {
          ... on ResultHit {
            id
            fields {
              gender
              title
              image
              vendor
              price
              price_before_sale
              domain
              product_type
              is_on_sale
              updatedAt
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      facets {
        identifier
        type
        label
        display
        entries {
          label
          count
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

const ShopFilters = (props) => {
  const {
    sidebar,
    onSortHandler,
    getFilterParam,
    productPerPage,
    filterPanelHandler,
    onProductPerPageHandler,
  } = props;
  const router = useRouter();
  const { vendor, gender, domain, productype } = router.query;
  const {
    query: { slug },
  } = useRouter();
  const [windowSize] = useWindowSize();
  const variables = useSearchkitVariables();
  const {
    previousData,
    data = previousData,
    loading,
  } = useQuery(querygql, {
    variables: variables,
  });

  const [categoryLimit, setCategoryLimit] = useState(10);
  const [vendorLimit, setVendorLimit] = useState(10);
  const [priceLimit, setPriceLimit] = useState(10);
  const [selected, setSelected] = useState("");

  const filterByHandler = (e) => {
    e.preventDefault();
    const target = e.target;
    const closest = getClosest(target, "UL").childNodes;
    closest.forEach((elem) => {
      if (elem.classList.contains("active")) {
        elem.classList.remove("active");
        target.parentNode.classList.add("active");
      } else {
        target.parentNode.classList.add("active");
      }
    });
    getFilterParam(target.dataset.filtertype, target.dataset.filtervalue);
  };
  const handlegender = (gender) => {
    setSelected(gender);
    if (gender.length == 1 && gender) {
      delete router?.query?.gender;
      const newGender = {
        ...gender,
      };
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, gender },
        }}
      ></Link>;
    } else {
      const newGender = {
        ...gender,
        gender: gender,
      };
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, gender },
        }}
      ></Link>;
    }
  };
  const handleptype = (productype) => {
    setSelected(productype);
    if (productype.length == 1 && productype) {
      delete router?.query?.productype;
      const newproductype = {
        ...productype,
      };
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, productype },
        }}
      ></Link>;
    } else {
      const newproductype = {
        ...productype,
        productype: productype,
      };
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, productype },
        }}
      ></Link>;
    }
  };
  const handledomain = (domain) => {
    setSelected(domain);
    if (domain.length == 1 && domain) {
      delete router?.query?.domain;
      const newdomain = {
        ...domain,
      };
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, domain },
        }}
      ></Link>;
    } else {
      const newdomain = {
        ...domain,
        domain: domain,
      };
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, domain },
        }}
      ></Link>;
    }
  };
  const handlevendor = (vendor) => {
    setSelected(vendor);
    if (vendor.length == 1 && vendor) {
      delete router?.query?.vendor;
      const newvendor = {
        ...vendor,
      };
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, vendor },
        }}
      ></Link>;
    } else {
      const newvendor = {
        ...vendor,
        vendor: vendor,
      };
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, vendor },
        }}
      ></Link>;
    }
  };
  const removeGender = () => {
    delete router?.query?.gender;
    router.push({
      pathname: "/shop/left-sidebar",
      query: router?.query,
    });
  };
  const removePtype = () => {
    delete router?.query?.productype;
    router.push({
      pathname: "/shop/left-sidebar",
      query: router?.query,
    });
  };
  const removevendor = () => {
    delete router?.query?.vendor;
    router.push({
      pathname: "/shop/left-sidebar",
      query: router?.query,
    });
  };
  const removedomain = () => {
    delete router?.query?.domain;
    router.push({
      pathname: "/shop/left-sidebar",
      query: router?.query,
    });
  };

  return (
    <Fragment>
      {!sidebar && (
        <div className="tt-btn-col-close">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              filterPanelHandler();
            }}
          >
            Close
          </a>
        </div>
      )}

      {windowSize < 1025 && sidebar && (
        <Fragment>
          <div className="tt-btn-col-close">
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault();
                filterPanelHandler();
              }}
            >
              Close
            </a>
          </div>

          <ShopWidget>
            <div className="tt-filter-detach-option">
              <div className="filters-mobile">
                <div className="filters-row-select">
                  <SortBy />

                  <ProductPerPage
                    productPerPage={productPerPage}
                    onProductPerPageHandler={onProductPerPageHandler}
                  />
                </div>
              </div>
            </div>
          </ShopWidget>
        </Fragment>
      )}

      <ShopWidget title="GENDER">
        <ul className="tt-list-row">
          {data?.results?.facets?.map((item) => {
            if (item.identifier == "gender") {
              return item?.entries?.slice(0, categoryLimit).map((cat) => {
                let gender = cat?.label;

                return (
                  <li
                    onClick={() => handlegender(gender)}
                    key={gender}
                    className={gender === slug ? "active" : ""}
                  >
                    <Link
                      href={{
                        pathname: router.pathname,
                        query: { ...router.query, gender },
                      }}
                    >
                      {toCapitalize(gender.replace(/-/g, " "))}
                      {/* <button onClick={removeGender}>Remove</button> */}
                    </Link>
                    {router?.query?.gender ? (
                      <button
                        onClick={removeGender}
                        style={{
                          marginLeft: "20px",
                          fontSize: "10px",
                          border: "none",
                        }}
                      >
                        ❌
                      </button>
                    ) : null}
                  </li>
                );
              });
            }
          })}
        </ul>
        {/* {categories.length > categoryLimit && (
          <button
            className="btn-link-02"
            // onClick={() => setCategoryLimit((prevState) => prevState + 5)}
          >
            + More
          </button>
        )} */}
      </ShopWidget>

      <ShopWidget title="PRODUCT TYPE">
        <ul className="tt-list-row">
          {data?.results?.facets?.map((item) => {
            if (item.identifier == "product_type") {
              return item?.entries?.slice(0, categoryLimit).map((ptype) => {
                let productype = ptype?.label;
                return (
                  <li
                    onClick={() => handleptype(productype)}
                    key={productype}
                    className={productype === slug ? "active" : ""}
                  >
                    {/* <Link href={`/product/category/${product}`}>
                      {toCapitalize(product.replace(/-/g, " "))}
                    </Link> */}
                    <Link
                      href={{
                        pathname: router.pathname,
                        query: { ...router.query, productype },
                      }}
                      passHref
                      shallow
                      replace
                    >
                      {toCapitalize(productype.replace(/-/g, " "))}
                    </Link>
                    {router?.query?.productype ? (
                      <button
                        onClick={removePtype}
                        style={{
                          marginLeft: "20px",
                          fontSize: "10px",
                          border: "none",
                        }}
                      >
                        ❌
                      </button>
                    ) : null}
                  </li>
                );
              });
            }
          })}
        </ul>

        {/* {priceRange.length > priceLimit && (
          <button
            className="btn-link-02"
            // onClick={() => setPriceLimit((prevState) => prevState + 3)}
          >
            + More
          </button>
        )} */}
      </ShopWidget>

      <ShopWidget title="VENDOR">
        <ul className="tt-list-row">
          {data?.results?.facets?.map((item) => {
            if (item.identifier == "vendor") {
              return item?.entries?.slice(0, categoryLimit).map((venitem) => {
                let vendor = venitem?.label;

                return (
                  <li
                    onClick={() => handlevendor(vendor)}
                    key={vendor}
                    className={vendor === slug ? "active" : ""}
                  >
                    <Link
                      href={{
                        pathname: router.pathname,
                        query: { ...router.query, vendor },
                      }}
                      passHref
                      shallow
                      replace
                    >
                      {toCapitalize(vendor.replace(/-/g, " "))}
                    </Link>
                    {router?.query?.vendor ? (
                      <button
                        onClick={removevendor}
                        style={{
                          marginLeft: "20px",
                          fontSize: "10px",
                          border: "none",
                        }}
                      >
                        ❌
                      </button>
                    ) : null}
                  </li>
                );
              });
            }
          })}
        </ul>
        {/* {vendors.length > vendorLimit && (
          <button
            className="btn-link-02"
            // onClick={() => setVendorLimit((prevState) => prevState + 5)}
          >
            + More
          </button>
        )} */}
      </ShopWidget>
      <ShopWidget title="Domain">
        <ul className="tt-list-row">
          {data?.results?.facets?.map((item) => {
            if (item.identifier == "domain") {
              return item?.entries
                ?.slice(0, categoryLimit)
                .map((domainitem) => {
                  let domain = domainitem?.label;
                  return (
                    <li
                      onClick={() => handledomain(domain)}
                      key={domain}
                      className={domain === slug ? "active" : ""}
                    >
                      <Link
                        href={{
                          pathname: router.pathname,
                          query: { ...router.query, domain },
                        }}
                        passHref
                        shallow
                        replace
                      >
                        {toCapitalize(domain.replace(/-/g, " "))}
                      </Link>
                      {router?.query?.domain ? (
                        <button
                          onClick={removedomain}
                          style={{
                            marginLeft: "20px",
                            fontSize: "10px",
                            border: "none",
                          }}
                        >
                          ❌
                        </button>
                      ) : null}
                    </li>
                  );
                  // return (
                  //   <li key={domainitem.toLowerCase()}>
                  //     <a
                  //       href="/"
                  //       data-filtertype="vendor"
                  //       data-filtervalue={domainitem}
                  //       // onClick={(event) => filterByHandler(event)}
                  //     >
                  //       {domainitem}
                  //     </a>
                  //   </li>
                  // );
                });
            }
          })}
        </ul>
        {/* {vendors.length > vendorLimit && (
          <button
            className="btn-link-02"
            // onClick={() => setVendorLimit((prevState) => prevState + 5)}
          >
            + More
          </button>
        )} */}
      </ShopWidget>
    </Fragment>
  );
};

export default ShopFilters;
