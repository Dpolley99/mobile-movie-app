import { images } from '@/constants/images';
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const TrendingCard = ({ movie, index }: { movie: TrendingMovie; index: number }) => {
  return (
    <Link href={`/movie/${movie.id}` as any} asChild>
      <TouchableOpacity className='w-32 relative pl-5'>
        <Image 
          source={{ uri: movie.poster_url }}
          className='w-32 h-48 rounded-lg'
          resizeMode='cover'
        />

        <View className='absolute bottom-2 -left-3.5 px-2 py-1 rounded-full'>
          <MaskedView
            maskElement={
              <Text className='font-bold text-white text-6xl'>{index + 1}</Text>
            }>
              <Image 
                source={images.rankingGradient}
                className='size-14'
                resizeMode='cover'
              />
          </MaskedView>
        </View>

        <Text className="text-white font-bold text-xs mt-2" numberOfLines={2}>
          {movie.title}
        </Text>
      </TouchableOpacity>
    </Link>
  )
}

export default TrendingCard