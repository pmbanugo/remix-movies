import MovieCard from "~/components/MovieCard";
import { Root, Viewport, Scrollbar, Thumb } from "@radix-ui/react-scroll-area";

import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

interface Movie {
  id: number;
  adult: boolean;
  genre_ids: number[];
  overview: string;
  popularity: number;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  original_language: string;
  original_title: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export const loader = async () => {
  const popularPromise = fetch(
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=061b5b5397826fffc37bcaad1cc6814f"
  );
  const upcomingPromise = fetch(
    "https://api.themoviedb.org/3/movie/upcoming?page=1&sort_by=popularity.desc&api_key=061b5b5397826fffc37bcaad1cc6814f"
  );

  const response = await Promise.all([popularPromise, upcomingPromise]);
  const [popular, upcoming] = await Promise.all(
    response.map((x) => x.json<{ results: Movie[] }>())
  );

  return json({
    popular: popular.results,
    upcoming: upcoming.results,
  });
};

export default function Index() {
  const { popular, upcoming } = useLoaderData<typeof loader>();
  // console.log({ popular, upcoming });

  return (
    <div>
      <h1 className="text-center text-3xl font-bold underline">
        Welcome to your Movie World
      </h1>

      <div>
        <Category header="Most popular 🔥" movies={popular} />
      </div>
      <div className="mt-4">
        <Category header="Upcoming 👀" movies={upcoming} />
      </div>
    </div>
  );
}

function Category({ header, movies }: { header: string; movies: Movie[] }) {
  return (
    <>
      <h2 className="text:xl mb-3 font-bold lg:text-3xl">{header}</h2>
      <Root>
        <Viewport>
          <div className="flex pb-2 [&>*]:mr-2">
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
