export interface Airport {
  iata: string;
  name: string;
  city: string;
  label: string; // e.g. "CGK – Jakarta Soekarno-Hatta"
}

export const INDONESIAN_AIRPORTS: Airport[] = [
  { iata: "CGK", name: "Soekarno-Hatta International Airport", city: "Jakarta", label: "CGK – Jakarta Soekarno-Hatta" },
  { iata: "DPS", name: "Ngurah Rai International Airport", city: "Bali", label: "DPS – Bali Ngurah Rai" },
  { iata: "SUB", name: "Juanda International Airport", city: "Surabaya", label: "SUB – Surabaya Juanda" },
  { iata: "KNO", name: "Kualanamu International Airport", city: "Medan", label: "KNO – Medan Kualanamu" },
  { iata: "UPG", name: "Sultan Hasanuddin International Airport", city: "Makassar", label: "UPG – Makassar Hasanuddin" },
  { iata: "BPN", name: "Sultan Aji Muhammad Sulaiman Airport", city: "Balikpapan", label: "BPN – Balikpapan SAMS" },
  { iata: "LOP", name: "Lombok International Airport", city: "Lombok", label: "LOP – Lombok International" },
  { iata: "PLM", name: "Sultan Mahmud Badaruddin II Airport", city: "Palembang", label: "PLM – Palembang SMB II" },
  { iata: "PNK", name: "Supadio International Airport", city: "Pontianak", label: "PNK – Pontianak Supadio" },
  { iata: "MDC", name: "Sam Ratulangi International Airport", city: "Manado", label: "MDC – Manado Sam Ratulangi" },
  { iata: "SOC", name: "Adi Soemarmo International Airport", city: "Solo", label: "SOC – Solo Adi Soemarmo" },
  { iata: "YIA", name: "Yogyakarta International Airport", city: "Yogyakarta", label: "YIA – Yogyakarta International" },
  { iata: "SRG", name: "Ahmad Yani International Airport", city: "Semarang", label: "SRG – Semarang Ahmad Yani" },
  { iata: "PKU", name: "Sultan Syarif Kasim II Airport", city: "Pekanbaru", label: "PKU – Pekanbaru SSK II" },
  { iata: "BTH", name: "Hang Nadim International Airport", city: "Batam", label: "BTH – Batam Hang Nadim" },
];
