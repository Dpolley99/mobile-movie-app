import { View, Image, Text, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

interface Props {
  placeholder: string;
  onPress?: () => void;
}

const SearchBar = ({ placeholder, onPress }: Props) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image source={icons.search} tintColor="#ab8bff" className="size-5" resizeMode='contain'/>
      <TextInput  
        placeholder={placeholder}
        onPress={onPress}
        placeholderTextColor="#a8b5db"
        value = ""
        onChangeText={() => {}}
        className="flex-1 ml-2 text-white"
      />
    </View>
  )
}

export default SearchBar