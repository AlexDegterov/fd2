// View Canvas
function ViewTorpedo() {
    let ctx1 = null,
        ctx2 = null,
        ctx3 = null,
        ctx4 = null,
        fonImage = null,
        elementGame_1 = null,
        elementGame_2 = null,
        audio = {shot: null, shotAttention: null, bang: null, torpedoCharged: null, sonar: null},
        firstPageCreate = null,
        timerSonar = null;

    this.init = function () {
        // выполняется в начале, инициализация
    };

    // Создание фоновых элементов, общих для всех
    this.createFirstOnPage = function () {
        let draw = document.getElementById("app"),
            fon = document.createElement('div'),
            enterUserInfo = document.createElement('div'),
            page = document.createElement('div'),
            self = this;

        firstPageCreate = true;

        fon.setAttribute("class", "fon");
        page.setAttribute("class", "page");
        enterUserInfo.setAttribute("class", "enterUserInfo");
        enterUserInfo.innerHTML = "<span class=\"userName\"></span><a href=\"\" class=\"enterUrl\">Войти</a><a href=\"\" class=\"exitUrl\">Выйти</a>"

        fon.appendChild(enterUserInfo);
        fon.appendChild(page);
        draw.appendChild(fon);

        self.createLoader();                        // лоадер
        self.updateUserInfo();
        self.formEnter();
        self.formGamePause();

        self.createElements();                       // Создаем элементы интерфейса игры

        // Звук сонара
        self.sonarSound();
        if(timerSonar) {
            clearInterval(timerSonar);
            timerSonar = null;
            this.sonarSoundStop();
        }
        timerSonar = setInterval(function() {
            self.sonarSound();
        }, 23000);
    };

    // Создание формы входа
    this.formEnter = function () {
        let draw = document.getElementById("app"),
            loginForm = document.createElement('div');

        loginForm.setAttribute("id", "login-form");
        loginForm.setAttribute("class", "hide");
        loginForm.innerHTML = `
                <h1>Представьтесь</h1><div id="err_enter"></div>
                <fieldset>
                    <input type="text" placeholder = "Имя" required value="" id="name">
                    <input type="text" placeholder="Фамилия" required value="" id="surname">
                    <input type="submit" value="ВОЙТИ" id="enterBtn">
                </fieldset>`;

        draw.innerHTML += "<div class=\"modal-overlay hide\" id=\"modal-overlay\"></div>";
        draw.appendChild(loginForm);
    };

    // меню по ESC
    this.formGamePause = function () {
        let draw = document.getElementById("app"),
            gameForm = document.createElement('div');

        gameForm.setAttribute("class", "game-form hide");
        gameForm.innerHTML = `
                <h1>Пауза</h1></div>
                <fieldset>
                    <a href="#!game" class="pauseOff">Продолжить игру</a>
                    <a href="#!game" class="newGame">Новая игра</a>
                    <a href="#!main" class="fromGameToMain">Перейти в главное меню</a>
                </fieldset>`;

        draw.appendChild(gameForm);
    };

    // Показать/спрятать форму для входа пользователя
    this.showHideFormEnter = function () {
        let formEnter = document.getElementById("login-form"),
            overlay = document.getElementById("modal-overlay");

        if(formEnter) {
            formEnter.classList.toggle('hide');
            overlay.classList.toggle('hide');
        }
    };

    // Очистка страницы (оставляем фон)
    this.clearPage = function () {
        let draw = document.querySelector(".page");
        if(draw) draw.innerHTML = "";
    };

    // Прячем интерфейс и др. игры
    this.hideGame = function () {
        let game = document.querySelector(".game"),
            fon = document.querySelector(".fon"),
            overlay = document.getElementById("modal-overlay"),
            menuGame = document.querySelector(".game-form"),
            menuLogin = document.getElementById("login-form");

      if(game) game.classList.add("hide");
      if(fon) fon.classList.remove("hide");
      if(overlay) overlay.classList.add("hide");
      if(menuGame) menuGame.classList.add("hide");
      if(menuLogin) menuLogin.classList.add("hide");
    };

    // Создание стартовой страницы
    this.createMainPage = function () {
        if(!firstPageCreate) this.createFirstOnPage();

        let draw = document.getElementById("app"),
            page = document.querySelector('.page'),
            menuStartPage = document.createElement('div'),
            logoStartPage = document.createElement('img');

        logoStartPage.setAttribute("src", "img/logo.png");
        logoStartPage.setAttribute("class", "logo");
        menuStartPage.setAttribute("class", "list-block");

        menuStartPage.innerHTML = `
            <a href="#!game">Играть</a>
            <a href="#!rules">Правила</a>
            <a href="#!records">Рекорды</a>`;

        page.appendChild(logoStartPage);
        page.appendChild(menuStartPage);
    };

    // Создание страницы правил
    this.createRulesPage = function () {
        if(!firstPageCreate) this.createFirstOnPage();

        let page = document.querySelector(".page"),
            rules = document.createElement('div'),
            rulesTXT = "";

        rules.setAttribute("class", "rules");
        rulesTXT += `<h1>Правила игры</h1>`;
        rulesTXT += `<p><u>Цель игры:</u> Потопить как можно больше вражеских кораблей.</p>`;
        rulesTXT += `<p><u>Условия игры:</u> На игру дается 6 торпед. Если выпущенная торпеда попадает в корабль, то количество торпед не уменьшается. Таким образом количество торпед уменьшается только при промахах.</p>`;
        rulesTXT += `<p><u>Нюансы игры:</u> Для некоторых кораблей необходимо 2-3 выстрела. Скорость кораблей различна, в т.ч. и для кораблей одного типа, при этом скорость уже движущегося корабля не меняется. Для выхода из игры или постановки игры на паузу - нажмите ESC.</p>`;
        rulesTXT += `<p><u>Данные пользователя:</u> После указания имени и фамилии становится доступным: участие в рейтинге игроков, возможность продолжить начатую игру после закрытия страницы/браузера и др.</p>`;
        rulesTXT += `<div class="back"><a href="#!main" title="Перейти на главную страницу">На главную страницу</a></div>`;

        rules.innerHTML = rulesTXT;
        page.appendChild(rules);
    };

    // Создание страницы результатов
    this.createResultPage = function (users) {
        if(!firstPageCreate) this.createFirstOnPage();

        let draw = document.querySelector(".page"),
            records = document.createElement('div'),
            tableResults = "",
            dateScoreTXT = "";

        records.setAttribute("class", "recordsTable");
        tableResults += `<h1>Таблица рекордов</h1>
            <table class=\"table\" align=\"center\"><thead><tr><td>Позиция</td><td>Игрок</td><td>Счет</td><td>Дата игры</td></tr></thead><tbody>`;
        for (let i = 0; i < users.length; i++) {
            let dateScore = new Date(+users[i].date);
            if(dateScore) {
                dateScoreTXT = dateScore.getFullYear() + "-" + dateScore.getMonth()+1 + "-" + (dateScore.getDate() < 10 ? "0" + dateScore.getDate() : dateScore.getDate()) + " " + (dateScore.getHours() < 10 ? "0" + dateScore.getHours() : dateScore.getHours()) + ":" + (dateScore.getMinutes() < 10 ? "0" + dateScore.getMinutes() : dateScore.getMinutes());
            }
            tableResults += `<tr><td>${i+1}</td><td>${users[i].userName}</td><td>${users[i].score}</td><td>${dateScoreTXT}</td></tr>`;
        }

        tableResults += `</tbody></table>`;
        tableResults += `<div class="back"><a href="#!main" title="Перейти на главную страницу">На главную страницу</a></div><br><br>`;
        records.innerHTML = tableResults;
        draw.appendChild(records);
        this.showLoader();
    };

    // Создание страницы с игрой
    this.createGamePage = function () {
        if(!firstPageCreate) this.createFirstOnPage();

        let draw = document.querySelector(".fon");

        if(draw) draw.classList.add("hide");     // прячем фон
        this.initGame();                         // Запуск игры
    };

    // Инициализация игры
    this.initGame = function () {
        this.showLoader("black");
        this.createMediaFiles();                     // Загружаем медиа-файлы
    };

    // Создание элементов интерфейса игры
    this.createElements = function () {
        let draw = document.getElementById("app");
        let divAroundCanvas = document.createElement('div');

        divAroundCanvas.setAttribute("class", "game hide");

        draw.appendChild(divAroundCanvas);

        // Canvas для фона
        let canv = document.createElement('canvas');
        canv.setAttribute("id", "canvas1");
        canv.setAttribute("class", "canvas");
        canv.setAttribute("width", settings.fieldW);
        canv.setAttribute("height", settings.fieldH);
        canv.setAttribute("style", "display: block");
        canv.innerHTML = "Ваш браузер не поддерживает данную игру. Обновите браузер";
        divAroundCanvas.appendChild(canv);
        ctx1 = canv.getContext('2d');

        // Canvas для торпед и кораблей
        let canv3 = document.createElement('canvas');
        canv3.setAttribute("id", "canvas3");
        canv3.setAttribute("class", "canvas");
        canv3.setAttribute("width", settings.fieldW);
        canv3.setAttribute("height", settings.fieldH);
        canv3.setAttribute("style", "top: 0; left: 0");
        divAroundCanvas.appendChild(canv3);
        ctx3 = canv3.getContext('2d'); // Контекст

        // Canvas для поля со счетом, кнопок, перископа
        let canv2 = document.createElement('canvas');
        canv2.setAttribute("id", "canvas2");
        canv2.setAttribute("class", "canvas");
        canv2.setAttribute("width", settings.fieldW);
        canv2.setAttribute("height", settings.fieldH);
        canv2.setAttribute("style", "top: 0; left: 0");
        divAroundCanvas.appendChild(canv2);
        ctx2 = canv2.getContext('2d'); // Контекст

        // Canvas для взрывов
        let canv4 = document.createElement('canvas');
        canv4.setAttribute("id", "canvas4");
        canv4.setAttribute("class", "canvas");
        canv4.setAttribute("width", settings.fieldW);
        canv4.setAttribute("height", settings.fieldH);
        canv4.setAttribute("style", "top: 0; left: 0");
        divAroundCanvas.appendChild(canv4);
        ctx4 = canv4.getContext('2d'); // Контекст


        let menu = document.createElement('div');
        menu.setAttribute("class", "menu_game");
        // menu.innerHTML = "dddddddddddddddddddddddddddddd";

        draw.appendChild(menu);
    };

    // Загрузка медиа-файлов
    this.createMediaFiles = function () {
        let self = this,
            numImg = 0;

        // Загрузка аудио
        audio.shotAttention = new Audio("sound/torpedoAlarmShort.ogg");
        audio.torpedoCharged = new Audio("sound/torpedoLoad.ogg");
        //audio.sonar = new Audio("sound/sonar.ogg");
        audio.shot = new Audio("sound/torpedoShot.ogg");
        audio.bang = new Audio("sound/bang.ogg");

        let errF = function(error) {
            self.BigError("Ошибка загрузки, игра не может быть запущена. Попробуйте начать игру еще раз");
            console.log('Ошибка получения файлов: ' + error.message);
        };
        let statusSound = function(response) {
            if(response.ok) {
                return response.blob();
            }
            throw new Error('Загрузка звуков не удалась');
        };
        fetch('sound/sonar.ogg').then(statusSound).then(function (myBlob) {
            audio.sonar = new Audio(URL.createObjectURL(myBlob));
            self.sonarSound();
        }).catch(errF);

        // Загрузка изображений
        fonImage = new Image();
        elementGame_1 = new Image();
        elementGame_2 = new Image();

        let status = function(response) {
            if(response.ok) {
                return response.blob();
            }
            throw new Error('Загрузка изображения не удалась');
        };



        fetch('img/sea.png').then(status).then(function (myBlob) {
            fonImage.src = URL.createObjectURL(myBlob);
            numImg++;
            redrawCheck();
        }).catch(errF);

        fetch('img/all.png').then(status).then(function (myBlob) {
            elementGame_1.src = URL.createObjectURL(myBlob);
            numImg++;
            redrawCheck();
        }).catch(errF);

        fetch('img/fon.png').then(status).then(function (myBlob) {
            elementGame_2.src = URL.createObjectURL(myBlob);
            numImg++;
            redrawCheck();
        }).catch(errF);

        // все загрузилось (3 изображения, отрисовываем)
        function redrawCheck() {
            if(numImg === 3) {
                setTimeout(() => {
                    document.querySelector(".game").classList.remove("hide");
                    self.redraw();
                    self.redrawFront();
                    self.showLoader();
                }, 200);
            }
        }
        // Конец загрузки изображений
    };
    // Перерисовка изображения игры
    this.redraw = function () {
        // Отрисовка моря (поворот)
        this.turn();

        // Отрисовка стрелки позиции
        ctx1.drawImage(elementGame_1, 200, 600, 9, 13, Math.round(396*settings.factorW + settings.position/settings.speedArrowPosWithFactor*settings.factorW), elemSize.arrowPos.t, elemSize.arrowPos.w, elemSize.arrowPos.h);
    };

    // Отрисовка элементов интерфейса (Front) игры
    this.redrawFront = function () {
        ctx2.clearRect(0, 0, settings.fieldW, settings.fieldH);

        // Перископ
        ctx2.drawImage(elementGame_1, 0, 0, 800, 480, 0, 0, elemSize.periskop.w, elemSize.periskop.h);

        // Поле для счета
        ctx2.drawImage(elementGame_1, 810, 0, 174, 293, 0, 0, elemSize.scoreField.w, elemSize.scoreField.h);

        // Корабли на поле для счета
        ctx2.drawImage(elementGame_2, 840, 36, 133, 45, elemSize.shipScore.l, elemSize.shipScore.t1, elemSize.shipScore.w, elemSize.shipScore.h);
        ctx2.drawImage(elementGame_2, 840, 120, 133, 45, elemSize.shipScore.l, elemSize.shipScore.t2, elemSize.shipScore.w, elemSize.shipScore.h);
        ctx2.drawImage(elementGame_2, 840, 195, 133, 45, elemSize.shipScore.l, elemSize.shipScore.t3, elemSize.shipScore.w, elemSize.shipScore.h);
        ctx2.drawImage(elementGame_2, 840, 275, 133, 45, elemSize.shipScore.l, elemSize.shipScore.t4, elemSize.shipScore.w, elemSize.shipScore.h);

        // Счет
        ctx2.font = "37px 'Jockey One', sans-serif";
        ctx2.textAlign = "center";
        ctx2.fillStyle = "#d8e0c7";
        ctx2.fillText(settings.score, elemSize.scoreText.x, elemSize.scoreText.y);

        // Стрелка влево
        ctx2.drawImage(elementGame_1, 320, 680, 321, 119, 0, elemSize.arrowLeft.t, elemSize.arrowLeft.w, elemSize.arrowLeft.h);

        // Стрелка вправо
        ctx2.drawImage(elementGame_1, 680, 680, 321, 119, elemSize.arrowRight.l, elemSize.arrowRight.t, elemSize.arrowRight.w, elemSize.arrowRight.h);

        // Доуступные торпеды
        for (let i = 1; i <= settings.torpedoNum; i++) {
            let dif = i*20*settings.factorW;
            ctx2.drawImage(elementGame_1, 0, 559, 6, 58, elemSize.torpedoGame.l + dif, elemSize.torpedoGame.t, elemSize.torpedoGame.w, elemSize.torpedoGame.h);
        }

        // Торпеда заряжена
        if(!settings.stopTorpedo) ctx2.drawImage(elementGame_1, 866, 356, 77, 77, elemSize.torpedoOn.l, elemSize.torpedoOn.t, elemSize.torpedoOn.w, elemSize.torpedoOn.h);
    };

    // Поворот подлодки в игре
    this.turn = function () {
        ctx1.clearRect(elemSize.sea.x, elemSize.sea.y, elemSize.sea.w, elemSize.sea.h);
        for (let i = -elemSize.sea.w; i < settings.fieldW + elemSize.sea.w; i += elemSize.sea.w) {
            ctx1.drawImage(fonImage, i - settings.position, elemSize.sea.t, settings.fieldW + 4, settings.fieldH);      // +4 чтобы не было белой полосы при сшивании
        }
    };

    // Перерисовка из-за изменения размеров страницы игры
    this.resizeField = function () {
        let canv = document.getElementById("canvas1");
        let ctx__ = canv.getContext('2d'); // Контекст
        canv.setAttribute("width", settings.fieldW);
        canv.setAttribute("height", settings.fieldH);

        let canv2 = document.getElementById("canvas2");
        let ctx__2 = canv2.getContext('2d'); // Контекст
        canv2.setAttribute("width", settings.fieldW);
        canv2.setAttribute("height", settings.fieldH);

        let canv3 = document.getElementById("canvas3");
        let ctx__3 = canv3.getContext('2d'); // Контекст
        canv3.setAttribute("width", settings.fieldW);
        canv3.setAttribute("height", settings.fieldH);

        let canv4 = document.getElementById("canvas4");
        let ctx__4 = canv3.getContext('2d'); // Контекст
        canv4.setAttribute("width", settings.fieldW);
        canv4.setAttribute("height", settings.fieldH);

        ctx__.clearRect(0, 0, settings.fieldW, settings.fieldH);
        ctx__2.clearRect(0, 0, settings.fieldW, settings.fieldH);
        ctx__3.clearRect(0, 0, settings.fieldW, settings.fieldH);
        ctx__4.clearRect(0, 0, settings.fieldW, settings.fieldH);

        this.redraw();
        this.redrawFront();
    };

    // Звук пуска торпеды в игре
    this.shotSound = function () {
        if(settings.gameOver || settings.pause) return;

        if(audio.shotAttention) this.soundPlay(audio.shotAttention);
        if(audio.shot) {
            setTimeout(() => this.soundPlay(audio.shot), 600);
        }
    };

    // Звук сонара
    this.sonarSound = function () {
        if(audio.sonar) this.soundPlay(audio.sonar);
    };
    this.sonarSoundStop = function () {
        if(audio.sonar) this.soundPlayStop(audio.sonar);
    };

    // Звук торпеда зарядилась
    this.torpedoChargedSound = function () {
        if(audio.torpedoCharged) this.soundPlay(audio.torpedoCharged, 7);
    };

    // Звук взрыва при попадании
    this.bangSound = function () {
        if(audio.bang) this.soundPlay(audio.bang);
    };

    // Показываем фонтан от попадания
    this.bangVideo = function (x) {
        ctx4.drawImage(elementGame_2, 880, 401, 25, 58, ship.param.posX, ship.param.posY, ship.param.width_ship, ship.param.height_ship);
        setTimeout(() => this.clearBangCanvas(), 300);
    };

    // Функция проигрывания звуков
    this.soundPlay = function (audio, start = 0) {
        audio.currentTime = start; // начала проигрывания в секундах
        audio.play();
    };

    // Функция остановки проигрывания звуков
    this.soundPlayStop = function (audio) {
         audio.pause();
         audio.currentTime = 0.0;
    };

    // Критическая ошибка
    this.BigError = function (err) {
        if(err) {
            alert(err);
            window.location.href = "/";
        }

    };

    // Отрисовка движения торпеды
    this.torpedoMove = function (torpedo) {
        ctx3.drawImage(elementGame_1, 19, 560, 6, 66, torpedo.x, Math.round(torpedo.y), torpedo.W, torpedo.L);
    };

    // Очистка прямоугольника с ракетой для перерисовки
    this.torpedoClear = function (torpedo) {
        ctx3.clearRect(torpedo.x_clear, Math.round(torpedo.y_old), torpedo.W, torpedo.L);
        // ctx3.strokeRect(torpedo.x_clear, Math.round(torpedo.y_old), torpedo.W, torpedo.L);
    };


    // Отрисовка движения корабля
    this.shipMove = function (ship) {
         ctx3.drawImage(elementGame_1, ship.x_img, ship.y_img, ship.width_img, ship.height_img, ship.posX, ship.posY, ship.width_ship, ship.height_ship);
    };

    // Очистка прямоугольника с кораблем для перерисовки
    this.shipClear = function (ship) {
        ctx3.clearRect(ship.posX-2, ship.posY, ship.width_ship+6, ship.height_ship);
        //ctx3.strokeRect(ship.posX, ship.posY, ship.width_ship, ship.height_ship);
    };

    // Конец игры. Вывод надписи
    this.gameOver = function () {
        ctx2.font = "95px 'Jockey One', sans-serif";
        ctx2.textAlign = "center";
        ctx2.fillStyle = "#D71F00";
        ctx2.fillText("GAME OVER", elemSize.GameOver.x, elemSize.GameOver.y);
        ctx2.fillStyle = "#7f1300";
        ctx2.font = "25px 'Jockey One', sans-serif";
        ctx2.fillText(`Ваш результат: ${settings.score}`, elemSize.GameOver.x, elemSize.GameOver.y + 50);
    };

    // Конец игры. Вывод информации о сохранении
    this.gameOverTextAfterSave = function (text) {
        ctx2.fillText(text, elemSize.GameOver.x, elemSize.GameOver.y + 80);
    };

    // Создаем Лоадер
    this.createLoader = function () {
        let draw = document.getElementById("app"),
            newLoader = document.createElement('div');

        newLoader.setAttribute("class", 'load-wrapp hide');
        newLoader.innerHTML = `
                <div class="loader">
                    <p>Загрузка...</p>
                    <div class="bar"></div>
                </div>`;
        draw.appendChild(newLoader);
    };

    // Показываем / скрываем Лоадер
    this.showLoader = function (color) {
        if(!firstPageCreate) this.createFirstOnPage();

        let loader = document.querySelector(".load-wrapp");
        if(loader) loader.classList.toggle('hide');
        if(color === "black") {
            loader.classList.add('black');
        } else {
            loader.classList.remove('black')
        }
    };

    // Вывод имени и фамилии + Выйти или только Войти
    this.updateUserInfo = function () {
        let exit = document.querySelector(".exitUrl"),
            enter = document.querySelector(".enterUrl"),
            userName = document.querySelector(".userName");

        if(userData) {
            userName.innerHTML = `${userData.name} ${userData.surname}`;
            exit.classList.remove("hide");
            enter.classList.add("hide");
        } else {
            exit.classList.add("hide");
            enter.classList.remove("hide");
            userName.innerHTML = "";
        }
    };

    // Форма, появляющаяся при паузе игры
    this.showFormGamePause = function () {
        let form = document.querySelector(".game-form"),
            overlay = document.getElementById("modal-overlay"),
            pauseOff = document.querySelector(".pauseOff");

        if(settings.gameOver) {
            if(pauseOff) pauseOff.classList.add("hide");         // Прячем "Продолжить игру" в конце игры
        } else {
            if(pauseOff) pauseOff.classList.remove("hide");
        }

        if(form) {
            form.classList.toggle("hide");
            overlay.classList.toggle('hide');
        }

        document.querySelector(".game").classList.remove("hide");
    };
    
    // Очистка всех канвасов
    this.clearAllCanvas = function () {
        if(ctx1) ctx1.clearRect(0, 0, settings.fieldW, settings.fieldH);
        if(ctx2) ctx2.clearRect(0, 0, settings.fieldW, settings.fieldH);
        if(ctx3) ctx3.clearRect(0, 0, settings.fieldW, settings.fieldH);
        if(ctx4) ctx4.clearRect(0, 0, settings.fieldW, settings.fieldH);
    };

    // Очистка канваса с кораблями
    this.clearShipCanvas = function () {
        if(ctx3) ctx3.clearRect(0, 0, settings.fieldW, settings.fieldH);
    };

    // Очистка канваса со взрывом
    this.clearBangCanvas = function () {
        if(ctx4) ctx4.clearRect(0, 0, settings.fieldW, settings.fieldH);
    }

}