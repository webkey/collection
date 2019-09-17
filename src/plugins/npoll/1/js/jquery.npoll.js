/**
 * Created by Serhiy on 06.04.2017.
 */
// Создадим функцию, которая будет задавать вопрос и выводить форму для ответа на него
// =============
// 1 (начало)
// Оборачиваем код (будущий) в анонимную функцию, которую сразу же и вызываем
// Пример: ;(function () {}());
// Создавая таким образом замыкание, в которое и помещаем код плагина
// Внутри замыкания можно размещать приватные данные, которые будут доступны
// только внутри плагина
// Это позволит безопасно использовать плагин вместе с другим js-кодом
// 1 (конец)

// 2 (начало)
// Так как не везде возможно обращение к jquery через знак $,
// то передадим сам объект jQuery в плагин добавив $ аргумент на вход анонимной функции
// и дописав параметр jQuery для вызова функции
// Пример: ;(function ($) {}(jQuery));
// или второй вариант записи
// Пример: ;(function ($) {})(jQuery);
// т.е., (jQuery) находится внутри круглых скобок, или снаружи
// 2 (конец)

// 3 (начало)
// Во внутрь плагина кроме jQuery можно передавать набор определенных объектов
// Обычно это angi.. (возможно undefined), window, document
// Такой подход позволяет увеличить скорость обращения к этим объектам, если
// часто используется обращение к ним
// 3 (конец)

// 4 (начало)
// Чтобы написать плагин jQuery, нужно расширить его прототип,
// дополнив своей функцией
// В jQuery для этого есть объект fn
// Добавляя новый метод в объект fn, создаем плагин
// Пример: $.fn.npoll = function(){};
// ============
// Важно! В каждом плагине желательно добавлять только ОДНУ функцию в объект fn.
// При этом можно создавать сколько угодно много приватных методов внутри своего плагина,
// но в fn нужно выносить только ОДИН метод
// ============
// 4 (конец)

;(function ($) {
	'use strict';

	/** 7 (начало) - Видео 4*/
	// Перед тем, как добавить метод в объект jQuery.fn,
	// нужно определить объект с настройками плагина
	// Дальше нужно позволить разработчику передавать объект с параметрами плагина на вход внешней функции плагина (см. 8)
	var defaults = {
		question: "What's your name?",
		buttonText: "Submit",
		categories: ["category_1", "category_2", "category_3"],
		// добавим возможность редактирования темы плагина
		// добавим имена класов к объекту настроек
		containerClass: "npoll",
		formClass: "npoll-form",
		buttonClass: "npoll-submit",
		// 7 (конец)

		/** 20.1 (начало) - Видео 9 */
		// Добавляем возможно пользовательской настройки ajax (переопределение любого папраметра ajax запроса).
		ajaxOptions: {
			url: "",
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json'
		},
		// 20.1 (конец)

		/** 19.2 (начало) (калбэк-функцию способ 1) */
		// Создаем калбэк-функцию
		// Способ 1.
		// Это первый способ. Простой. Она рабочий. Не удаляем.
		// created: function () {},
		// Вызываем ее вконце функции init() (см. 19.1)
		// 19.2 (конец)

		/** 21.2 (начало ) */
		// Насторйки по умолчанию для ошибки ajax запроса
		errorMessage: "Ошибка! Результаты голосования не получены",
		errorClass: 'npoll-error-message'
		// 21.2 (конец)
	};

	/** 8 (начало) - Видео 4 (var config) */
	// 8.1
	// Нужно позволить разработчику передавать объект с параметрами плагина на вход внешней функции плагина (см. 7)
	// Для этого в параметры функции добавим аргумен options
	// В него будут передаваться настройки, которые разработчик может поменять
	// 8.2
	//code// $.fn.npoll = function(options){
		// После передачи извне объекта настроек в плагин, нужно сформировать НОВЫЙ объект настроек
		// на основе объеденения defaults и передаваемого разработчиком на вход функции
		// При этом добавленные разработчиком параметры должны быть приоритетнее параметров defaults
		// Эту задачу решает метод jQuery.extend
		// Он вызывается на прямую из объекта jQuery и не требует аргументов на вход
		// Первый аргумент - объект, в котором будет объеденяться объект defaults и поданный разработчиком на вход (в даном случае это пустой объект {})
		// Второй аргумент - объект с настройками по умолчанию
		// Трений аргумент - объект с настойками поданными на вход
		//code// var config = $.extend({}, defaults, options)
		// Чтобы значения объекта options переписывали значения объекта defaults, options должен идти ПОСЛЕ defaults в списке аргументов метода $.extend
		// 8.3
		// К параметрам плагина обращение будет происходить через config.key
		// Пример: config.question => "What's your name?"
	//code// };
	// 8 (конец)

	/** 11 (начало) - Видео 5 (создаем Функцию-Конструктор)*/
	// создаем Функцию-Конструктор
	// название с большой буквы (Npoll) - стандарт принятый в сообществе java-script разработчиков
	function Npoll(element, options) {
		// В функцию-конструктор нужно перенести код из функции инициализации (jfirst.init())
		// А также переменные, которые использовались во внешней функции плагина
		// 11 (конец)

		// создадим переменную для this, чтобы можно было обращаться к ней из калбэк-функций
		var self = this;

		/** 20.4 (начало) */
		// Чтобы метод копировал и вложенные свойства объекта ajaxOptions: {} объекта defaults,
		// необходимо добавить аргумент true
		// 20.4 (конец)
		self.config = $.extend(true, {}, defaults, options);

		/** 12 (начало) - Видео 5 */
		// Вместо установки переменных внутри функции-конструктора (это ограничит область их видимости конструктором)
		// нужно разместить их внутри создаваемой сущности плагина как поля объекта this
		// Было:
		// var config = $.extend({}, defaults, options);
		// Стало:
		// this.config = $.extend({}, defaults, options);
		// переменну element тоже сохраняем внутри сущности плагина
		// (аргумент element в параметрах функции-конструктора - это элемент DOM-дерева, к которому будет применятся плагин) (см. 16)
		// (аргумет options в параметрах функции-конструктора - это набор параметров передаваемых на вход функции разработчиком)  (см. 16)
		self.element = element;
		// Вызываем функциию this.init();
		//??=============Почему this.init()? Ведь пока не создан прототип init(), логично было бы вызывать this.element.init() по аналогии с jfirst.init(); =============??
		// 12 (конец)

		/** 18.2 (начало) */
		// Инициализацию события "submit" привяжем к "element", а не к самой форме
		// Чтобы избежать вероятности отключений событий на всех формах.
		// Событие привязано не к самой форма, а к ее элементу-контейнеру (родителю)
		// Срабатыване события на родительском элементе формы
		// обеспечивается всплывание события вверх по дом-дереву
		self.element.on('submit', function (e) {
			e.preventDefault();
			// 18.2 (конец)

			/** 20.2 (начало) */
			// При нажатии кнопки отпавки формы, нужно получить значении ранее выбранного радибаттона
			// и сформировать ajax-запрос на сервер
			// Создадим новый объект с данными до того, как создается ajax-запрос
			// В него переместим данные (date) из ajax-запрос
			var dataObj = {
				// исользуем объкт барузера JSON и его методом .stringify()
				// внутрь метода передаем объект selected
				data: JSON.stringify({
					selected: self.element.find(':checked').val()
				})
			};
			// 20.2 (конец)

			/** 20.3 (начало) */
			// Создаем новый объект с настройками ajax,
			// который будет собираться из объедененных настроек по умолчанию (default) и переданных разработчиком (options)
			// а также dataObj
			var ajaxSettings = $.extend({}, self.config.ajaxOptions, dataObj);
			// 20.3 (конец)

			/** 18.5 (начало) */
			// Добавляем отправку ajax-запроса
			// с нужными параметрами
			$.ajax(
				/** 20.0 (начало) */
				// {
				// Переносим все параметры ajax-запроса в объект ajaxOptions объекта defaults (см. 20.1)
				// кроме data (5) так, как на момент закрузки плагина не известно, какой параметр выбрал пользователь (см. 20.2)
				// 1) адрес сервера, когда будет отправлено сообщение
				// url: "",
				// 2) метод обработки
				// type: 'GET',
				// 3) тип содержимого
				// contentType: 'application/json; charset=utf-8',
				// 4) тип посылаемых данных
				// dataType: 'json',
				// 20.0 (конец)
				// 5) используем объкт барузера JSON и его методом .stringify()
				// внутрь метода передаем объкт selected
				// data: JSON.stringify({
				// 	selected:self.element.find(':checked').val()
				// })

				/** 20.5 (начало) */
				// Добавляем созданный объект настроек ajaxSettings аргументом
				// для метода .ajax()
				ajaxSettings
				// 20.5 (конец) (сл. 21.0)
			).done(function (data) {
				// Привет от сервера!
				// метод done принимает на вход данные поступившие от сервера
				// 18.5 (конец)

				/** 21.0 (начало) - Видео 10 */
				// Создаем обработчик ошибок ajax
				// Убираем форму для голосования после отправки запроса
				// 1) сохраним подписи от вариантов ответа (почему не var? - чтобы был доступ из калбэк-функций)
				// self.labels = self.element.find('label');
				// 2) зафиксируем размеры блока, в которой располагается форма, а затем удаляем форму
				// для наглядности не удаляем, а меняем прозрачность
				// self.element.width(self.element.width()).height(self.element.height()).find('form').css('opacity', '0.5');
				// В данный момент форма скрывается в момент получения ответа, но лучше вынести в момет перед вызовом события об отправке данных на сервер
			}).fail(function (data) {

				/** 21.2 (начало) */
				// Помимо сообщения, можно вызывать пользовательские события при срабатывании ошибки
				// Но в этот раз добавим события другим способом, чем делали раньше
				// Позволим разработчикам возвращать false из функции обработчика
				// И если они это сделают, то дальнейшее код внутри обработчика не будет выполняться
				// Для выполнения такого функционала создадим новою переменную для возвращаемого значения внутри функции замыкания функции fail() var retVal
				// Внутрь этой переменной поместим возвращаемое значение от обработчика событий
				// Чтобы это стало возможным, мы не можем использовать функцию jquery .trigger()
				// Потому что trigger возвращает объект jquery для дальнейшего связывания
				// Но есть функция .triggerHandler(), которая возвращает именно то значение, которое возвращает обработчик события,
				// первым параметром которого будет название той ошибки, которую он будет обрабатывать 'respondeerror.npoll'
				// var retVal = self.element.triggerHandler('respondeerror.npoll');

				/** 21.6 (начало) */
				// Функция fail сама по себе принимает на вход аргумент data
				// Этот же объект можно предавать внуть функции обработчика
				// было var retVal = self.element.triggerHandler('respondeerror.npoll');
				// стало var retVal = self.element.triggerHandler('respondeerror.npoll', data);
				var retVal = self.element.triggerHandler('respondeerror.npoll', data);
				// Теперь разработчик может получить доступ к объкту xhr внутри своей функции
				// Поменяем еще передачу в настройки функции обработчика ошибки (см. в example.js)
				// 21.6 (конец)

				// Далее, нужно обернуть весь оставшийся код в условие, и проверять,
				// не равняется ли возвращаемое значение false
				if (retVal !== false) {
					self.element.append($('<div />', {
						text: self.config.errorMessage,
						'class': self.config.errorClass
					}));
				}
				/** 21.2 (продолжение) */
				// В данный момент код, коротый присоеединяет обработчики функций использует замыкание без возвращаемого значения,
				// а когда не указано возвращаемое значение, то возвращается undefined
				// Поэтому нужно добавить возможность передачи возвращаемого значения от обработчика в вызов события
				// Для этого нужно добавить return внутрь кода связывющего обработчики с событиями (см. 21.3)
				// 21.2 (конец)

				/** 21.4 (начало) */
				// Также нужно передавать внуть функции-обработчика ошибки ajax возвращаемое от сервера значение ответа
				// Даже если запрос возвращается с ошибкой у него может быть объект с данными, котрый пришел от сервера
				// И внутри этого объекта данных могут содержаться полезные сведенья, например о причине, по которой возникла ошибка
				// Для этого нужно изменить код добавления обработчиков для всех событий событий (см. 21.5)
				// 21.4 (конец)

				/** 21.1 (начало) */
				// Добавляем сообщени об ошибке
				// self.element.append($('<p />'), {
				// 	text: self.config.errorMessage,
				// 	'class': self.config.errorClass
				// });
				// Далее перехоим к пункту 21.2
				// 21.1 (конец)
			});
			// (1)
			self.labels = self.element.find('label');
			// (2)
			self.element.width(self.element.width()).height(self.element.height()).find('form').css('opacity', '0.5');
			// 21.0 (конец)

			/** 19.7 (начало) */
			// Добавляем пользовательское событие (калбэк-функцию)
			// после отпарвки запроса на сервер, но до получения ответа
			self.element.trigger('beforeResponse.npoll');
			/** 19.7 (продолжение) */
			// 19.7 (конец)
			// (сл. 20.0)

		});

		/** 18.4 (начало) */
		// При первом нажати на радиобаттон активируем кнопку
		// Событие нужно один раз, поэтому используем метод .one()
		// Событие привязываем к контейнеру, чтобы исключить возможность отключения обработчика с инпут-элементов
		self.element.one('change', function () {
			self.element.find('button').removeAttr('disabled');
		});
		// 18.4 (конец)

		/** 19.3 (начало) (Вызов калбэк функции - способ 2) */
		// Вызов калбэк функции
		// Способ 2.
		// Вызов пользовательских событий в определенных местах работы плагина.
		// Если нужно будет создать много калбэк функции, то придется создавать много пустых функци, что не есть хорошо
		// Второй способ заключается в вызове пользовательских событий в определенных местах работы плагина
		// а разработчик может отлавливать эти события так же передавая функцию в объект настроек плагина
		// Добавляем код в конструктор, который в цикле будет проходить поля объекта настроек,
		// и если это поле будет функцией, то оно будет установлено обработчиком события
		// с помощью метода .on()
		// 19.3 (конец)

		/** 19.4 (начало) */
		// Вызываем метод jQuery $.each()
		// На вход которому подаем объект настроек self.config
		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				/** 19.4 (продолжение) */
				// Если входной параметр value обладает типом данных function, вешаем на контейнер сооветствующий обаработчик.
				// 19.4 (продолжение - конец)

				/** 21.5 (начало) */
				// Автоматически функция будет принимать объект jquery.event, даже если его не указать
				// Он будет идти превым в списке его аргументов, поэмому мы его и добавим: function (е) См. ниже
				// Помимо этого нужно добавить аргумент под передаваемые параметры в обработчик function (е, param)
				// Аналогично сделаем и с вызовом непосредственно передаваемых функций обработчиков return value(e, self.element, param)
				// Теперь, при срабатывании события можно передавать внутрь него данные (см. 21.6)
				// 21.5 (конец)
				self.element.on(key + '.npoll', function (e, param) {
					/** 21.3 (начало) */
					// value(self.element); (см. 21.2)
					// !!! В любом случае возвращать желательно не только сам эелемент, но и событие (е)
					return value(e, self.element, param);
					// 21.3 (конец)
				});
				/** 19.4 (продолжение) */
				// Имоновать калбэк функию желательно в неймспейсе плагина: key + '.npoll'
				// value - это значение поля в обекте настроек, т.е. функция написанная разработчиком на соответствующее событие
				// Пояснения: Обход параметров настроек происходит до начала инициализации плагина (до вызова функции init()). Во время этого обхода на контейнер (self.element) вешаются все обработчики, которыи указываются разработчиком в объекте настроек. Но вызываются они в соответсвующем месте кода плагина с помощью метода .trigger() (см.19.5). При этом не забываем, что имя функции будет состоять из двух частей: назавание параметра в настройках (например, created) и постфикса .npoll (например, created.npoll)
				// 19.4 (конец)

				/** 19.6 (начало) */
				// Внутрь обработчика события необходимо передать елемент-контейнер (this.element)
				// Для этого нужно обернуть вызов функции-обработчика (value) в замыкание function (){value()};
				// Внутри этого замыкание можно передать елемент-контейнер на вход функции-обработчика function (){value(this.element);};
				// Но работает тоже, если не создавать замыкание: value(self.element)
				// ??===================Почему необходимо замыкание?=================??
				// Ответ. Если не помещать функцию в замыкание, то она будет вызываться, как только до нее дойдет выполнение кода, а замыкание предотращае "самостоятельный вызов". Тоесть анонимная функция не вызывается "сама по себе"!?
				// ??===================Нужно разобраться, что такое замыкания=================??
				// !!! Для всех калбэк функций необходимо создавать документацию !!!
				// Добавим еще одно событие внутрь кода плагина до получения отклика от сервера, но после отправки запроса (см. 19.7)
				// 19.6 (конец)
			}
		});
		self.init();
	}

	/** 13 (начало) - Видео 5 (Npoll.prototype.init) */
	// Вместо того, чтобы размещать функцию инициализаци в приватном пространстве плагина, присоеединяем ее к создаваемой сущности плагина с помощью определения ее как ПРОТОТИПА объкта функции Npoll
	// Npoll.prototype.init = function () {
	// 		здесь код функции
	// };
	// 13 (конец)

	Npoll.prototype.init = function () {

		/** 14 (начало) - Видео 5 */
		// Так как функции init() определена как функция (-прототип) объекта конструктра, можно получить доступ ко всем переменным заданным ранее внутри конструктора также используя this
		// т.е. к config обращаемся через this --> this.config
		// К this через this.element (В данном плагине он является первым элементом выборки - this.first() (см. 16))
		// Присоединение к контейнеру (раньше было jfirst, а после создания функции init() - this (см. 9)) происходит через this.element
		// Переменная jfirst (обращение к первому элементу выборки) больше не нужна
		// var jfirst = this.first();
		// 14 (конец)

		// Добавляем класс к создаваемому элементу
		this.element.addClass(this.config.containerClass);

		/** 5 (начало) (Формирование структуры формы опроса) */
		// Неважно!!!
		// 5.1 Добавляем на страницу вопрос
		$('<h1 />', {
			text: this.config.question
		}).appendTo(this.element);

		// 5.2 Создаем форму и добавляем ее на страницу в текущий элемент
		var form = $('<form/>').addClass(this.config.formClass).appendTo(this.element);

		/** 18 (начало) - Видео 7 (События) - продолжение в 18.2 */
		// ===События===
		// Необходимо отправять ajax-запрос, когда одна из радиконопок была выбрана, а затем нажата кнопка submit
		// Для этого добавляем хендлер для отлавливания события отправки формы,
		// добавив код в место, где уже создали форму (после .appendTo(this.element))
		// 	.on('submit', function (e) {
		// 		e.preventDefault();
		// 		console.log('submit');
		// 	});
		// Если по какой-то причине разработчик отключит событие отправки форм на всей странице
		// Например так: $('form').unbind('submit'),
		// то событие .on('submit') не будет выполняться
		// Для того, чтобы обойти запрет, нужно разместить обработчик события отправки формы не в функции инициализации, а в
		// функции-конструкторе перед вызовом функции init()(см. 18.2)
		// 18 (конец)

		/** 15 (начало) - Видео 5 */
		// можно сделать небольшое упрощение плагина
		// и ввести вхождени categories с помощью конструкции this.config.categories
		// ??=============Узнать, почему такой метод лучше==============??
		// ??=============Почему множественное повторение this.config.categories лучше,
		// чем создать переменную var categories = this.config.categories==============??
		// Чтобы не приходилось копировать их в отдельный объект
		// ??=============Почему "объект"? Это оговорка? Почему не "переменная"? Может в этом соль?
		// Может мы создаем не переменню, а новый объект, в который копируем значение this.config.categories
		// и это более ресурсозатратно?===========??
		// 15 (конец)
		// 5.3 Объявляем переменные вне цыкла (рекомендовано)
		// var x, y, categories = this.config.categories;
		var x, y;
		// 5.4 Создаем радиокнопки с атрибутами и подписями к радиокнопкам
		// проганяя в цикле по количесту категорий
		// Добавляем эти элементы внутрь формы
		// Стоит обратить внимание, что количество категорий categories сохраняется в переменную "y", а не определяется в условии
		for (x = 0, y = this.config.categories.length; x < y; x++) {
			$('<input />', {
				type: 'radio',
				name: 'categories',
				id: this.config.categories[x],
				value: this.config.categories[x]
			}).appendTo(form);
			$('<label />', {
				text: this.config.categories[x],
				"for": this.config.categories[x]
			}).appendTo(form);
		}
		// 5.5 Добавляем кнопку
		// в конец формы
		$('<button />', {
			"class": this.config.buttonClass,
			text: this.config.buttonText,
			// 18.3 (начало)
			// Чтобы избежать ошибки при отправлении формы с невыбранным баттоном,
			// при загрузке делаем конпку неактивной
			"disabled": "disabled"
			// 18.3 (конец)
		}).appendTo(form);
		// 5 (конец)

		/** 6 (начало) - Видео 3 (return this) */
		// Чтобы была возможность продолжить цепочку методов jQuery, в функции необходимо вернуть текущий эемент, т.е. this
		// return this;
		// Но чтобы плагин и следуюющие в цепочке методы применялись не только к первому элементу,
		// но и ко всем в выборке, нужно весь код обернуть в each и вернуть его
		// return this.each(function () {
		// 		здесь код плагина
		// });
		// 6 (конец)

		/** 19.1 (начало) - Видео 8 (Вызов калбэк функции) */
		// Добавим пустую функции в объект настроек по умолчанию
		// Способ 1.
		// Вызываем калбэк функцию created, объявленную в опциях по умолчанию defaults (см. 19.2)
		// И передаем ей на вход элемент-контейнер
		// Это первый способ. Простой. Она рабочий. Не удаляем.
		// this.config.created(this.element);
		// 19.1 (конец)

		// 19.5 (начало)
		this.element.trigger('created.npoll');
		// Пояснение. Название калбэк-функции является составным, и формируется на этапе обхода полей настроек в цикле (см. 19.4)
		// 19.5 (конец)
	};

	/** 9 (начало) - Видео 5 */
	// Первое, что нужно сделать, это присоеденить init-метод непосредственно к тому элементу, на котором он будет ВИЗУАЛИЗИРОВАТЬСЯ
	// Пример:
	//code// 	jfirst.init = function(){
	// 				здесь помещаем код создающий элементы (см. 5)
	// 				внутри этой функции this ссылается на сам jfirst (т.е. на var jfirst = this.first();)
	//code// 	}
	// 			вызываем функцию init
	//code// 	jfirst.init()
	// Пример (конец)
	// 9 (конец)

	/**==========Базовая структура плагина (начало)===========*/
	// Можно использовать для простых плагинов
	// Результат действий 1 - 9
	//code// ;(function ($) {
	//code// 	var defaults = {
	//code// 		key: param
	//code// 	};
	//code//
	//code// 	$.fn.npoll = function (options) {
	//code//
	//code// 		var config = $.extend({}, defaults, options);
	//code//
	//code// 		var jfirst = this.first();
	//code//
	//code// 		jfirst.init = function () {
	//code// 			/*здесь помещаем код создающий элементы (см. 5)*/
	//code// 		};
	//code//
	//code// 		jfirst.init();
	//code//
	//code// 		return jfirst;
	//code// 	};
	//code// })(jQuery);
	/**==========Базовая структура плагина (конец)===========*/

	/** 10 (начало) - Видео 5*/
	// В случае, если плагин более сложный базовой конструкции будет недостаточно
	// Вместо небольшой функции инициализации следует написать полноценную функцию-конструктор создающюю отдельные сущности плагина.
	// Для этого создаем навую функцию function Npoll(){}; (см. 11)
	// 10 (конец)

	/** 16 (начало) - Видео 5 ($.fn.npoll) */
	$.fn.npoll = function (options) {
		// Заменив все переменные в соответствии с новой архитектурой плагина
		// во внешней функции (в Npoll.prototype.init) плагина, дополняющего функционал jQuery
		// создаем новую сущность плагина для переданных в плагин элементов и опций (с помощью new)
		new Npoll(this.first(), options);
		// а также вернем
		// первый элемент
		return this.first();
	};
	// 16 (конец)

	/** 17 (начало) - Видео 5 (Результат) */
	// Результат:
	// Есть Конструктор для сущностей плагина,
	// к которому можно присоеденить что-угодно
	// Этот паттерн создан на основе легковесного паттерна Эдди Османи
	// Этот паттерн не такой очевидный и простой
	// как простое оборачивание функцией инициализации элемента
	// переданного на вход плагина
	// ??=============Посмотреть паттерны у Эдди Османи !!!=================??
	// Мы создали функцию-конструктор (function Npoll(element, options) {};)
	// и обернули создание новых элементов в функцию инициализации (Npoll.prototype.init = function () {};),
	// которая ПРИСОЕДИНЕНА на прамую к СУЩНОСТИ плагина ВОЗВРАЩАЕМОЙ КОНСТРУКТОРОМ
	// 17 (конец)

})(jQuery);