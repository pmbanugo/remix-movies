import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { search } from "~/tmdb-client";
import MovieCard from "~/components/MovieCard";
import Search from "~/components/Search";

export const loader = async ({ params, request }: LoaderArgs) => {
  const query = params.query;
  if (!query) {
    return json({ movies: [], page: 0, totalPages: 0 });
  }

  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page");

  const { results, page, total_pages } = await search(
    query,
    currentPage ? Number(currentPage) : 1
  );
  return json({ movies: results, page, totalPages: total_pages });
};

const linkStyle =
  "mr-3 w-24 rounded-md bg-gray-800 px-3 py-2 text-center text-sm font-medium text-white";

export default function Index() {
  const { movies, totalPages, page } = useLoaderData<typeof loader>();
  const previousPage = page - 1;
  const nextPage = page + 1;
  const hasPrevious = previousPage > 0;
  const hasNext = nextPage < totalPages;

  return (
    <>
      <div className=" py-3 px-6">
        <p className=" text-xl font-semibold">Search</p>
        <Search />
      </div>

      <div className="grid grid-cols-4 px-6 [&>*]:mb-4 [&>*]:w-80">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} imageWidth={"342"} />
        ))}
      </div>
      <div className="flex items-center justify-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <Link
          to={`?page=${previousPage}`}
          prefetch={"render"}
          className={linkStyle + (hasPrevious ? "" : " pointer-events-none")}
        >
          Previous
        </Link>
        <Link
          to={`?page=${nextPage}`}
          prefetch={"render"}
          className={linkStyle + (hasNext ? "" : " pointer-events-none")}
        >
          Next
        </Link>
      </div>
    </>
  );
}
