/**
 * AnimeVerse API Integration
 * This file handles the integration with the Jikan API (Unofficial MyAnimeList API)
 * for retrieving anime data, as well as Firebase for blog content and user features.
 */

// Type definitions for API responses
interface JikanResponse<T> {
    data: T;
    pagination?: {
      last_visible_page: number;
      has_next_page: boolean;
      current_page: number;
      items: {
        count: number;
        total: number;
        per_page: number;
      };
    };
  }
  
  interface AnimeData {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    synopsis: string;
    score: number;
    year: number;
    season: string;
    episodes: number;
    status: string;
    duration: string;
    rating: string;
    genres: { mal_id: number; name: string; type: string }[];
    studios: { mal_id: number; name: string; type: string }[];
  }
  
  interface CharacterData {
    character: {
      mal_id: number;
      name: string;
      images: {
        jpg: { image_url: string };
        webp: { image_url: string };
      };
    };
    role: string;
    voice_actors: {
      person: {
        mal_id: number;
        name: string;
        images: { jpg: { image_url: string } };
      };
      language: string;
    }[];
  }
  
  // Base Jikan API URL
  const JIKAN_API_BASE = 'https://api.jikan.moe/v4';
  
  // Helper function to handle API rate limiting
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  /**
   * Generic fetch function with rate limiting and error handling
   */
  async function fetchJikan<T>(endpoint: string, params: Record<string, string> = {}): Promise<JikanResponse<T>> {
    // Convert params object to URL search params
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const url = `${JIKAN_API_BASE}${endpoint}${queryString}`;
    
    try {
      const response = await fetch(url);
      
      // Handle rate limiting (Jikan API has a limit of 3 requests per second)
      if (response.status === 429) {
        console.log('Rate limited by Jikan API, retrying after delay...');
        await delay(1000);
        return fetchJikan<T>(endpoint, params);
      }
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return data as JikanResponse<T>;
    } catch (error) {
      console.error('Error fetching from Jikan API:', error);
      throw error;
    }
  }
  
  /**
   * Fetch trending anime (top anime for the current season)
   */
  export async function fetchTrendingAnime() {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      
      // Determine current season based on month
      const month = currentDate.getMonth();
      let season: string;
      
      if (month >= 0 && month <= 2) season = 'winter';
      else if (month >= 3 && month <= 5) season = 'spring';
      else if (month >= 6 && month <= 8) season = 'summer';
      else season = 'fall';
      
      const response = await fetchJikan<AnimeData[]>('/seasons/now');
      
      return response.data.map(anime => ({
        id: anime.mal_id,
        title: anime.title,
        image: anime.images.jpg.large_image_url,
        rating: anime.score || 0,
        genres: anime.genres.map(genre => genre.name),
        episodes: anime.episodes,
        studio: anime.studios.length > 0 ? anime.studios[0].name : 'Unknown',
        year: anime.year || currentYear,
        status: anime.status
      }));
    } catch (error) {
      console.error('Error fetching trending anime:', error);
      // Return empty array in case of error
      return [];
    }
  }
  
  /**
   * Fetch anime by ID
   */
  export async function fetchAnimeById(id: number) {
    try {
      const animeResponse = await fetchJikan<AnimeData>(`/anime/${id}/full`);
      const anime = animeResponse.data;
      
      // Fetch characters separately
      const charactersResponse = await fetchJikan<CharacterData[]>(`/anime/${id}/characters`);
      
      return {
        id: anime.mal_id,
        title: anime.title,
        image: anime.images.jpg.large_image_url,
        synopsis: anime.synopsis,
        rating: anime.score || 0,
        aired: {
          from: anime.season ? `${anime.year}-${getSeasonMonth(anime.season)}` : undefined,
          to: anime.status === 'Finished Airing' ? undefined : 'Present'
        },
        season: anime.season ? `${capitalizeFirstLetter(anime.season)} ${anime.year}` : undefined,
        type: anime.rating,
        status: anime.status,
        episodes: anime.episodes,
        duration: anime.duration,
        genres: anime.genres.map(genre => genre.name),
        studios: anime.studios.map(studio => studio.name),
        characters: charactersResponse.data.slice(0, 8).map(char => ({
          id: char.character.mal_id,
          name: char.character.name,
          image: char.character.images.jpg.image_url,
          role: char.role,
          voiceActor: char.voice_actors.find(va => va.language === 'Japanese')?.person.name || ''
        }))
      };
    } catch (error) {
      console.error(`Error fetching anime with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch anime by genre
   */
  export async function fetchAnimeByGenre(genreId: number, page: number = 1) {
    try {
      const response = await fetchJikan<AnimeData[]>('/anime', {
        genres: genreId.toString(),
        page: page.toString(),
        limit: '24',
        order_by: 'score',
        sort: 'desc'
      });
      
      return {
        anime: response.data.map(anime => ({
          id: anime.mal_id,
          title: anime.title,
          image: anime.images.jpg.large_image_url,
          rating: anime.score || 0,
          genres: anime.genres.map(genre => genre.name),
          episodes: anime.episodes,
          studio: anime.studios.length > 0 ? anime.studios[0].name : 'Unknown',
          year: anime.year,
          status: anime.status
        })),
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching anime for genre ${genreId}:`, error);
      return { anime: [], pagination: undefined };
    }
  }
  
  /**
   * Fetch anime by season
   */
  export async function fetchAnimeBySeason(year: number, season: string, page: number = 1) {
    try {
      const response = await fetchJikan<AnimeData[]>(`/seasons/${year}/${season.toLowerCase()}`, {
        page: page.toString(),
        limit: '24'
      });
      
      return {
        anime: response.data.map(anime => ({
          id: anime.mal_id,
          title: anime.title,
          image: anime.images.jpg.large_image_url,
          rating: anime.score || 0,
          genres: anime.genres.map(genre => genre.name),
          episodes: anime.episodes,
          studio: anime.studios.length > 0 ? anime.studios[0].name : 'Unknown',
          year: anime.year || year,
          status: anime.status
        })),
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error fetching anime for ${season} ${year}:`, error);
      return { anime: [], pagination: undefined };
    }
  }
  
  /**
   * Search anime
   */
  export async function searchAnime(query: string, page: number = 1) {
    try {
      const response = await fetchJikan<AnimeData[]>('/anime', {
        q: query,
        page: page.toString(),
        limit: '24'
      });
      
      return {
        anime: response.data.map(anime => ({
          id: anime.mal_id,
          title: anime.title,
          image: anime.images.jpg.large_image_url,
          rating: anime.score || 0,
          genres: anime.genres.map(genre => genre.name),
          episodes: anime.episodes,
          studio: anime.studios.length > 0 ? anime.studios[0].name : 'Unknown',
          year: anime.year,
          status: anime.status
        })),
        pagination: response.pagination
      };
    } catch (error) {
      console.error(`Error searching anime with query "${query}":`, error);
      return { anime: [], pagination: undefined };
    }
  }
  
  /**
   * Helper functions
   */
  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function getSeasonMonth(season: string): string {
    switch (season.toLowerCase()) {
      case 'winter': return '01';
      case 'spring': return '04';
      case 'summer': return '07';
      case 'fall': return '10';
      default: return '01';
    }
  }
  
  /**
   * Firebase integration (mock for now)
   * In a real implementation, you would use the Firebase SDK here
   */
  export async function fetchBlogPosts(category?: string, page: number = 1) {
    // Mock implementation - would be replaced with actual Firebase calls
    return [];
  }
  
  export async function fetchBlogPostBySlug(slug: string) {
    // Mock implementation - would be replaced with actual Firebase calls
    return null;
  }
  
  export async function fetchBlogCategories() {
    // Mock implementation - would be replaced with actual Firebase calls
    return [];
  }
  
  export async function fetchBlogAuthors() {
    // Mock implementation - would be replaced with actual Firebase calls
    return [];
  }