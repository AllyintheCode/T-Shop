import { Product, Category } from "../components/types";

export const MOCK_CATEGORIES: Category[] = [
  { _id: "c1", title: "Elektronika", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500" },
  { _id: "c2", title: "Geyim", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500" },
  { _id: "c3", title: "Ayaqqabı", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
  { _id: "c4", title: "Aksessuar", image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500" },
  { _id: "c5", title: "İdman", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: "p1",
    title: "Premium Simsiz Qulaqlıq - Noise Cancelling",
    price: 349.99,
    description: "Ən son səs texnologiyası ilə təchiz olunmuş, 40 saatlıq batareya ömrünə malik səs-küy ləğvetmə funksiyalı qulaqlıq. Musiqi keyfiyyətini zirvədə hiss edin.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    categories: ["Elektronika", "Aksessuar"]
  },
  {
    _id: "p2",
    title: "Minimalist Qol Saatı - Qara Paslanmaz Çelik",
    price: 189.50,
    description: "Sadəliyi sevənlər üçün ideal seçim. Gündəlik və klassik geyimlərlə uyğunlaşan, suya davamlı premium saat.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    categories: ["Aksessuar"]
  },
  {
    _id: "p3",
    title: "Nike Air Max 2026 Edition",
    price: 299.00,
    description: "İdman və gündəlik istifadə üçün rahatlığın ən üst səviyyəsi. Nəfəsalan material və xüsusi daban dəstəyi ilə addımlarınız daha yüngül olacaq.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    categories: ["Ayaqqabı", "İdman"]
  },
  {
    _id: "p4",
    title: "Müasir Dizaynlı Kamera - 4K Mirrorless",
    price: 1549.99,
    description: "Peşəkar fotoqraflar və vloggerlər üçün mükəmməl cihaz. 4K video çəkiliş, sürətli avtofokus və kompakt dizayn.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    categories: ["Elektronika"]
  },
  {
    _id: "p5",
    title: "Oversize Qara T-Shirt (Premium Pambıq)",
    price: 45.00,
    description: "100% orqanik pambıqdan hazırlanmış, nəfəs alan və isti yay günlərində bədəni tərlətməyən rahat t-shirt.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    categories: ["Geyim"]
  },
  {
    _id: "p6",
    title: "Apple MacBook Pro M3 Max",
    price: 4500.00,
    description: "Yüksək performans tələb edən qrafik dizaynerlər və proqramçılar üçün ən güclü noutbuk.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    categories: ["Elektronika"]
  },
  {
    _id: "p7",
    title: "Dəri İş Çantası - Qəhvəyi",
    price: 120.00,
    description: "Təbii dəridən hazırlanmış, noutbuk və sənədləriniz üçün geniş bölmələri olan zərif çanta.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
    categories: ["Aksessuar"]
  },
  {
    _id: "p8",
    title: "Ağıllı Ev Dinamiki (Smart Speaker)",
    price: 99.90,
    description: "Səsinizlə idarə olunan ağıllı dinamik. Musiqi oxudun, hava proqnozunu öyrənin və smart ev cihazlarınızı idarə edin.",
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800",
    categories: ["Elektronika"]
  },
  {
    _id: "p9",
    title: "Gündəlik İdman Ayaqqabısı - Ağ",
    price: 110.00,
    description: "Hər fəslə uyğun, asan təmizlənən və hər geyimlə kombinlənən klassik ağ krossovka.",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
    categories: ["Ayaqqabı"]
  },
  {
    _id: "p10",
    title: "Klassik Qış Paltosu - Yun",
    price: 250.00,
    description: "Soyuq havalarda sizi həm isti saxlayacaq, həm də çox şıq göstərəcək yüksək keyfiyyətli yun palto.",
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800",
    categories: ["Geyim"]
  },
  {
    _id: "p11",
    title: "Meksika Qəhvəsi 500qr",
    price: 25.50,
    description: "Təzə qovrulmuş, zəngin aromalı 100% Arabica qəhvə dənələri.",
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800",
    categories: ["Digər"]
  },
  {
    _id: "p12",
    title: "Suya Davamlı Gödəkcə - Yaşıl",
    price: 145.00,
    description: "Yağışlı və küləkli günlər üçün ideal, yüngül materialdan hazırlanmış idman gödəkcəsi.",
    image: "https://images.unsplash.com/photo-1551028719-0125fd6b7eb1?w=800",
    categories: ["Geyim", "İdman"]
  }
];
