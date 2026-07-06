export interface Quote {
  id: string;
  text: string;
  author: string;
  language: 'mn' | 'en';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QUOTES: Quote[] = [
  // Mongolian Easy (Short sentences, common words)
  {
    id: 'mn-easy-1',
    text: 'Эрүүл биед саруул ухаан оршино.',
    author: 'Ард түмний зүйр үг',
    language: 'mn',
    difficulty: 'easy'
  },
  {
    id: 'mn-easy-2',
    text: 'Аажуу явбал аяндаа хүрнэ.',
    author: 'Монгол ардын сургаал',
    language: 'mn',
    difficulty: 'easy'
  },
  {
    id: 'mn-easy-3',
    text: 'Зориг байвал арга олдоно.',
    author: 'Монгол зүйр үг',
    language: 'mn',
    difficulty: 'easy'
  },
  {
    id: 'mn-easy-4',
    text: 'Эвдрэхэд амархан, эвлэхэд хэцүү.',
    author: 'Ахмадын сургаал',
    language: 'mn',
    difficulty: 'easy'
  },
  {
    id: 'mn-easy-5',
    text: 'Сайн санааны үзүүрт шар тос.',
    author: 'Зүйр цэцэн үг',
    language: 'mn',
    difficulty: 'easy'
  },
  {
    id: 'mn-easy-6',
    text: 'Ухаантай хүн үгээрээ, мунхаг хүн нударгаараа.',
    author: 'Сургаалт үг',
    language: 'mn',
    difficulty: 'easy'
  },
  {
    id: 'mn-easy-7',
    text: 'Усыг нь уувал ёсыг нь дагана.',
    author: 'Ард түмний үг',
    language: 'mn',
    difficulty: 'easy'
  },
  {
    id: 'mn-easy-8',
    text: 'Дэлхийн дайдад нэрээ гаргаж явах сайхан.',
    author: 'Эх оронч',
    language: 'mn',
    difficulty: 'easy'
  },
  {
    id: 'mn-easy-9',
    text: 'Эв найрамдал бол хүч чадлын үндэс юм.',
    author: 'Эв нэгдэл',
    language: 'mn',
    difficulty: 'easy'
  },
  {
    id: 'mn-easy-10',
    text: 'Сурсан эрдэм хэзээ ч орхигдохгүй үнэтэй.',
    author: 'Багш',
    language: 'mn',
    difficulty: 'easy'
  },

  // Mongolian Medium (Medium sentences, some punctuation)
  {
    id: 'mn-med-1',
    text: 'Эрдэм номгүй хүн эмээл хазааргүй морьтой адил бөгөөд урагшлах зам нь бүрхэг байдаг.',
    author: 'Уламжлалт сургаал',
    language: 'mn',
    difficulty: 'medium'
  },
  {
    id: 'mn-med-2',
    text: 'Ус гүн бол урсгал нь намуун байдаг шиг, ухаан гүн хүмүүсийн үг нь үргэлж намуун байдаг.',
    author: 'Сургаалт үг',
    language: 'mn',
    difficulty: 'medium'
  },
  {
    id: 'mn-med-3',
    text: 'Эх орныхоо уудам талд уралдах морьдын туурайн чимээг сонсоход сэтгэл сэргэж урам зориг орно.',
    author: 'Чилл бодол',
    language: 'mn',
    difficulty: 'medium'
  },
  {
    id: 'mn-med-4',
    text: 'Монголын сайхан оронд зуны нартай үдэш хээр талд од харан суух нь хамгийн сайхан амралт юм.',
    author: 'Мөрөөдөгч',
    language: 'mn',
    difficulty: 'medium'
  },
  {
    id: 'mn-med-5',
    text: 'Алдах тусам туршлага нэмэгдэж, хичээх тусам амжилт ойртдог гэдгийг хэзээ ч бүү мартаарай.',
    author: 'Хөгжлийн зөвлөгөө',
    language: 'mn',
    difficulty: 'medium'
  },
  {
    id: 'mn-med-6',
    text: 'Өглөө бүр эртлэн босож өөрийнхөө зорилгын төлөө тууштай хөдөлмөрлөх нь амжилтын гол түлхүүр мөн.',
    author: 'Амжилтын хөтөч',
    language: 'mn',
    difficulty: 'medium'
  },
  {
    id: 'mn-med-7',
    text: 'Номын хуудас бүхэнд шинэ санаа, шинэ ухаарал нуугдаж байдаг тул номыг шимтэн унших хэрэгтэй.',
    author: 'Зохиолч',
    language: 'mn',
    difficulty: 'medium'
  },
  {
    id: 'mn-med-8',
    text: 'Найз нөхдийн үнэнч нөхөрлөл нь амьдралын хамгийн хүнд хэцүү мөчүүдэд ч сэтгэлийн агуу дэмжлэг болдог.',
    author: 'Сэтгэл судлаач',
    language: 'mn',
    difficulty: 'medium'
  },
  {
    id: 'mn-med-9',
    text: 'Сүүдэр арилах тусам гэрэл тодордог шиг зовлон бэрхшээлийг давсны дараа жаргалын амтыг илүү мэдэрнэ.',
    author: 'Гүн ухаантан',
    language: 'mn',
    difficulty: 'medium'
  },
  {
    id: 'mn-med-10',
    text: 'Шинэ технологийг зөв ашиглаж сурах нь өнөөгийн нийгэмд хөл нийлүүлэн алхахад маш чухал ач холбогдолтой.',
    author: 'Технологич',
    language: 'mn',
    difficulty: 'medium'
  },

  // Mongolian Hard (Long sentences, complex words, punctuation, numbers)
  {
    id: 'mn-hard-1',
    text: 'Эрдэм номд шамдах нь хүний амьдралын хамгийн эрхэм чухал үйл хэрэг мөн. Оюун ухаанаа цэгцэлж, бичих хурдаа нэмэгдүүлснээр та өөрийнхөө тархийг илүү бүтээлч, хурдан сэтгэх дасгалд сургана. Өдөр бүр бага боловч шинэ зүйл сурч мэдэх нь ирээдүйн их амжилтын эхлэл болдог. Хэчнээн саад бэрхшээл тулгарсан ч өөрийнхөө зорилгыг тууштай хамгаалж урагшлах хэрэгтэй. Залуу насны эрч хүчээр дэлхийн тавцанд өрсөлдөх нь өнөөгийн бидний хамгийн гол чиг үүрэг мөн. Түүх соёлоо дээдлэн хамгаалах нь улс орны оршин тогтнохын хамгийн чухал үндэс суурь болно. Нийгмийн хөгжилд хувь нэмрээ оруулахын тулд хүн бүр өөрийгөө байнга дайчлан хөгжүүлэх шаардлагатай. Сайн найз нөхдийн дэмжлэг бол амьдралын замд тохиох хамгийн том бэлэг билээ. Өөртөө итгэлтэйгээр шинэ сорилтуудыг даван туулж, өөрийнхөө түүхийг бүтээгээрэй. Энэхүү уралдаанд та амжилттай оролцож бичих хурдаараа бусдыгаа тэргүүлнэ гэдэгт итгэж байна.',
    author: 'Ардын ухаан',
    language: 'mn',
    difficulty: 'hard'
  },
  {
    id: 'mn-hard-2',
    text: 'Уудам монголын тал нутагт наранд ээсэн зэрэглээ зөөлнөөр мяралзан харагддаг. Тэнд бэлчих мал сүрэг, уулсын оройд цайрах цагаан цас бол байгалийн гайхамшиг билээ. Ийм үзэсгэлэнт эх орноо хайрлан хамгаалах нь иргэн бүрийн ариун журамт үүрэг мөн. Хүн төрөлхтний соёл иргэншлийн түүхэнд бичиг үсэг гэдэг бол мэдлэгийг хадгалах хамгийн аугаа зэвсэг юм. Ном судар унших тусам бидний оюун ухааны цар хүрээ тэлж байдаг. Шинэ цагийн хөгжлийг цахим эрин зуунтай хослуулах нь залуусын хамгийн том боломж билээ. Алдаа бүрээс суралцаж, туршлагаа баяжуулах нь ухаалаг хүний хийх сонголт мөн. Өөрийнхөө давуу талыг олж харж чадвал амьдрал илүү утга учиртай болно. Бид хамтдаа урагшилж, бие биенээ дэмжин туслах замаар илүү сайхан нийгмийг бүтээнэ. Хичээл зүтгэл бүхэн тань үр дүнд хүрч, ирээдүйд гэрэлт цацраг болон тусах болтугай.',
    author: 'Түүхч',
    language: 'mn',
    difficulty: 'hard'
  },
  {
    id: 'mn-hard-3',
    text: 'Амжилтанд хүрэхийн тулд зөвхөн авьяас хангалтгүй бөгөөд тууштай хөдөлмөр хамгаас чухал байдаг. Өглөө бүр эрт босож, шинэ зорилгынхоо төлөө хөдөлмөрлөх нь таныг бусдаас ялгаруулна. Цаг хугацаа гэдэг бол маш хурдан урсан өнгөрөх үнэтэй баялаг юм. Нэг секунд бүрийг үр бүтээлтэй ашиглаж, өөрийгөө хөгжүүлэхэд зориулах хэрэгтэй. Буруу зуршлаасаа татгалзаж, зөв амьдралын хэв маягийг хэвшүүлэх нь эрүүл байхын үндэс суурь мөн. Бичих ур чадвараа сайжруулах нь таны анхаарал төвлөрөлтийг шинэ түвшинд гаргана. Илүү хурдан бичиж сурахын тулд өдөр бүр уйгагүй дасгал хийх шаардлагатай. Тэвчээр хатуужил бол бэрхшээл бүрийн ард нуугддаг ялалтын нууц билээ. Таны өнөөдрийн хийж буй жижиг сонголтууд маргаашийн хувь тавиланг тань шийднэ. Иймд өөртөө итгэж, алхам бүрээ итгэл төгс хийж сураарай.',
    author: 'Залуу инженер',
    language: 'mn',
    difficulty: 'hard'
  },
  {
    id: 'mn-hard-4',
    text: 'Эрүүл биед саруул ухаан оршино гэдэг ардын зүйр үг бий. Биеийн тамир, дасгал хөдөлгөөнөөр тогтмол хичээллэх нь бие махбодийг эрүүл чийрэг байлгадаг. Үүний зэрэгцээ оюуны дасгал хийх нь тархины үйл ажиллагааг сэргэг байлгахад тустай. Ном унших, дадлага хийх нь анхаарлаа дээд зэргээр төвлөрүүлэх боломжийг олгодог. Өнөөгийн завгүй нийгэмд бид сэтгэл санаагаа тайван байлгах хэрэгтэй. Бухимдал стрессийг зөв удирдаж сурах нь сэтгэл зүйн эрүүл мэндэд маш чухал. Өөрийгөө хайрлаж, өрөөл бусдыг хүндэтгэх нь сайхан амьдралын эхлэл юм. Багахан амжилтандаа урамшиж, улам их урам зоригтойгоор хөдөлмөрлөөрэй. Хэцүү үед ч инээмсэглэл тодруулж явах нь амьдралыг гэрэлтүүлдэг. Таны ирээдүй үргэлж гэрэл гэгээтэй, сайн сайхан зүйлсээр дүүрэн байх болно.',
    author: 'Яруу найрагч',
    language: 'mn',
    difficulty: 'hard'
  },
  {
    id: 'mn-hard-5',
    text: 'Аливаа улс орны тусгаар тогтнол, аюулгүй байдал нь маш чухал. Энэ нь иргэдийн оюун ухаан, боловсролын түвшинтэй шууд хамааралтай оршдог. Мэдлэг боловсролтой иргэд бол улс орны хамгийн том баялаг мөн. Хөгжил дэвшилд хүрэхийн тулд бид шинжлэх ухааны ололт амжилтыг ашиглах хэрэгтэй. Залуу үеийнхэн маань дэлхийн боловсролыг эх орондоо нутагшуулах чин эрмэлзэлтэй байна. Тэдэнд зөв чиглэл чиглүүлэг өгөх нь ахмад үеийнхний эрхэм үүрэг билээ. Хамтын хүчээр бид ямар ч хүнд хэцүү сорилтыг даван туулж чадан. Эв нэгдэл гэдэг бол ялагдашгүй хүч чадлын хамгийн гол эх уурхай юм. Өдөр бүр улс орныхоо хөгжил цэцэглэлтийн төлөө хувь нэмрээ оруулахыг хичээгээрэй. Монгол орны маань ирээдүй улам бүр мандан бадрах нь дамжиггүй билээ.',
    author: 'Төрийн зүтгэлтэн',
    language: 'mn',
    difficulty: 'hard'
  },
  {
    id: 'mn-hard-6',
    text: 'Суралцах үйл явц гэдэг хэзээ ч дуусахгүй урт удаан аялал юм. Бид амьдралынхаа хором мөч бүрээс шинэ соргог зүйлсийг сурч байдаг. Мэдлэгээ байнга зузаатгаж, шинэ ур чадварт суралцах нь таныг хөгжүүлнэ. Орчин үеийн нийгэмд хурдтай хувьсан өөрчлөгдөх чадвар маш өндөр үнэлэгддэг. Технологийн дэвшлийг өөрийнхөө давуу тал болгон ашиглах нь ухаалаг алхам мөн. Өөртөө итгэлгүй байдлаа даван туулж, шинэ сорилтод зоригтой алхан ороорой. Хичээл зүтгэл гаргасан цагт ямар ч зорилго биелэх боломжтой болдог. Бусдаас суралцахаас хэзээ ч бүү ичиж, үргэлж даруу төлөв зантай байгаарай. Таны сурсан мэдсэн зүйлс амьдралын тань хамгийн найдвартай тулгуур болно. Эцэст нь хэлэхэд сурах тусам хүний дотоод ертөнц улам баялаг болдог.',
    author: 'Сэтгэл зүйч',
    language: 'mn',
    difficulty: 'hard'
  },
  {
    id: 'mn-hard-7',
    text: 'Байгаль дэлхийгээ хайрлан хамгаалах нь хүн төрөлхтний хамгийн анхны үүрэг мөн. Цэнхэр гариг маань бидний амьд орших цорын ганц гэр билээ. Ус, агаар, хөрсний бохирдлыг бууруулахад хүн бүрийн оролцоо нэн чухал. Мод тарих, байгальд хог хаяхгүй байх нь маш энгийн туслалцаа юм. Эх дэлхийн маань тэнцвэрт байдал алдагдвал ирээдүй үе маань хохирох болно. Байгалийн нөөц баялгийг зүй зохистой, хэмнэлттэй ашиглаж сурах шаардлагатай байна. Ногоон ирээдүйг хамтдаа цогцлоох нь бидний хамтын хариуцлага мөн гэдгийг санаарай. Хүүхэд залууст экологийн боловсрол олгох нь маш зөв хөрөнгө оруулалт болно. Ирээдүй хойч үедээ эрүүл, цэвэр байгалийг өвлүүлэн үлдээх нь бидний зорилго. Дэлхий ээжийгээ хайрлаж, түүний гоо үзэсгэлэнг үргэлж бахдан биширч яваарай.',
    author: 'Соёл судлаач',
    language: 'mn',
    difficulty: 'hard'
  },
  {
    id: 'mn-hard-8',
    text: 'Цаг хугацааг үр ашигтай удирдах нь амжилттай амьдрахын хамгийн чухал үндэс юм. Өдрийн төлөвлөгөөгөө урьдчилан гаргах нь ажлын бүтээмжийг маш ихээр нэмэгдүүлдэг. Чухал ажлуудаа хамгийн түрүүнд хийж гүйцэтгэх нь маш зөв дадал мөн. Сул зогсолт, цаг үрсэн зүйлсээс өөрийгөө байнга хол байлгахыг хичээгээрэй. Өөртөө амрах цаг гаргах нь эрч хүчээ сэлбэхэд маш их тустай. Ажил, амьдралын тэнцвэрийг зөв хадгалах нь аз жаргалтай байхын нууц. Хэт ачаалалтай ажиллах нь урт хугацаандаа бие махбодийг сулруулдаг. Өөрийнхөө дотоод дуу хоолойг сонсож, сэтгэлийн амар амгаланг үргэлж хадгалаарай. Ойр дотны хүмүүстэйгээ цагийг хамт өнгөрүүлж, тэднийг үргэлж баярлуулж яваарай. Цаг хугацаа бол эргэж олдохгүй хамгийн үнэтэй ховор бэлэг билээ.',
    author: 'Хөгжлийн хөтөч',
    language: 'mn',
    difficulty: 'hard'
  },
  {
    id: 'mn-hard-9',
    text: 'Нийгмийн харилцаанд бие биенээ хүндэтгэх нь хамгийн чухал соёл мөн. Бусдын үзэл бодлыг сонсож, ойлгохыг хичээх нь ухаалаг хүний шинж чанар. Бидний ялгаатай талууд нийгмийг илүү сонирхолтой, баялаг болгож өгдөг. Аливаа асуудлыг эв зүйгээр, ярилцаж шийдвэрлэх нь хамгийн зөв гарц юм. Хэрүүл маргаан, үл ойлголцол нь зөвхөн сөрөг үр дагаврыг л дагуулдаг. Эелдэг дулаан үгс бусдын сэтгэлийг дулаацуулж, урам зориг өгөх хүчтэй. Өдөр бүр хэн нэгэнд бага ч болов туслахыг хичээгээрэй. Сайхан сэтгэл үргэлж сайхан зүйлээр эргэж хариулагддаг хуультай гэдэг. Илүү найрсаг, дулаан уур амьсгалтай нийгмийг бид хамтдаа бүтээж чадна. Таны гаргасан эерэг хандлага эргэн тойрныг тань гэрэлтүүлэх болно.',
    author: 'Аялагч',
    language: 'mn',
    difficulty: 'hard'
  },
  {
    id: 'mn-hard-10',
    text: 'Шинэ мянганы хөгжил нь залуусын бүтээлч сэтгэлгээ, шинийг эрэлхийлэх тэмүүлэл дээр тогтож байна. Өнөөгийн дэлхий ертөнцөд ухаалаг шийдэл гаргах ур чадвар маш чухал болсон. Бид зөвхөн хэрэглэгч биш, бүтээгч байхын төлөө тэмүүлэх хэрэгтэй. Өөрийнхөө сонирхдог чиглэлээр гүнзгийрүүлэн суралцаж, мэргэжилдээ эзэн болох нь бахархал юм. Бэрхшээл тулгарах бүрт шантрах биш, харин түүнийг боломж гэж хараарай. Идэвхтэй хандлага нь амжилтын талыг аль хэдийн шийдчихсэн байдаг гэдэг. Багаар ажиллах чадварыг эзэмших нь өнөөгийн нийгэмд маш том давуу тал болно. Бусдын давуу талаас суралцаж, өөрийнхөө дутагдлыг засах нь зөв замнал мөн. Таны өнөөдрийн хийж буй хөрөнгө оруулалт маргаашийн үнэ цэнийг тань бүтээнэ. Зорилгодоо үнэнч байж, мөрөөдлийнхөө зүг тууштай, зоригтой урагшаа тэмүүлээрэй.',
    author: 'Эрдэмтэн',
    language: 'mn',
    difficulty: 'hard'
  },
  
  // English Easy (Short sentences)
  {
    id: 'en-easy-1',
    text: 'Stay hungry, stay foolish.',
    author: 'Steve Jobs',
    language: 'en',
    difficulty: 'easy'
  },
  {
    id: 'en-easy-2',
    text: 'To be or not to be, that is the question.',
    author: 'William Shakespeare',
    language: 'en',
    difficulty: 'easy'
  },
  {
    id: 'en-easy-3',
    text: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci',
    language: 'en',
    difficulty: 'easy'
  },
  {
    id: 'en-easy-4',
    text: 'Make it simple, but significant.',
    author: 'Don Draper',
    language: 'en',
    difficulty: 'easy'
  },
  {
    id: 'en-easy-5',
    text: 'Every moment is a fresh beginning.',
    author: 'T.S. Eliot',
    language: 'en',
    difficulty: 'easy'
  },
  {
    id: 'en-easy-6',
    text: 'Knowledge is power and wisdom is key.',
    author: 'Francis Bacon',
    language: 'en',
    difficulty: 'easy'
  },
  {
    id: 'en-easy-7',
    text: 'Actions speak louder than words.',
    author: 'Proverb',
    language: 'en',
    difficulty: 'easy'
  },
  {
    id: 'en-easy-8',
    text: 'Practice makes perfect in every game.',
    author: 'Proverb',
    language: 'en',
    difficulty: 'easy'
  },
  {
    id: 'en-easy-9',
    text: 'Dream big and dare to fail.',
    author: 'Norman Vaughan',
    language: 'en',
    difficulty: 'easy'
  },
  {
    id: 'en-easy-10',
    text: 'Time flies when you are having fun.',
    author: 'Albert Einstein',
    language: 'en',
    difficulty: 'easy'
  },

  // English Medium (Medium sentences)
  {
    id: 'en-med-1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    language: 'en',
    difficulty: 'medium'
  },
  {
    id: 'en-med-2',
    text: 'Life is what happens when you are busy making other plans.',
    author: 'John Lennon',
    language: 'en',
    difficulty: 'medium'
  },
  {
    id: 'en-med-3',
    text: 'The best way to predict your future is to create it today.',
    author: 'Abraham Lincoln',
    language: 'en',
    difficulty: 'medium'
  },
  {
    id: 'en-med-4',
    text: 'Quiet minds cannot be easily perplexed or frightened by external chaos.',
    author: 'Robert Louis Stevenson',
    language: 'en',
    difficulty: 'medium'
  },
  {
    id: 'en-med-5',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    language: 'en',
    difficulty: 'medium'
  },
  {
    id: 'en-med-6',
    text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    author: 'Ralph Waldo Emerson',
    language: 'en',
    difficulty: 'medium'
  },
  {
    id: 'en-med-7',
    text: 'Happiness is not something ready made. It comes from your own deliberate actions and positive mindset.',
    author: 'Dalai Lama',
    language: 'en',
    difficulty: 'medium'
  },
  {
    id: 'en-med-8',
    text: 'Do not wait for the perfect moment, take the moment and make it perfect with your hard work.',
    author: 'Unknown',
    language: 'en',
    difficulty: 'medium'
  },
  {
    id: 'en-med-9',
    text: 'The beautiful thing about learning is that nobody can take it away from you ever in life.',
    author: 'B.B. King',
    language: 'en',
    difficulty: 'medium'
  },
  {
    id: 'en-med-10',
    text: 'Keep your face always toward the sunshine, and shadows will eventually fall behind you.',
    author: 'Walt Whitman',
    language: 'en',
    difficulty: 'medium'
  },

  // English Hard (Long sentences, complex punctuation and syntax)
  {
    id: 'en-hard-1',
    text: 'The journey of a thousand miles begins with a single step towards your goals. Every day presents a new opportunity to learn and improve yourself. Hard work beats talent when talent fails to work hard in life. Resilience is the key to overcoming any challenges that you might face. Do not be afraid of making mistakes because they teach you valuable lessons. Successful people maintain a positive mindset even in difficult situations. Continuous learning is the only way to stay relevant in a fast-paced world. Your dedication today determines the level of your future achievements. Believe in yourself and trust the process of growth. This typing test is an excellent chance to showcase your outstanding skills.',
    author: 'Steve Jobs',
    language: 'en',
    difficulty: 'hard'
  },
  {
    id: 'en-hard-2',
    text: 'Technology is changing the world at an unprecedented rate of speed. We must adapt to these advancements to build a brighter future. Innovative ideas can come from anyone willing to think outside the box. Passion is the driving force that turns dreams into reality. Never underestimate the power of consistent daily effort over long periods. Collaboration with others often leads to extraordinary creative breakthroughs. A clear mind helps you focus on what truly matters in life. Health and well-being should always be your top priorities. Every sunset is a beautiful reminder that we can start fresh tomorrow. Enjoy this moment and give your absolute best in this typing run.',
    author: 'Tech Pioneer',
    language: 'en',
    difficulty: 'hard'
  },
  {
    id: 'en-hard-3',
    text: 'Great things take time to grow and establish deep roots. Patience is a rare virtue that rewards those who persist in silence. The ultimate measure of character is how you treat other people. Kindness costs nothing but has the potential to change a life forever. Pursue what you love and success will naturally follow your footsteps. Challenges are merely hidden opportunities disguised as difficult obstacles. The mind is like a parachute because it only functions when open. Seek wisdom rather than temporary validation from the external world. Create a vision for your life that inspires you to wake up early. This is your path so walk it with courage and dignity.',
    author: 'Nature Lover',
    language: 'en',
    difficulty: 'hard'
  },
  {
    id: 'en-hard-4',
    text: 'Reading books is a wonderful habit that opens doors to new worlds. It expands your imagination and helps you gain a deeper understanding of life. Every story contains valuable perspectives that can inspire your personal growth. Spending time in quiet reflection allows your mind to process experiences. Learning to listen is just as important as learning to speak. True communication requires patience, empathy, and an open heart. Build strong relationships based on mutual trust and genuine respect. Life is too short to be spent on anger and regrets. Focus your energy on creating positive changes in your local community. Each small act of goodness contributes to a much happier world.',
    author: 'Ralph Waldo Emerson',
    language: 'en',
    difficulty: 'hard'
  },
  {
    id: 'en-hard-5',
    text: 'A healthy body is the foundation of a happy and fulfilling life. Regular physical exercise keeps your muscles strong and your mind sharp. Eating nutritious food provides the essential energy your body needs daily. Adequate sleep is vital for your physical recovery and mental clarity. Drink plenty of water to stay hydrated and maintain peak performance. Take short breaks during long hours of work to rest your eyes. Managing stress effectively prevents burnout and improves your overall productivity. Finding a balance between work and play is extremely important. Celebrate your health by moving your body in ways you enjoy. Remember that your well-being is your most valuable personal asset.',
    author: 'Booker T. Washington',
    language: 'en',
    difficulty: 'hard'
  },
  {
    id: 'en-hard-6',
    text: 'Time management is a critical skill for achieving long-term success. Planning your day in advance helps you focus on high-priority tasks. Avoid distractions by setting clear boundaries for your workspace. Discipline is the bridge that connects your dreams to actual accomplishments. Learn to say no to things that do not align with your goals. Consistency in your daily routine builds strong habits over time. Taking calculated risks can lead to unexpected and rewarding opportunities. Reflect on your progress at the end of every single week. Adjust your strategies whenever you face new and unexpected situations. Your time is limited so make sure to spend it wisely.',
    author: 'Martin Luther King Jr.',
    language: 'en',
    difficulty: 'hard'
  },
  {
    id: 'en-hard-7',
    text: 'Nature has a unique way of calming our busy minds. Walking through a quiet forest brings a sense of inner peace. The sound of running water can wash away your daily worries. Pay close attention to the beautiful details of the changing seasons. Protecting our planet is a responsibility that we all share. Plant trees and reduce waste to keep our environment clean. Every living creature plays an important role in the global ecosystem. Spend more time outdoors to reconnect with the natural world. Appreciating nature teaches us the true value of simple things. Let us preserve this beautiful Earth for all future generations.',
    author: 'Nature Preserver',
    language: 'en',
    difficulty: 'hard'
  },
  {
    id: 'en-hard-8',
    text: 'Financial literacy is essential for securing a stable and prosperous future. Creating a realistic monthly budget helps you track your spending habits. Saving a portion of your income regularly builds a safety net. Avoid unnecessary debts by living within your financial means today. Investing your money wisely can help your wealth grow over time. Learn about different financial tools to make highly informed decisions. Financial freedom gives you more options and peace of mind. Seek advice from professionals before making major investment choices. Teach your children about money from a very young age. Building a secure future requires discipline and long-term planning.',
    author: 'Stephen Hawking',
    language: 'en',
    difficulty: 'hard'
  },
  {
    id: 'en-hard-9',
    text: 'Art and music have the power to heal our souls. They express emotions that words alone can never fully capture. Creating art is a deeply personal form of self-expression. Listening to your favorite music can instantly lift your mood. Different cultures express their unique stories through beautiful visual arts. Attend local concerts and art galleries to support creative minds. Learning to play an instrument requires patience and dedicated practice. Art encourages us to view the world from multiple perspectives. Let your creativity flow without any fear of external judgment. The world is a much brighter place because of artistic expressions.',
    author: 'Osho',
    language: 'en',
    difficulty: 'hard'
  },
  {
    id: 'en-hard-10',
    text: 'A positive attitude can completely transform your daily life experience. Choose to focus on the good things even in difficult times. Gratitude is the practice of appreciating what you have right now. Expressing appreciation to others strengthens your personal and professional connections. Surround yourself with supportive people who inspire you to grow. Avoid negative self-talk and believe in your own potential. Smiling can reduce stress and make you feel much happier. Your outlook on life determines how you handle major challenges. Embrace every single experience as an opportunity to learn something. Live with passion, purpose, and a kind, generous heart.',
    author: 'Abraham Lincoln',
    language: 'en',
    difficulty: 'hard'
  }
];

export function getRandomQuote(language?: 'mn' | 'en', difficulty?: 'easy' | 'medium' | 'hard'): Quote {
  let filtered = QUOTES;
  
  if (language) {
    filtered = filtered.filter(q => q.language === language);
  }
  
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }

  // Fallback if difficulty is too restrictive
  if (filtered.length === 0) {
    filtered = language ? QUOTES.filter(q => q.language === language) : QUOTES;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
