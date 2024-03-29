import type { LoaderArgs } from "@remix-run/cloudflare";
import { Root, Viewport, Scrollbar, Thumb } from "@radix-ui/react-scroll-area";
import { defer } from "@remix-run/cloudflare";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { getMovie } from "~/tmdb-client";
import Category from "~/components/Category";
import Person from "~/components/Person";
import { IMAGE_BASE_URL } from "~/config";
import { Suspense } from "react";

export const loader = async ({ params }: LoaderArgs) => {
  //TODO: handle case of missing movie (i.e 404)
  const id = params.id;
  if (!id) throw new Error("ID is required");

  return defer(await getMovie(id));
};

export default function Index() {
  const {
    movie: {
      title,
      tagline,
      poster_path,
      backdrop_path,
      release_date,
      runtime,
      overview,
      genres,
    },
    cast,
    crew,
    similar,
  } = useLoaderData<typeof loader>();
  const director = crew.find((member) => member.job === "Director");

  return (
    <>
      <div
        className="bg-cover"
        style={{
          backgroundImage: `url(${IMAGE_BASE_URL}/original/${backdrop_path})`,
        }}
      >
        <div
          className="flex h-full w-full flex-col bg-gradient-to-b from-gray-900 to-transparent
    p-12 backdrop-blur-sm md:flex-row md:gap-12"
        >
          <img
            src={`${IMAGE_BASE_URL}/w342/${poster_path}`}
            alt={title}
            className="h-full w-56 rounded-md shadow-xl"
          />
          <div className="flex min-w-0 flex-col">
            <h1 className="text-6xl text-white">
              {title}
              <span className="opacity-80">
                ({new Date(release_date).getFullYear()})
              </span>
            </h1>
            <span className="before:marker text-white">
              {release_date} &#x2022;
              {genres.map((genre) => genre.name).join(", ")} &#x2022;
              {Math.floor(runtime / 60)}h {runtime % 60}m
            </span>
            <span className="mt-4 italic text-white opacity-80">{tagline}</span>
            <h2 className="mt-4 text-2xl font-medium text-white">Overview</h2>
            <p className="text-white">{overview}</p>
            <h2 className="mt-4 text-2xl font-medium text-white">
              Directed by
            </h2>
            <span>
              <Link
                to={`/person/${director?.id}`}
                className="text-white hover:underline"
              >
                {director?.name || "Unknown"}
              </Link>
            </span>
            <h2 className="mt-4 text-2xl font-medium text-white">Cast</h2>
            <Root>
              <Viewport>
                <div className="flex overflow-x-auto [&>*]:mr-4">
                  {cast.map((person) => (
                    <Person key={person.id} person={person} />
                  ))}
                  <Link
                    to="credits"
                    className="mx-3 w-20 shrink-0 self-center text-white
          hover:underline"
                  >
                    See crew &rarr;
                  </Link>
                </div>
              </Viewport>
              <Scrollbar className="bg-transparent" orientation="horizontal">
                <Thumb className="w-4 rounded-md bg-gray-300 p-1" />
              </Scrollbar>
            </Root>
          </div>
        </div>
      </div>

      <Suspense
        fallback={<p className="m-4 text-xl">Loading similar movies...</p>}
      >
        <Await
          resolve={similar}
          errorElement={<p>Error loading similar movies!</p>}
        >
          {(similar) => (
            <div className="p-12">
              <Category movies={similar} header={"More like this 🔥"} />
            </div>
          )}
        </Await>
      </Suspense>
    </>
  );
}
