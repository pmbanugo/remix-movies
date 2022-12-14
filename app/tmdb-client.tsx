export interface Movie {
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

export async function getPopular() {
  const response = await fetch(
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=061b5b5397826fffc37bcaad1cc6814f"
  );

  return response.json<{ results: Movie[] }>();
}

export async function getUpcoming() {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/upcoming?page=1&sort_by=popularity.desc&api_key=061b5b5397826fffc37bcaad1cc6814f"
  );

  return response.json<{ results: Movie[] }>();
}

export async function search(query: string, page: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&api_key=061b5b5397826fffc37bcaad1cc6814f`
  );

  return response.json<{
    results: Movie[];
    total_pages: number;
    page: number;
  }>();
}
