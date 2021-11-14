/**
* Class Cell
*/
class Cell{
	#neighbours=null;
    #token=null;
    #node = null;

    /**
    * Creates an instance of the class Cell
	* @param {Array<Cell>|null} neighbours
    * @param {Object|null} token
    */
    constructor(neighbours=null,token=null){
		this.neighbours=neighbours?neighbours:Array.from({length:8},_=>null);
        this.token=token;
    }
//#region Getters & Setters

    /**
    * Getter for #neighbours
    * @returns {Array<Cell>|null} #neighbours
    */
    get neighbours(){
        return this.#neighbours;
    }

    /**
    * Setter for #neighbours
    * @param {Array<Cell>|null} neighbours
    */
    set neighbours(neighbours){
        this.#neighbours=neighbours;
    }


    /**
    * Getter for #token
    * @returns {Object|null} #token
    */
    get token(){
        return this.#token;
    }

    /**
    * Setter for #token
    * @param {Object|null} token
    */
    set token(token){
        this.#token=token;
        if(this.node!==null){
            if(token === null){
                this.node.style.background = '';
                this.node.innerHTML='';
            }else if(token == 'red' || token == 'blue'){
                this.node.style.background = token; 
            }else{
                this.node.innerHTML = token;
                this.node.firstChild.dataset.origin= (this.node.dataset.row*100)+'%';
            }            
        }
    }
    
    /**
    * Getter for #node
    * @returns {Object|null} #node
    */
     get node(){
        return this.#node;
    }

    /**
    * Setter for #node
    * @param {Object|null} node
    */
    set node(node){
        this.#node=node;
    }


//#endregion

    /**
     * Checks if the neighbour cell, 
     * @param {Number} neighbour 
     * @returns {Boolean}
     */
    isNeighbourEqual(neighbour){
        return this.neighbours[neighbour]?(this.token === this.neighbours[neighbour].token):null;
    }

    /**
     * Returns the number of consecutive cells with the same token as this 
     * by the indicated side of the cell, which goes from 0 to 7;
     * @param {Number} side 
     * @returns {Number}
     */
    equalsBySide(side){
        if(this.isNeighbourEqual(side)){
            return 1+this.neighbours[side].equalsBySide(side);
        }
        return 0;
    }

    /**
     * Returns the number of consecutive cells in a determinated direction,
     * taking as central cell this one. The direcctions goes from 0 to 3.
     * @param {Number} direction 
     * @returns {Number}
     */
    equalsByDirection(direction){
        return this.equalsBySide(direction)+this.equalsBySide(this.neighbours.length-1-direction)+1;
    }


    /**
     * Checks if there are n consecutive cells with the same token in any direction
     * @param {Number} n 
     * @returns {Boolean}
     */
    checkLine(n){
        let i=0;
        while((i<this.neighbours.length/2) && (this.equalsByDirection(i)<n)){i++};
        return i<this.neighbours.length/2;
    }
    
    /**
     * Evaluates the score of the cell
     * @param {Number} line 
     * @returns {Number}
     */
     value(line){
        let i=0;
        let score = 0;
        while(i<this.neighbours.length/2){
            let equalsInLine = this.equalsByDirection(i);
            if(equalsInLine>1){
                score += (this.neighbours.length**(equalsInLine-2))*1000;
            }
            i++;
        };
        return score>this.topScore(line)?this.topScore(line):score;
    }

    /**
     * Returns the maximun score that can be made by a cell
     * @param {Number} line 
     * @returns {Number}
     */
    topScore(line=4){
        return (this.neighbours.length**(line-2))*1000;
    }

    /**
     * Checks if a cell completes a line
     * @param {Number} value 
     * @param {Number} line 
     * @returns {Boolean}
     */
    isWinnerMove(value,line){
        return Math.abs(value)>=this.topScore(line);
    }

    /**
     * Generates a cell element for the doom
     * @returns {Object}
     */
    generateNode(){
        this.node = document.createElement('div');
        this.node.classList.add('cell');
        this.token = this.token;        
        return this.node;
    }
    
}

/**
* Class Board
*/
class Board{
	#rows=null;
    #columns=null;
    #cells=null;
    #node = null;
    #line = null;
    

    /**
    * Creates an instance of the class Board
	* @param {Number} rows
    * @param {Number} columns
    * @param {Number} line
    * @param {Boolean}
    * @param {Array<Cell>} cells 
    */
    constructor(rows,columns,line,html=false,cells=null){
		this.rows=rows;
        this.columns=columns;
        this.line=line;
        this.cells=cells?cells:this.generateBoardCells();
        if(html){
            this.generateNode();
        }        
    }
//#region Getters & Setters

    /**
    * Getter for #rows
    * @returns {Number} #rows
    */
    get rows(){
        return this.#rows;
    }

    /**
    * Setter for #rows
    * @param {Number} rows
    */
    set rows(rows){
        this.#rows=rows;
    }


    /**
    * Getter for #columns
    * @returns {Number} #columns
    */
    get columns(){
        return this.#columns;
    }

    /**
    * Setter for #columns
    * @param {Number} columns
    */
    set columns(columns){
        this.#columns=columns;
    }

    /**
    * Getter for #line
    * @returns {Number} #line
    */
     get line(){
        return this.#line;
    }

    /**
    * Setter for #line
    * @param {Number} line
    */
    set line(line){
        this.#line=line;
    }


    /**
    * Getter for #cells
    * @returns {Array<Cell>} #cells
    */
    get cells(){
        return this.#cells;
    }

    /**
    * Setter for #cells
    * @param {Array<Cell>} cells
    */
    set cells(cells){
        this.#cells=cells;
    }


    /**
    * Getter for #node
    * @returns {Object|null} #node
    */
     get node(){
        return this.#node;
    }

    /**
    * Setter for #node
    * @param {Object|null} node
    */
    set node(node){
        this.#node=node;
    }


//#endregion


    /**
     * Returns the position of an element in a Array taking the coord
     * of a bidimensional array
     * @param {Number} row 
     * @param {Number} column 
     * @returns {Number}
     */
    xy2pos(row,column){
        if(row<0 || row>this.rows-1 || column<0 || column>this.columns-1){
            return null;
        }
        return (row*this.columns)+column
    }

    /**
     * Returns the position of an element in a bidimensional array taking 
     * the position of a one dimension array
     * @param {Number} pos 
     * @returns {Object}
     */
    pos2xy(pos){
        if(pos<0 || pos>this.rows*this.columns-1){
            return null;
        }
        return {row:Math.trunc(pos/this.columns),column:pos%this.columns};
    }

    /**
     * Return the cell with the given coords
     * @param {Number} row 
     * @param {Number} column 
     * @returns {Object<Cell>|null}
     */
    getCell(row,column){
        let pos = this.xy2pos(row,column);
        return pos!==null?this.cells[pos]:null;
    }

    /**
     * Set the properties of the cell with the given coord
     * @param {Number} row 
     * @param {Number} column 
     * @param {Any} token 
     * @param {Array} neighbours 
     * @returns {Array}
     */
    setCell(row,column,token=null,neighbours=null){
        let pos = this.xy2pos(row,column);
        if(pos!==null){
            this.cells[pos].token = token;
            if(neighbours){
                this.cells[pos].neighbours = neighbours;
            }
            return this.cells[pos];
        } 
        return null;       
    }

    /**
     * Returns the first free cell in a column or null
     * if there isn't
     * @param {Number} column 
     * @returns {Object<Cell>|null}
     */
    freeCellInColumn(column){
        let i = this.rows-1;
        while(i>-1 && this.getCell(i,column).token!==null){
            i--;
        }
        return i===-1?null:this.getCell(i,column);
    }
    
    /**
     * Returns the adyacent cells of the given cell
     * @param {Number} pos 
     * @returns {Array}
     */
    findNeighbours(pos){ 
        let row = this.pos2xy(pos);
        if(row!==null){
            let column = row.column;
            row = row.row;
            let neighbours = [];
            for(let i=row-1;i<row+2;i++){
                for(let j=column-1;j<column+2;j++){
                    if(i!==row || j!==column){
                        neighbours.push(this.getCell(i,j)||null);
                    }                
                }
            }
            return neighbours;
        }
        return null;
    }    

    /**
     * Generate the elements to add the board to the doom
     * @returns {Array}
     */
    generateBoardCells(){
        this.cells=Array.from({length:this.rows*this.columns},_=>new Cell());
        this.cells.forEach((cell,i)=>{
            cell.neighbours=this.findNeighbours(i);
        });
        return this.cells;
    }

    

    /**
     * Sets the token of the first free cell in a column
     * @param {Number} column 
     * @param {Any} token 
     * @returns {Object<Cell>|null}
     */
    pushToken(column,token){
        let cell = this.freeCellInColumn(column);
        if(cell!==null){
            cell.token = token;
            return cell;
        }
        return null;
    }

    /**
     * Makes a deep copy of a Board object
     * @param {Boolean} html 
     * @returns {Object<Board>}
     */
    copy(html=false){
        let board = new Board(this.rows,this.columns,this.line,html);
        this.cells.forEach((cell,i)=>{
            board.cells[i].token = cell.token; 
        });        
        return board;
    }

    /**
     * Makes a deep copy of a Board object ready to 
     * be used by AI
     * @param {Any} AItoken 
     * @returns {Object<Board>}
     */
    copy4AI(AItoken){
        let board = new Board(this.rows,this.columns,this.line);
        this.cells.forEach((cell,i)=>{
            if(cell.token){
                board.cells[i].token = cell.token===AItoken?'red':'blue';
            }             
        });        
        return board;
    }

    /**
     * Generates a board element for the doom
     * @returns {Object}
     */
    generateNode(){
        this.node = document.createElement('div');
        this.node.classList.add('board');
        this.cells.forEach((c,i)=>{
            let cell = c.generateNode();
            cell.style.width = ((100/this.columns)-2)+'%';
            cell.style.margin = '1% 1%';
            [cell.dataset.row,cell.dataset.column] = Object.values(this.pos2xy(i));
        });
        this.node.append(...this.cells.map(c=>c.node));
        return this.node;
    }

    
    
    /**
     * Removes the board element from the doom
     */
    removeNode(){
        this.#node.remove();        
    }
    
    /**
     * Chacks if there are free cells in the board
     * @returns {Boolean}
     */
    hasFreeCells(){
        return this.#cells.filter(cell=>{return cell.token === null;}).length;
    }

    reset(){
        this.cells.forEach(cell=>{
            cell.token = null;
        });
    }

}

/**
* Class Player
*/
class Player{
	#name;
    #token;

    constructor(name,token){
		this.name=name;
        this.token = token;
    }

//#region getters and setters

    /**
    * Getter for this.#name
    * @returns {string} this.#name
    */
    get name(){
        return this.#name;
    }

    /**
    * Setter for this.#name
    * @param {string} name
    */
    set name(name){
        this.#name=name;
    }


    /**
    * Getter for this.#token
    * @returns {String} this.#token
    */
    get token(){
        return this.#token;
    }

    /**
    * Setter for this.#token
    * @param {String} token
    */
    set token(token){
        this.#token=token;
    }


//#endregion

    /**
     * Push the player token into the first freecell
     * of the indicated column 
     * @param {Object} board 
     * @param {Number} column 
     * @returns 
     */
    turn(board,column){
        return board.pushToken(column,this.token);
    }

}

/**
* Class AIplayer
*/
class AIplayer extends Player{

	#depth;

    constructor(name,token,depth){
		super(name,token);
        this.#depth = depth;
    }

    /**
     * Checks if the given column is more centered
     * @param {Number} columnA 
     * @param {Number} columnB 
     * @param {Object<Board>} board 
     * @returns 
     */
    #isMoreCentered(columnA,columnB,board){
        return (Math.abs(columnA-board.columns/2)<Math.abs(columnB-board.columns/2));
    }


    /**
     * Executes a minimax with alpha-beta pruning
     * @param {Object<Board>} board 
     * @param {Number} depth 
     * @param {Number} alpha 
     * @param {Number} beta 
     * @param {Boolean} player 
     * @returns {Number}
     */
    minimax(board,depth=this.#depth,alpha=Number.NEGATIVE_INFINITY,beta=Number.POSITIVE_INFINITY,player=true){
        let result = {
            value:null,
            column:null
        };

        for(let i=0; i<board.columns;i++){
            let cell = board.pushToken(i,player?'red':'blue');
            if(cell){                
                let evaluation = {};
                evaluation.value=(player?1:-1)*(cell.value(board.line)+depth);

                if(depth && !cell.isWinnerMove(evaluation.value,board.line) && board.hasFreeCells()){
                    evaluation = this.minimax(board,depth-1,alpha,beta,!player);
                }

                if((result.value === null) || (player?evaluation.value>result.value:evaluation.value<result.value) || ((evaluation.value===result.value) && (this.#isMoreCentered(i,result.column,board)))){
                    result.value = evaluation.value;
                    result.column = i;
                }                

                cell.token = null;
                
                if(player){
                    if(evaluation.value>alpha){
                        alpha = evaluation.value;
                    }
                }else if(evaluation.value<beta){
                    beta = evaluation.value;
                }
                if(beta<alpha){
                    i=board.columns;
                }
            }            
        }      
        
        return result;      
    } 

    
    /**
     * Push the player token into a cell
     * @param {Object<Board>} board 
     * @returns 
     */
    turn(board){ 
        return super.turn(board,this.minimax(board.copy4AI(this.token),this.#depth).column);
    }

}

/**
 * Class Game
 */
 /**
 * Class Game
 */
  class Game {
    #players = null;
    #board = null;
    #currentPlayer = null;
    #ended = false;
    

    /**
     * Creates an instance of the class Game
     * @param {Object} config
     * @param {Number} config.rows
     * @param {Number} config.columns
     * @param {Number} config.line
     * @param {Boolean} config.tree
     * @param {Array<Object>} config.players
     * @param {string} config.players[].name
     * @param {string} config.players[].token 
     * @param {Object} config.parent
     */
    constructor(config) {
        config = config?config:{};

        this.players = config.players ? config.players :[
            new Player('uno','<div class="token" style="background:blue"></div>'),
            new AIplayer('dos','<div class="token" style="background:red"></div>',6)
        ];
        
        this.board = new Board(config.rows ? config.rows : 6, config.columns ? config.columns : 7,config.line?config.line:4,true);
        this.board.node.addEventListener('click',e=>{
            if(e.target.classList.contains('cell')){
                this.play(Number(e.target.dataset.column));
            }
        });

        let parent = config.parent?config.parent:document.body;
        parent.append(this.board.node);        

        this.currentPlayer = 0;
        this.createResetButton(this.board.node);
    }
    //#region Getters & Setters

    /**
     * Getter for #players
     * @returns {Object} #players
     */
    get players() {
        return this.#players;
    }

    /**
     * Setter for #players
     * @param {Object} players
     */
    set players(players) {
        this.#players = players;
    }


    /**
     * Getter for #board
     * @returns {Object} #board
     */
    get board() {
        return this.#board;
    }

    /**
     * Setter for #board
     * @param {Object} board
     */
    set board(board) {
        this.#board = board;
    }


    /**
     * Getter for #currentPlayer
     * @returns {Object} #currentPlayer
     */
    get currentPlayer() {
        return this.players[this.#currentPlayer];
    }

    /**
     * Setter for #currentPlayer
     * @param {Number} currentPlayer
     */
    set currentPlayer(currentPlayer) {
        this.#currentPlayer = currentPlayer;
    }
 
    
    //#endregion


    /**
     * Changes current player to the next one
     * @returns {Object<Player>}
     */
    #nextPlayer() {
        this.#currentPlayer = (this.#currentPlayer + 1) % this.players.length;
        return this.currentPlayer;
    }   

    /**
     * Controls the flow of the game
     * @param {Number} column 
     */
    play(column=null){
        if(!this.#ended){
            let cell = this.currentPlayer.turn(this.board,column);
            if(cell.checkLine(this.board.line)){
                this.#ended = true;
                this.board.node.getElementsByTagName('button')[0].innerText = 'New Game';
                let message = document.getElementById('finalMessage');
                message.innerText=this.currentPlayer.name+" Wins";
                message.style.display = 'block';
                
                console.log('%c' + this.currentPlayer.name+" WIN", 'color:whitesmoke;background:black;font-size:32px;');
            }else{
                this.#nextPlayer();
                if(this.currentPlayer instanceof AIplayer){
                    this.play();
                }
            }
        }
    }

    reset(){
        this.board.reset(); 
        this.currentPlayer = 0;
    }

    createResetButton(parent){
        let reset = document.createElement('button');
        reset.classList.add('reset');
        reset.innerText = 'Reset';
        reset.addEventListener('click',_=>{
            this.#ended?window.location.reload():this.reset();
        });
        parent.append(reset);
    }

}


let [human,ai] = document.getElementsByTagName('input');
let start = document.getElementsByTagName('button')[0];
start.addEventListener('click',_=>{
    let players = [new Player('Red','<div class="token" style="background:red"></div>')];
    if(human.checked){
        players.push(new Player('Blue','<div class="token" style="background:blue"></div>'));
    }else{
        players.push(new AIplayer('Blue','<div class="token" style="background:blue"></div>',5));
    }            
    document.getElementsByClassName('popup')[0].style.display='none';
    let game = new Game({players:players, parent:document.body});
});