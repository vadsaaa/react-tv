const { spawnSync } = require('child_process')
const path = require('path')
const rimraf = require('rimraf')

const scriptPath = path.resolve(__dirname, '../index.js')
const packagePath = path.resolve(__dirname, '../__fixtures__/package')
const emptyPackagePath = path.resolve(__dirname, '../__fixtures__/emptyPackage')

require('./to-run-successfully-matcher')

describe('[CLI] init', () => {
  describe('react-tv init', () => {
    let slug = 'react-tv'

    beforeEach((done) => rimraf(path.resolve(packagePath, slug), done))
    afterEach((done) => rimraf(path.resolve(packagePath, slug), done))

    it('should create react-tv folder', () => {
      const subject = spawnSync('node', [
        scriptPath,
        'init'
      ], { cwd: packagePath })

      const createdAppPath = path.resolve(packagePath, slug)
      const appInfo = require(path.resolve(createdAppPath, 'webos/appinfo.json'))

      expect(appInfo.id).toEqual('react.tv.app')
      expect(appInfo.title).toEqual('package')
      expect(subject).toRunSuccessfully()
    })

    it('should fail when package.json not exists', () => {
      const subject = spawnSync('node', [
        scriptPath,
        'init'
      ], { cwd: emptyPackagePath })

      expect(subject).not.toRunSuccessfully()
    })
  })

  describe('react-tv init <appName>', () => {
    const appName = 'russell-crowe'

    beforeEach((done) => rimraf(path.resolve(emptyPackagePath, appName), done))
    afterEach((done) => rimraf(path.resolve(emptyPackagePath, appName), done))

    it('should create custom app', () => {
      const subject = spawnSync('node', [
        scriptPath,
        'init',
        appName
      ], { cwd: emptyPackagePath })

      const createdAppPath = path.resolve(emptyPackagePath, appName)
      const createdPackageJson = require(path.resolve(createdAppPath, 'package.json'))

      expect(subject).toRunSuccessfully()
      expect(createdPackageJson.name).toEqual('russell-crowe')
    })
  })
})