/*:
 * @plugindesc Adds virtual buttons for mobile devices with specific layout and functionality, and fixes alpha property error in Window_Message updateInput function. 
 * @help This plugin provides virtual buttons for mobile devices.
 * You can customize the images for the buttons by replacing the corresponding
 * images in the img/system folder.
 * 
 * The buttons include:
 * - D-Pad (Left Bottom)
 * - Menu (Right Top)
 * - Interaction (Right Bottom)
 * - Inventory (Right Bottom)
 */

(function() {
    const buttonImages = {
        dpadUp: 'ButtonDPadUp',
        dpadDown: 'ButtonDPadDown',
        dpadLeft: 'ButtonDPadLeft',
        dpadRight: 'ButtonDPadRight',
        menu: 'ButtonMenu',
        interact: 'ButtonInteract',
        inventory: 'ButtonInventory',
        dpadUpPressed: 'ButtonDPadUpPressed',
        dpadDownPressed: 'ButtonDPadDownPressed',
        dpadLeftPressed: 'ButtonDPadLeftPressed',
        dpadRightPressed: 'ButtonDPadRightPressed',
        menuPressed: 'ButtonMenuPressed',
        interactPressed: 'ButtonInteractPressed',
        inventoryPressed: 'ButtonInventoryPressed'
    };

    const buttonPositions = {
        dpadUp: { x: 70, y: Graphics.height - 160 },
        dpadDown: { x: 70, y: Graphics.height - 80 },
        dpadLeft: { x: 20, y: Graphics.height - 120 },
        dpadRight: { x: 120, y: Graphics.height - 120 },
        menu: { x: Graphics.width - 70, y: 20 },
        interact: { x: Graphics.width - 70, y: Graphics.height - 120 },
        inventory: { x: Graphics.width - 140, y: Graphics.height - 120 }
    };

    const createButton = function(name, onClick) {
        const button = new Sprite_Button();
        const bitmap = ImageManager.loadSystem(buttonImages[name]);
        
        bitmap.addLoadListener(function() {
            console.log(`Image ${buttonImages[name]} loaded successfully.`);
        });

        button.bitmap = bitmap;
        button.x = buttonPositions[name].x;
        button.y = buttonPositions[name].y;
        button.setClickHandler(onClick);
        button._imageNormal = buttonImages[name];
        button._imagePressed = buttonImages[name + 'Pressed'];
        button.opacity = 255;
        button.visible = true;
        return button;
    };

    const alias_Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        alias_Scene_Map_createDisplayObjects.call(this);
        this.createVirtualButtons();
    };

    Scene_Map.prototype.createVirtualButtons = function() {
        this._dpadUpButton = createButton('dpadUp', this.onDPadUpPress.bind(this));
        this.addChild(this._dpadUpButton);

        this._dpadDownButton = createButton('dpadDown', this.onDPadDownPress.bind(this));
        this.addChild(this._dpadDownButton);

        this._dpadLeftButton = createButton('dpadLeft', this.onDPadLeftPress.bind(this));
        this.addChild(this._dpadLeftButton);

        this._dpadRightButton = createButton('dpadRight', this.onDPadRightPress.bind(this));
        this.addChild(this._dpadRightButton);

        this._menuButton = createButton('menu', this.onMenuPress.bind(this));
        this.addChild(this._menuButton);

        this._interactButton = createButton('interact', this.onInteractPress.bind(this));
        this.addChild(this._interactButton);

        this._inventoryButton = createButton('inventory', this.onInventoryPress.bind(this));
        this.addChild(this._inventoryButton);
    };

    const updateButtonState = function(button, isPressed) {
        if (isPressed) {
            button.bitmap = ImageManager.loadSystem(button._imagePressed);
            button.opacity = 255; // 完全不透明
        } else {
            button.bitmap = ImageManager.loadSystem(button._imageNormal);
            button.opacity = 128; // 半透明
        }
    };

    Scene_Map.prototype.onDPadUpPress = function() {
        updateButtonState(this._dpadUpButton, true);
        $gamePlayer.moveStraight(8); // Move up
        setTimeout(() => updateButtonState(this._dpadUpButton, false), 200);
    };

    Scene_Map.prototype.onDPadDownPress = function() {
        updateButtonState(this._dpadDownButton, true);
        $gamePlayer.moveStraight(2); // Move down
        setTimeout(() => updateButtonState(this._dpadDownButton, false), 200);
    };

    Scene_Map.prototype.onDPadLeftPress = function() {
        updateButtonState(this._dpadLeftButton, true);
        $gamePlayer.moveStraight(4); // Move left
        setTimeout(() => updateButtonState(this._dpadLeftButton, false), 200);
    };

    Scene_Map.prototype.onDPadRightPress = function() {
        updateButtonState(this._dpadRightButton, true);
        $gamePlayer.moveStraight(6); // Move right
        setTimeout(() => updateButtonState(this._dpadRightButton, false), 200);
    };

    Scene_Map.prototype.onMenuPress = function() {
        updateButtonState(this._menuButton, true);
        SceneManager.push(Scene_Menu);
        setTimeout(() => updateButtonState(this._menuButton, false), 200);
    };

    Scene_Map.prototype.onInteractPress = function() {
        updateButtonState(this._interactButton, true);
        $gameMap.events().forEach(event => {
            if (event.isTriggerIn([0,1,2]) && $gamePlayer.pos(event.x, event.y)) {
                event.start();
            }
        });
        setTimeout(() => updateButtonState(this._interactButton, false), 200);
    };

    Scene_Map.prototype.onInventoryPress = function() {
        updateButtonState(this._inventoryButton, true);
        SceneManager.push(Scene_Item);
        setTimeout(() => updateButtonState(this._inventoryButton, false), 200);
    };

    const alias_Window_Message_initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function() {
        alias_Window_Message_initialize.call(this);
        this.createPauseSignSprite();
    };

    Window_Message.prototype.createPauseSignSprite = function() {
        this.pauseSignSprite = new Sprite();
        // Comment out the line that loads the pauseSign image
        // this.pauseSignSprite.bitmap = ImageManager.loadSystem('pauseSign');
        this.pauseSignSprite.anchor.x = 0.5;
        this.pauseSignSprite.anchor.y = 1;
        this.pauseSignSprite.alpha = 0;
        this.addChild(this.pauseSignSprite);
    };

    const alias_Window_Message_updateInput = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        if (this.isAnySubWindowActive()) {
            return true;
        }
        if (TouchInput.isPressed() && !this.pause) {
            this.pause = true;
            this._pauseSkip = true;
            if (this.pauseSignSprite) { // 確保 pauseSignSprite 已初始化
                this.pauseSignSprite.alpha = 1;
            }
            return true;
        }
        return alias_Window_Message_updateInput.call(this);
    };

})();