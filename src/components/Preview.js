// import "./Preview.css";
import React from "react";
import styled from "styled-components";

import { buildBoard } from "../componentFunctions/Board";
import { transferToBoard } from "../componentFunctions/Tetrominoes";

import BoardCell from "./BoardCell";


const PreviewContainer = styled.div`
  position: absolute;
  top: 0;
  left: 72.2vw;
  background: rgba(0, 0, 0, 0.1);
  border: 10px solid rgba(0, 0, 0, 0);
  border-radius: 10px;
`;

const PreviewBoard = styled.div`
  display: grid;
  grid-gap: 2px;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(4, 1fr);
  width: 11vw;
  height: 11vw;
`;


const Preview = ({ tetromino, index }) => {
  const { shape, className } = tetromino;

  const board = buildBoard({ rows: 4, columns: 4 });

  const style = { top: `${index * 15}vw` };

  board.rows = transferToBoard({
    className,
    isOccupied: false,
    position: { row: 0, column: 0 },
    rows: board.rows,
    shape
  });

  return (
    <PreviewContainer style={style}>
      <PreviewBoard>
      {board.rows.map((row, y) =>
          row.map((cell, x) => (
            <BoardCell key={x * board.size.columns + x} cell={cell} />
          ))
        )}
      </PreviewBoard>
    </PreviewContainer>
  );
};

export default React.memo(Preview);
