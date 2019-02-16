// Model
// Настройки игры
let settingsGame = {
    pauseShot: 4000,            // Пауза между выстрелами
    speedTurn: 10,              // Скорость движения перископа
    speedTorpedo: 1.1,          // Скорость движения торпеды
    speedArrowPosition: 10,      // Коэффициент снижения скорости движения стрелки позиции перископа
    torpedoGame: 6,             // количество торпед в игре
};

// Служебные параметры
let settings = {},
    elemSize = {},
    ship = {},                  // Массив созданного корабля
    state,
    localPage = "",
    userData = null;           // Данные из LocalStorrage

function ModelTorpedo() {
    let myView = null,
        pauseState = {};         // Сохранение состояний на момент паузы;

    // Инициализация 
    this.init = function (view) {
        this.gameSettingsInit();
        myView = view;
        window.location.hash ? localPage += window.location.href.split('#')[0] : localPage += window.location.href;
        userData = this.getLocal();
        this.changeHash();
    };

    // Первоначальные настройки игры
    this.gameSettingsInit = function () {
        settings = {
            pauseShot: settingsGame.pauseShot,                         // Пауза между выстрелами
            speedTurn: settingsGame.speedTurn,                         // Скорость движения перископа
            speedTorpedo: settingsGame.speedTorpedo,                   // Скорость движения торпеды
            speedArrowPosition: settingsGame.speedArrowPosition,       // Коэффициент снижения скорости движения стрелки позиции перископа
            torpedoNum: settingsGame.torpedoGame,                      // количество торпед в игре
            fieldW: window.innerWidth, // Ширина страницы
            fieldH: window.innerHeight,// Высота страницы
            score: 0,                   // Счет
            position: 0,                // смещение перископа
            factorW: 1,                 // коэффициент изменения ширины в зависимости от ширины страницы
            factorH: 1,                 // коэффициент изменения высоты в зависимости от высоты страницы
            factorShip: true,           // необходимо пересчитать габариты кораблей под новый размер экрана или нет
            coordPeriskopLeft: 0,       // координаты левой видимой части перископа
            coordPeriskopRight: 0,      // координаты правой видимой части перископа
            stateMove: null,            // положение движения перископа (двигается или нет, в какую сторону)
            topredoHit: null,
            gameOver: false,            // конец игры?
            gameOverTXT: "",            // Текст окончания игры
            pause: false,               // Игра на паузе
            newGame: true,              // Новая игра
            stopTorpedo: false,         // торпеда заряжается
            globalCoordX: 0             // Глобальные координаты по Х 
        };
    };

    // Коэффициент растягивания изображений и корректировки скоростей в зависимости от размеров страницы
    this.factorSizeCalc = function () {
        let periskopPictureWidth = 800;
        let periskopPictureHeight = 480;
        settings.factorW_old = settings.factorW;
        settings.factorH = (window.innerHeight / periskopPictureHeight).toFixed(2);
        settings.factorW = (window.innerWidth / periskopPictureWidth).toFixed(2);
        settings.speedArrowPosWithFactor = settings.speedArrowPosition / settings.factorW;
        settings.speedTurnWithFactor = settings.speedTurn / settings.factorW;
        settings.speedTorpedoWithFactor = settings.speedTorpedo * settings.factorH;

        this.sizeElementsCalc();
    };

    // Размеры элементов игры
    this.sizeElementsCalc = function () {
        elemSize.periskop = {"w": Math.round(800*settings.factorW), "h": Math.round(480*settings.factorH)};
        elemSize.scoreField = {"w": Math.round(135*settings.factorW), "h": Math.round(220*settings.factorH)};
        elemSize.shipScore = {"w": Math.round(90*settings.factorW), "h": Math.round(35*settings.factorH), "l": Math.round(20*settings.factorW), "t1": Math.round(35*settings.factorH), "t2": Math.round(80*settings.factorH), "t3": Math.round(125*settings.factorH), "t4": Math.round(170*settings.factorH)};
        elemSize.sea = {"w": Math.round(800*settings.factorW), "h": Math.round(420*settings.factorW), "t": Math.round(4*settings.factorH), "x": Math.round(190*settings.factorW), "y": Math.round(30*settings.factorH)};
        elemSize.arrowLeft = {"w": Math.round(322*settings.factorW), "h": Math.round(119*settings.factorH), "t": Math.round(settings.fieldH - 119*settings.factorH)};
        elemSize.arrowRight = {"w": Math.round(321*settings.factorW), "h": Math.round(119*settings.factorH), "t": Math.round(settings.fieldH - 119*settings.factorH), "l": Math.round(settings.fieldW - 321*settings.factorW)};
        elemSize.arrowPos = {"w": Math.round(8*settings.factorW), "h": Math.round(13*settings.factorH), "t": Math.round(66*settings.factorH)};
        elemSize.scoreText = {"x": Math.round(65*settings.factorW), "y": Math.round(25*settings.factorH)};
        elemSize.ArrowPosition = {"num": Math.round(80*settings.speedArrowPosWithFactor)};
        elemSize.torpedoGame = {"w": Math.round(6*settings.factorW), "h": Math.round(57*settings.factorH), "l": Math.round(settings.fieldW/2 - 75*settings.factorW), "t": Math.round(settings.fieldH - 120*settings.factorH)};
        elemSize.GameOver = {"x": Math.round(settings.fieldW/2), "y": Math.round(settings.fieldH/2 - 100)};
        elemSize.torpedoOn = {"w": Math.round(77*settings.factorW/1.2), "h": Math.round(77*settings.factorH/1.2), "l": Math.round(settings.fieldW - 130*settings.factorW), "t": Math.round(30*settings.factorW) };
        elemSize.bang = {"w": Math.round(25*settings.factorW), "h": Math.round(58*settings.factorH), "t": Math.round(window.innerHeight/2) };

        settings.coordPeriskopLeft = window.innerWidth/2 - 200 * settings.factorW - elemSize.ArrowPosition.num;
        settings.coordPeriskopRight = window.innerWidth/2 + 200 * settings.factorW + elemSize.ArrowPosition.num;

        settings.globalCoordX = Math.round(400 * settings.factorW + 2 * elemSize.ArrowPosition.num);

        settings.periskopR = window.innerWidth/2 + 200 * settings.factorW;
        settings.periskopL = window.innerWidth/2 - 200 * settings.factorW;
    };

    // Обновление размеров поля
    this.resizeField = function () {
        if(!settings.gameStarted) return;

        settings.fieldW = window.innerWidth;
        settings.fieldH = window.innerHeight;
        this.factorSizeCalc();
        myView.resizeField();
        settings.factorShip = true;  // пересчитать размеры кораблей
    };

    // Выстрел
    this.shot = function () {
        myView.shotSound();                 // звук выстрела
        myView.redrawFront();               // перерисовка интерфейса
        this.torpedoMove(new Torpedo());
    };

    // Торпеда зарядилась
    this.shotEnable = function () {
        myView.torpedoChargedSound();       // звук торпеда зарядилась
        myView.redrawFront();               // перерисовка интерфейса
    };

    // Обсчет траектории ракеты
    this.torpedoMove = function (torpedo) {
        let self = this;

        if(settings.gameOver || settings.pause) {
            if(torpedo) pauseState.torpedo = torpedo;
            return;
        }

        // корректировка размеров торпеды в зависимости от удаления
        if(torpedo.diffLength < 30*settings.factorH) torpedo.diffLength += 0.14 * settings.factorH;

        torpedo.diffWidth += 0.007 * settings.factorW;

        // обсчет координат по y (удаление)
        torpedo.y_old = torpedo.y;
        torpedo.y = Math.round(torpedo.y - torpedo.speed);

        if(torpedo && torpedo.y > settings.fieldH/2) {      // Торпеда запущена
            myView.torpedoClear(torpedo);
            torpedo.diffPositionNow = Math.round(settings.position - torpedo.torpedoPosition);                          // учет смещения перископа

            torpedo.x = Math.round((window.innerWidth - 4 * settings.factorW)/2 - torpedo.diffPositionNow);               // расчет координаты Х

            torpedo.x_clear = Math.round((window.innerWidth - 4 * settings.factorW)/2 - torpedo.diffPositionNow);      // расчет координаты Х для стирания
            torpedo.L = Math.round((66 - torpedo.diffLength) * settings.factorH);                                         // ширина торпеды
            torpedo.W = Math.round((6 - torpedo.diffWidth) * settings.factorW);                                           // длина торпеды

            myView.torpedoMove(torpedo);
            torpedo.torpedoPositionOld = Math.round(settings.position);
            if(torpedo.speedDown1 && torpedo.y < settings.fieldH/1.5) {             // Анализ на удаление, снижение скорости №1
                torpedo.speed *= 0.6;
                torpedo.speedDown1 = false;
            }
            if(torpedo.speedDown2 && torpedo.y < settings.fieldH/1.7) {             // Анализ на удаление, снижение скорости №2
                torpedo.speed *= 0.8;
                torpedo.speedDown2 = false;
            }
            requestAnimationFrame(() => self.torpedoMove(torpedo));
        } else if(torpedo && torpedo.y <= settings.fieldH/2) {                      // Торпеда долелета до "края" моря
            this.checkHit(torpedo);         // Проверка попадания
            myView.torpedoClear(torpedo);   // Стираем торпеду
            torpedo = null;                 // Удаляем объект торпеды
        }
    };
    
    // Проверка попадания в корабль
    this.checkHit = function (torpedo) {
        settings.topredoHit = true;

        // Есть попадание
        if (torpedo.x >= ship.param.posX && (torpedo.x <= ship.param.posX + ship.param.width_ship)) {
            ship.param.life -= 1;                      // отнимаем жизнь у корабля

            myView.bangSound();                         // звук взрыва
            myView.bangVideo(ship.param.posX);          // видео попадания

            if (ship.param.life === 0) {                // У корабля больше нет жизней
                settings.score += ship.param.price;     // начисляем очки
                ship = null;                            // убиваем объект с параметрами корабля
                myView.clearShipCanvas();               // очищаем canvas с караблем полностью
                this.shipControl();                     // создаем новый корабль
            }
        } else {        // Нет попадания
            settings.torpedoNum -= 1;                   // отнимаем одну торпеду
        }

        myView.redrawFront();                           // перерисовываем меню, чтобы отобразить измененное количество топред и баллов

        // Сохранение промежуточных значений в LocalStorrage
        if(userData) {
            userData.score = settings.score;               // сохраняем счет
            userData.torpedo = settings.torpedoNum;        // сохраняем количество торпед
            this.saveLocal(userData);
        }

        if (settings.torpedoNum === 0) {
        // if (settings.torpedoNum === 5) {       // для тестирования
            this.gameOver();
        }
    };

    // Движение перископа Влево
    this.turnLeft = function () {
        if(settings.gameOver || settings.pause) return;
        if(settings.position > -elemSize.ArrowPosition.num) {
            if(settings.position - settings.speedTurnWithFactor <= (-elemSize.ArrowPosition.num)) {
                settings.position = -elemSize.ArrowPosition.num;
            } else {
                settings.position -= settings.speedTurnWithFactor;
            }
            settings.position = Math.round(settings.position);
            requestAnimationFrame(() => myView.redraw());
        }
    };

    // Движение перископа Вправо
    this.turnRight = function () {
        if(settings.gameOver || settings.pause) return;
        if(settings.position < elemSize.ArrowPosition.num) {
            if(settings.position + settings.speedTurnWithFactor >= (elemSize.ArrowPosition.num)) {
                settings.position = elemSize.ArrowPosition.num;
            } else {
                settings.position += settings.speedTurnWithFactor;
            }
            settings.position = Math.round(settings.position);
            requestAnimationFrame(() => myView.redraw());
        }
    };

    // Начать движение корабля
    this.shipControl = function () {
        setTimeout(() => this.shipNew(), 100);
    };

    // Создание нового корабля
    this.shipNew = function () {
        let rand = 0;
        
        if(settings.gameOver || settings.pause) return;
        settings.factorShip = true;
        rand = Math.floor(Math.random()*(4-1+1))+1;
        this.shipMove(new Ship(rand));
    };

    // Расчеты движения корабля
    this.shipMove = function (newShip) {
        if(settings.gameOver || settings.pause) return;
        if(!newShip) return;

        ship = newShip;
        // Рассчитываем параметры, зависящие от масштаба
        if(settings.factorShip) {       // перерасчет параметров корабля
            ship.param.width_ship = Math.round(ship.param.width_img * settings.factorW * ship.param.factor);
            ship.param.height_ship = Math.round(ship.param.height_img * settings.factorH * ship.param.factor);
            ship.param.posX = settings.globalCoordX;
            ship.param.posGlobalX = settings.globalCoordX;
            ship.param.posY = Math.round(settings.fieldH/2 - ship.param.height_img * settings.factorH * ship.param.factor + 2 * settings.factorH);
            settings.factorShip = false;
        }

        // Смотрим виден ли корабль и нужно ли его отрисовывать
                        // let canv2 = document.getElementById("canvas2");
                        // let ctx22 = canv2.getContext('2d'); // Контекст
                        // ctx3.strokeRect(settings.periskopR, ship.param.posY, 50, 50);
                        // ctx22.strokeRect(settings.periskopR, 0, 150, 500);
                        // ctx22.strokeRect(kraiPeriskop.left, 0, 150, 500);

        if(settings.periskopR > ship.param.posX) {
            myView.shipClear(ship.param);
            myView.shipMove(ship.param);
        }

        if(ship.param.posX > (settings.coordPeriskopLeft - ship.param.width_ship)) {
            ship.param.posGlobalX = Math.round(ship.param.posGlobalX - ship.param.speed);      // глобальные координаты
            let ffact = settings.speedTurn/settings.speedTurnWithFactor;
            let ffact2 = 1;
            if(ffact > 1.9) {
                ffact = 1.9;
                ffact2 = 1.2
            } else {
                ffact2 = 0.9;
            }


            if (settings.stateMove === "left" && settings.position > (-elemSize.ArrowPosition.num)) {
                ship.param.posX = Math.round(ship.param.posX - ship.param.speed + ffact);
            } else if(settings.stateMove === "right" && settings.position < elemSize.ArrowPosition.num) {
                ship.param.posX = Math.round(ship.param.posX - ship.param.speed - ffact/ffact2);
            } else {
                ship.param.posX -= ship.param.speed ;
            }
                ship.param.posXglobal -= ship.param.speed ;
            requestAnimationFrame(() => this.shipMove(ship));
        } else if (ship.param.posX + ship.param.width_ship < settings.coordPeriskopLeft) {      // корабль ушел...
            ship = null;                // удаляем корабль
            this.shipControl();         // создаем новый корабль
        }
        
        if(settings.topredoHit) {
            settings.topredoHit = false;
        }
    };

    // Закончились торпеды. Обработка конца игры
    this.gameOver = function () {
        settings.gameOver = true;
        if (settings.score > 0) {
            if(!userData) {
                this.showFormEnter("gameOver");         // Форма регистрации
            }

            if(userData) {
                this.saveUserResultToBase(userData.name, userData.surname, userData.score);     // сохраняем в БД
            }
        }
        myView.gameOver();      // Вывод надписи
    };

    // Работа с Firebase
    // Сохранение результатов в БД
    this.saveUserResultToBase = function(name, surname, userscore) {
        let self = this,
            users = [],
            username = name + " " + surname;

        myAppDB.collection("gameResult").get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    users.push(doc.id);         // Массив всех пользователей
                    if(doc.id === "user_" + username.replace(/\s/g, "").toLowerCase()) {    // Есть пользователь в БД
                        if (userscore > doc.data().score) {                                 // Текущий результат выше результатов в БД, обновляем информацию в БД
                            self.addUser(username, userscore);
                            myView.gameOverTextAfterSave("Поздравляем, у Вас новый рекорд!");
                        }
                    }
                });

                if (users.indexOf("user_" + username.replace(/\s/g, "").toLowerCase()) === -1) {
                    self.addUser(username, userscore);                                  // Такого пользователя в БД нет, создаем
                    myView.gameOverTextAfterSave("Поздравляем с первым рекордом!");
                }
            });
    };

    // Создание записи в БД для нового пользователя
    this.addUser = function(username, userscore) {
        myAppDB.collection("gameResult").doc(`user_${username.replace(/\s/g, "").toLowerCase()}`).set({
            userName: `${username}`,
            score: `${userscore}`,
            date: Date.now(),
        })
            .then(function (username) {
                console.log("Информация добавлена в БД");
            })
            .catch(function (error) {
                console.error("Ошибка добавления информации в БД: ", error);
            });
    };

    // Получение списка пользователей из БД
    this.getUsersList = function() {
        let users = [];

        myAppDB.collection("gameResult").get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    users.push(doc.data());
                     // console.log(`${doc.id} => ${doc.data().userName} \(${doc.data().date}\) ${doc.data().score}`);
                });
            });
    };

    // Работа с навигацией
    // Смена хэша, вывод выбранной страницы
    this.changeHash = function () {
        let self = this;

        self.updateStateHash();
        if(state) {
            switch ( state.page ) {
                case 'main':
                    if(settings.gameStarted) {      // для работы кнопки НАЗАД браузера
                        settings.pause = true;
                        if(ship) pauseState.ship = ship;
                    }
                    self.mainPage();
                break;
                case 'game':
                    self.gamePage();
                break;
                case 'rules':
                    if(settings.gameStarted) {      // для работы кнопки НАЗАД браузера
                        settings.pause = true;
                        if(ship) pauseState.ship = ship;
                    }
                    self.rulesPage();
                break;
                case 'records':
                    if(settings.gameStarted) {      // для работы кнопки НАЗАД браузера
                        settings.pause = true;
                        if(ship) pauseState.ship = ship;
                    }
                    self.resultPage();
                break;
            }
        }
    };

    this.updateStateHash = function() {
        let URLHash = window.location.hash,
            linkFromHash;

        if (URLHash) {
            linkFromHash = URLHash.slice(2);
            window.location.href = localPage + "" + URLHash;
            state = {
                page: linkFromHash
            };
        } else {    // Нет хэша, выводим главную страницу
            this.mainPage();
        }
    };


// СТРАНИЦЫ
    // Главная страница
    this.mainPage = function () {
        settings.gameStarted = false;
        myView.clearPage();                 // очищаем страницу от заполнения (рекорды и т.п.)
        myView.hideGame();                  // прячем игру
        myView.createMainPage();            // Вывод главной страницы
    };

    // Страница игры
    this.gamePage = function () {

        settings.gameStarted = true;

        if(settings.pause) {                // игра на паузе, выходили в меню
            myView.showFormGamePause();     // показываем меню паузы
        } else {
            let form = document.querySelector(".game-form"),
                overlay = document.getElementById("modal-overlay");
            if(form) {
                form.classList.add("hide");
                overlay.classList.add('hide');
            }

            // восстанавливаем сохраненные пользователем данные
            if(!settings.newGame) return;
            if(userData) {
                if(userData.torpedo > 0) {
                    settings.score = userData.score;
                    settings.torpedoNum = userData.torpedo;
                }
            }
        }

        settings.newGame = false;
        myView.clearPage();                 // очищаем страницу
        myView.createGamePage();            // Вывод страницы игры
        this.factorSizeCalc();              // Расчет размеров объектов
        this.shipControl();                 // Запуск корабля/игры
    };

    // Страница правил
    this.rulesPage = function () {
        settings.gameStarted = false;
        myView.clearPage();                 // очищаем страницу
        myView.createRulesPage();           // Вывод страницы с правилами
    };

    // Страница результатов
    this.resultPage = function () {
        let users = [];

        settings.gameStarted = false;
        myView.clearPage();                 // очищаем страницу
        myView.showLoader();                // запускаем лоадер

        myAppDB.collection("gameResult").get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    users.push(doc.data());
                });

                // Сортировка по счету
                users.sort(function (a, b) {
                    if (+a.score > +b.score) {
                        return -1;
                    }
                    if (+a.score < +b.score) {
                        return 1;
                    }
                    return 0;
                });

              myView.createResultPage(users);   // Вывод страницы результатов
            });
    };

    // Нажата ссылка "Войти"
    this.showFormEnter = function (param) {
        myView.showHideFormEnter();     // показываем форму
    };

    // Нажата кнопка "Войти" в форме входа
    this.checkFormEnter = function () {
        let user = this.checkUserName();    // проверяем введенные данные

        if(user) {
            myView.showHideFormEnter();     // прячем форму
            this.saveLocal(user);           // Сохраняем пользователя в LocalStorrage
            userData = this.getLocal();     //
            myView.updateUserInfo();        // Показываем введенного пользователя
            if(settings.gameOver) {
                this.gameOver();
            }
        }
    };

    // Валидация данных формы
    this.checkUserName = function () {
        let regEx = /^[a-zA-Zа-яА-ЯёЁ'][a-zA-Z-а-яА-ЯёЁ']+[a-zA-Zа-яА-ЯёЁ']?$/,
            nameInp = document.getElementById("name"),
            surnameInp = document.getElementById("surname"),
            nameExp = regEx.test(nameInp.value),
            surnameExp = regEx.test(surnameInp.value),
            user = {};

        user.name = nameInp.value.trim();
        user.surname = surnameInp.value.trim();

        if(!nameExp || user.name.length < 3) {
            document.getElementById("err_enter").innerHTML = "Имя введено не верно";
            return;
        }
        if(!surnameExp || user.surname.length < 3) {
            document.getElementById("err_enter").innerHTML = "Фамилия введена не верно";
            return;
        }

        user.score = settings.score;
        user.torpedo = settings.torpedoNum;
        nameInp.value = "";
        surnameInp.value = "";

        return user;
    };

    //Сохраняем пользователя в LocalStorrage
    this.saveLocal = function (user) {
        localStorage.UserInfo = JSON.stringify(user);
    };

    // Получение данных о пользователе из LocalStorrage
    this.getLocal = function() { //достать данные из хранилища
        let user = null;

        if(localStorage.UserInfo) { user = JSON.parse(localStorage.UserInfo); }
        return user;
    };

    // удаляем данные пользователя в LocallStorrage
    this.clearLocal = function() {
        localStorage.clear();
    };

    // Пользователь хочет выйти из введенных Имени и Фамилии
    this.exitBtnClick = function () {
        this.clearLocal();          // Очищаем LocallStorrage
        userData = null;
        myView.updateUserInfo();    // Убираем имя и "Выйти"
    };

    // Игра на паузу. Вывод меню
    this.pause = function () {
        settings.pause = true;
        if(ship) pauseState.ship = ship;
        myView.showFormGamePause();
    };

    // Продолжить игру после паузы
    this.backGameFromPause = function () {
        settings.pause = false;

        myView.showFormGamePause();
        if(pauseState.ship) this.shipMove(pauseState.ship);
        if(pauseState.torpedo) this.torpedoMove(pauseState.torpedo);
    };

    // Начать новую игру
    this.newGame = function () {
        // сброс настроек
        this.gameSettingsInit();
        elemSize = {};
        ship = {};
        state = null;
        localPage = "";

        if(userData) {                  // в LocalStorrage обнуляем счет
            userData.score = 0;
            userData.torpedo = settingsGame.torpedoGame;
            this.saveLocal(userData);
        }
        myView.clearAllCanvas();        // очищаем канвас
        this.gamePage();                // запуск игры
    };

    // Переход на главную из меню Игры
    this.fromGameToMain = function () {
        settings.pause = true;      // ставим на паузу
        myView.hideGame();          // прячем лешнее с экрана
    };
}

    let appModel = new ModelTorpedo(),
        appController = new ControllerTorpedo(),
        appView = new ViewTorpedo();

    //вызвать init-методы...
    appModel.init(appView);
    appView.init();
    appController.init(appModel);


// Конструктор торпеды
function Torpedo() {
    this.torpedoPosition = settings.position;       // Координаты выстрела
    this.torpedoPositionOld = settings.position;    // Координаты выстрела
    this.y = 440*settings.factorH;                  // Низ перископа на картинке
    this.y_old = 440*settings.factorH;              // Для закрашивания
    this.diffLength = 0;                            // Для уменьшения длинны торпеды при удалении
    this.diffWidth = 0;                             // Для уменьшения ширины торпеды при удалении
    this.speedDown1 = true;                         // 1-я ступень снижения скорости
    this.speedDown2 = true;                         // 2-я ступень снижения скорости
    this.speed = settings.speedTorpedoWithFactor;   // Скорость торпеды с учетом масштаба страницы
}

// Конструктор кораблей
function Ship(i) {
    let param = [];

    param[1] = {            // первый справа
        x_img: 861,         // позиция Х корабля в файле ресурса
        y_img: 579,         // позиция Y корабля в файле ресурса
        width_img: 100,     // ширина корабля в файле ресурса
        height_img: 63,     // высота корабля в файле ресурса
        move_from: "right", // корабль двигается справа на лево
        speed: 0.8,         // скорость
        life: 2,            // число жизней
        posX: 0,            // позиция корабля по Х на поле
        posGlobalX: 0,      // позиция корабля по Х на поле в глобальных координатах
        posY: 1,            // поизция корабля по Y на поле (вычисляется)
        width_ship: 1,      // ширина корабля на поле (вычисляется)
        height_ship: 1,     // высота корабля на поле (вычисляется)
        price: 50,          // очков за потопление
        factor: 0.5         // коэффициент уменьшения размеров корабля (пропорции)
    };

    param[2] = {            // второй справа
        x_img: 720,         // позиция Х корабля в файле ресурса
        y_img: 579,         // позиция Y корабля в файле ресурса
        width_img: 90,      // ширина корабля в файле ресурса
        height_img: 63,     // высота корабля в файле ресурса
        move_from: "right", // корабль двигается справа на лево
        speed: 0.9,         // скорость
        life: 1,            // число жизней
        posX: 0,            // позиция корабля по Х на поле
        posGlobalX: 0,      // позиция корабля по Х на поле в глобальных координатах
        posY: 1,            // поизция корабля по Y на поле (вычисляется)
        width_ship: 1,      // ширина корабля на поле (вычисляется)
        height_ship: 1,     // высота корабля на поле (вычисляется)
        price: 70,          // очков за потопление
        factor: 0.5         // коэффициент уменьшения размеров корабля (пропорции)
    };

    param[3] = {            // треттий справа
        x_img: 561,         // позиция Х корабля в файле ресурса
        y_img: 579,         // позиция Y корабля в файле ресурса
        width_img: 125,     // ширина корабля в файле ресурса
        height_img: 65,     // высота корабля в файле ресурса
        move_from: "right", // корабль двигается справа на лево
        speed: 0.8,         // скорость
        life: 2,            // число жизней
        posX: 0,            // позиция корабля по Х на поле
        posGlobalX: 0,      // позиция корабля по Х на поле в глобальных координатах
        posY: 1,            // поизция корабля по Y на поле (вычисляется)
        width_ship: 1,      // ширина корабля на поле (вычисляется)
        height_ship: 1,     // высота корабля на поле (вычисляется)
        price: 100,         // очков за потопление
        factor: 0.5         // коэффициент уменьшения размеров корабля (пропорции)
    };

    param[4] = {            // четвертый справа
        x_img: 320,         // позиция Х корабля в файле ресурса
        y_img: 570,         // позиция Y корабля в файле ресурса
        width_img: 156,     // ширина корабля в файле ресурса
        height_img: 74,     // высота корабля в файле ресурса
        move_from: "right", // корабль двигается справа на лево
        speed: 0.7,         // скорость
        life: 3,            // число жизней
        posX: 0,            // позиция корабля по Х на поле
        posGlobalX: 0,      // позиция корабля по Х на поле в глобальных координатах
        posY: 1,            // поизция корабля по Y на поле (вычисляется)
        width_ship: 1,      // ширина корабля на поле (вычисляется)
        height_ship: 1,     // высота корабля на поле (вычисляется)
        price: 150,         // очков за потопление
        factor: 0.5         // коэффициент уменьшения размеров корабля (пропорции)
    };

    this.param = param[i];
}
