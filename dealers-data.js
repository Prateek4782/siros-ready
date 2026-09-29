/**
 * SIROS dealer network, sourced from the dealer details sheet.
 * `state` is inferred from PIN code / address text (rj = Rajasthan, mp = Madhya Pradesh);
 * flag any misclassified entries and this list is easy to correct.
 */
const SIROS_DEALERS = [
  {
    "firm": "माधव मोटर्स",
    "contact": "माधव सोनी",
    "town": "लाखेरी",
    "address": "बॉटम लेवल लाखेरी बूंदी",
    "pin": "323603",
    "state": "rj"
  },
  {
    "firm": "आरु मोटर्स",
    "contact": "रीना अंकुश जैन",
    "town": "पिड़ावा",
    "address": "ग्रीन वैली रिसॉर्ट के पास",
    "pin": "326034",
    "state": "rj"
  },
  {
    "firm": "Ramdev Motors",
    "contact": "Vikram Singh",
    "town": "Susner",
    "address": "Imli chorah pidawa road susner",
    "pin": "465447",
    "state": "mp"
  },
  {
    "firm": "तिरुपति मोटर्स",
    "contact": "ईश्वर नागर",
    "town": "खुजनेर",
    "address": "जीरापुर रोड थाने के सामने खुजनेर",
    "pin": "465687",
    "state": "mp"
  },
  {
    "firm": "राठौर मोटर्स",
    "contact": "गोपाल राठौर",
    "town": "असनावर",
    "address": "कृषि उपज मंडी के पास नई आबादी असनावर",
    "pin": "326021",
    "state": "rj"
  },
  {
    "firm": "अम्बिका मोटर्स",
    "contact": "आयुष राठौर",
    "town": "सोयत कलां",
    "address": "नगर पंचायत के पास",
    "pin": "465449",
    "state": "mp"
  },
  {
    "firm": "Rathor Enterprises",
    "contact": "Mahesh Garg",
    "town": "छीपाबड़ोद",
    "address": "Eklera Naka, Harnawada Road, Theke ke Samne, Chhipabarod",
    "pin": "325221",
    "state": "rj"
  },
  {
    "firm": "दक्ष मोटर्स",
    "contact": "सुरेश राठौर",
    "town": "बारां",
    "address": "कोटा रोड (जोनल हॉस्पिटल), सुराज इन होटल के सामने, बारां",
    "pin": "325205",
    "state": "rj"
  },
  {
    "firm": "श्री धाकड़ मोटर्स",
    "contact": "पवन धाकड़",
    "town": "रामगंजमंडी",
    "address": "बाफना पेट्रोल पंप के पास, रामगंजमंडी",
    "pin": "326519",
    "state": "rj"
  },
  {
    "firm": "भावसार ईवी पॉइंट डग",
    "contact": "सोयम भावसार",
    "town": "डग",
    "address": "भवानीमंडी रोड, डग, झालावाड़",
    "pin": "326514",
    "state": "rj"
  },
  {
    "firm": "MADANI MOTORS",
    "contact": "KALAMUDDIN MADNI",
    "town": "TALERA",
    "address": "NEAR MADNI HONDA SHOWROOM JAMITPURA ROAD, TALERA,BUNDI",
    "pin": "323021",
    "state": "rj"
  },
  {
    "firm": "KOSHAL MOTORS",
    "contact": "PRIYANSHU SONI",
    "town": "KANWAS",
    "address": "SHUBASH CIRCLE. KANWAS",
    "pin": "325602",
    "state": "rj"
  },
  {
    "firm": "ASHOKA MOTORS",
    "contact": "MUKESH DUA",
    "town": "KESHORAIPATAN",
    "address": "ASHOKA MOTORS, KOTA ROAD,KESHORAIPATAN, DIST.BUNDI",
    "pin": "323602",
    "state": "rj"
  },
  {
    "firm": "SHRI MAHAKAL AGRO AGENCY",
    "contact": "JAMNA LAL",
    "town": "begun",
    "address": "gangapur nayi aabadi, chittorgarh road,begun, dist chittorgarh",
    "pin": "312023",
    "state": "rj"
  },
  {
    "firm": "arhan enterprises",
    "contact": "juned kanpuri",
    "town": "CHABDA",
    "address": "SUMAN COLONY, DHARNAWADA,ROAD, Chhabra, Baran, Rajasthan, 325220",
    "pin": "325220",
    "state": "rj"
  },
  {
    "firm": "BHAWSAR EV POINT",
    "contact": null,
    "town": "DUG",
    "address": "NEAR KHEL MEDAN, DAG BHAWANIMANDI, MAIN ROAD, Dag, Jhalawar, Rajasthan",
    "pin": "326514",
    "state": "rj"
  },
  {
    "firm": "SANWARIYA MOTORS",
    "contact": "KAPIL bhawsar",
    "town": "jirapur",
    "address": "MACHALPUR ROAD, Tirupati Balaji,Jirapur, Rajgarh, Madhya Pradesh",
    "pin": null,
    "state": "mp"
  },
  {
    "firm": "RATHORE MOTORS",
    "contact": "PAWAN RATHORE",
    "town": "KOTA",
    "address": "Rangbari Road,Near Raj Stationers, keshavpura main,road, Kota, Kota, Rajasthan,",
    "pin": "324009",
    "state": "rj"
  },
  {
    "firm": "MAHAVEER MATERIAL SUPPLIERS",
    "contact": "NEMICHAND G",
    "town": "RATLAI",
    "address": "MAHAVEER MOTORS, JHALRAPATAN ROAD, RATLAI",
    "pin": "326022",
    "state": "rj"
  },
  {
    "firm": "BALAJI ENTERPRISES",
    "contact": "ADARSH MITTAL",
    "town": null,
    "address": "PARLIYA ROAD NEAR BY MB CONVENT SCHOOL KAWAI",
    "pin": "325219",
    "state": "rj"
  },
  {
    "firm": "MAA DURGA DEVI RATHORE ELECTRIC MOTORS",
    "contact": "RUPESH RATHORE",
    "town": "RAIPUR",
    "address": "PUNJAB NATIONAL BANK KE SAMNE RAIPUR",
    "pin": "326036",
    "state": "rj"
  },
  {
    "firm": "Ramdev Motors",
    "contact": "LAKHAN SINGH",
    "town": "SUSNER",
    "address": "Imli chorah pidawa road susner",
    "pin": "465447",
    "state": "mp"
  },
  {
    "firm": "SISODIYA TRADERS",
    "contact": "ISHWAR SIMGH",
    "town": "PAGARIYA",
    "address": "BARODA BANK KE SAMNE PAGARIYA",
    "pin": "326512",
    "state": "rj"
  },
  {
    "firm": "MADHAV MOTORS",
    "contact": "MADHAV SONI",
    "town": "INDERGARH",
    "address": "KOTA LALSOTH MEGHA HIGHWAY BYPASSS ROAD, HERO SHOWROOM KE PASS,INDERGARH",
    "pin": "323613",
    "state": "rj"
  },
  {
    "firm": "SHUBHAM MOTORS",
    "contact": "SHUBHAM RATHORE",
    "town": "SUKET",
    "address": "JHALAWAR ROAD, SUKET",
    "pin": "326530",
    "state": "rj"
  },
  {
    "firm": "BHAWSAR EV POINT DUG",
    "contact": "BRIJESH SHARMA",
    "town": "CHOUHMELA",
    "address": null,
    "pin": "326515",
    "state": "rj"
  },
  {
    "firm": "SANWARIYA MOTORS",
    "contact": "KAPIL G",
    "town": "JIRAPUR",
    "address": "TIRUPATI MANDIR KE PASS, JIRAPUR",
    "pin": "465691",
    "state": "mp"
  },
  {
    "firm": "ANGEL MOTORS",
    "contact": "SHAILASH G",
    "town": "KHANPUR",
    "address": "DAHIKHEDA CHOURAHA",
    "pin": "591302",
    "state": "rj"
  }
];
