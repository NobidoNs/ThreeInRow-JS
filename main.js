
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

const table = new Table('myTable', 15, 15)
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
    select(x1, y1, table)
  }
}

function swap(x1, y1, x2, y2, table) {
  if ((x1+1 == x2 && y1 == y2) || (x1-1 == x2 && y1 == y2) ||
  (x1 == x2 && y1+1 == y2) || (x1 == x2 && y1-1 == y2)) {
    const c1 = whatIsColor(table, x2, y2)
    const c2 = whatIsColor(table, x1, y1)
    if (c1 != c2) {
      console.log("swap")
      chColor(x2, y2, c2, table)
      chColor(x1, y1, c1, table)
      first_element = []
    }
  }
  checker(table)
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
    $(el).css('border-radius', "7px");
    }
}

function checker(table) {
  const colors_id = get_pos(table)
  check(colors_id)
}

function check(colors_id) {
  // console.log(colors_id["red"][0]["x"])
  for (let i in colors_id) {
    for (let n in colors_id[i]) {
      const y1 = colors_id[i][n]["y"]
      const y2 = colors_id[i][n+1]["y"]
      const x1 = colors_id[i][n]["x"]+1
      const x2 = colors_id[i][n+1]["x"]
      if (y1 == y2 && x1 == x2) {
        
      }
    }
  }
}

function get_pos(table) {
  const colors_id = {
    red:[],
    blue:[],
    green:[],
    violet:[],
    pink:[]
  }
  
  const red_id = []
  const colors = ["red", "blue", "green", "violet", "pink"]
  for (let y = 0; y <= table.cols; y++) {
    for (let x = 0; x <= table.rows; x++) {
      const color = whatIsColor(table, x, y)
      let r = 0
      for (let i in colors_id) {
        if (color == colors[r]) {
          colors_id[i].push({x, y})
        }
        r += 1
      }

    }
  }
  return colors_id
}