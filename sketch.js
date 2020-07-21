// Feito por Roberto Betini (aka Frutose)

const natural = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
const notas = [
  ['B#', 'C', 'Dbb'], 
  ['Bx', 'C#', 'Db'], 
  ['Cx', 'D', 'Ebb'], 
  ['D#', 'Eb', 'Fbb'], 
  ['Dx', 'E', 'Fb'], 
  ['E#', 'F', 'Gbb'], 
  ['Ex', 'F#', 'Gb'], 
  ['Fx', 'G', 'Abb'],
  ['G#', 'Ab'], 
  ['Gx', 'A', 'Bbb'], 
  ['A#', 'Bb', 'Cbb'], 
  ['Ax', 'B', 'Cb'] 
            ];
const cromatica = [...notas, ...notas];
const notasExtenso = ['dób', 'dó', 'dó#', 'réb', 'ré', 'ré#', 'mib', 'mi', 'mi#', 'fáb', 'fá', 'fá#', 'solb', 'sol', 'sol#', 'láb', 'lá', 'lá#', 'sib', 'si', 'si#'];
const c1 = ['Cb', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'E#', 'Fb', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'B#'];
const c2 = ['', 'm', ];
const c3 = ['', '6', '7', '7M', 'bb7'];
const c4 = ['', 'sus2', 'sus4'];
const c5 = ['', 'b5', '#5', 'b6'];
const c6 = ['', 'b9', '9', '#9'];
const c7 = ['', 'b11', '11', '#11'];
const c8 = ['', 'b13', '13', '#13'];
var buttons, pE, pA, pC;
var P, H, M;
var cifras = [];
var log_ = false;

function setup() {
  noCanvas();
  for(let i = 0; i < c1.length; i++) {
  }
  // formando o dicionário de acordes na forma:
  // c1c2c3/c4(c5/c6/c7/c8)
  // Exemplo: C#m7/4(b5/9/#11/13)
  for(let el1 of c1) {
    for(let el2 of c2) {
      for(let el3 of c3) {
        for(let el4 of c4) {
          for(let el5 of c5) {
            for(let el6 of c6) {
              for(let el7 of c7) {
                for(let el8 of c8) {
                  let sep = '';
                  let par1 = '';
                  let par2 = '';
                  if(el3 != '' && el4 != '') {
                    sep = '/';
                  }
                  if(el5 != '' || el6 != '' || 
                     el7 != '' || el8 != '') {
                    par1 = '(';
                    par2 = ')';
                  }
                  let T = [el5, el6, el7, el8]
                  T = T.filter(el => {
                    return el != '';
                  });
                  let cifra;
                  if(el2 === '') {
                    cifra = el1 + el2 + el3 + sep + el4 + 
                              par1 + join(T, '/') + par2;
                  } else {
                    cifra = el1 + el2  + el3 +  
                              par1 + join(T, '/') + par2;
                  }
                  if(el2 === 'm' && el3 === 'bb7' && el5 === 'b5' && el4 === '' && el6 === '' && el7 === '' && el8 === '') {
                    cifra = el1 + '°';
                    cifras.push(cifra);
                    }
                  if(el3 === 'bb7') {
                  } else {
                    if(el3 === '6' && el5 === '6m') {     
                    } else {
                      cifras.push(cifra);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  console.log(cifras.length + ' cifras geradas.');
  console.log('Excluindo cifras inválidas...');

  cifras = cifras.filter((c) => {
    return chkA(c);
  });
  log_ = true;
  
  console.log(cifras.length + ' cifras válidas.');
  P = document.getElementById('P');
  H = document.getElementById('H');
  M = document.getElementById('M');
  buttons = document.getElementsByTagName('button');
  pE = document.getElementById('pE');
  pE.style = 'color: red;'
  pA = document.getElementById('pA');
  pA.style = 'color: red;'
  pC = document.getElementById('pC');
  pC.style = 'color: red;'
  
  let tonalidades = [];
  for(let el1 of c1) {
    for(let el2 of c2) {
      tonalidades.push(el1 + el2);
    }
  }
  let tipo = selTipo();
  P.onclick = () => {
    H.checked = false;
    M.checked = false;
    tipo = selTipo();
  }
  H.onclick = () => {
    P.checked = false;
    M.checked = false;
    tipo = selTipo();
  }
  M.onclick = () => {
    P.checked = false;
    H.checked = false;
    tipo = selTipo();
  }
  
  buttons[0].onclick = () => {
    if(tonalidades.includes(inputE.value)) {
      let escala = gerarEscala(inputE.value, tipo);
      pE.innerHTML = join(escala, ', ');
    } else {
      pE.innerHTML = 'Insira uma tonalidade válida.';
    }
  }
  buttons[1].onclick = () => {
    if(cifras.includes(inputA.value)) {
      let acorde = gerarAcorde(inputA.value);
      pA.innerHTML = join(acorde, ', ');
    } else {
      pA.innerHTML = 'Insira uma cifra válida.'
    }
  }
  buttons[2].onclick = () => {
    if(tonalidades.includes(inputC.value)) {
      let CH = gerarCH(inputC.value, tipo);
      pC.innerHTML = join(CH, ', ');
    } else {
      pC.innerHTML = 'Insira uma tonalidade válida.'
    }
  }
}

function gerarEscala(tonalidade, modo) {
  let intervalos = [];
  if(modo === 'PRIMITIVA') {
    if(tonalidade.indexOf('m') === tonalidade.length - 1) {
      // TOM, SEMITOM, TOM TOM, SEMITOM, TOM TOM (escala menor)
      intervalos = [2, 1, 2, 2, 1, 2, 2];
      tonalidade = tonalidade.slice(0, tonalidade.length - 1);
    } else {
      // TOM, TOM, SEMITOM, TOM, TOM, TOM, SEMITOM (escala maior)
      intervalos = [2, 2, 1, 2, 2, 2, 1];
    }
    } else if(modo === 'HARMÔNICA') {
      if(tonalidade.indexOf('m') === tonalidade.length - 1) {
        intervalos = [2, 1, 2, 2, 1, 3, 1];
        tonalidade = tonalidade.slice(0, tonalidade.length - 1);
      } else {
        intervalos = [2, 2, 1, 2, 1, 3, 1];
      }
    } else if(modo === 'MELÓDICA') {
      if(tonalidade.indexOf('m') === tonalidade.length - 1) {
        intervalos = [2, 1, 2, 2, 2, 2, 1];
        tonalidade = tonalidade.slice(0, tonalidade.length - 1);
      } else {
        intervalos = [2, 2, 1, 2, 1, 2, 2];
      }     
    }
  let escala = [];
  let i = cromatica.findIndex(element => {
    return element.includes(tonalidade);
  });
  let n = natural.findIndex(element => {
    return element.includes(tonalidade[0]);
  });
  escala.push(tonalidade);
  i += intervalos[0];
  n++;
  for(let j = 0; j < 6; j++) {
    if(cromatica[i][0].includes(natural[n])) {
      escala.push(cromatica[i][0]);
    } else if(cromatica[i][1].includes(natural[n])) {
      escala.push(cromatica[i][1]);
    } else {
      escala.push(cromatica[i][2]);
    }
    i += intervalos[1 + j];
    n++;
  }
  for(let i = 0; i < escala.length; i++) {
    escala[i] = cifraParaNota(escala[i]);
  }
  console.log(escala);
  return escala;
}

function gerarAcorde(acorde) {
  if(acorde.includes('°')) {
    acorde += 'mb5bb7'
  }
  let notas = [];
  let n = natural.indexOf(acorde[0]);
  let fundamental;
  if(acorde[1] === '#' || acorde[1] === 'b') {
    fundamental = acorde.slice(0, 2);
    notas.push(fundamental);
  } else {
    fundamental = acorde[0];
    notas.push(fundamental);
  }
  let i1 = acharIndice(fundamental);
  
  // descobrindo a terça, segunda e quarta (as duas últimas no caso de acordes suspensos)
  let III;
  if(acorde.includes('m')) {
    III = cromatica[i1 + 3];
    for(let j = 0; j < III.length; j++) {
      if(III[j].includes(natural[n + 2])) {
        notas.push(III[j]);
      }
    }
  } else if(acorde.includes('sus2')) {
    III = cromatica[i1 + 2];
    for(let j = 0; j < III.length; j++) {
      if(III[j].includes(natural[n + 1])) {
        notas.push(III[j]);
      }
    }
  } else if(acorde.includes('sus4')) {
    III = cromatica[i1 + 5];
    for(let j = 0; j < III.length; j++) {
      if(III[j].includes(natural[n + 3])) {
        notas.push(III[j]);
      }
    }
  } else {
    III = cromatica[i1 + 4];
    for(let j = 0; j < III.length; j++) {
      if(III[j].includes(natural[n + 2])) {
        notas.push(III[j]);
      }
    }
  }
  
  //descobrindo a quinta
  let V;
  if(acorde.includes('#5')) {
    V = cromatica[i1 + 8];
    for(let j = 0; j < V.length; j++) {
      if(V[j].includes(natural[n + 4])) {
        notas.push(V[j]);
      }
    }
  } else if(acorde.includes('b5')) {
    V = cromatica[i1 + 6];
    for(let j = 0; j < V.length; j++) {
      if(V[j].includes(natural[n + 4])) {
        notas.push(V[j]);
      }
    }
  } else {
    V = cromatica[i1 + 7];
    for(let j = 0; j < V.length; j++) {
      if(V[j].includes(natural[n + 4])) {
        notas.push(V[j]);
      }
    }
  }
  
  // descobrindo a sexta
  if(acorde.includes('6')) {
    let VI;
    if(acorde.includes('b6')) {
      VI = cromatica[i1 + 8];
      for(let j = 0; j < VI.length; j++) {
        if(VI[j].includes(natural[n + 5])) {
          notas.push(VI[j]);
        }
      }
    } else {
      VI = cromatica[i1 + 9];
      for(let j = 0; j < VI.length; j++) {
        if(VI[j].includes(natural[n + 5])) {
          notas.push(VI[j]);
        }
      }
    }
  }
  
  // descobrindo a sétima
  if(acorde.includes('7')) {
    let VII;
    if(acorde.includes('7M')) {
      VII = cromatica[i1 + 11];
      for(let j = 0; j < VII.length; j++) {
        if(VII[j].includes(natural[n + 6])) {
          notas.push(VII[j]);
        }
      }
    } else if(acorde.includes('bb7')) {
      VII = cromatica[i1 + 9];
      for(let j = 0; j < VII.length; j++) {
        if(VII[j].includes(natural[n + 6])) {
          notas.push(VII[j]);
        }
      }
    } else {
      VII = cromatica[i1 + 10];
      for(let j = 0; j < VII.length; j++) {
        if(VII[j].includes(natural[n + 6])) {
          notas.push(VII[j]);
        }
      }
    }
  }
  
  // descobrindo a nona
  if(acorde.includes('9')) {
    let IX;
    if(acorde.includes('b9')) {
      IX = cromatica[i1 + 1];
      for(let j = 0; j < IX.length; j++) {
        if(IX[j].includes(natural[n + 1])) {
          notas.push(IX[j]);
        }
      }
    } else if(acorde.includes('#9')) {
      IX = cromatica[i1 + 3];
      for(let j = 0; j < IX.length; j++) {
        if(IX[j].includes(natural[n + 1])) {
          notas.push(IX[j]);
        }
      }  
    } else {
      IX = cromatica[i1 + 2];
      for(let j = 0; j < IX.length; j++) {
        if(IX[j].includes(natural[n + 1])) {
          notas.push(IX[j]);
        }
      }
    }
  }
  
  // descobrindo a décima primeira
  if(acorde.includes('11')) {
    let XI;
    if(acorde.includes('b11')) {
      XI = cromatica[i1 + 4];
      for(let j = 0; j < XI.length; j++) {
        if(XI[j].includes(natural[n + 3])) {
          notas.push(XI[j]);
        }
      }
    } else if(acorde.includes('#11')) {
      XI = cromatica[i1 + 6];
      for(let j = 0; j < XI.length; j++) {
        if(XI[j].includes(natural[n + 3])) {
          notas.push(XI[j]);
        }
      }
    } else {
      XI = cromatica[i1 + 5];
      for(let j = 0; j < XI.length; j++) {
        if(XI[j].includes(natural[n + 3])) {
          notas.push(XI[j]);
        }
      }
    }
  }
    
  // descobrindo a décima terceira
  if(acorde.includes('13')) {
    let XIII;
    if(acorde.includes('b13')) {
      XIII = cromatica[i1 + 8];
      for(let j = 0; j < XIII.length; j++) {
        if(XIII[j].includes(natural[n + 5])) {
          notas.push(XIII[j]);
        }
      }
    } else if(acorde.includes('#13')) {
      XIII = cromatica[i1 + 10];
      for(let j = 0; j < XIII.length; j++) {
        if(XIII[j].includes(natural[n + 5])) {
          notas.push(XIII[j]);
        }
      }  
    } else {
      XIII = cromatica[i1 + 9];
      for(let j = 0; j < XIII.length; j++) {
        if(XIII[j].includes(natural[n + 5])) {
          notas.push(XIII[j]);
        }
      }
    }
  }
  for(let i = 0; i < notas.length; i++) {
    notas[i] = cifraParaNota(notas[i]);
  }
  if(log_) {
    console.log(notas);
  }
  return notas;
}

function gerarCH(tom, modo) {
  let CH = [];
  let graus;
  let notasCH = gerarEscala(tom, modo);
  for(let i = 0; i < notasCH.length; i++) {
    notasCH[i] = notaParaCifra(notasCH[i]);
  }
  if(tom.indexOf('m') === tom.length - 1) {
    if(modo === 'PRIMITIVA') {
        graus = ['m7', 'm7(b5)', '7M', 'm7', 'm7', '7M', '7'];
    } else if(modo === 'HARMÔNICA') {
        graus = ['m7M', 'm7(b5)', '7M(#5)', 'm7', '7', '7M', '°'];
    } else if(modo === 'MELÓDICA') {
        graus = ['m7M', 'm7', '7M(#5)', '7', '7', 'm7(b5)', 'm7(b5)'];
    }
  } else {
    if(modo === 'PRIMITIVA') {
        graus = ['7M', 'm7', 'm7', '7M', '7', 'm7', 'm7(b5)'];
    } else if(modo === 'HARMÔNICA') {
        graus = ['7M', 'm7(b5)', 'm7', 'm7M', '7', '7(#5)', '°'];
    } else if(modo === 'MELÓDICA') {
        graus = ['7', 'm7(b5)', 'm7(b5)', 'm7M', 'm7', '7(#5)', '7'];
    }
  }
  for(let i = 0; i < 7; i++) {
    CH.push(notasCH[i].concat(graus[i]));
  }
  console.log(CH); 
  return CH;
}

function acharIndice(nota) {
  for(let i = 0; i < cromatica.length; i++) {
    if(cromatica[i].includes(nota)) {
      for(let element of cromatica[i]) {
        if(element === nota) {
          return i;
        }
      }
    }
  }
}

function cifraParaNota(cifra) {
  if(notasExtenso.includes(cifra)) {
    console.log('O valor inserido já é uma nota.');
  } else if(c1.includes(cifra)) {
    let index = c1.indexOf(cifra);
    return notasExtenso[index];
  } else {
    //console.log('Cifra inválida.');
  } 
}

function notaParaCifra(nota) {
  if(c1.includes(nota)) {
    console.log('O valor inserido já é uma cifra.');
  } else if(notasExtenso.includes(nota)) {
    let index = notasExtenso.indexOf(nota);
    return c1[index];
  } else {
    //console.log('Nota inválida.');
  }
}

function selTipo() {
  if(P.checked) {
    return P.name; 
  } else if(H.checked) {
    return H.name;        
  } else if(M.checked) {
    return M.name;        
  }
}

function chkA(acorde) {
  let notasAcorde = gerarAcorde(acorde);
  for(let n of notasAcorde) {
    if(notasExtenso.includes(n)) {
      
    } else {
      return false;
    }
  }
  return true;
}