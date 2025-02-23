Input.keyMapper = 
    {
        9: 'tab',       // tab
        13: 'ok',       // enter
        16: 'shift',    // shift
        17: 'control',  // control
        18: 'control',  // alt
        27: 'escape',   // escape
        32: 'ok',       // space
        33: 'pageup',   // pageup
        34: 'pagedown', // pagedown
        65: 'left',     // left arrow
        87: 'up',       // up arrow
        68: 'right',    // right arrow
        83: 'down',     // down arrow
        45: 'escape',   // insert
        73: 'inventory', // i
        81: 'pageup',   // Q
        82: 'pagedown', // W
        88: 'escape',   // X
        90: 'ok',       // Z
        96: 'escape',   // numpad 0
        98: 'down',     // numpad 2
        100: 'left',    // numpad 4
        102: 'right',   // numpad 6
        104: 'up',      // numpad 8
        120: 'debug'    // F9
    };
    
// 處理鍵盤操作函數
function handleKeyAction(action) {
    switch(action) {
        case 'inventory':
            openInventory();
            break;
        case 'exit':
            confirmExit();
            break;
        // 其他操作...
    }
}

// 打開背包的函數
function openInventory() {
    // 邏輯打開背包
    console.log("背包已打開");
    SceneManager.push(Scene_Item); // 打開背包場景
}

// 確認退出的函數
function confirmExit() {
    // 邏輯確認退出
    if (confirm("您確定要退出遊戲嗎？")) {
        exitGame();
    }
}

// 退出遊戲的函數
function exitGame() {
    // 邏輯退出遊戲
    console.log("遊戲已退出");
    SceneManager.exit(); // 退出遊戲
}

// 綁定鍵盤事件
document.addEventListener('keydown', function(event) {
    var keyCode = event.keyCode;
    var action = Input.keyMapper[keyCode];
    if (action) {
        handleKeyAction(action);
    }
});