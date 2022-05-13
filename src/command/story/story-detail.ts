import { logger } from '@poppinss/cliui'
import { createCommand } from 'commander'
import { format } from 'date-fns'
import { displayImage, renderDivider } from '../../utils/terminal'
import { createClient, displayUser, filterUsers } from '../../utils/user'
import type { Entity } from 'jike-sdk'

export const storyDetail = createCommand('detail')
  .description('display story detail')
  .argument('[username]', 'the username of user')
  .alias('d')
  .action((username: string) => {
    showDetail(username)
  })

const showDetail = async (username: string) => {
  const [user] = filterUsers()
  const client = createClient(user)

  const spinner = logger.await('Fetching story detail')
  const result = await client.apiClient.stories.listUserStories(username)
  const list = result.data.data

  if (list.length === 0) {
    spinner.stop()
    logger.success('No story detail')
    return
  }

  const divider = renderDivider()

  const text = (
    await Promise.all(
      list.map((item) =>
        renderStory(item).then((result) => [...result, divider])
      )
    )
  )
    .flat()
    .filter((item) => item) //Remove something if it's empty

  spinner.stop()
  logger.success('Fetching story detail done!')
  process.stdout.write(`${text.join('\n')}\n`)
}

const renderStory = async (story: Entity.Story): Promise<string[]> => {
  const name = displayUser(story.user, true)
  const timeStr = format(new Date(story.createdAt), 'yyyy-MM-dd HH:mm:ss')
  const emoji = story.emoji ? story.emoji : ''
  const likeCount = story.likeCount > 99 ? '99+' : story.likeCount
  const commentCount = story.commentCount > 99 ? '99+' : story.commentCount

  const picUrl = story.picture?.smallPicUrl
  const pic = picUrl
    ? await displayImage(picUrl, 6).then(({ result }) => result)
    : ''

  const storyState = `👍${likeCount}\t💬${commentCount}`

  return [timeStr, name, emoji, pic, storyState]
}
