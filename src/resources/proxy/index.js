import cheerio from 'cheerio'
import fetch from 'node-fetch'

const proxy = async (req, res) => {
  try {
    const page = await fetch(req.body.albumUrl)
      .then(res => res.text())
      .then(body => body)

    const $ = cheerio.load(page)
    const playDiv = $('body')
      .find(`#${req.body.playId}`)
      .find('span.ico')
      .attr('data-url')
    if (playDiv) {
      res.send({
        _id: req.body.playId.replace('play_', ''),
        url: 'https://myzuka.club' + playDiv
      })
    } else {
      res.status(400).end()
    }
  } catch (err) {
    res.status(400).end()
  }
}

export default proxy
