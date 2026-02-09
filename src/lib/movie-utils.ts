import type { Movie } from "@/api/tmdbApi";

// Fonction de base pour nettoyer et trier n'importe quel tableau de films
export const cleanAndSortMovies = (movies: Movie[]) => {
  const uniqueMovies = Array.from(
    new Map<number, Movie>(movies.map((m) => [m.id, m])).values()
  );

  return uniqueMovies.sort((a, b) => {
    const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
    const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
    return dateB - dateA;
  });
};

// Fonction spécifique pour les réalisateurs
export const formatDirectorCredits = (crew: any[]) => {
  const directedMovies = crew.filter((m) => m.job === "Director");
  return cleanAndSortMovies(directedMovies);
};

// Fonction spécifique pour les acteurs
export const formatActorCredits = (cast: any[]) => {
  return cleanAndSortMovies(cast);
};