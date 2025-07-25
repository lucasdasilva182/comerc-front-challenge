import axios from 'axios';

const omdbClient = axios.create({
  baseURL: `https://www.omdbapi.com/?apikey=d9bb3531&`,
});

export interface OmdbMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface SearchResponde {
  Search: OmdbMovie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export const omdbService = {
  async searchMovies(
    search: string,
    year?: string,
    type?: string,
    page: number = 1
  ): Promise<SearchResponde> {
    try {
      const response = await omdbClient.get('', {
        params: {
          s: search,
          y: year,
          type: type,
          page: page.toString(),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error('Failed to fetch movies');
    }
  },
};
