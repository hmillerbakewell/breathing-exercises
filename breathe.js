function clearGuideDiv() {
    guideVisualsDiv.innerHTML = ""
}

function guideVisualsDiv() {
    return document.getElementById("visuals")
}

function reflect(ax, ay, bx, by, cx, cy) {
    // Reflect point a through the line made by b-c
    const delta = { x: bx - cx, y: by - cy }
    const normal = { x: -delta.y, y: delta.x }
    if (delta.x == 0) {
        return { y: ay, x: ax - 2 * (ax - bx) }
    }
    if (delta.y == 0) {
        return {
            x: ax, y: ay - 2(ay - by)
        }
    }


    const lambda = (bx - ax + (ay - by) * delta.x / delta.y) / (normal.x - delta.x * normal.y / delta.y)


    return {
        delta: delta,
        normal: normal,
        lambda: lambda,
        x: ax + 2 * lambda * normal.x, y: ay + 2 * lambda * normal.y
    }

    /* working
    a + l n = b + m d

    ax + l nx = bx + m dx
    ay + l ny = by + m dy

    m = (ay + l ny - by) / dy

    ax + l nx = bx + (ay + l ny - by) dx /dy
    l nx - l ny dx /dy = bx - ax + (ay -by) dx/dy
    l = (bx - ax + (ay - by) dx / dy) / (nx - dx ny / dy)
    */

}

function twoLineIntersection(base1, direction1, base2, direction2) {
    // Doesn't check for parallel lines
    // Assumes directions are non-zero


    if (direction2.y == 0) {
        // base1.y + lambda * direction1.y = base2.y
        var lambda = (base2.y - base1.y) / direction1.y
        return { x: base1.x + lambda * direction1.x, y: base1.y + lambda * direction1.y }
    }

    if (direction1.y == 0) {
        // base1.y = base2.y + mu * direction2.y
        var mu = (base1.y - base2.y) / direction2.y
        return { x: base2.x + mu * direction2.x, y: base2.y + mu * direction2.y }
    }


    // base1 + lambda * direction1 = base2 + mu * direction2

    var lambda = (base2.x - base1.x + (base1.y - base2.y) * direction2.x / direction2.y) / (direction1.x - direction2.x * direction1.y / direction2.y)
    // base1 + lambda direction1 = base2 + mu direction2
    return { x: base1.x + lambda * direction1.x, y: base1.y + lambda * direction1.y }

}

function bezierArcOld(a1, a2, assumeSmall) {
    // Modified from https://stackoverflow.com/questions/734076/how-to-best-approximate-a-geometrical-arc-with-a-bezier-curve
    const x1 = Math.cos(a1)
    const y1 = Math.sin(a1)
    const x4 = Math.cos(a2)
    const y4 = Math.sin(a2)
    const q1 = x1 * x1 + y1 * y1
    const q2 = q1 + x1 * x4 + y1 * y4
    const k2 = (4 / 3) * (Math.sqrt(2 * q1 * q2) - q2) / (x1 * y4 - y1 * x4)

    var x2 = x1 - k2 * y1
    var y2 = y1 + k2 * x1
    var x3 = x4 + k2 * y4
    var y3 = y4 - k2 * x4

    if (!assumeSmall) {
        r2 = reflect(x2, y2, x1, y1, 0, 0)
        x2 = r2.x
        y2 = r2.y
        r3 = reflect(x3, y3, x4, y4, 0, 0)
        x3 = r3.x
        y3 = r3.y
    }

    return { x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3, x4: x4, y4: y4 }
}

function xy(x, y) {
    return { x: x, y: y }
}

function bezierArc(a1, a2) {
    const p1 = xy(Math.cos(a1), Math.sin(a1))
    const p2 = xy(Math.cos(a2), Math.sin(a2))

    const beta = (a1 + a2) / 2

    const p3 = xy(Math.cos(beta), Math.sin(beta))
    const n1 = xy(-p1.y, p1.x)
    const n2 = xy(-p2.y, p2.x)
    const n3 = xy(-p3.y, p3.x)

    const p4 = twoLineIntersection(p1, n1, p3, n3)
    const p5 = twoLineIntersection(p2, n2, p3, n3)

    const upscale = 4 / 3

    const p6 = xy(p1.x + upscale * (p4.x - p1.x), p1.y + upscale * (p4.y - p1.y))
    const p7 = xy(p2.x + upscale * (p5.x - p2.x), p2.y + upscale * (p5.y - p2.y))

    return { p1: p1, p2: p2, p3: p3, p4: p4, p5: p5, p6: p6, p7: p7, x1: p1.x, y1: p1.y, x2: p6.x, y2: p6.y, x3: p7.x, y3: p7.y, x4: p2.x, y4: p2.y }

}

var svg

function mark(coord) {
    var size = 5
    var shift = xy(200, 200)
    svg.rect().attr({ width: size, height: size, fill: "red" }).transform({ translate: [coord.x + shift.x, coord.y + shift.y] })
}
function radialMark(coord) {
    mark(xy(coord.x * 100, coord.y * 100))
}
let readGET = function () {
    let break_at_question_mark = window.location.toString().split(/\?/);
    let base = { in: 4, out: 6 }
    if (break_at_question_mark.length == 1) {
        return base;
    }
    let instructions = break_at_question_mark[1];

    instructions.split("&").map(s => {
        let parts = s.split("=")
        base[parts[0]] = parts[1]
    });
    return base
}

let countdown = null

function setTimer(timeInMinutes) {
    clearTimeout(countdown)
    countdown = setTimeout(stopTimer, timeInMinutes * 60 * 1000)
}

function stopTimer() {
    clearTimeout(countdown)
    alert("Countdown has finished.")
}


const palette = {
    blue: "#4472CA",
    pink: "#E9D6EC",
    orange: "#DC965A",
    green: "#61C9A8",
}

function writeInstructions(instructionList) {

    const htmlContent = instructionList.map(x => `<p class='instruction' style='color: ${x.color}'>${x.text}</p>`)
    document.getElementById("instructions").innerHTML = htmlContent.reduce((a, b) => a + b)
}

function readTimer(e) {
    e.preventDefault()
    const minutes = parseInt(document.getElementById("countdownMinutes").value)
    if (minutes > 0) {
        setTimer(minutes)
        showTimerConfirmation(minutes)
    }
}

function showTimerForm() {
    const html = `<form onsubmit="readTimer(event)">
                <span>Set timer for </span><input id="countdownMinutes" type="number" value="5" /><span> minutes.
                    <input type="submit" value="Start" />
            </form>`
    document.getElementById("timer").innerHTML = html
}

function undoTimer() {
    clearTimeout(countdown)
    showTimerForm()
}

function showTimerConfirmation(minutes) {
    const now = new Date()
    var futureDate = new Date()
    futureDate.setMinutes(now.getMinutes() + minutes)
    const html = `<p>A timer has been set, and will alert you at ${futureDate.toLocaleTimeString()}</p>
    <p><button onclick="undoTimer()">remove timer</button></p>`
    document.getElementById("timer").innerHTML = html
}

function modeRingUpDown(up, down) {

    function barSegment(group, alpha, coverage, radius, width) {
        var ba = bezierArc(alpha, alpha + coverage)
        var R = radius + width / 2
        var r = radius - width / 2
        return group.path(`
        M ${R * ba.x1} ${R * ba.y1}
        C ${R * ba.x2} ${R * ba.y2} ${R * ba.x3} ${R * ba.y3}  ${R * ba.x4} ${R * ba.y4}
        L ${r * ba.x4} ${r * ba.y4}
        C ${r * ba.x3} ${r * ba.y3} ${r * ba.x2} ${r * ba.y2}  ${r * ba.x1} ${r * ba.y1}
                `)
    }

    const total = up + down
    const duration = 1000 * total
    const svgBoxSize = 400
    var draw = SVG().addTo(guideVisualsDiv()).viewbox(0, 0, 400, 400)
    svg = draw
    const radius = svgBoxSize / 3
    const maxWidthAnnulus = svgBoxSize / 20
    const minWidthAnnulus = maxWidthAnnulus / 6
    const sweeperLength = svgBoxSize / 40
    const sweeperWidth = svgBoxSize / 40
    // Draw annulus
    const annulus = draw.group()
    for (var i = 0; i < up; i++) {
        barSegment(annulus, 2 * Math.PI * i / total - Math.PI / 2, 2 * Math.PI / total - 0.1, radius, minWidthAnnulus + (i / (up - 1)) * (maxWidthAnnulus - minWidthAnnulus))
            .attr({ fill: palette.blue })
    }
    for (var i = up; i < total; i++) {
        barSegment(annulus, 2 * Math.PI * i / total - Math.PI / 2, 2 * Math.PI / total - 0.1, radius, maxWidthAnnulus - ((i - up) / (down - 1)) * (maxWidthAnnulus - minWidthAnnulus))
            .attr({ fill: palette.green })
    }
    annulus.transform({ translate: [svgBoxSize / 2, svgBoxSize / 2] })
    // Draw sweeper
    const sweeper = draw.group()
    const sweeperMarker = sweeper.group()
    sweeperMarker.path(`
        M 0 0 
        L ${-sweeperWidth} ${-sweeperLength}
        L ${sweeperWidth} ${-sweeperLength}
        Z
    `).transform({ translate: [0, -radius - maxWidthAnnulus] })

    sweeperMarker.animate({
        duration: duration,
        wait: 0
    }).ease("-").rotate(360, 0, 0).loop()

    sweeper.transform({ translate: [svgBoxSize / 2, svgBoxSize / 2] })

    writeInstructions([
        { color: palette.blue, text: `Breathe in for ${up}` },
        { color: palette.green, text: `Breathe out for ${down}` }
    ])

}


function modeSquare(perSide) {

    function barSegment(group, alpha, coverage, radius, width) {
        var x1 = Math.cos(alpha)
        var x2 = Math.cos(alpha + coverage)
        var y1 = Math.sin(alpha)
        var y2 = Math.sin(alpha + coverage)
        var d1 = Math.sqrt(Math.abs(x1) + Math.abs(y1))
        var d2 = Math.sqrt(Math.abs(x2) + Math.abs(y2))
        var R1 = radius / d1
        var r1 = (radius - width) / d1
        var R2 = radius / d2
        var r2 = (radius - width) / d2
        return group.path(`
        M ${R1 * x1} ${R1 * y1}
        L ${R2 * x2} ${R2 * y2}
        L ${r2 * x2} ${r2 * y2}
        L ${r1 * x1} ${r1 * y1}
        Z
                `)
    }

    const total = 4 * perSide
    const duration = 1000 * total
    const svgBoxSize = 400
    var draw = SVG().addTo(guideVisualsDiv()).viewbox(0, 0, 400, 400)
    svg = draw
    const radius = svgBoxSize / 3
    const maxWidthAnnulus = svgBoxSize / 10
    const minWidthAnnulus = maxWidthAnnulus / 12
    const sweeperLength = svgBoxSize / 40
    const sweeperWidth = svgBoxSize / 40
    const gapBetweenBlocks = 0.05
    // Draw annulus
    const annulus = draw.group()
    for (var i = 0; i < perSide; i++) {
        barSegment(annulus, 2 * Math.PI * i / total - Math.PI / 2, 2 * Math.PI / total - gapBetweenBlocks, radius, minWidthAnnulus + (i / (perSide - 1)) * (maxWidthAnnulus - minWidthAnnulus))
            .attr({ fill: palette.blue })
    }
    for (var i = 0; i < perSide; i++) {
        barSegment(annulus, 2 * Math.PI * i / total, 2 * Math.PI / total - gapBetweenBlocks, radius, maxWidthAnnulus)
            .attr({ fill: palette.orange })
    }


    for (var i = 0; i < perSide; i++) {
        barSegment(annulus, 2 * Math.PI * i / total + Math.PI / 2, 2 * Math.PI / total - gapBetweenBlocks, radius, minWidthAnnulus + ((perSide - i - 1) / (perSide - 1)) * (maxWidthAnnulus - minWidthAnnulus))
            .attr({ fill: palette.green })
    }
    for (var i = 0; i < perSide; i++) {
        barSegment(annulus, 2 * Math.PI * i / total + Math.PI, 2 * Math.PI / total - gapBetweenBlocks, radius, minWidthAnnulus)
            .attr({ fill: palette.orange })
    }


    annulus.transform({ translate: [svgBoxSize / 2, svgBoxSize / 2] })
    // Draw sweeper
    const sweeper = draw.group()
    const sweeperMarker = sweeper.group()
    sweeperMarker.path(`
        M 0 0 
        L ${-sweeperWidth} ${-sweeperLength}
        L ${sweeperWidth} ${-sweeperLength}
        Z
    `).transform({ translate: [0, -radius - minWidthAnnulus] })

    sweeperMarker.animate({
        duration: duration,
        wait: 0
    }).ease("-").rotate(360, 0, 0).loop()

    sweeper.transform({ translate: [svgBoxSize / 2, svgBoxSize / 2] })

    writeInstructions([
        { color: palette.blue, text: `Breathe in for ${perSide}` },
        { color: palette.orange, text: `Hold in for ${perSide}` },
        { color: palette.green, text: `Breathe out for ${perSide}` },
        { color: palette.orange, text: `Hold out for ${perSide}` },
    ])

}