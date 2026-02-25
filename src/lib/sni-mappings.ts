export interface Yrkesomrade {
  id: string;
  namn: string;
  sniKoder: string[];
  beskrivning: string;
}

export const YRKESOMRADEN: Yrkesomrade[] = [
  {
    id: "bygg-anlaggning",
    namn: "Bygg och anläggning",
    sniKoder: ["41", "42", "43"],
    beskrivning: "Byggverksamhet, anläggningsarbeten, specialiserad bygg",
  },
  {
    id: "barn-fritid",
    namn: "Barn och fritid",
    sniKoder: ["85.1", "88.91", "93"],
    beskrivning: "Förskola, barnomsorg, sport och fritid",
  },
  {
    id: "el-energi",
    namn: "El och energi",
    sniKoder: ["35", "43.21"],
    beskrivning: "Elinstallation, energibolag, solenergi",
  },
  {
    id: "vvs-fastighet",
    namn: "VVS och fastighet",
    sniKoder: ["43.22", "68", "81"],
    beskrivning: "VVS-installation, fastighetsförvaltning",
  },
  {
    id: "vard-omsorg",
    namn: "Vård och omsorg",
    sniKoder: ["86", "87", "88"],
    beskrivning: "Hälso- och sjukvård, äldreomsorg, sociala insatser",
  },
  {
    id: "industri",
    namn: "Industri",
    sniKoder: ["10-33"],
    beskrivning: "Tillverkning (livsmedel, metall, maskin, fordon etc.)",
  },
  {
    id: "forsaljning-service",
    namn: "Försäljning och service",
    sniKoder: ["45-47", "55", "56"],
    beskrivning: "Handel, hotell, restaurang",
  },
  {
    id: "fordon-transport",
    namn: "Fordon och transport",
    sniKoder: ["45.2", "45.4", "49-52"],
    beskrivning: "Bilverkstad, åkeri, transport, logistik",
  },
];
