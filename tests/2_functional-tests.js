const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let idtest = null;

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('POST /api/books with title => create book object/expect book object', () => {
    test('Test POST /api/books with title', function (done) {
      chai.request(server)
        .post('/api/books')
        .send({ title: 'Title test 1' })
        .end(function (err, res) {
          assert.equal(res.status, 200)
          assert.equal(res.body.title, 'Title test 1')
          assert.isArray(res.body.comments);
          assert.lengthOf(res.body.comments, 0)
          assert.property(res.body, 'commentcount');
          assert.property(res.body, 'title');
          assert.property(res.body, '_id');
          idtest = res.body._id
          done();
        });
    });
    test('Test POST /api/books with no title given', function (done) {
      chai.request(server)
        .post('/api/books')
        .send()
        .end((err, res) => {
          assert.equal(res.body, 'missing required field title')
          done()
        })
    });
  });

  suite('GET /api/books => array of books', () => {
    test('Test GET /api/books', function (done) {
      chai.request(server)
        .get('/api/books')
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        })
    });
  });

  suite('GET /api/books/[id] => book object with [id]', () => {
    test('Test GET /api/books/[id] with id not in db', done => {
      chai.request(server)
        .get('/api/books/idfail')
        .end((err, res) => {
          assert.equal(res.body, 'no book exists')
          done()
        })
    });
    test('Test GET /api/books/[id] with valid id in db', done => {
      chai.request(server)
        .get('/api/books/' + idtest)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body._id, idtest)
          done()
        })
    });
  });

  suite('POST /api/books/[id] => add comment/expect book object with id', function () {
    test('Test POST /api/books/[id] with comment', function (done) {
      chai.request(server)
        .post('/api/books/' + idtest)
        .send({ _id: idtest, comment: 'comment test' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body.comments)
          assert.equal(res.body.comments[res.body.comments.length - 1], 'comment test')
          done()
        })
    });
    test('Test POST /api/books/[id] without comment field', function (done) {
      chai.request(server)
        .post('/api/books/' + idtest)
        .send({ _id: idtest })
        .end((err, res) => {
          assert.equal(res.body, 'missing required field comment')
          done()
        });
    });
    test('Test POST /api/books/[id] with comment, id not in db', function (done) {
      chai.request(server)
        .post('/api/books/idInvalid')
        .send({ _id: 'idInvalid', comment: 'comment test 2' })
        .end((err, res) => {
          assert.equal(res.body, 'no book exists')
          done()
        });
    });
  });

  suite('DELETE /api/books/[id] => delete book object id', function () {
    test('Test DELETE /api/books/[id] with valid id in db', function (done) {
      chai.request(server)
        .delete('/api/books/'+idtest)
        .send({ _id: idtest })
        .end((err, res) => {
          assert.equal(res.body, 'delete successful')
          done()
        })
    });
    test('Test DELETE /api/books/[id] with  id not in db', function (done) {
      chai.request(server)
        .delete('/api/books/idInvalid')
        .send({ _id: 'idInvalid' })
        .end((err, res) => {
          assert.equal(res.body, 'no book exists')
          done()
        })
    });
  });
 /*
  after(() => chai.request(server).get('/'))
  */
 /*
after(function() {
  chai.request(server)
    .get('/')
  });
 */
});