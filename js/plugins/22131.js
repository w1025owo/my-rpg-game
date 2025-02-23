// 修改 Scene_Title.prototype.createCommandWindow 函數
Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.setHandler('newGame', this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options', this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);

    // 設定預設選項為新遊戲
    this._commandWindow.selectSymbol('newGame');
    
    // 添加滑鼠點擊功能
    this._commandWindow.setHandler('click', this.onMouseClick.bind(this));
    this._commandWindow.setClickHandler();
};

Window_TitleCommand.prototype.setClickHandler = function() {
    this.setHandler('ok', this.onOkClick.bind(this));
};

Window_TitleCommand.prototype.onOkClick = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    this.callHandler(symbol);
};

// 處理滑鼠點擊事件
Scene_Title.prototype.onMouseClick = function() {
    var index = this._commandWindow.index();
    var symbol = this._commandWindow.commandSymbol(index);
    this._commandWindow.callHandler(symbol);
};