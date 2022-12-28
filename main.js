const formGenerator = document.querySelector('#form-generator')

init()

function init(){
    const colorGen = createRandomColor()
    update(colorGen)
}

formGenerator.addEventListener('submit', event => {
    event.preventDefault()
    console.log('gi');
    const colorGen = createRandomColor()
    update(colorGen)
})

function createRandomColor() {
    const h = parseInt(Math.random() * 360)
    const s = parseInt(Math.random() * 100)
    const l = parseInt(Math.random() * 95) + 5
    return { h, s, l }
}

function update(colorHSL) {
    const colorNode = document.querySelector('.color')
    const { h, s, l } = colorHSL
    colorNode.style.backgroundColor = `hsl(${h}deg ${s}% ${l}%)`
    const rgbCodeNode = colorNode.querySelector('.color-rgb-code')
    const hexCodeNode = colorNode.querySelector('.color-hex-code')
    const rgbColor = hslToRgb(h, s, l)
    const hexColor = rgbToHex(rgbColor)
    hexCodeNode.textContent = hexColor
    rgbCodeNode.textContent = rgbColor
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
