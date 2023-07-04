import { memo, useState } from "react";
import useBoard from "./UseBoard";

const Board = () => {
const [score, setScore] = useState(0);
const [endGame, setEndGame] = useState(false);
const [display, onKeyDown, speed] = useBoard(score, setScore, setEndGame);

if(endGame) {
    return (
        <div>Game Over</div>
    )
} else {
    return (
        <div id="mydiv" tabindex="0" onKeyDown={onKeyDown}>
            score: {score}  speed: {speed}
            {display.map((row) => <Row row={row}/>)}
        </div>
    )
}
}


const Row = memo(props => {
    return (
        <span className='t-row'> {props.row.map((cell) => <Cell cell={cell}/>)}</span>
    )
})

const Cell = memo(props => {
    return (
        <span className={`t-cell t-cell-${props.cell}`}/>
    )
})

export default memo(Board);