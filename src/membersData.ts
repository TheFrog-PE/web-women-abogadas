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
    id: "sandra-meza",
    name: "SANDRA MEZA CUERVO",
    role: "SOCIA FUNDADORA",
    sector: "SECTOR FINANCIERO",
    currentCargo: "Compliance BBVA Colombia / Vicepresidente Ejecutiva Control Interno y Cumplimiento",
    complianceExperience: "16 años de experiencia en asuntos legales, de Cumplimiento, riesgos no financieros y Control Interno en el sector bancario.",
    profession: "ABOGADA",
    academicBg: [
      "Universidad Javeriana - Abogada",
      "Universidad Javeriana - Especialización en Derecho Financiero y Mercado de Valores",
      "Universidad de la Sabana - Program Business Administration",
      "CESA - Diplomado AML/CFT",
      "ACAMS - Certified Anti-Money Laundering Specialist",
      "Institute for US Law - Compliance & Anti-Corruption"
    ],
    workBg: [
      "Vicepresidente Ejecutiva Control Interno y Cumplimiento - Banco BBVA",
      "Oficial de Cumplimiento País / Gerente SARLAFT - BBVA",
      "Directora Ejecutiva Control Interno y Cumplimiento",
      "Abogada Corporativa - Colfondos S.A."
    ],
    linkedin: "https://www.linkedin.com/in/sandra-meza-cuervo-0293a2150/",
    photo: "/Fotos/Miembros/MIP_7039.jpg",
    tags: ["Sector Financiero", "SAGRILAFT & PTEE", "AML/CFT", "Control Interno", "Gestión de Riesgos"]
  },
  {
    id: "juliana-solano",
    name: "JULIANA SOLANO CHAR",
    role: "SOCIA FUNDADORA",
    sector: "ENTIDADES TERRITORIALES",
    currentCargo: "Secretaria General - Gobernación de Bolívar",
    complianceExperience: "Experiencia sobresaliente en gestión pública, consultorías legales y liderazgo en estructuración de proyectos de alta dirección.",
    profession: "ABOGADA",
    academicBg: [
      "Universidad de los Andes - Abogada",
      "Universidad de los Andes - Especialista en Legislación Financiera",
      "ISDE Law & Business School - Master of Laws (LLM) en Derecho Internacional y Comercio Exterior"
    ],
    workBg: [
      "Secretaria General - Gobernación de Bolívar",
      "Secretaria Privada y Asesora de Despacho - Alcaldía Distrital de Barranquilla",
      "Asesora - Alcaldía de Cartagena",
      "FINDETER - Analista Jurídica y Profesional de Estructuración de Proyectos"
    ],
    linkedin: "https://www.linkedin.com/in/juliana-solano-char-a1981329/",
    photo: "/Fotos/Miembros/MIP_7042.jpg",
    tags: ["Entidades Territoriales", "Gestión Pública", "Legislación Financiera", "Gobierno Corporativo"]
  },
  {
    id: "maria-helena-padilla",
    name: "MARÍA HELENA PADILLA",
    role: "SOCIA FUNDADORA",
    sector: "TAX COMPLIANCE",
    currentCargo: "Tax Partner - Padilla Consultores",
    complianceExperience: "Casi 20 años de experiencia en planeación fiscal, consultoría, litigio y cumplimiento tributario en multinacionales y firmas de primer nivel.",
    profession: "ABOGADA",
    academicBg: [
      "Universidad del Rosario - Abogada y Especialista en Derecho Tributario",
      "Universidad Externado de Colombia - Especialista en Derecho Financiero y Bursátil",
      "CEF Centro de Estudios Financieros (Madrid) - Máster en Tributación y Asesoría Fiscal",
      "CESA - Liderazgo de Mujeres en Juntas Directivas"
    ],
    workBg: [
      "Tax Partner - Padilla Consultores",
      "Partner Tax & Legal LATAM - Deloitte",
      "Tax Partner - Pinilla, González & Prieto Abogados",
      "Gerente de Impuestos - DIRECTV Latin America (Colombia, Ecuador, Venezuela)",
      "Coordinadora Senior de Impuestos - Claro Colombia"
    ],
    linkedin: "https://www.linkedin.com/in/mar%C3%ADa-helena-padilla-88bb2430/",
    photo: "/Fotos/Miembros/MIP_7332.jpg",
    tags: ["Tax Compliance", "Derecho Tributario", "Gobierno Corporativo", "Planeación Fiscal"]
  },
  {
    id: "ana-linda-solano",
    name: "ANA LINDA SOLANO LÓPEZ",
    role: "SOCIA FUNDADORA",
    sector: "COMPLIANCE PENAL & ANTI-CORRUPCIÓN",
    currentCargo: "Directora - CONTUGAS / Consultora Internacional",
    complianceExperience: "Consultora experta en derecho penal corporativo, investigación criminal, prevención de lavado de activos y anticorrupción.",
    profession: "ABOGADA",
    academicBg: [
      "Universidad de los Andes - Abogada",
      "Pontificia Universidad Javeriana - Especialización en Derecho Administrativo",
      "Universitat Pompeu Fabra (Barcelona) - Máster en Ciencias Jurídicas",
      "LSE (London School of Economics) - Visiting Fellow",
      "FLACSO Argentina - Maestría en Género, Sociedad y Políticas"
    ],
    workBg: [
      "Directora - CONTUGAS (Gas Natural)",
      "Directora de la Policía Económico Financiera - Fiscalía General de la Nación",
      "Profesora Investigadora - Universidad Externado de Colombia",
      "Experta Principal 'Mujer y Corrupción' - Programa EUROsociAL+ de la Unión Europea"
    ],
    linkedin: "https://www.linkedin.com/in/analindasolano/",
    photo: "/Fotos/Miembros/MIP_7349.jpg",
    tags: ["Compliance Penal", "Anti-Corrupción", "Investigación Criminal", "SAGRILAFT & PTEE"]
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
    id: "paula-andrea-ramirez",
    name: "PAULA ANDREA RAMÍREZ BARBOSA",
    role: "SOCIA FUNDADORA",
    sector: "COMPLIANCE & INTELIGENCIA ARTIFICIAL",
    currentCargo: "PhD in Law / Consultora e Investigadora en Compliance e Inteligencia Artificial",
    complianceExperience: "Doctora en Derecho Penal, ex Conjuez de la Corte Suprema de Justicia y destacada experta en compliance, liderazgo e IA.",
    profession: "ABOGADA",
    academicBg: [
      "Universidad de Ibagué - Abogada",
      "Universidad Católica de Colombia - Especialista en Derecho Penal y Ciencias Forenses",
      "Universidad de Salamanca - Máster en Estudios Políticos",
      "Universidad de Salamanca - Doctora en Derecho Penal (PhD)",
      "Georgetown University - Innovation and Leadership in Government"
    ],
    workBg: [
      "Conjuez Sala de Casación Penal - Corte Suprema de Justicia",
      "Procuradora Delegada en Asuntos Penales - Procuraduría General de la Nación",
      "Gerente General - CIDCE (Centro Internacional de Derecho Corporativo)",
      "Profesora de Derecho Penal Económico y Corporativo - Universidad Externado"
    ],
    linkedin: "https://www.linkedin.com/in/paula-andrea-ramirez-barbosa-24172ab6/",
    photo: "/Fotos/Miembros/MIP_7362.jpg",
    tags: ["Compliance Penal", "Inteligencia Artificial", "Derecho Penal Económico", "Gestión de Riesgos"]
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
