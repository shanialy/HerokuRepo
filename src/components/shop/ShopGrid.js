import PropTypes from "prop-types";
import { Fragment, useEffect, useState } from "react";
import { withSearchkit, withSearchkitRouting } from "@searchkit/client";
import { Container, Col, Row } from "react-bootstrap";
import { useSort, useFilter, useWindowSize } from "@hooks";
import withApollo from "../../hocs/withApollo";
import LoadMore from "@components/shop/elements/LoadMore";
import ShopOptions from "@components/shop/elements/ShopOptions";
import ShopFilters from "@components/shop/elements/ShopFilters";
import ShopProducts from "@components/shop/elements/ShopProducts";
import { gql, useQuery } from "@apollo/client";
import { useSearchkitVariables, useSearchkit } from "@searchkit/client";
import { useRouter } from "next/router";
import queryString from "query-string";
const gqlquery = gql`
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
const ShopGrid = ({
  // products,
  pageTitle,
  sidebar,
  sidebarPosition,
  containerFluid,
}) => {
  const [windowSize] = useWindowSize();
  const [productPerPage, setProductPerPage] = useState(containerFluid ? 12 : 8);
  const [layout, setLayout] = useState(
    sidebar ? "tt-col-three" : "tt-col-four"
  );
  // const { allProducts, filterPanelShow, filterPanelHandler, getFilterParam } =
  //   useFilter(products);
  // const { onSortHandler, sortProducts } = useSort(allProducts);

  const getLayout = (col) => {
    setLayout(col);
  };

  const onProductPerPageHandler = (e) => {
    const value = parseInt(e.target.value, 10);
    setProductPerPage(value);
  };

  // const onLoadMorHandler = async () => {
  //   const productShowPerPage = (prevValue) =>
  //     prevValue < allProducts.length
  //       ? allProducts.length - prevValue > 4
  //         ? (prevValue += 4)
  //         : (prevValue += allProducts.length - prevValue)
  //       : prevValue;
  //   setProductPerPage((prevState) => productShowPerPage(prevState));
  // };

  useEffect(() => {
    // Window Viewport specific product grid
    if (!sidebar) {
      if (!containerFluid) {
        (windowSize <= 499 && setLayout("tt-col-one")) ||
          (windowSize > 499 && windowSize <= 799 && setLayout("tt-col-two")) ||
          (windowSize > 800 &&
            windowSize <= 1024 &&
            setLayout("tt-col-three")) ||
          (windowSize >= 1025 && setLayout("tt-col-four"));
      } else {
        (windowSize <= 499 && setLayout("tt-col-one")) ||
          (windowSize > 499 && windowSize <= 799 && setLayout("tt-col-two")) ||
          (windowSize > 800 &&
            windowSize <= 1024 &&
            setLayout("tt-col-three")) ||
          (windowSize >= 1025 && setLayout("tt-col-six"));
      }
    }
    // } else {
    //   (windowSize <= 499 && setLayout("tt-col-one")) ||
    //     (windowSize > 499 && windowSize <= 799 && setLayout("tt-col-two")) ||
    //     (windowSize > 800 && setLayout("tt-col-three"));
    // }
  }, [windowSize]);
  const variables = useSearchkitVariables();
  const {
    previousData,
    data = previousData,
    loading,
  } = useQuery(gqlquery, {
    variables: variables,
  });
  const api = useSearchkit();
  const router = useRouter();
  const { vendor, gender, domain, productype, price } = router.query;
  useEffect(() => {
    if (api.canResetSearch()) {
      api.setQuery("");
      api.search();
    }
  }, []);
  useEffect(() => {
    const customState = {
      query: "",
      sortBy: "",
      filters: [],
      page: {
        size: 10,
        from: 0,
      },
    };

    if (vendor) {
      customState.filters.push({
        identifier: "vendor",
        value: vendor,
      });
    }

    if (gender) {
      customState.filters.push({
        identifier: "gender",
        value: gender,
      });
    }
    if (domain) {
      customState.filters.push({
        identifier: "domain",
        value: gender,
      });
    }
    if (productype) {
      customState.filters.push({
        identifier: "product_type",
        value: productype,
      });
    }
    if (price) {
      customState.sortBy = price;
    }

    api.setSearchState(customState);
    api.search();
  }, [vendor, gender, productype, domain, price]);

  return (
    <Fragment>
      {!loading ? (
        <div className="content-indent shop-no-sidebar">
          <Container
            fluid={containerFluid}
            className="container-fluid-custom-mobile-padding"
          >
            <Row
              className={
                sidebar && sidebarPosition === "right"
                  ? "flex-sm-row-reverse"
                  : ""
              }
            >
              <Col
                md={4}
                lg={3}
                // className={`leftColumn ${
                //   sidebar && sidebarPosition === "right" ? "rightColumn" : ""
                // } aside ${!sidebar ? "desktop-no-sidebar" : ""} ${
                //   filterPanelShow ? "column-open" : "column-close"
                // }`}
              >
                <ShopFilters
                  sidebar={sidebar}
                  // onSortHandler={onSortHandler}
                  // getFilterParam={getFilterParam}
                  productPerPage={productPerPage}
                  // filterPanelHandler={filterPanelHandler}
                  onProductPerPageHandler={onProductPerPageHandler}
                />
              </Col>

              <Col xs={12} lg={sidebar ? 9 : 12}>
                <div className="content-indent container-fluid-custom-mobile-padding-02">
                  <ShopOptions
                    layout={layout}
                    sidebar={sidebar}
                    pageTitle={pageTitle}
                    getLayout={getLayout}
                    // onSortHandler={onSortHandler}
                    productPerPage={productPerPage}
                    productLength={data?.results?.hits?.items.length}
                    // productLength={allProducts.length}
                    // filterPanelHandler={filterPanelHandler}
                    onProductPerPageHandler={onProductPerPageHandler}
                  />
                  <ShopProducts
                    layout={layout}
                    products={data?.results?.hits?.items}
                    productPerPage={10}
                  />

                  {/* <LoadMore
                className="mt-5"
                productPerPage={productPerPage}
                productLength={allProducts.length}
                onLoadMorHandler={onLoadMorHandler}
              /> */}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        <h1>Loading</h1>
      )}
    </Fragment>
  );
};

// ShopGrid.propTypes = {
//   products: PropTypes.array.isRequired,
// };
export default withApollo(withSearchkit(ShopGrid));
// export default ShopGrid;
