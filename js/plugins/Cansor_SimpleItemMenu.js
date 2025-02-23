//=============================================================================
// Cansor_SimpleItemMenu.js
//=============================================================================
/*:
 * @plugindesc 简化物品菜单 v1.0.0
 * @author Cansor （邪月清辉）
 * 
 * @param Help Window Height
 * @type number
 * @min 1
 * @max 9
 * @desc 物品页帮助窗口的高度
 * 默认: 3
 * @default 3
 * 
 * @help
 * ============================================================================
 * 介绍
 * ============================================================================
 * 这是一个适用于如解谜类游戏等需要简化物品菜单页的插件。
 * 插件功能：简化物品菜单页，更多的物品说明信息。
 * 
 * 【简化菜单页】
 * 去掉了物品类型选择窗口，默认显示“普通物品”类型。
 * 当然，插件同时也提供了插件指令来切换显示的物品类型。
 * 
 * 【更多的物品说明】
 * MV默认的物品说明只能写两行，通过本插件，可以在物品的备注中写上多行
 * 的物品说明；行数取决于插件参数列表中设置的窗口高度，你可以根据需求
 * 设定一个合适的高度。
 * 
 * ============================================================================
 * 物品备注
 * ============================================================================
 * 在物品的备注中通过 description 标签写上更多的物品说明，就像这样：
 * 
 * <description>
 * 在这里写物品说明
 * 这是第二行
 * ...
 * </description>
 * 
 * 最大可显示的行取决于窗口高度，在插件参数列表中设置，超出的行会被隐
 * 藏。
 * 
 * ============================================================================
 * 插件指令
 * ============================================================================
 * ItemWindowCategory args
 *     - 切换物品菜单页显示的物品类型（需重新打开物品菜单页）
 *     - 参数：
 *         item  普通物品
 *         weapon  武器
 *         armor  护甲
 *         keyItem  重要物品
 *     - 例子：
 *         ItemWindowCategory keyItem  # 切换到显示重要物品
 * 
 * ============================================================================
 * 结束
 * ============================================================================
 */

var Imported = Imported || {};
Imported.Cansor_SimpleItemMenu = true;
var Cansor = Cansor || {};
Cansor.SimpleItemMenu = Cansor.SimpleItemMenu || {};
Cansor.SimpleItemMenu.Param = {};
Cansor.parameters = PluginManager.parameters('Cansor_SimpleItemMenu');
Cansor.SimpleItemMenu.Param.helpWindowHeight = Number(Cansor.parameters["Help Window Height"] || 3);
Cansor.SimpleItemMenu.Param.itemCategory = 'item';

Cansor.SimpleItemMenu._pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Cansor.SimpleItemMenu._pluginCommand.call(this, command, args);
    if (command === 'ItemWindowCategory') {
        if (args[0] === 'item' || args[0] === 'weapon' || args[0] === 'armor' || args[0] === 'keyItem')
            Cansor.SimpleItemMenu.Param.itemCategory = args[0];
    }
}

Scene_Item.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow(Cansor.SimpleItemMenu.Param.helpWindowHeight);
    this.createItemWindow();
    this.createActorWindow();
};

Scene_Item.prototype.createHelpWindow = function(numLines) {
    this._helpWindow = new Window_Help(numLines);
    this.addWindow(this._helpWindow);
};

Scene_Item.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_ItemCategory_X();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._helpWindow.height;
    this.addWindow(this._categoryWindow);
};

Scene_Item.prototype.createItemWindow = function() {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_ItemList(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);

    this._itemWindow.setCategory(Cansor.SimpleItemMenu.Param.itemCategory);
    this.onCategoryOk();
};

Scene_Item.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    SceneManager.pop();
};

Cansor.SimpleItemMenu._setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
    Cansor.SimpleItemMenu._setupNewGame.call(this);
    for (var i=0; i<$dataItems.length; i++) {
        var note = $dataItems[i] && $dataItems[i].note;
        if (note) {
            var start = $dataItems[i].note.indexOf('<description>') + 13;
            var end = $dataItems[i].note.indexOf('</description>');
            if (start === -1 || end === -1) continue;
            if (note.charAt(start) === '\n') start++;
            if (note.charAt(end - 1) === '\n') end--;
            $dataItems[i].description = note.substring(start, end);
        }
    }
};