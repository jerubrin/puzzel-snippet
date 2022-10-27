{

    let timeToMove = 1000
    let arr = []
    let cleanMode = true
    let size = 0
    let withoutZeroMode = false
    let isSlovable = false
    let isStarted = false
    let controls;
    let gridButtons;
    let isOtherWay = false;
    let arr4check = []
    let visalIsSetted = false;
    let zeroIndex = -1

    //solution
    const TOP = 'top'
    const BOTTOM = 'bottom'
    const LEFT = 'left'
    const RIGHT = 'right'
    
    const GAP_TOP = 1
    const GAP_BOTTOM = 2
    const GAP_LEFT = 3
    const GAP_RIGHT = 4
    
    let flatArr = []
    let hasSteps = true
    let countsIsFinish = false
    let actions = []
    let actionsLocal = []
    let arrSlover = []
    let finalArr = []
    let _cursor = 0
    
    // Create new element with one string
    // tag_name.class-name.another-class-name.how-many-that-you-need-classes=content
    // For example:
    // div.main-block.red-color.display-none=this is content inside block
    function createNewElement(data){
        let vals = data.split("=")
        let htmlData = vals[0].split('.')
        let _contentData = vals.length > 1 ? vals.filter((_, i) => i != 0).join('=') : ''
        htmlData[0] = htmlData[0].split('').filter(ch => ch != ' ').join('')
        let _name = htmlData[0] == '' ? 'div' : htmlData[0];
        let _classList = htmlData.filter((_, i) => i != 0)
        let element = document.createElement(_name);
        _classList = _classList.map(it => 
            it.split('').filter(ch => ch != ' ').join('')
        )
        _classList.forEach(cls => {element.classList.add(cls)});
        element.innerHTML = _contentData
        return element
    }
    //The same, but you can use several args for creating element's array
    function createNewElements() {
        if(arguments.length == 0) return createNewElement('')
        let args = arguments.length == 1 ? arguments[0] : [...arguments]
        let resArr = [];
        args.forEach(data => {
            resArr.push(
                createNewElement(data)
            )
        })
        return resArr.length == 1 ? resArr[0] : resArr
    }
    
    // FOUNDER
    
    function findElenetsList(parent) {
        let resElement = null
        let find = null
        if(parent.children.length < 8) {
            [...parent.children].forEach(element => {
                find = findElenetsList(element)
                resElement = find ? find : resElement
            });
        } else {
            if(isNaN(parent.firstChild.textContent) || isNaN(parent.lastChild.textContent)) {
                [...parent.children].forEach(element => {
                    find = findElenetsList(element)
                    resElement = find ? find : resElement
                });
            } else {
                resElement = parent
            }
        }
        if(parent == document.body && resElement == null) {
            isOtherWay = true
            resElement = tryToFindAnOtherWay(document.body)
        } else {
            isOtherWay = false
        }
        let flatArr = parent == document.body ?
            !isOtherWay ?
                [...resElement.children].map(it => Number(it.textContent)) :
                [...resElement].map(it => Number(it.textContent)) 
            : []
        if(parent == document.body 
            && flatArr.reduce((w, c, i) => w && (c == (i + 1) || c == 0), true)
        ) {
            if(flatArr.length**(1/2) != Math.trunc(flatArr.length**(1/2))) {
                withoutZeroMode = true
                flatArr.push(0)
                size = Math.trunc(flatArr.length**(1/2))
                sizeIsSetted()
                if(zeroIndex == -1) {
                    showDialogMessage('ВЫБЕРИТЕ ПОЗИЦИЮ ПУСТОГО ЭЛЛЕМЕНТА', setZeroInArr)
                } else {
                    setZeroInArr(zeroIndex)
                }
            } else {
                size = Math.trunc(flatArr.length**(1/2))
                sizeIsSetted()
                zeroIndex = 0
            }
            let newResElement = []
            
            console.log(resElement.children)
            let flatArrNodes = !isOtherWay ? [...resElement.children] : [...resElement]
            let objArr = flatArrNodes.map(it => {return {
                x: it.getBoundingClientRect().x,
                y: it.getBoundingClientRect().y,
                num: Number(it.textContent.split('').filter(it => it != ' ' && it != '\n').join('')),
                element: it
            }}).sort((a, b) => a.y - b.y)
            let newResArray = new Array(size)
            for(let i = 0; i < size; i++) {
                newResArray[i] = objArr.slice(i*size, i*size+size)
                    .sort((a, b) => a.x - b.x)
                    .map(it => it.element)
            }
            console.log(newResArray)
            isOtherWay = true
            console.log(newResArray.flat())
            return newResArray.flat()
        }
        return resElement
    }
    
    function tryToFindAnOtherWay(parent) {
        let resElement = null
        let find = null
        if(parent.children.length > 0) {
            let str = parent.textContent
            let numStr = str.split('').filter(it => it != ' ' && it != '\n').join('')
            if(!isNaN(numStr) && Number(numStr) > 123456 ) {
                resElement = convertToNormalList(parent)
            } else {
                [...parent.children].forEach(it => {
                    find = tryToFindAnOtherWay(it)
                    resElement = find ? find : resElement
                })
            }
        }
        return resElement
    }
    
    function findTileBlock(field, num) {
        let resElement = null
        let find = null
        let str = field.textContent
        if(str == num) {
            resElement = field
        } else if(field.children.length > 0) {
            [...field.children].forEach(it => {
                find = findTileBlock(it, num)
                resElement = find ? find : resElement
            })
        }
        return resElement
    }
    
    function convertToNormalList(field){
        let i = 1
        while(true) {
            if(findTileBlock(field, i)) {
                i++
            } else {
                break
            }
        }
        i--
        if(i**(1/2) != Math.trunc(i**(1/2))) {
            i++
        }
        size = Math.trunc(i**(1/2))
        //Find by class
        let className = findTileBlock(field, 1).classList[0]
        return document.querySelectorAll('.'+className)
    }
    
    function setAllToMoves() {
        let field = findElenetsList(document.body)
        if(!isOtherWay 
            && field.firstChild.children.length == 0 
            && field.lastChild.children.length == 0) {
            cleanMode = true
        } else {
            cleanMode = false
        }
        let flatArr = !isOtherWay ?
                [...field.children].map(it => Number(it.textContent)) :
                [...field].map(it => Number(it.textContent))
        if(flatArr.length**(1/2) != Math.trunc(flatArr.length**(1/2))) {
            withoutZeroMode = true
            flatArr.push(0)
            size = Math.trunc(flatArr.length**(1/2))
            sizeIsSetted()
            if(zeroIndex == -1) {
                showDialogMessage('ВЫБЕРИТЕ ПОЗИЦИЮ ПУСТОГО ЭЛЛЕМЕНТА', setZeroInArr)
            } else {
                if(zeroIndex != -2) setZeroInArr(zeroIndex)
            }
        } else {
            size = Math.trunc(flatArr.length**(1/2))
            sizeIsSetted()
        }
        arr = getArrFromScreen(field)
        let [_I, _J] = getElementHere(0)
        if(_I == -1 || _J == -1) {
            let [zI, zJ] = getElementHere(size**2)
            arr[zI][zJ] = 0
        }
        showControls()
    }
    
    function getArrFromScreen(field) {
        let flatArr = !isOtherWay ?
            [...field.children].map(it => Number(it.textContent)) :
            [...field].map(it => Number(it.textContent))
        if(flatArr.length**(1/2) != Math.trunc(flatArr.length**(1/2))) {
            withoutZeroMode = true
            flatArr.push(0)
            size = Math.trunc(flatArr.length**(1/2))
            sizeIsSetted()
            if(zeroIndex == -1) {
                showDialogMessage('ВЫБЕРИТЕ ПОЗИЦИЮ ПУСТОГО ЭЛЛЕМЕНТА', setZeroInArr)
            } else {
                if(zeroIndex != -2) setZeroInArr(zeroIndex)
            }
        } else {
            size = Math.trunc(flatArr.length**(1/2))
            sizeIsSetted()
            zeroIndex = 0
        }
        let arr =  new Array(size)
        let k = 0
        for(let i = 0; i < size; i++){
            arr[i] = []
            for(let j = 0; j < size; j++) {
                arr[i].push(flatArr[k])
                k++
            }
        }
        return arr
    }
    
    function leftClick() {
        let field = findElenetsList(document.body)
        let flatArr = !isOtherWay ?
            [...field.children].map(it => Number(it.textContent)) :
            [...field].map(it => Number(it.textContent))
        if(flatArr.length % 2 == 1) flatArr.push(0)
        let [_I, _J] = getElementHere(0)
        let num = (_J + 1) < size ? arr[_I][_J + 1] : -1
        if(num == -1) return
        let index = flatArr.lastIndexOf(num)
        if(isOtherWay) {
            field[index].click()
        } else if(cleanMode) {
            field.children[index].click()
        } else {
            field.children[index].firstChild.click()
        }
        arr[_I][_J] = num
        arr[_I][_J + 1] = 0
    }
    
    function rightClick() {
        let field = findElenetsList(document.body)
        let flatArr = !isOtherWay ?
            [...field.children].map(it => Number(it.textContent)) :
            [...field].map(it => Number(it.textContent))
        let [_I, _J] = getElementHere(0)
        let num = (_J - 1) >= 0 ? arr[_I][_J - 1] : -1
        if(num == -1) return
        let index = flatArr.lastIndexOf(num)
        if(isOtherWay) {
            field[index].click()
        } else if(cleanMode) {
            field.children[index].click()
        } else {
            field.children[index].firstChild.click()
        }
        arr[_I][_J] = num
        arr[_I][_J - 1] = 0
    }
    
    function upClick() {
        let field = findElenetsList(document.body)
        let flatArr = !isOtherWay ?
            [...field.children].map(it => Number(it.textContent)) :
            [...field].map(it => Number(it.textContent))
        let [_I, _J] = getElementHere(0)
        let num = (_I + 1) < size ? arr[_I + 1][_J] : -1
        if(num == -1) return
        let index = flatArr.lastIndexOf(num)
        if(isOtherWay) {
            field[index].click()
        } else if(cleanMode) {
            field.children[index].click()
        } else {
            field.children[index].firstChild.click()
        }
        arr[_I][_J] = num
        arr[_I + 1][_J] = 0
    }
    
    function downClick() {
        let field = findElenetsList(document.body)
        let flatArr = !isOtherWay ?
            [...field.children].map(it => Number(it.textContent)) :
            [...field].map(it => Number(it.textContent))
        let [_I, _J] = getElementHere(0)
        let num = (_I - 1) >= 0 ? arr[_I - 1][_J] : -1
        if(num == -1) return
        let index = flatArr.lastIndexOf(num)
        if(isOtherWay) {
            field[index].click()
        } else if(cleanMode) {
            field.children[index].click()
        } else {
            field.children[index].firstChild.click()
        }
        arr[_I][_J] = num
        arr[_I - 1][_J] = 0
    }
    
    function getElementHere(num) {
        for(let i = 0; i < arr.length; i++) {
            for(let j = 0; j < arr[i].length; j++) {
                if(arr[i][j] == num) return [i, j]
            }
        }
        return [-1, -1]
    }
    
    function showDialogMessage(message, fun, hideBack = false) {
        zeroIndex = -2
        let root = document.body
        const modalWin = createNewElement(`.win-modal.hiding`)
        if(hideBack) modalWin.classList.add('win-modal_clear')
        const winMessage = createNewElement(`.win-message=${message}`)
    
        const gridButtons = createNewElement('.grid-btns')
        for(let i = 0; i < size * size; i++) {
            const gridElem = createNewElement('button.grid-elem');
            gridElem.onclick = () => {fun(i); hide()}
            gridButtons.appendChild(gridElem)
        }
        
        winMessage.appendChild(gridButtons)
    
        modalWin.appendChild(winMessage)
        root.appendChild(modalWin)
        setTimeout(() => {modalWin.classList.remove('hiding')}, 10)
    
        function hide(fun) {
            modalWin.classList.add('hiding')
            setTimeout(() => {
                root.removeChild(modalWin)
                if(fun) fun()
            }, 600)
        }
    }
    
    setAllToMoves()
    
    function setZeroInArr(index) {
        zeroIndex = index
        let flatArr = arr.flat()
        for(let i = flatArr.length - 1; i > index; i--) {
            flatArr[i] = flatArr[i - 1]
            flatArr[i - 1] = 0
        }
        size = Math.trunc(flatArr.length**(1/2))
        arr =  new Array(size)
        let k = 0
        for(let i = 0; i < size; i++){
            arr[i] = []
            for(let j = 0; j < size; j++) {
                arr[i].push(flatArr[k])
                k++
            }
        }
    }
    
    
    //STYLE
    let style = document.createElement('style')
    style.innerHTML = `
    .win-modal {
        top: 0;
        left: 0;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-top: auto;
        background: rgba(9, 70, 83, 0.7);
        transition: all .5s;
        z-index: 999999;
    }
    @media screen and (min-width: 800px) {
        .win-modal {
            font-size: 1.8rem;
        }
    }
    .win-modal_clear {
        background: rgba(9, 70, 83, 0.01);
    }
    .win-message {
        padding: 20px;
        min-width: 200px;
        max-width: 90%;
        text-align: center;
        border-radius: 12px;
        color: #aad2ffb0;
        border: 3px solid #aad2ff63;
        background-color: #59afb566;
    }
    .win-button {
        width: 100px;
        margin: 16px 6px 0;
    }
    .hiding{
        opacity: 0;
    }
    .control {
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #b9ededed;
        z-index: 999998;
    }
    .control__button {
        color: #084142;
        text-transform: uppercase;
        background: #65dcdeeb;
        border: 2px solid #74b5b5ba;
        border-radius: 5px;
        font-size: 16px;
        padding: 6px 10px;
        min-width: 120px;
        margin: 0 4px;
    }
    .control__button:hover {
        background: #18d6dd;
        border: 2px solid #84eded;
    }
    .control__text-message {
        text-align: center;
        text-transform: uppercase;
        margin: 4px;
        padding: 4px;
        font-size: 24px;
        font-weight: 900;
        border: 2px solid #56dcde87;
        border-radius: 5px;
        background: #6ddae2;
        color: #395d5f;
    }
    .control__time {
        display: flex;
        margin: 10px;
        align-items: center;
    }
    .control__time-text {
        margin: 0 10px;
        color: #395d5f;
    }
    .control__time-input {
        background: #d2dfdfde;
        border: 2px solid #74b5b5ba;
        border-radius: 5px;
        font-weight: 900;
        color: #395d5f;
        padding: 6px 12px;
    }
    .control__position {
        width: 100%;
        text-align: center;
        color: #23b1c0;
        cursor: pointer;
        max-height: 20px;
    }
    .control__position:hover {
        color: #ffffff;
        background: #23b1c0;
    }
    .controls__to-up {
        display: none
    }
    `
    function sizeIsSetted() {
        let style2 = document.createElement('style')
        style2.innerHTML = `
        .grid-btns {
            display: grid;
            margin: 10px auto;
            grid-template-columns: repeat(${size}, 1fr);
            aspect-ratio: 1/1;
            max-width: 200px;
            gap: 3px;
        }
        .grid-elem {
            background: #97d0d182;
            border: #5cb3ad75 solid 2px;
            border-radius: 5px;
        }
        .grid-elem:hover {
            background: #d6eeee;
            border: #9ac1be solid 2px;
        }
        `
        document.getElementsByTagName('head')[0].appendChild(style2);
    }
    document.getElementsByTagName('head')[0].appendChild(style);
    
    function showControls() {
        if(visalIsSetted) return
        controls = createNewElement('.control')
        const root = document.body
        const clickUp = createNewElement('.control__position=▽ ▽ ▽') //△ △ △
        clickUp.onclick = moveControls
        const controlsBtns = createNewElement('.control__buttons')
        const textMessage = createNewElement('.control__text-message')
        const buttonCheck = createNewElement('button.control__button=Check it!') // isSlovable
        buttonCheck.onclick = () => checkIt(textMessage, controls)
        const buttonStart = createNewElement('button.control__button=Slove it!')
        buttonStart.onclick = () => {sloveIt()}
    
        const timeBlock = createNewElement('.control__time')
        const textTime = createNewElement('p.control__time-text=Скорость клика (мс):')
        const inputTime = createNewElement(`input.control__time-input`)
        inputTime.value = timeToMove
        timeBlock.append(textTime, inputTime)
    
        controlsBtns.append(buttonCheck, buttonStart)
        controls.append(clickUp, textMessage, controlsBtns, timeBlock)
        root.appendChild(controls)
        visalIsSetted = true
    }
    
    function checkIt(textMessage, controls) {
        arr = []
        cleanMode = true
        size = 0
        withoutZeroMode = false
        isSlovable = false
        isStarted = false
        isOtherWay = false;
        _cursor = 0
        arr4check = []
        zeroIndex = -1
        setAllToMoves()

        let inter = setInterval(() => {
            if(zeroIndex >= 0) {
                textMessage.textContent = checkGameArray() ? 'решаемый' : 'не решаемый'
                let flatArr = arr.flat()
                gridButtons = createNewElement('.grid-btns')
                for(let i = 0; i < size * size; i++) {
                    const gridElem = createNewElement(`button.grid-elem=${flatArr[i]}`);
                    gridButtons.appendChild(gridElem)
                }
                controls.insertBefore(gridButtons,textMessage)
                setTimeout(() => {
                    controls.onclick = hideGrid
                }, 1)
                clearInterval(inter)
            }
        }, 500);
    }
    function hideGrid() {
        if(gridButtons) {
            gridButtons.innerHTML = ''
            try{controls.removeChild(gridButtons)}catch(e){}
        }
    }
    function moveControls() {
        this.textContent = this.textContent == '△ △ △' ? '▽ ▽ ▽' : '△ △ △';
        [...controls.children].forEach((el, index) => {
            if(index != 0) {
                el.classList.toggle('controls__to-up')
            }
        })
    }
    
    // CHECKER
    
    function checkGameArray() {
        console.log(strfy(arr))
        arr4check = JSON.parse(JSON.stringify(arr))
        moveItUp()
        let number = arr4check.flat().map((it, i, a) => {
            let sum = 0
            for(let j = i; j < a.length; j++) {
                if(it > a[j] && a[j] != 0) sum++
            }
            return sum
        }).reduce((w, c) => w + c, 0)
        let number2
        arr4check.forEach((a, i) => {a.forEach((el, j) => {if(el === 0) number2 = i + 1})})
        number += number2
        return number % 2 === arr4check.length % 2
    }
    function moveItUp() {
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                if(arr4check[i][j] == 0 && (i < size - 1)) {
                    arr4check[i][j] = arr4check[i+1][j]
                    arr4check[i+1][j] = 0
                }
            }
        }
    }
    
    // SLOVER
    
    function sloveIt() {
        arr = []
        cleanMode = true
        size = 0
        withoutZeroMode = false
        isSlovable = false
        isStarted = false
        isOtherWay = false;
        _cursor = 0
        arr4check = []
        zeroIndex = -1
        setAllToMoves()
        timeToMove = 1000

        let inter = setInterval(() => {
            if(zeroIndex >= 0) {
                let newTime = document.querySelector('input.control__time-input').value
                timeToMove = isNaN(newTime) ? Number(timeToMove) : Number(newTime)
                solution()
                hideGrid()
                clearInterval(inter)
            }
        }, 500);
    }
    
    //solution
    let counter = 0
    function solution() {
        countsIsFinish = false
        isStarted = true
        timeToMove += 10
        actions = []
        flatArr = []
        hasSteps = true
        countsIsFinish = false
        actions = []
        actionsLocal = []
        arrSlover = []
        finalArr = []
        _cursor = 0

        var interval = setInterval(() => {
            if(!isStarted) actions = []
            if(actions.length > 0 && isStarted && countsIsFinish) nextStep()
            if(actions.length == 0) {
                counter++
                if(counter > 2) {
                    clearInterval(interval)
                }
            } else {
                counter = 0
            }
        }, timeToMove);
        solStart()
    }
    
    function nextStep() {
        let comand = actions.shift()
        console.log(comand)
        if(comand == LEFT) leftClick()
        if(comand == RIGHT) rightClick()
        if(comand == TOP) upClick()
        if(comand == BOTTOM) downClick()
        if(actions.length <= 0) hasSteps = false;
    }
    
    function solStartMini() {
        if(_cursor == 0) {
            arrSlover = JSON.parse(JSON.stringify(arr))
            createRightPositions(size)
        }
        try{
            const obj = flatArr[_cursor]
            let [cI, cJ] = findTile(obj.tile)
            let [nI, nJ] = findTile(flatArr[_cursor+1].tile)
            let [_I, _J] = findGap()
            if(obj.$I == cI && obj.$J == cJ) {
                
            } else if(finalArr[cI][cJ] == arrSlover[cI][cJ]
                   && finalArr[nI][nJ] == arrSlover[nI][nJ]
                   && ((cI == arrSlover.length - 1) || (cJ == arrSlover.length - 1))
                    ) {
                _cursor++
            } else {
                if(obj.dir == 0) {
                    moveGapHoleHor(_J - cJ) //A 1 b
                    moveGapHoleVer(_I - cI) //A 1 a
                    moveToVer(obj) // A 2 a
                    moveToHor(obj) // A 2 b
                    moveToTop(1, obj)
                    makeSteps();
                }
                if(obj.dir == 1) {
                    moveGapHoleVer(_I - cI) //A 1 a
                    moveGapHoleHor(_J - cJ) //A 1 b
                    moveToHor(obj) // A 2 a
                    moveToVer(obj) // A 2 b
                    moveToLeft(1, obj)
                    makeSteps();
                }
                makeSteps();
            }
            if(obj.$J == arrSlover.length - 2 && 
                flatArr[_cursor + 1].tile == arrSlover[obj.$I][obj.$J+1]
            ) {
                let aJ = arrSlover.length - 2
                let aI = flatArr[_cursor + 1].$I + 1
                let [_I, _J] = findGap()
                moveGapHoleHor(_J - aJ)
                moveGapHoleVer(_I - aI)
                let newActive = [LEFT,BOTTOM,RIGHT,TOP,TOP,LEFT,BOTTOM,RIGHT,BOTTOM,LEFT,TOP]
                actions = actions.concat(newActive)
                actionsLocal = actionsLocal.concat(newActive)
                makeSteps();
            }
            if(obj.$I == arrSlover.length - 2 && 
                flatArr[_cursor + 1].tile == arrSlover[obj.$I+1][obj.$J]
            ) {
                let newActive = [TOP,RIGHT,BOTTOM,LEFT,LEFT,TOP,RIGHT,BOTTOM,RIGHT,TOP,LEFT]
                actions = actions.concat(newActive)
                actionsLocal = actionsLocal.concat(newActive)
                makeSteps();
            }
            countsIsFinish = true
        } catch(e) {
            console.error(e.message)
        }
    }
    function solStart() {
        //перебор массива правильных позиций в порядке сбора
        //qwerty
        for(_cursor = 0; _cursor < flatArr.length - 3 || _cursor == 0; _cursor++){
            solStartMini()
        }
        finalSteps()
        countsIsFinish = true
    }
    
    function finalSteps() {
        let saveCout = 0
        while(saveCout != 20) {
            let comand = ''
            if(arrSlover[size-2][size-2] == 0) comand = LEFT
            if(arrSlover[size-2][size-1] == 0) comand = TOP
            if(arrSlover[size-1][size-2] == 0) comand = BOTTOM
            if(arrSlover[size-1][size-1] == 0) comand = RIGHT
            if(comand != '') {
                actionsLocal.push(comand)
                actions.push(comand)
                makeSteps()
            }
            if( (arrSlover[size-2][size-2] == size * size - size - 1) &&
                (arrSlover[size-2][size-1] == size * size - size) &&
                (arrSlover[size-1][size-2] == size * size - 1) &&
                (arrSlover[size-1][size-1] == 0)
            ) {
                break
            }
            saveCout++
        }
    }
    function makeSteps() { //In local Array
        while(actionsLocal.length > 0) {
            let [_I, _J] = findGap()
            let comand = actionsLocal.shift()
            if(comand == TOP) {
                if(_I >= arrSlover.length - 1) throw new Error('Выход за пределы игрового поля: ' + TOP)
                arrSlover[_I][_J] = arrSlover[_I+1][_J]
                arrSlover[_I+1][_J] = 0
            }
            if(comand == BOTTOM) {
                if(_I <= 0) throw new Error(`Выход за пределы игрового поля _I=${_I} <= : ` + BOTTOM)
                arrSlover[_I][_J] = arrSlover[_I-1][_J]
                arrSlover[_I-1][_J] = 0
            }
            if(comand == LEFT) {
                if(_J > arrSlover.length) throw new Error('Выход за пределы игрового поля: ' + RIGHT)
                arrSlover[_I][_J] = arrSlover[_I][_J+1]
                arrSlover[_I][_J+1] = 0
            }
            if(comand == RIGHT) {
                if(_J <= 0) throw new Error('Выход за пределы игрового поля: ' + LEFT)
                arrSlover[_I][_J] = arrSlover[_I][_J-1]
                arrSlover[_I][_J-1] = 0
            }
        }
    }
    //SOL MOVED
    function moveGapHoleVer(steps) {
        if(steps < 0) {
            for(let i = 0; i < Math.abs(steps); i++) {
                actions.push(TOP)
                actionsLocal.push(TOP)
            }
        }
        if(steps > 0) {
            for(let i = 0; i < Math.abs(steps); i++) {
                actions.push(BOTTOM)
                actionsLocal.push(BOTTOM)
            }
        }
        makeSteps()
    }
    function moveGapHoleHor(steps) {
        if(steps < 0) {
            for(let i = 0; i < Math.abs(steps); i++) {
                actions.push(LEFT)
                actionsLocal.push(LEFT)
            }
        }
        if(steps > 0) {
            for(let i = 0; i < Math.abs(steps); i++) {
                actions.push(RIGHT)
                actionsLocal.push(RIGHT)
            }
        }
        makeSteps()
    }
    //Horizont
    function moveToVer(obj) {
        let [cI, cJ] = findTile(obj.tile)
        let [_I, _J] = findGap()
        let dir = obj.dir
        let $I = dir == 0 ? obj.$I + 1 : obj.$I
        let $J = dir == 1 ? obj.$J + 1 : obj.$J
        let steps = cI - $I
        if(steps > 0) moveToTop(steps, obj)
        if(steps < 0) moveToBottom(Math.abs(steps), obj)
    }
    function moveToTop(steps, obj) {
        while (steps > 0) {
            let [cI, cJ] = findTile(obj.tile)
            let [_I, _J] = findGap()
            const gPos = getGapPos(_I, _J, cI, cJ)
            let newAction = []
            if(gPos == GAP_LEFT && cI != arrSlover.length -1 && cJ != arrSlover.length -1 ) {
                newAction = [TOP,LEFT,LEFT,BOTTOM,BOTTOM,RIGHT,TOP]
            }
            if(gPos == GAP_LEFT && (cI == arrSlover.length - 1 || cJ == arrSlover.length - 1) ) { //!!!
                newAction = [BOTTOM,LEFT,TOP]
            }
            if(gPos == GAP_BOTTOM && cJ != arrSlover.length - 1) {
                newAction = [LEFT,BOTTOM,BOTTOM,RIGHT,TOP]
            }
            if(gPos == GAP_BOTTOM && cJ == arrSlover.length - 1) { //!!!
                newAction = [RIGHT,BOTTOM,BOTTOM,LEFT,TOP]
            }
            if(gPos == GAP_RIGHT) {
                newAction = [BOTTOM,RIGHT,TOP]
            }
            if(gPos == GAP_TOP) {
                newAction = [TOP]
            }
            actions = actions.concat(newAction)
            actionsLocal = actionsLocal.concat(newAction)
            steps -= 1
            makeSteps()
        }
    }
    function moveToBottom(steps, obj) {
        while (steps > 0) {
            let [cI, cJ] = findTile(obj.tile)
            let [_I, _J] = findGap()
            const gPos = getGapPos(_I, _J, cI, cJ)
            let newAction = []
            if(gPos == GAP_LEFT) {
                newAction = [TOP,LEFT,BOTTOM]
            }
            if(gPos == GAP_BOTTOM) {
                newAction = [BOTTOM]
            }
            if(gPos == GAP_RIGHT) {
                newAction = [TOP,RIGHT,BOTTOM]
            }
            if(gPos == GAP_TOP && cJ != arrSlover.length - 1) {
                newAction = [LEFT,TOP,TOP,RIGHT,BOTTOM]
            }
            if(gPos == GAP_TOP && cJ == arrSlover.length - 1) { // !!!
                newAction = [RIGHT,TOP,TOP,LEFT,BOTTOM]
            }
            actions = actions.concat(newAction)
            actionsLocal = actionsLocal.concat(newAction)
            steps -= 1
            makeSteps()
        }
    }
    //Vertical
    function moveToHor(obj) {
        let [cI, cJ] = findTile(obj.tile)
        let [_I, _J] = findGap()
        let dir = obj.dir
        let $I = dir == 0 ? obj.$I + 1 : obj.$I
        let $J = dir == 1 ? obj.$J + 1 : obj.$J
        let steps = cJ - $J
        if(steps > 0) moveToLeft(steps, obj)
        if(steps < 0) moveToRight(Math.abs(steps), obj)
    }
    function moveToLeft(steps, obj) {
        while (steps > 0) {
            let [cI, cJ] = findTile(obj.tile)
            let [_I, _J] = findGap()
            const gPos = getGapPos(_I, _J, cI, cJ)
            let newAction = []
            if(gPos == GAP_TOP && cI != arrSlover.length - 1 &&  cJ != arrSlover.length - 1) {
                newAction = [LEFT,TOP,TOP,RIGHT,RIGHT,BOTTOM,LEFT]
            }
            if(gPos == GAP_TOP && cI == arrSlover.length - 1) { //!!!
                newAction = [RIGHT,TOP,LEFT]
            }
            if(gPos == GAP_TOP && cJ == arrSlover.length - 1) { //!!!
                newAction = [RIGHT,TOP,LEFT]
            }
            if(gPos == GAP_RIGHT && cI != arrSlover.length - 1) {
                newAction = [TOP,RIGHT,RIGHT,BOTTOM,LEFT]
            }
            if(gPos == GAP_RIGHT && cI == arrSlover.length - 1) { //!!!
                newAction = [BOTTOM,RIGHT,RIGHT,TOP,LEFT]
            }
            if(gPos == GAP_BOTTOM) {
                newAction = [RIGHT,BOTTOM,LEFT]
            }
            if(gPos == GAP_LEFT) {
                newAction = [LEFT]
            }
            actions = actions.concat(newAction)
            actionsLocal = actionsLocal.concat(newAction)
            steps -= 1
            makeSteps()
        }
    }
    function moveToRight(steps, obj) {
        while (steps > 0) {
            let [cI, cJ] = findTile(obj.tile)
            let [_I, _J] = findGap()
            const gPos = getGapPos(_I, _J, cI, cJ)
            let newAction = []
            if(gPos == GAP_LEFT && cI != arrSlover.length - 1) {
                newAction = [TOP,LEFT,LEFT,BOTTOM,RIGHT]
            }
            if(gPos == GAP_LEFT && cI == arrSlover.length - 1) { //!!!
                newAction = [BOTTOM,LEFT,LEFT,TOP,RIGHT]
            }
            if(gPos == GAP_BOTTOM ) {
                newAction = [LEFT,BOTTOM,RIGHT]
            }
            if(gPos == GAP_TOP) {
                newAction = [LEFT,TOP,RIGHT]
            }
            if(gPos == GAP_RIGHT) {
                newAction = [RIGHT]
            }
            
            actions = actions.concat(newAction)
            actionsLocal = actionsLocal.concat(newAction)
            steps -= 1
            makeSteps()
        }
    }
    
    //solution additional
    function getGapPos(_I, _J, cI, cJ) {
        if(_I == cI && ((_J - cJ) == 1)) return GAP_RIGHT
        if(_I == cI && ((_J - cJ) == -1)) return GAP_LEFT
        if(((_I - cI) == 1) && _J == cJ) return GAP_BOTTOM
        if(((_I - cI) == -1) && _J == cJ) return GAP_TOP
        throw new Error(`WRONG GAP POSITION: gapPos=[${_I}][${_J}] tilePos=[${cI}][${cJ}]`)
    }
    function createRightPositions(size) {
        let arr = []
        flatArr = []
        for(let i = 0; i < size; i++) {
            arr.push([])
            for(let j = 0; j < size; j++) {
                let num = i*size + j + 1
                arr[i].push(num < size*size ? num : 0)
            }
        }
        finalArr = arr
        for(let i = 0; i < size - 1; i++) {
            for(let j = i; j < size - 1; j++) {
                const obj = {
                    tile: arr[i][j],
                    $I: i,
                    $J: j,
                    dir: 0
                }
                if(obj.$J == size - 2) {
                    const obj2 = {
                        tile: arr[i][j+1],
                        $I: i,
                        $J: j,
                        dir: 0
                    }
                    flatArr.push(obj2)
                }
                flatArr.push(obj)
            }
            for(let j = i+1; j < size - 1; j++) {
                const obj = {
                    tile: arr[j][i],
                    $I: j,
                    $J: i,
                    dir: 1
                }
                if(obj.$I == size - 2) {
                    const obj2 = {
                        tile: arr[j+1][i],
                        $I: j,
                        $J: i,
                        dir: 1
                    }
                    flatArr.push(obj2)
                }
                flatArr.push(obj)
            }
        }
        const obj = {
            tile: arr[size-1][size-2],
            $i: size-1,
            $j: size-2,
            dir: 1
        }
        flatArr.push(obj)
    }
    function findTile(num) {
        for(let i = 0; i < arrSlover.length; i++) {
            for(let j = 0; j < arrSlover[i].length; j++) {
                if(arrSlover[i][j] == num) return [i, j]
            }
        }
        return [-1, -1]
    }
    function findGap() {
        return findTile(0)
    }
    
    function strfy(arrSlover) {
        let str = ''
        for(let i = 0; i < arrSlover.length; i++) {
            str += JSON.stringify(arrSlover[i]) + '\n'
        }
        return str
    }
    
}