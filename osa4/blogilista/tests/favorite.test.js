const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
    const listWithOneBlog = [
        {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
        }
    ]

    const listWithThreeBlogs = [
        {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
        },
        {
        _id: '69401204cfbc832e22fb45dc',
        title: 'blogi yksi',
        author: 'kirjoittaja',
        url: 'http://www.bloginosoite.com',
        likes: 15,
        __v: 0
        },
        {
        _id: '69415912bdda66dbf500e92d',
        title: 'Blogin lisäys listaan',
        author: 'Erkki Esimerkki',
        url: 'http://example.com',
        likes: 3,
        __v: 0
        },
    ]

    test('Only one blog in the list is the favorite', () => {
       const result = listHelper.favoriteBlog(listWithOneBlog)
       assert.strictEqual(result, listWithOneBlog[0])
    })
    test('Three blogs, second has most likes', () => {
       const result = listHelper.favoriteBlog(listWithThreeBlogs)
       assert.strictEqual(result, listWithThreeBlogs[1])
    })
})    
