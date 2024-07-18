import { Colors } from '@/constants/Colors'
import { extendedClient } from '@/myDbModule'
import Ionicons from '@expo/vector-icons/Ionicons'
import { NotionFile } from '@prisma/client/react-native'
import { useState } from 'react'
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { RenderItemParams } from 'react-native-draggable-flatlist'
import { ThemedText } from './ThemedText'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Link } from 'expo-router'

export default function DraggableNotionListItem({
  drag,
  isActive,
  item,
}: RenderItemParams<NotionFile>) {
  return (
    <NotionFileItem
      drag={drag}
      isActive={isActive}
      notionFile={item}
      iconColor="gray"
    />
  )
}

interface InnerNotionListItemProps {
  parentId: number | undefined
}

function InnerNotionListItem({ parentId }: InnerNotionListItemProps) {
  const theme = useColorScheme() ?? 'light'
  const iconColor = theme === 'light' ? Colors.light.icon : Colors.dark.icon
  const childs = extendedClient.notionFile.useFindMany({
    where: {
      parentFile: {
        id: parentId,
      },
    },
    orderBy: {
      order: 'asc',
    },
  })

  if (childs.length === 0)
    return <ThemedText style={{ color: 'gray' }}>No Pages Inside</ThemedText>

  return (
    <View>
      {childs.map((notionFile: NotionFile) => (
        <NotionFileItem
          key={notionFile.id}
          notionFile={notionFile}
          iconColor={iconColor}
        />
      ))}
    </View>
  )
}

interface NotionFileItemProps {
  drag?: () => void
  isActive?: boolean
  notionFile: NotionFile
  iconColor: string
}

function NotionFileItem({
  drag,
  isActive,
  notionFile,
  iconColor,
}: NotionFileItemProps) {
  const { showActionSheetWithOptions } = useActionSheet()
  const [isOpen, setIsOpen] = useState(false)

  const onPress = (id: number) => {
    const options = ['Delete', 'Cancel']

    const destructiveButtonIndex = 0
    const cancelButtonIndex = 1

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case destructiveButtonIndex:
            extendedClient.notionFile.delete({
              where: {
                id,
              },
            })
            break
          case cancelButtonIndex:
            // canceled
            break
        }
      },
    )
  }

  return (
    <View>
      <Link
        asChild
        push
        href={{
          pathname: 'new-notion',
          params: { viewingFile: JSON.stringify(notionFile) },
        }}
      >
        <TouchableOpacity
          style={styles.heading}
          activeOpacity={0.8}
          disabled={isActive}
          onLongPress={drag}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={() => setIsOpen((prev) => !prev)}>
              <Ionicons
                name={isOpen ? 'chevron-down' : 'chevron-forward-outline'}
                size={18}
                style={{ marginRight: 12 }}
                color={iconColor}
              />
            </Pressable>
            <ThemedText type="defaultSemiBold">
              {notionFile.icon} {notionFile.title}
            </ThemedText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Pressable onPress={() => onPress(notionFile.id)}>
              <Ionicons
                name="ellipsis-horizontal"
                size={18}
                style={{ marginRight: 12 }}
                color={iconColor}
              />
            </Pressable>
            <Link
              href={{
                pathname: 'new-notion',
                params: { parentId: notionFile.id },
              }}
            >
              <Ionicons
                name="add"
                size={22}
                style={{ marginRight: 12 }}
                color={iconColor}
              />
            </Link>
          </View>
        </TouchableOpacity>
      </Link>
      {isOpen && (
        <View style={styles.content}>
          <InnerNotionListItem parentId={notionFile.id} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    height: 40,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    marginLeft: 24,
  },
})
