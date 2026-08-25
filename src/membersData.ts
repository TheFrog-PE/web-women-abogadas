export interface Member {
  id: string;
  name: string;
  role: string;
  sector: string;
  currentCargo: string;
  complianceExperience: string;
  profession: string;
  academicBg: string[];
  workBg: string[];
  linkedin: string;
  photo: string;
  tags?: string[];
}

export const MEMBERS_DATA: Member[] = [
  {
    id: "adriana-gomez",
    name: "ADRIANA PATRICIA GÓMEZ BARAJAS",
    role: "PRESIDENTA WIC COLOMBIA",
    sector: "SOCIA CREMADES & CALVO-SOTELO",
    currentCargo: "Directora de la línea de Gobierno Corporativo, Riesgos y Compliance / Socia Cremades & Calvo-Sotelo",
    complianceExperience: "Experiencia de más de 15 años en aspectos legales y regulatorios de gobierno corporativo, gestión de riesgos y compliance.",
    profession: "ABOGADA",
    academicBg: [
      "Universidad Externado de Colombia - Abogada, Derecho",
      "Universitat de València - Candidata a Doctora en Derecho",
      "Universidad de Alcalá - Experto en Derecho Español Para Juristas Extranjeros",
      "Universidad Externado de Colombia - Especialista en Seguridad Social",
      "INALDE Business School - Programa de Desarrollo Directivo (PDD)",
      "IPADE Business School - Actualización en Alta Dirección",
      "INALDE Business School - Programa de Liderazgo Estratégico"
    ],
    workBg: [
      "Oficial de Cumplimiento Principal",
      "Miembro de la Junta Directiva de Colfondos S.A.",
      "Miembro de la Comunidad de Liderazgo de Mujeres en Juntas Directivas del CESA",
      "Miembro de la Comisión de Responsabilidad Empresarial y Anticorrupción (Cámara de Comercio de Bogotá)",
      "Presidenta de la Comisión de Compliance de CAMACOES Colombia",
      "Docente de la Facultad de Derecho en Universidad Externado de Colombia",
      "Docente del Instituto Nacional de Contadores Públicos (INCP)"
    ],
    linkedin: "https://www.linkedin.com/in/adriana-g%C3%B3mez-barajas/",
    photo: "/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg",
    tags: ["Gobierno Corporativo", "Compliance Penal", "ISO 37001", "Ética Corporativa", "Gestión de Riesgos"]
  },
  {
    id: "maria-paula-rueda",
    name: "MARÍA PAULA RUEDA MANTILLA",
    role: "SOCIA FUNDADORA",
    sector: "COMPLIANCE SECTOR PÚBLICO",
    currentCargo: "Subsecretaria Jurídica Distrital - Alcaldía Mayor de Bogotá",
    complianceExperience: "18 años de experiencia en Derecho Corporativo, Tributario y asesoría jurídica de empresas en el sector público y privado.",
    profession: "ABOGADA",
    academicBg: [
      "Universidad del Rosario - Abogada",
      "Universidad del Rosario - Especialista en Derecho Comercial",
      "Universidad de los Andes - Especialista en Tributación",
      "IE Business School - Master of Laws (LLM)",
      "Universidad del Rosario - Especialista en Gerencia de Empresas",
      "Escuela Superior de Guerra - Curso Integral de Defensa Nacional"
    ],
    workBg: [
      "Subsecretaria Jurídica Distrital - Secretaría Jurídica Distrital",
      "Gerente Legal y de Impuestos - Towering Consulting Worldwide S.A.S.",
      "Directora Recursos Físicos - Auditoría General de la República",
      "Abogada Corporativa - Rueda Mantilla Abogados Asociados",
      "Profesora Titular de Derecho De Empresa - Universidad del Rosario"
    ],
    linkedin: "https://www.linkedin.com/in/maria-paula-rueda-mantilla-6a218059/",
    photo: "/Fotos/Miembros/MARIA PAULA RUEDA.jpg",
    tags: ["Compliance Sector Público", "Gobierno Corporativo", "Derecho de Empresa", "Gestión de Riesgos"]
  },
  {
    id: "liz-marcela-bejarano",
    name: "LIZ MARCELA BEJARANO CASTILLO",
    role: "SOCIA FUNDADORA",
    sector: "AGREMIACIONES & SECTOR FINANCIERO",
    currentCargo: "Directora Financiera y de Riesgos - ASOBANCARIA",
    complianceExperience: "Líder del gremio bancario en prevención del riesgo LAFT/PADM, mercado de capitales, riesgos financieros y estándares internacionales.",
    profession: "ECONOMISTA",
    academicBg: [
      "Universidad Externado de Colombia - Economista",
      "Universidad de los Andes - Especialista en Gestión y Control de Instituciones Financieras",
      "Universidad de los Andes - Magíster en Finanzas",
      "Universidad de los Andes - Programa Juntas Directivas y Gobierno Corporativo"
    ],
    workBg: [
      "Directora Financiera y de Riesgos - Asobancaria",
      "Gerente de Riesgos - Premier Credit",
      "Especialista en Soluciones de Riesgo - CIFIN Asobancaria",
      "Profesional de Riesgo - Banco Davivienda / Red Bancafé"
    ],
    linkedin: "https://www.linkedin.com/in/liz-marcela-bejarano-castillo-2089b624a/",
    photo: "/Fotos/Miembros/LIZ MARCELA BEJARANO CASTILLO.jpg",
    tags: ["Agremiaciones", "Sector Financiero", "Gestión de Riesgos", "LAFT/PADM"]
  },
  {
    id: "yolima-bautista",
    name: "YOLIMA ANGÉLICA BAUTISTA DÍAZ",
    role: "SOCIA FUNDADORA",
    sector: "SECTOR SEGURIDAD Y VIGILANCIA",
    currentCargo: "Gerente de Cumplimiento - Grupo Prosegur",
    complianceExperience: "Más de 12 años liderando modelos de Compliance (Ética, Protección de Datos, Anticorrupción, Competencia y SAGRILAFT).",
    profession: "CONTADORA PÚBLICA",
    academicBg: [
      "Pontificia Universidad Javeriana - Contadora Pública",
      "Universidad de La Sabana - Especialista en Finanzas y Negocios Internacionales",
      "EALDE Business School - Maestría en Gestión de Riesgos"
    ],
    workBg: [
      "Gerente de Cumplimiento - Grupo Prosegur",
      "Business Support Controller - Makro",
      "Gerente de Control Interno y Oficial de Cumplimiento - Sodexo (Colombia y Costa Rica)",
      "Auditor Senior - Coca-Cola FEMSA y KPMG"
    ],
    linkedin: "http://linkedin.com/in/ybautista-riesgos-compliance-laft/",
    photo: "/Fotos/Miembros/YOLIMA ANGELICA BAUTISTA DIAZ.jpg",
    tags: ["Sector Seguridad", "SAGRILAFT & PTEE", "Anti-Corrupción", "Protección de Datos", "Ética Corporativa"]
  }
];
