import { Client, Databases, ID, Query, Account } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;


const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') //Appwrite Endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); //Project ID

const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async () : Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];

  } catch (error) {
    console.log(error);
    return undefined;
  }
}

// Authentication functions
export const createAccount = async (email: string, password: string, name?: string) => {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    return user;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error: any) {
    // Check if error is due to missing authentication (expected when not logged in)
    const errorMessage = error?.message || '';
    const errorCode = error?.code || error?.response?.code;
    
    // Expected errors when user is not authenticated - don't log these
    if (
      errorCode === 401 ||
      errorMessage.includes('missing scopes') ||
      errorMessage.includes('guests') ||
      errorMessage.includes('User (role: guests)')
    ) {
      return null; // Not authenticated - this is expected
    }
    
    // Log unexpected errors
    console.error("Error getting current user:", error);
    return null;
  }
};

// Saved movies functions
export const saveMovie = async (movie: Movie) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    // Check if movie is already saved
    const existing = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal("user_id", user.$id),
        Query.equal("movie_id", movie.id.toString()),
      ]
    );

    if (existing.documents.length > 0) {
      // Movie already saved, remove it (unsave)
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        existing.documents[0].$id
      );
      return false; // Indicates movie was unsaved
    } else {
      // Save the movie
      await database.createDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          movie_id: movie.id.toString(),
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        }
      );
      return true; // Indicates movie was saved
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

export const getSavedMovies = async (): Promise<Movie[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("user_id", user.$id)]
    );

    return result.documents.map((doc) => ({
      id: parseInt(doc.movie_id),
      title: doc.title,
      poster_path: doc.poster_path,
      release_date: doc.release_date,
      vote_average: doc.vote_average,
      // Required fields for Movie interface - set defaults for unused fields
      overview: '',
      backdrop_path: doc.poster_path || '',
      genre_ids: [],
      adult: false,
      original_language: "en",
      original_title: doc.title,
      popularity: 0,
      video: false,
      vote_count: 0,
    }));
  } catch (error) {
    console.error("Error getting saved movies:", error);
    return [];
  }
};

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal("user_id", user.$id),
        Query.equal("movie_id", movieId.toString()),
      ]
    );

    return result.documents.length > 0;
  } catch (error: any) {
    const errorMessage = error?.message || '';
    if (!errorMessage.includes('could not be found') && !errorMessage.includes('permission')) {
      console.error("Error checking if movie is saved:", error);
    }
    return false;
  }
};