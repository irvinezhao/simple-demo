const { readdir, readFile, lstatSync } = require('fs')
const { join } = require('path')
const express = require('express')
const app = express()
const { render } = require('ejs')
app.use(express.static('public'))
app.engine('html', require('ejs').renderFile)

const isDirectory = source => lstatSync(source).isDirectory()

const componentHtml = `
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Component</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css" integrity="sha384-Zug+QiDoJOrZ5t4lssLdxGhVrurbmBWopoEl+M6BdEfwnCJZtKxi1KgxUyJq13dy" crossorigin="anonymous">
        <style><%= css %></style>
      </head>
      <body>
        <%- body %>
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/js/bootstrap.min.js" integrity="sha384-a5N7Y/aK3qNeh15eJKGWxsqtnX/wWdSZSKp+81YjTmS15nvnvxKHuzaWwXHDli+4" crossorigin="anonymous"></script>
        <script><%= footer %><script>
        </body>
    </html>
  `
const componentList = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Component List</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <ul>
        <% list.forEach(function(item){ %>
          <h2><a href="/component/<%= item %>"><%= item %></a></h2>
        <% }); %>
      </ul>
    </body>
  </html>
`
app.get('/component', (req, res, next) => {
  const componentDir = './component'
  readdir(componentDir, (err, files) => {
    if(err) {
      throw err
      return next(err)
    }

    const components = []
    files.map((name) => {
      const item = join(componentDir, name)
      if(isDirectory(item)){
        components.push(name)
      }
    })
    
    res.write(render(componentList, {list: components}))
    res.end()
  })
})

app.get('/component/:name', (req, res, next) => {
  const name = req.params.name
  const bodyId = req.query.id
  const htmlPath = `./component/${name}/${name}.html`
  const jsPath = `./component/${name}/${name}.js`
  const cssPath = `./component/${name}/${name}.css`
  readFile(htmlPath, function(err, htmlContent){
    readFile(jsPath, function(err, jsContent){
      readFile(cssPath, function(err, cssContent){

        if(!req.query.spf){
          // render component
          const data = {}
          data.css = cssContent ? cssContent : ''
          data.body = htmlContent ? htmlContent : ''
          data.footer = jsContent ? jsContent : ''
          res.write(render(componentHtml, data))
          res.end()
        } else {
          // send spf response
          const component = {}
          component.head = `<style>${cssContent}</style>`
          component.body = {}
          component.body[bodyId] = htmlContent.toString()
          component.foot = `<script>${jsContent}</script>`
          res.send(JSON.stringify(component))
        }
      })
    })
  })
})

app.get('/', (req, res) => {
  res.render('../template.html')
})

app.use(function (err, req, res, next) {
  if(err.code === 0000){
    res.redirect('/')
  }
})

const port = 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))