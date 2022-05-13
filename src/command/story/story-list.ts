import { logger } from '@poppinss/cliui'
import { createCommand } from 'commander'
import { displayImage, renderDivider } from '../../utils/terminal'
import { createClient, displayUser, filterUsers } from '../../utils/user'
import type { Entity } from 'jike-sdk'

export const storyList = createCommand('list')
  .description('display story list')
  .alias('ls')
  .action(() => {
    showStoryList()
  })

const showStoryList = async () => {
  const [user] = filterUsers()
  const client = createClient(user)

  const spinner = logger.await('Fetching stories')
  const result = await client.apiClient.stories.followingFeed()
  const list = result.data.data

  const divider = renderDivider()

  if (list.length === 0) {
    spinner.stop()
    logger.success('No stories')
    return
  }

  const text = (
    await Promise.all(
      list.map((item) =>
        renderStoryList(item.user).then((result) => [...result, divider])
      )
    )
  ).flat()

  spinner.stop()
  logger.success('Fetching stories done!')
  process.stdout.write(`${text.join('\n')}\n`)
}

const renderStoryList = async (item: Entity.User): Promise<string[]> => {
  const userAvatarUrl = item.avatarImage.smallPicUrl
  const userAvatar = await displayImage(userAvatarUrl, 4).then(
    ({ result }) => result
  )
  const name = displayUser(item, true)
  return [userAvatar, name]
}
