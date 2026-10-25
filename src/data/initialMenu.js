// Rich authentic initial menu data for Zafaron Restaurant
// With multilingual names, descriptions, ingredients, categories, prices, and HD imagery

export const initialMenu = [
  // MILLIY TAOMLAR (National Dishes)
  {
    id: "dish-1",
    category: "national",
    name: {
      uz: "Shohona Zafaron Palov",
      ru: "Шахский Шафрановый Плов",
      en: "Royal Saffron Plov"
    },
    description: {
      uz: "Lazer guruchi, sarxil qo'zichoq go'shti, sariq sabzi, mayiz, no'xat, bedana tuxumi, kazy va tog' zafaroni bilan damlangan maxsus to'y oshi.",
      ru: "Праздничный плов из риса Лазер, отборной молодой баранины, желтой моркови, изюма, нута, перепелиных яиц, казы и шафрана.",
      en: "Festive royal pilaf with aromatic Lazer rice, tender lamb, golden carrots, raisins, chickpeas, quail eggs, kazy, and saffron."
    },
    price: 68000,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    prepTime: 20,
    calories: 780,
    portion: "450 g",
    rating: 4.9,
    ordersCount: 384,
    tags: ["chef", "popular", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Lazer guruch", "Qo'zichoq go'shti", "Kazi", "Bedana tuxumi", "Zafaron", "Sariq sabzi", "Mayiz"],
      ru: ["Рис Лазер", "Баранина", "Казы", "Перепелиные яйца", "Шафран", "Желтая морковь", "Изюм"],
      en: ["Lazer Rice", "Tender Lamb", "Kazy Horse Meat", "Quail Eggs", "Saffron", "Carrots", "Raisins"]
    }
  },
  {
    id: "dish-2",
    category: "national",
    name: {
      uz: "Maxsus Qozon Kabob",
      ru: "Казан Кабоб по-Бухарски",
      en: "Bukhara Kazan Kebab"
    },
    description: {
      uz: "Qizigan cho'yan qozonda qarsildoq qilib qovurilgan yosh qo'zichoq qovurg'alari va tillarang butun kartoshkalar.",
      ru: "Обжаренные до хрустящей корочки в казане сочные ребрышки ягненка с золотистым картофелем и лучком.",
      en: "Crispy browned baby lamb chops slow-cooked in a cast-iron cauldron with golden whole potatoes and herb onions."
    },
    price: 85000,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    prepTime: 25,
    calories: 890,
    portion: "500 g",
    rating: 5.0,
    ordersCount: 290,
    tags: ["chef", "popular", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Qo'zichoq go'shti", "Yosh kartoshka", "Zira", "Kashnich", "Marinovka piyoz"],
      ru: ["Баранина", "Молодой картофель", "Зира", "Кориандр", "Маринованный лук"],
      en: ["Lamb Ribs", "Baby Potatoes", "Cumin", "Coriander", "Pickled Onions"]
    }
  },
  {
    id: "dish-3",
    category: "national",
    name: {
      uz: "Uyurma Cho'zma Lag'mon",
      ru: "Уйгурский Тянутый Лагман",
      en: "Hand-Pulled Uyghur Lagman"
    },
    description: {
      uz: "Qo'lda cho'zilgan nafis xamir, lahm mol go'shti, qizil qalampir, selderey va jannatiy qovurma sous (Say).",
      ru: "Тончайшая лапша ручной тяги, нежная телятина, болгарский перец, сельдерей и ароматный сай.",
      en: "Hand-stretched authentic noodles topped with tender beef sauté, colorful peppers, Chinese cabbage, and rich broth."
    },
    price: 52000,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    prepTime: 18,
    calories: 620,
    portion: "480 g",
    rating: 4.8,
    ordersCount: 245,
    tags: ["spicy", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Cho'zma xamir", "Mol go'shti", "Qizil qalampir", "Jusay", "Pomidor sousi"],
      ru: ["Тянутая лапша", "Говядина", "Сладкий перец", "Джусай", "Томатный соус"],
      en: ["Pulled Noodles", "Beef Tenderloin", "Bell Peppers", "Chinese Chives", "Savory Broth"]
    }
  },
  {
    id: "dish-4",
    category: "national",
    name: {
      uz: "Buxorocha Manti (5 dona)",
      ru: "Бухарские Манты с Рубленым Мясом",
      en: "Handmade Bukhara Manti (5 pcs)"
    },
    description: {
      uz: "Yupqa ipakday xamir, pichoqda maydalangan go'sht va dumsiz eritilgan dumba yog'i bilan bug'da pishirilgan lazzat.",
      ru: "Тонкое шелковистое тесто, рубленая говядина и сочный курдюк, приготовленные на пару.",
      en: "Delicate steamed dumplings stuffed with knife-minced beef, sweet onions, and aromatic spices."
    },
    price: 48000,
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
    prepTime: 22,
    calories: 580,
    portion: "5 dona (380 g)",
    rating: 4.8,
    ordersCount: 195,
    tags: ["halal", "popular"],
    isAvailable: true,
    ingredients: {
      uz: ["Oliy nav un", "Lahm mol go'shti", "Dumba", "Piyoz", "Smetana sousi"],
      ru: ["Мука высшего сорта", "Рубленая говядина", "Курдюк", "Лук", "Сметанный соус"],
      en: ["Premium Flour", "Minced Beef", "Tail Fat", "Sweet Onions", "Sour Cream Dip"]
    }
  },

  // SALATLAR (Fresh Salads)
  {
    id: "dish-5",
    category: "salads",
    name: {
      uz: "Shohona Achichuk",
      ru: "Фирменный Ачичук с Базиликом",
      en: "Heritage Achichuk Tomato Salad"
    },
    description: {
      uz: "Yusupov shirin pomidorlari, yupqa archilgan shirin piyoz, rayhon va archa qalampiri bilan boyitilgan milliy salat.",
      ru: "Сладкие юсуповские помидоры, тончайший ялтинский лук, свежий фиолетовый базилик и стручковый перчик.",
      en: "Sun-ripened sweet Yusupov tomatoes, paper-thin sweet onions, purple basil, and hot chili slivers."
    },
    price: 26000,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    prepTime: 8,
    calories: 120,
    portion: "250 g",
    rating: 4.9,
    ordersCount: 420,
    tags: ["vegetarian", "popular", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Yusupov pomidori", "Shirin piyoz", "Binafsha rayhon", "Achchiq qalampir"],
      ru: ["Юсуповские томаты", "Ялтинский лук", "Фиолетовый базилик", "Острый перец"],
      en: ["Yusupov Tomatoes", "Sweet Onion", "Purple Basil", "Chili Pepper"]
    }
  },
  {
    id: "dish-6",
    category: "salads",
    name: {
      uz: "Mujskoy Kapriz (Go'shtli Salati)",
      ru: "Салат Мужской Каприз",
      en: "Smoked Meat Caprice Salad"
    },
    description: {
      uz: "Dudlangan til, pishirilgan mol go'shti, Gauda pishlog'i, tuxum va yengil sarimsoqli sous.",
      ru: "Копченый говяжий язык, отварная телятина, сыр Гауда, яйца и фирменная заправка.",
      en: "Hearty layered salad with smoked tongue, tender boiled beef, Gouda cheese, eggs, and light aioli."
    },
    price: 46000,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    prepTime: 12,
    calories: 340,
    portion: "280 g",
    rating: 4.8,
    ordersCount: 260,
    tags: ["popular", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Dudlangan til", "Mol go'shti", "Golland pishlog'i", "Tuxum", "Mayonez sousi"],
      ru: ["Говяжий язык", "Отварное мясо", "Сыр Гауда", "Яйца", "Майонезная заправка"],
      en: ["Beef Tongue", "Tenderloin", "Gouda Cheese", "Farm Eggs", "Signature Dressing"]
    }
  },
  {
    id: "dish-7",
    category: "salads",
    name: {
      uz: "Sezar Salati (Gril Tovuqli)",
      ru: "Цезарь с Цыпленком на Гриле",
      en: "Classic Grilled Chicken Caesar"
    },
    description: {
      uz: "Qarsildoq Aysberg va Romena barglari, grilda pishgan tovuq filesi, Parmezan pishlog'i, sarimsoqli suxariklar va an'anaviy Sezar sousi.",
      ru: "Хрустящие листья ромейна, куриное филе на гриле, хлопья пармезана, чесночные крутоны и соус Цезарь.",
      en: "Crisp romaine, grilled chicken breast, shaved parmesan, house-made croutons, and rich Caesar dressing."
    },
    price: 49000,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    calories: 310,
    portion: "300 g",
    rating: 4.9,
    ordersCount: 315,
    tags: ["chef", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Aysberg bargi", "Gril tovuq filesi", "Parmezan", "Suxarik", "Sezar sousi"],
      ru: ["Салат Айсберг", "Куриное филе гриль", "Пармезан", "Крутоны", "Соус Цезарь"],
      en: ["Iceberg & Romaine", "Grilled Chicken", "Parmesan", "Croutons", "Caesar Dressing"]
    }
  },

  // KABOBLAR & GRIL (Kebabs & Grill)
  {
    id: "dish-8",
    category: "kebabs",
    name: {
      uz: "G'ijduvoncha Mayin Lyulya Kabob",
      ru: "Гиждуванский Люля-Кебаб",
      en: "Gijduvan Lamb Lyulya Kebab"
    },
    description: {
      uz: "Haqiqiy G'ijduvon an'anasi: mayin qo'zichoq go'shti, archilgan piyoz va maxsus ziravorlar bilan cho'g'da pishirilgan shirador kabob.",
      ru: "Сочнейший фарш из отборной баранины с луком и горной зирой, обжаренный на березовых углях.",
      en: "Minced grass-fed lamb seasoned with mountain cumin, flame-grilled on natural charcoals to juicy perfection."
    },
    price: 38000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    prepTime: 15,
    calories: 450,
    portion: "1 dona (160 g)",
    rating: 5.0,
    ordersCount: 510,
    tags: ["chef", "popular", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Qo'zichoq go'shti", "Piyoz", "Dumba", "Kashnich", "Lavash va piyozli garnir"],
      ru: ["Баранина", "Лук", "Курдюк", "Кориандр", "Лаваш и лучок"],
      en: ["Lamb", "Onion", "Tail Fat", "Spices", "Thin Flatbread"]
    }
  },
  {
    id: "dish-9",
    category: "kebabs",
    name: {
      uz: "Qo'y Qovurg'asi Kabobi (Kare)",
      ru: "Каре Ягненка на Углях",
      en: "Rack of Lamb Chops on Coals"
    },
    description: {
      uz: "Rozmarin va zaytun moyida marinadlangan yosh qo'zichoq qovurg'alari, ochiq olovda qizartirib pishirilgan.",
      ru: "Нежнейшие ребрышки ягненка, маринованные с розмарином и чесночком, обжаренные на углях.",
      en: "Tender lamb rib chops marinated in rosemary and garlic, seared over smoking charcoals."
    },
    price: 92000,
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80",
    prepTime: 20,
    calories: 680,
    portion: "350 g",
    rating: 4.9,
    ordersCount: 230,
    tags: ["chef", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Yosh qo'zichoq qovurg'asi", "Rozmarin", "Zaytun moyi", "Dengiz tuzi", "Gril pomidor"],
      ru: ["Каре ягненка", "Розмарин", "Оливковое масло", "Морская соль", "Томаты гриль"],
      en: ["Rack of Lamb", "Rosemary", "Olive Oil", "Sea Salt", "Grilled Veggies"]
    }
  },
  {
    id: "dish-10",
    category: "kebabs",
    name: {
      uz: "Tandir Go'shti (Surxondaryo)",
      ru: "Тандыр Гушт по-Сурхандарьински",
      en: "Surkhandarya Tandoor Roast Meat"
    },
    description: {
      uz: "Archa shoxlari bug'ida, yer osti tandirida 4 soat mobaynida pishirilgan xushbo'y va og'izda eriydigan go'sht.",
      ru: "Мясо ягненка долгого томления в глиняном тандыре с ароматом веток горной арчи.",
      en: "Slow-roasted baby lamb baked inside an underground clay tandoor infused with juniper aromatics."
    },
    price: 98000,
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    prepTime: 15,
    calories: 740,
    portion: "400 g",
    rating: 5.0,
    ordersCount: 340,
    tags: ["chef", "popular", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Qo'zichoq go'shti", "Tog' archasi", "Zira", "Kashnich", "Tandir kulchasi"],
      ru: ["Мясо ягненка", "Горная арча", "Зира", "Кориандр", "Лепешка из тандыра"],
      en: ["Lamb", "Mountain Juniper", "Cumin", "Coriander", "Tandoor Bread"]
    }
  },

  // ISSIQ TAOMLAR (Hot Mains)
  {
    id: "dish-11",
    category: "mains",
    name: {
      uz: "Ribay Steyk (Black Angus)",
      ru: "Стейк Рибай Black Angus",
      en: "Prime Black Angus Ribeye Steak"
    },
    description: {
      uz: "Marmar mol go'shtidan Medium Rare/Well Done darajasida pishirilgan sersuv steyk, sariyog' va yangi rozmarin bilan.",
      ru: "Сочный премиальный стейк из мраморной говядины зернового откорма со сливочным маслом и розмарином.",
      en: "Charred grain-fed marble beef ribeye steak basted with herbed garlic butter and roasted baby veggies."
    },
    price: 135000,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    prepTime: 25,
    calories: 820,
    portion: "350 g",
    rating: 4.9,
    ordersCount: 175,
    tags: ["chef", "halal", "new"],
    isAvailable: true,
    ingredients: {
      uz: ["Marmar go'sht", "Sariyog'", "Rozmarin", "Sarimsoq", "Murch"],
      ru: ["Мраморная говядина", "Сливочное масло", "Розмарин", "Чеснок", "Черный перец"],
      en: ["Angus Beef", "Butter", "Rosemary", "Garlic", "Peppercorn"]
    }
  },
  {
    id: "dish-12",
    category: "mains",
    name: {
      uz: "Grilda Pishgan Losos Baliq",
      ru: "Стейк из Семги на Гриле",
      en: "Grilled Norwegian Salmon Steak"
    },
    description: {
      uz: "Oltinrang limon-qaymoqli sous, yangi spargel va grilda qovurilgan pomidorlar bilan tortiladigan yangi losos filesi.",
      ru: "Свежайший норвежский лосось на углях со сливочно-лимонным соусом и спаржей.",
      en: "Fresh Norwegian salmon fillet grilled over fire, served with lemon-herb butter and tender asparagus."
    },
    price: 110000,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    prepTime: 20,
    calories: 520,
    portion: "300 g",
    rating: 4.8,
    ordersCount: 140,
    tags: ["chef", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Norvegiya lososi", "Limon", "Qaymoq sousi", "Spargel", "Zaytun moyi"],
      ru: ["Филе семги", "Лимон", "Сливочный соус", "Спаржа", "Оливковое масло"],
      en: ["Salmon Fillet", "Lemon", "Cream Sauce", "Asparagus", "Olive Oil"]
    }
  },

  // DESERTLAR (Desserts)
  {
    id: "dish-13",
    category: "desserts",
    name: {
      uz: "Turkcha Zafaron Paxlava & Muzqaymoq",
      ru: "Турецкая Пахлава с Шафраном и Мороженым",
      en: "Saffron Turkish Baklava with Ice Cream"
    },
    description: {
      uz: "40 qavat yupqa xamir, maydalangan pista va tabiiy asal qiyomi bilan to'yingan an'anaviy paxlava, vanilli muzqaymoq bilan.",
      ru: "Хрустящая слоеная пахлава с фисташками, пропитанная медовым сиропом с шафраном, и шарик пломбира.",
      en: "40 whisper-thin phyllo layers packed with roasted Gaziantep pistachios and floral saffron honey."
    },
    price: 38000,
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=85",
    prepTime: 8,
    calories: 420,
    portion: "2 dona (180 g)",
    rating: 5.0,
    ordersCount: 390,
    tags: ["popular", "vegetarian", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Filo xamiri", "Gaziantep pistasi", "Asal qiyomi", "Sariyog'", "Vanil muzqaymoq"],
      ru: ["Тесто фило", "Фисташки", "Медовый сироп", "Сливочное масло", "Пломбир"],
      en: ["Phyllo Pastry", "Pistachios", "Honey Syrup", "Butter", "Vanilla Ice Cream"]
    }
  },
  {
    id: "dish-14",
    category: "desserts",
    name: {
      uz: "Klassik Nyu-York Chizkeyk",
      ru: "Классический Чизкейк Нью-Йорк",
      en: "Classic New York Cheesecake"
    },
    description: {
      uz: "Filadelfiya pishlog'i va vanil kremi bilan tayyorlangan mayin pishloqli desert, yangi rezavor mevalar sousi bilan.",
      ru: "Нежнейший сливочный чизкейк на основе сыра Филадельфия с ягодным конфитюром.",
      en: "Velvety rich Philadelphia cream cheese cake with buttery crust and wild raspberry coulis."
    },
    price: 34000,
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=1200&q=85",
    prepTime: 5,
    calories: 380,
    portion: "1 bo'lak (160 g)",
    rating: 4.8,
    ordersCount: 215,
    tags: ["vegetarian", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Filadelfiya pishlog'i", "Pechenye asosi", "Rezavor sousi", "Yalpiz"],
      ru: ["Сыр Филадельфия", "Песочная основа", "Ягодный соус", "Мята"],
      en: ["Cream Cheese", "Graham Crust", "Berry Coulis", "Fresh Mint"]
    }
  },

  // ICHIMLIKLAR (Beverages & Teas)
  {
    id: "dish-15",
    category: "drinks",
    name: {
      uz: "Shohona Zafaron Choyi (Choynakda)",
      ru: "Царский Шафрановый Чай в Чайнике",
      en: "Royal Saffron Tea (Infusion Pot)"
    },
    description: {
      uz: "Haqiqiy Eron zafaroni, tog' kiyiko'ti, dolchin, limon va tog' asal bilan damlangan xushbo'y shifobaxsh choy.",
      ru: "Иранский шафран, горный чабрец, корица, свежий лимон и натуральный мед в хрустальном чайнике.",
      en: "Pure saffron threads, mountain thyme, cinnamon stick, lemon, and organic wildflower honey."
    },
    price: 32000,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85",
    prepTime: 6,
    calories: 45,
    portion: "800 ml",
    rating: 5.0,
    ordersCount: 460,
    tags: ["chef", "popular", "vegetarian", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Zafaron gullari", "Tog' kiyiko'ti", "Dolchin", "Asal", "Limon"],
      ru: ["Цветы шафрана", "Горный чабрец", "Корица", "Мед", "Лимон"],
      en: ["Saffron Strands", "Wild Thyme", "Cinnamon", "Wild Honey", "Lemon"]
    }
  },
  {
    id: "dish-16",
    category: "drinks",
    name: {
      uz: "Yangi Siqilgan Anor Sharbat (Fresh)",
      ru: "Свежевыжатый Гранатовый Фреш",
      en: "Freshly Pressed Pomegranate Juice"
    },
    description: {
      uz: "Tuyatish shirin anoridan maxsus press yordamida yangi siqib olingan 100% tabiiy vitaminli sharbat.",
      ru: "100% натуральный свежевыжатый сок из отборных сладких гранатов без сахара и воды.",
      en: "100% pure cold-pressed pomegranate juice without added sugar or water."
    },
    price: 28000,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=1200&q=85",
    prepTime: 5,
    calories: 110,
    portion: "300 ml",
    rating: 4.9,
    ordersCount: 310,
    tags: ["vegetarian", "popular", "halal"],
    isAvailable: true,
    ingredients: {
      uz: ["Yangi anor sharbati", "Muz bo'laklari"],
      ru: ["Свежий гранатовый сок", "Кубики льда"],
      en: ["Fresh Pomegranate", "Ice Cubes"]
    }
  }
];

// Seed Mock Orders for Admin Dashboard
export const initialOrders = [
  {
    id: "ORD-9421",
    customerName: "Bekzod Umarov",
    customerPhone: "+998 90 912 34 56",
    deliveryType: "dineIn",
    tableNumber: "VIP-2",
    deliveryAddress: "",
    items: [
      { id: "dish-1", name: "Shohona Zafaron Palov", price: 68000, quantity: 2 },
      { id: "dish-5", name: "Shohona Achichuk", price: 26000, quantity: 2 },
      { id: "dish-15", name: "Shohona Zafaron Choyi", price: 32000, quantity: 1 }
    ],
    totalAmount: 220000,
    paymentMethod: "card",
    status: "cooking",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: "ORD-9420",
    customerName: "Kamola Saidova",
    customerPhone: "+998 97 780 11 22",
    deliveryType: "delivery",
    tableNumber: "",
    deliveryAddress: "Yunusobod 12-mavze, 45-uy, 18-xonadon",
    items: [
      { id: "dish-2", name: "Maxsus Qozon Kabob", price: 85000, quantity: 1 },
      { id: "dish-7", name: "Sezar Salati", price: 49000, quantity: 1 },
      { id: "dish-13", name: "Turkcha Zafaron Paxlava", price: 38000, quantity: 2 }
    ],
    totalAmount: 210000,
    paymentMethod: "cash",
    status: "delivering",
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString()
  },
  {
    id: "ORD-9419",
    customerName: "Alisher Qodirov",
    customerPhone: "+998 93 500 44 88",
    deliveryType: "dineIn",
    tableNumber: "T-7",
    deliveryAddress: "",
    items: [
      { id: "dish-8", name: "G'ijduvoncha Mayin Lyulya Kabob", price: 38000, quantity: 4 },
      { id: "dish-16", name: "Anor Sharbat", price: 28000, quantity: 2 }
    ],
    totalAmount: 208000,
    paymentMethod: "card",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString()
  },
  {
    id: "ORD-9418",
    customerName: "Sherzod Jo'rayev",
    customerPhone: "+998 99 333 22 11",
    deliveryType: "delivery",
    tableNumber: "",
    deliveryAddress: "Mirzo Ulug'bek tumani, Mustaqillik shoh ko'chasi 14",
    items: [
      { id: "dish-11", name: "Ribay Steyk", price: 135000, quantity: 2 },
      { id: "dish-6", name: "Mujskoy Kapriz", price: 46000, quantity: 1 }
    ],
    totalAmount: 316000,
    paymentMethod: "card",
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  }
];

// Seed Mock Table Reservations for Admin
export const initialReservations = [
  {
    id: "RES-501",
    fullName: "Nodirbek Salimov",
    phone: "+998 90 111 22 33",
    date: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString().split('T')[0],
    time: "19:30",
    guests: "4",
    zone: "VIP Alohida Xona (6-12 kishi)",
    specialRequests: "Tug'ilgan kun nishonlanadi, stolga sham va gullar qo'yilsin.",
    status: "confirmed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: "RES-502",
    fullName: "Madina Rahimova",
    phone: "+998 94 444 55 66",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
    time: "20:00",
    guests: "2",
    zone: "Ochiq Havo Terrasasi (Manzarali)",
    specialRequests: "Romantik kechki ovqat, sokin musiqa yonida.",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  }
];
