// Controller
function ControllerTorpedo() {
    let myModel = null,
        keys = [],
        pressed = [];

    // Инициализация
    this.init = function (model) {
        self = this;
        myModel = model;

        // отслеживаем изменение закладки в УРЛе
        window.addEventListener("hashchange", () => myModel.changeHash(), false);

        // Изменение размеров окна
        window.addEventListener('resize', this.resize);

        let enterUrl = document.querySelector(".enterUrl");
        if(enterUrl) enterUrl.addEventListener("click", this.enterUrlClick);

        let enterBtn = document.getElementById("enterBtn");
        if(enterBtn) enterBtn.addEventListener("click", this.enterBtnClick);

        let exitBtn = document.querySelector(".exitUrl");
        if(exitBtn) exitBtn.addEventListener("click", this.exitBtnClick);

        let backGameFromPause = document.querySelector(".pauseOff");
        if(backGameFromPause) backGameFromPause.addEventListener("click", this.backGameFromPause);

        let newGame = document.querySelector(".newGame");
        if(newGame) newGame.addEventListener("click", this.newGame);

        let fromGameToMain = document.querySelector(".fromGameToMain");
        if(fromGameToMain) fromGameToMain.addEventListener("click", this.fromGameToMain);

        document.onkeydown = function(event) {
            self.Down(event);
        };
        document.onkeyup = function(event) {
            self.Up(event);
        };

        this.Loop();
    };

    this.Down = function (e) {
        let cxc = e.keyCode;
        pressed[cxc] = 1;
    };

    this.Up = function (e) {
        let cxc = e.keyCode;
        pressed[cxc] = 0;
        settings.stateMove = null;
    };

    this.Loop = function() {
        let self = this;

        // Нажата клавиша "влево"
        if (pressed[37]) {
            myModel.turnLeft();
            settings.stateMove = "left";
        }
        // Нажата клавиша "вправо"
        else if (pressed[39]) {
            myModel.turnRight();
            settings.stateMove = "right";
        }
        // Нажата клавиша "пробел"
        if (pressed[32]) {
            if (!settings.stopTorpedo) {
                settings.stopTorpedo = true;
                myModel.shot();
                setTimeout(function() {
                    settings.stopTorpedo = false;
                    myModel.shotEnable();           // можно стрелять еще раз
                    }, settings.pauseShot);
            }
        }
        // Нажата клавиша "Esc"
        if (pressed[27]) {
            if(!settings.pause) this.pause();        // для однократного нажатия
        }

        let gLoop = setTimeout(() => this.Loop(), 1000 / 20);
    };

    this.resize = function () {
        myModel.resizeField();
    };

    // Нажата ссылка "Войти"
    this.enterUrlClick = function (event) {
        event.preventDefault();
        myModel.showFormEnter();
    };

    // Нажата кнопка "Войти" в форме входа
    this.enterBtnClick = function (event) {
        event.preventDefault();
        myModel.checkFormEnter();
    };

    // Нажата ссылка "Выйти"
    this.exitBtnClick = function (event) {
        event.preventDefault();
        myModel.exitBtnClick();
    };

    // Нажат Esc (пауза)
    this.pause = function () {
        myModel.pause();
    };

    // Нажато продолжить игру в Паузе
    this.backGameFromPause = function (event) {
        event.preventDefault();
        myModel.backGameFromPause();
    };

    // Нажато начать новую игру в Паузе
    this.newGame = function (event) {
        event.preventDefault();
        myModel.newGame();
    };

    // Нажато "перейти в главное меню" в Паузе
    this.fromGameToMain = function (event) {
        myModel.fromGameToMain();
    }
}