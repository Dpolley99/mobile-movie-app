//fetchMovies
//fetchMovieDetails

import { useEffect, useState } from "react";

//useFetch(FetchMovies)

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);           // Indicate that the fetch operation has started
      setError(null);              // Reset any previous errors 

      const result = await fetchFunction();   // Call the provided fetch function

      setData(result);          // Store the fetched data in state
    } catch (err) {
      // @ts-ignore
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));      // Capture any errors that occur during the fetch
    } finally {
      setLoading(false);        // Indicate that the fetch operation has completed
    }
  }

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;