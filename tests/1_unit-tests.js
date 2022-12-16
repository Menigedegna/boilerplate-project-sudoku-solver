const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const ss = new Solver();

suite('Unit Tests', () => {
  // #1
  test('Logic handles a valid puzzle string of 81 characters', function() {
    var validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(ss.validate(validPuzzle), false);
  });
  // #2
  test('Logic handles a puzzle string with invalid characters(not 1 - 9 or.)', function() {
    var invalidPuzzle = "..9..5.1.85.4....ASFD......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(ss.validate(invalidPuzzle), "Invalid characters in puzzle");
  });
  // #3
  test('Logic handles a puzzle string that is not 81 characters in length', function() {
    var invalidPuzzle = "..9..5.1.85.4....2432......1...69.83.9.";
    assert.equal(ss.validate(invalidPuzzle), "Expected puzzle to be 81 characters long");
  });
  // #4
  test('Logic handles a valid row placement', function() {
    var validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var row = 0;
    var value = "7";
    var expectedResult = false;
    assert.equal(ss.checkRowPlacement(validPuzzle, row, value), expectedResult);
  });
  // #5
  test('Logic handles an invalid row placement', function() {
    var validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var row = 0;
    var value = "9";
    var expectedResult = "row";
    assert.equal(ss.checkRowPlacement(validPuzzle, row, value), expectedResult);
  });
  // #6
  test('Logic handles a valid column placement', function() {
    var validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var column = 0;
    var value = "7";
    var expectedResult = false;
    assert.equal(ss.checkColPlacement(validPuzzle, column, value), expectedResult);
  });
  // #7
  test('Logic handles an invalid column placement', function() {
    var validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var column = 0;
    var value = "8";
    var expectedResult = "column";
    assert.equal(ss.checkColPlacement(validPuzzle, column, value), expectedResult);
  });
  // #8
  test('Logic handles a valid region(3x3 grid) placement', function() {
    var validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var column = 0;
    var row = 0;
    var value = "7";
    var expectedResult = false;
    assert.equal(ss.checkRegionPlacement(validPuzzle, row, column, value), expectedResult);
  });
  // #9
  test('Logic handles an invalid region(3x3 grid) placement', function() {
    var validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    var column = 0;
    var row = 0;
    var value = "9";
    var expectedResult = "region";
    assert.equal(ss.checkRegionPlacement(validPuzzle, row, column, value), expectedResult);
  });
  // #10
  test('Valid puzzle strings pass the solver', function() {
    var validPuzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isArray(ss.solve(validPuzzle));
    assert.isTrue(ss.solve(validPuzzle)[0]);
  });
  // #11
  test('Invalid puzzle strings fail the solver', function() {
    var validPuzzle = "2.9..5.1.45.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isArray(ss.solve(validPuzzle));
    assert.isNotTrue(ss.solve(validPuzzle)[0]);
  });
  // #12
  test('Solver returns the expected solution for an incomplete puzzle', function() {
    var validPuzzle = "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
    var expectedResult = '827549163531672894649831527496157382218396475753284916962415738185763249374928651'
    assert.isArray(ss.solve(validPuzzle));
    assert.isTrue(ss.solve(validPuzzle)[0]);
    assert.equal(ss.solve(validPuzzle)[1], expectedResult);
  });
});
