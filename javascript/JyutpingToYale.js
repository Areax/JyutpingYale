var ja = angular.module('JyutpingApp', [])



ONSET = ['b', 'd', 'g', 'gw', 'z', 'p', 't', 'k', 'kw', 'c', 'm', 'n',
  'ng', 'f', 'h', 's', 'l', 'w', 'j', '']

NUCLEUS = ['aa', 'a', 'i', 'yu', 'u', 'oe', 'e', 'eo', 'o', 'm', 'ng']

CODA = ['p', 't', 'k', 'm', 'n', 'ng', 'i', 'u', '']

TONE = ['1', '2', '3', '4', '5', '6']

ONSET_TIPA = {
  'b': 'p',
  'd': 't',
  'g': 'k',
  'gw': 'k\\super w ',
  'z': 'ts',
  'p': 'p\\super h ',
  't': 't\\super h ',
  'k': 'k\\super h ',
  'kw': 'k\\super w\\super h ',
  'c': 'ts\\super h ',
  'm': 'm',
  'n': 'n',
  'ng': 'N',
  'f': 'f',
  'h': 'h',
  's': 's',
  'l': 'l',
  'w': 'w',
  'j': 'j',
  '': '',
}

FINAL_TIPA = {
  'i': 'i',
  'ip': 'ip\\textcorner ',
  'it': 'it\\textcorner ',
  'ik': 'Ik\\textcorner ',
  'im': 'im',
  'in': 'in',
  'ing': 'IN',
  'iu': 'iu',
  'yu': 'y',
  'yut': 'yt\\textcorner ',
  'yun': 'yn',
  'u': 'u',
  'ut': 'ut\\textcorner ',
  'uk': 'Uk\\textcorner ',
  'un': 'un',
  'ung': 'UN',
  'ui': 'uY',
  'e': 'E',
  'ek': 'Ek\\textcorner ',
  'eng': 'EN',
  'ei': 'eI',
  'eot': '8t\\textcorner ',
  'eon': '8n',
  'eoi': '8Y',
  'oe': '\\oe ',
  'oek': '\\oe k\\textcorner ',
  'oeng': '\\oe N',
  'o': 'O',
  'ot': 'Ot\\textcorner ',
  'ok': 'Ok\\textcorner ',
  'on': 'On',
  'ong': 'ON',
  'oi': 'OY',
  'ou': 'ou',
  'ap': '5p\\textcorner ',
  'at': '5t\\textcorner ',
  'ak': '5k\\textcorner ',
  'am': '5m',
  'an': '5n',
  'ang': '5N',
  'ai': '5I',
  'au': '5u',
  'aa': 'a',
  'aap': 'ap\\textcorner ',
  'aat': 'at\\textcorner ',
  'aak': 'ak\\textcorner ',
  'aam': 'am',
  'aan': 'an',
  'aang': 'aN',
  'aai': 'aI',
  'aau': 'au',
  'm': '\\s{m}',
  'ng': '\\s{N}',
}

TONE_TIPA = {
  '1': '55',
  '2': '25',
  '3': '33',
  '4': '21',
  '5': '23',
  '6': '22',
}

// FINAL = set(FINAL_TIPA.keys())

ONSET_YALE = {
  'b': 'b',
  'd': 'd',
  'g': 'g',
  'gw': 'gw',
  'z': 'j',
  'p': 'p',
  't': 't',
  'k': 'k',
  'kw': 'k',
  'c': 'ch',
  'm': 'm',
  'n': 'n',
  'ng': 'ng',
  'f': 'f',
  'h': 'h',
  's': 's',
  'l': 'l',
  'w': 'w',
  'j': 'y',
  '': '',
}

NUCLEUS_YALE = {
  'aa': 'aa',
  'a': 'a',
  'i': 'i',
  'yu': 'yu',
  'u': 'u',
  'oe': 'eu',
  'e': 'e',
  'eo': 'eu',
  'o': 'o',
  'm': 'm',
  'ng': 'ng',
}

CODA_YALE = {
  'p': 'p',
  't': 't',
  'k': 'k',
  'm': 'm',
  'n': 'n',
  'ng': 'ng',
  'i': 'i',
  'u': 'u',
  '': '',
}
vowels = ['a', 'e', 'i', 'o', 'u']

tones_index = ['3', '1', '0', '2', '1', '0']

vowelLetters = [
  ['a', 'e', 'i', 'o', 'u'], // tones 3 and 6
  ['á', 'é', 'í', 'ó', 'ú'], // tones 2 and 5
  ['à', 'è', 'ì', 'ò', 'ù'], // tone 4
  ['ā', 'ē', 'ī', 'ō', 'ū'] // tone 1
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
  }

  $scope.translation = jyutpingToYale($scope.stringToJyutping)


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

    onset = ONSET_YALE[jpParsed[0]]
    nucleus = NUCLEUS_YALE[jpParsed[1]]
    coda = CODA_YALE[jpParsed[2]]
    tone = jpParsed[3]  // still in ParseJyutping

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
    if (nucleus == "yu") {
      if (onset == "y") {
        onset = ""
        nucleus = "u"
      }
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
    nucleus = vowel_to_macron_vowel(letter, tone) + nucleus.slice(1)
    
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
  // Output yaleList as a string
  // Check if(there's potential ambiguity when Yale strings are concatenated

  // Ambiguity case 1:
  //   1st syllable coda is one of the "ambiguousConsonants"
  //   and 2nd syllable starts with a vowel *letter*

  // Ambiguity case 2:
  //   1st syllable has no coda and 2nd syllable starts with one of the
  //   "ambiguousConsonants"
  //   e.g., hei3hau6 'climate' --> heihauh
  //   (middle "h" for tone in 1st syllable or being onset of 2nd syllable?)

  if (len(yaleList) == 1) {
    return yaleList[0]
  }

  ambiguousConsonants = ['h', 'p', 't', 'k', 'm', 'n', 'ng']
  vowelLetters = ['a', 'e', 'i', 'o', 'u',
    'á', 'é', 'í', 'ó', 'ú',
    'à', 'è', 'ì', 'ò', 'ù',
    'ā', 'ē', 'ī', 'ō', 'ū']

  outputStr = ''

  for (i in range(len(yaleList) - 1)) {
    yale1 = yaleList[i]
    yale2 = yaleList[i + 1]

    ambiguous = False

    // test case 1:
    if (endswithoneof(yale1, ambiguousConsonants) &&
      startswithoneof(yale2, vowelLetters)) {
      ambiguous = True
    }

    // test case 2:
    if (!ambiguous &&
      !endswithoneof(yale1, ambiguousConsonants) &&
      !startswithoneof(yale2, ambiguousConsonants)) {
      ambiguous = True
    }

    outputStr += yale1

    if (ambiguous) {
      outputStr += '\''
    }
  }

  outputStr += yaleList[-1]

  return outputStr
}

function ParseJyutping(jp) {
  if (jp.length < 2)
    throw Error('jyutping string has fewer than 2 characters -- ' + jp.toString())

  tone = jp.slice(-1)
  cvc = jp.slice(0, -1)

  // tone
  if (!TONE.includes(tone))
    throw Error('tone error -- ' + jp.toString())

  // coda
  if (!isStringInObject(cvc.slice(-1), 'ieaouptkmng'))
    throw Error('coda error -- ' + jp.toString())

  else if (isStringInObject(cvc, CODA)) {
    jpParsedList.push(['', cvc, '', tone])
    return
  }
  else if (isStringInObject(cvc.slice(-2), CODA)) {
    coda = cvc.slice(-2)
    cv = cvc.slice(0, -2)
  }
  // else if (CODA.indexOf(cvc.slice(-1)) > -1) {
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
  // right now AU can both be in here, when it shouldn't...
  while (isStringInObject(cv.slice(-1), 'ieaouy')) {
    nucleus = cv.slice(-1) + nucleus
    cv = cv.slice(0, -1)
    if (!cv)
      break
  }

  if (!nucleus)
    throw Error('nucleus error -- ' + jp.toString())

  onset = cv

  if (!ONSET.includes(onset))
    throw Error('onset error -- ' + jp.toString())

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

    if (NUCLEUS.includes(possible_nucleus) && CODA.includes(possible_coda))
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