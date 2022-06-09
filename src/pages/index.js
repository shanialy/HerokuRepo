// import { getBlogPosts } from "@utils/blog";
import { Fragment, useContext } from "react";
import { getProductsBySkin } from "@utils/product";
import { withSearchkit, withSearchkitRouting } from "@searchkit/client";
import { ProductsContext } from "@global/ProductsContext";
import withApollo from "../hocs/withApollo";
import PageShopLeftSidebar from "./shop/left-sidebar";
import Index from "./home/twenty"
import React, { Suspense, lazy } from "react";
const Home = ({ blogs }) => {
  const { products } = useContext(ProductsContext);
  const productsFashion = getProductsBySkin(products, "fashion");
  const logo = "/assets/images/no-placeholder/logo.png";

  return (
    <Fragment>
      <Index/>
    </Fragment>
  );
};

// export async function getStaticProps() {
//   const blogs = getBlogPosts(
//     ["title", "excerpt", "date", "author", "thumb", "slug", "categories"],
//     3
//   );

//   return {
//     props: {
//       blogs: blogs,
//     },
//   };
// }

export default withApollo(withSearchkit(Home));
