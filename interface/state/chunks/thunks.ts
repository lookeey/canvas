import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "chunkApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://api" }),
  endpoints: (builder) => ({
    getChunks: builder.query<string, string>({
      query: (name) => ``,
    }),
  }),
});
