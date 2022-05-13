import { createCommand } from 'commander'
import { storyList } from './story-list'
import { storyDetail } from './story-detail'

export const story = createCommand('story')
  .description('story-related operations')
  .addHelpText(
    'after',
    `

Example call:
  $ jike-cli story list
  $ jike-cli story detail 82D23B32-CF36-4C59-AD6F-D05E3552CBF3
`
  )
  .usage('<command> [flags]')
  .addCommand(storyList)
  .addCommand(storyDetail)
