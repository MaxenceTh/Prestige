import axios from "axios";



// Interface basée sur le JSON que vous avez envoyé
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  original_language: string;
  popularity: number;
  genre_ids: number[];
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  dates: {
    maximum: string;
    minimum: string;
  };
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`
  }
});

const apitmdb = {
  getUpcomingMovies: async (page: number = 1): Promise<TMDBResponse> => {
    try {
      const response = await tmdbClient.get<TMDBResponse>("/movie/upcoming", {
        params: { language: 'fr-FR', page: page }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur TMDB:", error);
      throw error;
    }
  },

  getDiscoverMovies: async (page: number = 1): Promise<TMDBResponse> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const nextSixMonths = new Date();
      nextSixMonths.setMonth(nextSixMonths.getMonth() + 6);
      const endDate = nextSixMonths.toISOString().split('T')[0];

      const response = await tmdbClient.get<TMDBResponse>("/discover/movie", {
        params: {
          language: 'fr-FR',
          page: page,
          region: 'FR',
          "primary_release_date.gte": today,
          "primary_release_date.lte": endDate, // On évite les films prévus en 2028
          sort_by: "popularity.desc",
          "vote_count.gte": 2,
          // Optionnel : On s'assure que le film sort bien au cinéma (type 3)
          "with_release_type": "3|2"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur TMDB:", error);
      throw error;
    }
  },

  getImageUrl: (path: string | null, size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "h632" | "original" = "w500") => {
    if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  getNowPlayingMovies: async (page: number = 1): Promise<TMDBResponse> => {
    try {
      const response = await tmdbClient.get<TMDBResponse>("/movie/now_playing", {
        // params: { language: 'en-US', page: page }
        params: { language: 'fr-FR', page: page }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur TMDB:", error);
      throw error;
    }
  },

  getPopularMovies: async (page: number = 1): Promise<TMDBResponse> => {
    try {
      const response = await tmdbClient.get<TMDBResponse>("/movie/popular", {
        params: { language: 'fr-FR', page: page }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur TMDB:", error);
      throw error;
    }
  },

  getTopRatedMovies: async (page: number = 1): Promise<TMDBResponse> => {
    try {
      const response = await tmdbClient.get<TMDBResponse>("/movie/top_rated", { // Changement ici
        params: { language: 'fr-FR', page: page }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur TMDB:", error);
      throw error;
    }
  },

  getMovieVideos: async (movieId: number) => {
    try {
      const response = await tmdbClient.get(`/movie/${movieId}/videos`, {
        params: { language: 'en-US' } // Les trailers sont souvent mieux indexés en anglais
      });
      console.log("Vidéos reçues:", response.data.results);
      return response.data.results;
    } catch (error) {
      console.error("Erreur vidéos:", error);
      return [];
    }
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    try {
      const response = await tmdbClient.get("/search/movie", {
        params: {
          query: query,
          language: 'fr-FR',
          include_adult: false
        }
      });
      return response.data.results;
    } catch (error) {
      console.error("Erreur recherche:", error);
      return [];
    }
  },

  getMovieDetails: async (id: number) => {
    const response = await tmdbClient.get(`/movie/${id}`, {
      params: { language: 'fr-FR', append_to_response: 'credits' }
    });
    return response.data;
  },

  getRecommendations: async (movieId: number): Promise<TMDBResponse> => {
    const response = await tmdbClient.get(`/movie/${movieId}/recommendations`, {
      params: { language: 'fr-FR' }
    });
    return response.data;
  },

  getWatchProviders: async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/watch/providers`);
    // On retourne les résultats pour la France (FR)
    return response.data.results?.FR || null;
  },

  getPersonDetails: async (personId: number) => {
    const response = await tmdbClient.get(`/person/${personId}`, {
      params: { language: 'fr-FR', append_to_response: 'movie_credits' }
    });
    return response.data;
  },

  /**
 * Récupère les films filtrés par plateforme (Provider)
 * @param providerId - L'ID de la plateforme (Netflix: 8, Disney+: 337, etc.)
 * @param page - Le numéro de la page pour la pagination
 * @genreId - (Optionnel) L'ID du genre pour filtrer davantage
 */
  getMoviesByProvider: async (providerId: number, page: number = 1, genreId?: number | null) => {
    try {
      const response = await tmdbClient.get("/discover/movie", {
        params: {
          language: "fr-FR",
          watch_region: "FR",           // Filtre pour le catalogue français
          with_watch_providers: providerId,
          sort_by: "popularity.desc",   // vote_average.desc popularity.desc
          page: page,
          // Optionnel : Force l'affichage des films dispos en streaming 
          // (évite la location/achat VOD si tu veux du pur streaming)
          with_watch_monetization_types: "flatrate",
          with_genres: genreId || undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération par provider:", error);
      throw error;
    }
  },

  getAllMovies: async (page: number = 1, genreId?: string, sortBy: string = "popularity.desc"): Promise<TMDBResponse> => {
    try {
      const response = await tmdbClient.get<TMDBResponse>("/discover/movie", {
        params: {
          language: 'fr-FR',
          page: page,
          sort_by: sortBy,
          with_genres: genreId, // Si undefined, TMDB ignore le filtre
          "vote_count.gte": 100, // Filtre de qualité "Prestige"
          include_adult: false,
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur Catalogue:", error);
      throw error;
    }
  },

  getGenres: async (): Promise<Genre[]> => {
    try {
      const response = await tmdbClient.get("/genre/movie/list", {
        params: { language: 'fr-FR' }
      });
      return response.data.genres;
    } catch (error) {
      console.error("Erreur Genres:", error);
      return [];
    }
  },

  searchDirector: async (query: string): Promise<any[]> => {
    try {
      const response = await tmdbClient.get("/search/person", {
        params: {
          query: query,
          language: 'fr-FR',
          include_adult: false
        }
      });
      return response.data.results.filter((p: any) => p.known_for_department === "Directing");
    } catch (error) {
      console.error("Erreur recherche personne:", error);
      return [];
    }
  },

  searchActor: async (query: string): Promise<any[]> => {
    try {
      const response = await tmdbClient.get("/search/person", {
        params: {
          query: query,
          language: 'fr-FR',
          include_adult: false
        }
      });
      return response.data.results.filter((p: any) => p.known_for_department === "Acting");
    } catch (error) {
      console.error("Erreur recherche personne:", error);
      return [];
    }
  },

};


export default apitmdb;