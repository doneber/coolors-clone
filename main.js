const formGenerator = document.querySelector('#form-generator')
const defaultNumColors = 5
let colorPalette = []

init()

function init() {
    update()
}

formGenerator.addEventListener('submit', event => {
    event.preventDefault()
    update()
})

function createRandomColor() {
    const h = parseInt(Math.random() * 360)
    const s = parseInt(Math.random() * 100)
    const l = parseInt(Math.random() * 95) + 5
    return { h, s, l }
}

function update() {
    colorPalette = createColorPalette(colorPalette.length)
    renderColors()
}
// https://www.30secondsofcode.org/js/s/hsl-to-rgb
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
        hex = color.toString(16).toUpperCase()
        return hex.length == 1 ? "0" + hex : hex
    }
    return componentToHex(rgbArr[0]) + componentToHex(rgbArr[1]) + componentToHex(rgbArr[2]);
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
    for (let i = 0; i < n; i++) {
        palette.push(createRandomColor())
    }
    return palette
}

function createColorNode(colorHSL) {
    const colorTemplateNode = document.querySelector('#color-template')
    const colorNode = colorTemplateNode.content.firstElementChild.cloneNode(true)
    const { h, s, l } = colorHSL
    colorNode.style.backgroundColor = `hsl(${h}deg ${s}% ${l}%)`

    const rgbCodeNode = colorNode.querySelector('.color-rgb-code')
    const hexCodeNode = colorNode.querySelector('.color-hex-code')
    const rgbColor = hslToRgb(h, s, l)
    const hexColor = rgbToHex(rgbColor)
    hexCodeNode.textContent = hexColor
    rgbCodeNode.textContent = rgbColor

    const padlockBtnNode = colorNode.querySelector('.padlock')
    const colorCodesNode = colorNode.querySelector('.color-codes')
    const colorContrast = contrast(rgbColor, [0, 0, 0]) > contrast(rgbColor, [255, 255, 255]) ? 'black' : 'white'
    if (colorContrast == 'white')
        padlockBtnNode.classList.add('invert')
    colorCodesNode.style.color = colorContrast
    return colorNode
}

function renderColors() {
    const colorsContainer = document.querySelector('.color-list')
    const colorNodes = colorPalette.map(color => createColorNode(color))
    colorsContainer.replaceChildren(...colorNodes)
}