const formGenerator = document.querySelector('#form-generator')

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
}
