
class Table {
  constructor (tableSelector, rowsSelector, columnsSelector) {
    this.rows = rowsSelector
    this.cols = columnsSelector
    this.tableObj = $(`#${tableSelector}`)
    this.colors = ["red", "blue", "green", "violet", "pink"]
    this.all = []
  }

  randomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }

  generate() {
    for (let i = 0; i <= this.rows-1; i++) {
      for (let j = 0; j <= this.cols-1; j++) {
        const len = this.colors.length
        const index = this.randomInt(0, len)
        const color = this.colors[index]
        this.all.push(color)
      }
    }
    this.createFromAll()
  }

  createFromAll = () => {
    let tableHTML = ''

    for (let i = 0; i <= this.rows-1; i++) {
      let tr = '<tr>'
      let td = ''
      for (let j = 0; j <= this.cols-1; j++) { 
        const cell = i * this.cols + j
        const color = this.all[cell]
        td = `<td style='background-color: ${color};' onclick="tap(${j},${i})"'></td>`
        // td = `<td onclick="tap(${j},${i})"></td>`;

        tr += td
      }
    
      tr += '</tr>'
      tableHTML += tr
    }
    this.tableObj.html(tableHTML)
  }

}

const table = new Table('myTable', 10, 10)
table.generate()

let first_element = []

function tap(x, y) {
  if (first_element.length == 0) {
    first_element = [x, y]
    select(x, y, table)
  } else {
    const x1 = first_element[0]
    const y1 = first_element[1]
    swap(x1, y1, x, y, table)
  }
}

function swap(x1, y1, x2, y2, table) {
  let v = false
  let h = false
  if ((x1+1 == x2 && y1 == y2) || (x1-1 == x2 && y1 == y2) ||
  (x1 == x2 && y1+1 == y2) || (x1 == x2 && y1-1 == y2)) {
    const c1 = whatIsColor(table, x2, y2)
    const c2 = whatIsColor(table, x1, y1)
    if (c1 != c2) {
      console.log("swap")
      chColor(x2, y2, c2, table)
      chColor(x1, y1, c1, table)
      if (x1 == x2) {
        h = true
      } else {
        v = true
      }
    }
  }
  select(x1, y1, table)
  first_element = []
  checker(table, h, v)
}

function whatIsColor(table, x, y) {
  let n = y * table.cols + x
  let color = table.all[n]

  const first = $("td");
  let el = first[n];
  $(el).css('background-color', color)
  return color

}

function chColor(x, y, color, table) {
  const first = $("td");
  let n = y * table.cols + x
  let el = first[n];
  $(el).css('background-color', color);
  table.all[n] = color
}

function select(x, y, table) {
  const first = $("td");
  let n = y * table.cols + x
  let el = first[n];
  if ($(el).css('border-radius') == ("7px")) {
    $(el).css('border-radius', "0px")  
  } else {
    $(el).css('border-radius', "7px")
    }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function checker(table, h, v) {
  // horizontal
  for (let y = 0; y < table.rows; y++) {
    st1 = []
    for (let x = 0; x < table.cols; x++) {
      ind1 = y*table.rows+x
      st1.push(table.all[ind1])
    }
    ret1 = get_pos(table, st1)
    horis_distr(ret1, y, v, table)
  }
  // vertical
  for (let x = 0; x < table.cols; x++) {
    st2 = []
    for (let y = 0; y < table.rows; y++) {
      ind2 = y*table.cols+x
      st2.push(table.all[ind2])
    }
    ret2 = get_pos(table, st2)
    ret3 = []
    for (let i in ret2) {
      x2 = parseInt(ret2[i]/table.cols)
      y2 = ret2[i] - ret2[i]*x2
      ret3.push(y2)
    } 
    vert_distr(ret3, x, h, table)
  }
}

function horis_distr(array, y, v, table) {
  l = array.length
  if (l > 0) {
    if (v) {
      for (let a = array[0]; a >= 0; a-=1) {
        if (a-l>=0) {
          c = whatIsColor(table, a-l, y)
          chColor(a, y, c, table)
        } else {
          let r = getRandomInt(table.colors.length)
          chColor(a, y, table.colors[r], table)
        }
      }
    const r = getRandomInt(table.colors.length)
    chColor(0, y, table.colors[r], table)
    }
  }
}

function vert_distr(array, x, h, table) {
  for (i in array) {
    select(x, array[i], table)
  }
}

function get_pos(table, array) {
  const colors = ["red", "blue", "green", "violet", "pink"]
  let result = []
  let cls = {
    red : 0,
    blue : 0,
    green : 0,
    violet : 0,
    pink : 0
  }
  let rec = 0
  for (x in array) {
    let c = array[x]
    const off = colors.filter(item => item != c)
    cls[c] += 1
    y = parseInt((rec-1) / table.rows)
    x = (rec-1) - y*table.cols

    off.forEach(item => {
      if (cls[item] >= 3 ) {
        for (let i = 1; i <= cls[item]; i++) {
          result.push(rec-i)
        }
      }
      cls[item] = 0
    })

    rec += 1
  }

  colors.forEach(item => {
    if (cls[item] >= 3) {
      for (let i = 0; i<=cls[item]-1; i++) {
        const l = array.length - 1 - i
        result.push(l)
      }
    }
  })

  return result

}