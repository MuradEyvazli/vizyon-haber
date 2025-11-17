import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo';
const NEWS_API_URL = import.meta.env.VITE_NEWS_API_URL || 'https://newsapi.org/v2';

// NewsAPI.org client
const newsApiClient = axios.create({
  baseURL: NEWS_API_URL,
  timeout: 10000,
  params: {
    apiKey: NEWS_API_KEY,
  },
});

/**
 * Gerçek haberlerçek - NewsAPI.org
 * @param {Object} options - Arama parametreleri
 * @returns {Promise<Array>} Haber listesi
 */
export const fetchRealNews = async (options = {}) => {
  // API key yoksa direkt demo data dön
  if (!NEWS_API_KEY || NEWS_API_KEY === 'demo') {
    console.log('📰 Demo veriler kullanılıyor (API key yok)');
    return getDemoNews(options);
  }

  try {
    const {
      category = '',
      country = 'tr',
      query = '',
      pageSize = 20,
      page = 1,
    } = options;

    // NewsAPI ücretsiz plan: /top-headlines sadece us, gb, de, fr gibi ülkeleri destekler
    // Türkiye için /everything endpoint'ini kullanıyoruz
    let endpoint = '/everything';
    let params = {
      q: query || 'Türkiye OR Turkey OR Turkish OR Ankara OR Istanbul',
      language: 'tr',
      sortBy: 'publishedAt',
      pageSize,
      page,
    };

    // Kategori varsa, query'e ekle
    if (category) {
      const categoryMap = {
        'teknoloji': 'technology OR teknoloji',
        'technology': 'technology OR teknoloji',
        'spor': 'sports OR spor',
        'ekonomi': 'economy OR ekonomi OR business',
        'sağlık': 'health OR sağlık',
        'bilim': 'science OR bilim',
      };
      params.q = categoryMap[category.toLowerCase()] || category;
    }

    console.log('📡 NewsAPI çağrısı yapılıyor:', endpoint, params);
    const response = await newsApiClient.get(endpoint, { params });

    if (response.data.status === 'ok') {
      console.log('✅ NewsAPI başarılı:', response.data.articles.length, 'haber');

      // Eğer hala 0 haber geliyorsa, global haberler çek
      if (response.data.articles.length === 0) {
        console.log('⚠️ Türkiye haberi bulunamadı, global haberler çekiliyor...');
        const globalResponse = await newsApiClient.get('/top-headlines', {
          params: {
            country: 'us',
            pageSize,
            page,
          }
        });

        if (globalResponse.data.articles.length > 0) {
          console.log('✅ Global haberler:', globalResponse.data.articles.length);
          const articles = globalResponse.data.articles.map((article, index) => ({
            id: `${Date.now()}-${index}`,
            title: article.title,
            summary: article.description || article.content?.substring(0, 200) || 'Detaylar için haberi okuyun.',
            content: article.content,
            category: category || 'Genel',
            slug: createSlug(article.title),
            image: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
            publishedAt: article.publishedAt,
            source: article.source?.name || 'Bilinmeyen Kaynak',
            url: article.url,
            author: article.author,
          }));
          return articles;
        }
      }

      // NewsAPI formatını kendi formatımıza dönüştür
      const articles = response.data.articles.map((article, index) => ({
        id: `${Date.now()}-${index}`,
        title: article.title,
        summary: article.description || article.content?.substring(0, 200) || 'Detaylar için haberi okuyun.',
        content: article.content,
        category: category || 'Genel',
        slug: createSlug(article.title),
        image: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
        publishedAt: article.publishedAt,
        source: article.source?.name || 'Bilinmeyen Kaynak',
        url: article.url,
        author: article.author,
      }));

      return articles;
    }

    throw new Error('NewsAPI hatası');
  } catch (error) {
    console.error('❌ NewsAPI fetch error:', error.message);
    console.error('Hata detayı:', error.response?.data || error);

    // Fallback: API çalışmazsa demo veriler dön
    console.log('⚠️ API hatası, demo veriler kullanılıyor');
    return getDemoNews(options);
  }
};

/**
 * Kategorilere göre haber çek
 */
export const fetchNewsByCategory = async (category) => {
  return fetchRealNews({ category: category.toLowerCase(), pageSize: 10 });
};

/**
 * Arama yap
 */
export const searchNews = async (query) => {
  return fetchRealNews({ query, pageSize: 15 });
};

/**
 * Slug oluştur
 */
function createSlug(title) {
  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  };

  return title
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Demo/Fallback haberler - API çalışmazsa
 */
function getDemoNews(options = {}) {
  const demoArticles = [
    {
      id: 1,
      title: "Türkiye'nin Yeni Dijital Dönüşüm Stratejisi Açıklandı",
      summary: "Cumhurbaşkanlığı Dijital Dönüşüm Ofisi tarafından hazırlanan yeni strateji belgesi, ülkenin teknoloji altyapısını güçlendirecek kapsamlı adımları içeriyor. E-devlet hizmetlerinin genişletilmesi ve yapay zeka entegrasyonu öne çıkıyor.",
      content: "Türkiye'nin dijital dönüşüm yol haritası bugün açıklandı. Cumhurbaşkanlığı Dijital Dönüşüm Ofisi'nin hazırladığı kapsamlı strateji belgesi, önümüzdeki 5 yıl içinde hayata geçirilecek önemli projeleri içeriyor.\n\nE-devlet hizmetlerinin genişletilmesi, yapay zeka destekli kamu hizmetleri, akıllı şehir uygulamaları ve siber güvenlik altyapısının güçlendirilmesi stratejinin ana başlıklarını oluşturuyor.\n\nUzmanlar, bu dönüşümün vatandaşların günlük yaşamını kolaylaştıracağını ve kamu hizmetlerinde verimliliği artıracağını belirtiyor.",
      category: 'Teknoloji',
      slug: 'turkiye-dijital-donusum-stratejisi',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
      publishedAt: new Date().toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Ahmet Yılmaz',
      url: '#',
    },
    {
      id: 2,
      title: 'Merkez Bankası Faiz Kararını Açıkladı',
      summary: 'Merkez Bankası Para Politikası Kurulu toplantısında faiz oranlarını değiştirmeme kararı aldı. Ekonomi uzmanları kararı değerlendirdi.',
      content: 'Merkez Bankası Para Politikası Kurulu (PPK), bugün gerçekleştirdiği toplantıda politika faizini değiştirmeme kararı aldı. Kurul, enflasyon görünümündeki iyileşmeyi dikkate alarak mevcut parasal duruşun korunmasına karar verdi.\n\nEkonomi uzmanları, kararın piyasalar tarafından olumlu karşılandığını ve istikrara katkı sağlayacağını belirtiyor. Dolar/TL kuru açıklama sonrası sakin seyrini sürdürdü.',
      category: 'Ekonomi',
      slug: 'merkez-bankasi-faiz-karari',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Zeynep Kaya',
      url: '#',
    },
    {
      id: 3,
      title: 'Yapay Zeka Destekli Sağlık Sistemi Hayata Geçiyor',
      summary: 'Sağlık Bakanlığı, yapay zeka destekli erken teşhis sistemini 81 ilde devreye alıyor. Sistem, hastalıkları %30 daha erken tespit edebiliyor.',
      content: 'Sağlık Bakanlığı\'nın geliştirdiği yapay zeka tabanlı erken teşhis sistemi, tüm illerde hizmete giriyor. Pilot uygulamada başarılı sonuçlar veren sistem, kanser ve kalp hastalıklarını %30 daha erken tespit edebiliyor.\n\nSistem, hastaların görüntüleme sonuçlarını analiz ederek doktorlara karar desteği sağlıyor. Uzmanlar, bu teknolojinin erken teşhis oranlarını artırarak hayat kurtaracağını belirtiyor.',
      category: 'Sağlık',
      slug: 'yapay-zeka-saglik-sistemi',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Dr. Mehmet Öz',
      url: '#',
    },
    {
      id: 4,
      title: 'Avrupa Birliği Yeni İklim Paketi Üzerinde Anlaştı',
      summary: 'AB üyesi ülkeler, 2030 hedeflerine ulaşmak için yenilenebilir enerjiye geçiş sürecini hızlandıracak yeni teşvik paketini onayladı.',
      content: 'Avrupa Birliği liderleri, Brüksel\'de gerçekleştirdikleri zirvede tarihi bir iklim anlaşmasına imza attı. Anlaşma, 2030 yılına kadar karbon emisyonlarında %55 azalma hedefliyor.\n\nPaket, yenilenebilir enerji yatırımlarına önemli teşvikler içeriyor. Üye ülkeler, fosil yakıtlardan aşamalı olarak çıkış için somut adımlar atacak.',
      category: 'Dünya',
      slug: 'ab-iklim-paketi',
      image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Can Yılmaz',
      url: '#',
    },
    {
      id: 5,
      title: 'Yerli Otomobil Üretiminde Rekor Kırıldı',
      summary: 'TOGG fabrikasından çıkan araç sayısı aylık 10 bin birimi aştı. Şirket yetkilileri, ihracat için görüşmelerin başladığını açıkladı.',
      content: 'Türkiye\'nin otomobili TOGG, üretim rekoru kırdı. Gemlik tesislerinden çıkan araç sayısı aylık 10 bin adedi geçti. Şirket yetkilileri, üretim kapasitesini artırma çalışmalarının sürdüğünü belirtti.\n\nİhracat planları da hız kazanıyor. TOGG, önümüzdeki çeyrekte Avrupa pazarına giriş için görüşmelere başladı.',
      category: 'Ekonomi',
      slug: 'togg-uretim-rekoru',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Ayşe Demir',
      url: '#',
    },
    {
      id: 6,
      title: 'Kripto Para Düzenlemeleri Küresel Koordinasyona Gidiyor',
      summary: 'G20 ülkeleri, dijital varlıkların düzenlenmesi konusunda ortak bir çerçeve oluşturma kararı aldı.',
      content: 'G20 ülkeleri, kripto para düzenlemeleri konusunda tarihi bir adım attı. Dijital varlıkların vergilendirilmesi ve şeffaflık standartları belirlendi.\n\nBitcoin ve Ethereum gibi kripto paraların düzenlenmesi için ortak çerçeve oluşturuldu. Uzmanlar, bu adımın piyasalara güven getireceğini söylüyor.',
      category: 'Ekonomi',
      slug: 'kripto-para-duzenleme',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Emre Yıldız',
      url: '#',
    },
    {
      id: 7,
      title: 'Türk Girişim Şirketi Silikon Vadisi\'nden 50 Milyon Dolar Yatırım Aldı',
      summary: 'İstanbul merkezli yapay zeka startup\'ı, doğal dil işleme teknolojisiyle büyük ilgi gördü.',
      content: 'İstanbul\'da faaliyet gösteren yapay zeka girişimi, Silikon Vadisi\'nin önde gelen yatırım fonlarından 50 milyon dolar yatırım aldı. Şirketin geliştirdiği chatbot platformu, 30\'dan fazla dili destekliyor.\n\nGirişim, kurumsal müşterilere özelleştirilmiş yapay zeka çözümleri sunuyor. Bu yatırımla birlikte global pazara açılma hedefleniyor.',
      category: 'Teknoloji',
      slug: 'turk-startup-yatirim',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Selin Arslan',
      url: '#',
    },
    {
      id: 8,
      title: 'Akdeniz\'de Arkeolojik Keşif: 2500 Yıllık Gemi Bulundu',
      summary: 'Antalya açıklarında yapılan araştırmalarda antik dönem ticaret gemisi tespit edildi.',
      content: 'Antalya açıklarında yapılan derin deniz araştırmalarında 2500 yıllık antik gemi batığı bulundu. Batıktan çıkarılan seramikler ve altın sikkelerin MÖ 5. yüzyıla ait olduğu belirlendi.\n\nArkeologlar, keşfin bölgenin ticaret tarihine ışık tutacağını belirtiyor. Batıkta yapılacak çalışmalar 2 yıl sürecek.',
      category: 'Kültür',
      slug: 'akdeniz-antik-gemi',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 25200000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Prof. Dr. Ali Kılıç',
      url: '#',
    },
    {
      id: 9,
      title: 'Yenilenebilir Enerji Kurulu Gücü 50 GW\'ı Geçti',
      summary: 'Enerji Bakanı, Türkiye\'nin rüzgar ve güneş enerjisi kurulu gücünün hedeflenen seviyeye ulaştığını duyurdu.',
      content: 'Türkiye, yenilenebilir enerji kurulu gücünde önemli bir dönüm noktasına ulaştı. Rüzgar ve güneş enerjisi kurulu gücü 50 GW\'ı geçti.\n\nEnerji ve Tabii Kaynaklar Bakanı, 2028 yılına kadar enerjinin %60\'ının yenilenebilir kaynaklardan sağlanacağını açıkladı.',
      category: 'Çevre',
      slug: 'yenilenebilir-enerji-50gw',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Elif Yaman',
      url: '#',
    },
    {
      id: 10,
      title: 'Uzay Turizmi Sektörüne Türk Şirketi de Katıldı',
      summary: 'Havacılık firması Delta-V Aerospace, stratosfer uçuşları için ön rezervasyon almaya başladı.',
      content: 'Türk havacılık şirketi Delta-V Aerospace, uzay turizmi sektörüne giriş yaptı. Şirket, stratosfer balonlarıyla 25 km yüksekliğe çıkarak 2 saatlik uzay deneyimi sunacak.\n\nİlk uçuş 2025 yılı sonunda gerçekleştirilecek. Ön rezervasyonlar başladı ve yoğun ilgi görüyor.',
      category: 'Bilim',
      slug: 'turk-uzay-turizm',
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 32400000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Murat Kaya',
      url: '#',
    },
    {
      id: 11,
      title: 'Siber Güvenlik Zirvesi İstanbul\'da Başladı',
      summary: '60 ülkeden 500\'den fazla uzmanın katıldığı zirve, yapay zeka destekli siber saldırılara karşı korunma stratejilerini tartışıyor.',
      content: 'İstanbul\'da düzenlenen Uluslararası Siber Güvenlik Zirvesi başladı. 60 ülkeden 500\'ün üzerinde uzman katılıyor.\n\nZirve gündeminde yapay zeka destekli saldırılara karşı savunma, blockchain tabanlı kimlik doğrulama ve kritik altyapıların korunması gibi konular yer alıyor.',
      category: 'Teknoloji',
      slug: 'siber-guvenlik-zirvesi',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 36000000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Ahmet Şahin',
      url: '#',
    },
    {
      id: 12,
      title: 'Eğitimde Metaverse Dönemi: İlk Sanal Sınıflar Açıldı',
      summary: 'Milli Eğitim Bakanlığı pilot projesinde, öğrenciler VR gözlüklerle tarih ve fen derslerini sanal ortamda deneyimliyor.',
      content: 'Milli Eğitim Bakanlığı\'nın metaverse pilot projesi hayata geçti. İlk aşamada 10 okulda öğrenciler, VR gözlüklerle tarih ve fen derslerini sanal ortamda işliyor.\n\nİlk sonuçlar, öğrenme verimliliğinde %40 artış gösteriyor. Proje başarılı olursa tüm okullara yaygınlaştırılacak.',
      category: 'Eğitim',
      slug: 'egitim-metaverse',
      image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 39600000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Fatma Yıldırım',
      url: '#',
    },
    {
      id: 13,
      title: 'Elektrikli Araç Şarj İstasyonları Her 50 Kilometrede',
      summary: 'Karayolları Genel Müdürlüğü, tüm otoyollarda hızlı şarj istasyonları kurulumunu tamamladı.',
      content: 'Türkiye\'nin tüm otoyollarında elektrikli araç şarj altyapısı tamamlandı. Her 50 kilometrede bir hızlı şarj istasyonu bulunuyor.\n\nYeni nesil şarj istasyonları, tam şarj süresini 15 dakikaya kadar düşürüyor. Bu gelişme, elektrikli araç kullanımını teşvik edecek.',
      category: 'Teknoloji',
      slug: 'elektrikli-arac-sarj',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 43200000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Kemal Aydın',
      url: '#',
    },
    {
      id: 14,
      title: 'Kuantum Bilgisayar Araştırmalarında Çığır Açan Gelişme',
      summary: 'TÜBİTAK\'ın desteklediği kuantum bilişim laboratuvarı, odaklanma süresi rekor kıran qubit yapısı geliştirdi.',
      content: 'TÜBİTAK Kuantum Bilişim Laboratuvarı, dünya çapında önemli bir başarıya imza attı. Geliştirilen yeni qubit yapısı, odaklanma süresinde rekor kırdı.\n\nBu teknoloji, şifreleme algoritmalarında ve ilaç geliştirmede devrim yaratabilir. Araştırma sonuçları Nature dergisinde yayınlandı.',
      category: 'Bilim',
      slug: 'kuantum-bilgisayar',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 46800000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Prof. Dr. Ayşe Koç',
      url: '#',
    },
    {
      id: 15,
      title: 'Blockchain Tabanlı Seçim Sistemi Test Ediliyor',
      summary: 'YSK, mahalle muhtarlığı seçimlerinde blockchain tabanlı dijital oy kullanma sistemini test ediyor.',
      content: 'Yüksek Seçim Kurulu, blockchain teknolojisini seçim sistemine entegre etme çalışmalarına başladı. Mahalle muhtarlığı seçimlerinde pilot uygulama yapılıyor.\n\nSistem, manipülasyonu tamamen engelleyerek %100 şeffaflık sağlıyor. Başarılı olması halinde genel seçimlerde de kullanılabilir.',
      category: 'Politika',
      slug: 'blockchain-secim',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 50400000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Hasan Çelik',
      url: '#',
    },
    {
      id: 16,
      title: 'Akıllı Şehir Uygulamaları 81 İlde Yaygınlaşıyor',
      summary: 'Çevre ve Şehircilik Bakanlığı\'nın akıllı şehir projesi kapsamında IoT sensörleri devreye giriyor.',
      content: 'Çevre ve Şehircilik Bakanlığı\'nın akıllı şehir projesi hız kazandı. 81 ilde trafik yönetimi, atık toplama ve enerji tasarrufu için IoT sensörleri kuruldu.\n\nİstanbul\'da pilot uygulamada trafik yoğunluğu %20 azaldı. Proje, vatandaşların yaşam kalitesini artırmayı hedefliyor.',
      category: 'Teknoloji',
      slug: 'akilli-sehir',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 54000000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Deniz Aktaş',
      url: '#',
    },
    {
      id: 17,
      title: 'Gen Terapisi ile Nadir Hastalıklara Çözüm',
      summary: 'Türk bilim insanlarının geliştirdiği CRISPR tabanlı gen terapisi, orak hücreli anemide %85 başarı gösterdi.',
      content: 'Türk bilim insanlarının geliştirdiği gen terapisi uluslararası başarı kazandı. CRISPR teknolojisi kullanılarak geliştirilen tedavi, orak hücreli anemi hastalarında %85 başarı oranı gösterdi.\n\nTedavi, Sağlık Bakanlığı\'nın onayını bekliyor. Onaylanması halinde binlerce hasta şifa bulacak.',
      category: 'Sağlık',
      slug: 'gen-terapisi',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 57600000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Dr. Zeynep Arslan',
      url: '#',
    },
    {
      id: 18,
      title: 'Sürdürülebilir Tarım İçin Drone Teknolojisi',
      summary: 'Tarım ve Orman Bakanlığı, drone destekli ilaçlama ve sulama sistemlerini teşvik ediyor.',
      content: 'Tarım ve Orman Bakanlığı, sürdürülebilir tarım için drone teknolojisine yatırım yapıyor. Çiftçilere drone destekli ilaçlama ve sulama sistemleri teşvik ediliyor.\n\nPilot uygulamalarda su tasarrufu %30, pestisit kullanımı %40 azaldı. Program başarılı olursa yaygınlaştırılacak.',
      category: 'Çevre',
      slug: 'drone-tarim',
      image: 'https://images.unsplash.com/photo-1527847263472-aa5338d178b8?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 61200000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Ali Yılmaz',
      url: '#',
    },
    {
      id: 19,
      title: '5G Altyapısı Tamamlandı, 6G Çalışmaları Başladı',
      summary: 'Türkiye\'nin tamamında 5G hizmeti verilmeye başlandı. Araştırma merkezleri 6G için hazırlıklara başladı.',
      content: 'Türkiye, 5G altyapısını tamamlayarak yeni nesil mobil iletişime geçiş yaptı. Tüm illerde 5G hizmeti verilmeye başlandı.\n\nAraştırma merkezleri, 2030\'da devreye girecek 6G teknolojisi için çalışmalara başladı. Türkiye, 6G standartlarının belirlenmesinde aktif rol alacak.',
      category: 'Teknoloji',
      slug: '5g-6g-altyapi',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 64800000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Cem Özkan',
      url: '#',
    },
    {
      id: 20,
      title: 'Plastik Atıkları Yakan Bakteriler Bulundu',
      summary: 'Ege Üniversitesi araştırmacıları, plastik polimerlerini parçalayabilen bakteri türü keşfetti.',
      content: 'Ege Üniversitesi Biyoloji Bölümü araştırmacıları, deniz suyundan izole ettikleri bakterinin plastik polimerlerini parçalayabildiğini keşfetti.\n\nBu buluş, okyanus kirliliğine karşı umut veriyor. Araştırma, Science dergisinde yayınlandı ve dünya çapında ilgi gördü.',
      category: 'Çevre',
      slug: 'plastik-yiyen-bakteri',
      image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 68400000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Prof. Dr. Leyla Demir',
      url: '#',
    },
  ];

  console.log('📰 Demo veriler yükleniyor...');
  console.warn('💡 Gerçek haberler için .env dosyasına VITE_NEWS_API_KEY ekleyin');
  console.warn('📍 Ücretsiz API key: https://newsapi.org/register');

  const result = demoArticles.slice(0, options.pageSize || 20);
  console.log('✅ Demo veriler hazır:', result.length, 'haber');
  return result;
}

export default {
  fetchRealNews,
  fetchNewsByCategory,
  searchNews,
};
