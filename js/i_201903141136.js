(function(){ //wrapper function

//---------------------- constants
const allowedChars = 'aiueokgcjtdmnpbhyrlvs*' // chars allowed in userInput for all input methods
const imEls = Array.from(document.querySelectorAll('.input-method')); //im- stands for 'input method'
const dmEls = Array.from(document.querySelectorAll('.display-method'))//dm stands for 'display method'
const imScheme = [] ;
  imScheme['hk'] =   ['A', 'I', 'U', 'R', 'L', 'T', 'D', 'G', 'N', 'J', 'M', 'S', 'z', 'H']; //most important transliteration, used for searches
  imScheme['iast'] = ['ā', 'ī', 'ū', 'ṛ', 'ḷ', 'ṭ', 'ḍ', 'ṅ', 'ṇ', 'ñ', 'ṃ', 'ṣ', 'ś', 'ḥ'];
  imScheme['velthuis'] = ['_a', '_i', '_u', 'XX', '.l', '.t', '.d', '`n', '.n', '~n', '.m', '.s', 'XY', '.h'];
const imSelector = document.querySelector('#input-methods-selector') ; // container for input method radio buttons
const matchContainer = document.querySelector('#search-match') ;
const startSearchButton = document.querySelector('#start-search');
const inputField = document.querySelector('#input-field');
const warningsContainer = document.querySelector('#warnings-container');
const searchOptionsContainer = document.querySelector('#search-options-wrap') ;
const displayMethodSelector = document.querySelector('#display-method-selector') ;
const fullTextSearch = document.querySelector('#option-fulltext');
const searchOptions = ['#option-any-ending', '#option-any-beginning', 'label[for="option-any-beginning"]', 'label[for="option-any-ending"]'] ;
const hideOptionsButton = document.querySelector('#hide-options') ;
const showOptionsButton = document.querySelector('#show-options') ;
const inputMethodWrapper = document.querySelector('#input-methods-wrapper');
console.log(inputMethodWrapper);//debug
//--------------------- vars
let imCurrent;
let warnings = [];
//--------------------- event listeners
startSearchButton.addEventListener('click', function(){
  (inputField.value.length > 0) && update(inputField.value);
});

hideOptionsButton.addEventListener('click', function(ev) {
  hideOptionsButton.classList.add('hidden');
  inputMethodWrapper.classList.add('hidden');
  showOptionsButton.classList.remove('hidden');
});

showOptionsButton.addEventListener('click', function(ev) {
  hideOptionsButton.classList.remove('hidden');
  inputMethodWrapper.classList.remove('hidden');
  showOptionsButton.classList.add('hidden');
});


inputField.addEventListener('keyup', function(ev){
  if (ev.keyCode === 13) {
    ev.preventDefault();
    startSearchButton.click();
  };
});

searchOptionsContainer.addEventListener('click', function(ev){
  if (ev.target.id === 'option-fulltext' && ev.target.checked){
    console.log(`ev.target.id: ${ev.target.id}`);//debug
    searchOptions.forEach(function(s) { 
      searchOptionsContainer.querySelector(`${s}`).setAttribute('disabled', 'disabled') ; 
      searchOptionsContainer.querySelector(`${s}`).classList.add('inactive') ; 
    });
  } else {
    searchOptions.forEach(function(s) { 
      searchOptionsContainer.querySelector(`${s}`).removeAttribute('disabled') ; 
      searchOptionsContainer.querySelector(`${s}`).classList.remove('inactive') ; 
    });
  ;}
})

let checkOption = function(els) {
  for (let ii = 0; ii < els.length; ++ii) {
    if (els[ii].checked) {
      return els[ii].value;
      };
  };
};

let convertToHK = function(string) {
  let ss = string;
  let im = imScheme[imCurrent];
    for(let ii = 0 ; ii < im.length; ++ii) {
      let toBeReplaced = im[ii];
      let newString = imScheme['hk'][ii];
      while (ss.match(toBeReplaced)) { 
        ss = ss.replace(toBeReplaced, newString) ;
        // console.log('searchTerm: ' + ss);
      };
    };
    return ss;
};

let sanitize = function(string){
  let illegalChars = new RegExp('[^' + allowedChars + imScheme[imCurrent].join('') + ']{1,}');
  let ss = string.trim();
  let msg;
  if (illegalChars.test(ss)) {
    do {
      ss = ss.replace(illegalChars, '');
    } while(illegalChars.test(ss));
  } 
  return ss;
}

let search = function (searchedTerm, searchRange){
  let matches = [];
  let matched = false;
  if (searchRange === 'wordlist') { // dear Tom from future: keep var declarations inside this conditional
    var rr = mwsdWordList;
    var st = new RegExp(`^${searchedTerm.replace(/\*/g, '.*')}$`);
  } else {
    var rr = mwsdContent
    var st = new RegExp(`${searchedTerm.replace(/\*/g, '.*')}`) ;
  };
    for (let ii = 0 ; ii < rr.length ; ++ii) {
      if (st.test(rr[ii])) {
        matches.push(mwsdContent[ii]);
        // matched = true; //FIXME: we need this limit of amount of queries 
      } 
      else if (matched === true) {
        break;
      };
    };
    (matches.length > 0) || matches.push(`No such word: ${searchedTerm}`);
    return matches;
};

let displayMatches = function(matches) {
  let els = [];
  if ( matches.length > 0 ) { matches.forEach(function (mm){ els.push(mm); });}
  else { els.push(`No such word: ${sanitizedInput}`) };
  els.forEach(function(el){
    matchContainer
      .appendChild(document.createElement('article'))
      .innerHTML = el;
  });
};

let clearContainer = function(container) { while (container.hasChildNodes()) { container.removeChild(container.lastChild); }; }

let displayWarning = function(warning) {
    warningsContainer
      .appendChild(document.createElement('p'))
      .innerHTML = warning;
  };

let colorizeMatches = function(matches) {
    matches.unshift('<ul>') ;
    matches.push('</ul>') ;
  for (let ii = 0 ; ii < matches.length ; ++ii){ //colorization regexps, check html attributes for an idea to what they apply
    matches[ii] = matches[ii].replace(/(^[^ \t]+)/g, '<span class="color-match">$1</span>') ; 
    matches[ii] = matches[ii].replace(/--->/g, '♥') // FIXME: works, but find a proper regex
    matches[ii] = matches[ii].replace(/♥([^♥]+)/g, '<li>$1</li>') //FIXME: cont.
    // matches[ii] = matches[ii].replace(/--->((.*)(?=--->))/g, '<li>$1</li>')//FIXME: cont. try lookahead contruction
    matches[ii] = matches[ii].replace(/([^√]{1}[^\[]+)(\[[^\]\[]+\])/g, '$1<span class="color-compound">$2</span>') ;
    matches[ii] = matches[ii].replace(/(\[[AP ]+\])/g, '<span class="color-voice">$1</span>') ;
    matches[ii] = matches[ii].replace(/(\b(Intens|inf|(p|P)ass|Pot|Subj|du|Nom|P|gen|acc|loc|instr|nom|dat|voc|fut|pf|pl|sg|P|Ā|aor|impf|Impv|Prec|Caus|p|Desid|ind)\.)/g, '<span class="color-gram">$1</span>') ;
    matches[ii] = matches[ii].replace(/([\d]+\. *cl\.)/g, '<span class="color-class">$1</span>') ;
    matches[ii] = matches[ii].replace(/(cl. *[\d]+\.)/g, '<span class="color-class">$1</span>') ;
    // matches[ii] = matches[ii].replace(/(\b(m|n|f)\.)/g, '<span class="color-gender">$1</span>') ;
  }; 
  // console.log(`matches: ${matches}`) ;
  return matches;
};

// convertFullTextToIAST(matches) {
//   let ll;
// };
// -------------------------MAIN FUNCTION
let update = function(userInput) {
  let matches ;
  let sanitizedInput; 
  let searchRange = 'wordlist';

  clearContainer(warningsContainer);
  clearContainer(matchContainer);

  imCurrent = checkOption(imEls);// dear Tom from future: keep it before sanitize() call
  // dmCurrent = checkOption(dmEls);

  sanitizedInput = sanitize(userInput);
  (sanitizedInput === userInput) || (displayWarning(`Stripped characters not present in ${imCurrent} from '${userInput}'. Searched for '${sanitizedInput}' instead.`));
  searchedTerm = (imCurrent === 'hk') ? sanitizedInput : convertToHK(sanitizedInput);
  //FIXME: dirty checks , make const of DOM
  (searchOptionsContainer.querySelector('#option-any-ending').checked) && (searchedTerm = searchedTerm + '*') ;//will be changed in search() to proper regex
  (searchOptionsContainer.querySelector('#option-any-beginning').checked) && (searchedTerm = '*' + searchedTerm) ;
  (searchOptionsContainer.querySelector('#option-fulltext').checked) && (searchRange = 'fulltext') ;

  matches = search(searchedTerm, searchRange); 
  matches = colorizeMatches(matches);
  // (dmCurrent === 'hk') || matches = convertFullTextToIAST(matches);
  displayMatches(matches);
};


}());//end of wrapper function
