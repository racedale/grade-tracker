/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { readFileSync } = require('fs')
const { S3 } = require('aws-sdk')

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    log(message) {
      console.log(message)
    },
    uploadToS3({accessKeyId, secretAccessKey, filepath}) {
      const filename = filepath.split('/').slice(-1)[0]
      const data = readFileSync(filepath)
      const s3 = new S3(
        {
          accessKeyId,
          secretAccessKey,
          region: 'us-east-2',
        }
      )
      return s3.putObject({
        Bucket: 'wentzville-school-grades-382220085659',
        ACL: 'public-read',
        Key: filename,
        Body: data,
      }).promise()
    }
  })
}
