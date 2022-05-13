import { program } from 'commander'
import { versionNumber } from '../constants'
import { version } from './version'
import { user } from './user'
import { post } from './post'
import { msg } from './msg'
import { likeRank } from './like-rank'
import { story } from './story'

export function run() {
  program
    .name('jike')
    .option('-u, --user <users...>', 'specify users')
    .option('-r, --raw', 'output raw data', false)
    .option('-P, --pretty', 'format raw data', false)
    .addCommand(user)
    .addCommand(post)
    .addCommand(msg)
    .addCommand(likeRank)
    .addCommand(story)
    .addCommand(version)
    .version(versionNumber)
    .parse()
}
