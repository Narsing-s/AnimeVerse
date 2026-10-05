const anime = [
  {id:1,title:"Spirited Away",subtitle:"A world beyond the bathhouse",description:"Chihiro enters a mysterious spirit world and finds courage, friendship and a way home.",year:2001,kind:"Ghibli",genres:"Fantasy, Adventure, Coming of Age",poster:"https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=900&q=85",backdrop:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",featured:true},
  {id:2,title:"My Neighbor Totoro",subtitle:"The forest is waiting",description:"Two sisters discover playful forest spirits near their new country home.",year:1988,kind:"Ghibli",genres:"Fantasy, Family, Slice of Life",poster:"https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85",backdrop:"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85",featured:true},
  {id:3,title:"Princess Mononoke",subtitle:"Where humans and nature collide",description:"Ashitaka becomes caught between a mining settlement and ancient forest gods.",year:1997,kind:"Movies",genres:"Fantasy, Adventure, Action",poster:"https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=85",backdrop:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=85",featured:false},
  {id:4,title:"Your Name",subtitle:"Two lives, one impossible connection",description:"Two teenagers mysteriously begin experiencing each other's lives across time and distance.",year:2016,kind:"Movies",genres:"Romance, Fantasy, Drama",poster:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85",backdrop:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=85",featured:false},
  {id:5,title:"Violet Evergarden",subtitle:"Letters that carry what words cannot",description:"A former soldier learns to understand emotions while writing letters for others.",year:2018,kind:"Series",genres:"Drama, Romance, Coming of Age",poster:"https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=85",backdrop:"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=85",featured:false},
  {id:6,title:"Weathering With You",subtitle:"A sky that answers back",description:"A runaway teen meets a girl who seems able to clear the rain.",year:2019,kind:"Movies",genres:"Fantasy, Romance, Drama",poster:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85",backdrop:"https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=85",featured:false}
];

const characters = [
  {id:1,name:"Chihiro Ogino",role:"Spirited Away",description:"A determined girl who grows through an extraordinary journey in the spirit world.",image:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85",anime_id:1},
  {id:2,name:"Totoro",role:"My Neighbor Totoro",description:"A gentle forest spirit who watches over two sisters.",image:"https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=700&q=85",anime_id:2},
  {id:3,name:"Ashitaka",role:"Princess Mononoke",description:"A young prince searching for a path between opposing worlds.",image:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=700&q=85",anime_id:3},
  {id:4,name:"Violet",role:"Violet Evergarden",description:"A former soldier discovering the meaning behind human feelings.",image:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85",anime_id:5},
  {id:5,name:"Hodaka",role:"Weathering With You",description:"A runaway teenager who searches for a new beginning in Tokyo.",image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85",anime_id:6}
];

const trailers = [
  {id:1,title:"Spirited Away — Journey Into the Unknown",youtube_url:"https://www.youtube.com/watch?v=ByXuk9QqQkk",description:"A glimpse into Chihiro's unforgettable journey.",anime_title:"Spirited Away"},
  {id:2,title:"My Neighbor Totoro — Forest Spirits",youtube_url:"https://www.youtube.com/watch?v=92a7Hj0ijLs",description:"Enter the forest and meet Totoro.",anime_title:"My Neighbor Totoro"},
  {id:3,title:"Your Name — A Thread Across Time",youtube_url:"https://www.youtube.com/watch?v=xU47nhruN-Q",description:"Two lives connected by a mysterious thread.",anime_title:"Your Name"}
];

const gallery = [
  {id:1,title:"Forest Light",image:"https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",anime_id:2},
  {id:2,title:"Moonlit Journey",image:"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",anime_id:1},
  {id:3,title:"Green World",image:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85",anime_id:3},
  {id:4,title:"Mountain Morning",image:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",anime_id:4}
];

const clean = (value) => String(value ?? "").trim().toLowerCase();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({error:"Method not allowed"});
  try {
    const q = clean(req.query?.q);
    const type = clean(req.query?.type || "all");
    const hit = (value) => !q || clean(value).includes(q);
    res.setHeader("Cache-Control","public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
    return res.status(200).json({
      anime: anime.filter(item => (type === "all" || clean(item.kind) === type) && [item.title,item.subtitle,item.description,item.genres].some(hit)),
      characters: characters.filter(item => [item.name,item.role,item.description].some(hit)),
      trailers: trailers.filter(item => [item.title,item.description,item.anime_title].some(hit)),
      gallery: gallery.filter(item => hit(item.title))
    });
  } catch (error) {
    console.error("AnimeVerse catalog load failed:", error);
    return res.status(500).json({error:"Catalog unavailable",message:"The catalog could not be loaded right now."});
  }
}
