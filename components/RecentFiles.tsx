import { extendedClient } from '@/myDbModule'
import { ScrollView, StyleSheet, View } from 'react-native'
import RecentFileCard from './RecentFileCard'
import { ThemedText } from './ThemedText'

export default function RecentFiles() {
  const files = extendedClient.notionFile.useFindMany({
    orderBy: {
      updatedAt: 'desc',
    },
    take: 6,
    where: {
      parentFileId: {
        equals: null,
      },
    },
  })

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={{ paddingHorizontal: 10 }}>
        Jump back in
      </ThemedText>
      {!files.length && (
        <ThemedText
          style={{ color: 'gray', textAlign: 'center', paddingTop: 12 }}
        >
          Nothing to show!!
        </ThemedText>
      )}
      <ScrollView
        horizontal
        contentContainerStyle={{ padding: 10, gap: 12 }}
        showsHorizontalScrollIndicator={false}
      >
        {files.map((file) => (
          <RecentFileCard key={file.id} notionFile={file} />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
})
