import NotionButton from '@/components/NotionButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { markdownDarkStyle, markdownStyle } from '@/constants/MarkdowStyle'
import { extendedClient } from '@/myDbModule'
import { MarkdownTextInput } from '@expensify/react-native-live-markdown'
import { NotionFile } from '@prisma/client'
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  InputAccessoryView,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

const EXAMPLE_CONTENT = [
  '# Insert subtitle here!',
  "Hello, *world*! I'm excited to share this with you.",
  'Visit my website: codewithbeto.dev',
  '> This is a blockquote, a great way to highlight quotes or important notes.',
  '`inline code` is useful for highlighting code within a sentence.',
  "Here's a code block example:",
  "```\n// Codeblock\nconsole.log('🚀 Ready to launch!');\n```",
  'Mentions:',
  '- @here (notify everyone)',
  '- @beto@expo.dev (mention a specific user)',
  'Use #hashtags to organize content, like this: #mention-report',
].join('\n')
const inputAccessoryViewID = 'newNotion'
const defaultIcons = [
  '🚀',
  '👻',
  '🎨',
  '🎤',
  '🥁',
  '🎲',
  '📱',
  '🌟',
  '🔥',
  '💡',
  '🚗',
  '🌈',
  '📚',
  '💻',
  '🎧',
  '🏆',
  '⚽',
  '🍔',
  '🎂',
  '🎵',
  '✈️',
  '🎮',
  '🌍',
  '🍕',
  '📷',
  '📅',
  '🔍',
  '🔧',
  '📝',
  '🛠️',
  '💼',
  '📞',
  '📈',
  '🏠',
  '🎉',
]

const randomIcon = () =>
  defaultIcons[Math.floor(Math.random() * defaultIcons.length)]

export default function NewNotionScreen() {
  const router = useRouter()
  const theme = useColorScheme()
  const routeParams = useLocalSearchParams<{
    parentId?: string
    viewingFile?: string
  }>()
  const rouer = useRouter()

  const viewingFile: NotionFile = routeParams.viewingFile
    ? JSON.parse(routeParams.viewingFile)
    : null

  const childFiles = extendedClient.notionFile.useFindMany({
    where: {
      parentFileId: viewingFile?.id ?? -1,
    },
  })

  const parentFile = extendedClient.notionFile.useFindUnique({
    where: {
      id: viewingFile?.parentFileId ?? -1,
    },
  })

  const titleRef = useRef<TextInput>(null)

  const [title, setTitle] = useState(viewingFile?.title ?? '')
  const [text, setText] = useState(viewingFile?.content ?? '')
  const [icon, setIcon] = useState(viewingFile?.icon ?? randomIcon())

  const backgroundColor = Colors[theme!].background as any
  const textColor = Colors[theme!].text as any

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus()
    }
  }, [theme])

  function handleSaveNotionFile() {
    if (!title) return

    const data = {
      title,
      description: '',
      coverPhoto: '',
      icon: icon ?? randomIcon(),
      content: text,
      authorId: 1,
      type: 'default',
      parentFileId: routeParams.parentId
        ? Number(routeParams.parentId)
        : viewingFile
        ? viewingFile.parentFileId
        : null,
    }

    try {
      if (viewingFile) {
        console.log('Updating')
        extendedClient.notionFile.update({
          where: { id: viewingFile.id },
          data,
        })
      } else {
        console.log('Creating')
        extendedClient.notionFile.create({
          data,
        })
      }

      setTitle('')
      setText('')
      setIcon(randomIcon())
      router.setParams({ parentId: '', viewingFile: '' })

      if (router.canDismiss()) {
        router.dismissAll()
      }
      router.replace('/(tabs)/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          headerBackTitle: parentFile?.title,
          headerTitle: title,
          headerRight: () =>
            title ? (
              <NotionButton
                title="Done"
                onPress={handleSaveNotionFile}
                containerStyle={{ marginRight: 10 }}
              />
            ) : (
              <NotionButton
                iconName="close"
                onPress={() => {
                  router.setParams({ parentId: '', viewingFile: '' })
                  if (router.canDismiss()) {
                    router.dismissAll()
                  }
                  router.replace('/(tabs)/')
                }}
                containerStyle={{ marginRight: 10 }}
              />
            ),
        }}
      />
      <ThemedView style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="always">
          <ThemedView style={styles.container}>
            {icon && (
              <Text style={{ fontSize: 60, marginBottom: 6 }}>{icon}</Text>
            )}
            <TextInput
              ref={titleRef}
              placeholder="Untitled"
              value={title}
              onChangeText={setTitle}
              style={{ fontSize: 32, fontWeight: 'bold', color: textColor }}
              blurOnSubmit={false}
              inputAccessoryViewID={inputAccessoryViewID}
              multiline
            />

            {childFiles.length > 0 && (
              <View>
                <ThemedText>Inner files: {childFiles.length}</ThemedText>
                {childFiles.map((child) => (
                  <Link
                    key={child.id}
                    href={{
                      pathname: 'new-notion',
                      params: { viewingFile: JSON.stringify(child) },
                    }}
                    push
                    asChild
                  >
                    <TouchableOpacity>
                      <ThemedText style={{ color: 'blue' }}>
                        - {child.icon} {child.title}
                      </ThemedText>
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            )}

            <MarkdownTextInput
              key={theme}
              value={text}
              placeholder="Tap here to continue..."
              defaultValue={text}
              onChangeText={setText}
              markdownStyle={
                theme === 'dark' ? markdownDarkStyle : markdownStyle
              }
              inputAccessoryViewID={inputAccessoryViewID}
              multiline
              style={{ color: textColor, lineHeight: 28 }}
            />
          </ThemedView>
        </ScrollView>

        <InputAccessoryView
          nativeID={inputAccessoryViewID}
          backgroundColor={backgroundColor}
        >
          <View
            style={[styles.accessoryView, { borderColor: textColor + '20' }]}
          >
            <View style={{ flexDirection: 'row', gap: 7 }}>
              <NotionButton
                title="AI"
                iconName="sparkles"
                onPress={() => setText(EXAMPLE_CONTENT)}
              />
              <NotionButton iconName="images" onPress={() => {}} />
            </View>
            {defaultIcons.slice(0, 6).map((icon) => (
              <Pressable key={icon} onPress={() => setIcon(icon)}>
                <ThemedText>{icon}</ThemedText>
              </Pressable>
            ))}
            <NotionButton
              iconName="arrow-down"
              onPress={() => Keyboard.dismiss()}
            />
          </View>
        </InputAccessoryView>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  accessoryView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    height: 50,
    borderTopWidth: 0.5,
  },
})
