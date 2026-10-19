import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "Manteau Double Boutonnage en Cachemire",
    slug: "manteau-double-boutonnage-cachemire",
    description: "Confectionné avec une attention rigoureuse aux proportions, ce manteau long d'inspiration tailleur présente une coupe droite structurée et un boutonnage croisé signature. Réalisé dans une laine mélangée au cachemire italien d'une douceur exceptionnelle, il est entièrement doublé de cupro soyeux pour un tombé impeccable.",
    short_description: "Laine et cachemire peigné d'Italie. Coupe longue structurée, double boutonnage croisé.",
    price: 890,
    regular_price: 890,
    sale_price: null,
    on_sale: false,
    sku: "ATL-COAT-001",
    stock_quantity: 12,
    stock_status: "instock",
    status: "publish",
    material: "90% Laine vierge, 10% Cachemire peigné",
    origin: "Atelier de confection à Milan, Italie",
    featured: true,
    date_created: "2026-09-15T10:00:00.000Z",
    categories: [
      { id: 1, name: "Femme", slug: "femme" },
      { id: 3, name: "Manteaux", slug: "manteaux" }
    ],
    images: [
      {
        id: 1001,
        src: "/images/prod_cashmere_overcoat_1792324545026.jpg",
        alt: "Manteau double boutonnage camel en cachemire et laine"
      }
    ],
    attributes: [
      {
        name: "Taille",
        options: ["34", "36", "38", "40", "42"]
      },
      {
        name: "Couleur",
        options: ["Camel", "Anthracite", "Noir"]
      }
    ]
  },
  {
    id: 102,
    name: "Chemise Fluide en Soie Drapée",
    slug: "chemise-fluide-soie-drape",
    description: "Une chemise au col fluide conçue dans un crêpe de soie lourd au toucher sablé délicat. Sa coupe décontractée mais sophistiquée épouse naturellement les mouvements, avec des poignets mousquetaires allongés et des boutons en nacre naturelle cousus à la main.",
    short_description: "Crêpe de soie ivoire lavé. Boutons nacre naturelle, silhouette décontractée.",
    price: 360,
    regular_price: 420,
    sale_price: 360,
    on_sale: true,
    sku: "ATL-SHIRT-004",
    stock_quantity: 18,
    stock_status: "instock",
    status: "publish",
    material: "100% Crêpe de soie de mûrier 18mm",
    origin: "Atelier lyonnais, France",
    featured: true,
    date_created: "2026-09-20T14:30:00.000Z",
    categories: [
      { id: 1, name: "Femme", slug: "femme" },
      { id: 4, name: "Chemises", slug: "chemises" }
    ],
    images: [
      {
        id: 1002,
        src: "/images/prod_silk_blouse_1792324546779.jpg",
        alt: "Chemise fluide en soie ivoire drapée"
      }
    ],
    attributes: [
      {
        name: "Taille",
        options: ["XS", "S", "M", "L"]
      },
      {
        name: "Couleur",
        options: ["Ivoire", "Sable", "Noir Profond"]
      }
    ]
  },
  {
    id: 103,
    name: "Bottines Chelsea en Cuir Pleine Fleur",
    slug: "bottines-chelsea-cuir-pleine-fleur",
    description: "Fabriquées à la main dans les Marches selon la méthode traditionnelle du cousu Blake, ces bottines chelsea allient lignes épurées et durabilité exemplaire. Le cuir de veau pleine fleur au tannage végétal développe une patine noble au fil du temps.",
    short_description: "Cuir de veau pleine fleur italien. Cousu Blake authentique, semelle cuir biseautée.",
    price: 520,
    regular_price: 520,
    sale_price: null,
    on_sale: false,
    sku: "ATL-BOOT-009",
    stock_quantity: 8,
    stock_status: "instock",
    status: "publish",
    material: "100% Cuir de veau pleine fleur, doublure veau",
    origin: "Montegranaro, Italie",
    featured: true,
    date_created: "2026-09-28T09:15:00.000Z",
    categories: [
      { id: 2, name: "Homme", slug: "homme" },
      { id: 5, name: "Chaussures", slug: "chaussures" }
    ],
    images: [
      {
        id: 1003,
        src: "/images/prod_chelsea_boots_1792324546289.jpg",
        alt: "Bottines Chelsea noires artisanales en cuir pleine fleur"
      }
    ],
    attributes: [
      {
        name: "Taille",
        options: ["40", "41", "42", "43", "44", "45"]
      },
      {
        name: "Couleur",
        options: ["Noir Ébène", "Châtaigne"]
      }
    ]
  },
  {
    id: 104,
    name: "Cabas Minimaliste Cuir Grainé",
    slug: "cabas-minimaliste-cuir-graine",
    description: "L'archétype du sac fonctionnel raffiné. Conçu sans logo ostentatoire, ce grand cabas offre un volume généreux structuré par des tranches teintées à la main avec une cire mate. Compartiment central renforcé, poche zippée intérieure et finitions en laiton brossé.",
    short_description: "Cuir de taurillon grainé souple. Finitions laiton brossé, marquage à chaud discret.",
    price: 740,
    regular_price: 740,
    sale_price: null,
    on_sale: false,
    sku: "ATL-BAG-012",
    stock_quantity: 14,
    stock_status: "instock",
    status: "publish",
    material: "Cuir de taurillon foulonné, intérieur suédé",
    origin: "Tannerie de Romans-sur-Isère, France",
    featured: true,
    date_created: "2026-10-02T16:45:00.000Z",
    categories: [
      { id: 6, name: "Accessoires", slug: "accessoires" },
      { id: 1, name: "Femme", slug: "femme" }
    ],
    images: [
      {
        id: 1004,
        src: "/images/prod_leather_tote_1792324546443.jpg",
        alt: "Sac cabas minimaliste en cuir grainé espresso"
      }
    ],
    attributes: [
      {
        name: "Taille",
        options: ["Unique (38 x 30 x 14 cm)"]
      },
      {
        name: "Couleur",
        options: ["Espresso", "Noir", "Cognac"]
      }
    ]
  },
  {
    id: 105,
    name: "Pantalon Tailleur Laine Froide & Pinces",
    slug: "pantalon-tailleur-laine-froide",
    description: "Une silhouette architecturale fluide avec un pli frontal net et une taille haute ajustée. La serge de laine froide italienne Super 120's confère une fraîcheur naturelle et un drapé spectaculaire en toute saison.",
    short_description: "Laine froide Super 120's. Coupe droite fluide, double pli d'aisance.",
    price: 290,
    regular_price: 290,
    sale_price: null,
    on_sale: false,
    sku: "ATL-PANT-015",
    stock_quantity: 20,
    stock_status: "instock",
    status: "publish",
    material: "100% Laine vierge peignée Super 120's",
    origin: "Biella, Piémont, Italie",
    featured: false,
    date_created: "2026-10-05T11:20:00.000Z",
    categories: [
      { id: 2, name: "Homme", slug: "homme" },
      { id: 1, name: "Femme", slug: "femme" }
    ],
    images: [
      {
        id: 1005,
        src: "/images/prod_tailored_pants_1792324562053.jpg",
        alt: "Pantalon tailleur ivoire à pinces en laine froide"
      }
    ],
    attributes: [
      {
        name: "Taille",
        options: ["36", "38", "40", "42", "44"]
      },
      {
        name: "Couleur",
        options: ["Craie", "Gris Ardoise", "Noir"]
      }
    ]
  },
  {
    id: 106,
    name: "Pull Col Roulé Cachemire Épais",
    slug: "pull-col-roule-cachemire-epais",
    description: "Tricoté en jauge 5 avec quatre fils de pur cachemire de Mongolie, ce col roulé offre un confort thermique enveloppant et une douceur inégalable. Bords-côtes renforcés aux poignets et à la taille pour conserver sa tenue année après année.",
    short_description: "Pur cachemire 4 fils jauge 5. Col cheminée enveloppant, finitions tubulaires.",
    price: 480,
    regular_price: 540,
    sale_price: 480,
    on_sale: true,
    sku: "ATL-KNIT-021",
    stock_quantity: 6,
    stock_status: "instock",
    status: "publish",
    material: "100% Pur cachemire peigné Grade A",
    origin: "Atelier de tricotage à Hawick, Écosse",
    featured: false,
    date_created: "2026-10-08T08:00:00.000Z",
    categories: [
      { id: 2, name: "Homme", slug: "homme" },
      { id: 1, name: "Femme", slug: "femme" }
    ],
    images: [
      {
        id: 1006,
        src: "/images/prod_knit_turtleneck_1792324562877.jpg",
        alt: "Pull col roulé en cachemire épais crème"
      }
    ],
    attributes: [
      {
        name: "Taille",
        options: ["S", "M", "L", "XL"]
      },
      {
        name: "Couleur",
        options: ["Avoine", "Taupe", "Noir Minéral"]
      }
    ]
  },
  {
    id: 107,
    name: "Veste Tailleur Déstructurée en Lin & Laine",
    slug: "veste-tailleur-destructuree-lin-laine",
    description: "Une élégance sans rigidité. Modèle non doublé avec emmanchure 'spalla camicia' à l'italienne, épaule napolitaine naturelle et poches plaquées discrètes. L'alliage de lin brut et de laine fine apporte une texture vivante et respirante.",
    short_description: "Lin d'Europe et laine fine non doublée. Épaule napolitaine souple.",
    price: 610,
    regular_price: 610,
    sale_price: null,
    on_sale: false,
    sku: "ATL-BLAZER-033",
    stock_quantity: 9,
    stock_status: "instock",
    status: "publish",
    material: "55% Lin européen, 45% Laine vierge",
    origin: "Naples, Italie",
    featured: false,
    date_created: "2026-10-10T15:10:00.000Z",
    categories: [
      { id: 2, name: "Homme", slug: "homme" }
    ],
    images: [
      {
        id: 1007,
        src: "/images/prod_linen_blazer_1792324563858.jpg",
        alt: "Veste tailleur déstructurée en lin et laine"
      }
    ],
    attributes: [
      {
        name: "Taille",
        options: ["46", "48", "50", "52", "54"]
      },
      {
        name: "Couleur",
        options: ["Sable Chaud", "Bleu Nuit"]
      }
    ]
  },
  {
    id: 108,
    name: "Écharpe Signature en Cachemire Peigné",
    slug: "echarpe-signature-cachemire-peigne",
    description: "Tissée sur des métiers à tisser traditionnels, cette étole généreuse de 200 x 70 cm est brossée avec des chardons naturels pour créer un effet vaporeux et soyeux. Franges délicates roulées à la main.",
    short_description: "Grand format 200 x 70 cm. Finition brossée au chardon végétal naturel.",
    price: 210,
    regular_price: 210,
    sale_price: null,
    on_sale: false,
    sku: "ATL-ACC-045",
    stock_quantity: 25,
    stock_status: "instock",
    status: "publish",
    material: "100% Cachemire mongol peigné",
    origin: "Atelier textile de Côme, Italie",
    featured: false,
    date_created: "2026-10-12T17:30:00.000Z",
    categories: [
      { id: 6, name: "Accessoires", slug: "accessoires" }
    ],
    images: [
      {
        id: 1008,
        src: "/images/prod_cashmere_scarf_1792324565203.jpg",
        alt: "Écharpe généreuse en cachemire peigné couleur crème"
      }
    ],
    attributes: [
      {
        name: "Taille",
        options: ["Taille Unique (200x70cm)"]
      },
      {
        name: "Couleur",
        options: ["Crème Brûlée", "Gris Chiné", "Noir Mat"]
      }
    ]
  },
  {
    id: 109,
    name: "Prototype Blouson Cuir Velours (Brouillon)",
    slug: "prototype-blouson-cuir-velours",
    description: "Échantillon d'atelier pour la collection capsule d'hiver. En attente de validation des patrons et de réception du cuir suédé de chèvre.",
    short_description: "Modèle en cours de mise au point. Non visible pour le public.",
    price: 950,
    regular_price: 950,
    sale_price: null,
    on_sale: false,
    sku: "ATL-DRAFT-999",
    stock_quantity: 1,
    stock_status: "instock",
    status: "draft", // DRAFT PRODUCT - MUST NEVER APPEAR IN CLIENT CATALOG!
    material: "Cuir suédé de chèvre",
    origin: "Atelier Paris",
    featured: false,
    date_created: "2026-10-14T09:00:00.000Z",
    categories: [
      { id: 2, name: "Homme", slug: "homme" }
    ],
    images: [
      {
        id: 1009,
        src: "/images/prod_suede_jacket_1792324564550.jpg",
        alt: "Prototype blouson cuir velours"
      }
    ],
    attributes: [
      {
        name: "Taille",
        options: ["48", "50"]
      },
      {
        name: "Couleur",
        options: ["Tabac"]
      }
    ]
  }
];
