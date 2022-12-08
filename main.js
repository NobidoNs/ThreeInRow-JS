
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

checker(true, false, table)

async function tap(x, y) {
  if (first_element.length == 0) {
    first_element = [x, y]
    select(x, y, table)
  } else {
    const x1 = first_element[0]
    const y1 = first_element[1]
    await swap(x1, y1, x, y, table)
  }
}

async function swap(x1, y1, x2, y2, table) {
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
  await checker(h, v, table)
}

function whatIsColor(table, x, y) {
  let n = y * table.cols + x
  if (n < 0 || n > table.rows*table.cols) {
    return false
  }
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

function draw(table) {
  for (let n = 0; n < table.all.length - 1; n++) {
    let y = Math.floor(n / table.cols)
    let x = n - y*table.cols
    let cl = table.all[n]
    chColor(x, y, cl,table)
  }
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

async function checker(h, v, table) {
  for (let i = 0; i < 25; i++) {
    let clean = true
    for (let y = 0; y < table.rows; y++) {
      str = []
      for (let x = 0; x < table.cols; x++) {
        str.push(whatIsColor(table, x, y))
      }
      ret1 = get_pos(str)
      if (ret1.length == 0) {
        await check(table, h, v)
        clean = false
        break
      }
    }
    for (let y = 0; y < table.rows; y++) {
      str = []
      for (let x = 0; x < table.cols; x++) {
        str.push(whatIsColor(table, y, x))
      }
      ret2 = get_pos(str)
      if (ret2.length == 0) {
        await check(table, h, v)
        clean = false
        break
      }
    }
    if (clean == true) {
      break
    }
  }
}

async function check(table, h, v) {
  // horizontal
  for (let y = 0; y < table.rows; y++) {
    st1 = []
    for (let x = 0; x < table.cols; x++) {
      ind1 = y*table.rows+x
      st1.push(table.all[ind1])
    }
    ret1 = get_pos(table, st1)
    for (let i = 0; i < ret1.length; i++) {
      await horis_distr(ret1[i], y, v, table)
    }
  }
  // vertical
  for (let x = 0; x < table.cols; x++) {
    st2 = []
    for (let y = 0; y < table.rows; y++) {
      ind2 = y*table.cols+x
      st2.push(table.all[ind2])
    }
    ret2 = get_pos(table, st2)
    for (let a = 0; a < ret2.length; a++) { 
      ret3 = []
      for (let i in ret2[a]) { 
        x2 = parseInt(ret2[a][i]/table.cols)
        y2 = ret2[a][i] - ret2[a][i]*x2
        ret3.push(y2)
      } 
      await vert_distr(ret3, x, h, table)
    }
  }
}

async function horis_distr(array, y, v, table) {
  l = array.length-1
  rec = 0
  if (l > 0) {
    del_stack(array, -1, y, table)
    if (v) {
      for (let i = 0; i < l+1; i++) {
        st = cut_str(array[l]+i, -1, y, table)
        await slip_one_y(st, y, table)
        rec += 1
      }
    } else {
      slip_three_y(array[l], y, array.length, table)
    }
  }
  return rec
}

async function slip_one_y(st, y, table) {
  ret = []
  for (let a = 0; a < st.length; a++) {
    let x = st.length - a 
    if (x >= table.cols) {
    } else {
      cl = whatIsColor(table, x-1, y)
      chColor(x, y, cl, table)
      ret.push(cl)
    }
  }
  let r = getRandomInt(table.colors.length)
  chColor(0, y, table.colors[r], table)
  await pause(300)
  draw(table)
}

async function slip_one_x(st, x, table) {
  ret = []
  for (let a = 0; a < st.length; a++) {
    let y = st.length - a 
    if (y < table.rows) {
      cl = whatIsColor(table, x, y-1)
      chColor(x, y, cl, table)
      ret.push(cl)
    }
  }
  let r = getRandomInt(table.colors.length)
  chColor(x, 0, table.colors[r], table)
  await pause(300)
  draw(table)
}

function slip_three_y(x_one, y, len, table) {
  for (let i = 0; i < len; i++) {
    let x = x_one + i
    for (let a = 0; a < y; a++) {
      let cl = whatIsColor(table, x, y-a-1)
      chColor(x, y-a, cl, table)
    }

    let r = getRandomInt(table.colors.length)
    chColor(x, 0, table.colors[r], table)
  }
}

function slip_three_x(y_one, x, len, table) {
  for (let i = 0; i < len; i++) {
    let y = y_one + i
    for (let a = 0; a < x; a++) {
      let cl = whatIsColor(table, x-a-1, y)
      chColor(x-a, y, cl, table)
    }
    let r = getRandomInt(table.colors.length)
    chColor(0, y, table.colors[r], table)
  }
}

function cut_str(element, x, y, table) {
  const st = []
  if (x == -1) {
    for (let a = 0; a < element; a++) {
      ind = y*table.cols+a
      st.push(table.all[ind])
    }
  } else if (y==-1) {
    for (let a = 0; a < element; a++) {
      ind = a*table.cols+x
      st.push(table.all[ind])
    }
  } else {
    console.log(cut_str_er)
  }
  return st
}

function del_stack(elems, x, y, table) {
  if (x == -1) {
    for (i in elems) {
      chColor(elems[i], y, "black", table)
    }
  } else if (y == -1) {
    for (i in elems) {
      chColor(x, elems[i], "black", table)
    }
  } else {
    console.log("del_stack_er")
  }
}

async function vert_distr(array, x, h, table) {
  l = array.length-1
  rec = 0
  if (l > 0) {
    del_stack(array, x, -1, table)
    if (h) {
      for (let i = 0; i < l+1; i++) {
        st = cut_str(array[l]+i, x, -1, table)
        await slip_one_x(st, x, table)
        rec += 1
      }
    } else {
      slip_three_x(array[l], x, array.length, table)
    }
  }
  return rec
}

function get_pos(table, array) {
  const colors = ["red", "blue", "green", "violet", "pink"]
  let result = []
  let res = []
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
          res.push(rec-i)
        }
        result.push(res)
        res = []
      }
      cls[item] = 0
    })

    rec += 1
  }

  colors.forEach(item => {
    if (cls[item] >= 3) {
      for (let i = 0; i<=cls[item]-1; i++) {
        const l = array.length - 1 - i
        res.push(l)
      }
      result.push(res)
      res = []
    }
  })
  return result

}

async function pause(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}





//             Test horis_distr
// const tt2 = {
//   rows : 1,
//   cols : 10,
//   tableObj: null,
//   colors: ["red", "blue", "green", "violet", "pink"],
//   all:["violet", "pink", "red", "blue", "pink", "violet", "black", "black", "black", "black"]
// }

// array = [9, 8, 7, 6]
// a = tt2.all.slice(0, 6)
// horis_distr(array, 0, true, tt2)
// if (JSON.stringify(a) == JSON.stringify(tt2.all.slice(-6))) {
//   console.log("Yes")
// } else {
//   console.log(a, tt2.all.slice(-6))
// }

//          Test slip_one
// const table_test = {
//   rows : 1,
//   cols : 10,
//   tableObj: null,
//   colors: ["red", "blue", "green", "violet", "pink"],
//   all:["red", "blue", "red", "violet", "pink", "red", "blue", "pink", "black", "black"]
// }
//
// st = table_test.all.slice(0, 9)
// console.log(table_test.all.slice(0), st)

// slip(st, 0, table_test)
// console.log(table_test.all.slice(0))

//            Test slip_three 

// const table_test = {
//   rows : 3,
//   cols : 3,
//   tableObj: null,
//   colors: ["red", "blue", "green", "violet", "pink"],
//   all:[
//   "red", "blue", "red", 
//   "black", "black", "black",
//   "violet", "pink", "red", 
//   ]
// }
// slip_three(0, 1, 3, table_test)
// console.log("red", "blue", "red", "violet", "pink", "red")
// console.log(table_test.all.splice(3))