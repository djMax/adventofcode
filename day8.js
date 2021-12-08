const uniqueSegments = {
  2: 1,
  4: 4,
  3: 7,
  7: 8,
};

const test = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

function countUniqueOutputDigits(input) {
  return input.split('\n').reduce((acc, line) => {
    const [allInputs, allOutputs] = line.split(' | ');
    const outputs = allOutputs.split(' ');
    return acc + outputs.reduce((acc2, output) => { if (uniqueSegments[output.trim().length]) { return acc2 + 1; } return acc2; }, 0);
  }, 0);
}

if (countUniqueOutputDigits(test) !== 26) {
  throw new Error('Part 1 Test failed');
}

function unionCount(strA, strB) {
  return strA.split('').reduce((acc, letter) => {
    if (strB.includes(letter)) {
      return acc + 1;
    }
    return acc;
  }, 0);
}

function mapLetters(inputs) {
  const canonical = inputs.map(input => input.split('').sort().join(''));
  const frequency = {};
  inputs.forEach(input => input.split('').forEach(letter => frequency[letter] = (frequency[letter] || 0) + 1));
  const map = {};
  const inverseMap = {};
  canonical.forEach((input) => {
    if (uniqueSegments[input.length]) {
      map[input] = uniqueSegments[input.length];
      inverseMap[uniqueSegments[input.length]] = input;
    }
  });
  canonical.forEach((input) => {
    if (!uniqueSegments[input.length]) {
      switch (input.length) {
        case 6:
          // Either 0, 6, or 9
          if (unionCount(input, inverseMap[1]) === 1) {
            map[input] = 6;
          } else if (unionCount(input, inverseMap[4]) === 3) {
            map[input] = 0;
          } else {
            map[input] = 9;
          }
          break;
        case 5:
          // Either 2, 3, or 5
          if (unionCount(input, inverseMap[1]) === 2) {
            map[input] = 3;
          } else if (unionCount(input, inverseMap[4]) === 2) {
            map[input] = 2;
          } else {
            map[input] = 5;
          }
          break;
        default:
          throw new Error('Unhandled case');
      }
    }
  });
  return map;
}

function decode(input) {
  return input.split('\n').reduce((acc, line) => {
    const [allInputs, allOutputs] = line.split(' | ');
    const inputs = allInputs.split(' ');
    const map = mapLetters(inputs);
    const outputs = allOutputs.split(' ').map(input => input.split('').sort().join(''));
    const decoded = outputs.reduce((str, inputStr) => `${str}${map[inputStr]}`, '');
    return acc + Number(decoded);
  }, 0);
}

if (decode(`acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`) !== 5353) {
  throw new Error('Part 2 Test failed');
}

const input = `bfdcga cgdfe egfda cbfeda ec efc gcfbd ebcg gdfbec adcgfeb | bgdfc ec dfgae gefcd
cafgbd bc gfdbae eacfb cbf debaf cdgefba fecag fbcdae ecbd | cdfabg cb adgfcb bface
afg daecgf aefbgdc fbge fg dabfg efabgd cbadge abcfd gbaed | acbdf egbda adbge fg
cbeafg fadce cdeabfg gbdefc ged ebcgf bfgd dg ecdgf bgedac | fgdb afcbeg gcfeba edg
efd aegdb efgdcb bafcd acef dfaeb ef fgbadec cadfgb bfecda | fedgcb begcfd def gfdbac
badce gbcda gad fgdc acbgf cfbage gcfbad gd dbafeg afcbged | ebdfag dfcbag gd fdeagb
gdbcaf da dcbeg cad edcbfg gdea baedc afbec baegdc gbfaedc | gbdcaf dbgec da gaed
bedga agbefd dbgfca gcafdbe begcdf gdabf abegc deb ed adef | bgade gacbe ebd cbefdg
eg edfcab gfde abedf fbgdea bgcad gefcba agbed ebg eafbcgd | ge fbdeca bdcfega cgadb
dgbaecf fegbd de fbgade fde gecfb ebda dbgfa dfegca dfagbc | afcegd fgdabce de efgdac
dgafe deafbg gdecbfa fgcad beagd gfbcae efa dbfe ef dcgeba | gafedb debacg ef dfbe
gbadcf bcade efdgbac bcf acebf bf egcfa ebdf acbgde cdabfe | fbcea eafcg fcbea dcbafge
dcfbge ecdabg gfbdae afecb cbg cbgae gacedbf gadc cg bedag | bgdae becga bdcgfe ebcgda
bde eb cgbfade cdgbef beag gabdf dafeb cadfe agdfcb eadgfb | begfdc dfbcga abfdg edagbf
dcbgea fced cgeaf cfaged gdeac dgbfca fc badgfce cfg egbfa | fbcdag feagb cdef fcg
gfdbc adebcg cbg dfcaeb cg bcaefdg bdgfec bdagf dcfeb egcf | fbgda aedfcb cfgbde defgcb
daf cagfeb adeg dcbef cdgbaf da efcag fbdegca ecafd dcaegf | da bgeafc bgdfac ecgdaf
gfdaeb gfde agebf bgf fg bgcfad afbde fdaecb dbeacfg eabcg | gecab baedf eadfb gcbdfa
bagcfed eafb acfgd cebdfg ead agbdef baedcg egfbd agefd ea | gacfd bgfed fgdae bfdeg
cgfab adcfebg cgdef eabc feagbd ebcfg feb eb bdfcga gbcfae | defgc bdcafg fgdec cegbf
cdfab gdf cfebg decbaf gd dcgbaf gcbfd cgad egdbaf badcfeg | gfcbd gd cbgfe ecbafd
faebd ba efacgd baedcf adcef abf dcfbgae dbac gdbfe begcaf | dcab dafec fecadg ebdfa
dfceab egbadcf ba fdcbg feba cgdfae dbegac abdfc cba ecfad | defacg dgbcf gbdcf efcdbga
cadgb bedg fgaceb eacbgd egbac cefadg gd cafdb eabgdfc gad | afgdce adcgb gbacd adg
acb adcgf adcfeb baedg cb becagd bfcadge abcdg ebgc gfdeba | gdafc acfdeb cb aebgd
fabcgd fcdgae facde bcafeg da geda gcebadf befcd eagfc adf | cfage fgeac fgdbaec fgeac
bafeg fabcdg efdgabc fgdbea gdae ae dgafb bae ebgcf fcadbe | begcf abgfe aegbf efbadc
fdeca cadegbf gce bafdge abcdeg dcgb ebcfga cg deagb dagce | bdeag aebdgf gce dbage
fcgbde cdgaebf dgbaef fed bade ed adfgb efdag fdabcg agefc | gfdab adbcfg gcfae dfagb
ebdgfc febad adbfc fc bdfcea badfge cfb eafc acdgb egcfdba | acbgd bgfead dfabc fcea
eb ebaf cbdgef gaedb afgebdc febdag dgefac agbcd beg deagf | dgfcea efabdg egabd geafd
cedfba efgbd gfbdac gfaecd bfa gdfba bcag ab cgdfa begdafc | dfbace dfgeb eafcdbg dfcag
cfdbge gdbefac dabf dgbcfa gacdf gebca fb agefdc bcgaf fbc | afbd gbcafed acgeb ebgfdc
fgbec fbgcd fdbaceg gafedc bfacge fge eafb agbced cbgea fe | abgce fadegc ebacg fagecd
bdgec bgecfa fcbed debfcg acebfd gcb adbecgf gb aegcd gbdf | ebgfdc geacbfd gcb gb
fbea bdfcag dceabg egfcd edcfbga abdge af adf dfbage egfad | fa deacgb agfdbce ebdag
abdecfg gbacf fdbcge gfd dg gdafbc adgb acfde fadgc fbeagc | dcgebf dacgf agfbc cdagbf
agcefd ged bdfagc ed ebdgf fcdbge dgfbc abegf cdfegab debc | cagdfe ged cgdafb bafdcg
cebgad fdgea abgf fdbcae af baedg dgfeba dfbagce edgfc fea | dabegcf agdbe afe acfedb
agdfe fedbcga gfedbc agcbe edb db fdba edbgaf gedafc abdeg | cdgabfe afegbd fegbcd eafgd
dea abgdfe edgfbac egdab de cadbef adfbg gbcea gfde dabgfc | cdafeb ed bafgde ed
adgfb cdgefa ea fea bcdef cfagbd fgecabd febda agbe fgabed | cdefb gbea bdacfg dcbef
cadbg ea fdgeab afcedg dae ebcfdga cdfge afec dbfgce ceagd | fbeacdg dgcab bgdca dae
ecdbfg caebd fcgde fgda aefbcg afedc fcabegd aef gcdaef af | ecdfa bdecfg fea dgcfbea
dbcagf afgec fcadb ead daefc dbcgae edfb cagbdfe fcdbae de | egdabc fdagbc cgafbd afdec
dgfabe egdcbfa beacdg dbcfg aefc cdbaf fbadec fa aedbc fab | eacf bcdfg efca ecbad
defbgc gbdef cg edgc egbadfc cbgef gafdeb gcf eacbf gbfdca | fbedg decg cgf egfcb
cfdgae abdgf gbcd cfdaeb afebcgd cafgd bdf bcfgad db gefba | egfba decgfa abfeg eafdcg
dfagb gdbface adefbc gbfae gae begc acebgf fdgeca ge cefba | cgefab dfgace fecagd beadfc
fedacgb ed cabdfg bfgade dbaefc gdfba def gead bgcfe bdfeg | adcefb gdbaf egad caebdf
agfbed ecfbg cdge cgb fcgbde ebcaf adfbcg dcegabf cg efdgb | bdfcga bfeadg ecgfb cg
bec becfdag bgcaf eb debf adcef cefba fbcade acbged fcadge | edacfb fdeca fgabc cgafb
bfcae gabc fegcdb adefgbc bcgfae gfb fbgea fdabec adgfe bg | dfcgeb fgbae fgb bedgfc
afedcbg ed dfagc gefcd dec agbdec bfecg gfedca efad dfabcg | edaf dec begadc dfagbc
cgebd befcadg ecg ec fcde dbfgc fgdabc becfga aegbd bfcged | cbgafd bcgfd fedc gfdbec
dfabeg acfebd bgfcde begfd bcagd cdafgbe gabed aeb fgae ea | gbedf gdebfa bfegcd bgefd
gdf dagec gf cfdbega cfdba edbcga ceadfg fcdag aegf cdbfge | eafg fgd dfg bdegcf
bcfae fabge cdegabf cdae ebc dfcba ecbdfg ce dagcfb fbedca | fdagcb bcedfa fceabdg adce
cgbaf ad fgcadeb cbfdae fbgdac bgda egdfc cefbag adc fcadg | cfdgbae adc ecafgb dgabfc
bafdc cfb cf abcfged acdbge dbgca aefdb afcg afcdgb gbefdc | dabfc cagf efbcgd abecdgf
de abgefdc fbed adbcgf gaecf eda aebdgf adbecg fegda bfagd | feagbd dbgfac ade adgfe
gacefb faebcgd decfgb fa abdgfe afb fdbge dacbg adfgb edfa | dgbac abcgd gbadc adbgf
fbadg fgbde fagebd agbcf gad gfcbed abde da cbdfaeg afegdc | ecfbdg agd efdgcba aefbdg
cbdge gfecd cfe cafgd dbfe fe bgefdca gedfcb gebfac dgbcea | dgecb bagcfde gecbaf gacbef
dfgecb agbfe dbeacf ebcdf cbad cadfbeg ca cfa abcef edfcga | afgdbce cabd fcbdae becaf
abcd fbade befdcag da fecdag ecfdab bgfced bfedc dae gbaef | da ebfdc cabd cfedbg
ecdab cfaged cbfd cfebad begda agbfce fecba cd acd fedcbga | cfdage daecb febca ebacf
fcdageb beadf dag dacfbg bacge deabg dfcabe gdbaef degf gd | bafcdg dgafbc bdaef gd
febcg cefbagd fegdbc bfeac ab gcba bfa fdbega cedfa cgfeab | eagbcf cbgef afb fcgbae
egfac acbdge fadcbg bgcedfa bdcafe bf ecadb fdeb fecba bfc | fgdcabe dcbfga aegcf fbcadeg
gcfebd acdgb faedcb gcdfb fd gdfe fcgbe fgacdeb baefcg dbf | cgfdb bgdcf gabcd edcbgf
aced fbacg adbcf cd fbade cdb decfbg faegdcb gedabf ecdfba | bdfae fdgcbae fdbgec fdecgb
gdbeac dfcaeb afbgecd dbcgf af fbacg cegbfa fba cagbe geaf | fgbdcae eabcg caebg afeg
ebfda dgfbe ae fcbgead deafgc fdbac eaf gaeb ecdbgf ebfgad | baedf debgfca efcbdg ea
dgcfe acbef cgaef fbdgace ecafbd gcebfa ga age gdfeba bgac | adfbce ga cegfa abcg
abcgd facd fag eacfbg gafdb fa bgfacd dcgeba befgd efgacbd | bdcegfa gbdaf cbgda egabcfd
bdefcga aecbg cgde agbed ecabfg dgb befda gcadbe gdbcfa dg | acgdeb dgb bfaed adbeg
cefgb bde adgceb dafgebc aefd debgaf gfedb agfdb de cgdfba | defa edbgf afbdg bgfad
fa caefg egcab fca gdbcea abef bceagdf dcfge acgfdb afbgec | abfe faebcg acgef geacf
cbfed egacdb eabfgd gdbac deacgfb aeb eacdb gacfbd ea cage | dbegacf aecdbg cage dcgbae
efgad agedcbf bcea ba ebdcfg efbcag bgaef gfabcd bga gfbce | fgdae ba fedgbc egfba
dbcfa bcagd gdbfae cdfg fecab bcfadg dcbgae dfb fd bcadfeg | daegbc befca cbfae dbgcae
egfa bcgdafe dcfea dcfeba cafgbd gf edgbc gfd egfdc edcgaf | gf dgafce fdg efcbda
fgecd afgcde gfcadeb dbcg dcfbeg facbe gbf gfbec gdeafb gb | abdgfe cegdf bgf ecgfbad
gdcbafe gaf agcfe bafc gfdcbe gbfdea cfegb gaedc gfbace fa | bfeacg acgfe bcaf gcade
egbcf fgcea decbf dgabef gb fabedc fbecdag fgdbec bcdg beg | bgdfaec acgdbfe defbca fcdeb
bdeafc cabegd acdbe fdba cfb bf edcfagb fecag cbafe bcfgde | bfda fdgaebc dbaec fb
bc ebdcg agcfebd cadeg ecb fdbaec befgd cbdgfe gabfed bgfc | dagbef bcgdfe bgedaf gdace
eb ebf gaedfc fagdb cabe fabecg bagef bdgafce cgdefb efcga | beacfgd efgbca efbgca ebfgac
cagdf gdacef fcdbga cb gcadb bgc fcab dbfcage baged gbdecf | aefcdg cb agdfc bdgfec
dfbaec abegdf daf edbgcaf bgfd eafgc gafed fd bedag gebdca | ecfgbda beafdgc facebd bdeag
bfaegd dbecga fcadbg dcfg dabcg gf acbfe fgbca fga aegdfcb | cegbda ecabdgf egcafdb fgcd
dbgcea agc aegbc fgceda abdfce cbdg begaf adbcefg cbade gc | dfecba gbedac cdfeab abecg
cfdeab fgbec eadg bga ga dcebagf beadgc gaebc bgfdca bcead | bgaced bdeacg cbgea beacgdf
bagfce ebcdfg fa cgade cfa bfcgeda ecbdf adfb fecbad efadc | ecdbf cfa bfceag bdfeac
af egdaf aef eacdg fdgeca cafg cdgfabe baedgc edfbg acbdef | edfga decagb bdecfa dacfge
dab gfbed bfdage ebdcgf baecg da dfacbeg eagbd beacfd gadf | egbda cbdfae cfadeb egabfd
bcgfaed bfgade bd gfcda acgedb bacefg caebg cbed abdcg bdg | cebag fcebag dbcaeg gbd
dgcfb begdf def fbaegd fegab ed cebagf cefdgab cebdfa gade | ebgdacf aefbgd de gfdbae
ab abdf agbcde aegfb eafgc fgcdeb fbged bea bgafced efdbga | gbafe gbafed gaefdcb gdfbec
eafbg abgdf eg aceg gabfce fge fcbedg ecfabd bafdceg caebf | cedbfa gbface eg fagbe
face bfe adgfeb acebg cdbfg fe gacbdfe gcaedb cgebf cgaefb | aefc gdbcf gecab gfcbd
agfecd fa gbfa fbdce gdfeacb dabfe fbadeg bgdaec begad afd | fda bdefc egadbf fa
ab bfedcg gfdcb deacg abdfce gcabd adcgfb eabfcdg abc abgf | decga debfac fcbdg gecdbaf
gfadcb dcgab abfgde fdcega acd adbgf cgdeb ac acfb befdcag | dbagf ca gdcfab gaebcdf
efcagd dbcef bgda gbf dfaegb cfegab bfged bg agcfbde afegd | bfagce cefdb fgeda aegfcd
cedafgb cbfeda bcegf gdbe gb fcgbad cedbgf gcaef bgf cefdb | ceagf dbfcge afdcbe ebdfgc
cgfed acfge bdecaf fdag fecgad fedgbc bacge af efa afegcbd | cgadbef gbdecf fgced fa
abegf fagcde ceb feabc ecfda cb acdb efcgdab cbgdfe ecadbf | eafcb ceb cadb bdeafc
fbgae begd abcfegd bfeda efd eagfdb de fgaecb acgdef dacbf | dagfce adefb bdfac dfegab
fd fed fgad dfecag gaedbfc gecafb bdceg cbdafe efcgd fcega | agfd dgaf gdafce eafcdb
befagd dfeb bf caebdg ebgda egfcba bgf gcadf gafbd fabgdec | agdefb eagcfb edacbg badfg
eagcd bdacgf gfeb fdgba be deb cefagdb afcdbe bdgae aegbfd | cfbgad dbage eb bgeadf
eacbfg debgac dbfcage dc eagbc cda cabdfe dfgea bgdc adegc | becag efbacg caebg cdgae
fed fcbagd acdebf gaef ef fgdec fecbagd dcegaf cbdeg agcfd | bdeacfg ef cadgf dcbeg
efc becdag afedc edgaf fc badgcfe fcdbge adfcbe cafb eabdc | dfebca acbed fc efacd
abfed dc fdcegb cgbfe cagfeb fdecb gbcadfe bgadcf gcde cdf | gecafb fbegdc febcdg cegafb
feagc daecfbg gdca dg fgd fdgec cebdf eagcfb efcgda fbdeag | defagb aedbfg gfd faegbc
cagdf ce bcegdf dbafeg cbeadf gbdaefc caeb cfe feadb efadc | ecba dcfae ec ce
fgabd abgdc dbcae cfadge cag cbge cg ebcadg cgfdeba fcbeda | dgabce dacegf baecd cfabed
efagc fdcgea geb bfdgec cgba fdcbgae adbfe bg bfcaeg fgeba | afegb daebf ceagdf agbc
ecgfbad ceg deca gbfed bagfdc cegfba cabdg ec agcdbe bdegc | agbcd ecbdg bcadg dcagb
aedbg bedca efbdag dgcb bfeac efgadc abegdc bfdegca cd edc | cbdae edcgfba ecd fdagbe
cfeagbd cfab bgc fbgdae fgdce gfadb bc ecadgb bcdfga gdbcf | cbfa cbadgf bfcdg abcf
edacg cdfbag fbeagdc cdgaef fc bagfe fac edabgc defc gcefa | dagcfb aegcf fc fegac
gfdabc dbgaef agbe cegadfb bdgaf gedafc fbced ge gfe befdg | dfcbga adbfge bdfeg cfadge
bcafge gbcd bc bfgdea cafdb fabdg acfdbg acefdgb acfde bfc | bfdac cbf fdabc edfca
gdcab cegd ebdcfga egb eg afceb cdgbfa acbge gdebaf bgcdea | agbce fceab dagfbe acebg
bagc cgf bacfd begfdc afdge bcagdf bcedfa cg becgafd dgfac | bdacf cfedab abcefd cafbd
ca cag gbfdc cadfbg eafcdg afcb edgab dgcbef cbgad abfdgce | cdbga bacf fgdace dcfgb
dcebf aefcbd gdcf fcbgde cbgef beacg gfebda gf fcdbgae feg | bfcadge cfbeg fg becgf
dcabfeg fbc cfgba dfabgc becadg fc dgebcf cfad cbagd gbeaf | ecadbg degabc aecbgd cf
cba efabd ebdcga cgeafbd cdabf fbce dbfcae bc cgdfa egbafd | abedf facdg ebcf cb
db efdcag dabf cagfdbe caegb decba bfcdeg fcabed fedca bde | edfacb adefc dbe dbe
fdabg efca bac ca fdacb becafdg fcdbe bcegad begdfc afbdce | gecdbf faec fadcb dbcaf
eg egad egfbadc bdecf feg agfcbe decfag dfceg cfgda cfbadg | fcabdg gef eg fecadg
fgad bgfde afe acebd dgfcbe af beadf ecabgf fbcedga abefgd | cbdegf edfab fegacb fa
efcgb beacfg gbecfda bfac afg dbfgce bfgdea fagce caedg af | gcebf aedfbg eafcbg fabecgd
bfdecga gaedfc ecga begcfd cfdab gbfade efa caedf ae defcg | daecf egca afcdeg caefd
decab efa dagefbc dagbce fcadg abdegf fe eafdc ebcf dcfabe | ebcf fe ebcf fae
begfd agedfc dabfce eadgf adf eacgfb afecbdg da feacg dcag | abcdfe daf debgf dbfeac
gbdfca gbefca cba cb ebcfagd gbafd fdacb fdgeab bcdg cadef | afbdc efdgabc dbagf gfdab
efdagb dae fcabedg caedb fdaecb ad ebdfc cdgfeb dfca eacbg | bedfgc fecdb edgfba cedfab
cd afdc cdg cbdgaf eagbd gacfb befdcga bdacg cbeafg ecfbgd | bdgacf dcfbeg dacgbf dagcb
begdaf gedbcfa dafc fea dfgce dgacfe gbedfc cfeag cbgea af | gecba agfbedc cbage egfdc
dc fgcd baefcg afbgecd bgeda ced baedfc cdeag gdafec efgca | bacfge bgdae abegfc afgbced
fc afcbgd bcf afebcgd bgdcf acdf bdfeg ecbagf cbdega adcgb | ceagbf befdcga edfagcb acdf
dbcgf degc bfgad bcfed gcb fceabdg gbfcde gc fbdaec afgebc | fecbdag fadgecb afbdg dgecfb
abcfg cfb eafgb bc cgbfda adfcge afdcg cfbgde cadb efgbcda | acgfb cb dfcag gdecfb
cdefb cfga edcgbfa cab abfge acfbe ca bcgaed bcaefg bdegaf | dbfce gdfcaeb fedabg fbcea
fgcae gafd eacdfgb baceg cadebf cfbged daefcg fge fg fceda | gceadbf dcbfage cafed ebacdf
fabdceg abcgde acebdf cfaeb fa egfcb dbfa fac abecd agefcd | cfeab edcbag acf dcabefg
dgbecfa abdfe acegd fdgabc gadef gfce ecbagd edagcf fg dfg | gdf fcegbda agcde fgd
dagf bcdaef ad acd cbeag febagdc dgbfac dgcab fcdbge bdgcf | fdbeac gcbda bcfdg bfcgd
fgdc gc gefdcab bdgec dbcefa gce bfgdec gcefab degab cebfd | bdfce gbecfd gadbe ebcadgf
fagc bdcfag fdacb agbedf daf aedgbc dbcga ebdgcfa cbdfe fa | febdc cfag af cadbg
bcd bfec dagbcf egcbfd bc edfgc bdecg edabg dcgeabf gdefca | bedag dbc fgcdbe ebdfcg
gedafcb dbagcf bcadeg fc gfc cebf edgfc cgdbe bcfdge egdfa | fc dabgec bdcge ebfc
gafbd ef becga ebgcaf agbef gfe gebcda gbfdce afce dbcgefa | ef gfe cabfeg gabecf
deab fbedgc eb bdacg dagcfbe abecg cfdagb beg baedcg gacfe | gacdb dbfgace dbea cadbg
badceg ced fecba fbdc adfec ebfcgad gecafb faedcb gfeda cd | fcead fbcaged adebgc ceabgd
bd bdcg fgcab abd cfaebd baecgf fecbgad agdfb efdga gfdacb | afebcd bfadg egbfca cgbfea
da decbf afdec begcad dcgefb gcafe edbfca dca fdab begdfca | efadc abdf ebcdfa fegac
gcbeaf geadbc fdbeagc bfdec cdbae ea agfdcb dabcg eac adeg | gcdba cebdf abecd gedcab
bcdae abedg ebg bfadec eg dbgaf egafcb gcadeb egdc abedfcg | dagfb ebg gebcaf eg
afb abgfed caegfd cfbd becag dcbgfea bf decaf faecb bedfac | daegfb dbaefc gacedf bfa
bgecf becfad ea adebgc cfdbgea dabcg eca eagd acbeg adfcgb | agdbc bagcd bgcda aedg
bf fagcde cfdb acfgd gfdaeb acdfegb gfacb bfg bgeca bcgafd | gfb gfacd agfdeb abcge
aegfd efcd bedfagc bacdgf gecadf aed egbdac fcagd ed afbeg | daefg dagfc acdbfg gbacfd
decga efbcd badcgf cfgdbe agefcbd fa ebcdaf fcdea eafb fda | dcfea fad ebadgfc afedcb
bf gebfcd bagfed bdagcfe cegbd fgbdc gfb ecgbad gdafc befc | fadbeg bcgde gbf bfg
df cbfged fgbca fbd bcafge bdeac agbfecd adcbf gdaf dabgfc | bcdea cafbd afdg gacfb
ecdbfa fadgce aceb fgebd bfcgad cdfae afgbced dfebc cfb cb | cfead fcb bc bedcf
fdbega cfegd cdbgae cdfebga fecadb aeg cbag ag adceb dcage | ebcagd gcead egdfc dagecb
cdbfeag gfdeba edfgca cead geadf gac fcbdg afgcd cabegf ca | fecgad gefda dafcg fdgca
cfgbae cgefb egdbfc dcg dfcbg ecbgfda badcf gfed edcgba gd | gd cbefdg adbceg badcf
bf bgf debfg bgade egbfcd cebdafg agdfce fgced dcbfag fcbe | adcgfe fdgeac fb ebfc
gefdc fdagcb gfdac bdafce caf ac daegcbf febgda cbga dbafg | dagbf ac faedcgb dfagb
ecfgadb dbgacf abfegc gd cefad fcgde cefdgb fcbge gdeb dgf | efacd bcegdaf bdgacf gd
cdfgb bdf fdcag bd cdba gbecf dfecga cfgebda gdefab dcbagf | begfc bcgfd gfbce afbgcd
fbe facb decgaf afdce fb bcdeaf bagdfe ecdbg dfbce bgedcfa | abdgfe eafdc efdbca acfgde
bgdcf cbaegd eabfdcg ceg eg aedcb deabfc dgea gfcaeb gecdb | eacgdb ge daebcf eg
egbdcaf gd cefabg dfge bcfagd afdegc caedg baecd gad caefg | gcedaf efgabc dag deagc
cdabf bgcfde afedgc fcb gcba gfacd bdaef bdegfac cb bdfagc | bcf bcedfg gaecdf cdgeabf
gf dcbfeg fcgdbea fge gedacb aefbg bgead gfad dfegba aebfc | aedgfb gf egf dfag
gbeacfd gacbd dcgfbe fg fgd dbacge bdagcf dfcea gafb fgadc | deagcb gf degfbc edcgbaf
ce gdbcae debcf cfdabe eacfbdg acef fgdbc begadf ecd afdbe | dbefa abegdc cbdfg acfbed
begdfc gbdc gedaf dc edgfc cdf fgbec ecdafb ebgafc degcbfa | egdfa edgbfca cbefg fagcbe
efcab dgbfc ag agdc cfagbde fbgeda fag acgdfb fcbga gbefcd | gacd gdac dcag gdac
bdage bdaefg gbe eb edfb bgafec dgbecaf egadf fdaecg dbacg | geb afgdbe dfbegac efgcba
ecgfa bec be ebfgc dgbcea adefgc egafbc egbafcd bafe gbfdc | aefb bce befa gfecab
ebgdc cbe ecdgab gacb gfced dbgea edbcfa fagcdeb gabfde bc | dgfec aebdgf abcdfeg fbaedc
daegbf adef dgcabe cafdgbe adcgfb dbegf ebgcf dbf ebadg fd | fcbge bgcef acfgdb efbgd
cdbge cfe adbcef fedgcb gfebcda cedgf edagf gdbcae cf gcfb | cdbeg gcdfe fabgdce aecbfd
beacg dafge gbeadc fcba bgdeafc begfa bf eabcfg ebgcdf bfg | gaefb bcfged degcab egdaf
acgefbd feb bf cdaef beadf gbaed abgced gabdef abfg gbfedc | begfda efcda bfe dgacbe
eacfgd fbdgce abfcge bcfea cafeg cagdbfe ebf debca bf fgba | fb fb acdbe cfdage
bfec cedagf aef ef degba bagcef dgcfab fgeab fecdgba bacfg | cbgaef efacgd aegfb aef
dbacfe edfc ec caebd agfebc cbe cbdag gfcbead bgfead bafde | deabc dfagbe cgbfea ec
ed dfgbec dfabg fbaec feacbg edafb aedc eadfcgb ebdacf dbe | deac bgeafc cebfdg fcdegb`;

console.log('PART 1', countUniqueOutputDigits(input));
console.log('PART 2', decode(input));