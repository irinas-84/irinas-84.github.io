window.onload = () => {
	// шаг движения картинки
	const step   = 50;
	// скорость, чем меньше цифра, тем быстрее скорость
	const speed  = 10

	// Элементы слайдера
	let slider   = document.querySelector(".slider");
	let body     = slider.querySelector(".slider_body");
	let wrapper  = body.querySelector('.slider_wrapper');
	let prev     = slider.querySelector(".button_prev");
	let next     = slider.querySelector(".button_next");
	let items    = slider.querySelectorAll(".slider_item")
	// очередь для обработки
	let queue    = [];
	// текущее движение
	let timeout  = null;
	// индекс текущей картинки
	let index    = 0;

	// метод сокрытия текущей картинки
	let hideCurrent = (direction, done) => {
		// отступ слева
		let left    = 0;
		// ширина блока с картинками
		let width   = body.getBoundingClientRect().width;
		// используется для расчета процента прозрачности
		let total   = width;

		// покажем текущую картинку
		items[index].style.display = "block";
		
		// метод для повторения 
		let callback = () => {
			// закончили движение
			if(width < 0) {
				// скрываем блок и прозрачность возвращаем на не прозрачный
				items[index].style.display = "none";
				items[index].style.opacity = 1;
				// сбросим текущее движение
				timeout = null;
				// сообщим о завершении
				return done();
			}

			// расчет процента прозрачности в зависсимости от завершонности
			let opacity = Math.round(width * 100 / total, 2);

			// сдвигаем на шаг
			width -= step;
			// ширина блока не кратна шагу, уйдём за грань
			if(width < 0){
				// вычисляем, сколько осталось сдвинуть
				left += direction * (width * -1);
			} else {
				// сдвигаем на шаг
				left += direction * step;
			}

			// применим новое значение
			items[index].style.left = left + 'px';
			items[index].style.opacity = opacity/100;

			// продолжаем выполнение
			timeout = setTimeout(() => callback(), speed);
		};

		// стартуем анимацию
		callback();
	};

	// метод для отображения следующего слайда
	let showNext = (direction, done) => {
		// берем размеры слайдера
		let width   = body.getBoundingClientRect().width;
		// используется для расчёта прозрачности
		let total   = width;
		// отступ слева выставляем сразу, затем в будем двигать к нулевому значению
		let left  = direction * width;

		// берём следующий/предыдущий индекс
		index += direction;

		// это был самый первый, значит возьмём последний
		if(index < 0){
			index = items.length - 1;
		}

		// это был последний, значит возьмём первый
		if(index >= items.length){
			index = 0;
		}

		// покажем новый слайд и выставим нужную позицию
		items[index].style.display = "block";
		items[index].style.left = left + 'px';

		let callback = () => {
			// закончили анимацию
			if(width < 0) {
				// сбрасываем таймер и сообщаяем о завершении
				timeout = null;
				return done();
			}

			// расчитаем прозрачность
			let opacity = Math.round(width * 100 / total, 2);

			// сдвигаем на шаг
			width -= step;
			// ширина блока не кратна шагу, уйдём за грань
			if(width < 0){
				// вычисляем, сколько осталось сдвинуть
				left -= direction * (width * -1);
			} else {
				// сдвигаем на шаг
				left -= direction * step;
			}

			// применим сдвиг и прозрачность
			items[index].style.left = left + 'px';
			items[index].style.opacity = 1-(opacity/100);

			// продолжаем выполнение
			timeout = setTimeout(() => callback(), speed);
		};

		// стартуем анимацию
		callback();
	};

	// метод для движения
	let move = () => {

		// получим из очереди нужное направление
		let direction = queue.shift();

		// очередь пустая, можно не продолжать
		if(direction === undefined) {
			return;
		}

		// запускаем поочерёдно анимацию скрытия и показа фремов
		hideCurrent(direction, () => {
			// для показа, реверснём направление
			showNext(direction * -1, () => {
				// анимация перехода завершена

				// вызовем движение снова, возможно там есть ещё в очереди что-то
				move();
			})
		})
	};

	// обработчик нажания кнопок
	let onClick = (direction) => {
		return () => {
			queue.push(direction);

			if( ! timeout) {
				move();
			}
		};
	};

	// нажатие на кнопку "назад"
	prev.addEventListener("click", onClick(1));

	// нажатие на кнопку "вперед"
	next.addEventListener("click", onClick(-1));

	// покажем текущий(первый) слайд
	items[index].style.display = "block";

	// @TODO: сделать анимацию для показа первого кадра
};
