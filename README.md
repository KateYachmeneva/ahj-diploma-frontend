
### Badge
[![Build status](https://ci.appveyor.com/api/projects/status/o75kamlqim2obw82?svg=true)](https://ci.appveyor.com/project/KateYachmeneva/ahj-diploma-frontend)

[Ссылка на GitHub Pages](https://kateyachmeneva.github.io/ahj-diploma-frontend/)<br>
[Репозиторий Backend](https://github.com/KateYachmeneva/ahj-diploma-backend)

---

#Медиа органайзер

Сервис для храния и сортировки текстовых данных, ссылок и медифайлов



1. Сохранение в истории текстовых сообщений
2. Сохранение в истории ссылок
3. Разметки ссылок в сообщениях
4. Сохранение в истории изображений
5. Сохранение в истории видео-файлов
6. Сохранение в истории аудио-файлов
7. Сохранении в истории любых файлов, не относящихся к вышеуказанным форматам, для последующего скачивания
8. Загрузка изображений и файлов с использованием Drag & Drop
9. «Простая» подгрузка. Постепенная подгрузка сообщений (по 10 сообщений) из истории по мере прокрутки ленты сообщений.
10. Синхронизация нескольких открытых Органайзеров между собой, в том числе между отдельными вкладками в рамках одного браузера, так и между отдельными браузерами и устройствами
11. Запись аудио-сообщений с помощью встроенного микрофона
12. Запись видео-сообщений с помощью встроенной веб-камеры
13. Воспроизведение аудио-сообщений
14. Воспроизведение видео-сообщений
15. Прикрепление к сообщению точки геолокации и просмотр отметки с помощью Яндекс.Карт
16. Закрепление сообщений. Сообщение закрепляется сверху ленты сообщений. Одновременно закреплено может быть только одно сообщение
17. Добавление сообщений в избранное и просмотр избранных сообщений
18. Автоматическая сортировка и просмотр сообщений по категориям «Избранное», «Ссылки», «Изображения», «Видео», «Аудио», «Файлы»
19. Удаление сообщений

## Отправка сообщений

Ввод текстовых сообщений производится с помощью поля, расположенного в нижней части листа сообщений. Отправка сообщения происходит по нажатию клавиши Enter. Отправление пустых сообщений запрещено.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/1-sendtext.png)

Отправленное сообщение добавляется в базу данных Органайзера и появляется в ленте сообщений. При этом в сообщении отмечается дата и время отправки.

## Отправка ссылок

Ссылки распознаются, как ссылки при наличии указанного протокола http или https . В одном сообщении может быть указано сразу несколько ссылок.После отправки, распознанные ссылки помещаются в раздел Хранилища.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/2-sendlinks.png)


## Отправка файлов

Для отправки файла необходимо выбрать соответствующую категорию в выпадающем меню отправки.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/3-addfiles.png)

Отправка файла возможна также при помощи функции drug and drop.Форма закрывается, нажатием креста в верхнем углу.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/4-drag&drop.png)

После выбора или перетаскивания файл будет автоматически отправлен в Органайзер, распознан и добавлен в ленту сообщений и в Хранилище.
При этом файлы изображений показываются в виде изображений, видео и аудио в виде проигрывателей, прочие файлы в виде ссылки на скачивание.

## Запись аудио и видео

Для записи своих аудио и видео сообщений необходимо выбрать соответствующую категорию в дополнительном меню формы отправки.Для этого необходимо 
предоставить соответствующее разрешение на использование микрофона и видеокамеры. Форма закрывается, нажатием креста в верхнем углу.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/5-video.png)

Запись начинается при нажатии красного круга на открывшейся панели. После остановки записи сформированный файл автоматически отправляется в Органайзер, 
распознаётся и сортируется.

## Добавление геолокации

Для добавления метки геолокации к сообщению необходимо выбрать соответствующую категорию в дополнительном меню формы отправки. При этом необходимо 
предоставить соответствующие разрешения для браузера на распознование расположения.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/6-geo.png)

Метка геолокации добавляется к сообщению для последующей отправки и отображается в левой верхней части формы отправки. Удаление метки производится 
нажатием креста возле координат.
При отправке файлов или записи своих аудио и видео сообщений геометку необходимо добавлять перед выбором файла или перед началом записи.

В ленте сообщения прикреплённая метка геолокации является ссылкой на Яндекс.Карты с отображением места по указанным координатам.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/7-geoMessage.png)

## Дополнительное меню

При наведении курсора на сообщение в ленте сообщений Органайзера в правом верхнем его углу появляется интерактивная точка, по нажатию на которую 
открывается дополнительное меню для этого сообщения.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/8-toolsMessage.png)

### Удаление сообщения

Удаление сообщения производится путём нажатия на соответствующую кнопку в дополнительном меню сообщения.
Удаление производится из ленты и из категорий Хранилища. Если сообщение было закреплено, оно также снимается из закреплённого.

### Закрепление сообщения

Закрепление сообщения производится путём нажатия на кнопку скрепки в дополнительном меню сообщения.
При этом копия сообщения помещается в верхнюю область ленты сообщений и остаётся там при прокрутке или обновлении страницы.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/9-pinnedMessage.png)

Из области закреплённого сообщения доступно снятие закрепления через нажатие на кнопку крест в правой части закреплённого сообщения. А также отдельный 
просмотр выделенного сообщения через нажатие на кнопку стрелки.
Снятие сообщения из закреплённого производится также нажатием на появившуюся кнопку скрепки на сообщении, без захода в дополнительное меню.

### Добавление в избранное

Сообщения можно добавлять в список избранных и удалять из списка избранных. Для этого в правом верхнем углу поля сообщения необходимо активировать/
деактивировать кнопку избранного ("звездочка")

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/10-favouriteMessage.png)

## Хранилище Органайзера

В Хранилище сохраняются и распределяются по категориям отправленные сообщения.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/11-storage.png)

Категории сообщений:
* Избранное
* Ссылки
* Изображения
* Видео
* Аудио
* Файлы
В каждой категории можно отдельно посмотреть сообщения.

### Просмотр сообщений из категории Хранилища

Просмотр отдельного сообщения в категории производится путём нажатия на стрелку слева от сообщения.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/12-showMessage.png)

### Просмотр избранных сообщений

Просмотр избранных сообщениний выглядит иначе.При выборе пункта Избранное в Хранилище все сообщения, отмеченные избранными, открываются единым списком 
вместо ленты сообщений в левой части Органайзера.

![](https://github.com/KateYachmeneva/ahj-diploma-frontend/blob/master/readme_pic/13-favouriteMessage.png)>

Закрытие ленты избранных сообщений производится аналогично закрытию категории Хранилища.

---
Структура приложения (классы)
* Media.js – основной класс приложения. Отвечает за визуальный рендер.
* DrawUI.js – отрисовка DOM-элементов.
* CreateRequest.js – логика общения с сервером через WebSockets
* SidePanel.js – боковая панель Органайзера - Хранилище и категории
* FileLoader.js – загрузка файлов, Drag & Drop
* MediaLoader.js – запись и обработка видео и аудио сообщений
* Geolocation.js – определение геолокации
* Favourites.js – работа с избранными сообщениями
* Pin.js – закрепление сообщения

Web-версия приложения опубликована через [GitHub Pages](.
Серверная часть (бэкенд) через сервис [Heroku](), подразумевающий следующие ограничения:
* сброс серверной части и базы данных спустя 30-60 минут
* время запуска после простоя и поступление первого ответа спустя 10-30 секунд после обращения
* закрытие канала WebSockets спустя 50-60 секунд бездействия