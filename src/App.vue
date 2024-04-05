
<template>
  <nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href=".">
          <span class="glyphicon glyphicon-stats"></span>&nbsp;
          GitHub Release Stats
        </a>
      </div>
      <div id="main-navbar">
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="https://github.com/RLAlpha49/github-release-stats" target="_blank" style="display: flex; align-items: center; justify-content: center;">
              <img
                  v-bind:class="{ 'dark-mode-icon': darkMode }"
                  src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                  alt="View GitHub repository"
                  title="Release Stats GitHub Repository"
                  align="top"
                  height="18"
              />
            </a>
          </li>
          <li>
            <a @click="toggleDarkMode" style="display: flex; align-items: center; justify-content: center;">
              <i v-if="darkMode" class="fas fa-sun" style="font-size: 18px;"></i>
              <i v-else class="fas fa-moon" style="font-size: 18px;"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container">
    <div class="row" id="top-row">
      <div class="col-md-4 col-md-offset-4">
        <h1>Enter project details&#8202;...</h1>
        <div class="form form-inline">
          <div class="form-group">
            <input
              v-model="username"
              type="text"
              class="form-control"
              id="username"
              placeholder="User or Organization name"
            />
          </div>
          <div class="form-group">
            <input
              v-model="repository"
              type="text"
              class="form-control"
              id="repository"
              placeholder="Repository name"
            />
          </div>
          <button
            @click="getStats"
            class="btn btn-primary"
            id="get-stats-button"
            :disabled="!username || !repository"
          >
            Show release statistics!
          </button>
        </div>
      </div>
    </div>
    <div class="row" id="description" v-show="showDescription">
      <br>
      <h1>...&#8202;and get the latest release stats for any public repo on GitHub&#8202;:</h1>
      <br><br>
      <p>
        <span
          style="font-size:9em; color:lightgrey"
          class="glyphicon glyphicon-tag"
          title="Release Tag"
        ></span>&emsp;&emsp;
        <span
          style="font-size:9em; color:lightgrey"
          class="glyphicon glyphicon-calendar"
          title="Release Date"
        ></span>&emsp;&emsp;
        <span
          style="font-size:9em; color:lightgrey"
          class="glyphicon glyphicon-user"
          title="Release Author"
        ></span>&emsp;&emsp;
        <span
          style="font-size:9em; color:lightgrey"
          class="glyphicon glyphicon-download"
          title="Release Downloads"
        ></span>&emsp;
        <span style="font-size:1.3em; color:lightgrey"><b>and more</b></span>
      </p>
    </div>
    <div class="row" id="stats-result" v-show="display">
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
  <inject />
</template>

<script>
import * as main from '../public/main.mjs';
import { inject } from "@vercel/analytics"

export default {
  name: 'App',
  components: {
    inject
  },
  data() {
    return {
      darkMode: localStorage.getItem('darkMode') === 'true' || false,
      username: '',
      repository: '',
      showDescription: true,
      loading: false,
      display: false,
      totalDownloads: 0,
      userRepos: [],
      statsResult: '',
      loaderGif: false,
      errorBool: false,
      error: ''
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', this.darkMode);
    },
    ...main,
    async getUserRepos() {
      this.userRepos = await main.getUserRepos(this.username);
    },
    async getStats() {
      try {
        this.display = false;
        await new Promise(resolve => setTimeout(resolve, 100));
        const result = await main.getStats(this.username, this.repository);
        // console.log('Result:', result);
        if (result.error) {
          this.error = result.error;
          this.errorBool = true;
          this.loading = false;
          this.display = true;
        } else {
          this.error = '';
          this.errorBool = false;
          this.loading = true;
          this.display = true;
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
  created() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
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

.navbar-nav {
  display: flex;
}

.navbar-header {
  float: left;
}

#main-navbar {
  float: right;
}

.fas.fa-moon {
  color: black;
}

.fas.fa-moon:hover {
  color: grey;
}

body.dark-mode {
  background-color: #121212;
  color: #c7c7c7;
}

body.dark-mode .navbar {
  background-color: #3a3a3a;
}

body.dark-mode .navbar-brand,
body.dark-mode .navbar-nav li a {
  color: #c7c7c7;
}

.dark-mode-icon {
  filter: invert(1);
}

body.dark-mode .form-control {
  background-color: #3a3a3a;
  color: #c7c7c7;
  border-color: #4a4a4a;
}

body.dark-mode #footer {
  background-color: #3a3a3a;
  color: #c7c7c7;
}

.form-group {
  width: 100%;
}

.form-group input {
  text-align: center;
}

#top-row {
  display: flex;
  justify-content: center;
}

.col-md-offset-4 h1 {
  text-align: center;
}

#username, #repository, #get-stats-button {
  margin-top: 10px;
  width: 100%;
}

#stats-result {
  margin-top: 50px;
  margin-bottom: 40px;
}

#stats-result, .col-md-offset-4 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form.form-inline {
  width: 100% !important;
}

.error {
  background-color: rgba(231, 76, 60, 0.2);
  border: solid 1px rgba(231, 76, 60, 0.4);
  padding: 20px;
  font-size: 18px;
  border-radius: 5px;
  text-align: center;
}

@media (min-width: 992px) {
  .col-md-offset-3 {
    margin-left: 10px;
    margin-right: 10px;
  }

  .col-md-offset-4 {
    margin-left: 0;
    width: auto;
  }
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
