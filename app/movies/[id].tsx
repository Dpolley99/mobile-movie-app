import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useFetch from '@/services/useFetch';
import { fetchMovieDetails } from '@/services/api';
import { icons } from '@/constants/icons';

interface MovieInfoProps {
  label: string;
  value: string | number | null | undefined;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-2'>
    <Text className='text-light-200 text-sm font-normal'>{label}</Text>
    <Text className='text-light-100 text-sm font-bold mt-2'>{value || 'N/A'}</Text>
  </View>
);

const MovieDetails = () => {
  const {id} = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500/${movie?.poster_path}.jpg` }}
            className='w-full h-[650px] resizeMode:stretch' />
        </View>

        <View className='flex-col items-start justify-center mt-5 px-5'>

          <Text className='text-white text-xl font-bold'>{movie?.title}</Text>

          <View className='flex-row items-center gap-x-1 mt-2'>

            <Text className='text-light-200 text-sm'>
              {movie?.release_date 
                ? new Date(movie.release_date).toLocaleDateString('en-UK', { month: 'short', year: 'numeric' })
                : 'N/A'
              }
            </Text>

            <Text className='text-light-200 text-sm'>
              {movie?.runtime} mins
            </Text>

          </View>

          <View className='flex-row items-center bg-dark-100 px-2 py-2 rounded-md gap-x-1 mt-2'>
            <Image 
              source={require('@/assets/icons/star.png')}
            />
            <Text className='text-white font-bold text-sm ml-2 mr-2'>
              {(  movie?.vote_average ?? 0).toFixed(2)}
            </Text>
            <Text className='text-light-200 text-sm'>
              {movie?.vote_count} votes
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo label="Genres" value={movie?.genres.map(genre => genre.name).join(' - ') || 'N/A'} />
          <View className='flex flex-row justify-between w-1/2'>
            <MovieInfo label="Budget" value={`$${(movie?.budget ?? 0) / 1000000} million`} />
            <MovieInfo label="Revenue" value={`$${Math.round((movie?.revenue ?? 0) / 1000000)} million`} />
          </View>
          <MovieInfo label="Production Companies" value={movie?.production_companies.map(company => company.name).join(' - ') || 'N/A'} />
        </View>
      </ScrollView>

      <TouchableOpacity 
        className='absolute bottom-5 left-20 right-20 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50'
        onPress={() => router.back()}
        >
        <Image source={icons.arrow} className='size-5 mr-1 mt-1 rotate-180' tintColor="#fff"/>
        <Text className='text-white font-semibold text-base mt-1' numberOfLines={1}>Go Back</Text>
      </TouchableOpacity>

    </View>
  )
}

export default MovieDetails