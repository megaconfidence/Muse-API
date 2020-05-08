import {
  GraphQLList,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInt
} from 'graphql'
import { Album } from './model/album'
import { Song } from './model/song'
import { Artist } from './model/artist'
import { Genre } from './model/genre'
import cheerio from 'cheerio'
import fetch from 'node-fetch'

const ArtistType = new GraphQLObjectType({
  name: 'Artist',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    album: {
      type: GraphQLList(AlbumType),
      resolve(pVal, args) {
        try {
          return Album.find({ artist: [pVal._id] })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve album from artist type')
          return null
        }
      }
    },
    songs: {
      type: new GraphQLList(songType),
      async resolve(pVal, args) {
        try {
          const albums = await Album.find({ artist: [pVal._id] })
          return await Song.find({ album: albums })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve songs from artist type')
          return null
        }
      }
    }
  })
})
const GenreType = new GraphQLObjectType({
  name: 'Genre',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    album: {
      type: GraphQLList(AlbumType),
      resolve(pVal, args) {
        try {
          return Album.find({ genre: [pVal._id] })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve albums from genre type')
          return null
        }
      }
    },
    songs: {
      type: new GraphQLList(songType),
      async resolve(pVal, args) {
        try {
          const albums = await Album.find({ genre: [pVal._id] })
          return await Song.find({ album: albums })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve songs from genre type')
          return null
        }
      }
    }
  })
})

const AlbumType = new GraphQLObjectType({
  name: 'Album',
  fields: () => ({
    _id: { type: GraphQLString },
    url: { type: GraphQLString },
    name: { type: GraphQLString },
    year: { type: GraphQLString },
    cover: { type: GraphQLString },
    genre: {
      type: GraphQLList(GenreType),
      resolve(pVal, args) {
        try {
          return Genre.find({ _id: pVal.genre })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve genre from album type')
          return null
        }
      }
    },
    artist: {
      type: GraphQLList(ArtistType),
      resolve(pVal, args) {
        try {
          return Artist.find({ _id: pVal.artist })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve artist from album type')
          return null
        }
      }
    },
    songs: {
      type: new GraphQLList(songType),
      resolve(pVal, args) {
        try {
          return Song.find({ album: pVal._id })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve songs from album type')
          return null
        }
      }
    }
  })
})

const songType = new GraphQLObjectType({
  name: 'Song',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    playId: { type: GraphQLString },
    duration: { type: GraphQLString },

    album: {
      type: AlbumType,
      resolve(pVal, args) {
        try {
          return Album.findOne({ _id: pVal.album })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve album from songs type')
          return null
        }
      }
    },
    artist: {
      type: GraphQLList(ArtistType),
      async resolve(pVal, args) {
        try {
          const album = await Album.findOne({ _id: pVal.album })
            .lean()
            .exec()
          return Artist.find({ _id: album.artist })
        } catch (err) {
          console.log('could not resolve artist from songs type')
          return null
        }
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    artist: {
      type: ArtistType,
      args: { _id: { type: GraphQLNonNull(GraphQLString) } },
      resolve(pVal, args) {
        try {
          return Artist.findOne({ _id: args._id })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve artist from root query')
          return null
        }
      }
    },
    song: {
      type: songType,
      args: { _id: { type: GraphQLNonNull(GraphQLString) } },
      resolve(pVal, args) {
        try {
          return Song.findOne({ _id: args._id })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve song from root query')
          return null
        }
      }
    },
    album: {
      type: AlbumType,
      args: { _id: { type: GraphQLNonNull(GraphQLString) } },
      resolve(pVal, args) {
        try {
          return Album.findOne({ _id: args._id })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve album from root query')
          return null
        }
      }
    },
    genre: {
      type: GenreType,
      args: { _id: { type: GraphQLNonNull(GraphQLString) } },
      resolve(pVal, args) {
        try {
          return Genre.findOne({ _id: [args._id] })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve genre from root query')
          return null
        }
      }
    },
    allAlbums: {
      type: GraphQLList(AlbumType),
      args: { page: { type: GraphQLInt } },
      resolve(pVal, args) {
        try {
          const limit = 10
          return Album.find()
            .skip(args.page * limit - limit)
            .limit(limit)
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve allalbums from root query')
          return null
        }
      }
    },
    allArtists: {
      type: GraphQLList(ArtistType),
      args: { page: { type: GraphQLInt } },
      resolve(pVal, args) {
        try {
          const limit = 20
          return Artist.find()
            .skip(args.page * limit - limit)
            .limit(limit)
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve allartist from root query')
          return null
        }
      }
    },
    allGenre: {
      type: GraphQLList(GenreType),
      args: { page: { type: GraphQLInt } },
      resolve(pval, args) {
        try {
          const limit = 20
          return Genre.find()
            .skip(args.page * limit - limit)
            .limit(limit)
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve allgenre from root query')
          return null
        }
      }
    },
    genreSongs: {
      type: GraphQLList(songType),
      args: { id: { type: GraphQLString }, page: { type: GraphQLInt } },
      async resolve(pval, args) {
        try {
          const limit = 5
          const albums = await Album.find({ genre: [args.id] })
            .skip(args.page * limit - limit)
            .limit(limit)
          return await Song.find({ album: albums })
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve allgenre from root query')
          return null
        }
      }
    },
    genreSongsCount: {
      type: GraphQLInt,
      args: { id: { type: GraphQLString } },
      async resolve(pval, args) {
        try {
          const albums = await Album.find({ genre: [args.id] })
          return await Song.countDocuments({
            album: albums
          })
        } catch (err) {
          console.log('could not resolve genresongscount from root query')
          return null
        }
      }
    },
    count: {
      type: GraphQLInt,
      args: { type: { type: GraphQLString } },
      resolve(pVal, args) {
        try {
          if (args.type === 'genre') {
            return Genre.estimatedDocumentCount()
          } else if (args.type === 'album') {
            return Album.estimatedDocumentCount()
          } else if (args.type === 'artist') {
            return Artist.estimatedDocumentCount()
          }
        } catch (err) {
          console.log('could not resolve count from root query')
          return null
        }
      }
    },
    countSearch: {
      type: GraphQLInt,
      args: { type: { type: GraphQLString }, query: { type: GraphQLString } },
      resolve(pVal, args) {
        try {
          if (args.type.includes('genre')) {
            return Genre.countDocuments({
              name: { $regex: args.query, $options: 'i' }
            })
          } else if (args.type.includes('album')) {
            return Album.countDocuments({
              name: { $regex: args.query, $options: 'i' }
            })
          } else if (args.type.includes('song')) {
            return Song.countDocuments({
              name: { $regex: args.query, $options: 'i' }
            })
          } else if (args.type.includes('artist')) {
            return Artist.countDocuments({
              name: { $regex: args.query, $options: 'i' }
            })
          }
        } catch (err) {
          console.log('could not resolve countsearch from root query')
          return null
        }
      }
    },
    searchSongs: {
      type: GraphQLList(songType),
      args: { page: { type: GraphQLInt }, query: { type: GraphQLString } },
      resolve(pVal, args) {
        try {
          const limit = 20
          return Song.find({ name: { $regex: args.query, $options: 'i' } })
            .skip(args.page * limit - limit)
            .limit(limit)
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve songsongs from root query')
          return null
        }
      }
    },
    searchAlbums: {
      type: GraphQLList(AlbumType),
      args: { page: { type: GraphQLInt }, query: { type: GraphQLString } },
      resolve(pVal, args) {
        try {
          const limit = 20
          return Album.find({ name: { $regex: args.query, $options: 'i' } })
            .skip(args.page * limit - limit)
            .limit(limit)
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve searchalbums from root query')
          return null
        }
      }
    },
    searchArtist: {
      type: GraphQLList(ArtistType),
      args: { page: { type: GraphQLInt }, query: { type: GraphQLString } },
      resolve(pVal, args) {
        try {
          const limit = 20
          return Artist.find({ name: { $regex: args.query, $options: 'i' } })
            .skip(args.page * limit - limit)
            .limit(limit)
            .lean()
            .exec()
        } catch (err) {
          console.log('could not resolve searchartist from root query')
          return null
        }
      }
    },
    searchGenre: {
      type: GraphQLList(ArtistType),
      args: { query: { type: GraphQLString } },
      resolve(pVal, args) {
        try {
          return Genre.find({ name: { $regex: args.query, $options: 'i' } })
        } catch (err) {
          console.log('could not resolve searchgenre from root query')
          return null
        }
      }
    },
    getSongUrl: {
      type: new GraphQLObjectType({
        name: 'songurl',
        fields: {
          _id: { type: GraphQLString },
          url: { type: GraphQLString }
        }
      }),
      args: {
        playId: { type: GraphQLString },
        albumUrl: { type: GraphQLString }
      },
      async resolve(pVal, args) {
        try {
          const page = await fetch(args.albumUrl)
            .then(res => res.text())
            .then(body => body)

          const $ = cheerio.load(page)
          const playDiv = $('body')
            .find(`#${args.playId}`)
            .find('span.ico')
            .attr('data-url')
          if (playDiv) {
            return {
              _id: args.playId.replace('play_', ''),
              url: 'https://myzuka.club' + playDiv
            }
          } else {
            return null
          }
        } catch (err) {
          console.log(err)
          return null
        }
      }
    }
  }
})

export default new GraphQLSchema({
  query: RootQuery
})
