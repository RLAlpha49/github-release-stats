import { Octokit } from '@octokit/core'
import { paginateRest } from '@octokit/plugin-paginate-rest'

const MyOctokit = Octokit.plugin(paginateRest)
const octokit = new MyOctokit()

export function validateInput (username, repository) {
  return username.length > 0 && repository.length > 0
}

export async function getUserRepos (username) {
  try {
    const data = await octokit.paginate('GET /users/{username}/repos', { username })
    return data.map(datum => datum.name)
  } catch (e) {
    console.log(e)
    if (e.message.includes('API rate limit exceeded')) {
      return showError("You've exceeded GitHub's rate limiting. Please try again later.")
    } else if (e.message.includes('Not Found')) {
      return showError('The project or user does not exist!')
    } else {
      return showError('Unknown Response from GitHub: ' + e)
    }
  }
}

export function showStats (data) {
  const stats = []

  // Sort by creation date of the commit the release is targeting
  data.sort(function (a, b) {
    return (a.created_at < b.created_at) ? 1 : -1
  })

  for (const item of data) {
    const releaseTag = item.tag_name
    const releaseURL = item.html_url
    const releaseAssets = item.assets
    const hasAssets = releaseAssets.length !== 0
    const releaseAuthor = item.author
    const hasAuthor = releaseAuthor != null
    const publishDate = item.published_at.split('T')[0]
    let ReleaseDownloadCount = 0
    const assets = []

    if (hasAssets) {
      for (const asset of releaseAssets) {
        const assetSize = (asset.size / 1048576.0).toLocaleString(undefined, { maximumFractionDigits: 2 })
        const lastUpdate = asset.updated_at.split('T')[0]
        ReleaseDownloadCount += asset.download_count

        // Add asset information to the assets array
        assets.push({
          name: asset.name,
          size: assetSize,
          lastUpdate,
          downloadCount: asset.download_count,
          browserDownloadUrl: asset.browser_download_url
        })
      }
    }

    stats.push({
      releaseTag,
      releaseURL,
      hasAssets,
      releaseAuthor,
      hasAuthor,
      publishDate,
      ReleaseDownloadCount,
      assets
    })
  }

  return stats
}

export function showError (errMessage) {
  console.error(errMessage)
  return { error: errMessage }
}

export async function getStats (user, repository) {
  const params = { owner: user, repo: repository, per_page: 100 }
  try {
    const response = await octokit.paginate('GET /repos/{owner}/{repo}/releases', params)
    if (response.length === 0) {
      return showError('There are no releases for this project')
    } else {
      return showStats(response)
    }
  } catch (e) {
    console.log(e)
    if (e.message.includes('API rate limit exceeded')) {
      return showError("You've exceeded GitHub's rate limiting. Please try again later.")
    } else if (e.message.includes('Not Found')) {
      return showError('The project or user does not exist!')
    } else {
      return showError('Unknown Response from GitHub: ' + e)
    }
  }
}

export async function mainFunction (username, repository) {
  if (validateInput(username, repository)) {
    const userRepos = await getUserRepos(username)
    const stats = await getStats(username, repository)
    return { userRepos, stats }
  } else {
    return showError('Invalid username or repository')
  }
}
