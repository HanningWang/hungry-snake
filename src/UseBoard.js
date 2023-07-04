import { useState, useEffect } from "react";

const ROW_COUNT = 12;
const COLUMN_COUNT = 20;

export default function useBoard(score, setScore, setEndGame) {
    const [snake, setSnake] = useState(Array.of(getRandomPosition()));
    const [food, setFood] = useState(() => initializeFood());
    const [display, setDisplay] = useState(Array.from(Array(ROW_COUNT), ()=> Array(COLUMN_COUNT).fill(0)));
    // 1: right, 2: down, -1: left, -2: up
    const [direction, setDirection] = useState(1);
    const [speed, setSpeed] = useState(1)

    useEffect(updateDisplay, [snake, food]);
    useEffect(() => {
        const interval = setInterval(() => {
            const x = (direction % 2 === 0) ? Math.floor(direction/2) : 0;
            const y = direction - 2*x;
            movePosition(x,y);
        }, 600/speed);
        return () => clearInterval(interval)
    } ,[direction, snake, food, display, speed]);

    function getRandomPosition() {
        const x = Math.floor(Math.random() * ROW_COUNT);
        const y = Math.floor(Math.random() * COLUMN_COUNT);
    
        return {x: x, y: y};
    }
    
    function initializeFood() {
        let food;
        do {
            food = getRandomPosition();
        } while(snake[0].x === food.x && snake[0].y === food.y)

        return food;
    }

    function generateRandomFoodPosition() {
        let newFood;
        do {
            newFood = getRandomPosition();
        } while(display[newFood.x][newFood.y] !== 0)

        return newFood;
    }

    function onKeyDown(event) {
        switch(event.key) {
            case 'ArrowDown':
                movePosition(1, 0);
                event.preventDefault();
                break;
            case 'ArrowRight':
                movePosition(0, 1);
                event.preventDefault();
                break;
            case 'ArrowLeft':
                movePosition(0, -1);
                event.preventDefault();
                break;
            case 'ArrowUp':
                movePosition(-1, 0);
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    function movePosition(x, y) {
        const moveDirection = x*2 + y;

        if(!isValidDirection(moveDirection)) {
            return;
        } 

        const nextPosition = {x: snake[0].x + x, y: snake[0].y + y};
        if(!isValidPosition(nextPosition)) {
            setEndGame(true);
            return;
        }

        const newSnake = snake.slice();

        if(reachFood(nextPosition)) {
            const newFood = generateRandomFoodPosition();
            setFood(newFood);
            newSnake.unshift(nextPosition);
            setScore(score + 100*speed);
            setSpeed(Math.floor(newSnake.length/5) + 1);
        } else {
            newSnake.unshift(nextPosition);
            newSnake.pop();
        }

        setDirection(moveDirection);
        setSnake(newSnake);
        updateDisplay();
    }

    function updateDisplay() {
        const result = Array.from(Array(ROW_COUNT), ()=> Array(COLUMN_COUNT).fill(0));

        snake.forEach(point => result[point.x][point.y] = 1);
        result[food.x][food.y] = 2;

        setDisplay(result);
    }

    function isValidDirection(moveDirection) {
        return moveDirection + direction !== 0;
    }

    function isValidPosition(nextPosition) {
        if (nextPosition.x < 0 || nextPosition.x >= ROW_COUNT 
            || nextPosition.y < 0 || nextPosition.y >= COLUMN_COUNT) {
                return false;
            }
        if (nextPosition.x === food.x && nextPosition.y === food.y) {
            return true;
        }
        return display[nextPosition.x][nextPosition.y] === 0;
    }

    function reachFood(nextPosition) {
        return nextPosition.x === food.x && nextPosition.y === food.y
    }

    return [display, onKeyDown, speed];
}