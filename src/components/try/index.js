import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { useSearchkitVariables } from "@searchkit/client";

import { useEffect } from "react";
import PageShopLeftSidebar from "src/pages/shop/left-sidebar";

const query = gql`
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

const Page = () => {
  const variables = useSearchkitVariables();
  const {
    previousData,
    data = previousData,
    loading,
  } = useQuery(query, {
    variables: variables,
  });
  // console.log(data)
  // let arrr = [];
  // data?.results?.hits?.items?.map((item) => {
  //   //   console.log("16", item);
  //   let news = item?.fields;
  //   arrr = [...arrr, { news }];
  // });
  // console.log(arrr);

  return <></>;
};

export default Page;
