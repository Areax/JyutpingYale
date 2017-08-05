var ja = angular.module('JyutpingApp', [])

ONSET_JYUTPING = ['b', 'd', 'g', 'gw', 'z', 'p', 't', 'k', 'kw', 'c', 'm', 'n',
  'ng', 'f', 'h', 's', 'l', 'w', 'j', ''
]
ONSET_YALE = ['b', 'd', 'g', 'gw', 'j', 'p', 't', 'k', 'k', 'ch', 'm', 'n',
  'ng', 'f', 'h', 's', 'l', 'w', 'y', ''
]

NUCLEUS_JYUTPING = ['aa', 'a', 'i', 'yu', 'u', 'oe', 'e', 'eo', 'o', 'm', 'ng']
NUCLEUS_YALE = ['aa', 'a', 'i', 'yu', 'u', 'eu', 'e', 'eu', 'o', 'm', 'ng']

CODA_JYUTPING = ['p', 't', 'k', 'm', 'n', 'ng', 'i', 'u', '']
CODA_YALE = ['p', 't', 'k', 'm', 'n', 'ng', 'i', 'u', '']

TONE_JYUTPING = [1,2,3,4,5,6]

vowels = ['a', 'e', 'i', 'o', 'u', 'm', 'g']
// tones get + 3 when there's an h, but maybe that shouldn't happen
tones_index = [3, 1, 0, 2, 1, 0]
yale_tones = [3,2,1,1]
vowelLetters = [
  ['a', 'e', 'i', 'o', 'u'], // tones 3 and 6
  ['á', 'é', 'í', 'ó', 'ú'], // tones 2 and 5
  ['à', 'è', 'ì', 'ò', 'ù'], // tone 4
  ['ā', 'ē', 'ī', 'ō', 'ū'] // tone 1
]
accents = [
  '', // adds nothing to letter
  '\u0301', // adds accent to a letter
  '\u0300', // adds grave to letter
  '\u0304' // adds macron to letter
]

ja.controller('JyutpingAppCtrl', function ($scope) {
  /*
    Convert *jpStr* to Yale.
    :param asList: if(True (default: False), return a list of Yale strings
    for individual syllables.
  */
  $scope.stringToJyutping = ""
  //jpStr = $scope.jpStr

  $scope.translate = function () {
    $scope.translation = jyutpingToYale($scope.stringToJyutping)
    $scope.error = YaleToJyutping($scope.translation)
  }
  $scope.translation = jyutpingToYale($scope.stringToJyutping)
  $scope.error = YaleToJyutping('gòhk')
})

function jyutpingToYale(jpSentence) {

  /*
    Parse *jpStr* as a string of Cantonese Jyutping romanization for one or
    multiple characters
    and return a list of 4-tuples, each as (onset, nucleus, coda, tone)
  */
  // check jpStr as a valid argument string
  // if (typeof(jpStr) != "string")
  //   throw Error('argument needs to be a string -- ')
  // jpStr = jpStr.toLowerCase()

  // parse jpStr as multiple jp strings

  if(jpSentence == '')
    return
  jp_list = jpSentence.split(" ")

  // // if (isNaN(jpStr.slice(-1)))
  // //   throw Error('tone error -- ')

  yaleList = []
  jp_list.forEach((jpParseable) => {
    jpParsed = ParseJyutping(jpParseable)

    onset = ONSET_YALE[ONSET_JYUTPING.indexOf(jpParsed[0])]
    nucleus = NUCLEUS_YALE[NUCLEUS_JYUTPING.indexOf(jpParsed[1])]
    coda = CODA_YALE[CODA_JYUTPING.indexOf(jpParsed[2])]
    tone = jpParsed[3] // still in ParseJyutping

    // jyutping2yale system uses "h" to mark the three low tones
    if (isStringInObject(tone, ["4", "5", "6"])) {
      lowToneH = "h"
    }
    else {
      lowToneH = ""
    }

    // in jyutping2yale, long "aa" vowel with no coda is denoted by "a"
    if (nucleus == "aa" && coda == "") {
      nucleus = "a"
    }

    // when nucleus is "yu"...
    // 1. disallow "yyu" (when onset is "y")
    // 2. change nucleus "yu" into "u" -- this is a hack for adding tone
    //       diacritic, since we don't want "y" to bear the diacritic
    if (nucleus == 'yu' && onset == 'y') {
      onset = ""
      nucleus = "u"
    }

    // when nucleus is "ng"
    // the tone diacritic has to be on "g" but not "n"
    // now we pretend that the nucleus is "g", and will prepend the "n" back
    // at the end
    if (nucleus == 'ng') {
      nucleus = 'g'
    }

    // add the jyutping2yale tone diacritic to the first nucleus letter
    // ParseJyutping tone 1      --> add macron
    // ParseJyutping tone 2 or 5 --> add acute
    // ParseJyutping tone 4      --> add grave
    // ParseJyutping tone 3 or 6 --> (no diacritic)
    // if(the accented letter doesn't exist in unicode, use the combining
    // accent instead.

    letter = nucleus.charAt(0)  // nucleus 1st letter
    nucleus = add_tone_mark_to_letter(letter, tone) + nucleus.slice(1)

    // add back "y" if(the nucleus is "yu"
    // ("y" was taken away for convenience in adding tone diacritic)
    if (jpParsed[1] == "yu") {
      nucleus = "y" + nucleus
    }

    // add back "n" if(the nucleus is "ng"
    // ('n' was taken away so that tone diacritic is on "g" but not "n")
    if (jpParsed[1] == 'ng') {
      nucleus = 'n' + nucleus
    }

    // ParseJyutping final "eu" should be jyutping2yale "ew" (not "eu")
    if (coda == "u" && nucleus == "e") {
      coda = "w"
    }

    // save the resultant jyutping2yale
    if (isStringInObject(coda, ["i", "u", "w"]) && isStringInObject(tone, ["4", "5", "6"])) {
      yale = onset + nucleus + coda + lowToneH
    }
    else {
      yale = onset + nucleus + lowToneH + coda
    }
    yaleList.push(yale)
  })


  return yaleList.join(" ")
}

function ParseJyutping(jp) {
  if (jp.length < 2)
    throw Error('jyutping string has fewer than 2 characters -- ' + jp.toString())

  tone = jp.slice(-1)
  cvc = jp.slice(0, -1)

  // tone
  if (!TONE_JYUTPING.includes(parseInt(tone)))
    throw Error('tone error -- ' + jp.toString())

  // coda
  if (!isStringInObject(cvc.slice(-1), 'ieaouptkmng'))
    throw Error('coda error -- ' + jp.toString())
  else if (isStringInObject(cvc, CODA_JYUTPING)) {
    return ['', cvc, '', tone]
  }
  else if (isStringInObject(cvc.slice(-2), CODA_JYUTPING)) {
    coda = cvc.slice(-2)
    cv = cvc.slice(0, -2)
  }
  else if (isStringInObject(cvc.slice(-1), 'ptkmn') ||
    ((cvc.charAt(cvc.length-1) == 'i') && (isStringInObject(cvc.charAt(cvc.length-2), 'eaou'))) ||
    ((cvc.charAt(cvc.length-1) == 'u') && (isStringInObject(cvc.charAt(cvc.length-2), 'ieao')))) {
    coda = cvc.slice(-1)
    cv = cvc.slice(0, -1)
  }
  else {
    coda = ''
    cv = cvc
  }

  // nucleus, and then onset
  nucleus = ''

  while (isStringInObject(cv.slice(-1), 'ieaouy')) {
    nucleus = cv.slice(-1) + nucleus
    cv = cv.slice(0, -1)
    if (!cv)
      break
  }

  if (!nucleus)
    throw Error('nucleus error -- ' + jp.toString())

  onset = cv

  if (!ONSET_JYUTPING.includes(onset))
    throw Error('onset error -- ' + jp.toString())
    console.log([onset, nucleus, coda, tone])
  return [onset, nucleus, coda, tone]
}

function isStringInObject(string, object) {
  return object.indexOf(string) > -1
}

function YaleToJyutping(yaleSentence) {

  if(yaleSentence == '')
    return
  yale_list = yaleSentence.split(" ")

  // // if (isNaN(jpStr.slice(-1)))
  // //   throw Error('tone error -- ')

  jyutpingList = []
  yale_list.forEach((yaleParseable) => {
    yaleParsed = ParseYale(yaleParseable)

    onset = ONSET_JYUTPING[ONSET_YALE.indexOf(yaleParsed[0])]
    nucleus = NUCLEUS_JYUTPING[NUCLEUS_YALE.indexOf(yaleParsed[1])]
    coda = CODA_JYUTPING[CODA_YALE.indexOf(yaleParsed[2])]
    tone = yaleParsed[3] // still in ParseJyutping

    //remove diacritic from nucleus
  //onset and coda should be ok ...?
  //tone is set :)

  // jyutping2yale system uses "h" to mark the three low tones
    if (isStringInObject(tone, ["4", "5", "6"])) {
      lowToneH = "h"
    }
    else {
      lowToneH = ""
    }

    // in jyutping2yale, long "aa" vowel with no coda is denoted by "a"
    if (nucleus == "a" && coda == "") {
      nucleus = "aa"
    }

    // amibguity between eo and oe being replaced by eu
    // oe oeng oek, eoi eon eot
    if((coda === 'i' || coda === 'n' || coda ==='t') && nucleus === 'oe') {
      nucleus = 'eo'
    }

    //nucleus = NUCLEUS_YALE[NUCLEUS_JYUTPING.indexOf(jpParsed[1])]
    //coda = CODA_YALE[CODA_JYUTPING.indexOf(jpParsed[2])]

    // when nucleus is "yu"...
    // 1. disallow "yyu" (when onset is "y")
    // 2. change nucleus "yu" into "u" -- this is a hack for adding tone
    //       diacritic, since we don't want "y" to bear the diacritic
    if (nucleus == 'u' && onset == 'y') {
      onset = 'j'
      nucleus = 'yu'
    }

    // ParseJyutping final "eu" should be jyutping2yale "ew" (not "eu")
    if (coda == "w" && nucleus == "e") {
      coda = "e"
    }

    // save the resultant jyutping2yale {
    jyutping = onset + nucleus + coda + tone
    jyutpingList.push(jyutping)
  })
  return jyutpingList.join(' ')
}

function ParseYale(yale) {
  if (yale.length < 2)
    throw Error('jale string has fewer than 2 characters -- ' + yale.toString())

  x = getToneFromYaleWord(yale)
  cvc = x[0]
  tone = x[1]

  //cvc = yale.slice(0, -1)
  // tone
  if (!TONE_JYUTPING.includes(tone))
    throw Error('tone error -- ' + yale.toString())

  // coda
  if (!isStringInObject(cvc.slice(-1), 'ieaouptkmng'))
    throw Error('coda error -- ' + yale.toString())

  else if (isStringInObject(cvc, CODA_YALE)) {
    return ['', cvc, '', tone]
  }
  else if (isStringInObject(cvc.slice(-2), CODA_YALE)) {
    coda = cvc.slice(-2)
    cv = cvc.slice(0, -2)
  }
  // else if (CODA_JYUTPING.indexOf(cvc.slice(-1)) > -1) {
  //   coda = cvc.slice(-1)
  //   cv = cvc.slice(0, -1)
  // }
  else if (isStringInObject(cvc.slice(-1), 'ptkmn') ||
    ((cvc.charAt(cvc.length-1) == 'i') && (isStringInObject(cvc.charAt(cvc.length-2), 'eaou'))) ||
    ((cvc.charAt(cvc.length-1) == 'u') && (isStringInObject(cvc.charAt(cvc.length-2), 'ieao')))) {
    coda = cvc.slice(-1)
    cv = cvc.slice(0, -1)
  }
  else {
    coda = ''
    cv = cvc
  }

  // nucleus, and then onset
  nucleus = ''

  while (isStringInObject(cv.slice(-1), 'ieaou')) {
    nucleus = cv.slice(-1) + nucleus
    cv = cv.slice(0, -1)
    if (!cv)
      break
  }

  if (!nucleus)
    throw Error('nucleus error -- ' + yale.toString())

  onset = cv

  if (!ONSET_YALE.includes(onset))
    throw Error('onset error -- ' + yale.toString())

  return [onset, nucleus, coda, tone]
}

function isStringInObject(string, object) {
  return object.indexOf(string) > -1
}

function parse_final(final) {
  // Parse *final* as (nucleus, coda).
  for (i in range(1, len(final) + 1)) {
    possible_nucleus = final.slice(0, i)
    possible_coda = final.slice(i)

    if (NUCLEUS_JYUTPING.includes(possible_nucleus) && CODA_JYUTPING.includes(possible_coda))
      return possible_nucleus, possible_coda
  }
  return None
}

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function vowel_to_macron_vowel(vowel, tone) {
  return vowelLetters[tones_index[tone - 1]][vowels.indexOf(vowel)]
}

function add_tone_mark_to_letter(letter, tone) {
  return letter + accents[tones_index[tone-1]]
}

function getToneFromYaleWord(yaleWord) {
  regex = new RegExp('[^\u00E0-\u016B' + accents.join('') + ']+([\u00E0-\u016B' + accents.join('') + ']).*')
  accent = yaleWord.replace(regex, '$1')
  if(accent.length > 1)
    accent = ''
  hasAnH = isStringInObject('h', yaleWord.slice(yaleWord.indexOf(accent)+1, yaleWord.length)) ? 3 : 0
  if(hasAnH == 3)
    yaleWord = yaleWord.replace(/(.+)h([^h]*)$/, '$1$2')

  for(i = 0; i < vowelLetters.length; i++) {
    if(isStringInObject(accent, accents[i])) {
      return [yaleWord.replace(accent, ""), yale_tones[i] + hasAnH]
    }
  }
}

/* write tests
>>> jyutping('m4')
    ('', 'm', '', '4')
    >>> jyutping('ng4')
    ('', 'ng', '', '4')
    >>> jyutping('jit6')
    ('j', 'i', 't', '6')
    >>> jyutping('uk1')
    ('', 'u', 'k', '1')
    >>> jyutping('aa3')
    ('', 'aa', '', '3')
    >>> jyutping('aak1')
    ('', 'aa', 'k', '1')
    >>> jyutping('i1')
    ('', 'i', '', '1')
    >>> jyutping('wu4')
    ('w', 'u', '', '4')
    >>> jyutping('saa2')
    ('s', 'aa', '', '2')
    >>> jyutping('saan2')
    ('s', 'aa', 'n', '2')
    >>> jyutping('saang1')
    ('s', 'aa', 'ng', '1')
    >>> jyutping('sung3')
    ('s', 'u', 'ng', '3')
    >>> jyutping('sau2')
    ('s', 'a', 'u', '2')
    >>> jyutping('saau2')
    ('s', 'aa', 'u', '2')
    >>> jyutping('gui6')
    ('g', 'u', 'i', '6')
    >>> jyutping('jyut6')
    ('j', 'yu', 't', '6')
    >>> jyutping(123)
    Traceback (most recent call last):
    JyutpingError: 'argument needs to be a string -- 123'
    >>> jyutping('jit')
    Traceback (most recent call last):
    JyutpingError: "tone error -- 'jit'"
    >>> jyutping('jit7')
    Traceback (most recent call last):
    JyutpingError: "tone error -- 'jit7'"
    >>> jyutping('jix6')
    Traceback (most recent call last):
    JyutpingError: "coda error -- 'jix6'"
    >>> jyutping('jxt6')
    Traceback (most recent call last):
    JyutpingError: "nucleus error -- 'jxt6'"
    >>> jyutping('fjit6')
    Traceback (most recent call last):
    JyutpingError: "onset error -- 'fjit6'"
    """
    */