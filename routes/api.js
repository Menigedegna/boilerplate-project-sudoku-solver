'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const ss = new SudokuSolver();

module.exports = function(app) {

  app.route('/api/check')
    .post(checkInput, (req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;

      // if all inputs are valid
      if (!req.error) {
        //extract row and column from coordinate
        let row = coordinate.match(/[a-i]/i)[0];
        let column = coordinate.match(/[1-9]/)[0] - 1;
        // row: convert character into integer
        let dic = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9 };
        row = dic[row.toLowerCase()] - 1;
        //if value is not alreay placed in puzzle
        if (!ss.checkIfAlreadyPlaced(puzzle, row, column, value)) {
          let wrongPlacement = false;
          let conflict = [];

          //CHECK ROW PLACEMENT
          wrongPlacement = ss.checkRowPlacement(puzzle, row, value);
          if (wrongPlacement) conflict.push(wrongPlacement);
          //CHECK COLUMN PLACEMENT
          wrongPlacement = ss.checkColPlacement(puzzle, column, value);
          if (wrongPlacement) conflict.push(wrongPlacement);
          //CHECK REGION PLACEMENT
          wrongPlacement = ss.checkRegionPlacement(puzzle, row, column, value);
          if (wrongPlacement) conflict.push(wrongPlacement);

          //if there is conflict
          if (conflict.length > 0) {
            res.send({
              valid: false,
              conflict: conflict
            });
          }
          else {
            res.send({ valid: true });
          }
        }//end if value is alreay placed in puzzle
        else {
          res.send({ valid: true });
        }
      } //end if all inputs are valid
      else {
        res.send({ error: req.error });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      //if input is valid
      let inputError = ss.validate(puzzle);
      if (!inputError) {
        let result = ss.solve(puzzle);
        //if there are no missing values in solution
        if (result[0]) {
          let solution = result[1];
          res.send({ solution: solution });
        } else {
          res.send({ error: "Puzzle cannot be solved" });
        }
      }//end if input is valid
      else {
        res.send({ error: inputError });
      }
    });
};

function checkInput(req, res, next) {
  /* CHECK ALL INPUTS ARE VALID*/
  let value = req.body.value;
  let coordinate = req.body.coordinate;
  let puzzle = req.body.puzzle;

  //if value, coordinate and puzzle are provided
  if (value && coordinate && puzzle) {
    /* CHECK INPUT PUZZLE */
    let puzzleInputError = ss.validate(puzzle);
    // if valid puzzle input
    if (!puzzleInputError) {
      /*CHECK INPUT VALUE */
      let matchDigits = value.match(/[1-9]/g);
      if (
        //there is a digit in value
        matchDigits
        //there is only one digit
        && matchDigits.length == 1
        //there isn't anything else in value
        && value.length == 1) {
        /* CHECK INPUT COORDINATE */
        let matchDigit = coordinate.match(/[1-9]/g);
        let matchChar = coordinate.match(/[a-i]/gi);
        let firstChar = coordinate.search(/[a-i]/i);
        let firstDigit = coordinate.search(/[1-9]/);
        if (
          // there is a number and a character in coordinate
          matchChar && matchDigit
          //there is only one digit
          && matchDigit.length == 1
          // there is only one character
          && matchChar.length == 1
          // character comes before digit
          && firstChar < firstDigit
          //there isn't anything else
          && coordinate.length == 2) {
          req.error = false;
        }//end if valid coordinate
        else {
          req.error = "Invalid coordinate";
        }
      }//end if valid value
      else {
        req.error = "Invalid value";
      }
    }// end if valid puzzle input
    else {
      req.error = puzzleInputError;
    }
  }//end if value, coordinate and puzzle are provided
  else {
    req.error = "Required field(s) missing";
  }
  next();
}
