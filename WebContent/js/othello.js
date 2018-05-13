window.onload = function(){
    // 8マス × 8マスの盤面
    var BOARD_TYPE = {
        'WIDTH' :8,
        'HEIGHT':8,
    };
    // マスの状態を定義
    var PIECE_TYPE = {
        'NONE'   : 0,
        'BLACK'  : 1,
        'WHITE'  : 2,
        'MAX'    : 3,
    };

    var board = [];
    // 0:石無し, 1:黒, 2:白
    var stone = [
        document.getElementById("cell"),
        document.getElementById("black"),
        document.getElementById("white")
    ];
    
    // TODO: 黒が先手で固定(のちのアップデートで拡張予定)
    var turn = PIECE_TYPE.BLACK;
        
    // 盤面を初期化
    for (var i = 0; i < 10; i++) {
        board[i] = [];
        for (var j = 0; j < 10; j++) {
            board[i][j] = PIECE_TYPE.NONE;
        }
    }
    
    // 黒白の初期配置
    board[4][5] = PIECE_TYPE.BLACK;
    board[5][4] = PIECE_TYPE.BLACK;
    board[4][4] = PIECE_TYPE.WHITE;
    board[5][5] = PIECE_TYPE.WHITE;
    
    // 盤面表示
    showBoard();

    /**
     * 盤面を生成する関数
     */
    function showBoard() {
        
        var b = document.getElementById("board");
        
        // 全ての子ノードを取り除く
        while(b.firstChild) {
            b.removeChild(b.firstChild);
        }
        
        for(var y = 1; y <= BOARD_TYPE.HEIGHT; y++) {
            for(var x = 1; x <= BOARD_TYPE.WIDTH; x++) {
            	
            	// 現在のノードを子要素含めて複製
                var cell = stone[board[x][y]].cloneNode(true);
                
                // 複製したノードを配置
                cell.style.left = ((x - 1) * 31) + "px"; 
                cell.style.top = ((y - 1) * 31) + "px"; 
                b.appendChild(cell);
                
                if (board[x][y] === PIECE_TYPE.NONE) {
                	// 空欄セルに対する関数を定義
                    (function() {
                        var _x = x;
                        var _y = y;
                        // クリックイベント
                        cell.onclick = function() {
                            if (checkTurnOver(_x, _y, true)) {
                            	// クリックした場所に自分の色の石を置く
                                board[_x][_y] = turn;
                                // 盤面再表示
                                showBoard();
                                // 相手のターンへ
                                turn = PIECE_TYPE.MAX - turn;
                            }
                        };
                    })();
                }
            }
        }
    };
    // 石をひっくり返すかどうか判定する関数を定義
    var checkTurnOver = function(x, y, flip) {
        var isOK = false;
        
        // 自分の周囲9マス(自分含む)の石に対してチェック処理をおこなう
        for (var dx = -1; dx <= 1; dx++) {
            for(var dy = -1; dy <= 1; dy++) {
                // 自分だった場合はなにもしない
            	if (dx === 0 && dy === 0) { continue; }
            	
                var nx = x + dx;
                var ny = y + dy;
                var n = 0;
                
                // 周囲8マスに相手の色の石があった場合
                while(board[nx][ny] === PIECE_TYPE.MAX - turn) {
                    n++;
                    nx += dx;
                    ny += dy;
                }
                
                // 反転対象の石が存在した場合
                if (n > 0 && board[nx][ny] === turn) {
                	isOK = true;
                    if (flip) {
                        nx = x + dx;
                        ny = y + dy;
                        // 反転する
                        while(board[nx][ny] === PIECE_TYPE.MAX - turn) {
                            board[nx][ny] = turn;
                            nx += dx;
                            ny += dy;
                        }
                    }
                }
            }
        }
        return isOK;
    };
    
};