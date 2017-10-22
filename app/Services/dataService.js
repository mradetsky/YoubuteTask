'use strict';
angular.module('Test').factory('dataService',
    ['$http', '$q',
        function ($http, $q) {
            var firstRequest = null;
            var factory = {};

            
            factory.getData = function () {
                if (factory.data) {
                    return $q(function (resolve, reject) {
                        resolve(factory.data);
                    })
                }
                else {
                    return $http.get('local.json').then(function (result) {
                        factory.data = result.data;
                        return factory.data
                    });
                }
            }
            
   
    factory.getAlbums = function () {
        return factory.getData().then(function(){
            
            var albums = factory.data.map(x => {
                return {
                    id: x.id,
                    albumName: x.albumName,
                    albumDesc: x.albumDesc,
                    count: x.videos ? x.videos.length : 0
                }
            });
            return {  Data: albums, Total: albums.length };
        });
        
    }

    

    factory.addAlbum = function (album) {
        var newId = Math.max.apply(Math, factory.data.map(x => { return x.id })) + 1;
        album.id = newId;
        factory.data.push(album);
        
        return $q(function (resolve, reject) {
            resolve({ Data: album });
        })
    }

    factory.editAlbum = function (album) {
        var items = factory.data.filter(x => { return x.id == album.id });
        if (items.length > 0) {
            items[0].albumName = album.albumName;
            items[0].albumDesc = album.albumDesc;
        }
        
        return $q(function (resolve, reject) {
            resolve({ Data: album });
        })
    }

    factory.delAlbum = function (album) {
        var items = factory.data.filter(x => { return x.id == album.id });
        if (items.length > 0) {
            var i = factory.data.indexOf(items[0]);
            if (i != -1) {
                factory.data.splice(i, 1);
            }
            
        }
        
        return $q(function (resolve, reject) {
            resolve();
        })
    }


    factory.getAlbum = function (id) {
        return factory.getData().then(function () {

            var albums = factory.data.filter(x => {
                return x.id == id;
            }).map(x => {
                return {
                    id: x.id,
                    albumName: x.albumName,
                    albumDesc: x.albumDesc,
                    count: x.videos ? x.videos.length : 0
                }
                });
            if (albums.length > 0)
                return albums[0];
            else
                return null;
        });

    }

    factory.getSongs = function (albumId) {
        return factory.getData().then(function () {

            var albums = factory.data.filter(x => {
                return x.id == albumId;
            });
            if (albums.length > 0) {
                var songs = albums[0].videos.map(x => {
                    return {
                        id: x.id,
                        albumId: albumId,
                        songName: x.songName,
                        url: x.url,

                    };

                });

                return { Data: songs, Total: albums.length }
            }
            else
                return null;
        });

    }
    factory.valdateUrl = function (song) {
        if (song.url.indexOf('youtube.com') == -1)
        {
            alert('You should fill url from http://youtube.com')
            return false;
        }
        if (song.url.indexOf('/watch?v=') != -1) {
            alert('Url was changed to embedded!')
            song.url = song.url.replace('/watch?v=', '/embed/')
        }
        return true;
    }
    factory.addSong = function (song) {
        if (factory.valdateUrl(song)) {
            var albums = factory.data.filter(x => { return x.id == song.albumId });
            if (albums.length) {
                var newId = Math.max.apply(Math, albums[0].videos.map(x => { return x.id })) + 1;
                song.id = newId;
                albums[0].videos.push(song);
            }
            return $q(function (resolve, reject) {
                resolve({ Data: song });
            })
        }
        else {
            return $q(function (resolve, reject) {
                reject({ Data: song });
            })
        }

    }

    factory.editSong = function (song) {
        if (factory.valdateUrl(song)) {
            var albums = factory.data.filter(x => { return x.id == song.albumId });
            if (albums.length) {
                var songs = albums[0].videos.filter(x => x.id == song.id);
                if (songs.length) {
                    songs[0].songName = song.songName;
                    songs[0].url = song.url;
                }
            }

            return $q(function (resolve, reject) {
                resolve({ Data: song });
            })
        }
        else {
            return $q(function (resolve, reject) {
                reject({ Data: song });
            })
        }
    }

    factory.delSong = function (song) {
        var albums = factory.data.filter(x => { return x.id == song.albumId });
        if (albums.length > 0) {
            var songs = albums[0].videos.filter(x => x.id == song.id);
            if (songs.length) {
                songs[0].songName = song.songName;
                songs[0].url = song.url;
                var i = albums[0].videos.indexOf(items[0]);
                if (i != -1) {
                    albums[0].videos.splice(i, 1);
                }
            }

        }

        return $q(function (resolve, reject) {
            resolve();
        })
    }


    

    return factory;

}]);