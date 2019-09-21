import Helper from './helper'
import Config from './config'
import SketchEngine from './sketch-engine'
import SketchEngineCorpora from './sketch-engine-corpora'

export default {
  corpora: SketchEngineCorpora,
  corpname(lang) {
    if (lang) {
      let corpnames = JSON.parse(localStorage.getItem('ezhCorpnames') || '{}')
      let defaultCorpusName = 'preloaded/ententen15_tt21'
      let corpname = corpnames[lang] || defaultCorpusName
      return corpname
    }
  },
  async collocationDescription() {
    let gramrels = await this.gramrels({lang: 'en'})
    let descriptions = {}
    for (let gramrel of gramrels) {
      descriptions[gramrel] = gramrel.replace('%w', '{word}')
    }
    return Object.assign(descriptions, {
      'objects of "%w"': 'objects of "{word}"', 
      'subjects of "%w"': 'subjects of "{word}"', 
      '"%w" and/or ...': '"{word}" and/or ...', 
      'prepositional phrases': 'prepositional phrases', 
      'pronominal objects of "%w"': 'pronominal objects of "{word}"', 
      'nouns modified by "%w"': 'nouns modified by "{word}"', 
      'verbs with "%w" as object': 'verbs with "{word}" as object', 
      'verbs with "%w" as subject': 'verbs with "{word}" as subject', 
      'adjective predicates of "%w"': 'adjective predicates of "{word}"', 
      '"%w" is a ...': '"{word}" is a ...', 
      '%w\'s ...': '{word}\'s ...', 
      'possessors of "%w"': 'possessors of "{word}"', 
      'pronominal possessors of "%w"': 'pronominal possessors of "{word}"', 
      'usage patterns': 'usage patterns', 
      '... is a "%w"': '... is a "{word}"', 
      'verbs with particle "up" and "%w" as object': 'verbs with particle "up" and "{word}" as object', 
      'verbs with particle "out" and "%w" as object': 'verbs with particle "out" and "{word}" as object', 
      'verbs with particle "down" and "%w" as object': 'verbs with particle "down" and "{word}" as object', 
      'verbs with particle "off" and "%w" as object': 'verbs with particle "off" and "{word}" as object', 
      'verbs with particle "over" and "%w" as object': 'verbs with particle "over" and "{word}" as object', 
      'modifiers of "%w"': 'modifiers of "{word}"', 
      'infinitive objects of "%w"': 'infinitive objects of "{word}"', 
      'verbs complemented by "%w"': 'verbs complemented by "{word}"', 
      'verbs before "%w"': 'verbs before "{word}"', 
      'subjects of "be %w"': 'subjects of "be {word}"', 
      'verbs with particle "away" and "%w" as object': 'verbs with particle "away" and "{word}" as object',
      '-ing objects of "%w"': '-ing objects of "{word}"',
      'adjectives after "%w"': 'adjectives after "{word}"',
      'adjectives modified by "%w"': 'adjectives modified by "{word}"',
      'adverbs modified by "%w"': 'adverbs modified by "{word}"',
      'as reflexive': 'as reflexive',
      'complements of "%w"': 'complements of "{word}"',
      'in passive': 'in passive',
      'it\'s "%w" to ...': 'it\'s "{word}" to ...',
      'objects of "%w across"': 'objects of "{word} across"',
      'objects of "%w along"': 'objects of "{word} along"',
      'objects of "%w apart"': 'objects of "{word} apart"',
      'objects of "%w around"': 'objects of "{word} around"',
      'objects of "%w aside"': 'objects of "{word} aside"',
      'objects of "%w away"': 'objects of "{word} away"',
      'objects of "%w down"': 'objects of "{word} down"',
      'objects of "%w in"': 'objects of "{word} in"',
      'objects of "%w off"': 'objects of "{word} off"',
      'objects of "%w on"': 'objects of "{word} on"',
      'objects of "%w open"': 'objects of "{word} open"',
      'objects of "%w out"': 'objects of "{word} out"',
      'objects of "%w over"': 'objects of "{word} over"',
      'objects of "%w through"': 'objects of "{word} through"',
      'objects of "%w unto"': 'objects of "{word} unto"',
      'objects of "%w up"': 'objects of "{word} up"',
      'objects of "%w upon"': 'objects of "{word} upon"',
      'objects of "%w whole"': 'objects of "{word} whole"',
      'particles after "%w"': 'particles after "{word}"',
      'particles after "%w" with object': 'particles after "{word}" with object',
      'pronominal subjects of "%w"': 'pronominal subjects of "{word}"',
      'verbs modified by "%w"': 'verbs modified by "{word}"',
      'verbs with particle "across" and "%w" as object': 'verbs with particle "across" and "{word}" as object',
      'verbs with particle "along" and "%w" as object': 'verbs with particle "along" and "{word}" as object',
      'verbs with particle "apart" and "%w" as object': 'verbs with particle "apart" and "{word}" as object',
      'verbs with particle "around" and "%w" as object': 'verbs with particle "around" and "{word}" as object',
      'verbs with particle "aside" and "%w" as object': 'verbs with particle "aside" and "{word}" as object',
      'verbs with particle "in" and "%w" as object': 'verbs with particle "in" and "{word}" as object',
      'verbs with particle "on" and "%w" as object': 'verbs with particle "on" and "{word}" as object',
      'verbs with particle "open" and "%w" as object': 'verbs with particle "open" and "{word}" as object',
      'verbs with particle "through" and "%w" as object': 'verbs with particle "through" and "{word}" as object',
      'verbs with particle "unto" and "%w" as object': 'verbs with particle "unto" and "{word}" as object',
      'verbs with particle "upon" and "%w" as object': 'verbs with particle "upon" and "{word}" as object',
      'verbs with particle "whole" and "%w" as object': 'verbs with particle "whole" and "{word}" as object',
      'wh-words following "%w"': 'wh-words following "{word}"',
      '"%w" as ...': '"{word}" as ...',
      '... as "%w"': '... as "{word}"',
      '"%w" in ...': '"{word}" in ...',
      '... in "%w"': '... in "{word}"',
      '"%w" of ...': '"{word}" of ...',
      '... of "%w"': '... of "{word}"',
      '"%w" at ...': '"{word}" at ...',
      '... at "%w"': '... at "{word}"',
      '"%w" for ...': '"{word}" for ...',
      '... for "%w"': '... for "{word}"',
      '"%w" on ...': '"{word}" on ...',
      '... on "%w"': '... on "{word}"',
      '"%w" to ...': '"{word}" to ...',
      '... to "%w"': '... to "{word}"',
      '"%w" by ...': '"{word}" by ...',
      '... by "%w"': '... by "{word}"',
      '"%w" with ...': '"{word}" with ...',
      '... with "%w"': '... with "{word}"',
      '"%w" from ...': '"{word}" from ...',
      '... from "%w"': '... from "{word}"',
      '"%w" about ...': '"{word}" about ...',
      '... about "%w"': '... about "{word}"',
      '"%w" into ...': '"{word}" into ...',
      '... into "%w"': '... into "{word}"',
      '"%w" over ...': '"{word}" over ...',
      '... over "%w"': '... over "{word}"',
      '"%w" despite ...': '"{word}" despite ...',
      '... despite "%w"': '... despite "{word}"',
      '"%w" after ...': '"{word}" after ...',
      '... after "%w"': '... after "{word}"',
      '"%w" before ...': '"{word}" before ...',
      '... before "%w"': '... before "{word}"',
      '"%w" within ...': '"{word}" within ...',
      '... within "%w"': '... within "{word}"',
      '"%w" while ...': '"{word}" while ...',
      '... while "%w"': '... while "{word}"',
      '"%w" under ...': '"{word}" under ...',
      '... under "%w"': '... under "{word}"',
      '"%w" if ...': '"{word}" if ...',
      '... if "%w"': '... if "{word}"',
      '"%w" through ...': '"{word}" through ...',
      '... through "%w"': '... through "{word}"',
      '"%w" whether ...': '"{word}" whether ...',
      '... whether "%w"': '... whether "{word}"',
      '"%w" via ...': '"{word}" via ...',
      '... via "%w"': '... via "{word}"',
      '"%w" past ...': '"{word}" past ...',
      '... past "%w"': '... past "{word}"',
      '"%w" during ...': '"{word}" during ...',
      '... during "%w"': '... during "{word}"',
      '"%w" like ...': '"{word}" like ...',
      '... like "%w"': '... like "{word}"',
      '"%w" against ...': '"{word}" against ...',
      '... against "%w"': '... against "{word}"',
      '"%w" towards ...': '"{word}" towards ...',
      '... towards "%w"': '... towards "{word}"',
      '"%w" down ...': '"{word}" down ...',
      '... down "%w"': '... down "{word}"',
      '"%w" because ...': '"{word}" because ...',
      '... because "%w"': '... because "{word}"',
      '"%w" off ...': '"{word}" off ...',
      '... off "%w"': '... off "{word}"',
      '"%w" until ...': '"{word}" until ...',
      '... until "%w"': '... until "{word}"',
      '"%w" along ...': '"{word}" along ...',
      '... along "%w"': '... along "{word}"',
      '"%w" alongside ...': '"{word}" alongside ...',
      '... alongside "%w"': '... alongside "{word}"',
      '"%w" out ...': '"{word}" out ...',
      '... out "%w"': '... out "{word}"',
      '"%w" than ...': '"{word}" than ...',
      '... than "%w"': '... than "{word}"',
      '"%w" near ...': '"{word}" near ...',
      '... near "%w"': '... near "{word}"',
      '"%w" throughout ...': '"{word}" throughout ...',
      '... throughout "%w"': '... throughout "{word}"',
      '"%w" per ...': '"{word}" per ...',
      '... per "%w"': '... per "{word}"',
      '"%w" between ...': '"{word}" between ...',
      '... between "%w"': '... between "{word}"',
      '"%w" across ...': '"{word}" across ...',
      '... across "%w"': '... across "{word}"',
      '"%w" inside ...': '"{word}" inside ...',
      '... inside "%w"': '... inside "{word}"',
      '"%w" without ...': '"{word}" without ...',
      '... without "%w"': '... without "{word}"',
      '"%w" around ...': '"{word}" around ...',
      '... around "%w"': '... around "{word}"',
      '"%w" toward ...': '"{word}" toward ...',
      '... toward "%w"': '... toward "{word}"',
      '"%w" upon ...': '"{word}" upon ...',
      '... upon "%w"': '... upon "{word}"',
      '"%w" among ...': '"{word}" among ...',
      '... among "%w"': '... among "{word}"',
      '"%w" once ...': '"{word}" once ...',
      '... once "%w"': '... once "{word}"',
      '"%w" outside ...': '"{word}" outside ...',
      '... outside "%w"': '... outside "{word}"',
      '"%w" up ...': '"{word}" up ...',
      '... up "%w"': '... up "{word}"',
      '"%w" so ...': '"{word}" so ...',
      '... so "%w"': '... so "{word}"',
      '"%w" behind ...': '"{word}" behind ...',
      '... behind "%w"': '... behind "{word}"',
      '"%w" versus ...': '"{word}" versus ...',
      '... versus "%w"': '... versus "{word}"',
      '"%w" since ...': '"{word}" since ...',
      '... since "%w"': '... since "{word}"',
      '"%w" vs. ...': '"{word}" vs. ...',
      '... vs. "%w"': '... vs. "{word}"',
      '"%w" below ...': '"{word}" below ...',
      '... below "%w"': '... below "{word}"',
      '"%w" unless ...': '"{word}" unless ...',
      '... unless "%w"': '... unless "{word}"',
      '"%w" vis-a-vis ...': '"{word}" vis-a-vis ...',
      '... vis-a-vis "%w"': '... vis-a-vis "{word}"',
      '"%w" except ...': '"{word}" except ...',
      '... except "%w"': '... except "{word}"',
      '"%w" onto ...': '"{word}" onto ...',
      '... onto "%w"': '... onto "{word}"',
      '"%w" beyond ...': '"{word}" beyond ...',
      '... beyond "%w"': '... beyond "{word}"',
      '"%w" amongst ...': '"{word}" amongst ...',
      '... amongst "%w"': '... amongst "{word}"',
      '"%w" besides ...': '"{word}" besides ...',
      '... besides "%w"': '... besides "{word}"',
      '"%w" bar ...': '"{word}" bar ...',
      '... bar "%w"': '... bar "{word}"',
      '"%w" though ...': '"{word}" though ...',
      '... though "%w"': '... though "{word}"',
      '"%w" cum ...': '"{word}" cum ...',
      '... cum "%w"': '... cum "{word}"',
      '"%w" thru ...': '"{word}" thru ...',
      '... thru "%w"': '... thru "{word}"',
      '"%w" en ...': '"{word}" en ...',
      '... en "%w"': '... en "{word}"',
      '"%w" above ...': '"{word}" above ...',
      '... above "%w"': '... above "{word}"',
      '"%w" re ...': '"{word}" re ...',
      '... re "%w"': '... re "{word}"',
      '"%w" although ...': '"{word}" although ...',
      '... although "%w"': '... although "{word}"',
      '"%w" plus ...': '"{word}" plus ...',
      '... plus "%w"': '... plus "{word}"',
      '"%w" sans ...': '"{word}" sans ...',
      '... sans "%w"': '... sans "{word}"',
      '"%w" aboard ...': '"{word}" aboard ...',
      '... aboard "%w"': '... aboard "{word}"',
      '"%w" save ...': '"{word}" save ...',
      '... save "%w"': '... save "{word}"',
      '"%w" atop ...': '"{word}" atop ...',
      '... atop "%w"': '... atop "{word}"',
      '"%w" beside ...': '"{word}" beside ...',
      '... beside "%w"': '... beside "{word}"',
      '"%w" unlike ...': '"{word}" unlike ...',
      '... unlike "%w"': '... unlike "{word}"',
      '"%w" regarding ...': '"{word}" regarding ...',
      '... regarding "%w"': '... regarding "{word}"',
      '"%w" vis-à-vis ...': '"{word}" vis-à-vis ...',
      '... vis-à-vis "%w"': '... vis-à-vis "{word}"',
      '"%w" opposite ...': '"{word}" opposite ...',
      '... opposite "%w"': '... opposite "{word}"',
      '"%w" amid ...': '"{word}" amid ...',
      '... amid "%w"': '... amid "{word}"',
      '"%w" whereas ...': '"{word}" whereas ...',
      '... whereas "%w"': '... whereas "{word}"',
      '"%w" notwithstanding ...': '"{word}" notwithstanding ...',
      '... notwithstanding "%w"': '... notwithstanding "{word}"',
      '"%w" underneath ...': '"{word}" underneath ...',
      '... underneath "%w"': '... underneath "{word}"',
      '"%w" circa ...': '"{word}" circa ...',
      '... circa "%w"': '... circa "{word}"',
      '"%w" mid ...': '"{word}" mid ...',
      '... mid "%w"': '... mid "{word}"',
      '"%w" here ...': '"{word}" here ...',
      '... here "%w"': '... here "{word}"',
      '"%w" beneath ...': '"{word}" beneath ...',
      '... beneath "%w"': '... beneath "{word}"',
      '"%w" nearest ...': '"{word}" nearest ...',
      '... nearest "%w"': '... nearest "{word}"',
      '"%w" till ...': '"{word}" till ...',
      '... till "%w"': '... till "{word}"',
      '"%w" amidst ...': '"{word}" amidst ...',
      '... amidst "%w"': '... amidst "{word}"',
      '"%w" whilst ...': '"{word}" whilst ...',
      '... whilst "%w"': '... whilst "{word}"',
      '"%w" qua ...': '"{word}" qua ...',
      '... qua "%w"': '... qua "{word}"',
      '"%w" albeit ...': '"{word}" albeit ...',
      '... albeit "%w"': '... albeit "{word}"',
      '"%w" reference ...': '"{word}" reference ...',
      '... reference "%w"': '... reference "{word}"',
      '"%w" post ...': '"{word}" post ...',
      '... post "%w"': '... post "{word}"',
      '"%w" lest ...': '"{word}" lest ...',
      '... lest "%w"': '... lest "{word}"',
      '"%w" south ...': '"{word}" south ...',
      '... south "%w"': '... south "{word}"',
      '"%w" unto ...': '"{word}" unto ...',
      '... unto "%w"': '... unto "{word}"',
      '"%w" ex ...': '"{word}" ex ...',
      '... ex "%w"': '... ex "{word}"',
      '"%w" v. ...': '"{word}" v. ...',
      '... v. "%w"': '... v. "{word}"',
      '"%w" astride ...': '"{word}" astride ...',
      '... astride "%w"': '... astride "{word}"',
      '"%w" ago ...': '"{word}" ago ...',
      '... ago "%w"': '... ago "{word}"',
      '"%w" agin ...': '"{word}" agin ...',
      '... agin "%w"': '... agin "{word}"',
      '"%w" minus ...': '"{word}" minus ...',
      '... minus "%w"': '... minus "{word}"',
      '"%w" downstream ...': '"{word}" downstream ...',
      '... downstream "%w"': '... downstream "{word}"',
      '"%w" directly ...': '"{word}" directly ...',
      '... directly "%w"': '... directly "{word}"',
      '"%w" inland ...': '"{word}" inland ...',
      '... inland "%w"': '... inland "{word}"',
      '"%w" immediately ...': '"{word}" immediately ...',
      '... immediately "%w"': '... immediately "{word}"',
      '"%w" forth ...': '"{word}" forth ...',
      '... forth "%w"': '... forth "{word}"',
      '"%w" worth ...': '"{word}" worth ...',
      '... worth "%w"': '... worth "{word}"',
      '"%w" such ...': '"{word}" such ...',
      '... such "%w"': '... such "{word}"',
      '"%w" senza ...': '"{word}" senza ...',
      '... senza "%w"': '... senza "{word}"',
      '"%w" west ...': '"{word}" west ...',
      '... west "%w"': '... west "{word}"',
      '"%w" fore ...': '"{word}" fore ...',
      '... fore "%w"': '... fore "{word}"',
      '"%w" offshore ...': '"{word}" offshore ...',
      '... offshore "%w"': '... offshore "{word}"',
      '"%w" next ...': '"{word}" next ...',
      '... next "%w"': '... next "{word}"',
      '"%w" ere ...': '"{word}" ere ...',
      '... ere "%w"': '... ere "{word}"',
      '"%w" layabout ...': '"{word}" layabout ...',
      '... layabout "%w"': '... layabout "{word}"',
      '"%w" pro ...': '"{word}" pro ...',
      '... pro "%w"': '... pro "{word}"',
      '"%w" away ...': '"{word}" away ...',
      '... away "%w"': '... away "{word}"',
      '"%w" betwixt ...': '"{word}" betwixt ...',
      '... betwixt "%w"': '... betwixt "{word}"',
      '"%w" north ...': '"{word}" north ...',
      '... north "%w"': '... north "{word}"',
      '"%w" anent ...': '"{word}" anent ...',
      '... anent "%w"': '... anent "{word}"',
      '"%w" respecting ...': '"{word}" respecting ...',
      '... respecting "%w"': '... respecting "{word}"',
      '"%w" concerning ...': '"{word}" concerning ...',
      '... concerning "%w"': '... concerning "{word}"',
      '"%w" thoughout ...': '"{word}" thoughout ...',
      '... thoughout "%w"': '... thoughout "{word}"',
      '"%w" par ...': '"{word}" par ...',
      '... par "%w"': '... par "{word}"',
      '"%w" now ...': '"{word}" now ...',
      '... now "%w"': '... now "{word}"',
      '"%w" outwith ...': '"{word}" outwith ...',
      '... outwith "%w"': '... outwith "{word}"',
      '"%w" frae ...': '"{word}" frae ...',
      '... frae "%w"': '... frae "{word}"',
      '"%w" ahead ...': '"{word}" ahead ...',
      '... ahead "%w"': '... ahead "{word}"',
      '"%w" underground ...': '"{word}" underground ...',
      '... underground "%w"': '... underground "{word}"',
      '"%w" sine ...': '"{word}" sine ...',
      '... sine "%w"': '... sine "{word}"',
      '"%w" whereupon ...': '"{word}" whereupon ...',
      '... whereupon "%w"': '... whereupon "{word}"',
      '"%w" chez ...': '"{word}" chez ...',
      '... chez "%w"': '... chez "{word}"',
      '"%w" less ...': '"{word}" less ...',
      '... less "%w"': '... less "{word}"',
      '"%w" aslant ...': '"{word}" aslant ...',
      '... aslant "%w"': '... aslant "{word}"',
      '"%w" upstream ...': '"{word}" upstream ...',
      '... upstream "%w"': '... upstream "{word}"',
      '"%w" wherever ...': '"{word}" wherever ...',
      '... wherever "%w"': '... wherever "{word}"',
      '"%w" considering ...': '"{word}" considering ...',
      '... considering "%w"': '... considering "{word}"',
      '"%w" thro ...': '"{word}" thro ...',
      '... thro "%w"': '... thro "{word}"',
      '"%w" overhead ...': '"{word}" overhead ...',
      '... overhead "%w"': '... overhead "{word}"',
      '"%w" abaft ...': '"{word}" abaft ...',
      '... abaft "%w"': '... abaft "{word}"',
      '"%w" nigh ...': '"{word}" nigh ...',
      '... nigh "%w"': '... nigh "{word}"',
      '"%w" afore ...': '"{word}" afore ...',
      '... afore "%w"': '... afore "{word}"',
      '"%w" withal ...': '"{word}" withal ...',
      '... withal "%w"': '... withal "{word}"',
      '"%w" downwind ...': '"{word}" downwind ...',
      '... downwind "%w"': '... downwind "{word}"',
      '"%w" where ...': '"{word}" where ...',
      '... where "%w"': '... where "{word}"',
      '"%w" whither ...': '"{word}" whither ...',
      '... whither "%w"': '... whither "{word}"',
      '"%w" pace ...': '"{word}" pace ...',
      '... pace "%w"': '... pace "{word}"',
      '"%w" sith ...': '"{word}" sith ...',
      '... sith "%w"': '... sith "{word}"',
      '"%w" inward ...': '"{word}" inward ...',
      '... inward "%w"': '... inward "{word}"',
      '"%w" excepting ...': '"{word}" excepting ...',
      '... excepting "%w"': '... excepting "{word}"',
      '"%w" saving ...': '"{word}" saving ...',
      '... saving "%w"': '... saving "{word}"',
      '"%w" neath ...': '"{word}" neath ...',
      '... neath "%w"': '... neath "{word}"',
      '"%w" athwart ...': '"{word}" athwart ...',
      '... athwart "%w"': '... athwart "{word}"',
      '"%w" midst ...': '"{word}" midst ...',
      '... midst "%w"': '... midst "{word}"',
      '"%w" insofar ...': '"{word}" insofar ...',
      '... insofar "%w"': '... insofar "{word}"',
      '"%w" thwart ...': '"{word}" thwart ...',
      '... thwart "%w"': '... thwart "{word}"',
      '"%w" syn ...': '"{word}" syn ...',
      '... syn "%w"': '... syn "{word}"',
      '"%w" whenever ...': '"{word}" whenever ...',
      '... whenever "%w"': '... whenever "{word}"',
      '"%w" home ...': '"{word}" home ...',
      '... home "%w"': '... home "{word}"',
      '"%w" wheresoever ...': '"{word}" wheresoever ...',
      '... wheresoever "%w"': '... wheresoever "{word}"',
      '"%w" forby ...': '"{word}" forby ...',
      '... forby "%w"': '... forby "{word}"',
      '"%w" syne ...': '"{word}" syne ...',
      '... syne "%w"': '... syne "{word}"',
      '"%w" uphill ...': '"{word}" uphill ...',
      '... uphill "%w"': '... uphill "{word}"',
      '"%w" whensoever ...': '"{word}" whensoever ...',
      '... whensoever "%w"': '... whensoever "{word}"',
      '"%w" when ...': '"{word}" when ...',
      '... when "%w"': '... when "{word}"',
      '"%w" failing ...': '"{word}" failing ...',
      '... failing "%w"': '... failing "{word}"',
      '"%w" whithersoever ...': '"{word}" whithersoever ...',
      '... whithersoever "%w"': '... whithersoever "{word}"',
      '"%w" astraddle ...': '"{word}" astraddle ...',
      '... astraddle "%w"': '... astraddle "{word}"',
      '"%w" atween ...': '"{word}" atween ...',
      '... atween "%w"': '... atween "{word}"',
      '"%w" piped-in ...': '"{word}" piped-in ...',
      '... piped-in "%w"': '... piped-in "{word}"',
      '"%w" sobeit ...': '"{word}" sobeit ...',
      '... sobeit "%w"': '... sobeit "{word}"',
      '"%w" wanting ...': '"{word}" wanting ...',
      '... wanting "%w"': '... wanting "{word}"',
      '"%w" yet ...': '"{word}" yet ...',
      '... yet "%w"': '... yet "{word}"',
      '"%w" barring ...': '"{word}" barring ...',
      '... barring "%w"': '... barring "{word}"',
      '"%w" come-on ...': '"{word}" come-on ...',
      '... come-on "%w"': '... come-on "{word}"',
      '"%w" forbye ...': '"{word}" forbye ...',
      '... forbye "%w"': '... forbye "{word}"',
      '"%w" fornenst ...': '"{word}" fornenst ...',
      '... fornenst "%w"': '... fornenst "{word}"',
      '"%w" comeon ...': '"{word}" comeon ...',
      '... comeon "%w"': '... comeon "{word}"',
      '"%w" maugre ...': '"{word}" maugre ...',
      '... maugre "%w"': '... maugre "{word}"',
      '"%w" anear ...': '"{word}" anear ...',
      '... anear "%w"': '... anear "{word}"',
      '"%w" whenas ...': '"{word}" whenas ...',
      '... whenas "%w"': '... whenas "{word}"',
      '"%w" howbeit ...': '"{word}" howbeit ...',
      '... howbeit "%w"': '... howbeit "{word}"',
      '"%w" neither ...': '"{word}" neither ...',
      '... neither "%w"': '... neither "{word}"',
      '"%w" nathless ...': '"{word}" nathless ...',
      '... nathless "%w"': '... nathless "{word}"',
      '"%w" whencesoever ...': '"{word}" whencesoever ...',
      '... whencesoever "%w"': '... whencesoever "{word}"'
    })
  },
  collocationDescriptionBackup(word) {
    return {
      'object_of': 'object_of',
      'subject_of': 'subject_of',
      'adj_subject_of': 'adj_subject_of',
      'modifier': 'modifier',
      'modifies': 'modifies',
      'and/or': 'and/or',
      'pp_obj_%s': `pp_obj_${word}`,
      'pp_%s': `pp_${word}`,
      'predicate': 'predicate',
      'possessor': 'possessor',
      'part_%s': `part_${word}`,
      'predicate_of': 'predicate_of',
      'object': 'object',
      'subject': 'subject',
      'part_trans': 'part_trans',
      'part_intrans': 'part_intrans',
      'usage patterns': 'usage patterns',
      'pro_subject': 'pro_subject',
      'pro_object': 'pro_object',
      'adj_comp': 'adj_comp',
      'part_%s_obj': `part_${word}_obj`,
      'infin_comp': 'infin_comp',
      'wh_comp': 'wh_comp',
      'np_adj_comp': 'np_adj_comp',
      'ing_comp': 'ing_comp',
      'adj_subject': 'adj_subject',
      'adj_comp_of': 'adj_comp_of',
      'np_adj_comp_of': 'np_adj_comp_of'
    }
  },
  wsketch(options) {
    return new Promise(resolve => {
      $.getJSON(
        `${
          Config.sketchEngineProxy
        }?https://api.sketchengine.eu/bonito/run.cgi/wsketch?corpname=${this.corpname(
          options.lang
        )}&lemma=${options.term}`,
        function(response) {
          if (response.data.Gramrels && response.data.Gramrels.length > 0) {
            response.data.Gramrels.forEach(function(Gramrel) {
              Gramrel.Words = Gramrel.Words.filter(function(Word) {
                return Word.cm !== ''
              })
              for (let Word of Gramrel.Words) {
                if (Word.cm) {
                  Word.cm = Word.cm.replace(/-\w( ?)/gi, '')
                }
              }
            })
          }
          resolve(response.data)
        }
      )
    })
  },
  gramrels(options) {
    return new Promise(resolve => {
      $.getJSON(
        `${
          Config.sketchEngineProxy
        }?https://api.sketchengine.eu/bonito/run.cgi/corp_info?corpname=${this.corpname(
          options.lang
        )}&gramrels=1`,
        function(response) {
          let results = []
          for (let gramrel of response.data.gramrels) {
            if (!Array.isArray(gramrel)) {
              results.push(gramrel)
            } else {
              for(let g of gramrel) {
                results.push(g)
              }
            }
          }
          resolve(results)
        }
      )
    })
  },
  concordance(options) {
    let corpus = this.corpora.find(corpus => corpus.corpname === this.corpname(options.lang))
    let parallel = corpus.aligned && corpus.aligned.length > 0
    let requestJSON = parallel
      ? `{"attrs":"word","structs":"s,g","refs":"=doc.subcorpus","ctxattrs":"word","viewmode":"align","usesubcorp":"","freqml":[{"attr":"word","ctx":"0","base":"kwic"}],"fromp":1,"pagesize":1000,"concordance_query":[{"queryselector":"iqueryrow","sel_aligned":["opus2_${options.lang}"],"cql":"","iquery":"${options.term}","queryselector_opus2_${options.lang}":"iqueryrow","iquery_opus2_${options.lang}":"","pcq_pos_neg_opus2_${options.lang}":"pos","filter_nonempty_opus2_${options.lang}":"on"}]}`
      : `{"lpos":"","wpos":"","default_attr":"word","attrs":"word","refs":"=doc.website","ctxattrs":"word","attr_allpos":"all","usesubcorp":"","viewmode":"kwic","cup_hl":"q","cup_err":"true","cup_corr":"","cup_err_code":"true","structs":"s,g","gdex_enabled":0,"fromp":1,"pagesize":50,"concordance_query":[{"queryselector":"iqueryrow","iquery":"${options.term}"}],"kwicleftctx":"100#","kwicrightctx":"100#"}`
    return new Promise(resolve => {
      $.post(
        `${
          Config.sketchEngineProxy
        }?https://app.sketchengine.eu/bonito/run.cgi/concordance?corpname=${this.corpname(
          options.lang
        )}`,
        {
          json: requestJSON
        },
        function(response) {
          try {
            const data = JSON.parse(response).data
            var result = []
            for (let Line of data.Lines.slice(0, 500)) {
              let line =
                Line.Left.map(item => (item ? item.str : '')).join(' ') +
                ' ' +
                Line.Kwic[0].str +
                ' ' +
                Line.Right.map(item => (item ? item.str : '')).join(' ')
              line = line.replace(/ ([,.])/g, '$1')
              if (line.length > options.term.length + 4) {
                let parallelLine = {
                  english: line
                }
                if (Line.Align && Line.Align[0].Kwic) {
                  parallelLine.l1 = Line.Align[0].Kwic.map(
                    kwic => kwic.str
                  ).reduce((l1, kwic) => l1 + ' ' + kwic)
                }
                result.push(parallelLine)
              }
            }
            result = result.sort(function(a, b) {
              return a.english.length - b.english.length
            })
            resolve(Helper.unique(result))
          } catch (err) {
            throw 'Concordance did not return any data.'
          }
        }
      )
    })
  },
  thesaurus(options, callback) {
    $.post(
      `${
        Config.sketchEngineProxy
      }?https://app.sketchengine.eu/bonito/run.cgi/thes?corpname=${this.corpname(options.lang)}`,
      {
        lemma: options.term,
        lpos: '',
        clusteritems: 0,
        maxthesitems: 100,
        minthesscore: 0,
        minsim: 0.3
      },
      function(response) {
        let data = {}
        try {
          data = JSON.parse(response).data
        } catch (err) {
          throw 'Error in thesaurus'
        }
        callback(data)
      }
    )
  },
  mistakes(options, callback) {
    $.post(
      `${Config.sketchEngineProxy}?https://app.sketchengine.eu/bonito/run.cgi/concordance?corpname=preloaded/guangwai`,
      {
        json: JSON.stringify({
          lpos: '',
          wpos: '',
          default_attr: 'word',
          attrs: 'word',
          refs: SketchEngine.mistakeRefKeys.join(','),
          ctxattrs: 'word',
          attr_allpos: 'all',
          usesubcorp: '',
          viewmode: 'kwic',
          cup_hl: 'q',
          cup_err: '',
          cup_corr: '',
          cup_err_code: '',
          structs: 's,g',
          gdex_enabled: 0,
          fromp: 1,
          pagesize: 50,
          concordance_query: [
            {
              queryselector: 'iqueryrow',
              iquery: options.term,
              'sca_err.level': ['col', 'form', 'mean', 'orth', 'punct'],
              'sca_err.type': ['anom', 'incl', 'omit', 'wo']
            }
          ],
          kwicleftctx: '100#',
          kwicrightctx: '100#'
        })
      },
      function(response) {
        const data = JSON.parse(response).data
        let results = []
        for (let Line of data.Lines) {
          try {
            const ml = Line.Left.map(function(item) {
              return item.str || item.strc
            })
              .join('')
              .match(/(.*)<s>([^<s>]*?)$/)
            const left = ml[2]
            const leftContext = ml[1].replace(/<s>/g, '').replace(/<\/s>/g, '')
            let mr = Line.Right.map(function(item) {
              return item.str || item.strc
            })
              .join('')
              .match(/^([^</s>]*)<\/s>(.*)/)
            const right = mr[1]
            const rightContext = mr[2].replace(/<s>/g, '').replace(/<\/s>/g, '')
            var refs = {}
            for (let i in Line.Refs) {
              refs[SketchEngine.mistakeRefKeys[i]] = Line.Refs[i]
            }
            const country = refs['=text.id'].replace(
              /^[^_]*_[^_]*_[^_]*_[^_]*_([^_]*).*/g,
              '$1'
            )
            results.push({
              left: left,
              right: right,
              leftContext: leftContext,
              rightContext: rightContext,
              text: left + options.term + right,
              country: Helper.country(country),
              refs: refs,
              proficiency: SketchEngine.proficiency[refs['=u.proficiency']],
              errorType: SketchEngine.errors[refs['=err.type']],
              errorLevel: SketchEngine.errors[refs['=err.level']],
              l1: refs['=u.l1']
            })
          } catch (err) {
            console.log(err)
          }
        }
        results = results.sort(function(a, b) {
          return a.text.length - b.text.length
        })
        callback(results)
      }
    )
  }
}
