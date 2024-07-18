import { Colors } from '@/constants/Colors'
import { getRandomGradient } from '@/constants/Gradients'
import { NotionFile } from '@prisma/client'
import { LinearGradient } from 'expo-linear-gradient'
import { useMemo } from 'react'
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'
import { ThemedText } from './ThemedText'
import Animated, {
  LinearTransition,
  SlideInLeft,
  SlideOutLeft,
} from 'react-native-reanimated'
import { useNavigation } from 'expo-router'

interface Props {
  notionFile: NotionFile
}

export default function RecentFileCard({ notionFile }: Props) {
  const theme = useColorScheme()
  const colors = useMemo(() => getRandomGradient(), [])
  const navigation = useNavigation()

  return (
    <Animated.View
      layout={LinearTransition}
      entering={SlideInLeft}
      exiting={SlideOutLeft}
      style={{
        borderRadius: 16,
        backgroundColor: Colors[theme!].background,
        shadowColor: theme === 'dark' ? '#ffffff20' : 'black',
        shadowRadius: 4,
        shadowOffset: { height: 2, width: 0 },
        shadowOpacity: 0.09,
      }}
    >
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: Colors[theme!].backgroundSecondary,
            borderColor: Colors[theme!].text + '20',
          },
        ]}
        onPress={() =>
          // @ts-ignore
          navigation.navigate('new-notion', {
            viewingFile: JSON.stringify(notionFile),
          })
        }
      >
        {notionFile.coverPhoto ? (
          <></>
        ) : (
          <LinearGradient
            colors={colors}
            style={{
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              height: 60,
            }}
          />
        )}
        <ThemedText style={styles.icon}>{notionFile.icon}</ThemedText>
        <ThemedText style={styles.title}>{notionFile.title}</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 0.5,
  },
  icon: {
    fontSize: 32,
    lineHeight: 36,
    position: 'absolute',
    top: 40,
    left: 6,
  },
  title: {
    fontWeight: '600',
    padding: 6,
    paddingTop: 16,
    lineHeight: 18,
  },
})
