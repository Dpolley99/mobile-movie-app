import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link } from 'expo-router'
import { icons } from '@/constants/icons'
import { saveMovie, isMovieSaved } from '@/services/appwrite'
import { useAuth } from '@/context/AuthContext'

interface MovieCardProps extends Movie {
  onSaveChange?: () => void;
}

const MovieCard = ({ id, poster_path, title, vote_average, release_date, overview, backdrop_path, genre_ids, onSaveChange }: MovieCardProps) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      checkSavedStatus();
    }
  }, [id, isAuthenticated]);

  const checkSavedStatus = async () => {
    try {
      const isSaved = await isMovieSaved(id);
      setSaved(isSaved);
    } catch (error) {
      setSaved(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    try {
      const movie: Movie = {
        id,
        title,
        poster_path,
        overview: overview || '',
        release_date,
        vote_average,
        backdrop_path: backdrop_path || '',
        genre_ids: genre_ids || [],
        adult: false,
        original_language: 'en',
        original_title: title,
        popularity: 0,
        video: false,
        vote_count: 0,
      };
      
      const result = await saveMovie(movie);
      setSaved(result);
      
      // Notify parent component if callback is provided (for Saved tab)
      if (onSaveChange && !result) {
        // Only call callback when movie is unsaved (result is false)
        onSaveChange();
      }
    } catch (error) {
      console.error('Error saving movie:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        {isAuthenticated && (
          <TouchableOpacity
            onPress={handleSave}
            className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Image 
                source={icons.save} 
                className="w-5 h-5" 
                tintColor={saved ? "#FFD700" : "#fff"}
              />
            )}
          </TouchableOpacity>
        )}

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>

        <View className="flex-row items-center justify-start gap-x-1">
          <Image source={icons.star} className="size-4" />
          <Text className="text-xs text-white font-bold uppercase">{(vote_average / 2).toFixed(2)}</Text>
        </View>

        <View className='flex-row items-center justify-between'>
          <Text className="text-xs text-light-300 font-medium mt-1">{release_date?.split("-")[0]}</Text>
        </View>

      </TouchableOpacity>
    </Link>
  )
}

export default MovieCard