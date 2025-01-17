/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import buffer from 'vinyl-buffer'
import gulp from 'gulp'
import uglify from 'gulp-uglify'
import jasmine from 'gulp-jasmine'
import watch from 'gulp-watch'
import batch from 'gulp-batch'
import replace from 'gulp-replace'
import fs from 'fs-extra'
import path from 'path'
import minimist from 'minimist'
import install from 'gulp-install'
import file from 'gulp-file'
import * as rollup from 'rollup'
import rollupCommonJs from '@rollup/plugin-commonjs'
import rollupNodeResolve from '@rollup/plugin-node-resolve'
import rollupPolyfillNode from 'rollup-plugin-polyfill-node'
import semver from 'semver'
import stream from 'stream'
import ts from 'gulp-typescript'
import JasmineReporter from 'jasmine-spec-reporter'
import karma from 'karma'
import log from 'fancy-log'
import JasmineExec from 'jasmine'

/**
 * Useful to investigate resource leaks in tests. Enable to see active sockets and file handles after the 'test' task.
 */
const enableActiveNodeHandlesLogging = false

const browserOutput = 'lib/browser'

gulp.task('nodejs', function () {
  return gulp
    .src('src/**/*.js')
    .pipe(ts({
      target: 'ES2022',
      lib: ['ES2022'],
      module: 'ES2022',
      noImplicitAny: true,
      noImplicitReturns: true,
      strictNullChecks: true,
      esModuleInterop: true,
      moduleResolution: 'Bundler',
      downlevelIteration: true,
      allowJs: true,
      isolatedModules: true
    }))
    .pipe(gulp.dest('lib'))
})

gulp.task('generate-umd-bundle', generateBrowserBundleTask({
  outputFile: 'neo4j-web.js',
  outputFileMin: 'neo4j-web.min.js',
  name: 'neo4j',
  format: 'umd'
}))

gulp.task('minify-umd-bundle', minifyBrowserBundleTask({
  inputFile: 'neo4j-web.js',
  outputFile: 'neo4j-web.min.js'
}))

gulp.task('browser::umd', gulp.series('generate-umd-bundle', 'minify-umd-bundle'))

gulp.task('generate-esm-bundle', generateBrowserBundleTask({
  outputFile: 'neo4j-web.esm.js',
  format: 'esm'
}))

gulp.task('minify-esm-bundle', minifyBrowserBundleTask({
  inputFile: 'neo4j-web.esm.js',
  outputFile: 'neo4j-web.esm.min.js'
}))

gulp.task('browser::esm', gulp.series('generate-esm-bundle', 'minify-esm-bundle'))

/** Build all-in-one files for use in the browser */
gulp.task('browser', gulp.series('nodejs', gulp.parallel('browser::umd', 'browser::esm')))

// prepares directory for package.test.js
gulp.task(
  'install-driver-into-sandbox',
  gulp.series('nodejs', function () {
    const testDir = path.join('build', 'sandbox')
    fs.emptyDirSync(testDir)

    const packageJsonContent = JSON.stringify({
      private: true,
      dependencies: {
        'neo4j-driver': __dirname
      }
    })

    return file('package.json', packageJsonContent, { src: true })
      .pipe(gulp.dest(testDir))
      .pipe(install())
  })
)

gulp.task(
  'test-nodejs',
  gulp.series('install-driver-into-sandbox', function () {
    return gulp
      .src(['./test/**/*.test.js', '!./test/**/browser/*.js'])
      .pipe(
        jasmine({
          includeStackTrace: true,
          reporter: newJasmineConsoleReporter()
        })
      )
      .on('end', logActiveNodeHandles)
  })
)

gulp.task('test-nodejs-unit', () => {
  return runJasmineTests('#unit*')
})

gulp.task('test-nodejs-stub', () => {
  return runJasmineTests('#stub*')
})

gulp.task('test-nodejs-integration', async () => {
  await sharedNeo4j.start()
  return runJasmineTests('#integration*')
})

gulp.task('run-browser-test-chrome', async function (cb) {
  await sharedNeo4j.start()
  runKarma('chrome', cb)
})

gulp.task('run-browser-test-firefox', async function (cb) {
  await sharedNeo4j.start()
  runKarma('firefox', cb)
})

gulp.task('run-browser-test', gulp.series('run-browser-test-firefox'))

gulp.task('watch', function () {
  return watch(
    'src/**/*.js',
    batch(function (events, done) {
      gulp.start('all', done)
    })
  )
})

gulp.task(
  'watch-n-test',
  gulp.series('test-nodejs', function () {
    return gulp.watch(['src/**/*.js', 'test/**/*.js'], ['test-nodejs'])
  })
)

/** Set the project version, controls package.json and version.js */
gulp.task('set', function () {
  // example: gulp set --x 4.0.2

  // Get the --x arg from command line
  const command = minimist(process.argv.slice(2), { string: 'x' })
  const version = command.x

  if (!semver.valid(version)) {
    throw new Error(`Invalid version "${version}"`)
  }

  // Change the version in relevant files
  const versionFile = path.join('src', 'version.js')
  return gulp
    .src([versionFile], { base: './' })
    .pipe(replace('0.0.0-dev', version))
    .pipe(gulp.dest('./'))
})

gulp.task('start-neo4j', function (done) {
  sharedNeo4j.start().then(done).catch(error => done.fail(error))
})

gulp.task('stop-neo4j', function (done) {
  sharedNeo4j.stop().then(done).catch(error => done.fail(error))
})

gulp.task('run-stress-tests', function () {
  return gulp
    .src('test/**/stress.test.js')
    .pipe(
      jasmine({
        includeStackTrace: true,
        reporter: newJasmineConsoleReporter()
      })
    )
    .on('end', logActiveNodeHandles)
})

gulp.task('run-stress-tests-without-jasmine', async function () {
  await sharedNeo4j.start()
  return stresstest()
})

gulp.task('run-ts-declaration-tests', function (done) {
  return gulp
    .src(['test/types/**/*', 'types/**/*'], { base: '.' })
    .pipe(
      ts({
        lib: ['es6', 'dom', 'esnext.asynciterable'],
        module: 'es6',
        target: 'es6',
        noImplicitAny: true,
        noImplicitReturns: true,
        strictNullChecks: true,
        moduleResolution: 'node',
        types: []
      })
    )
    .pipe(gulp.dest('build/test/types'))
    .on('error', err => done(err))
    .on('end', () => done())
})

gulp.task('all', gulp.series('nodejs', 'browser'))

gulp.task('test-browser', gulp.series('start-neo4j', 'browser', 'run-browser-test'))

gulp.task(
  'test',
  gulp.series('run-ts-declaration-tests', 'start-neo4j', 'test-nodejs', 'test-browser', 'stop-neo4j')
)

gulp.task('default', gulp.series('test'))

function logActiveNodeHandles () {
  if (enableActiveNodeHandlesLogging) {
    console.log(
      '-- Active NodeJS handles START\n',
      process._getActiveHandles(),
      '\n-- Active NodeJS handles END'
    )
  }
}

function newJasmineConsoleReporter () {
  return new JasmineReporter.SpecReporter({
    colors: {
      enabled: true
    },
    spec: {
      displayDuration: true,
      displayErrorMessages: true,
      displayStacktrace: true,
      displayFailed: true,
      displaySuccessful: true,
      displayPending: false
    },
    summary: {
      displayFailed: true,
      displayStacktrace: true,
      displayErrorMessages: true
    }
  })
}

function runKarma (browser, cb) {
  new karma.Server(
    {
      configFile: path.join(__dirname, `/test/browser/karma-${browser}.conf.js`)
    },
    function (exitCode) {
      exitCode ? process.exit(exitCode) : cb()
    }
  ).start()
}

function runJasmineTests (filterString) {
  return new Promise((resolve, reject) => {
    const jasmine = new JasmineExec()
    jasmine.loadConfigFile('./spec/support/jasmine.json')
    jasmine.loadHelpers()
    jasmine.loadSpecs()
    jasmine.configureDefaultReporter({
      print: () => {}
    })
    jasmine.addReporter(newJasmineConsoleReporter())
    jasmine.exitOnCompletion = false
    jasmine.execute(null, filterString)
      .then(result => {
        if (result.overallStatus === 'passed') {
          resolve()
        } else {
          reject(new Error('tests failed'))
        }
      })
  })
}

function generateBrowserBundleTask ({ format, name, outputFile }) {
  return async function () {
    return await rollup.rollup({
      input: 'lib/index.js',
      plugins: [
        rollupNodeResolve({
          browser: true,
          preferBuiltins: false
        }),
        rollupCommonJs(),
        rollupPolyfillNode()
      ]
    }).then(bundle => {
      return bundle.write({
        file: `${browserOutput}/${outputFile}`,
        format,
        name
      })
    })
  }
}

function minifyBrowserBundleTask ({ inputFile, outputFile }) {
  return async function () {
    const input = `${browserOutput}/${inputFile}`
    const output = `${browserOutput}/${outputFile}`

    return gulp.src(input)
      .on('error', log.error)
      .pipe(new stream.Transform({
        objectMode: true,
        transform (file, _, callback) {
          const clone = file.clone()
          clone.path = output
          callback(null, clone)
        }
      }))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(browserOutput))
  }
}
