// HTML Elementos
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Game settings
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

//Game variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquare;
let moveInterval;

/*dibujamos la serpiente */
const drawSnake = () => {
    /* recorremos el array snake y por cada posicion de la vibora
    vanos a llamar a la funcion drawsquare la cual se encarga de asignarle
    al tablero el valor de snakeSquare en la posicion correspondiente */
    snake.forEach(square => drawSquare(square, 'snakeSquare')
    )
}
/*rellenamos cada cuadrado del tablero 
square= posicion del cuadrado
type: tipo de cuadrado
*/
const drawSquare = (square, type) => {
    /*creamos una variable row, y una column, donde la igualamos al square,haciendo uso
    del split para separar el primer caracter del segundo y asi asignarle el primer valor 
    a row y el segundo a column*/
    const [row, column] = square.split('');
    /*al tablero(boardSquare) le pasamos el valor de row y colum que obtuvimos arriba
    para posicionarnos en ese cuadro y asignarle el type, es decior si es un cuadro
    vacio es parte de la vivora o si es comida */
    boardSquares[row][column] = squareTypes[type];
    /*utilizamos una constante para traernos del html el elemento del tablero
    que tenga el mismo square que pasamos por parametros es decir el mismo id */
    const squareElement = document.getElementById(square)
    /*toammos el elemento que trajimos arriba y le setemaos el typo que obtuvimos 
    por parametro */
    console.log("tipo: "+ type)
    console.log("squareElement"+squareElement)
    if (squareElement) {
        squareElement.setAttribute('class', `square ${type}`);
    } else {
        console.error(`Elemento con id ${square} no encontrado.`);
    }

    /*si el tipo que vien por parametro es emtysquare , directamente le seteamos
    el valor de square al array emptySquare */
    if (type === 'emptySquare') {
        emptySquare.push(square)
    } else {
        /*en el caso de que en emptySquare se encuentre square, entra al condicional
        y esa posicion se borra indicandole que es 1 solo el elemento que sacamos*/
        if (emptySquare.indexOf(square) !== -1) {
            emptySquare.splice(emptySquare.indexOf(square), 1)
        }
    }

}
const moveSnake = () => {
    /*el newSquare es para hacer ver para donde se esta moviendo la serpiente
    y asi repetir la accion  */
    let newSquare = String(
        /*usamos Numbre por que necesitamos saber cual es le proximo cuadro al
        que se va a mover
        luego el array snake[] y para seleccionar el ultimo elemento del array usamos
        array.length -1
        a eso le sumamos la direction, la cual cuentan con un numero dependiendo para
        donde debe moverse si es para arriba =-10,abajo=10,derecha =1,izq =2
         */
        Number(snake[snake.length - 1] )+ directions[direction]
    )
    let row, column;
    console.log(snake)
    //luego seteamos a row y column el valor obtenido en el newSquare
    if (newSquare.length !== 2) {
         newSquare = "0" + newSquare;
    } 
    [row, column] = (newSquare).split('');
    console.log("column " +column)
    console.log("row" + row)
    headSnake = snake[snake.length -1]
    const [rowSnake,columnSnake] = headSnake.split('')
 
    /* corroboramos que la serpiente no salga dle cuadarado */
    if (
        newSquare < 0 /*si la serpiente se fue para arriba y choca con la pared */
        || newSquare > boardSize * boardSize /*es decir que la vibora se fue para abajo y paso de 99 */
        || (direction === 'ArrowRight' && columnSnake == 9)/*es decir que si va en direccion a la derecha y se pasa de nueve choca con pared derecha */
        || (direction === 'ArrowLeft' && columnSnake == 0)/*si va hacia la izq y es menor a 0 choca con pared izquierda */
        || boardSquares[row][column] === squareTypes.snakeSquare)/*si la posicion en el tablero esta ocupada por la vibora, choca sobre la misma y tambien termina el juego */ {
        gameOver();
    } else {
        /*agregamos la nueva posicion */
        snake.push(newSquare)
        /*consultamos si en la posicion hay una comida */
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            /*Llamamos a la funcion addFood */
            addFood();
        } else {
            /*usamos shift para borrar el primer elemento y lo guardamos en una constante */
            const emptySquare = snake.shift();
            /*luego usamos esa constante para indicarle que ahora esa posicione n el tablero
            esta vacia */
            drawSquare(emptySquare, 'emptySquare')
        }
        //volvemos a pintar la serpiente
        drawSnake();
    }
}
const addFood = () => {
    /*incrementamos el score en 1 */
    score++;
    /*actualizamos el score en el html */
    updateScore();
    /*creamos una nueva comida */
    createRandomFood();
}

const gameOver = () => {
    /*le damos un display block al game over signe */
    gameOverSign.style.display = 'block';
    /*terminamos el intervalo */
    clearInterval(moveInterval)
    /*mostramos el boton de finalizado */
    startButton.disabled = false;
}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        //Depende el code que venga en la key vamos a hacer que vaya para ese lado la serpiente
        case 'ArrowUp':
            //siempre chuequeamos que la bibora no pueda volverse para atras
            //en sentido contrario y luego le seteamos la nueva direccion a la vibora
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}
createRandomFood = () => {
    const randomEmptySquare = emptySquare[Math.floor(Math.random() * emptySquare.length)]
    drawSquare(randomEmptySquare, 'foodSquare')
}
const updateScore = () => {
    scoreBoard.innerText = score;
};

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            /*por cada elemento del array le vamos a setear lo siguiente*/
            /* creamos una constante y le asignamos el indice del primer forech y del segundo,desde 00 hasta 99*/
            const squareValue = `${rowIndex}${columnIndex}`;
            /*creamos un div dentro del elemento*/
            const squareElement = document.createElement('div');
            /* a ese div le asignamos una class para poder darle estilo luego*/
            squareElement.setAttribute('class', 'square emptySquare')
            /*le asignamos un id con el valor de la constante que creamos arriba y asi poder identificar el cuadro*/
            squareElement.setAttribute('id', squareValue)
            /*le seteamos al tablero el div creado arriva con los atributos ya seteados*/
            board.appendChild(squareElement)
            emptySquare.push(squareValue)

        });
    });

}

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare))
    /*borramos cualquier conetenido que tenga el board,seteandole un array vacio*/
    board.innerHTML = '';
    emptySquare = []
    createBoard();
}
const startGame = () => {
    setGame();
    /*seguimos sin mostrar el boton hasta que no termine el juego*/
    gameOverSign.style.display = 'none';
    /* y el boton de inicio lo desactivamos*/
    startButton.disabled = true;
    /*Dibujamos la serpiente*/
    drawSnake();
    updateScore();
    createRandomFood();
    //el siguiente evento se activa con las flceas telñ teclado
    document.addEventListener('keydown', directionEvent)
    moveInterval = setInterval(() => moveSnake(), gameSpeed)
}
startButton.addEventListener('click', startGame)