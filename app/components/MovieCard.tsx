import type { Movie } from "~/tmdb-client";

type ImageWidth = "185" | "342" | "500" | "780";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export default function Index({
  movie,
  imageWidth,
}: {
  movie: Movie;
  imageWidth: ImageWidth;
}) {
  return (
    <figure className="mx-auto p-8 md:p-0">
      <img
        className="mx-auto rounded-xl shadow-md  shadow-slate-400 md:h-auto"
        // className="mx-auto rounded-xl shadow-md  shadow-slate-400 md:h-auto md:w-48"
        src={`${IMAGE_BASE_URL}/w${imageWidth}/${movie.poster_path}`}
        alt={movie.title}
      />
      <div className="p-1.5">
        <figcaption className="text-slate-900 dark:text-slate-700">
          <div className="text-sm font-bold">{movie.title}</div>
          <div className="text-xs font-thin">
            {new Date(movie.release_date).toDateString()}
          </div>
        </figcaption>
      </div>
    </figure>
  );
}
