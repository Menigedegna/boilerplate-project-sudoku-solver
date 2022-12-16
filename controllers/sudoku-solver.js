class SudokuSolver {

  validate(puzzleString) {
    let error;
    //if puzzle is provided
    if (puzzleString) {
      // if valid characters in puzzle
      if (puzzleString.search(/[^1-9.]/) == -1) {
        //if valid puzzle length
        if (puzzleString.length == 81) {
          //then input is valid
          error = false;
        }//end if valid puzzle length
        else {
          error = "Expected puzzle to be 81 characters long";
        }
      }// end if valid characters in puzzle
      else {
        error = "Invalid characters in puzzle";
      }
    }//end if puzzle is provided
    else {
      error = "Required field missing";
    }
    return error;
  }

  checkIfAlreadyPlaced(puzzleString, row, column, value) {
    var alreadyPlaced = false;
    // split puzzleString into rows of 9 characters
    var rows = puzzleString.match(/(.{1,9})/g);
    var puzzleValue = rows[row][column];
    if (puzzleValue == value) {
      alreadyPlaced = true;
    }
    return alreadyPlaced;
  }

  checkRowPlacement(puzzleString, row, value) {
    var wrongPlacement = false;
    // split puzzleString into rows of 9 characters
    var rows = puzzleString.match(/(.{1,9})/g);
    // check occurence of value in row
    if (rows[row].indexOf(value) > -1) {
      wrongPlacement = "row";
    }
    return wrongPlacement;
  }

  checkColPlacement(puzzleString, column, value) {
    var wrongPlacement = false;
    //extract column <column> from puzzleString
    var columnMatch = puzzleString.match(/[1-9.]/g).filter((ch, idx) => idx % 9 == column);
    //check occurence of value in column
    if (columnMatch.indexOf(value) > -1) {
      wrongPlacement = "column";
    }
    return wrongPlacement;
  }

  getRegion(puzzleString, row, column) {
    // split puzzleString into rows of 9 characters
    var ArrayOfRows = puzzleString.match(/(.{1,9})/g);
    // select rows in region: offset of row is 0 if row<=3, 3 if 3<row<=6, else 6
    //number of rows in one region = 3
    var rowOffset = row < 3 ? 0 : row < 6 ? 3 : 6
    var regionRow = ArrayOfRows.slice(rowOffset, rowOffset + 3);

    // for each row select character in region : offset of col is 0 if column<=3, 3 if 3<column<=6, else 6
    //number of columns in one region = 3
    var colOffset = column < 3 ? 0 : column < 6 ? 3 : 6
    let regionColumn = regionRow.map((rw) => rw.slice(colOffset, colOffset + 3));

    //convert array of row into one string
    var region = regionColumn.join("");
    return region;
  }


  checkRegionPlacement(puzzleString, row, column, value) {
    var wrongPlacement = false;
    //get values in regions
    var region = this.getRegion(puzzleString, row, column);

    //check occurence of value in region
    if (region.indexOf(value) > -1) {
      wrongPlacement = "region";
    }
    return wrongPlacement;
  }

  checkPlacement(puzzleString, row, column, value) {
    var rightPlacement = false;
    if (this.checkRowPlacement(puzzleString, row, value) == false) {
      if (this.checkColPlacement(puzzleString, column, value) == false) {
        if (this.checkRegionPlacement(puzzleString, row, column, value) == false) {
          rightPlacement = true;
        }
      }
    }
    return rightPlacement;
  }

  solve(puzzleString) {
    // if no place in the grid is empty, then
    if (puzzleString.indexOf(".") == -1) {
      return [true, puzzleString];
    }
    //find offset of first missing value
    var offset = puzzleString.search(/[.]/);
    // get row for that offset
    var row = Math.floor(offset / 9);
    // get colum for that offset
    var column = offset % 9;
    // for number 1 to 9, until there is no missing value
    for (var number = 1; number < 10; number++) {
      // if number placement is valid, then
      if (this.checkPlacement(puzzleString, row, column, `${number}`)) {
        //add number in puzzle
        var puzzleArray = puzzleString.match(/[1-9.]/g)
        puzzleArray[offset] = number;
        puzzleString = puzzleArray.join("");
        // if solution is found
        var result = this.solve(puzzleString);
        if (result[0] == true) {
          return result;
        }
      }
    }
    return [false, puzzleString];
  }

}

module.exports = SudokuSolver;

