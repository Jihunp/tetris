import { cells } from "./Cell"
import { movePlayer } from "../componentFunctions/PlayerController"
import { transferToBoard } from "./Tetrominoes";

export const buildBoard = ({ rows, columns }) => {
  const builtBoard = Array.from({ length: rows }, () =>
    Array.from ({ length: columns}, () => ({...cells}))
  );

  return {
    rows: builtBoard,
    size: {rows, columns}
  };
};

const findDropPosition = ({ board, position, shape }) => {
  let max = board.size.rows - position.row + 1;
  let row = 0;

  for(let i = 0; i < max; i++) {
    const delta = { row: i, column: 0 };
    const result = movePlayer({ delta, position, shape, board });
    const { collided } = result;

    if (collided) {
      break;
    }

    row = position.row + i;
  }
  return { ...position, row };
}



export const nextBoard = ({ board, player, resetPlayer, addLinesCleared }) => {
  const { tetromino, position } = player;
  let rows = board.rows.map((row) =>
    row.map((cell) => (cell.occupied ? cell : { ...cells }))
  );

  //drop position
  const dropPosition = findDropPosition({
    board,
    position,
    shape: tetromino.shape
  });

  //ghost 
  const className = `${tetromino.className} ${
    player.isFastDrop ? "" : "ghost"
  }`;
  rows = transferToBoard({
    className,
    isOccupied: player.isFastDrop,
    position: dropPosition,
    rows,
    shape: tetromino.shape
  });


  if (!player.isFastDrop) {
    rows = transferToBoard({
      className: tetromino.className,
      isOccupied: player.collided,
      position,
      rows,
      shape: tetromino.shape
    });
  }

  //clear lines
  const blankRow = rows[0].map((_) => ({ ...cells }));
  let linesCleared = 0;
  rows = rows.reduce((acc, row) => {
    if (row.every((column) => column.occupied)) {
      linesCleared++;
      acc.unshift([...blankRow]);
    } else {
      acc.push(row);
    }

    return acc;
  }, []);

  if (linesCleared > 0) {
    addLinesCleared(linesCleared);
  }

  if(player.collided || player.isFastDrop) {
    resetPlayer();
  }

  return {
    rows,
    size: {...board.size}
  }
}

export const hasCollision = ({ board, position, shape }) => {
  for(let y = 0; y < shape.length; y++) {
    const row = y + position.row;

    for(let x = 0; x < shape[y].length; x++) {
      if(shape[y][x]) {
        const column = x + position.column;

        if(
          board.rows[row] &&
          board.rows[row][column] &&
          board.rows[row][column].occupied
        ) {
          return true;
        }
      }
    }
  }
}


export const isWithinBoard = ({ board, position, shape }) => {
  for (let y = 0; y <shape.length; y++) {
    const row = y + position.row;

    for(let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const column = x + position.column;
        const isValidPosition = board.rows[row] && board.rows[row][column]
        
        if (!isValidPosition) return false;
      }
    }
  }

  return true;
}