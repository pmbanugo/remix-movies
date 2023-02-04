import MovieCard from "~/components/MovieCard";
import { Root, Viewport, Scrollbar, Thumb } from "@radix-ui/react-scroll-area";
import { defer } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import type { Movie } from "../tmdb-client";
import { getPopular, getUpcoming } from "../tmdb-client";
import { Suspense } from "react";

export const loader = async () => {
  // const [popular, upcoming] = [getPopular(),];

  return defer({
    popular: await getPopular(),
    upcoming: new Promise<{ results: Movie[] }>((resolve, reject) => {
      setTimeout(async () => {
        resolve(await getUpcoming());
      }, 2000);
    }),
  });
};

export default function Index() {
  const { popular, upcoming } = useLoaderData<typeof loader>();

  return (
    <main>
      <Suspense fallback={<p>Loading popular...</p>}>
        <Await
          resolve={popular}
          errorElement={<p>Error loading popular upcoming!</p>}
        >
          {(popular) => (
            <div>
              <Category header="Most popular 🔥" movies={popular.results} />
            </div>
          )}
        </Await>
      </Suspense>
      <Suspense fallback={<p>Loading upcoming...</p>}>
        <Await
          resolve={upcoming}
          errorElement={<p>Error loading upcoming movies!</p>}
        >
          {(upcoming) => (
            <div>
              <Category header="Upcoming" movies={upcoming.results} />
            </div>
          )}
        </Await>
      </Suspense>
    </main>
  );
}

function Category({ header, movies }: { header: string; movies: Movie[] }) {
  return (
    <>
      <h2 className="text:xl mb-3 font-bold lg:text-3xl">{header}</h2>
      <Root>
        <Viewport>
          <div className="flex pb-2 [&>*]:mr-2 [&>*]:w-48">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} imageWidth="185" />
            ))}
          </div>
        </Viewport>
        <Scrollbar className="bg-transparent" orientation="horizontal">
          <Thumb className="w-4 rounded-md bg-gray-300 p-1" />
        </Scrollbar>
      </Root>
    </>
  );
}
