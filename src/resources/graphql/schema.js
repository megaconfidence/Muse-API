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
        return Album.find({ artist: [pVal._id] })
          .lean()
          .exec()
      }
    },
    songs: {
      type: new GraphQLList(songType),
      async resolve(pVal, args) {
        const albums = await Album.find({ artist: [pVal._id] })
        return await Song.find({ album: albums })
          .lean()
          .exec()
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
        return Album.find({ genre: [pVal._id] })
          .lean()
          .exec()
      }
    },
    songs: {
      type: new GraphQLList(songType),
      async resolve(pVal, args) {
        const albums = await Album.find({ genre: [pVal._id] })
        return await Song.find({ album: albums })
          .lean()
          .exec()
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
        return Genre.find({ _id: pVal.genre })
          .lean()
          .exec()
      }
    },
    artist: {
      type: GraphQLList(ArtistType),
      resolve(pVal, args) {
        return Artist.find({ _id: pVal.artist })
          .lean()
          .exec()
      }
    },
    songs: {
      type: new GraphQLList(songType),
      resolve(pVal, args) {
        return Song.find({ album: pVal._id })
          .lean()
          .exec()
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
        return Album.findOne({ _id: pVal.album })
          .lean()
          .exec()
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
        } catch (e) {
          console.log(e)
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
        return Artist.findOne({ _id: args._id })
          .lean()
          .exec()
      }
    },
    song: {
      type: songType,
      args: { _id: { type: GraphQLNonNull(GraphQLString) } },
      resolve(pVal, args) {
        return Song.findOne({ _id: args._id })
          .lean()
          .exec()
      }
    },
    album: {
      type: AlbumType,
      args: { _id: { type: GraphQLNonNull(GraphQLString) } },
      resolve(pVal, args) {
        return Album.findOne({ _id: args._id })
          .lean()
          .exec()
      }
    },
    genre: {
      type: GenreType,
      args: { _id: { type: GraphQLNonNull(GraphQLString) } },
      resolve(pVal, args) {
        return Genre.findOne({ _id: [args._id] })
          .lean()
          .exec()
      }
    },
    allAlbums: {
      type: GraphQLList(AlbumType),
      args: { page: { type: GraphQLInt } },
      resolve(pVal, args) {
        const limit = 10
        return Album.find()
          .skip(args.page * limit - limit)
          .limit(limit)
          .lean()
          .exec()
      }
    },
    allArtists: {
      type: GraphQLList(ArtistType),
      args: { page: { type: GraphQLInt } },
      resolve(pVal, args) {
        const limit = 20
        return Artist.find()
          .skip(args.page * limit - limit)
          .limit(limit)
          .lean()
          .exec()
      }
    },
    allGenre: {
      type: GraphQLList(GenreType),
      args: { page: { type: GraphQLInt } },
      resolve(pval, args) {
        const limit = 20
        return Genre.find()
          .skip(args.page * limit - limit)
          .limit(limit)
          .lean()
          .exec()
      }
    },
    count: {
      type: GraphQLString,
      args: { type: { type: GraphQLString } },
      resolve(pVal, args) {
        if (args.type === 'genre') {
          return Genre.countDocuments({})
        } else if (args.type === 'album') {
          return Album.countDocuments({})
        } else if (args.type === 'artist') {
          return Artist.countDocuments({})
        }
      }
    },
    searchSongs: {
      type: GraphQLList(songType),
      args: { query: { type: GraphQLString } },
      resolve(pVal, args) {
        return Song.find({ name: { $regex: args.query, $options: 'i' } })
      }
    },
    searchAlbums: {
      type: GraphQLList(AlbumType),
      args: { query: { type: GraphQLString } },
      resolve(pVal, args) {
        return Album.find({ name: { $regex: args.query, $options: 'i' } })
      }
    },
    searchArtist: {
      type: GraphQLList(ArtistType),
      args: { query: { type: GraphQLString } },
      resolve(pVal, args) {
        return Artist.find({ name: { $regex: args.query, $options: 'i' } })
      }
    },
    searchGenre: {
      type: GraphQLList(ArtistType),
      args: { query: { type: GraphQLString } },
      resolve(pVal, args) {
        return Genre.find({ name: { $regex: args.query, $options: 'i' } })
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
