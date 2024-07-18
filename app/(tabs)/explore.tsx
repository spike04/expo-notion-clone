import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { extendedClient } from '@/myDbModule'
import { Link } from 'expo-router'

export default function ExploreScreen() {
  const today = new Date()
  const startOfToday = new Date(today.setHours(0, 0, 0, 0))
  const endOfToday = new Date(today.setHours(23, 59, 59, 999))

  const startOfLastWeek = new Date(startOfToday)
  startOfLastWeek.setDate(startOfLastWeek.getDate() - startOfToday.getDay() - 6)
  const endOfLastWeek = new Date(startOfToday)
  endOfLastWeek.setDate(endOfLastWeek.getDate() - startOfToday.getDay())

  const todayFiles = extendedClient.notionFile.useFindMany({
    where: {
      updatedAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const lastWeekFiles = extendedClient.notionFile.useFindMany({
    where: {
      updatedAt: {
        gte: startOfLastWeek,
        lte: endOfLastWeek,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ padding: 15 }}
        >
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={{ paddingBottom: 10 }}>
              Today
            </ThemedText>
            {todayFiles.map((file) => (
              <Link
                href={{
                  pathname: 'new-notion',
                  params: { viewingFile: JSON.stringify(file) },
                }}
                asChild
                key={file.id}
                style={styles.item}
              >
                <TouchableOpacity style={styles.item}>
                  <ThemedText style={{ color: '#007AFF' }}>
                    - {file.icon} {file.title}
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            ))}
          </View>

          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={{ paddingBottom: 10 }}>
              Last Week Files
            </ThemedText>
            {lastWeekFiles.length > 0 ? (
              lastWeekFiles.map((file) => (
                <Link
                  href={{
                    pathname: 'new-notion',
                    params: { viewingFile: JSON.stringify(file) },
                  }}
                  asChild
                  key={file.id}
                  style={styles.item}
                >
                  <TouchableOpacity style={styles.item}>
                    <ThemedText style={{ color: '#007AFF' }}>
                      - {file.icon} {file.title}
                    </ThemedText>
                  </TouchableOpacity>
                </Link>
              ))
            ) : (
              <ThemedText
                style={{ color: 'gray', textAlign: 'center', paddingTop: 12 }}
              >
                Nothing to show!!
              </ThemedText>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 15,
  },
  item: {
    marginBottom: 8,
  },
})
