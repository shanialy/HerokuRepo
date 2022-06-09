import { ApolloServer, gql } from "apollo-server-micro";
import cors from "micro-cors";

import {
  MultiMatchQuery,
  RefinementSelectFacet,
  RangeFacet,
  SearchkitSchema,
  DateRangeFacet,
  SearchkitResolver,
  GeoBoundingBoxFilter,
} from "@searchkit/schema";

const searchkitConfig = {
  host: process.env.ES_HOST || "http://43.251.253.107:2500",
  index: "pricechoice_v2",
  hits: {
    fields: [
      "gender",
      "title",
      "image",
      "vendor",
      "price",
      "price_before_sale",
      "is_on_sale",
      "domain",
      "product_type",
      "updatedAt",
    ],
  },
  sortOptions: [
    {
      id: "relevance",
      label: "Relevance",
      field: [{ _score: "desc" }],
      defaultOption: true,
    },
    {
      id: "updatedAt",
      label: "Date",
      field: { updatedAt: "desc" },
    },
    {
      id: "price",
      label: "Price",
      field: { price: "desc" },
    },
  ],
  query: new MultiMatchQuery({
    fields: ["title"],
  }),
  facets: [
    new RefinementSelectFacet({
      field: "gender",
      identifier: "gender",
      label: "gender",
    }),

    new RefinementSelectFacet({
      field: "vendor.keyword",
      identifier: "vendor",
      label: "vendor",
    }),

    new RefinementSelectFacet({
      field: "domain.keyword",
      identifier: "domain",
      label: "domain",
    }),

    new RefinementSelectFacet({
      field: "product_type",
      identifier: "product_type",
      label: "product_type",
    }),
    new DateRangeFacet({
      field: "updatedAt",
      identifier: "updatedAt",
      label: "Date",
    }),
  ],
};

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig,
  typeName: "ResultSet",
  hitTypeName: "ResultHit",
  addToQueryType: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const server = new ApolloServer({
  typeDefs: [
    gql`
      type Query {
        root: String
      }

      type Mutation {
        root: String
      }

      type ResultHit implements SKHit {
        id: ID!
        fields: HitFields
        customField: String
      }

      type HitFields {
        gender: String
        title: String
        image: String
        vendor: String
        price: String
        price_before_sale: String
        is_on_sale: Boolean
        domain: String
        product_type: String
        updatedAt: String
      }
    `,
    ...typeDefs,
  ],
  resolvers: withSearchkitResolvers({
    ResultHit: {
      customField: (parent) => `parent id ${parent.id}`,
    },
  }),
  introspection: true,
  playground: true,
  context: {
    ...context,
  },
});
const startServer = server.start();

export default async function handler(req, res) {
  await startServer;
  await server.createHandler({
    path: "/api/graphql",
  })(req, res);
}

// const handler = server.createHandler({ path: "/api/graphql" });

// export default cors()((req, res) =>
//   req.method === "OPTIONS" ? res.end() : handler(req, res)
// );
