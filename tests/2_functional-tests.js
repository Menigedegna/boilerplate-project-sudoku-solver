const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = process.env.SERVER;

chai.use(chaiHttp);

suite('Functional Tests', () => {
  // #1
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
    var expectedSolution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.solution, expectedSolution);
        done();
      });
  });
  // #2
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
    var expectedMessage = 'Required field missing';
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: ""
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, expectedMessage);
        done();
      });
  });
  // #3
  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
    var expectedMessage = 'Invalid characters in puzzle';
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..END"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, expectedMessage);
        done();
      });
  });
  // #4
  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
    var expectedMessage = 'Expected puzzle to be 81 characters long';
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.."
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, expectedMessage);
        done();
      });
  });
  // #5
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
    var expectedMessage = 'Puzzle cannot be solved';
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: "2.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, expectedMessage);
        done();
      });
  });
  // #6
  test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
    var expectedMessage = { valid: true };
    var puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var coordinate = "A1";
    var value = "7";
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.deepEqual(res.body, expectedMessage);
        done();
      });
  });
  // #7
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
    var expectedMessage = {
      valid: false,
      conflict: ["column"]
    };
    var puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var coordinate = "A1";
    var value = "6";
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.deepEqual(res.body, expectedMessage);
        done();
      });
  });
  // // #8
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
    var expectedMessage = {
      valid: false,
      conflict: ["row", "region"]
    };
    var puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var coordinate = "A1";
    var value = "9";
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.deepEqual(res.body, expectedMessage);
        done();
      });
  });
  // // #9
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
    var expectedMessage = {
      valid: false,
      conflict: ["row", "column", "region"]
    };
    var puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var coordinate = "B3";
    var value = "2";
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.deepEqual(res.body, expectedMessage);
        done();
      });
  });
  // #10
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
    var expectedMessage = "Required field(s) missing";
    var puzzle = "";
    var coordinate = "";
    var value = "";
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, expectedMessage);
        done();
      });
  });
  // #11
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
    var expectedMessage = 'Invalid characters in puzzle';
    var puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..END";
    var coordinate = "A1";
    var value = "2";
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value 
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, expectedMessage);
        done();
      });
  });
  // #12
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
    var expectedMessage = 'Expected puzzle to be 81 characters long';
    var puzzle = "..9..5.1.85.4....2432......1...69.83.9...";
    var coordinate = "A1";
    var value = "2";
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value 
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, expectedMessage);
        done();
      });
  });
  // #13
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
    var expectedMessage = 'Invalid coordinate';
    var puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var coordinate = "thisIsWrong";
    var value = "2";
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value 
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, expectedMessage);
        done();
      });
  });
  // #14
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
    var expectedMessage = 'Invalid value';
    var puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var coordinate = "thisIsWrong";
    var value = "10000";
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: coordinate,
        value: value 
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, expectedMessage);
        done();
      });
  });
});

