<template>
  <nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#main-navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href=".">
          <!-- all icons from https://getbootstrap.com/docs/3.3/components/#glyphicons -->
          <span class="glyphicon glyphicon-stats"></span>&nbsp;
          GitHub Release Stats
        </a>
      </div>
      <div class="collapse navbar-collapse" id="main-navbar">
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="https://github.com/RLAlpha49/github-release-stats" target="_blank">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="View GitHub repository" title="Release Stats GitHub Repository" align="top" height="18" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container">
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <h1>Enter project details&#8202;...</h1>
        <div class="form form-inline">
          <div class="form-group">
            <input v-model="username" type="text" class="form-control" id="username" placeholder="user or organization name">
          </div>
          <div class="form-group">
            <input v-model="repository" type="text" class="form-control" id="repository" placeholder="repository name">
          </div>
          <button @click="getStats" class="btn btn-primary" id="get-stats-button" :disabled="!username || !repository">Show release statistics!</button>
        </div>
      </div>
    </div>
    <div class="row" id="description" v-show="showDescription"><br>
      <h1>...&#8202;and get the latest release stats for any public repo on GitHub&#8202;:</h1>
      <br><br>
      <p>
        <span style="font-size:9em; color:lightgrey" class="glyphicon glyphicon-tag" title="Release Tag"></span>&emsp;&emsp;
        <span style="font-size:9em; color:lightgrey" class="glyphicon glyphicon-calendar" title="Release Date"></span>&emsp;&emsp;
        <span style="font-size:9em; color:lightgrey" class="glyphicon glyphicon-user" title="Release Author"></span>&emsp;&emsp;
        <span style="font-size:9em; color:lightgrey" class="glyphicon glyphicon-download" title="Release Downloads"></span>&emsp;
        <span style="font-size:1.3em; color:lightgrey"><b>and more</b></span>
      </p>
    </div>
    <div class="row" id="stats-result">
      <div class="row total-downloads" v-show="loading">
        <h2><span class="glyphicon glyphicon-download"></span>&nbsp;&nbsp;Total Downloads</h2>
        <span>{{ totalDownloads }}</span>
      </div>
      <div class="col-md-6 col-md-offset-3 error output" v-show="errorBool">{{ error }}</div>
      <div class="col-md-6 col-md-offset-3 output" v-show="!errorBool">
        <div id="latest" class="row release latest-release" v-if="statsResult.length">
          <h2>
            <a :href="statsResult[0].releaseURL" target="_blank">
              <span class="glyphicon glyphicon-tag"></span>&nbsp;&nbsp;Latest Release: {{ statsResult[0].releaseTag }}
            </a>
          </h2>
          <hr class="latest-release-hr">
          <ul>
            <h4><span class="glyphicon glyphicon-info-sign"></span>&nbsp;&nbsp;Release Info:</h4>
            <ul style="list-style-type:none">
              <li><span class="glyphicon glyphicon-calendar"></span>&nbsp;&nbsp;Published on: {{ statsResult[0].publishDate }}</li>
              <li>
                <span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;Release Author:
                <a :href="statsResult[0].releaseAuthor.html_url">{{ statsResult[0].releaseAuthor.login }}</a>
              </li>
              <li><span class="glyphicon glyphicon-download"></span>&nbsp;&nbsp;Downloads: {{ statsResult[0].ReleaseDownloadCount }}</li>
            </ul>
            <h4><span class="glyphicon glyphicon-download"></span>&nbsp;&nbsp;Download Info:</h4>
            <ul v-if="statsResult[0].assets">
              <li v-for="(asset, index) in statsResult[0].assets" :key="index">
                <a :href="asset.browserDownloadUrl">{{ asset.name }}</a> ({{ asset.size }} MiB)
                <br>
                <i>Last updated on {{ asset.lastUpdate}} — Downloaded {{ asset.downloadCount }} {{ asset.downloadCount === 1 ? 'time' : 'times' }}</i>
              </li>
            </ul>
          </ul>
        </div>
        <div v-for="(release, index) in statsResult.slice(1)" :key="index" :id="release.releaseTag" class="row release">
          <h4>
            <a :href="release.releaseURL" target="_blank">
              <span class="glyphicon glyphicon-tag"></span>&nbsp;&nbsp;{{ release.releaseTag }}
            </a>
          </h4>
          <hr class="release-hr">
          <ul>
            <h4><span class="glyphicon glyphicon-info-sign"></span>&nbsp;&nbsp;Release Info:</h4>
            <ul style="list-style-type:none">
              <li><span class="glyphicon glyphicon-calendar"></span>&nbsp;&nbsp;Published on: {{ release.publishDate }}</li>
              <li>
                <span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;Release Author:
                <a :href="release.releaseAuthor.html_url">{{ release.releaseAuthor.login }}</a>
              </li>
              <li><span class="glyphicon glyphicon-download"></span>&nbsp;&nbsp;Downloads: {{ release.ReleaseDownloadCount }}</li>
            </ul>
            <h4><span class="glyphicon glyphicon-download"></span>&nbsp;&nbsp;Download Info:</h4>
            <ul v-if="release.assets">
              <li v-for="(asset, index) in release.assets" :key="index">
                <a :href="asset.browserDownloadUrl">{{ asset.name }}</a> ({{ asset.size }} MiB)
                <br>
                <i>Last updated on {{ asset.lastUpdate}} — Downloaded {{ asset.downloadCount }} {{ asset.downloadCount === 1 ? 'time' : 'times' }}</i>
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
    <div id="loader-gif" v-if="loaderGif">
      <img src="/gif-load.gif">
    </div>
  </div>
  <div id="footer">
    <div class="container">
      Originally made with <span class="glyphicon glyphicon-heart"></span> by <a href="https://github.com/Somsubhra/github-release-stats" target="_blank">Somsubhra</a>
    </div>
  </div>
</template>

<script>
import * as main from '../public/main.mjs';

export default {
  name: 'App',
  data() {
    return {
      username: '',
      repository: '',
      showDescription: true,
      loading: false,
      totalDownloads: 0,
      userRepos: [],
      statsResult: '',
      loaderGif: false,
      errorBool: false,
      error: ''
    }
  },
  methods: {
    ...main,
    async getUserRepos() {
      this.userRepos = await main.getUserRepos(this.username);
    },
    async getStats() {
      try {
        const result = await main.getStats(this.username, this.repository);
        // console.log('Result:', result);
        if (result.error) {
          this.error = result.error;
          this.errorBool = true;
          this.loading = false;
        } else {
          this.loading = true;
          this.statsResult = result;
          this.totalDownloads = this.statsResult.reduce((total, release) => total + release.ReleaseDownloadCount, 0);
        }
      } catch (error) {
        console.error('Error:', error);
        this.error = 'An error occurred while fetching the stats.';
      }
      this.showDescription = false;
    }
  },
  watch: {
    username() {
      this.getUserRepos();
    }
  },
  mounted() {
    this.mainFunction(this.username, this.repository);
  }
}
</script>

<style>

html * {
  font-family: 'Roboto', sans-serif;
}

.form-group {
  width: 100%;
}
#username, #repository, #get-stats-button {
  margin-top: 10px;
  width: 100%;
}

#stats-result {
  margin-top: 50px;
  margin-bottom: 40px;
}

.error {
  background-color: rgba(231, 76, 60, 0.2);
  border: solid 1px rgba(231, 76, 60, 0.4);
  padding: 20px;
  font-size: 18px;
  border-radius: 5px;
  text-align: center;
}

@media (max-width: 992px) {
  .col-md-offset-3 {
    margin-left: 10px;
    margin-right: 10px;
  }
}

.total-downloads {
  margin-bottom: 25px;
  text-align: center;
}

.total-downloads h2 {
  display: inline;
  font-size: 18px;
  margin-right: 10px;
}

.release {
  background-color: rgba(127, 140, 141, 0.2);
  border: solid 1px rgba(127, 140, 141, 0.4);
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.latest-release {
  background-color: rgba(52, 152, 219, 0.2);
  border: solid 1px rgba(52, 152, 219, 0.4);
}

.latest-release-hr {
  border-top-color: rgba(52, 152, 219, 0.4);
}

.release-hr {
  border-top-color: rgba(127, 140, 141, 0.4);
}

#loader-gif {
  position: absolute;
  bottom: 15%;
  left: 47%;
}

#description {
  text-align: center;
}

html {
  position: relative;
  min-height: 100%;
}
body {
  margin-bottom: 40px;
}

#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  background-color: rgba(210, 210, 210, 0.2);
  padding: 10px;
  text-align: center;
  border-top: 1px solid rgba(210, 210, 210, 0.4);
}

</style>