import { StyleSheet } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { extendedClient } from '@/myDbModule'
import { SafeAreaView } from 'react-native-safe-area-context'
import DraggableNotionList from '@/components/DraggableNotionList'
import RecentFiles from '@/components/RecentFiles'

export default function HomeScreen() {
  const user = extendedClient.user.useFindFirst({
    where: { id: 1 },
  })
  const notions = extendedClient.notionFile.useFindMany()

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <RecentFiles />
        <DraggableNotionList />

        {/* <Button title="Create Notion" onPress={createNotion}></Button> */}
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
