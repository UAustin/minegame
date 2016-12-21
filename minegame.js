var log = function() {
	console.log.apply(console, arguments)
}

var e = function(selector) {
	return document.querySelector(selector)
}

var es = function(selector) {
	return document.querySelectorAll(selector)
}

var appendHtml = function(element, html) {
	element.insertAdjacentHTML('beforeend', html)
}

var bindEvent = function(element, eventName, callback) {
	element.addEventListener(eventName, callback)
}


var bindAll = function(selector, eventName, callback, responseClass){
	var elements = document.querySelectorAll(selector)
    if(responseClass == null) {
        for(var i = 0; i < elements.length; i++) {
            var e = elements[i]
            bindEvent(e, eventName, callback)
        }
    } else {
        for(var i = 0; i < elements.length; i++) {
            var e = elements[i]
            bindEventDelegate(e, eventName, callback, responseClass)
        }
    }
}

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var removeMine = function(target) {
	if (target.classList.contains('mine')) {
        target.classList.remove('mine')
        var mines = e('#id-span-mines')
        var num = parseInt(mines.innerHTML)
        mines.innerHTML = num + 1
    }
}

// 点击显示
var clickedShow = function(target) {
	// 找到类的所有 div 的子元素的值
	var value = target.children[0]
	// log('value', value)
	if (!target.classList.contains('clicked')) {
		target.classList.add('clicked')
		if(value.innerHTML != 0){
			value.classList.add('show')
		}
		squareLeft -= 1
	}
	removeMine(target)

	if (value.innerHTML == '爆') {
		testLose()
	} else {
		testWin()
	}
	return value.innerHTML
}

// 每个小格的位置
var indexOfItem = function(target) {
	var id = target.id
	var idItem = id.split('-')
	// log('idItem',idItem)
	var result = []
	result.push(parseInt(idItem[2]))
	result.push(parseInt(idItem[3]))
	// log('result', result)
	return result
}

var clickItem = function(x, y) {
	if( x < 0 || x > 11 ) {
		return
	}
	if( y < 0 || y > 11 ) {
		return
	}
	var id = `#id-cell-${x}-${y}`
	var a = e(id)
	if( !a.classList.contains('clicked') ) {
		leftClicked(a)
	}
}

// 点击小片区查询，无雷的格子循环显示出来
var roundShow = function(item) {
	var x = item[0]
	var y = item[1]
	for(var i = x - 1; i <= x + 1; i++) {
		for(var j = y - 1; j <= y + 1; j++) {
			clickItem(i, j)
		}
	}
}

// 鼠标左击后如果 小格子a==0, 找到 indexOfItem， 然后 roundShow
var leftClicked = function(target) {
	var a = clickedShow(target)
	if (a == 0) {
		var item = indexOfItem(target)
		roundShow(item)
	}
}

// 鼠标右击，查找雷
var rightClicked = function(target) {
	var mines = e('#id-span-mines')
	var num = parseInt(mines.innerHTML)
	if (target.classList.contains('clicked')) {
		return
	}
	if (target.classList.contains('mine')) {
        target.classList.remove('mine')
        mines.innerHTML = num + 1
    } else {
        target.classList.add('mine')
        mines.innerHTML = num - 1
    }
    testWin()
}

var clicked = function(event) {
	// 计时开始
	ticTok()
	var target = event.target
	if ( target.classList[0] == 'value') {
		target = target.parentElement
	}
	if (event.button == 0) {
		leftClicked(target)
	} else if (event.button == 2) {
		rightClicked(target)
	}
}

var clickedAll = function() {
	var squares = es('.square')
	for(var i = 0; i < squares.length; i++) {
		var target = squares[i]
		if(target.classList.contains('mine') == false) {
			target.classList.add('clicked')
		}
		var value = target.children[0]
		if(value.innerHTML != '0') {
			value.classList.add('show')
		}
	}
}

var removeClassAll = function(events, className) {
	for(var i = 0; i < events.length; i++) {
		var e = events[i]
		if (e.classList.contains(className)) {
        	e.classList.remove(className)
    	}
	}
}

var refresh = function() {
	var values = es('.value')
	removeClassAll(values, 'show')
	var squares = es('.square')
	removeClassAll(squares, 'clicked')
	removeClassAll(squares, 'mine')
	if (event != undefined) {
		var target = event.target
		if (target.classList.contains('start')) {
			num = Number(target.value)
		}
	}
	refreshValue(num)
	var mines = e('#id-span-mines')
	mines.innerHTML = num
	squareLeft = 144
	resetTimer()
}

// 对每一行进行修改并赋值
var modifyLine = function(line, nums) {
	var nodes = line.children
	for(var i = 0; i <nodes.length; i++) {
		var span = nodes[i].children[0]
		if(nums[i] != 9) {
			span.innerHTML = nums[i]
		} else {
			span.innerHTML = '爆'
		}
	}
}

// 计算每一行‘雷’ 的数量
var countMineLine = function(array) {
	var num = 0;
	for(var i = 0; i < array.length; i++) {
		if(array[i] == 9) {
			num++
		}
	}
	return num
}

// 雷数变化
var refreshValue = function(num) {
	var totalArray = area(12, 12, num)
	// log('totalArray', totalArray)
	var valuesLine = es('.square-line')
	for(var i = 0; i < totalArray.length; i++) {
		var nums = totalArray[i]
		// log('nums', nums)
		var line = valuesLine[i]
		// log('line', line)
		modifyLine(line, nums)
	}
	// 计算“雷”的总数
	var num = 0
	for(var i = 0; i < totalArray.length; i++) {
		num += countMineLine(totalArray[i])
		// log('num', num)
	}
}

// 点击后，开始计时
var ticTok = function() {
	var time = e('#id-span-time')
	if(!time.classList.contains("time")) {
		time.classList.add("time")
		time.interval = setInterval(function() {
			var t = parseInt(time.innerHTML) + 1
			time.innerHTML = t
		}, 1000)
	}
}

// 重新计时
var resetTimer = function() {
	var time = e('#id-span-time')
	time.innerHTML = 0
}

// 清空计时
var stopTimer = function() {
	var time = e('#id-span-time')
	if(time.classList.contains("time")) {
		clearInterval(time.interval)
		time.classList.remove("time")
	}
}


var random01 = function() {
	/*
	js 标准数学库有一个随机数函数
	Math.random()
	它返回 0 - 1 之间的小数

	用它实现本函数, 返回 0 或 1
	*/
  var n = Math.random()
  if (n > 0.5) {
    return 1
  }
  return 0
}

var randomLine01 = function(n) {
	/*
	返回一个只包含了 0 1 的随机 array, 长度为 n
	假设 n 为 5, 返回的数据格式如下(这是格式范例, 真实数据是随机的)
	[0, 0, 1, 0, 1]
	*/
  var result = []
  for (var i = 0; i < n; i++) {
    var r = random01()
    result.push(r)
  }
  return result
}

var randomLine09 = function(n) {
    /*
    返回一个只包含了 0 9 的随机 array, 长度为 n
    假设 n 为 5, 返回的数据格式如下(这是格式范例, 真实数据是随机的)
    [0, 0, 9, 0, 9]
    */
    var line = randomLine01(n)
    for (var i = 0; i < line.length; i++) {
      if (line[i] === 1) {
        line[i] = 9
      }
    }
    return line
}

var shuffle = function(array)  {
    var len = array.length
    for(var i = 0; i < len - 1; i++) {
        var temp = array[i]
        var index = Math.floor(Math.random() * (len - i) + i)
        array[i] = array[index]
        array[index] = temp
    }
}

var randomArray09 = function(len, num) {
    var line = []
    for(var i = 0; i < num; i ++) {
        line.push(9)
    }
    while(line.length < len) {
        line.push(0)
    }
    shuffle(line)
		// log('line', line)
    return line
}

var randomSquare09 = function(x, y, num) {
    var result = []
    var len = x * y
    var array = randomArray09(len, num)
		// log('array', array)
    for(var i = 0; i < x; i++) {
        var everyLine = array.slice(i * y, (i + 1) * y )
				// log('everyLine', everyLine)
        result.push(everyLine)
				// log('result09', result)
    }
    return result
}


var clonedSquare = function(array) {
  var s = []
  for (var i = 0; i < array.length; i++) {
    var line = []
    for (var j = 0; j < array[i].length; j++) {
      line.push(array[i][j])
    }
    s.push(line)
  }
  return s
}

var plus1 = function(array, x, y) {
    var n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

var markAround = function(array, x, y) {
  if (array[x][y] === 9) {
    plus1(array, x - 1, y - 1)
    plus1(array, x - 1, y)
    plus1(array, x - 1, y + 1)
    plus1(array, x, y - 1)
    plus1(array, x, y + 1)
    plus1(array, x + 1, y - 1)
    plus1(array, x + 1, y)
    plus1(array, x + 1, y + 1)
  }
}

var markedSquare = function(array) {
		/*
		array 是一个「包含了『只包含了 0 9 的 array』的 array」
		返回一个标记过的 array
		** 注意, 使用一个新数组来存储结果, 不要直接修改老数组

		范例如下, 这是 array
		[
		    [0, 9, 0, 0],
		    [0, 0, 9, 0],
		    [9, 0, 9, 0],
		    [0, 9, 0, 0],
		]

		这是标记后的结果
		[
		    [1, 9, 2, 1],
		    [2, 4, 9, 2],
		    [9, 4, 9, 2],
		    [2, 9, 2, 1],
		]

		规则是, 0 会被设置为四周 8 个元素中 9 的数量
		*/
	  var square = clonedSquare(array)
	  for (var i = 0; i < square.length; i++) {
	    var line = square[i]
	    for (var j = 0; j < line.length; j++) {
	      markAround(square, i, j)
	    }
	  }
	  return square
}

var testWin = function() {
	var mines = e('#id-span-mines')
	var squares = es('.square')
	var squareMine = es('.mine').length
	var minesNums = Number(mines.innerHTML)
	if(minesNums + squareMine == squareLeft) {
		alert('Great, you win!')
		clickedAll()
		stopTimer()
	}
}

var testLose = function() {
	if(squareLeft == 143) {
		refresh()
		clicked(event)
	} else {
		clickedAll()
		alert('Sorry, you lose, Do it again!')
		stopTimer()
	}
}

var area = function(x, y, num) {
    var totalMap = randomSquare09(x, y, num)
    return markedSquare(totalMap)
}

var _main = function(){
	document.oncontextmenu = function(){
		return false;
	}
	squareLeft = 144
	num = 15
	bindAll('button', 'click', refresh)
	bindAll('.square', 'mousedown', clicked)
	refresh()
}

_main()
