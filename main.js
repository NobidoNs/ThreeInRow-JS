
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
    }
  }
  select(x1, y1, table)
  first_element = []
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
    $(el).css('border-radius', "7px")
    }
}

function checker(table) {
  get_pos(table)
}


function get_pos(table) {
  result = []
  for (let x = 0; x < table.cols; x++) {
    const cls=[]
    let rec = 0
    for (let y = 0; y < table.rows; y++) {
      cls.push({
        color:whatIsColor(table, x, table.rows-y-1),
        pos:(table.rows-y)*table.rows + x - 15
      })
      // cl = whatIsColor(table, x, table.rows-y-1)

    }
    for (item in cls) {
      if (rec == 0) {
        cont_item = cls[item].color
        rec += 1
      } else {
        if (cls[item].color == cont_item) {
          rec += 1
        } else if (rec >= 3) {
          let i1 = 0
          for (let io = 0; io < rec; io++) {
            i1 = io*15
            result.push(cls[item-1].pos+i1)
          }
          rec = 1
          cont_item = cls[item].color
        } else {
          rec = 1
          cont_item = cls[item].color
        }
      }
    }
  }
  console.log(result)

  for (i in result) {
    y = Math.trunc(result[i]/table.rows)
    x = result[i]-y*table.rows 
    // console.log(x, y)
    select(x, y, table)
  }

  // const r1 = result.map((num) => {
  //   console.log(num)
  //   const y = parseInt(num/table.rows)
  //   const x = num-y*table.rows
  //   return {y,x}
  // })
  // for (i in r1) {
  //   chColor(i[0], i[1], "black", table)
  // }
  // console.log(r1)
}











































// function get_pos(table, array) {
//   const colors = ["red", "blue", "green", "violet", "pink"]
//   let result = []
//   let cls = {
//     red : 0,
//     blue : 0,
//     green : 0,
//     violet : 0,
//     pink : 0
//   }
//   let rec = 0
//   for (x in array) {
//     let c = array[x]
//     const off = colors.filter(item => item != c)
//     cls[c] += 1

//     off.forEach(item => {
//       if (cls[item] >= 3) {
//         for (let i = 1; i <= cls[item]; i++) {
//           result.push(rec-i)
//         }
//       }
//       cls[item] = 0
//     })

//     rec += 1
//   }

//   colors.forEach(item => {
//     if (cls[item] >= 3) {
//       for (let i = 0; i<=cls[item]-1; i++) {
//         const l = array.length - 1 - i
//         result.push(l)
//       }
//     }
//   })
//   console.log(result)

// }