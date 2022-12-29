const formGenerator = document.querySelector('#form-generator')
const defaultNumColors = 5
let colorPalette = []

init()

function init() {
    const url = new URL(location.href)
    if (url.searchParams.get('colors')) {
        const colorsAux = url.searchParams.get('colors').split('-')
        colorPalette = colorsAux.map(color => ({ color, locked: false }))
    }
    else
        createColorPalette(colorPalette.length)
    update()
}

formGenerator.addEventListener('submit', event => {
    event.preventDefault()
    createColorPalette(colorPalette.length)
    update()
})
const shareBtn = document.querySelector('#share')
shareBtn.addEventListener('click', () => {
    const url = new URL(location.href)
    navigator.clipboard.writeText(url.href)
    document.querySelector('#copy').innerHTML = `
    <div class="copy-container">
        <p>Enlace copiado exitosamente!</p>
    </div>`
})
function createRandomColor(sAux, lAux) {
    if (!sAux) sAux = parseInt(Math.random() * 45) + 5
    if (!lAux) lAux = parseInt(Math.random() * 45) + 5
    const h = parseInt(Math.random() * 360)
    const s = parseInt(Math.random() * 50) + sAux
    const l = parseInt(Math.random() * 50) + lAux
    return { h, s, l }
}

function update() {
    renderColors()
    addListenerToPlusBtns()
    updateUrl()
}

function updateUrl() {
    const url = new URL(location.href);
    const palette = colorPalette.map(({ color }) => color).join('-')

    url.searchParams.set('colors', palette);
    history.pushState(null, '', url);
}

function hslToRgb(h, s, l) {
    s /= 100
    l /= 100
    const k = n => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))]
}

function rgbToHex(rgbArr) {
    const componentToHex = color => {
        hex = color.toString(16)
        return hex.length == 1 ? "0" + hex : hex
    }
    return componentToHex(rgbArr[0]) + componentToHex(rgbArr[1]) + componentToHex(rgbArr[2]);
}
function hexToRgb(hexColor) {
    const aRgbHex = hexColor.match(/.{1,2}/g);
    return [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ]
}

function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ?
            v / 12.92 :
            Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
    var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) /
        (darkest + 0.05);
}

function createColorPalette(num) {
    const n = num == 0 ? defaultNumColors : num
    const palette = []
    const sValue = parseInt(Math.random() * 45) + 5
    const lValue = parseInt(Math.random() * 45) + 5
    for (let i = 0; i < n; i++) {
        if (colorPalette[i]?.locked)
            palette.push(colorPalette[i])
        else {
            const hslColorArr = createRandomColor(sValue, lValue)
            const { h, s, l } = hslColorArr
            palette.push({ locked: false, color: rgbToHex(hslToRgb(h, s, l)) })
        }
    }
    if (!colorPalette.some(color => color.locked))
        palette.sort((a, b) => a.color.h - b.color.h)
    colorPalette = palette
}

function createColorNode(colorObj) {
    const colorTemplateNode = document.querySelector('#color-template')
    const colorNode = colorTemplateNode.content.firstElementChild.cloneNode(true)
    colorNode.style.backgroundColor = '#' + colorObj.color

    const rgbCodeNode = colorNode.querySelector('.color-rgb-code')
    const hexCodeNode = colorNode.querySelector('.color-hex-code')
    const rgbColor = hexToRgb(colorObj.color)
    const hexColor = colorObj.color
    hexCodeNode.textContent = hexColor.toUpperCase()
    rgbCodeNode.textContent = rgbColor

    const padlockBtnNode = colorNode.querySelector('.padlock')
    const deleteBtnNode = colorNode.querySelector('.delete-color')
    const colorCodesNode = colorNode.querySelector('.color-codes')
    const isBlack = contrast(rgbColor, [0, 0, 0]) > contrast(rgbColor, [255, 255, 255])
    if (!isBlack) {
        padlockBtnNode.classList.add('invert')
        deleteBtnNode.classList.add('invert')
    }
    colorCodesNode.style.color = isBlack ? 'black' : 'white'
    if (colorObj.locked) padlockBtnNode.classList.add('locked')

    padlockBtnNode.addEventListener('click', () => {
        colorObj.locked = !colorObj.locked
        padlockBtnNode.classList.toggle('locked')
    })
    deleteBtnNode.addEventListener('click', () => {
        const indexColor = colorPalette.indexOf(colorObj)
        colorPalette.splice(indexColor, 1)
        update()
    })
    colorCodesNode.addEventListener('click', event => {
        const element = event.target
        if (element != hexCodeNode && element != rgbCodeNode)
            return
        navigator.clipboard.writeText(element.textContent)
        document.querySelector('#copy').innerHTML = `
        <div class="copy-container">
            <p>Color copiado exitosamente!</p>
        </div>`
    })
    return colorNode
}

function renderColors() {
    const colorsContainer = document.querySelector('.color-list')
    const colorNodes = colorPalette.map(color => createColorNode(color))
    colorsContainer.replaceChildren(...colorNodes)
    // Add an extra plusBtn
    const plusBtn = document.createElement('div')
    plusBtn.innerHTML =
        `<div class="add-color-container">
            <button class="add-color"></button>
        </div>`
    colorsContainer.appendChild(plusBtn)
}

function addListenerToPlusBtns() {
    const colorsContainer = document.querySelector('.color-list')
    const addColorButtons = [...colorsContainer.querySelectorAll('.add-color')]
    colorsContainer.addEventListener('click', event => {
        const indexAddBtn = addColorButtons.indexOf(event.target)
        if (indexAddBtn > - 1) {
            const newColor = { color: createRandomColor(), locked: false }
            colorPalette.splice(indexAddBtn, 0, newColor)
            update()
        }
    })
}
