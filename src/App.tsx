import { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar,
  MapPin, 
  Award, 
  BookOpen, 
  Users, 
  Mail, 
  Phone, 
  ExternalLink,
  Search,
  X,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Trash2,
  Save,
  Camera,
  Link as LinkIcon,
  Edit2,
  Eye,
  LogOut,
  Share2,
  Download,
  LayoutDashboard,
  TrendingUp,
  FileText,
  HelpCircle,
  Building2,
  Globe,
  PenTool,
  Lock as LockIcon,
  CheckCircle2,
  Home,
  AlertTriangle,
  ShieldAlert,
  Filter,
  ChevronDown,
  Menu
} from 'lucide-react';

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsappIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.886-9.89 9.886"/>
  </svg>
);
import { MEMBERS_DATA } from './membersData';
import type { Member } from './membersData';
import './index.css';

export interface EventSpeaker {
  name: string;
  role: string;
  photo: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  desc: string;
  sala: string;
}

export interface EventDetailData {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  location: string;
  dateStr: string;
  isPast: boolean;
  heroGradient: string;
  heroImage: string;
  photos: string[];
  description: string[];
  agenda: AgendaItem[];
  speakers: EventSpeaker[];
  attendeesCount?: string;
}

const AVATAR_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%2394A3B8'%3E%3Crect width='24' height='24' fill='%23CBD5E1'/%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

const PHOTO_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 24 24' fill='%2394A3B8'%3E%3Crect width='24' height='24' fill='%23CBD5E1'/%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";

const EVENTS_DATA: Record<string, EventDetailData> = {
  'faoc-2026': {
    id: 'faoc-2026',
    title: 'FAOC 2026',
    badge: 'FORO REALIZADO · MEMORIAS',
    subtitle: 'Forum on Anti-Corruption Compliance Colombia',
    location: 'Metropolitan Club, Bogotá',
    dateStr: '24 Nov 2026',
    isPast: true,
    attendeesCount: '300+ Asistentes',
    heroGradient: 'linear-gradient(105deg, #0F172A 0%, #334155 55%, #475569 100%)',
    heroImage: '/Fotos/Fotos Desayuno 07/Foto 01.jpg',
    photos: [
      '/Fotos/Fotos Desayuno 07/Foto 01.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 02.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 03.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 04.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 05.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 06.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 07.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 08.jpg',
    ],
    description: [
      'El FAOC 2026 se llevó a cabo con total éxito en el Metropolitan Club de Bogotá, posicionándose como el encuentro cumbre del año en materia de anticorrupción, ética empresarial y gestión de riesgos en Colombia.',
      'Reunió a más de 300 oficiales de cumplimiento, directoras jurídicas, reguladores y socias de firmas líderes en un espacio de diálogo técnico y networking de alto nivel. A continuación puedes revivir la galería fotográfica oficial completa del evento y descargar las memorias en PDF.'
    ],
    agenda: [
      { time: '08:30 – 09:30', title: 'Apertura & Anti-Corruption Keynote', desc: 'Tendencias globales de cumplimiento y supervisión de la FCPA.', sala: 'Salón Principal' },
      { time: '10:00 – 11:30', title: 'Panel: Supervisión SAGRILAFT & PTEE 2026', desc: 'Análisis de regulaciones con la Superintendencia de Sociedades.', sala: 'Auditorio A' },
      { time: '12:00 – 13:30', title: 'Almuerzo Ejecutivo & Networking', desc: 'Conexión estratégica entre oficiales de cumplimiento y socias de firmas.', sala: 'Terrace Garden' },
      { time: '14:00 – 15:30', title: 'Taller: Investigaciones Internas & IA en GRC', desc: 'Casos reales de canales de denuncia e inteligencia artificial.', sala: 'Sala Workshop' },
    ],
    speakers: [
      { name: 'ADRIANA PATRICIA GÓMEZ BARAJAS', role: 'Directora de Cumplimiento & RCG', photo: '/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg' },
      { name: 'MARÍA ALEJANDRA TRUJILLO', role: 'Especialista en SAGRILAFT & PTEE', photo: '/Fotos/Miembros/MIP_7039.jpg' },
      { name: 'CLAUDIA MARCELA RINCÓN', role: 'Consultora Senior Compliance', photo: '/Fotos/Miembros/MIP_7042.jpg' },
      { name: 'JOHANA MILENA TORRES', role: 'Directora Legal & Ética Corporativa', photo: '/Fotos/Miembros/MIP_7332.jpg' }
    ]
  },
  'summit-2026': {
    id: 'summit-2026',
    title: 'WOMEN IN COMPLIANCE SUMMIT',
    badge: 'CUMBRE NACIONAL 2026',
    subtitle: 'Cumbre de Liderazgo Femenino & Gobernanza Ética',
    location: 'Centro de Convenciones, Bogotá',
    dateStr: '15 Dic 2026',
    isPast: false,
    heroGradient: 'linear-gradient(105deg, #1E1B4B 0%, #4C1D95 55%, #8B5CF6 100%)',
    heroImage: '/Fotos/Imagen para Inicio - 03.jpg',
    photos: [
      '/Fotos/Imagen para Inicio - 03.jpg',
      '/Fotos/Imagen para Inicio - 02.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 07.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 08.jpg',
    ],
    description: [
      'La Cumbre Anual Women in Compliance Colombia reúne a más de 300 ejecutivas y abogadas del país para potenciar la participación femenina en Juntas Directivas, Comités de Ética y decisiones de Alta Gerencia.',
      'Un espacio de empoderamiento, capacitación avanzada e intercambio de mejores prácticas de buen gobierno corporativo y equidad de género empresarial.'
    ],
    agenda: [
      { time: '09:00 – 10:15', title: 'Conferencia: Mujeres en Juntas Directivas', desc: 'Estrategias de visibilidad y posicionamiento en gobierno corporativo.', sala: 'Gran Auditorio' },
      { time: '10:45 – 12:15', title: 'Mesa Técnica: ESG, Sostenibilidad & Compliance', desc: 'Integración de criterios ambientales, sociales y de gobernanza.', sala: 'Sala Ámbar' },
      { time: '12:30 – 14:00', title: 'Almuerzo de Liderazgo & Mentoring', desc: 'Mesas de mentoría directa con fundadoras y directivas de WIC.', sala: 'Salón Real' },
      { time: '14:30 – 16:00', title: 'Taller: Negociación Estratégica para Directoras', desc: 'Herramientas avanzadas de resolución de conflictos corporativos.', sala: 'Taller B' },
    ],
    speakers: [
      { name: 'DIANA CAROLINA MANTILLA', role: 'Líder en Gobierno Corporativo', photo: '/Fotos/Miembros/MIP_7349.jpg' },
      { name: 'BEATRIZ ELENA VILLEGAS', role: 'Consultora Senior ESG & Compliance', photo: '/Fotos/Miembros/MIP_7362.jpg' },
      { name: 'CAROLINA SÁNCHEZ PÉREZ', role: 'Socia de Firma & Especialista Penal', photo: '/Fotos/Miembros/MARIA PAULA RUEDA.jpg' },
      { name: 'NATALIA GÓMEZ RESTREPO', role: 'Directora de Cumplimiento Financiero', photo: '/Fotos/Miembros/LIZ MARCELA BEJARANO CASTILLO.jpg' }
    ]
  },
  'desayuno-1': {
    id: 'desayuno-1',
    title: '1er Desayuno Mujeres in Compliance',
    badge: 'EVENTO REALIZADO · RESEÑA OFICIAL',
    subtitle: 'Conexión, Apoyo Mutuo y Liderazgo Estratégico',
    location: 'Metropolitan Club, Bogotá',
    dateStr: '25 de Junio, 2026',
    isPast: true,
    attendeesCount: '250+ Asistentes',
    heroGradient: 'linear-gradient(105deg, #0F172A 0%, #334155 55%, #475569 100%)',
    heroImage: '/Fotos/Imagen para Inicio - Eventos 04.jpg',
    photos: [
      '/Fotos/Imagen para Inicio - Eventos 04.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 01.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 02.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 04.jpg',
    ],
    description: [
      'Revive nuestro exitoso primer encuentro presencial de la red WIC Colombia en el Metropolitan Club de Bogotá. Un evento hito que reunió a más de 250 líderes y especialistas en cumplimiento legal.',
      'Durante la mañana compartimos experiencias sobre prevención de riesgos penales, fortalecimiento del networking profesional y consolidación de la red nacional de apoyo mutuo.'
    ],
    agenda: [
      { time: '08:00 – 08:45', title: 'Bienvenida & Desayuno de Networking', desc: 'Apertura por el Comité Fundador de WIC Colombia.', sala: 'Salón Metropolitan' },
      { time: '08:45 – 09:45', title: 'Panel: Retos Actuales de las Oficiales de Cumplimiento', desc: 'Debate sobre responsabilidad penal corporativa y protección directiva.', sala: 'Salón Principal' },
      { time: '10:00 – 11:00', title: 'Sesión de Trabajo: Construyendo Redes de Confianza', desc: 'Mesas de diálogo sobre mentoría y desarrollo profesional.', sala: 'Mesas Temáticas' },
    ],
    speakers: [
      { name: 'ADRIANA PATRICIA GÓMEZ BARAJAS', role: 'Fundadora WIC & Socia Consultora', photo: '/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg' },
      { name: 'MARÍA ALEJANDRA TRUJILLO', role: 'Oficial de Cumplimiento Sector Financiero', photo: '/Fotos/Miembros/MIP_7039.jpg' },
      { name: 'CLAUDIA MARCELA RINCÓN', role: 'Experta en Ética Corporativa', photo: '/Fotos/Miembros/MIP_7042.jpg' },
      { name: 'JOHANA MILENA TORRES', role: 'Especialista en SAGRILAFT & Riesgos', photo: '/Fotos/Miembros/MIP_7332.jpg' }
    ]
  },
  'seminario-sagrilaft': {
    id: 'seminario-sagrilaft',
    title: 'Seminario de Riesgos Penales & SAGRILAFT',
    badge: 'EVENTO REALIZADO · MEMORIAS TÉCNICAS',
    subtitle: 'Gestión Integral de Riesgos y Prevención del LA/FT',
    location: 'Modalidad Híbrida, Bogotá',
    dateStr: '18 de Mayo, 2026',
    isPast: true,
    attendeesCount: '180+ Participantes',
    heroGradient: 'linear-gradient(105deg, #18181B 0%, #27272A 55%, #52525B 100%)',
    heroImage: '/Fotos/Fotos Desayuno 07/Foto 04.jpg',
    photos: [
      '/Fotos/Fotos Desayuno 07/Foto 04.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 05.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 06.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 03.jpg',
    ],
    description: [
      'Resumen técnico del Seminario de Actualización en SAGRILAFT, PTEE y Prevención del LA/FT impartido para oficiales de cumplimiento y auditores.',
      'El seminario contó con la participación de conferencistas expertos en normatividad de la Superintendencia de Sociedades y análisis de casos de estudio sobre debida diligencia intensificada.'
    ],
    agenda: [
      { time: '08:30 – 10:00', title: 'Módulo 1: Actualización Circulares SAGRILAFT', desc: 'Inspección de controles y evaluación del nivel de riesgo patrimonial.', sala: 'Auditorio Central' },
      { time: '10:30 – 12:00', title: 'Módulo 2: Debida Diligencia de Contrapartes & PEPs', desc: 'Metodología práctica para verificación de beneficiarios finales.', sala: 'Sala Capacitación' },
      { time: '14:00 – 15:30', title: 'Módulo 3: Canales de Denuncia & Transparencia', desc: 'Mecanismos efectivos de prevención del soborno transnacional.', sala: 'Taller Práctico' },
    ],
    speakers: [
      { name: 'DIANA CAROLINA MANTILLA', role: 'Auditora Senior GRC', photo: '/Fotos/Miembros/MIP_7349.jpg' },
      { name: 'BEATRIZ ELENA VILLEGAS', role: 'Especialista en Cumplimiento Normativo', photo: '/Fotos/Miembros/MIP_7362.jpg' },
      { name: 'CAROLINA SÁNCHEZ PÉREZ', role: 'Consultora SAGRILAFT', photo: '/Fotos/Miembros/MARIA PAULA RUEDA.jpg' },
      { name: 'NATALIA GÓMEZ RESTREPO', role: 'Abogada Penalista Corporativa', photo: '/Fotos/Miembros/LIZ MARCELA BEJARANO CASTILLO.jpg' }
    ]
  },
  'congreso-2027': {
    id: 'congreso-2027',
    title: 'V CONGRESO DE COMPLIANCE & SAGRILAFT',
    badge: 'CONGRESO NACIONAL 2027',
    subtitle: 'Tendencias Regulatorias & Inteligencia Artificial en GRC',
    location: 'Auditorio Principal, Medellín',
    dateStr: '20 de Enero, 2027',
    isPast: false,
    heroGradient: 'linear-gradient(105deg, #4A0772 0%, #7E22CE 55%, #A855F7 100%)',
    heroImage: '/Fotos/Imagen para Inicio - 01.jpg',
    photos: [
      '/Fotos/Imagen para Inicio - 01.jpg',
      '/Fotos/Imagen para Inicio - 02.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 05.jpg',
      '/Fotos/Fotos Desayuno 07/Foto 06.jpg',
    ],
    description: [
      'El V Congreso de Compliance & SAGRILAFT reunirá a más de 400 oficiales de cumplimiento, directores legales y reguladores en la ciudad de Medellín para analizar las tendencias del año 2027.',
      'Espacio de formación de alto nivel con talleres interactivos y análisis de casos de estudio sobre tecnología aplicada al control de riesgos.'
    ],
    agenda: [
      { time: '08:30 – 10:00', title: 'Panel Inaugural: Regulaciones 2027', desc: 'Retos de supervisión en SAGRILAFT y PTEE.', sala: 'Auditorio Principal' },
      { time: '10:30 – 12:00', title: 'Taller: Inteligencia Artificial en Monitoreo', desc: 'Sistemas automatizados de alertas tempranas.', sala: 'Sala de Tecnología' },
      { time: '14:00 – 16:00', title: 'Mesas Redondas: Debida Diligencia Intensificada', desc: 'Casos reales de prevención del fraude corporativo.', sala: 'Salas B & C' },
    ],
    speakers: [
      { name: 'ADRIANA PATRICIA GÓMEZ BARAJAS', role: 'Directora de Cumplimiento & RCG', photo: '/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg' },
      { name: 'MARÍA PAULA RUEDA MANTILLA', role: 'Abogada Corporativa', photo: '/Fotos/Miembros/MARIA PAULA RUEDA.jpg' },
      { name: 'LIZ MARCELA BEJARANO CASTILLO', role: 'Especialista en Riesgos Financieros', photo: '/Fotos/Miembros/LIZ MARCELA BEJARANO CASTILLO.jpg' },
      { name: 'YOLIMA ANGÉLICA BAUTISTA DÍAZ', role: 'Gerente de Cumplimiento', photo: '/Fotos/Miembros/YOLIMA ANGELICA BAUTISTA DIAZ.jpg' }
    ]
  }
};

export interface Article {
  id: string;
  title: string;
  category: string;
  categories?: string[];
  author: string;
  authorPhoto?: string;
  role: string;
  date: string;
  readTime: string;
  summary: string;
  image: string;
  status: string;
  content: string;
}

const DEFAULT_ARTICLES: Article[] = [
  {
    id: "art-compliance-gobierno",
    title: "Compliance y buen gobierno corporativo",
    category: "Compliance",
    categories: ["Compliance", "Buen Gobierno Corporativo", "Gestión de Riesgos", "Ética e Integridad"],
    author: "Instituto Peruano de Compliance (IPC) & WIC Colombia",
    authorPhoto: "/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg",
    role: "Alianza Estratégica & Aliado Institucional",
    date: "15 de Diciembre, 2026",
    readTime: "4 min de lectura",
    summary: "Desde la instauración de la responsabilidad de las personas jurídicas al reconocerse el poder que estas poseen en las dimensiones económica, social y política; se han rediseñado constantemente las medidas preventivas de comisión de infracciones o delitos que vinculen a la sociedad, sus representantes o colaboradores.",
    image: "/Fotos/Imagen para Inicio - 02.jpg",
    status: "Publicado",
    content: `Desde la instauración de la responsabilidad de las personas jurídicas al reconocerse el poder que estas poseen en las dimensiones económica, social y política; se han rediseñado constantemente las medidas preventivas de comisión de infracciones o delitos que vinculen a la sociedad, sus representantes o colaboradores. A consecuencia de la incidencia del comportamiento corporativo, el control del riesgo es trasladado a las empresas a fin de desarrollar una autorregulación que mitigue contingencias de diversa índole, proteja a los stakeholders (personas o entidades con interés en la empresa) y desde el punto de vista empresarial, prosiga en la consecución de prácticas de buen gobierno corporativo.

Al respecto, apreciamos la implementación de medidas destinadas a cumplir con la legalidad y disposiciones de nivel interno (políticas propias) y externo que en conjunto se conocen como "compliance o cumplimiento normativo", siendo relevante para el conocimiento de todas las clases de riesgos en la empresa, implementar mecanismos de prevención e identificación, así como acciones para mitigarlos en la medida de lo posible.

Para poder conseguirlo, dentro del campo de acción de las empresas se han desplegado una gran diversidad de iniciativas de buenas prácticas corporativas, las cuales han podido dotar de cierta eficiencia operativa y con el tiempo ser internalizadas en la cultura organizacional; sin embargo, ante la existencia de nuevas normas, se acrecienta un complejo entorno legal que necesita ser adecuadamente cumplido.

Garantizar la observancia de las normas por medio del compliance, evoluciona progresivamente pues es más que colocar en blanco y negro definiciones de determinados procedimientos generales; es ser y hacer una cultura de cumplimiento en la organización que promueva la ética, la integridad y las buenas prácticas del gobierno corporativo al interior de la empresa.

Por ello, el Instituto Peruano de Compliance asume el compromiso en fomentar la mejora continua del papel del compliance en las organizaciones, así como la capacitación y especialización permanente de sus operadores.`
  }
];

export function App() {
  // Estados reactivos dinámicos con persistencia en localStorage entre Intranet y Web Pública
  const [membersList, setMembersList] = useState<Member[]>(() => {
    // Forzar la lista limpia de las 4 fundadoras oficiales de MEMBERS_DATA
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wic_members_list');
    }
    return MEMBERS_DATA;
  });

  const [articlesList, setArticlesList] = useState<Article[]>(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wic_articles_list');
    }
    return DEFAULT_ARTICLES;
  });

  // Guardar dinámicamente en localStorage cada cambio
  useEffect(() => {
    localStorage.setItem('wic_members_list', JSON.stringify(membersList));
  }, [membersList]);

  useEffect(() => {
    localStorage.setItem('wic_articles_list', JSON.stringify(articlesList));
  }, [articlesList]);

  const [activeTab, setActiveTab] = useState<'inicio' | 'miembros' | 'eventos' | 'contenido' | 'login' | '404'>('inicio');
  const [auditProgress, setAuditProgress] = useState<number | null>(null);
  const [auditStatusText, setAuditStatusText] = useState<string>('');

  const runAuditDemo = () => {
    setAuditProgress(10);
    setAuditStatusText('Iniciando rastreo de trazabilidad URL...');
    setTimeout(() => {
      setAuditProgress(45);
      setAuditStatusText('Evaluando matriz de riesgos y cumplimiento normativo SAGRILAFT & PTEE...');
    }, 700);
    setTimeout(() => {
      setAuditProgress(80);
      setAuditStatusText('Consultando registros de gobernanza corporativa en WIC Colombia...');
    }, 1400);
    setTimeout(() => {
      setAuditProgress(100);
      setAuditStatusText('DICTAMEN FINAL: Infracción de Ruta Detectada (Código 404). El enlace solicitado se encuentra fuera del mapa normativo.');
    }, 2200);
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [eventSlide, setEventSlide] = useState(0);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchMember, setSearchMember] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Todos');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState<boolean>(false);

  const [searchArticle, setSearchArticle] = useState('');
  const [selectedArticleCategory, setSelectedArticleCategory] = useState('Todas');
  const [isMobileAreaDropdownOpen, setIsMobileAreaDropdownOpen] = useState(false);
  const [articlePage, setArticlePage] = useState(1);
  const [articleFormSubmitted, setArticleFormSubmitted] = useState(false);
  const [articleFormData, setArticleFormData] = useState({ name: '', email: '', message: '' });

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openArticleDetail = (art: Article) => {
    setSelectedArticle(art);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const availableMemberTags = useMemo(() => {
    const tagSet = new Set<string>();
    
    // Tags de MEMBERS_DATA
    MEMBERS_DATA.forEach(m => {
      (m.tags || []).forEach(t => { if (t) tagSet.add(t); });
    });

    // Tags de miembros cargados dinámicamente
    membersList.forEach(m => {
      (m.tags || []).forEach(t => { if (t) tagSet.add(t); });
    });

    return Array.from(tagSet).sort();
  }, [membersList]);
  const [viewingEventDetail, setViewingEventDetail] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string>('faoc-2026');

  const openEventDetail = (eventId: string) => {
    setActiveEventId(eventId);
    setViewingEventDetail(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentEvent = EVENTS_DATA[activeEventId] || EVENTS_DATA['faoc-2026'];
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminSubTab, setAdminSubTab] = useState<'dashboard' | 'blog-list' | 'blog-editor' | 'members-list' | 'member-editor'>('dashboard');
  const [memberPhoto, setMemberPhoto] = useState<string | null>('/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg');
  
  // Estado para edición o creación de miembro
  const [editingMember, setEditingMember] = useState<{ id?: string; name: string; role: string; bio: string; photo: string | null } | null>(null);
  
  // Estado para edición o creación de artículo
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // ── CUENTA REGRESIVA REAL hacia el evento (24 Nov 2026) ──
  const eventDate = new Date('2026-11-24T08:00:00');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);



  // Scroll listener for sticky transparent-to-white navbar (apenas se escrolee > 10px)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Event Hero Slides (Auto Carousel for Eventos)
  const eventSlides = [
    '/Fotos/Imagen portada Evento - Desayuno - 06.jpg',
    '/Fotos/Imagen para Inicio - Eventos 04.jpg',
    '/Fotos/Imagen para Miniatura de Evento - 05.jpg',
    '/Fotos/Imagen para Inicio - 02.jpg'
  ];

  // Event Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setEventSlide((prev) => (prev + 1) % eventSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [eventSlides.length]);

  // Autoplay para el Hero Carousel Principal de Inicio (cambio automático cada 5 segundos)
  useEffect(() => {
    if (activeTab !== 'inicio') return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // 3 slides en el Hero principal
    }, 5000);
    return () => clearInterval(timer);
  }, [activeTab]);

  // Hero Slider Data based on docx instructions
  const slides = [
    {
      image: '/Fotos/Imagen para Inicio - 01.jpg',
      title: 'Women in Compliance Colombia',
      subtitle: 'Comunidad de líderes y especialistas transformando el buen gobierno corporativo y la integridad en Colombia.',
      btnText: 'Quiénes Somos',
      action: () => setActiveTab('inicio')
    },
    {
      image: '/Fotos/Imagen para Inicio - 02.jpg',
      title: 'Conferencias, Seminarios & Talleres',
      subtitle: 'Espacios de alta dirección para potenciar el liderazgo femenino y la cultura ética empresarial.',
      btnText: 'Ver Eventos',
      action: () => setActiveTab('eventos')
    },
    {
      image: '/Fotos/Imagen para Inicio - 03.jpg',
      title: 'Sé la próxima embajadora de la integridad empresarial',
      subtitle: 'Conecta con nuestras afiliadas fundadoras y expertas en cumplimiento en diversos sectores del país.',
      btnText: 'Conoce a las Miembros',
      action: () => setActiveTab('miembros')
    }
  ];

  // Listener for hash route #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname.endsWith('/admin')) {
        setActiveTab('login');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // ── SCROLL REVEAL: IntersectionObserver robusto ──
  useEffect(() => {
    let observer: IntersectionObserver;

    // Doble rAF: espera que React termine el paint del DOM
    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Deja de observar una vez visible
              }
            });
          },
          { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
        );

        document
          .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
          .forEach((el) => {
            el.classList.remove('visible'); // Reset para re-animación al cambiar vista
            observer.observe(el);
          });
      });
      return id2;
    });

    return () => {
      cancelAnimationFrame(id1);
      if (observer) observer.disconnect();
    };
  }, [activeTab, viewingEventDetail, searchMember, selectedTag]);



  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* UN SOLO NAVBAR COMPONENTE UNIFICADO PARA TODA LA WEB */}
      {/* TRANSPARENTE EN TOP (0px scroll) Y SE PONE BLANCO CON LOGO NORMAL AL ESCROLEAR */}
      {activeTab !== 'login' && (
        <header 
          className={isScrolled ? 'scrolled' : ''}
          style={{ 
            backgroundColor: isScrolled ? '#FFFFFF' : 'transparent', 
            borderBottom: isScrolled ? '1px solid #E2E8F0' : 'none', 
            position: 'fixed', 
            top: 0, 
            left: 0,
            right: 0,
            zIndex: 50,
            transition: 'all 0.2s ease',
            boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
            backdropFilter: 'none'
          }}
        >
          <div style={{ 
            maxWidth: '1280px', 
            margin: '0 auto', 
            padding: '0.8rem 1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            
            {/* LOGO WIC (BLANCO EN TOP TRANSPARENTE, NORMAL AL ESCROLEAR) */}
            <div 
              onClick={() => setActiveTab('inicio')} 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <img 
                src="/Logo/Logo WIC COL  (1).png" 
                alt="Logo WIC Colombia" 
                style={{ 
                  height: '46px', 
                  objectFit: 'contain',
                  filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
                  transition: 'all 0.2s ease'
                }} 
              />
            </div>

            {/* NAVIGATION LINKS (DESKTOP) */}
            <nav className="desktop-nav-menu" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {(['inicio', 'miembros', 'eventos', 'contenido'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`nav-link ${activeTab === tab ? 'active' : ''} ${!isScrolled ? 'transparent-mode' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setViewingEventDetail(false);
                    setSelectedArticle(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {tab === 'inicio' ? 'Inicio' : tab === 'miembros' ? 'Miembros' : tab === 'eventos' ? 'Eventos' : 'Contenido'}
                </button>
              ))}
            </nav>

            {/* HEADER CONTACT CTA (DESKTOP) */}
            <button 
              className="btn btn-fuchsia desktop-cta-btn"
              onClick={() => {
                setActiveTab('miembros');
                setSelectedArticle(null);
                setViewingEventDetail(false);
              }}
              style={{ fontSize: '0.85rem' }}
            >
              Únete a WIC
            </button>

            {/* TOGGLE HAMBURGUESA PARA DISPOSITIVOS MÓVILES */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: isScrolled ? '#1E1B4B' : '#FFFFFF' }}
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* MENÚ DESPLEGABLE DRAWER PARA PANTALLAS MÓVILES */}
          {isMobileMenuOpen && (
            <div className={`mobile-drawer-menu ${isScrolled ? 'white-bg' : ''}`}>
              {(['inicio', 'miembros', 'eventos', 'contenido'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`nav-link ${activeTab === tab ? 'active' : ''} ${!isScrolled ? 'transparent-mode' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setViewingEventDetail(false);
                    setSelectedArticle(null);
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {tab === 'inicio' ? 'Inicio' : tab === 'miembros' ? 'Miembros' : tab === 'eventos' ? 'Eventos' : 'Contenido'}
                </button>
              ))}
              <button 
                className="btn btn-fuchsia"
                onClick={() => {
                  setActiveTab('miembros');
                  setViewingEventDetail(false);
                  setSelectedArticle(null);
                  setIsMobileMenuOpen(false);
                }}
                style={{ fontSize: '0.85rem', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                Únete a WIC
              </button>
            </div>
          )}
        </header>
      )}

      {/* MAIN CONTENT REGION */}
      <main style={{ flex: 1 }}>

        {/* ---------------------------------------------------- */}
        {/* PÁGINA 1: INICIO                                     */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'inicio' && (
          <div className="fade-in">
            
            {/* HERO CAROUSEL - PANTALLA COMPLETA */}
            <section style={{ position: 'relative', height: 'calc(100vh - 75px)', minHeight: '620px', overflow: 'hidden', backgroundColor: '#0A1128' }}>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: index === currentSlide ? 1 : 0,
                    transition: 'opacity 0.8s ease-in-out',
                    pointerEvents: index === currentSlide ? 'auto' : 'none'
                  }}
                >
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'brightness(0.55)'
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(10,17,40,0.85) 0%, rgba(10,17,40,0.3) 100%)'
                  }} />

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#FFFFFF'
                  }}>
                    <span className="anim-fade-up anim-d1" style={{ 
                      backgroundColor: '#af1daa', 
                      color: '#FFF', 
                      padding: '0.4rem 1.25rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.8rem', 
                      fontWeight: '700', 
                      marginBottom: '1.25rem',
                      letterSpacing: '1.5px',
                      display: 'inline-block'
                    }}>
                      WIC COLOMBIA
                    </span>
                    <h1 className="anim-fade-up anim-d2" style={{ 
                      color: '#FFFFFF', 
                      fontSize: '3.2rem', 
                      lineHeight: '1.2', 
                      maxWidth: '850px', 
                      marginBottom: '1.25rem',
                      fontWeight: '700'
                    }}>
                      {slide.title}
                    </h1>
                    <p className="anim-fade-up anim-d3" style={{ 
                      fontSize: '1.2rem', 
                      color: '#F1F5F9', 
                      maxWidth: '700px', 
                      marginBottom: '2rem',
                      lineHeight: '1.6'
                    }}>
                      {slide.subtitle}
                    </p>
                    <div className="anim-fade-up anim-d4">
                      <button 
                        className="btn btn-fuchsia"
                        onClick={slide.action}
                        style={{ fontSize: '1rem', padding: '0.85rem 2.5rem', backgroundColor: '#af1daa' }}
                      >
                        {slide.btnText} <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Slider controls */}
              <button 
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                style={{
                  position: 'absolute',
                  left: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '50% !important',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                style={{
                  position: 'absolute',
                  right: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '50% !important',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </section>

            {/* SECCIÓN ¿QUIÉNES SOMOS? (SEGÚN MAQUETA OFICIAL 01-INICIO.SVG) */}
            <section style={{ backgroundColor: '#f4f4f4', padding: '5rem 1.5rem', borderBottom: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div className="reveal" style={{ maxWidth: '850px', margin: '0 auto' }}>
                <h2 style={{ 
                  color: '#af1daa', 
                  fontSize: '2.5rem', 
                  fontFamily: 'sans-serif', 
                  fontWeight: '800', 
                  marginBottom: '1.5rem' 
                }}>
                  ¿Quiénes somos?
                </h2>
                <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '2.25rem' }}>
                  Somos la institución privada líder que promueve y difunde la asesoría, capacitaciones y el estudio de las mejores prácticas del Compliance Empresarial como medio eficiente para la prevención de riesgos al interior de las empresas de LATAM. Contamos con más de +100 miembros asociados y los mejores expertos en Capacitaciones Inhouse en temas de Compliance.
                </p>
                <div>
                  <button 
                    className="btn btn-fuchsia"
                    onClick={() => {
                      setActiveTab('miembros');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ backgroundColor: '#af1daa', padding: '0.85rem 2.5rem', fontSize: '1rem' }}
                  >
                    Miembros
                  </button>
                </div>
              </div>
            </section>

            {/* SECCIÓN MISIÓN Y VISIÓN (FONDO FUCSIA COMPLETO Y LETRA BLANCA - SEGÚN INSTRUCCIÓN) */}
            <section style={{ backgroundColor: '#af1daa', color: '#FFFFFF', padding: '5rem 1.5rem' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                  <h2 style={{ color: '#FFFFFF', fontSize: '2.3rem', marginBottom: '1rem' }}>
                    Nuestra Misión & Visión
                  </h2>
                  <p style={{ fontSize: '1.1rem', color: '#f4f4f4', maxWidth: '750px', margin: '0 auto' }}>
                    Construyendo la red intersectorial de mujeres líderes en integridad, ética corporativa y cumplimiento normativo en Colombia.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                  
                  {/* MISIÓN */}
                  <div className="reveal-left card-hover" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.12)', 
                    padding: '2.5rem', 
                    borderRadius: '1.5rem', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      color: '#af1daa', 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <ShieldCheck size={30} />
                    </div>
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '1rem' }}>Misión</h3>
                    <p style={{ color: '#FFFFFF', fontSize: '1rem', lineHeight: '1.7', opacity: 0.95 }}>
                      Consolidar una red estratégica de apoyo mutuo para mujeres en roles de liderazgo y cumplimiento en el sector público, privado, financiero y gremial. Fomentamos la capacitación continua, el buen gobierno corporativo y la cultura de integridad en todas las organizaciones del país.
                    </p>
                  </div>

                  {/* VISIÓN */}
                  <div className="reveal-right card-hover" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.12)', 
                    padding: '2.5rem', 
                    borderRadius: '1.5rem', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      color: '#af1daa', 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <UserCheck size={30} />
                    </div>
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '1rem' }}>Visión</h3>
                    <p style={{ color: '#FFFFFF', fontSize: '1rem', lineHeight: '1.7', opacity: 0.95 }}>
                      Ser el referente nacional e internacional de liderazgo femenino en Compliance para el año 2028, impulsando la equidad de género en altas gerencias y juntas directivas, y posicionando la ética y el cumplimiento como pilares del desarrollo empresarial colombiano.
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* SECCIÓN PILARES (ICONOS MÁS GRANDES SEGÚN INSTRUCCIÓN) */}
            <section style={{ padding: '5rem 1.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                  <span style={{ color: '#af1daa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                    NUESTROS EJES ESTRATÉGICOS
                  </span>
                  <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>Pilares Fundamentales</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                  
                  {/* PILAR 1 */}
                  <div className="reveal-scale delay-1 card-hover" style={{ 
                    padding: '2.5rem 2rem', 
                    borderRadius: '1.25rem', 
                    backgroundColor: '#F8FAFC', 
                    border: '1px solid #E2E8F0',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f4f4f4', 
                      color: '#af1daa', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 1.5rem auto' 
                    }}>
                      <Users size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Networking Estratégico</h3>
                    <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                      Conexiones de alto nivel entre ejecutivas, oficiales de cumplimiento y socias de firmas líderes.
                    </p>
                  </div>

                  {/* PILAR 2 */}
                  <div className="reveal-scale delay-2 card-hover" style={{ 
                    padding: '2.5rem 2rem', 
                    borderRadius: '1.25rem', 
                    backgroundColor: '#F8FAFC', 
                    border: '1px solid #E2E8F0',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f4f4f4', 
                      color: '#af1daa', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 1.5rem auto' 
                    }}>
                      <BookOpen size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Capacitación & Conocimiento</h3>
                    <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                      Seminarios, mesas técnicas de trabajo e intercambio de mejores prácticas de cumplimiento.
                    </p>
                  </div>

                  {/* PILAR 3 */}
                  <div className="reveal-scale delay-3 card-hover" style={{ 
                    padding: '2.5rem 2rem', 
                    borderRadius: '1.25rem', 
                    backgroundColor: '#F8FAFC', 
                    border: '1px solid #E2E8F0',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f4f4f4', 
                      color: '#af1daa', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 1.5rem auto' 
                    }}>
                      <Award size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Liderazgo Femenino</h3>
                    <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                      Empoderamiento e impulso a la presencia de mujeres en Juntas Directivas y Comités de Ética.
                    </p>
                  </div>

                  {/* PILAR 4 */}
                  <div className="reveal-scale delay-4 card-hover" style={{ 
                    padding: '2.5rem 2rem', 
                    borderRadius: '1.25rem', 
                    backgroundColor: '#F8FAFC', 
                    border: '1px solid #E2E8F0',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f4f4f4', 
                      color: '#af1daa', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 1.5rem auto' 
                    }}>
                      <ShieldCheck size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Integridad Empresarial</h3>
                    <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                      Promoción del anti-soborno, SAGRILAFT, régimen libre de competencia y gobierno corporativo.
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* SECCIÓN NOTICIAS Y EVENTOS DESTACADOS (SEGÚN INSTRUCCIÓN DEL DOCX: Foto 04 + Texto + Botón) */}
            <section style={{ padding: '5rem 1.5rem', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                  
                  {/* TEXTO + BOTÓN */}
                  <div className="reveal-left">
                    <span style={{ backgroundColor: '#f4f4f4', color: '#af1daa', padding: '0.35rem 1rem', borderRadius: '9999px', fontWeight: '700', fontSize: '0.85rem' }}>
                      EVENTO DESTACADO
                    </span>
                    <h2 style={{ fontSize: '2.2rem', marginTop: '1rem', marginBottom: '1.25rem', lineHeight: '1.3' }}>
                      Así vivimos nuestro 1° Desayuno: Conexión y liderazgo en Compliance
                    </h2>
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                      Espacios exclusivos donde la alta dirección y la integridad corporativa se encuentran. Así fue nuestro primer encuentro de Mujeres en Compliance en el Metropolitan Club, una mañana diseñada para potenciar el apoyo mutuo, el networking estratégico y el intercambio de conocimiento especializado entre líderes que transforman el sector.
                    </p>
                    <button 
                      className="btn btn-fuchsia"
                      onClick={() => {
                        setActiveTab('eventos');
                        openEventDetail('desayuno-1');
                      }}
                    >
                      Ver Reseña Completa <ArrowRight size={18} />
                    </button>
                  </div>

                  {/* FOTO AL FRENTE (FOTO 04) */}
                  <div className="reveal-right">
                    <img 
                      src="/Fotos/Imagen para Inicio - Eventos 04.jpg" 
                      alt="1° Desayuno Mujeres en Compliance Colombia" 
                      style={{
                        width: '100%',
                        borderRadius: '1.5rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                        maxHeight: '420px',
                        objectFit: 'cover',
                        backgroundColor: '#CBD5E1'
                      }}
                      onError={(e) => { (e.target as HTMLImageElement).style.backgroundColor='#CBD5E1'; }}
                    />
                  </div>

                </div>
              </div>
            </section>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PÁGINA 2: EVENTOS (REDISENADA SEGÚN MAQUETA SEGUNDA IMAGEN) */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'eventos' && (
          <div className="fade-in">
            
            {/* 1. HERO SLIDER HEADER EVENTOS (CENTRADO SEGÚN SEGUNDA IMAGEN) */}
            <section style={{ 
              position: 'relative', 
              height: 'calc(100vh - 75px)', 
              minHeight: '520px',
              backgroundColor: '#0A1128', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={eventSlides[eventSlide]}
                alt="Fondo Eventos WIC" 
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.35)',
                  transition: 'all 0.8s ease'
                }}
              />
              
              <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '900px',
                width: '100%',
                margin: '0 auto',
                padding: '0 2rem', 
                color: '#FFFFFF',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <span className="anim-fade-up anim-d1" style={{ 
                  backgroundColor: 'rgba(175, 29, 170, 0.9)', 
                  color: '#FFFFFF', 
                  padding: '0.4rem 1.25rem', 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '1.25rem',
                  borderRadius: '9999px'
                }}>
                  AGENDA 2026
                </span>
                <h1 className="anim-fade-up anim-d2" style={{ color: '#FFFFFF', fontSize: '3.4rem', fontFamily: 'sans-serif', fontWeight: '800', textTransform: 'none', letterSpacing: 'normal', marginBottom: '1.25rem', maxWidth: '850px', lineHeight: '1.15' }}>
                  Nuestros Eventos
                </h1>
                <p className="anim-fade-up anim-d3" style={{ color: '#F1F5F9', fontSize: '1.2rem', maxWidth: '680px', lineHeight: '1.7', margin: '0 auto' }}>
                  Descubre conferencias, seminarios y talleres de certificación diseñados para la vanguardia del cumplimiento legal y la ética corporativa en Colombia.
                </p>
              </div>
            </section>

            <div style={{ backgroundColor: '#f4f4f4', padding: '4rem 1.5rem' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                {/* SI ESTAMOS EN LA VISTA DE DETALLE DEL PRIMER DESAYUNO */}
                {viewingEventDetail ? (
                  <div style={{ margin: '0 -1.5rem', backgroundColor: '#f4f4f4' }}>

                    {/* ── HERO MORADO SPLIT (MAQUETA) ── */}
                    <div className="events-hero-split" style={{
                      background: currentEvent.heroGradient,
                      borderRadius: '24px'
                    }}>
                      {/* Columna izquierda */}
                      <div style={{ padding: '3.5rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#FFFFFF', zIndex: 2 }}>
                         <button
                          className="anim-fade-up anim-d1"
                          onClick={() => setViewingEventDetail(false)}
                          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFF', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '9999px', padding: '0.4rem 1rem', width: 'fit-content' }}
                        >
                          ← Volver a eventos
                        </button>

                        <span className="anim-fade-up anim-d2" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFF', padding: '0.3rem 0.9rem', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '9999px', width: 'fit-content', marginBottom: '1rem', display: 'inline-block' }}>
                          {currentEvent.badge}
                        </span>

                        <h1 className="anim-fade-up anim-d3" style={{ fontSize: '3.8rem', fontWeight: '900', color: '#FFFFFF', lineHeight: '1.0', marginBottom: '0.75rem', letterSpacing: '-1px' }}>
                          {currentEvent.title}
                        </h1>
                        <p className="anim-fade-up anim-d3" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={15} /> {currentEvent.location} • {currentEvent.dateStr}
                        </p>
                        <p className="anim-fade-up anim-d4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: '1.5' }}>
                          {currentEvent.subtitle}
                        </p>

                        {/* Cajas del countdown O Estado de Evento Concluido */}
                        {!currentEvent.isPast ? (
                          <div className="anim-fade-up anim-d5" style={{ display: 'flex', gap: '0.75rem' }}>
                            {[
                              [String(countdown.days).padStart(2,'0'), 'DÍAS'],
                              [String(countdown.hours).padStart(2,'0'), 'HRS'],
                              [String(countdown.minutes).padStart(2,'0'), 'MIN'],
                              [String(countdown.seconds).padStart(2,'0'), 'SEG']
                            ].map(([n,l]) => (
                              <div key={l} style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', padding: '0.85rem 1.2rem', borderRadius: '14px', textAlign: 'center', minWidth: '72px' }}>
                                <span style={{ fontSize: '1.85rem', fontWeight: '900', display: 'block', lineHeight: 1 }}>{n}</span>
                                <span style={{ fontSize: '0.58rem', opacity: 0.75, letterSpacing: '1px', marginTop: '0.2rem', display: 'block' }}>{l}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="anim-fade-up anim-d5" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', padding: '0.65rem 1.25rem', borderRadius: '9999px', color: '#FFF', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <CheckCircle2 size={18} style={{ color: '#4ADE80' }} /> Evento Concluido con Éxito
                            </div>
                            {currentEvent.attendeesCount && (
                              <div style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', padding: '0.65rem 1.25rem', borderRadius: '9999px', color: '#FFF', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={18} style={{ color: '#F472B6' }} /> {currentEvent.attendeesCount}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Columna derecha: foto recortada con gradiente */}
                      <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#e6affc' }}>
                        <img
                          src={currentEvent.heroImage}
                          alt={currentEvent.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #af1daa 0%, transparent 40%)' }} />
                      </div>
                    </div>

                    {/* ── CUERPO PRINCIPAL ── */}
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4.5rem 2rem 3rem' }}>

                      {/* ── GALERÍA 4 FOTOS + PANEL INSCRIPCIÓN / RESUMEN ── */}
                      <div className="events-detail-grid">
                        
                        {/* Izquierda: descripción + grilla fotos */}
                        <div className="reveal-left">
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.75rem' }}>
                            {currentEvent.photos.map((src, i) => (
                              <div key={i} className={`reveal-scale delay-${i + 1}`} style={{ borderRadius: '8px', overflow: 'hidden', height: '175px', backgroundColor: '#F1F5F9' }}>
                                <img src={src} alt={`Evento foto ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#CBD5E1' }} onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = PHOTO_FALLBACK; }} />
                              </div>
                            ))}
                          </div>
                          <h3 style={{ color: '#af1daa', fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>
                            {currentEvent.isPast ? 'Galería Fotografías & Memorias' : 'Descripción del evento'}
                          </h3>
                          {currentEvent.description.map((descParagraph, idx) => (
                            <p key={idx} style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
                              {descParagraph}
                            </p>
                          ))}
                        </div>

                        {/* Derecha: Panel Lateral (Inscripción O Resumen de Evento Realizado) */}
                        {!currentEvent.isPast ? (
                          <div className="reveal-right" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #e6affc', boxShadow: '0 8px 32px rgba(175, 29, 170,0.10)', padding: '2rem', position: 'sticky', top: '100px' }}>
                            <h4 style={{ color: '#1E1B4B', fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                              Inscripción al Evento
                            </h4>
                            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                              Completa tus datos para reservar tu cupo
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                              <input
                                type="text"
                                placeholder="Nombre completo"
                                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#334155' }}
                              />
                              <input
                                type="email"
                                placeholder="Correo electrónico"
                                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#334155' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                                  <input type="radio" name="modalidad" defaultChecked style={{ accentColor: '#af1daa' }} />
                                  Presencial - Bogotá
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                                  <input type="radio" name="modalidad" style={{ accentColor: '#af1daa' }} />
                                  Virtual (Transmisión en Vivo)
                                </label>
                              </div>
                            </div>

                            <button
                              onClick={() => alert('¡Inscripción enviada! Recibirás confirmación a tu correo.')}
                              style={{ width: '100%', background: 'linear-gradient(90deg, #af1daa, #eb54ff)', color: '#FFFFFF', border: 'none', padding: '0.9rem', fontWeight: '800', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer', marginBottom: '1rem', letterSpacing: '0.5px' }}
                            >
                              INSCRIBIRSE AL EVENTO
                            </button>
                            <span style={{ display: 'block', textAlign: 'center', color: '#af1daa', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
                              Descargar documento informativo
                            </span>

                            <div style={{ borderTop: '1px solid #f4f4f4', marginTop: '1.5rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.85rem' }}>
                                <Calendar size={16} style={{ color: '#af1daa', flexShrink: 0 }} />
                                <span><strong style={{ color: '#1E1B4B' }}>{currentEvent.dateStr}</strong></span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.85rem' }}>
                                <MapPin size={16} style={{ color: '#af1daa', flexShrink: 0 }} />
                                <span><strong style={{ color: '#1E1B4B' }}>{currentEvent.location}</strong></span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="reveal-right" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #e6affc', boxShadow: '0 8px 32px rgba(175, 29, 170,0.10)', padding: '2rem', position: 'sticky', top: '100px' }}>
                            <div style={{ backgroundColor: '#f4f4f4', color: '#af1daa', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontWeight: '800', fontSize: '0.7rem', width: 'fit-content', marginBottom: '1rem', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <CheckCircle2 size={14} /> EVENTO FINALIZADO
                            </div>
                            <h4 style={{ color: '#1E1B4B', fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                              Resumen & Memorias
                            </h4>
                            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                              Las inscripciones para este evento han concluido. Puedes consultar la galería oficial y descargar las memorias en PDF.
                            </p>

                            <div style={{ backgroundColor: '#f4f4f4', border: '1px solid #e6affc', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                                <span style={{ color: '#64748B' }}>Estado:</span>
                                <strong style={{ color: '#16A34A' }}>Concluido</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                                <span style={{ color: '#64748B' }}>Fecha realizada:</span>
                                <strong style={{ color: '#1E1B4B' }}>{currentEvent.dateStr}</strong>
                              </div>
                              {currentEvent.attendeesCount && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                                  <span style={{ color: '#64748B' }}>Asistencia:</span>
                                  <strong style={{ color: '#af1daa' }}>{currentEvent.attendeesCount}</strong>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => alert('Descargando memorias técnicas del evento en PDF...')}
                              style={{ width: '100%', background: 'linear-gradient(90deg, #af1daa, #eb54ff)', color: '#FFFFFF', border: 'none', padding: '0.9rem', fontWeight: '800', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '1rem', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                              <Download size={18} /> DESCARGAR MEMORIAS (PDF)
                            </button>

                            <div style={{ borderTop: '1px solid #e6affc', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.85rem' }}>
                                <Calendar size={16} style={{ color: '#af1daa', flexShrink: 0 }} />
                                <span><strong style={{ color: '#1E1B4B' }}>{currentEvent.dateStr}</strong></span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.85rem' }}>
                                <MapPin size={16} style={{ color: '#af1daa', flexShrink: 0 }} />
                                <span><strong style={{ color: '#1E1B4B' }}>{currentEvent.location}</strong></span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── AGENDA DEL EVENTO DEDICADA ── */}
                      <div style={{ padding: '3rem 0', marginBottom: '4rem' }}>
                        <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1E1B4B' }}>Agenda del Evento</h2>
                          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>Programa técnico de conferencias y talleres</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {currentEvent.agenda.map((item, i) => (
                            <div key={i} className={`reveal delay-${i + 1} card-hover`} style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '1.25rem 1.75rem', display: 'grid', gridTemplateColumns: '130px 1fr auto', gap: '1.5rem', alignItems: 'center', border: '1px solid #e6affc' }}>
                              <span style={{ color: '#af1daa', fontWeight: '800', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{item.time}</span>
                              <div>
                                <p style={{ color: '#1E1B4B', fontWeight: '700', fontSize: '1rem', margin: '0 0 0.25rem' }}>{item.title}</p>
                                <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0 }}>{item.desc}</p>
                              </div>
                              <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: '600', textAlign: 'right', whiteSpace: 'nowrap' }}>{item.sala}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ── EXPOSITORES DEDICADOS ── */}
                      <div style={{ marginBottom: '4.5rem' }}>
                        <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                          <span style={{ color: '#af1daa', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>PANELISTAS INVITADOS</span>
                          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1E1B4B', marginTop: '0.4rem' }}>EXPOSITORES</h2>
                        </div>
                        <div className="events-speakers-grid">
                          {currentEvent.speakers.map((m, i) => (
                            <div key={i} className={`reveal-scale delay-${i + 1} card-hover`} style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #e6affc', textAlign: 'center', padding: '1.5rem 1rem', boxShadow: '0 4px 16px rgba(175,29,170,0.06)', overflow: 'hidden' }}>
                              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                                <img src={m.photo} alt={m.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', border: '3px solid #e6affc', backgroundColor: '#CBD5E1', display: 'block' }} onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = AVATAR_FALLBACK; }} />
                                <span style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#af1daa', color: '#FFF', fontSize: '0.55rem', fontWeight: '700', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>WIC</span>
                              </div>
                              <h4 style={{ fontSize: '0.95rem', color: '#1E1B4B', fontWeight: '800', marginBottom: '0.3rem', lineHeight: '1.25' }}>{m.name}</h4>
                              <span style={{ color: '#af1daa', fontSize: '0.72rem', fontWeight: '600', display: 'block' }}>{m.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* ── GALERÍA DE FOTOS AUMENTADA DEL EVENTO CULMINADO (ANTES DEL FOOTER) ── */}
                    {currentEvent.isPast && (
                      <div className="reveal" style={{ backgroundColor: '#f4f4f4', padding: '4rem 2rem', borderRadius: '24px', marginBottom: '2.5rem', border: '1px solid #e6affc' }}>
                        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <span style={{ color: '#af1daa', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>
                              GALERÍA OFICIAL DE FOTOGRAFÍAS
                            </span>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1E1B4B', marginTop: '0.4rem', marginBottom: '0.5rem' }}>
                              Memorias Fotográficas del Evento Culminado
                            </h2>
                            <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
                              Registro ampliado de momentos destacados, paneles técnicos y espacios de networking de esta edición.
                            </p>
                          </div>

                          <div className="events-past-gallery-grid">
                            {currentEvent.photos.map((src, i) => (
                              <div 
                                key={i} 
                                className={`reveal-scale delay-${(i % 4) + 1} card-hover`}
                                style={{ 
                                  borderRadius: '16px', 
                                  overflow: 'hidden', 
                                  height: '210px', 
                                  backgroundColor: '#CBD5E1', 
                                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                                  border: '1px solid #E2E8F0'
                                }}
                              >
                                <img 
                                  src={src} 
                                  alt={`Galería Fotográfica ${i+1}`} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#CBD5E1' }} 
                                  onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = PHOTO_FALLBACK; }} 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── COUNTDOWN REAL OSCURO (FULL WIDTH) - SOLO PARA EVENTOS FUTUROS ── */}
                    {!currentEvent.isPast && (
                      <div className="reveal" style={{ backgroundColor: '#0A1128', padding: '4rem 2rem', textAlign: 'center', color: '#FFFFFF', borderRadius: '24px', margin: '0 0 0 0' }}>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>NO TE QUEDES SIN TU CUPO</p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2.5rem', color: '#FFFFFF' }}>El Evento comienza en:</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                          {([
                            [String(countdown.days).padStart(2,'0'), 'DÍAS'],
                            [String(countdown.hours).padStart(2,'0'), 'HRS'],
                            [String(countdown.minutes).padStart(2,'0'), 'MIN'],
                            [String(countdown.seconds).padStart(2,'0'), 'SEG'],
                          ] as [string,string][]).map(([n,l], i) => (
                            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ textAlign: 'center', minWidth: '90px' }}>
                                <span style={{ fontSize: '5rem', fontWeight: '900', color: '#eb54ff', display: 'block', lineHeight: 1 }}>{n}</span>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '2px', marginTop: '0.5rem', display: 'block' }}>{l}</span>
                              </div>
                              {i < 3 && <span style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>:</span>}
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => alert('¡Inscripción lista!')}
                          style={{ background: 'linear-gradient(90deg,#af1daa,#eb54ff)', color: '#FFF', border: 'none', padding: '0.9rem 2.8rem', borderRadius: '9999px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.5px' }}
                        >
                          INSCRÍBETE AL EVENTO
                        </button>
                      </div>
                    )}

                    {/* ── AUSPICIADORES ── */}
                    <div style={{ backgroundColor: '#f4f4f4', padding: '4rem 2rem' }}>
                      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <span style={{ color: '#af1daa', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>COLABORADORES OFICIALES</span>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1E1B4B', marginTop: '0.4rem', marginBottom: '2.5rem' }}>Auspiciadores</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
                          {[1,2,3,4].map(i => (
                            <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', width: '160px', height: '80px', border: '1px solid #e6affc', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(175, 29, 170,0.06)' }}>
                              <span style={{ color: '#CBD5E1', fontSize: '0.75rem', fontWeight: '600' }}>LOGO EMPRESA</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ── BANNER INTERESADO EN AUSPICIAR (MORADO OSCURO) ── */}
                    <div className="reveal" style={{ background: 'linear-gradient(105deg,#4A0772,#7E22CE)', padding: '4rem 2rem', textAlign: 'center', color: '#FFFFFF', borderRadius: '24px' }}>
                      <span style={{ fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>¿TIENES UNA EMPRESA?</span>
                      <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0.75rem 0 1rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.25', color: '#FFFFFF' }}>
                        Interesado en Auspiciar este Evento
                      </h2>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
                        Maximiza la visibilidad de tu empresa frente a los líderes de cumplimiento más influyentes de Colombia.
                      </p>
                      <button
                        onClick={() => alert('Gracias por tu interés. Nos pondremos en contacto contigo pronto.')}
                        style={{ backgroundColor: '#FFFFFF', color: '#af1daa', border: 'none', padding: '0.85rem 2.5rem', borderRadius: '9999px', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer' }}
                      >
                        CONTACTAR AL ORGANIZADOR
                      </button>
                    </div>

                    {/* ── EVENTOS PASADOS ── */}
                    <div style={{ backgroundColor: '#FAFAFA', padding: '4rem 2rem' }}>
                      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1E1B4B' }}>OTROS EVENTOS REALIZADOS</h2>
                          <span style={{ color: '#af1daa', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>2 EVENTOS</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                          {[
                            {
                              id: 'desayuno-1',
                              src: '/Fotos/Imagen para Inicio - Eventos 04.jpg',
                              label: '1er Desayuno Mujeres in Compliance',
                              date: 'JUNIO 2026',
                              lugar: 'Metropolitan Club · Bogotá'
                            },
                            {
                              id: 'seminario-sagrilaft',
                              src: '/Fotos/Fotos Desayuno 07/Foto 04.jpg',
                              label: 'Seminario de Riesgos Penales & SAGRILAFT',
                              date: 'MAYO 2026',
                              lugar: 'Modalidad Híbrida · Bogotá'
                            },
                          ].map((ev, i) => (
                            <div key={i} className={`reveal delay-${i + 1} card-hover`} style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '260px', cursor: 'pointer', backgroundColor: '#E2E8F0' }} onClick={() => openEventDetail(ev.id)}>
                              <img src={ev.src} alt={ev.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,0,30,0.82) 0%, rgba(10,0,30,0.2) 50%, transparent 100%)' }} />
                              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
                                <span style={{ color: '#e6affc', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '2px', display: 'block', marginBottom: '0.35rem' }}>{ev.date}</span>
                                <p style={{ color: '#FFFFFF', fontWeight: '800', fontSize: '1.05rem', margin: '0 0 0.35rem', lineHeight: '1.3' }}>{ev.label}</p>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{ev.lugar}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* VISTA PRINCIPAL DE EVENTOS */
                  <div>
                    
                    {/* 2. SECCIÓN PRÓXIMOS EVENTOS (MOSTRAR ÚNICAMENTE 'No hay próximos eventos') */}
                    <div style={{ marginBottom: '4rem' }}>
                      <div style={{ borderLeft: '4px solid #af1daa', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', fontFamily: 'serif', color: '#1E1B4B', textTransform: 'uppercase', margin: 0 }}>
                          Próximos Eventos
                        </h2>
                      </div>

                      <div style={{
                        backgroundColor: '#f4f4f4',
                        border: '1.5px solid #e6affc',
                        borderRadius: '16px',
                        padding: '3.5rem 2rem',
                        textAlign: 'center',
                        boxShadow: '0 4px 20px rgba(175, 29, 170, 0.05)'
                      }}>
                        <Calendar size={44} style={{ color: '#af1daa', marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E1B4B', marginBottom: '0.5rem' }}>
                          No hay próximos eventos
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto', lineHeight: '1.6' }}>
                          Próximamente estaremos anunciando nuestras nuevas conferencias, paneles y espacios de networking para 2026.
                        </p>
                      </div>
                    </div>

                    {/* 3. SECCIÓN EVENTO PREVIO (DESAYUNO WIC COLOMBIA) CON FONDO OFICIAL #f4f4f4 */}
                    <div style={{ backgroundColor: '#f4f4f4', borderRadius: '24px', padding: '3.5rem 2rem', marginBottom: '4rem', border: '1.5px solid #e6affc' }}>
                      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        
                        {/* CABECERA Y BADGE DESTACADO */}
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                          <span style={{ backgroundColor: '#af1daa', color: '#FFFFFF', padding: '0.4rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: '9999px', display: 'inline-block', marginBottom: '1rem' }}>
                            EVENTO REALIZADO
                          </span>
                          <h2 style={{ fontSize: '2.4rem', fontFamily: 'serif', color: '#1E1B4B', fontWeight: '800', marginBottom: '0.75rem' }}>
                            Desayuno WIC Colombia
                          </h2>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ backgroundColor: '#eb54ff', color: '#FFFFFF', padding: '0.4rem 1.2rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: '800', boxShadow: '0 2px 8px rgba(203,84,255,0.3)' }}>
                              ✨ Más de 30 Asistentes
                            </span>
                            <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                              <MapPin size={16} style={{ color: '#af1daa' }} /> Bogotá, Colombia
                            </span>
                          </div>
                        </div>

                        {/* DESCRIPCIÓN DEL EVENTO */}
                        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '2rem 2.5rem', marginBottom: '3rem', border: '1px solid #e6affc', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                          <h3 style={{ color: '#af1daa', fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                            Descripción del Evento
                          </h3>
                          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.8', margin: 0 }}>
                            El Desayuno de Trabajo WIC Colombia reunió a destacadas especialistas, directoras legales y oficiales de cumplimiento para analizar las tendencias clave en Gobierno Corporativo, Gestión de Riesgos y Compliance. Un encuentro exclusivo de aprendizaje, intercambio de experiencias y networking estratégico entre líderes del sector público y privado.
                          </p>
                        </div>

                        {/* AGENDA DEL EVENTO PREVIO */}
                        <div style={{ marginBottom: '3rem' }}>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1E1B4B', textAlign: 'center', marginBottom: '1.5rem' }}>
                            Agenda del Evento
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {[
                              { time: '08:00 – 08:30', title: 'Registro & Desayuno de Networking', desc: 'Recepción de asistentes e integración estratégica.', sala: 'Salón Principal' },
                              { time: '08:30 – 09:30', title: 'Ponencia Principal: Gobierno Corporativo y Compliance', desc: 'Conferencia sobre buenas prácticas de gobierno e integridad corporativa.', sala: 'Auditorio' },
                              { time: '09:30 – 10:30', title: 'Mesa de Diálogo & Cierre', desc: 'Espacio de preguntas, conclusiones y compromisos de la red.', sala: 'Salón Principal' },
                            ].map((item, i) => (
                              <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.15rem 1.5rem', display: 'grid', gridTemplateColumns: '130px 1fr auto', gap: '1.25rem', alignItems: 'center', border: '1px solid #e6affc' }}>
                                <span style={{ color: '#af1daa', fontWeight: '800', fontSize: '0.85rem' }}>{item.time}</span>
                                <div>
                                  <p style={{ color: '#1E1B4B', fontWeight: '700', fontSize: '0.95rem', margin: '0 0 0.2rem' }}>{item.title}</p>
                                  <p style={{ color: '#64748B', fontSize: '0.82rem', margin: 0 }}>{item.desc}</p>
                                </div>
                                <span style={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: '600' }}>{item.sala}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* EXPOSITORA PRINCIPAL */}
                        <div style={{ marginBottom: '3.5rem' }}>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1E1B4B', textAlign: 'center', marginBottom: '1.5rem' }}>
                            Expositora
                          </h3>
                          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '2rem', border: '1px solid #e6affc', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', maxWidth: '720px', margin: '0 auto', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                            <img 
                              src="/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg" 
                              alt="Adriana Patricia Gómez Barajas" 
                              style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', border: '3px solid #af1daa', flexShrink: 0 }}
                            />
                            <div>
                              <span style={{ color: '#af1daa', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>PRESIDENTA WIC COLOMBIA</span>
                              <h4 style={{ fontSize: '1.2rem', color: '#1E1B4B', fontWeight: '800', marginBottom: '0.35rem' }}>ADRIANA PATRICIA GÓMEZ BARAJAS</h4>
                              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                                Directora de la línea de Gobierno Corporativo, Riesgos y Compliance / Socia Cremades & Calvo-Sotelo.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* GALERÍA OFICIAL DE FOTOS (8 FOTOS DEL DESAYUNO) */}
                        <div style={{ marginBottom: '3.5rem' }}>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1E1B4B', textAlign: 'center', marginBottom: '0.5rem' }}>
                            Galería Fotografías del Desayuno
                          </h3>
                          <p style={{ color: '#64748B', fontSize: '0.88rem', textAlign: 'center', marginBottom: '1.75rem' }}>
                            Registro fotográfico del encuentro presencial de WIC Colombia
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }} className="events-past-gallery-grid">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <div key={num} className="card-hover" style={{ borderRadius: '12px', overflow: 'hidden', height: '180px', backgroundColor: '#FFFFFF', border: '1px solid #e6affc', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <img 
                                  src={`/Fotos/Fotos Desayuno 07/Desayuno WIC COL 07 (${num}).jpg`} 
                                  alt={`Desayuno WIC ${num}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { (e.target as HTMLImageElement).src = `/Fotos/Fotos Desayuno 07/Foto 0${num}.jpg`; }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* COLABORADORES OFICIALES */}
                        <div>
                          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                            <span style={{ color: '#af1daa', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>
                              ALIANZAS ESTRATÉGICAS
                            </span>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E1B4B', marginTop: '0.25rem' }}>
                              COLABORADORES OFICIALES
                            </h3>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '950px', margin: '0 auto' }} className="events-grid-3col">
                            {/* COLABORADOR 1 */}
                            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem 1.25rem', border: '1.5px solid #e6affc', textAlign: 'center', boxShadow: '0 4px 14px rgba(175,29,170,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: '#af1daa', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>FIRMA INTERNACIONAL</span>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Cremades & Calvo-Sotelo</h4>
                            </div>

                            {/* COLABORADOR 2 */}
                            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem 1.25rem', border: '1.5px solid #e6affc', textAlign: 'center', boxShadow: '0 4px 14px rgba(175,29,170,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: '#af1daa', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>FIRMA COLABORADORA</span>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>Preciado Abogados</h4>
                            </div>

                            {/* COLABORADOR 3 */}
                            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem 1.25rem', border: '1.5px solid #e6affc', textAlign: 'center', boxShadow: '0 4px 14px rgba(175,29,170,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                              <img src="/Logo/Logo WIC COL  (1).png" alt="WIC Colombia" style={{ height: '44px', objectFit: 'contain', marginBottom: '0.4rem' }} />
                              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>WIC Colombia</h4>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* 4. BLOQUE AUSPICIADOR EMPRESARIAL (SEGÚN MAQUETA SEGUNDA IMAGEN) */}
                    <div className="reveal" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '3rem', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '3rem', alignItems: 'center' }}>
                      <div>
                        <h2 style={{ fontSize: '2.5rem', fontFamily: 'serif', color: '#1E1B4B', marginBottom: '1rem', lineHeight: '1.2' }}>
                          ¿Quieres ser el próximo auspiciador empresarial?
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '1rem', marginBottom: '2rem' }}>
                          Postula a la mejor membresía de Compliance y destaca por tu perfil.
                        </p>
                        <button 
                          className="btn btn-fuchsia" 
                          onClick={() => setActiveTab('miembros')}
                          style={{ padding: '0.85rem 2rem', backgroundColor: '#af1daa', fontWeight: '700', letterSpacing: '0.5px' }}
                        >
                          ÚNETE (JOIN US)
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="card-hover" style={{ backgroundColor: '#f4f4f4', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #f4f4f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.8rem', fontFamily: 'serif', fontWeight: '700', color: '#af1daa' }}>+75</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.5px' }}>MIEMBROS</span>
                        </div>
                        <div className="card-hover" style={{ backgroundColor: '#f4f4f4', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #f4f4f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.8rem', fontFamily: 'serif', fontWeight: '700', color: '#af1daa' }}>+10</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.5px', textAlign: 'right' }}>BENEFICIOS EXCLUSIVOS</span>
                        </div>
                        <div className="card-hover" style={{ backgroundColor: '#f4f4f4', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #f4f4f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.8rem', fontFamily: 'serif', fontWeight: '700', color: '#af1daa' }}>+5</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748B', letterSpacing: '0.5px', textAlign: 'right' }}>EVENTOS AL AÑO</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* PÁGINA 3: MIEMBROS                                   */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'miembros' && (
          <div className="fade-in">
            
            {/* PORTADA MIEMBROS - PANTALLA COMPLETA */}
            <section style={{ 
              position: 'relative', 
              height: 'calc(100vh - 75px)', 
              minHeight: '550px',
              backgroundColor: '#0A1128', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <img 
                src="/Fotos/Imagen de portada Miembros - 09.jpg" 
                alt="Miembros WIC Colombia" 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
              />
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="anim-fade-up anim-d1" style={{ 
                  backgroundColor: 'rgba(175, 29, 170, 0.9)', 
                  color: '#FFFFFF', 
                  padding: '0.4rem 1.25rem', 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '1.25rem',
                  borderRadius: '9999px'
                }}>
                  DIRECTORIO PROFESIONAL
                </span>
                <h1 className="anim-fade-up anim-d2" style={{ color: '#FFFFFF', fontSize: '3.4rem', fontWeight: '800', marginBottom: '1.25rem', maxWidth: '850px', lineHeight: '1.15' }}>
                  Nuestras Afiliadas Fundadoras
                </h1>
                <p className="anim-fade-up anim-d3" style={{ color: '#F1F5F9', fontSize: '1.2rem', maxWidth: '680px', lineHeight: '1.7', margin: '0 auto' }}>
                  Líderes de Cumplimiento, Ética y Gobierno Corporativo en Colombia
                </p>
              </div>
            </section>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem' }}>
              
              {/* BUSCADOR Y FILTRADO POR DESPLEGABLE (INPUT LIST) DE TAGS */}
              <div className="reveal" style={{ 
                backgroundColor: '#FFFFFF', 
                padding: '1.75rem 2rem', 
                borderRadius: '1.25rem', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid #E2E8F0',
                marginBottom: '3rem',
                maxWidth: '960px',
                margin: '0 auto 3rem auto',
                position: 'relative',
                zIndex: 30
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'center' }}>
                  
                  {/* BARRA DE BÚSQUEDA POR TEXTO */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '0.75rem 1.25rem',
                  }}>
                    <Search size={20} style={{ color: '#af1daa', flexShrink: 0 }} />
                    <input 
                      type="text"
                      placeholder="Buscar por nombre de afiliada, cargo o sector..."
                      value={searchMember}
                      onChange={(e) => setSearchMember(e.target.value)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit',
                        backgroundColor: 'transparent',
                        color: '#1E1B4B'
                      }}
                    />
                    {searchMember && (
                      <button 
                        onClick={() => setSearchMember('')} 
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                        title="Limpiar búsqueda"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  {/* INPUT LIST DESPLEGABLE PERSONALIZADO DE ESPECIALIDADES / TAGS */}
                  <div style={{ position: 'relative' }}>
                    <div 
                      onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: selectedTag !== 'Todos' ? '#f4f4f4' : '#F8FAFC',
                        border: selectedTag !== 'Todos' ? '1.5px solid #af1daa' : '1px solid #CBD5E1',
                        borderRadius: '10px',
                        padding: '0.75rem 1.25rem',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: isTagDropdownOpen ? '0 0 0 3px rgba(170,38,179,0.15)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                        <Filter size={16} style={{ color: selectedTag !== 'Todos' ? '#af1daa' : '#64748B', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.88rem', fontWeight: selectedTag !== 'Todos' ? '700' : '600', color: selectedTag !== 'Todos' ? '#af1daa' : '#334155', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {selectedTag === 'Todos' ? 'Todas las Especialidades / Tags' : `Tag: ${selectedTag}`}
                        </span>
                      </div>
                      <ChevronDown size={18} style={{ color: selectedTag !== 'Todos' ? '#af1daa' : '#64748B', transform: isTagDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                    </div>

                    {/* MENÚ FLOTANTE DESPLEGABLE CON SCROLLBAR ELEGANTE */}
                    {isTagDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        left: 0,
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                        border: '1px solid #E2E8F0',
                        zIndex: 50,
                        maxHeight: '260px',
                        overflowY: 'auto',
                        padding: '0.4rem'
                      }}>
                        <div 
                          onClick={() => { setSelectedTag('Todos'); setIsTagDropdownOpen(false); }}
                          style={{
                            padding: '0.65rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: selectedTag === 'Todos' ? '700' : '500',
                            color: selectedTag === 'Todos' ? '#af1daa' : '#334155',
                            backgroundColor: selectedTag === 'Todos' ? '#f4f4f4' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.2rem'
                          }}
                        >
                          <span>Todas las Especialidades</span>
                          {selectedTag === 'Todos' && <CheckCircle2 size={14} style={{ color: '#af1daa' }} />}
                        </div>

                        {availableMemberTags.map((tag) => {
                          const isSelected = selectedTag === tag;
                          return (
                            <div
                              key={tag}
                              onClick={() => { setSelectedTag(tag); setIsTagDropdownOpen(false); }}
                              style={{
                                padding: '0.65rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: isSelected ? '700' : '500',
                                color: isSelected ? '#af1daa' : '#475569',
                                backgroundColor: isSelected ? '#f4f4f4' : 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.15rem'
                              }}
                            >
                              <span>{tag}</span>
                              {isSelected && <CheckCircle2 size={14} style={{ color: '#af1daa' }} />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

                {/* INDICADOR Y BOTÓN RESTABLECER */}
                {(searchMember || selectedTag !== 'Todos') && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      Filtrando por: {selectedTag !== 'Todos' && <strong style={{ color: '#af1daa' }}>Tag: {selectedTag}</strong>} {searchMember && <span style={{ marginLeft: '0.4rem' }}>Texto: "{searchMember}"</span>}
                    </span>
                    <button 
                      onClick={() => { setSearchMember(''); setSelectedTag('Todos'); }}
                      style={{ background: 'none', border: 'none', color: '#af1daa', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>

              {/* GRID DE MIEMBROS O ESTADO VACÍO */}
              {(() => {
                const normalizeText = (str: string) => 
                  (str || '')
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

                const query = normalizeText(searchMember);
                const tagQuery = normalizeText(selectedTag);

                const filteredMembers = membersList.filter(member => {
                  const matchesSearch = !query || 
                    normalizeText(member.name).includes(query) ||
                    normalizeText(member.currentCargo).includes(query) ||
                    normalizeText(member.sector).includes(query) ||
                    normalizeText(member.role).includes(query) ||
                    normalizeText(member.profession).includes(query) ||
                    (member.tags || []).some(tag => normalizeText(tag).includes(query));

                  const matchesTag = selectedTag === 'Todos' || 
                    (member.tags || []).some(tag => normalizeText(tag) === tagQuery);

                  return matchesSearch && matchesTag;
                });

                if (filteredMembers.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#FFFFFF', borderRadius: '1.25rem', border: '1px solid #E2E8F0', margin: '2rem 0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <Users size={48} style={{ color: '#CBD5E1', marginBottom: '1rem' }} />
                      <h3 style={{ fontSize: '1.25rem', color: '#1E1B4B', fontWeight: '700', marginBottom: '0.5rem' }}>
                        No se encontraron afiliadas
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
                        No hay coincidencias para tu búsqueda actual. Intenta probar con otro nombre, cargo o restableciendo los filtros.
                      </p>
                      <button 
                        onClick={() => { setSearchMember(''); setSelectedTag('Todos'); }}
                        style={{ backgroundColor: '#af1daa', color: '#FFFFFF', border: 'none', padding: '0.65rem 1.6rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Ver todas las miembros
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="members-grid" style={{ position: 'relative', zIndex: 1 }}>
                    {filteredMembers.map((member, idx) => (
                      <div 
                        key={member.id}
                        className={`card-hover anim-scale-in anim-d${(idx % 4) + 1}`}
                        style={{ 
                          backgroundColor: '#FFFFFF', 
                          borderRadius: '1.25rem', 
                          overflow: 'hidden', 
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ height: '320px', overflow: 'hidden', backgroundColor: '#CBD5E1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #F1F5F9' }}>
                          <img 
                            src={member.photo} 
                            alt={member.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', backgroundColor: '#CBD5E1' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.backgroundColor = '#CBD5E1';
                            }}
                          />
                          <span style={{ 
                            position: 'absolute', 
                            bottom: '1rem', 
                            left: '1rem', 
                            backgroundColor: 'rgba(10, 17, 40, 0.85)', 
                            color: '#FFF', 
                            padding: '0.35rem 0.85rem', 
                            borderRadius: '9999px', 
                            fontSize: '0.75rem', 
                            fontWeight: '700',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}>
                            {member.sector}
                          </span>
                        </div>

                        <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ color: '#af1daa', fontWeight: '700', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                            {member.role}
                          </div>
                          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                            {member.name}
                          </h3>
                          <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1rem', flex: 1, lineHeight: '1.5' }}>
                            {member.currentCargo}
                          </p>

                          {/* TAGS EN TARJETA DE MIEMBRO */}
                          {member.tags && member.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                              {member.tags.slice(0, 3).map((tag, tIdx) => (
                                <span 
                                  key={tIdx} 
                                  onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
                                  style={{ 
                                    backgroundColor: '#f4f4f4', 
                                    color: '#af1daa', 
                                    border: '1px solid #e6affc', 
                                    fontSize: '0.65rem', 
                                    fontWeight: '700', 
                                    padding: '0.2rem 0.55rem', 
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <button 
                            className="btn btn-outline-fuchsia"
                            onClick={() => setSelectedMember(member)}
                            style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }}
                          >
                            Ver Perfil Profesional
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

            </div>
          </div>
        )}

        {/* MODAL VISUALIZADOR DE MIEMBRO (RESPONSIVO MÓVIL Y DESKTOP) */}
        {selectedMember && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div className="fade-in member-modal-card" style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)'
            }}>
              {/* BOTÓN CERRAR ESQUINA DERECHA */}
              <button 
                onClick={() => setSelectedMember(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#1E293B',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  zIndex: 20,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                <X size={20} />
              </button>

              <div className="member-modal-grid">
                {/* COLUMNA IZQUIERDA: FOTO */}
                <div className="member-modal-photo-container">
                  <img 
                    src={selectedMember.photo} 
                    alt={selectedMember.name}
                    className="member-modal-photo"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.backgroundColor = '#CBD5E1';
                    }}
                  />
                </div>

                {/* COLUMNA DERECHA: INFORMACIÓN DETALLADA */}
                <div className="member-modal-info">
                  <div>
                    {/* NOMBRE DEL MIEMBRO */}
                    <h2 style={{ fontSize: '2.1rem', fontFamily: 'serif', color: '#1E1B4B', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.2' }}>
                      {selectedMember.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </h2>

                    {/* BADGES ROL Y LINKEDIN */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      <span style={{ 
                        backgroundColor: '#af1daa', 
                        color: '#FFFFFF', 
                        padding: '0.4rem 1rem', 
                        fontSize: '0.8rem', 
                        fontWeight: '700',
                        borderRadius: '4px'
                      }}>
                        {selectedMember.role}
                      </span>

                      {selectedMember.linkedin && (
                        <a 
                          href={selectedMember.linkedin} 
                          target="_blank" 
                          rel="noreferrer"
                          title="Perfil en LinkedIn"
                          style={{ 
                            border: '1.5px solid #af1daa',
                            color: '#af1daa', 
                            padding: '0.35rem 0.6rem', 
                            borderRadius: '4px', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            textDecoration: 'none',
                            backgroundColor: '#f4f4f4'
                          }}
                        >
                          <LinkedinIcon size={16} />
                        </a>
                      )}
                    </div>

                    {/* BIOGRAFÍA PROFESIONAL */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ 
                        color: '#af1daa', 
                        fontSize: '0.75rem', 
                        fontWeight: '700', 
                        letterSpacing: '0.5px', 
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '0.5rem',
                        borderBottom: '1px solid #e6affc',
                        paddingBottom: '0.4rem'
                      }}>
                        BIOGRAFÍA PROFESIONAL
                      </span>

                      <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.7', textAlign: 'justify', margin: 0 }}>
                        {selectedMember.complianceExperience || `Experta en marcos regulatorios financieros con más de 15 años de trayectoria en el sector de Compliance y Auditoría Interna. Su trayectoria se ha centrado en el desarrollo de marcos de Buen Gobierno Corporativo y Gestión de Riesgos Empresariales.`}
                      </p>
                    </div>

                    {/* ÁREAS DE ESPECIALIDAD */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <span style={{ color: '#1E1B4B', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
                        ÁREAS DE ESPECIALIDAD
                      </span>

                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {(selectedMember.tags || ['Compliance Penal', 'Gobierno Corporativo', 'ISO 37001', 'Ética Corporativa', 'Gestión de Riesgos']).map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            onClick={() => { setSelectedTag(tag); setSelectedMember(null); }}
                            style={{ 
                              backgroundColor: '#1E293B', 
                              color: '#FFFFFF', 
                              padding: '0.35rem 0.75rem', 
                              fontSize: '0.72rem', 
                              fontWeight: '600', 
                              borderRadius: '4px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            title={`Filtrar afiliadas por ${tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BOTONES INFERIORES */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => alert(`Iniciando contacto con ${selectedMember.name}`)}
                        style={{ 
                          backgroundColor: '#af1daa', 
                          color: '#FFFFFF', 
                          border: 'none', 
                          padding: '0.65rem 1.5rem', 
                          fontWeight: '700', 
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          borderRadius: '4px'
                        }}
                      >
                        Contactar
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedMember(null);
                          setActiveTab('contenido');
                        }}
                        style={{ 
                          backgroundColor: '#FFFFFF', 
                          color: '#1E1B4B', 
                          border: '1px solid #1E1B4B', 
                          padding: '0.65rem 1.25rem', 
                          fontWeight: '700', 
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          borderRadius: '4px'
                        }}
                      >
                        Ver Publicaciones
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', color: '#64748B' }}>
                      <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '0.4rem', borderRadius: '50%', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }} title="Compartir"><Share2 size={16} /></span>
                      <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '0.4rem', borderRadius: '50%', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }} title="Descargar Perfil"><Download size={16} /></span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
        {/* ---------------------------------------------------- */}
        {activeTab === 'contenido' && (
          selectedArticle ? (
            /* VISTA DE DETALLE INDIVIDUAL DE UN ARTÍCULO (MAQUETA DETALLE) */
            <div className="fade-in" style={{ backgroundColor: '#FAFAFC', minHeight: '100vh', paddingBottom: '4rem' }}>
              
              {/* HERO CABECERA DEL ARTÍCULO CON BREADCRUMB, TÍTULO Y META AUTOR */}
              <section style={{ 
                position: 'relative', 
                minHeight: '480px',
                backgroundColor: '#0A1128', 
                display: 'flex', 
                alignItems: 'center',
                color: '#FFFFFF',
                overflow: 'hidden'
              }}>
                <img 
                  src={selectedArticle.image || "/Fotos/Imagen para Inicio - Eventos 04.jpg"} 
                  alt={selectedArticle.title} 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.35)'
                  }}
                  onError={(e) => { (e.target as HTMLImageElement).style.backgroundColor='#CBD5E1'; }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,17,40,0.92) 0%, rgba(10,17,40,0.4) 100%)'
                }} />

                <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem', width: '100%' }}>
                  
                  {/* BREADCRUMBS Y BOTÓN VOLVER */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>
                    <span onClick={() => setSelectedArticle(null)} style={{ cursor: 'pointer' }}>INICIO</span>
                    <span>&gt;</span>
                    <span onClick={() => setSelectedArticle(null)} style={{ cursor: 'pointer' }}>ARTÍCULOS</span>
                    <span>&gt;</span>
                    <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{selectedArticle.category}</span>
                  </div>

                  {/* TÍTULO PRINCIPAL DEL ARTÍCULO */}
                  <h1 style={{ 
                    color: '#FFFFFF', 
                    fontSize: '2.8rem', 
                    fontFamily: 'serif', 
                    fontWeight: '700', 
                    lineHeight: '1.2', 
                    marginBottom: '2rem',
                    maxWidth: '920px' 
                  }}>
                    {selectedArticle.title}
                  </h1>

                  {/* META AUTOR Y CATEGORÍA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {(() => {
                        const authorMember = membersList.find(m => 
                          (selectedArticle.author && m.name && (
                            selectedArticle.author.toLowerCase().includes(m.name.split(' ')[0].toLowerCase()) ||
                            m.name.toLowerCase().includes(selectedArticle.author.toLowerCase())
                          ))
                        );
                        const authorPhoto = selectedArticle.authorPhoto || authorMember?.photo || "/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg";
                        return (
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#CBD5E1', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                            <img 
                              src={authorPhoto} 
                              alt={selectedArticle.author} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                              onError={(e) => { (e.target as HTMLImageElement).src='/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg'; }}
                            />
                          </div>
                        );
                      })()}
                      <div>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'block' }}>
                          AUTOR
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: '700' }}>
                          {selectedArticle.author}
                        </span>
                      </div>
                    </div>

                    <span style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      color: '#4A148C', 
                      padding: '0.35rem 0.85rem', 
                      fontSize: '0.72rem', 
                      fontWeight: '800', 
                      letterSpacing: '1px', 
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {selectedArticle.category}
                    </span>

                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', fontWeight: '600' }}>
                      {selectedArticle.date}
                    </span>
                  </div>

                </div>
              </section>

              {/* SECCIÓN CUERPO DE ARTÍCULO Y SIDEBAR EN 2 COLUMNAS */}
              <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '3.5rem' }}>
                  
                  {/* COLUMNA IZQUIERDA: CONTENIDO COMPLETO DEL ARTÍCULO */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    
                    {/* PRIMER PÁRRAFO CON LETRA CAPITULAR (DROP CAP) */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <p style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.8', margin: 0, textAlign: 'justify' }}>
                        <span style={{ 
                          float: 'left', 
                          fontSize: '3.6rem', 
                          lineHeight: '0.8', 
                          fontWeight: '800', 
                          fontFamily: 'serif', 
                          color: '#1E1B4B', 
                          marginRight: '0.75rem',
                          paddingTop: '0.2rem'
                        }}>
                          E
                        </span>
                        n muchas organizaciones, las funciones de Compliance y Gestión de Riesgos suelen incorporarse cuando una decisión ya fue tomada, un producto ya fue diseñado o un proyecto se encuentra próximo a implementarse. En ese escenario, su participación termina enfocándose en validar, observar o corregir, más que en contribuir estratégicamente a la decisión.
                      </p>
                    </div>

                    <p style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem', textAlign: 'justify' }}>
                      Esta dinámica no responde necesariamente a una falta de interés, sino a una visión históricamente asociada a estas funciones: áreas orientadas principalmente al cumplimiento regulatorio, la mitigación de riesgos y la prevención de incumplimientos. Bajo este enfoque, su involucramiento suele activarse cuando existe una exigencia normativa específica, una observación pendiente o la necesidad de revisar impactos antes de una implementación.
                    </p>

                    {/* CITA DESTACADA (PULL-QUOTE BOX) */}
                    <div style={{ 
                      backgroundColor: '#FDF4FF', 
                      borderLeft: '4px solid #af1daa', 
                      borderRadius: '0 12px 12px 0', 
                      padding: '1.75rem 2rem', 
                      marginBottom: '2rem',
                      position: 'relative'
                    }}>
                      <p style={{ color: '#7B1FA2', fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>
                        "El reto es cambiar una lógica todavía frecuente: involucrar a Compliance y Gestión de Riesgos para cumplir una exigencia, en lugar de integrarlos como parte del proceso de toma de decisiones."
                      </p>
                      <span style={{ position: 'absolute', right: '1.25rem', top: '0.5rem', fontSize: '3rem', color: '#e6affc', fontFamily: 'serif', lineHeight: 1, pointerEvents: 'none' }}>”</span>
                    </div>

                    {/* SUBTÍTULO 1 */}
                    <h2 style={{ fontSize: '1.4rem', fontFamily: 'serif', fontWeight: '700', color: '#7B1FA2', marginBottom: '1rem', marginTop: '2rem' }}>
                      Cuando la oportunidad marca la diferencia
                    </h2>

                    <p style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.8', marginBottom: '1.5rem', textAlign: 'justify' }}>
                      Una participación tardía de Compliance y Gestión de Riesgos puede generar un efecto que muchas veces pasa desapercibido: limita la capacidad de influir en decisiones ya encaminadas. Cuando proyectos, productos o iniciativas avanzan sin incorporar criterios de riesgo y cumplimiento desde etapas tempranas, el margen para anticipar impactos o proponer alternativas se reduce considerablemente.
                    </p>

                    {/* LISTA CON ICONOS DE ESCUDO/CHECK */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={20} style={{ color: '#af1daa', flexShrink: 0 }} />
                        <span style={{ color: '#334155', fontSize: '0.95rem', fontWeight: '600' }}>Identificación temprana de riesgos regulatorios en nuevos mercados.</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={20} style={{ color: '#af1daa', flexShrink: 0 }} />
                        <span style={{ color: '#334155', fontSize: '0.95rem', fontWeight: '600' }}>Reducción de costos por reprocesos en el diseño de productos.</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={20} style={{ color: '#af1daa', flexShrink: 0 }} />
                        <span style={{ color: '#334155', fontSize: '0.95rem', fontWeight: '600' }}>Fortalecimiento de la cultura ética desde la base de la operación.</span>
                      </div>
                    </div>

                    {/* SUBTÍTULO 2 */}
                    <h2 style={{ fontSize: '1.4rem', fontFamily: 'serif', fontWeight: '700', color: '#7B1FA2', marginBottom: '1rem', marginTop: '2rem' }}>
                      ¿Cómo avanzar hacia una participación más estratégica?
                    </h2>

                    <p style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.8', marginBottom: '1.5rem', textAlign: 'justify' }}>
                      Reconocer la importancia de una intervención temprana es solo el primer paso. El reto organizacional consiste en generar condiciones para que Compliance y Gestión de Riesgos participen oportunamente, aportando valor no solo desde el cumplimiento, sino también desde una mejor comprensión de los riesgos y sus impactos.
                    </p>

                    {/* TARJETAS DE DESTACADO EN GRID DE 2 COLUMNAS */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
                      <div style={{ backgroundColor: '#FAF5FF', borderTop: '3px solid #af1daa', padding: '1.25rem', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '0.5rem' }}>Integración Temprana</h4>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                          Involucrar tempranamente a estas funciones en iniciativas relevantes permite una visión proactiva.
                        </p>
                      </div>
                      <div style={{ backgroundColor: '#FAF5FF', borderTop: '3px solid #af1daa', padding: '1.25rem', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '0.5rem' }}>Intervención Continua</h4>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                          Fortalecer espacios de interacción con las líneas de negocio para una retroalimentación constante.
                        </p>
                      </div>
                    </div>

                    {/* SUBTÍTULO Y REFLEXIÓN FINAL */}
                    <h2 style={{ fontSize: '1.3rem', fontFamily: 'serif', fontWeight: '700', color: '#1E1B4B', marginBottom: '0.75rem' }}>
                      Reflexión final
                    </h2>
                    <p style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                      El cumplimiento no debería perseguirse al final del proceso; debería suceder de forma natural como resultado de decisiones bien diseñadas desde el inicio.
                    </p>

                    {/* TAGS DEL ARTÍCULO Y BOTONES DE COMPARTIR */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9', marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {['CORPORATE COMPLIANCE', 'ÉTICA E INTEGRIDAD', 'GESTIÓN DE RIESGOS'].map((tag, tIdx) => (
                          <span key={tIdx} style={{ backgroundColor: '#f4f4f4', color: '#af1daa', fontSize: '0.68rem', fontWeight: '700', padding: '0.3rem 0.65rem', borderRadius: '4px' }}>
                            # {tag}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748B', letterSpacing: '0.8px', marginRight: '0.2rem' }}>COMPARTIR:</span>
                        
                        <a 
                          className="share-btn"
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ backgroundColor: '#0077B5' }}
                          title="Compartir en LinkedIn"
                        >
                          <LinkedinIcon size={14} />
                          <span>LinkedIn</span>
                        </a>

                        <a 
                          className="share-btn"
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}&url=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ backgroundColor: '#000000' }}
                          title="Compartir en X (Twitter)"
                        >
                          <TwitterIcon size={14} />
                          <span>X</span>
                        </a>

                        <a 
                          className="share-btn"
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(selectedArticle.title + ' ' + window.location.href)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ backgroundColor: '#25D366' }}
                          title="Compartir en WhatsApp"
                        >
                          <WhatsappIcon size={14} />
                          <span>WhatsApp</span>
                        </a>

                        <a 
                          className="share-btn"
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ backgroundColor: '#1877F2' }}
                          title="Compartir en Facebook"
                        >
                          <FacebookIcon size={14} />
                          <span>Facebook</span>
                        </a>

                        <button 
                          className="share-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('¡Enlace copiado al portapapeles!');
                          }}
                          style={{ backgroundColor: '#af1daa' }}
                          title="Copiar Enlace"
                        >
                          <Share2 size={14} />
                          <span>Copiar Link</span>
                        </button>
                      </div>
                    </div>

                    {/* BARRA DE NAVEGACIÓN ANTERIOR / SIGUIENTE ARTÍCULO */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
                      <div 
                        onClick={() => {
                          const prev = articlesList.find(a => a.id !== selectedArticle.id);
                          if (prev) openArticleDetail(prev);
                        }}
                        style={{ backgroundColor: '#f4f4f4', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #f4f4f4', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#af1daa', letterSpacing: '0.5px', display: 'block', marginBottom: '0.2rem' }}>
                          ← ANTERIOR
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E1B4B', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Cumplimiento en la economía real
                        </span>
                      </div>

                      <div 
                        onClick={() => {
                          const next = articlesList.find(a => a.id !== selectedArticle.id);
                          if (next) openArticleDetail(next);
                        }}
                        style={{ backgroundColor: '#f4f4f4', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #f4f4f4', cursor: 'pointer', textAlign: 'right' }}
                      >
                        <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#af1daa', letterSpacing: '0.5px', display: 'block', marginBottom: '0.2rem' }}>
                          SIGUIENTE →
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E1B4B', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Gestión ética en la era de la IA
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* COLUMNA DERECHA: SIDEBAR DE DETALLE DE ARTÍCULO */}
                  <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* WIDGET 1: BUSCAR ARTÍCULO */}
                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                      <h3 style={{ fontSize: '1rem', fontFamily: 'serif', fontWeight: '700', color: '#1E1B4B', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        BUSCAR ARTÍCULO
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f4f4f4', border: '1px solid #e6affc', borderRadius: '6px', padding: '0.5rem 0.85rem' }}>
                        <input 
                          type="text" 
                          placeholder="¿Qué estás buscando?" 
                          style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem', color: '#1E1B4B' }}
                        />
                        <Search size={16} style={{ color: '#af1daa' }} />
                      </div>
                    </div>

                    {/* WIDGET 2: ARTÍCULOS RELACIONADOS */}
                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                      <h3 style={{ fontSize: '1rem', fontFamily: 'serif', fontWeight: '700', color: '#1E1B4B', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ARTÍCULOS RELACIONADOS
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                          {
                            title: 'Compliance y buen gobierno corporativo',
                            date: '15 de Diciembre, 2026',
                            image: '/Fotos/Imagen para Inicio - 02.jpg'
                          },
                          {
                            title: 'Teoría y práctica del compliance: breves apuntes',
                            date: '18 de Noviembre, 2026',
                            image: '/Fotos/Imagen para Inicio - 03.jpg'
                          },
                          {
                            title: 'Nuevas regulaciones en la Unión Europea',
                            date: '05 de Octubre, 2026',
                            image: '/Fotos/Imagen para Inicio - Eventos 04.jpg'
                          }
                        ].map((rel, rIdx) => (
                          <div 
                            key={rIdx} 
                            onClick={() => {
                              const match = articlesList[rIdx % articlesList.length];
                              if (match) openArticleDetail(match);
                            }}
                            style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', cursor: 'pointer' }}
                          >
                            <div style={{ width: '54px', height: '54px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#CBD5E1', flexShrink: 0 }}>
                              <img 
                                src={rel.image} 
                                alt={rel.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.backgroundColor='#CBD5E1'; }}
                              />
                            </div>
                            <div>
                              <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1E1B4B', lineHeight: '1.3', marginBottom: '0.2rem' }}>
                                {rel.title}
                              </h4>
                              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{rel.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* WIDGET 3: CATEGORÍAS (CAJA PÚRPURA OSCURA SEGÚN MAQUETA) */}
                    <div style={{ backgroundColor: '#af1daa', color: '#FFFFFF', padding: '1.75rem', borderRadius: '12px', boxShadow: '0 8px 20px rgba(175,29,170,0.15)' }}>
                      <h3 style={{ fontSize: '1rem', fontFamily: 'serif', fontWeight: '700', color: '#FFFFFF', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        CATEGORÍAS
                      </h3>

                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                          { name: 'Gobernanza', count: 12 },
                          { name: 'Gestión de Riesgos', count: '05' },
                          { name: 'Ética Corporativa', count: 24 },
                          { name: 'Derecho Penal', count: '05' }
                        ].map((cat, cIdx) => (
                          <li 
                            key={cIdx}
                            onClick={() => {
                              setSelectedArticleCategory(cat.name);
                              setSelectedArticle(null);
                            }}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem' }}
                          >
                            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>{cat.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>({cat.count})</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </aside>

                </div>
              </div>

            </div>
          ) : (
            /* CATÁLOGO DE PUBLICACIONES (MAQUETA LISTA) */
            <div className="fade-in" style={{ backgroundColor: '#FAFAFC', minHeight: '100vh', paddingBottom: '4rem' }}>
              
              {/* HERO SECTION DE CONTENIDO */}
              <section style={{ 
                position: 'relative', 
                height: 'calc(100vh - 75px)', 
                minHeight: '550px',
                backgroundColor: '#0A1128', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                overflow: 'hidden'
              }}>
                <img 
                  src="/Fotos/Imagen para Inicio - Eventos 04.jpg" 
                  alt="Fondo Contenido WIC" 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.4)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,17,40,0.85) 0%, transparent 70%)'
                }} />

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span className="anim-fade-up anim-d1" style={{ 
                    backgroundColor: 'rgba(175, 29, 170, 0.95)', 
                    color: '#FFFFFF', 
                    padding: '0.4rem 1.25rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '800', 
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '1.25rem',
                    borderRadius: '9999px'
                  }}>
                    COMPLIANCE Y BUEN GOBIERNO CORPORATIVO
                  </span>
                  <h1 className="anim-fade-up anim-d2" style={{ color: '#FFFFFF', fontSize: '3.4rem', fontWeight: '800', marginBottom: '1.25rem', maxWidth: '900px', lineHeight: '1.15' }}>
                    Compliance y Buen Gobierno Corporativo
                  </h1>
                  <p className="anim-fade-up anim-d3" style={{ color: '#F1F5F9', fontSize: '1.2rem', maxWidth: '720px', lineHeight: '1.7', margin: '0 auto' }}>
                    Artículos especializados, análisis normativos, gestión de riesgos y reflexiones sobre buen gobierno corporativo e integridad empresarial.
                  </p>
                </div>
              </section>

              {/* SECCIÓN PRINCIPAL DE CATÁLOGO CON CONTENEDOR RESPONSIVO */}
              <div className="contenido-catalog-container">
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>
                  
                  {/* COLUMNA IZQUIERDA: BARRA DE BÚSQUEDA Y ARTÍCULOS EN FILAS */}
                  <div style={{ minWidth: 0 }}>

                    {/* BARRA DE BÚSQUEDA MODERNA (RESPONSIVA SIN DESBORDAMIENTO) */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      marginBottom: '1.25rem', 
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px', 
                      padding: '0.35rem 0.35rem 0.35rem 0.85rem',
                      border: '1.5px solid #E2E8F0',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <Search size={18} style={{ color: '#af1daa', marginRight: '0.5rem', flexShrink: 0 }} />
                      <input 
                        type="text" 
                        placeholder="Busca una publicación o tema..."
                        value={searchArticle}
                        onChange={(e) => setSearchArticle(e.target.value)}
                        style={{ 
                          flex: 1, 
                          padding: '0.5rem 0', 
                          border: 'none', 
                          outline: 'none', 
                          fontSize: '0.85rem',
                          color: '#1E1B4B',
                          backgroundColor: 'transparent',
                          minWidth: 0
                        }}
                      />
                      {searchArticle && (
                        <button 
                          onClick={() => setSearchArticle('')}
                          style={{ background: 'none', border: 'none', color: '#94A3B8', padding: '0.25rem 0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                          title="Limpiar búsqueda"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => {}}
                        style={{ 
                          backgroundColor: '#af1daa', 
                          color: '#FFFFFF', 
                          border: 'none', 
                          padding: '0.55rem 1rem', 
                          fontSize: '0.78rem', 
                          fontWeight: '700', 
                          letterSpacing: '0.5px', 
                          cursor: 'pointer',
                          borderRadius: '8px',
                          flexShrink: 0,
                          marginLeft: '0.35rem'
                        }}
                      >
                        BUSCAR
                      </button>
                    </div>

                    {/* COMPONENTE DESPLEGABLE PERSONALIZADO DE ÁREAS (CUSTOM REACT UI DROPDOWN - NO ES SELECT NATIVO DEL NAVEGADOR) */}
                    <div className="mobile-areas-select-container" style={{ position: 'relative', width: '100%', marginBottom: '1.75rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#af1daa', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Filter size={14} /> FILTRAR POR ÁREA DE INTERÉS:
                      </label>

                      {/* BOTÓN DESPLEGABLE PERSONALIZADO */}
                      <button
                        type="button"
                        onClick={() => setIsMobileAreaDropdownOpen(!isMobileAreaDropdownOpen)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#FFFFFF',
                          border: isMobileAreaDropdownOpen ? '2px solid #af1daa' : '1.5px solid #e6affc',
                          borderRadius: isMobileAreaDropdownOpen ? '12px 12px 0 0' : '12px',
                          padding: '0.85rem 1.15rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(175, 29, 170,0.06)',
                          transition: 'all 0.2s ease',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', minWidth: 0 }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#af1daa', flexShrink: 0 }}></span>
                          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1E1B4B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {selectedArticleCategory === 'Todas' ? 'Todas las Áreas' : selectedArticleCategory}
                          </span>
                        </div>
                        <ChevronDown 
                          size={18} 
                          style={{ 
                            color: '#af1daa', 
                            transition: 'transform 0.25s ease', 
                            transform: isMobileAreaDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            flexShrink: 0 
                          }} 
                        />
                      </button>

                      {/* LISTADO DESPLEGABLE PERSONALIZADO (CUSTOM REACT POPUP CARD) */}
                      {isMobileAreaDropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          backgroundColor: '#FFFFFF',
                          border: '2px solid #af1daa',
                          borderTop: 'none',
                          borderRadius: '0 0 12px 12px',
                          boxShadow: '0 12px 28px rgba(10, 0, 30, 0.15)',
                          maxHeight: '280px',
                          overflowY: 'auto',
                          zIndex: 50,
                          padding: '0.4rem 0'
                        }}>
                          {[
                            'Todas',
                            'Compliance',
                            'Buen Gobierno Corporativo',
                            'Gestión de Riesgos',
                            'ESG',
                            'Anti-Corrupción',
                            'SAGRILAFT & PTEE',
                            'Ética e Integridad',
                            'Compliance Penal',
                            'Tax Compliance',
                            'Protección de Datos'
                          ].map((area) => {
                            const isSelected = selectedArticleCategory === area;
                            return (
                              <div
                                key={area}
                                onClick={() => {
                                  setSelectedArticleCategory(area);
                                  setIsMobileAreaDropdownOpen(false);
                                }}
                                style={{
                                  padding: '0.75rem 1.15rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  backgroundColor: isSelected ? '#f4f4f4' : 'transparent',
                                  color: isSelected ? '#af1daa' : '#334155',
                                  fontWeight: isSelected ? '700' : '500',
                                  fontSize: '0.88rem',
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #F8FAFC',
                                  transition: 'background-color 0.15s ease'
                                }}
                              >
                                <span>{area === 'Todas' ? 'Todas las Áreas' : area}</span>
                                {isSelected && <CheckCircle2 size={16} style={{ color: '#af1daa' }} />}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* CINTA HORIZONTAL DE PASTILLAS INTERACTIVAS (SWIPEABLE CHIPS) */}
                      <div className="mobile-category-chips" style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        overflowX: 'auto', 
                        paddingTop: '0.75rem',
                        paddingBottom: '0.4rem',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}>
                        {[
                          'Todas',
                          'Compliance',
                          'Buen Gobierno Corporativo',
                          'Gestión de Riesgos',
                          'ESG',
                          'Anti-Corrupción',
                          'SAGRILAFT & PTEE',
                          'Ética e Integridad',
                          'Compliance Penal',
                          'Tax Compliance',
                          'Protección de Datos'
                        ].map((area) => {
                          const isAct = selectedArticleCategory === area;
                          return (
                            <button
                              key={area}
                              onClick={() => {
                                setSelectedArticleCategory(area);
                                setIsMobileAreaDropdownOpen(false);
                              }}
                              style={{
                                backgroundColor: isAct ? '#af1daa' : '#FFFFFF',
                                color: isAct ? '#FFFFFF' : '#475569',
                                border: isAct ? '1px solid #af1daa' : '1px solid #E2E8F0',
                                padding: '0.4rem 0.85rem',
                                borderRadius: '9999px',
                                fontSize: '0.78rem',
                                fontWeight: isAct ? '700' : '500',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: isAct ? '0 2px 8px rgba(175, 29, 170,0.25)' : 'none',
                                flexShrink: 0
                              }}
                            >
                              {area}
                            </button>
                          );
                        })}
                      </div>

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
                      {(() => {
                        const normalize = (s: string) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                        const q = normalize(searchArticle);
                        const catQ = normalize(selectedArticleCategory);

                        const filtered = articlesList.filter(art => {
                          const matchText = !q || 
                            normalize(art.title).includes(q) || 
                            normalize(art.summary).includes(q) || 
                            normalize(art.author).includes(q) ||
                            (art.categories || []).some(c => normalize(c).includes(q));

                          const matchCat = selectedArticleCategory === 'Todas' || 
                            normalize(art.category) === catQ || 
                            (art.categories || []).some(c => normalize(c) === catQ);

                          return matchText && matchCat;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                              <BookOpen size={40} style={{ color: '#CBD5E1', marginBottom: '0.75rem' }} />
                              <h3 style={{ fontSize: '1.1rem', color: '#1E1B4B', fontWeight: '700', marginBottom: '0.4rem' }}>
                                No se encontraron publicaciones
                              </h3>
                              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                                No hay artículos que coincidan con la categoría o término buscado.
                              </p>
                              <button 
                                onClick={() => { setSearchArticle(''); setSelectedArticleCategory('Todas'); }}
                                style={{ backgroundColor: '#af1daa', color: '#FFF', border: 'none', padding: '0.5rem 1.25rem', fontSize: '0.8rem', borderRadius: '4px', fontWeight: '700' }}
                              >
                                Ver todas las publicaciones
                              </button>
                            </div>
                          );
                        }

                        return filtered.map((art) => (
                          <article 
                            key={art.id}
                            className="card-hover"
                            onClick={() => openArticleDetail(art)}
                            style={{ 
                              display: 'grid', 
                              gridTemplateColumns: '240px 1fr', 
                              gap: '1.75rem', 
                              backgroundColor: '#FFFFFF', 
                              borderRadius: '12px', 
                              padding: '1.25rem', 
                              border: '1px solid #F1F5F9',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                              alignItems: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#CBD5E1', flexShrink: 0 }}>
                              <img 
                                src={art.image || "/Fotos/Imagen para Inicio - Eventos 04.jpg"} 
                                alt={art.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.backgroundColor = '#CBD5E1'; }}
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                                  {(art.categories || [art.category]).map((cat, cIdx) => (
                                    <span 
                                      key={cIdx}
                                      onClick={(e) => { e.stopPropagation(); setSelectedArticleCategory(cat); }}
                                      style={{ 
                                        backgroundColor: '#af1daa', 
                                        color: '#FFFFFF', 
                                        fontSize: '0.65rem', 
                                        fontWeight: '700', 
                                        padding: '0.2rem 0.55rem', 
                                        borderRadius: '3px',
                                        letterSpacing: '0.5px'
                                      }}
                                    >
                                      {cat.toUpperCase()}
                                    </span>
                                  ))}
                                </div>

                                <h3 style={{ 
                                  fontSize: '1.25rem', 
                                  fontFamily: 'serif', 
                                  fontWeight: '700', 
                                  color: '#7B1FA2', 
                                  marginBottom: '0.6rem', 
                                  lineHeight: '1.3'
                                }}>
                                  {art.title}
                                </h3>

                                <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {art.summary}
                                </p>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.65rem', borderTop: '1px solid #F8FAFC', fontSize: '0.78rem' }}>
                                <span style={{ color: '#af1daa', fontWeight: '600' }}>
                                  Autor: {art.author}
                                </span>
                                <span style={{ color: '#94A3B8', fontWeight: '500' }}>
                                  {art.date}
                                </span>
                              </div>
                            </div>
                          </article>
                        ));
                      })()}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          onClick={() => setArticlePage(num)}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: articlePage === num ? '#af1daa' : '#FFFFFF',
                            color: articlePage === num ? '#FFFFFF' : '#475569',
                            border: articlePage === num ? 'none' : '1px solid #E2E8F0',
                            borderRadius: '4px !important',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {num}
                        </button>
                      ))}
                      <span style={{ color: '#94A3B8', padding: '0 0.25rem' }}>...</span>
                      <button
                        onClick={() => setArticlePage(prev => prev + 1)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          backgroundColor: '#FFFFFF',
                          color: '#475569',
                          border: '1px solid #E2E8F0',
                          borderRadius: '4px !important',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          letterSpacing: '0.5px',
                          cursor: 'pointer'
                        }}
                      >
                        SIGUIENTE
                      </button>
                    </div>

                  </div>

                  {/* SIDEBAR CATÁLOGO */}
                  <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div className="desktop-areas-widget" style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        fontFamily: 'serif', 
                        fontWeight: '700', 
                        color: '#1E1B4B', 
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ width: '4px', height: '18px', backgroundColor: '#af1daa', borderRadius: '2px', display: 'inline-block' }}></span>
                        Áreas
                      </h3>

                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {[
                          'Todas',
                          'Compliance',
                          'Buen Gobierno Corporativo',
                          'Gestión de Riesgos',
                          'ESG',
                          'Anti-Corrupción',
                          'SAGRILAFT & PTEE',
                          'Ética e Integridad',
                          'Compliance Penal',
                          'Tax Compliance',
                          'Protección de Datos'
                        ].map((area) => {
                          const isSelected = selectedArticleCategory === area;
                          return (
                            <li 
                              key={area}
                              onClick={() => setSelectedArticleCategory(area)}
                              style={{ 
                                padding: '0.65rem 0',
                                borderBottom: '1px solid #F8FAFC',
                                color: isSelected ? '#af1daa' : '#475569',
                                fontSize: '0.85rem',
                                fontWeight: isSelected ? '700' : '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <span>{area}</span>
                              {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#af1daa' }}></span>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                      <h3 style={{ 
                        fontSize: '1.1rem', 
                        fontFamily: 'serif', 
                        fontWeight: '700', 
                        color: '#1E1B4B', 
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ width: '4px', height: '18px', backgroundColor: '#af1daa', borderRadius: '2px', display: 'inline-block' }}></span>
                        Artículos relacionados
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                          {
                            title: 'Más allá del cumplimiento: una mirada práctica al rol estratégico...',
                            date: '20 DE MAYO DE 2026',
                            image: '/Fotos/Imagen para Inicio - 03.jpg'
                          },
                          {
                            title: 'Cumplimiento en la era moderna: el riesgo ya no está solo en el sistema...',
                            date: '25 DE MARZO DE 2026',
                            image: '/Fotos/Imagen para Inicio - 02.jpg'
                          },
                          {
                            title: '¿Puede la IA ser la guardia contra el lavado de dinero?',
                            date: '15 DE MARZO DE 2026',
                            image: '/Fotos/Imagen para Inicio - Eventos 04.jpg'
                          }
                        ].map((item, rIdx) => (
                          <div 
                            key={rIdx} 
                            onClick={() => {
                              const match = articlesList[rIdx % articlesList.length];
                              if (match) openArticleDetail(match);
                            }}
                            style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', cursor: 'pointer' }}
                          >
                            <div style={{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#CBD5E1', flexShrink: 0 }}>
                              <img 
                                src={item.image} 
                                alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.backgroundColor = '#CBD5E1'; }}
                              />
                            </div>
                            <div>
                              <h4 style={{ fontSize: '0.82rem', fontFamily: 'serif', fontWeight: '700', color: '#1E1B4B', lineHeight: '1.35', marginBottom: '0.25rem' }}>
                                {item.title}
                              </h4>
                              <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: '600' }}>
                                {item.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </aside>

                </div>

              </div>

              {/* FORMULARIO DE CONTACTO/PUBLICACIÓN */}
              <div style={{ backgroundColor: '#FAF5FF', padding: '4rem 1.5rem', marginTop: '4rem', borderTop: '1px solid #f4f4f4' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#af1daa', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                      TUS PUBLICACIONES CON NOSOTROS
                    </span>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: 'serif', fontWeight: '700', color: '#7B1FA2', lineHeight: '1.2' }}>
                      Si quieres publicar con nosotros, escríbenos.
                    </h2>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(123,31,162,0.06)', border: '1px solid #f4f4f4' }}>
                    {articleFormSubmitted ? (
                      <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <CheckCircle2 size={44} style={{ color: '#af1daa', marginBottom: '0.75rem' }} />
                        <h3 style={{ fontSize: '1.2rem', color: '#1E1B4B', fontWeight: '700', marginBottom: '0.35rem' }}>
                          ¡Solicitud Enviada!
                        </h3>
                        <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
                          Muchas gracias. Nuestro Comité Editorial revisará tu propuesta y te contactará en breve.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); setArticleFormSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                          <input 
                            type="text" 
                            placeholder="Nombre Completo"
                            required
                            value={articleFormData.name}
                            onChange={(e) => setArticleFormData({ ...articleFormData, name: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.85rem 0.5rem',
                              border: 'none',
                              borderBottom: '1px solid #CBD5E1',
                              outline: 'none',
                              fontSize: '0.9rem',
                              color: '#1E1B4B',
                              backgroundColor: 'transparent'
                            }}
                          />
                        </div>

                        <div>
                          <input 
                            type="email" 
                            placeholder="Correo Corporativo"
                            required
                            value={articleFormData.email}
                            onChange={(e) => setArticleFormData({ ...articleFormData, email: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.85rem 0.5rem',
                              border: 'none',
                              borderBottom: '1px solid #CBD5E1',
                              outline: 'none',
                              fontSize: '0.9rem',
                              color: '#1E1B4B',
                              backgroundColor: 'transparent'
                            }}
                          />
                        </div>

                        <div>
                          <textarea 
                            placeholder="Mensaje"
                            rows={3}
                            required
                            value={articleFormData.message}
                            onChange={(e) => setArticleFormData({ ...articleFormData, message: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.85rem 0.5rem',
                              border: 'none',
                              borderBottom: '1px solid #CBD5E1',
                              outline: 'none',
                              fontSize: '0.9rem',
                              color: '#1E1B4B',
                              backgroundColor: 'transparent',
                              resize: 'none'
                            }}
                          />
                        </div>

                        <button 
                          type="submit"
                          style={{
                            backgroundColor: '#af1daa',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '0.9rem 1.5rem',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            letterSpacing: '1px',
                            borderRadius: '9999px !important',
                            cursor: 'pointer',
                            marginTop: '0.5rem',
                            boxShadow: '0 4px 15px rgba(175, 29, 170, 0.25)'
                          }}
                        >
                          ENVIAR SOLICITUD
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )
        )}

        {/* ---------------------------------------------------- */}
        {/* PANEL ADMINISTRATIVO WIC (MAQUETAS 08, 09 Y 10)       */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'login' && (
          isLoggedIn ? (
            <div style={{ backgroundColor: '#FCF8FF', minHeight: '100vh', display: 'flex' }}>
              {/* SIDEBAR LATERAL (SEGÚN MAQUETAS) */}
              <aside style={{ 
                width: '260px', 
                backgroundColor: '#f4f4f4', 
                borderRight: '1px solid #D6C0D2', 
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexShrink: 0
              }}>
                <div>
                  {/* LOGO E INDICADOR BIENVENIDO A TU ADMIN PORTAL */}
                  <div style={{ marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
                    <span style={{ color: '#64748B', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      BIENVENIDO A TU
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ backgroundColor: '#af1daa', color: '#FFF', padding: '0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building2 size={18} />
                      </div>
                      <div>
                        <span style={{ color: '#af1daa', fontSize: '1.2rem', fontFamily: 'serif', fontWeight: '700', display: 'block', lineHeight: '1.1' }}>
                          Admin Portal
                        </span>
                      </div>
                    </div>
                  </div>

                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* BOTÓN DASHBOARD */}
                    <button 
                      onClick={() => setAdminSubTab('dashboard')}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        width: '100%', 
                        padding: '0.75rem 1rem', 
                        backgroundColor: adminSubTab === 'dashboard' ? '#A21CAF' : 'transparent', 
                        color: adminSubTab === 'dashboard' ? '#FFFFFF' : '#524250', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </button>

                    {/* BOTÓN MIEMBROS */}
                    <button 
                      onClick={() => setAdminSubTab('members-list')}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        width: '100%', 
                        padding: '0.75rem 1rem', 
                        backgroundColor: adminSubTab === 'members-list' || adminSubTab === 'member-editor' ? '#A21CAF' : 'transparent', 
                        color: adminSubTab === 'members-list' || adminSubTab === 'member-editor' ? '#FFFFFF' : '#524250', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <Users size={18} /> Miembros
                    </button>

                    {/* BOTÓN BLOG */}
                    <button 
                      onClick={() => setAdminSubTab('blog-list')}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        width: '100%', 
                        padding: '0.75rem 1rem', 
                        backgroundColor: adminSubTab === 'blog-list' || adminSubTab === 'blog-editor' ? '#A21CAF' : 'transparent', 
                        color: adminSubTab === 'blog-list' || adminSubTab === 'blog-editor' ? '#FFFFFF' : '#524250', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <BookOpen size={18} /> Blog
                    </button>
                  </nav>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    onClick={() => alert('Soporte técnico disponible 24/7 para WIC Colombia')}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      width: '100%', 
                      padding: '0.5rem 0.5rem', 
                      backgroundColor: 'transparent', 
                      color: '#475569', 
                      border: 'none', 
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <HelpCircle size={16} /> Soporte
                  </button>

                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem', 
                      width: '100%', 
                      padding: '0.5rem 0.5rem', 
                      backgroundColor: 'transparent', 
                      color: '#475569', 
                      border: 'none', 
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </div>
              </aside>

              {/* CONTENIDO PRINCIPAL SEGÚN SUBTAB */}
              <main style={{ flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' }}>
                
                {/* VISTA 4: LISTADO DE MIEMBROS (SEGÚN MAQUETA IMAGEN USUARIO: MIEMBROS) */}
                {adminSubTab === 'members-list' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <div>
                        <h1 style={{ color: '#1E1B4B', fontSize: '2.5rem', fontFamily: 'serif', fontWeight: '700', marginBottom: '0.25rem' }}>
                          Miembros
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                          Gestión editorial y análisis del rendimiento del contenido a nivel de sistema para las publicaciones de WIC Colombia.
                        </p>
                      </div>
                      <button 
                        className="btn btn-fuchsia"
                        onClick={() => {
                          setEditingMember(null);
                          setMemberPhoto(null);
                          setAdminSubTab('member-editor');
                        }}
                        style={{ fontSize: '0.85rem', padding: '0.75rem 1.5rem', backgroundColor: '#af1daa', fontWeight: '700', letterSpacing: '0.5px' }}
                      >
                        + NUEVO MIEMBRO
                      </button>
                    </div>

                    {/* TARJETAS DE MÉTRICAS COMPONENTES MIEMBROS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem', backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ paddingRight: '1rem', borderRight: '1px solid #E2E8F0' }}>
                        <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px' }}>ARTÍCULOS TOTALES</span>
                        <h2 style={{ fontSize: '2rem', color: '#af1daa', marginTop: '0.25rem', marginBottom: 0, fontWeight: '700' }}>124</h2>
                      </div>
                      <div style={{ paddingRight: '1rem', borderRight: '1px solid #E2E8F0', paddingLeft: '0.5rem' }}>
                        <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px' }}>PUBLICADOS</span>
                        <h2 style={{ fontSize: '2rem', color: '#1E1B4B', marginTop: '0.25rem', marginBottom: 0, fontWeight: '700' }}>98</h2>
                      </div>
                      <div style={{ paddingRight: '1rem', borderRight: '1px solid #E2E8F0', paddingLeft: '0.5rem' }}>
                        <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px' }}>EN BORRADOR</span>
                        <h2 style={{ fontSize: '2rem', color: '#1E1B4B', marginTop: '0.25rem', marginBottom: 0, fontWeight: '700' }}>26</h2>
                      </div>
                      <div style={{ paddingLeft: '0.5rem' }}>
                        <span style={{ color: '#af1daa', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px' }}>VISTAS MENSUALES</span>
                        <h2 style={{ fontSize: '2rem', color: '#af1daa', marginTop: '0.25rem', marginBottom: 0, fontWeight: '700' }}>12.5k</h2>
                      </div>
                    </div>

                    {/* TABLA DE MIEMBROS */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '0.85rem 1.25rem' }}>MIEMBRO</th>
                            <th style={{ padding: '0.85rem' }}>ESTADO</th>
                            <th style={{ padding: '0.85rem' }}>FECHA</th>
                            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>ACCIONES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {membersList.map((member, index) => (
                            <tr key={member.id || index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img src={member.photo} alt={member.name} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />
                                <div>
                                  <div style={{ fontWeight: '700', color: '#1E1B4B', fontSize: '0.95rem' }}>{member.name}</div>
                                  <div style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase' }}>{member.role}</div>
                                </div>
                              </td>
                              <td style={{ padding: '1rem 0.85rem' }}>
                                <span style={{ color: '#166534', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span style={{ width: '6px', height: '6px', backgroundColor: '#22C55E', borderRadius: '50%' }} />
                                  PUBLISHED
                                </span>
                              </td>
                              <td style={{ padding: '1rem 0.85rem', color: '#64748B' }}>
                                Oct 12, 2023
                              </td>
                              <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '0.75rem', color: '#64748B', cursor: 'pointer' }}>
                                  <span onClick={() => {
                                    setEditingMember({
                                      id: member.id,
                                      name: member.name,
                                      role: member.role,
                                      bio: member.complianceExperience,
                                      photo: member.photo
                                    });
                                    setMemberPhoto(member.photo);
                                    setAdminSubTab('member-editor');
                                  }} title="Editar"><Edit2 size={16} /></span>
                                  <span onClick={() => setSelectedMember(member)} title="Ver Perfil"><Eye size={16} /></span>
                                  <span onClick={() => {
                                    if (confirm(`¿Seguro que deseas eliminar a ${member.name}?`)) {
                                      setMembersList(prev => prev.filter(m => m.id !== member.id));
                                    }
                                  }} title="Eliminar"><Trash2 size={16} /></span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: '0.75rem' }}>
                        <span>SHOWING 1-4 OF 124 ARTICLES</span>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#af1daa', fontWeight: '700' }}>
                          <span style={{ color: '#94A3B8', cursor: 'pointer' }}>PREVIOUS</span>
                          <span style={{ color: '#af1daa', textDecoration: 'underline' }}>01</span>
                          <span style={{ color: '#94A3B8' }}>02</span>
                          <span style={{ color: '#94A3B8' }}>03</span>
                          <span style={{ color: '#af1daa', cursor: 'pointer' }}>NEXT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VISTA 5: EDITAR / PERFIL DEL MIEMBRO (SEGÚN MAQUETA IMAGEN USUARIO: PERFIL DEL MIEMBRO) */}
                {adminSubTab === 'member-editor' && (
                  <div>
                    {/* BREADCRUMB, BOTÓN VOLVER & ACCIONES SUPERIORES */}
                    <button 
                      onClick={() => setAdminSubTab('members-list')} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#af1daa', 
                        fontSize: '0.9rem', 
                        fontWeight: '700', 
                        cursor: 'pointer', 
                        marginBottom: '0.75rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.4rem' 
                      }}
                    >
                      ← Volver al Listado de Miembros
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                          DIRECTORIO &gt; <span style={{ color: '#af1daa' }}>EDITAR PERFIL</span>
                        </span>
                        <h1 style={{ color: '#af1daa', fontSize: '2.8rem', fontFamily: 'serif', fontWeight: '700', marginTop: '0.2rem' }}>
                          Perfil del Miembro
                        </h1>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => setAdminSubTab('members-list')}
                          style={{ 
                            padding: '0.75rem 1.25rem', 
                            backgroundColor: '#FFFFFF', 
                            color: '#af1daa', 
                            border: '1px solid #af1daa', 
                            borderRadius: '4px', 
                            fontWeight: '700', 
                            fontSize: '0.8rem',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Trash2 size={16} /> ELIMINAR MIEMBRO
                        </button>
                        <button 
                          onClick={() => {
                            const nameInput = (document.getElementById('input-member-name') as HTMLInputElement)?.value;
                            const roleInput = (document.getElementById('input-member-role') as HTMLInputElement)?.value;
                            const bioInput = (document.getElementById('input-member-bio') as HTMLTextAreaElement)?.value;
                            const newName = nameInput || (editingMember ? editingMember.name : 'NUEVO MIEMBRO');
                            const newRole = roleInput || (editingMember ? editingMember.role : 'SOCIA AFILIADA');
                            const newBio = bioInput || (editingMember ? editingMember.bio : 'Perfil en actualización...');
                            const newPhoto = memberPhoto || '/Fotos/Miembros/ADRIANA PATRICIA GOMEZ BARAJAS.jpg';

                            if (editingMember && editingMember.id) {
                              setMembersList(prev => prev.map(m => m.id === editingMember.id ? {
                                ...m,
                                name: newName.toUpperCase(),
                                role: newRole.toUpperCase(),
                                complianceExperience: newBio,
                                photo: newPhoto
                              } : m));
                            } else {
                              const newObj: Member = {
                                id: `mem-${Date.now()}`,
                                name: newName.toUpperCase(),
                                role: newRole.toUpperCase(),
                                sector: 'COMPLIANCE & GOBIERNO CORPORATIVO',
                                currentCargo: newRole,
                                complianceExperience: newBio,
                                profession: 'ABOGADA',
                                academicBg: ['Especialista en Compliance'],
                                workBg: ['Directora Ejecutiva'],
                                linkedin: 'https://linkedin.com',
                                photo: newPhoto
                              };
                              setMembersList(prev => [newObj, ...prev]);
                            }
                            alert('Miembro guardado con éxito y publicado en la Web de WIC!');
                            setAdminSubTab('members-list');
                          }}
                          style={{ 
                            padding: '0.75rem 1.5rem', 
                            backgroundColor: '#af1daa', 
                            color: '#FFFFFF', 
                            border: 'none', 
                            borderRadius: '4px', 
                            fontWeight: '700', 
                            fontSize: '0.8rem',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <Save size={16} /> GUARDAR CAMBIOS
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
                      
                      {/* COLUMNA IZQUIERDA: FORMULARIO PERFIL DE MIEMBRO */}
                      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '2rem', border: '1px solid #E2E8F0' }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                          {/* FOTO CON BOTONES FLOTANTES SUPERPUESTOS EN LA ESQUINA (SOLO ICONOS, SIN TEXTO) */}
                          <div style={{ 
                            width: '140px', 
                            height: '160px', 
                            backgroundColor: '#F1F5F9', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                          }}>
                            {memberPhoto ? (
                              <img src={memberPhoto} alt="Foto Miembro" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ textAlign: 'center', color: '#94A3B8', padding: '0.5rem' }}>
                                <Users size={36} style={{ margin: '0 auto 0.25rem' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Sin Foto</span>
                              </div>
                            )}

                            {/* BOTONES FLOTANTES SOBRE LA FOTO */}
                            <div style={{ 
                              position: 'absolute', 
                              top: '8px', 
                              right: '8px', 
                              display: 'flex', 
                              gap: '4px', 
                              backgroundColor: 'rgba(0, 0, 0, 0.45)', 
                              backdropFilter: 'blur(4px)',
                              padding: '4px 6px', 
                              borderRadius: '20px' 
                            }}>
                              <label title="Cambiar Foto" style={{ color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}>
                                <Camera size={15} />
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  style={{ display: 'none' }} 
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      const newUrl = URL.createObjectURL(e.target.files[0]);
                                      setMemberPhoto(newUrl);
                                    }
                                  }}
                                />
                              </label>

                              {memberPhoto && (
                                <button 
                                  type="button"
                                  title="Quitar Foto"
                                  onClick={() => setMemberPhoto(null)}
                                  style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#FF6B6B', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '2px' 
                                  }}
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            {/* NOMBRE COMPLETO */}
                            <div style={{ marginBottom: '1.25rem' }}>
                              <label style={{ display: 'block', color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                                NOMBRE COMPLETO
                              </label>
                              <input 
                                id="input-member-name"
                                key={editingMember ? editingMember.name : 'new-member-name'}
                                type="text" 
                                placeholder="Ej. Dra. Elena Valenzuela"
                                defaultValue={editingMember ? editingMember.name : ''}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '1.3rem', fontFamily: 'serif', fontWeight: '700', color: '#1E1B4B', outline: 'none' }}
                              />
                            </div>

                            {/* CARGO / TÍTULO */}
                            <div>
                              <label style={{ display: 'block', color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                                CARGO / TÍTULO
                              </label>
                              <input 
                                id="input-member-role"
                                key={editingMember ? editingMember.role : 'new-member-role'}
                                type="text" 
                                placeholder="Ej. Directora de Cumplimiento Normativo"
                                defaultValue={editingMember ? editingMember.role : ''}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '1rem', color: '#af1daa', outline: 'none' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* BIOGRAFÍA PROFESIONAL */}
                        <div style={{ marginBottom: '2rem' }}>
                          <label style={{ display: 'block', color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                            BIOGRAFÍA PROFESIONAL
                          </label>
                          <textarea 
                            id="input-member-bio"
                            key={editingMember ? editingMember.bio : 'new-member-bio'}
                            rows={5}
                            placeholder="Escribe aquí la trayectoria y perfil profesional..."
                            defaultValue={editingMember ? editingMember.bio : ''}
                            style={{ 
                              width: '100%', 
                              padding: '1rem', 
                              border: '1px solid #E2E8F0', 
                              borderRadius: '4px', 
                              fontSize: '0.95rem', 
                              color: '#334155', 
                              backgroundColor: '#f4f4f4',
                              lineHeight: '1.6',
                              fontFamily: 'inherit'
                            }}
                          />
                        </div>

                        {/* ÁREAS DE ESPECIALIDAD */}
                        <div>
                          <label style={{ display: 'block', color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>
                            ÁREAS DE ESPECIALIDAD
                          </label>

                          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: '#f4f4f4', color: '#af1daa', padding: '0.4rem 0.85rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e6affc' }}>
                              <span>Compliance Bancario</span>
                              <span style={{ cursor: 'pointer' }}>✕</span>
                            </div>
                            <div style={{ backgroundColor: '#f4f4f4', color: '#af1daa', padding: '0.4rem 0.85rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e6affc' }}>
                              <span>Ley de Protección de Datos</span>
                              <span style={{ cursor: 'pointer' }}>✕</span>
                            </div>
                            <div style={{ backgroundColor: '#f4f4f4', color: '#af1daa', padding: '0.4rem 0.85rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e6affc' }}>
                              <span>Fintech</span>
                              <span style={{ cursor: 'pointer' }}>✕</span>
                            </div>
                          </div>

                          <button style={{ background: 'none', border: '1px dashed #CBD5E1', padding: '0.4rem 0.85rem', borderRadius: '4px', fontSize: '0.8rem', color: '#64748B', fontWeight: '600', cursor: 'pointer' }}>
                            + Añadir Etiqueta
                          </button>
                        </div>

                      </div>

                      {/* COLUMNA DERECHA: ESTADO DE CUENTA Y LINKEDIN */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* TARJETA ESTADO DE LA CUENTA */}
                        <div style={{ backgroundColor: '#FAF5FF', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                          <h3 style={{ color: '#1E1B4B', fontSize: '1.3rem', fontFamily: 'serif', marginBottom: '1.25rem' }}>
                            Estado de la Cuenta
                          </h3>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: '700' }}>ESTADO ACTUAL</span>
                            <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '0.2rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                              ACTIVO
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                            <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: '700' }}>FECHA DE ALTA</span>
                            <span style={{ color: '#1E1B4B', fontSize: '0.85rem', fontWeight: '700' }}>12 May 2023</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: '700' }}>ÚLTIMA EDICIÓN</span>
                            <span style={{ color: '#1E1B4B', fontSize: '0.85rem', fontWeight: '700' }}>Hoy, 09:12 AM</span>
                          </div>

                          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <input type="checkbox" defaultChecked id="vis" style={{ accentColor: '#af1daa', cursor: 'pointer', width: '18px', height: '18px' }} />
                            <label htmlFor="vis" style={{ color: '#1E1B4B', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                              Visibilidad Pública
                            </label>
                          </div>
                        </div>

                        {/* TARJETA LINKEDIN */}
                        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                          <h3 style={{ color: '#1E1B4B', fontSize: '1.3rem', fontFamily: 'serif', marginBottom: '1rem' }}>
                            Linkedin
                          </h3>
                          <div style={{ position: 'relative' }}>
                            <input 
                              type="text" 
                              placeholder="ingresa tu enlace"
                              style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.25rem', border: '1px solid #FAF5FF', backgroundColor: '#FAF5FF', borderRadius: '4px', fontSize: '0.85rem', color: '#1E1B4B', outline: 'none' }}
                            />
                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#af1daa', display: 'flex', alignItems: 'center' }}>
                              <LinkIcon size={16} />
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

                {/* VISTA 1: DASHBOARD GENERAL (SEGÚN MAQUETA SEGUNDA IMAGEN EXACTA) */}
                {adminSubTab === 'dashboard' && (
                  <div>
                    {/* TÍTULO & DESCRIPCIÓN */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h1 style={{ color: '#1E1B4B', fontSize: '2.8rem', fontFamily: 'serif', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Dashboard
                      </h1>
                      <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
                        Panel de control para la gestión del cumplimiento normativo y el seguimiento
                      </p>
                    </div>

                    {/* MÉTRICAS SUPERIORES (TOTAL DE MIEMBROS & TOTAL DE ARTÍCULOS) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                      
                      {/* MÉTRICA 1: TOTAL DE MIEMBROS */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '4px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                          TOTAL DE MIEMBROS
                        </span>
                        <h2 style={{ fontSize: '3rem', fontFamily: 'serif', color: '#af1daa', fontWeight: '700', margin: '0.5rem 0' }}>
                          12,482
                        </h2>
                        <div style={{ color: '#af1daa', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <TrendingUp size={15} />
                          <span>+12% from last month</span>
                        </div>
                      </div>

                      {/* MÉTRICA 2: TOTAL DE ARTÍCULOS */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '4px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                          TOTAL DE ARTÍCULOS
                        </span>
                        <h2 style={{ fontSize: '3rem', fontFamily: 'serif', color: '#af1daa', fontWeight: '700', margin: '0.5rem 0' }}>
                          342
                        </h2>
                        <div style={{ color: '#af1daa', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FileText size={15} />
                          <span>8 Pending Review</span>
                        </div>
                      </div>

                    </div>

                    {/* TARJETAS DE ACCIONES RÁPIDAS (AGREGAR NUEVA SOCIA & CREAR NUEVO CONTENIDO) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                      
                      {/* TARJETA 1: AGREGAR NUEVA SOCIA */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem 2rem', borderRadius: '4px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
                        <div>
                          <div style={{ width: '40px', height: '4px', backgroundColor: '#af1daa', marginBottom: '1.25rem' }} />
                          <h3 style={{ fontSize: '2rem', fontFamily: 'serif', color: '#1E1B4B', fontWeight: '700', marginBottom: '1rem' }}>
                            Agregar nueva socia
                          </h3>
                          <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                            Supervisar las inscripciones institucionales, los y las trayectorias de certificación para todos los miembros registrados.
                          </p>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                          <button 
                            onClick={() => {
                              setEditingMember(null);
                              setMemberPhoto('');
                              setAdminSubTab('member-editor');
                            }}
                            style={{ 
                              backgroundColor: '#af1daa', 
                              color: '#FFFFFF', 
                              border: 'none', 
                              padding: '0.75rem 1.75rem', 
                              fontWeight: '700', 
                              fontSize: '0.8rem', 
                              cursor: 'pointer', 
                              borderRadius: '2px',
                              letterSpacing: '0.5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            AGREGAR <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>

                      {/* TARJETA 2: CREAR NUEVO CONTENIDO */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem 2rem', borderRadius: '4px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
                        <div>
                          <div style={{ width: '40px', height: '4px', backgroundColor: '#af1daa', marginBottom: '1.25rem' }} />
                          <h3 style={{ fontSize: '2rem', fontFamily: 'serif', color: '#1E1B4B', fontWeight: '700', marginBottom: '1rem' }}>
                            Crear nuevo contenido
                          </h3>
                          <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                            Publique análisis jurídicos, actualizaciones sobre cumplimiento normativo e informes técnicos académicos en el centro de conocimiento global.
                          </p>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                          <button 
                            onClick={() => {
                              setEditingArticle(null);
                              setAdminSubTab('blog-editor');
                            }}
                            style={{ 
                              backgroundColor: '#af1daa', 
                              color: '#FFFFFF', 
                              border: 'none', 
                              padding: '0.75rem 1.75rem', 
                              fontWeight: '700', 
                              fontSize: '0.8rem', 
                              cursor: 'pointer', 
                              borderRadius: '2px',
                              letterSpacing: '0.5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            CREAR <PenTool size={14} />
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* VISTA 2: LISTADO DEL BLOG ADMIN (SEGÚN MAQUETA IMAGEN EXACTA) */}
                {adminSubTab === 'blog-list' && (
                  <div>
                    {/* ENCABEZADO CON TÍTULO EN SERIF & BOTÓN NUEVO ARTÍCULO */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <div>
                        <h1 style={{ color: '#1E1B4B', fontSize: '2.8rem', fontFamily: 'serif', fontWeight: '700', marginBottom: '0.25rem' }}>
                          Blogs
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                          Gestión editorial y análisis del rendimiento del contenido a nivel de sistema para las publicaciones de WIC Colombia.
                        </p>
                      </div>
                      <button 
                        className="btn btn-fuchsia"
                        onClick={() => {
                          setEditingArticle(null);
                          setAdminSubTab('blog-editor');
                        }}
                        style={{ fontSize: '0.85rem', padding: '0.85rem 1.5rem', backgroundColor: '#af1daa', fontWeight: '700', letterSpacing: '0.5px', borderRadius: '4px' }}
                      >
                        + NUEVO ARTÍCULO
                      </button>
                    </div>

                    {/* TARJETAS DE MÉTRICAS SUPERIORES DE BLOG */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem', backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                      <div style={{ paddingRight: '1rem', borderRight: '1px solid #E2E8F0' }}>
                        <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px' }}>ARTÍCULOS TOTALES</span>
                        <h2 style={{ fontSize: '2rem', color: '#af1daa', marginTop: '0.25rem', marginBottom: 0, fontWeight: '700', fontFamily: 'serif' }}>124</h2>
                      </div>
                      <div style={{ paddingRight: '1rem', borderRight: '1px solid #E2E8F0', paddingLeft: '0.5rem' }}>
                        <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px' }}>PUBLICADOS</span>
                        <h2 style={{ fontSize: '2rem', color: '#1E1B4B', marginTop: '0.25rem', marginBottom: 0, fontWeight: '700', fontFamily: 'serif' }}>98</h2>
                      </div>
                      <div style={{ paddingRight: '1rem', borderRight: '1px solid #E2E8F0', paddingLeft: '0.5rem' }}>
                        <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px' }}>EN BORRADOR</span>
                        <h2 style={{ fontSize: '2rem', color: '#1E1B4B', marginTop: '0.25rem', marginBottom: 0, fontWeight: '700', fontFamily: 'serif' }}>26</h2>
                      </div>
                      <div style={{ paddingLeft: '0.5rem' }}>
                        <span style={{ color: '#af1daa', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px' }}>VISTAS MENSUALES</span>
                        <h2 style={{ fontSize: '2rem', color: '#af1daa', marginTop: '0.25rem', marginBottom: 0, fontWeight: '700', fontFamily: 'serif' }}>12.5k</h2>
                      </div>
                    </div>

                    {/* TABLA DE PUBLICACIONES CON MINIATURA DE IMAGEN */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <th style={{ padding: '0.85rem 1.25rem' }}>CONTENIDO</th>
                            <th style={{ padding: '0.85rem' }}>ESTADO</th>
                            <th style={{ padding: '0.85rem' }}>AUTOR</th>
                            <th style={{ padding: '0.85rem' }}>FECHA</th>
                            <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>ACCIONES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {articlesList.map((art, index) => (
                            <tr key={art.id || index} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              
                              {/* COLUMNA CONTENIDO CON MINIATURA DE IMAGEN */}
                              <td style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{ width: '64px', height: '48px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                  <img 
                                    src={art.image || "/Fotos/Imagen para Inicio - Eventos 04.jpg"} 
                                    alt={art.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                                <div>
                                  <div style={{ fontWeight: '700', color: '#1E1B4B', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{art.title}</div>
                                  <div style={{ color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{art.category}</div>
                                </div>
                              </td>

                              {/* COLUMNA ESTADO */}
                              <td style={{ padding: '1rem 0.85rem' }}>
                                <span style={{ 
                                  color: art.status === 'Borrador' ? '#D97706' : '#166534', 
                                  fontSize: '0.75rem', 
                                  fontWeight: '700', 
                                  letterSpacing: '0.5px', 
                                  display: 'inline-flex', 
                                  alignItems: 'center', 
                                  gap: '0.35rem' 
                                }}>
                                  <span style={{ width: '6px', height: '6px', backgroundColor: art.status === 'Borrador' ? '#F59E0B' : '#22C55E', borderRadius: '50%' }} />
                                  {art.status === 'Borrador' ? 'DRAFT' : 'PUBLISHED'}
                                </span>
                              </td>

                              {/* COLUMNA AUTOR */}
                              <td style={{ padding: '1rem 0.85rem', color: '#64748B', fontWeight: '600' }}>
                                {art.author}
                              </td>

                              {/* COLUMNA FECHA */}
                              <td style={{ padding: '1rem 0.85rem', color: '#64748B' }}>
                                {art.date}
                              </td>

                              {/* COLUMNA ACCIONES CON ICONOS LINEALES */}
                              <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '0.75rem', color: '#64748B', cursor: 'pointer' }}>
                                  <span onClick={() => {
                                    setEditingArticle(art);
                                    setAdminSubTab('blog-editor');
                                  }} title="Editar"><Edit2 size={16} /></span>
                                  <span onClick={() => {
                                    setActiveTab('contenido');
                                  }} title="Ver en Web"><Eye size={16} /></span>
                                  <span onClick={() => {
                                    if (confirm(`¿Eliminar el artículo "${art.title}"?`)) {
                                      setArticlesList(prev => prev.filter(a => a.id !== art.id));
                                    }
                                  }} title="Eliminar"><Trash2 size={16} /></span>
                                </div>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* PAGINACIÓN INFERIOR DE TABLA */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: '0.75rem' }}>
                        <span>SHOWING 1-{articlesList.length} OF 124 ARTICLES</span>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#af1daa', fontWeight: '700' }}>
                          <span style={{ color: '#94A3B8', cursor: 'pointer' }}>PREVIOUS</span>
                          <span style={{ color: '#af1daa', textDecoration: 'underline' }}>01</span>
                          <span style={{ color: '#94A3B8' }}>02</span>
                          <span style={{ color: '#94A3B8' }}>03</span>
                          <span style={{ color: '#af1daa', cursor: 'pointer' }}>NEXT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VISTA 3: EDITOR Y CREADOR DE ARTÍCULO FUNCIONAL */}
                {adminSubTab === 'blog-editor' && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2.5rem', alignItems: 'start' }}>
                      
                      {/* COLUMNA IZQUIERDA: CONTENIDO PRINCIPAL DE LA ENTRADA */}
                      <div>
                        <button 
                          onClick={() => setAdminSubTab('blog-list')} 
                          style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          ← Volver al listado de entradas
                        </button>
                        
                        <h1 style={{ color: '#1E1B4B', fontSize: '2.8rem', fontFamily: 'serif', fontWeight: '700', marginBottom: '0.25rem' }}>
                          {editingArticle ? 'Editar Entrada' : 'Nueva Entrada'}
                        </h1>
                        <span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                          ENCABEZADO PRINCIPAL
                        </span>

                        {/* TÍTULO DEL ARTÍCULO */}
                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                          <input 
                            id="input-article-title"
                            key={editingArticle ? editingArticle.title : 'new-article-title'}
                            type="text" 
                            placeholder="Escribe aquí el Título del Artículo..."
                            defaultValue={editingArticle ? editingArticle.title : ''}
                            style={{ 
                              width: '100%', 
                              fontSize: '2.2rem', 
                              fontFamily: 'serif', 
                              color: '#1E1B4B', 
                              border: 'none', 
                              outline: 'none', 
                              backgroundColor: 'transparent' 
                            }}
                          />
                        </div>

                        {/* SUBIDA DE IMAGEN DESTACADA INTERACTIVA */}
                        <div 
                          onClick={() => document.getElementById('input-article-file')?.click()}
                          style={{ 
                            borderRadius: '8px', 
                            overflow: 'hidden', 
                            marginBottom: '1.5rem', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                            backgroundColor: '#F8F5FF',
                            minHeight: '220px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed #af1daa',
                            position: 'relative',
                            cursor: 'pointer'
                          }}
                        >
                          <input 
                            id="input-article-file"
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const imgUrl = event.target?.result as string;
                                  if (editingArticle) {
                                    setEditingArticle({ ...editingArticle, image: imgUrl });
                                  } else {
                                    setEditingArticle({ id: '', title: '', category: 'ACTUALIDAD REGULATORIA', author: '', role: '', date: 'Hoy', readTime: '4 min', summary: '', image: imgUrl, status: 'Publicado', content: '' });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          {editingArticle?.image ? (
                            <img 
                              src={editingArticle.image} 
                              alt="Portada Entrada" 
                              style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
                            />
                          ) : (
                            <div style={{ textAlign: 'center', color: '#af1daa', padding: '2rem' }}>
                              <Camera size={36} style={{ margin: '0 auto 0.5rem' }} />
                              <p style={{ fontWeight: '700', margin: 0, fontSize: '0.95rem' }}>Subir Imagen de Portada</p>
                              <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Haz clic o arrastra una imagen aquí (JPG, PNG)</span>
                            </div>
                          )}
                        </div>

                        {/* BARRA DE HERRAMIENTAS EDITOR EN TEXTO (WYSIWYG INTERACTIVO FOTO 2) */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          backgroundColor: '#FFFFFF', 
                          border: '1px solid #E2E8F0', 
                          borderRadius: '6px', 
                          padding: '0.5rem 1rem', 
                          marginBottom: '1.5rem' 
                        }}>
                          <div style={{ display: 'flex', gap: '1.25rem', color: '#1E1B4B', fontWeight: '700', fontSize: '0.95rem', alignItems: 'center' }}>
                            <span style={{ cursor: 'pointer' }} title="Negrita" onClick={() => {
                              const ta = document.getElementById('input-article-content') as HTMLTextAreaElement;
                              if (ta) ta.value += ' **Negrita** ';
                            }}>B</span>
                            <span style={{ cursor: 'pointer', fontStyle: 'italic' }} title="Cursiva" onClick={() => {
                              const ta = document.getElementById('input-article-content') as HTMLTextAreaElement;
                              if (ta) ta.value += ' *Cursiva* ';
                            }}>I</span>
                            <span style={{ cursor: 'pointer' }} title="Lista de viñetas" onClick={() => {
                              const ta = document.getElementById('input-article-content') as HTMLTextAreaElement;
                              if (ta) ta.value += '\n• ';
                            }}>≡</span>
                            
                            {/* BOTÓN "" DE CITA DE AUTOR (INSERTA CITA DESTACADA EN LA POSICIÓN DEL CURSOR) */}
                            <span 
                              style={{ 
                                cursor: 'pointer', 
                                fontSize: '1.1rem', 
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease',
                                color: '#1E1B4B'
                              }} 
                              title="Insertar Cita de Autor exactamente donde estás escribiendo" 
                              onClick={() => {
                                const ta = document.getElementById('input-article-content') as HTMLTextAreaElement;
                                if (ta) {
                                  const startPos = ta.selectionStart;
                                  const endPos = ta.selectionEnd;
                                  const quoteText = '\n\n> "inserta aquí una cita estratégica que resalte la visión del autor"\n\n';
                                  ta.value = ta.value.substring(0, startPos) + quoteText + ta.value.substring(endPos, ta.value.length);
                                  ta.focus();
                                  ta.selectionStart = startPos + quoteText.length;
                                  ta.selectionEnd = startPos + quoteText.length;
                                }
                              }}
                            >
                              “”
                            </span>

                            {/* BOTÓN ⊞ DE TARJETAS PARALELAS (INSERTA PAR DE TARJETAS EN LA POSICIÓN DEL CURSOR) */}
                            <span 
                              style={{ 
                                cursor: 'pointer', 
                                fontSize: '1.1rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease',
                                color: '#1E1B4B'
                              }} 
                              title="Insertar Par de Tarjetas Dinámicas (2 columnas) donde estás escribiendo" 
                              onClick={() => {
                                const ta = document.getElementById('input-article-content') as HTMLTextAreaElement;
                                if (ta) {
                                  const startPos = ta.selectionStart;
                                  const endPos = ta.selectionEnd;
                                  const cardsText = '\n\n[TARJETA 1: Integración Temprana | Involucrar tempranamente a estas funciones en iniciativas relevantes permite una visión proactiva.]\n[TARJETA 2: Ingresa título | Ingresa aquí el texto]\n\n';
                                  ta.value = ta.value.substring(0, startPos) + cardsText + ta.value.substring(endPos, ta.value.length);
                                  ta.focus();
                                  ta.selectionStart = startPos + cardsText.length;
                                  ta.selectionEnd = startPos + cardsText.length;
                                }
                              }}
                            >
                              ⊞
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '1.25rem', color: '#64748B', fontSize: '0.85rem' }}>
                            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => document.getElementById('input-article-file')?.click()}>📷 Imagen</span>
                            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => {
                              const url = prompt('Ingrese URL del Video YouTube / Vimeo:');
                              if (url) {
                                const ta = document.getElementById('input-article-content') as HTMLTextAreaElement;
                                if (ta) ta.value += `\n[Video: ${url}]`;
                              }
                            }}>▶ Video URL</span>
                            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => {
                              const link = prompt('Ingrese URL del enlace:');
                              if (link) {
                                const ta = document.getElementById('input-article-content') as HTMLTextAreaElement;
                                if (ta) ta.value += ` [${link}](${link}) `;
                              }
                            }}>🔗 Enlace</span>
                          </div>
                        </div>

                        {/* COMPONENTE INTERACTIVO DE REDACCIÓN Y MAQUETACIÓN VISUAL (DISEÑO IDÉNTICO FOTO 2) */}
                        <div style={{ marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          
                          {/* PÁRRAFO SUPERIOR DE TEXTO */}
                          <textarea 
                            id="input-article-content"
                            key={editingArticle ? editingArticle.content : 'new-article-content'}
                            rows={5}
                            placeholder="Escribe aquí el cuerpo del artículo o publicación..."
                            defaultValue={editingArticle ? editingArticle.content : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque felis eget enim venenatis, eget ultrices felis consectetur. Suspendisse sed turpis volutpat ante dictum venenatis eget non nulla. Etiam non varius nibh. Sed vel nisl sapien. Fusce elit purus, consectetur sed neque a, sagittis eleifend tellus. Nunc bibendum orci porta.'}
                            style={{ 
                              width: '100%', 
                              padding: '0', 
                              border: 'none', 
                              backgroundColor: 'transparent', 
                              fontSize: '1.05rem', 
                              lineHeight: '1.8', 
                              fontFamily: 'serif',
                              color: '#1E1B4B',
                              outline: 'none',
                              resize: 'none'
                            }}
                          />

                          {/* CITA DESTACADA RECTANGULAR DE AUTOR CON MARCO MORADO Y COMI LLAS GIGANTES (VISTA FOTO 2) */}
                          <div style={{ 
                            backgroundColor: '#FDF4FF', 
                            borderLeft: '4px solid #af1daa', 
                            borderRadius: '0 8px 8px 0', 
                            padding: '1.5rem 2rem', 
                            position: 'relative',
                            marginTop: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <input 
                              id="input-article-quote"
                              type="text"
                              placeholder="inserta aquí una cita estratégica que resalte la visión del autor"
                              defaultValue="inserta aquí una cita estratégica que resalte la visión del autor"
                              style={{ 
                                width: '90%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: '#af1daa', 
                                fontSize: '1.15rem', 
                                fontFamily: 'serif', 
                                fontStyle: 'italic',
                                fontWeight: '500'
                              }}
                            />
                            <span style={{ 
                              position: 'absolute', 
                              right: '1.5rem', 
                              bottom: '0.5rem', 
                              fontSize: '3.5rem', 
                              color: 'rgba(143, 0, 141, 0.25)', 
                              fontFamily: 'serif',
                              lineHeight: 1,
                              pointerEvents: 'none'
                            }}>
                              ””
                            </span>
                          </div>

                          {/* SEGUNDO PÁRRAFO INTERMEDIO */}
                          <textarea 
                            rows={4}
                            placeholder="Escribe el siguiente párrafo de tu artículo..."
                            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque felis eget enim venenatis, eget ultrices felis consectetur. Suspendisse sed turpis volutpat ante dictum venenatis eget non nulla. Etiam non varius nibh. Sed vel nisl sapien. Fusce elit purus, consectetur sed neque a, sagittis eleifend tellus. Nunc bibendum orci porta"
                            style={{ 
                              width: '100%', 
                              padding: '0', 
                              border: 'none', 
                              backgroundColor: 'transparent', 
                              fontSize: '1.05rem', 
                              lineHeight: '1.8', 
                              fontFamily: 'serif',
                              color: '#1E1B4B',
                              outline: 'none',
                              resize: 'none'
                            }}
                          />

                          {/* TARJETAS DINÁMICAS EN PARALELO DE 2 COLUMNAS (DISEÑO IDÉNTICO FOTO 2) */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '0.75rem 0' }}>
                            {/* TARJETA 1 */}
                            <div style={{ backgroundColor: '#f4f4f4', borderLeft: '3px solid #af1daa', padding: '1.25rem 1.5rem', borderRadius: '4px' }}>
                              <input 
                                type="text" 
                                defaultValue="Integración Temprana"
                                placeholder="Integración Temprana"
                                style={{ width: '100%', color: '#1E1B4B', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: '700', border: 'none', outline: 'none', backgroundColor: 'transparent' }}
                              />
                              <textarea 
                                rows={3}
                                defaultValue="Involucrar tempranamente a estas funciones en iniciativas relevantes permite una visión proactiva."
                                placeholder="Involucrar tempranamente a estas funciones..."
                                style={{ width: '100%', color: '#64748B', fontSize: '0.85rem', lineHeight: '1.5', border: 'none', outline: 'none', backgroundColor: 'transparent', resize: 'none', fontFamily: 'inherit' }}
                              />
                            </div>

                            {/* TARJETA 2 */}
                            <div style={{ backgroundColor: '#f4f4f4', borderLeft: '3px solid #af1daa', padding: '1.25rem 1.5rem', borderRadius: '4px' }}>
                              <input 
                                type="text" 
                                defaultValue="Ingresa título"
                                placeholder="Ingresa título"
                                style={{ width: '100%', color: '#94A3B8', fontSize: '1rem', marginBottom: '0.4rem', fontWeight: '700', border: 'none', outline: 'none', backgroundColor: 'transparent' }}
                              />
                              <textarea 
                                rows={3}
                                defaultValue="Ingresa aquí el texto"
                                placeholder="Ingresa aquí el texto"
                                style={{ width: '100%', color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5', border: 'none', outline: 'none', backgroundColor: 'transparent', resize: 'none', fontFamily: 'inherit' }}
                              />
                            </div>
                          </div>

                          {/* PÁRRAFO FINAL LIBRE DE CONTINUACIÓN */}
                          <textarea 
                            rows={5}
                            placeholder="Continúa escribiendo el final de tu artículo aquí..."
                            style={{ 
                              width: '100%', 
                              padding: '0', 
                              border: 'none', 
                              backgroundColor: 'transparent', 
                              fontSize: '1.05rem', 
                              lineHeight: '1.8', 
                              fontFamily: 'serif',
                              color: '#1E1B4B',
                              outline: 'none',
                              resize: 'vertical'
                            }}
                          />

                        </div>

                      </div>


                      {/* COLUMNA DERECHA: CONFIGURACIÓN, AUTOR & BOTONES DE PUBLICACIÓN */}
                      <div style={{ backgroundColor: '#F8F5FF', padding: '1.75rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        
                        {/* ESTADO DE PUBLICACIÓN */}
                        <div style={{ marginBottom: '1.75rem' }}>
                          <label style={{ display: 'block', color: '#1E1B4B', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                            ESTADO DE PUBLICACIÓN
                          </label>
                          <select 
                            id="select-article-status"
                            defaultValue={editingArticle?.status || "Publicado"}
                            style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.9rem', backgroundColor: '#FFFFFF', color: '#1E1B4B', outline: 'none' }}
                          >
                            <option value="Publicado">Publicado Inmediatamente</option>
                            <option value="Borrador">Borrador</option>
                            <option value="Programado">Programado</option>
                          </select>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: '#334155', fontSize: '0.85rem', fontWeight: '600' }}>
                            <Calendar size={16} style={{ color: '#af1daa' }} />
                            <span>14 de Agosto, 2026</span>
                          </div>
                        </div>

                        {/* DETALLES DEL AUTOR */}
                        <div style={{ marginBottom: '1.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                          <label style={{ display: 'block', color: '#1E1B4B', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                            DETALLES DEL AUTOR
                          </label>
                          
                          <div style={{ marginBottom: '0.85rem' }}>
                            <span style={{ display: 'block', color: '#64748B', fontSize: '0.7rem', fontWeight: '700', marginBottom: '0.25rem' }}>NOMBRE DEL AUTOR</span>
                            <input 
                              id="input-article-author"
                              key={editingArticle ? editingArticle.author : 'new-author'}
                              type="text" 
                              placeholder="Ej. Sheila Silva Mayo" 
                              defaultValue={editingArticle ? editingArticle.author : ''}
                              style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#f4f4f4', color: '#1E1B4B', fontWeight: '600' }}
                            />
                          </div>

                          <div>
                            <span style={{ display: 'block', color: '#64748B', fontSize: '0.7rem', fontWeight: '700', marginBottom: '0.25rem' }}>CARGO</span>
                            <input 
                              id="input-article-role"
                              key={editingArticle ? editingArticle.role : 'new-author-role'}
                              type="text" 
                              placeholder="Ej. Abogado de LG ABOGADOS" 
                              defaultValue={editingArticle ? editingArticle.role : ''}
                              style={{ width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#f4f4f4', color: '#1E1B4B', fontWeight: '600' }}
                            />
                          </div>
                        </div>

                        {/* ETIQUETAS */}
                        <div style={{ marginBottom: '2rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                          <label style={{ display: 'block', color: '#1E1B4B', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                            ETIQUETAS / CATEGORÍA
                          </label>

                          <select id="select-article-category" style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#FFFFFF', color: '#1E1B4B', marginBottom: '1rem' }}>
                            <option value="GESTIÓN DE RIESGOS">Gestión de Riesgos</option>
                            <option value="GOBIERNO CORPORATIVO">Gobierno Corporativo</option>
                            <option value="COMPLIANCE">Compliance</option>
                            <option value="TENDENCIAS REGULATORIAS">Tendencias Regulatorias</option>
                          </select>
                        </div>

                        {/* BOTONES DE ACCIÓN FUNCIONALES */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                          <button 
                            type="button"
                            onClick={() => {
                              const titleVal = (document.getElementById('input-article-title') as HTMLInputElement)?.value;
                              const authorVal = (document.getElementById('input-article-author') as HTMLInputElement)?.value;
                              const roleVal = (document.getElementById('input-article-role') as HTMLInputElement)?.value;
                              const contentVal = (document.getElementById('input-article-content') as HTMLTextAreaElement)?.value;
                              const catVal = (document.getElementById('select-article-category') as HTMLSelectElement)?.value;
                              const statusVal = (document.getElementById('select-article-status') as HTMLSelectElement)?.value || 'Publicado';
                              
                              const newTitle = titleVal || (editingArticle ? editingArticle.title : "NUEVA PUBLICACIÓN");
                              const newAuthor = authorVal || (editingArticle ? editingArticle.author : "WIC COLOMBIA");
                              const newRole = roleVal || (editingArticle ? editingArticle.role : "ESPECIALISTA COMPLIANCE");
                              const newContent = contentVal || (editingArticle ? editingArticle.content : "Contenido de la publicación...");
                              const newImg = editingArticle?.image || "/Fotos/Imagen para Inicio - Eventos 04.jpg";

                              if (editingArticle && editingArticle.id) {
                                setArticlesList(prev => prev.map(a => a.id === editingArticle.id ? {
                                  ...a,
                                  title: newTitle,
                                  author: newAuthor,
                                  role: newRole,
                                  content: newContent,
                                  category: catVal || a.category,
                                  status: statusVal,
                                  image: newImg,
                                  summary: newContent.slice(0, 140) + "..."
                                } : a));
                              } else {
                                const newArt: Article = {
                                  id: `art-${Date.now()}`,
                                  title: newTitle,
                                  category: catVal || "ACTUALIDAD REGULATORIA",
                                  author: newAuthor,
                                  role: newRole,
                                  date: "Hoy",
                                  readTime: "4 min de lectura",
                                  summary: newContent.slice(0, 140) + "...",
                                  image: newImg,
                                  status: statusVal,
                                  content: newContent
                                };
                                setArticlesList(prev => [newArt, ...prev]);
                              }
                              alert(`¡Artículo ${statusVal === 'Borrador' ? 'guardado como Borrador' : 'publicado con éxito en la Web Pública de WIC'}!`);
                              setAdminSubTab('blog-list');
                            }}
                            style={{ 
                              width: '100%', 
                              padding: '0.85rem', 
                              backgroundColor: '#af1daa', 
                              color: '#FFFFFF', 
                              border: 'none', 
                              borderRadius: '6px', 
                              fontWeight: '700', 
                              fontSize: '0.9rem',
                              letterSpacing: '1px',
                              cursor: 'pointer' 
                            }}
                          >
                            PUBLICAR
                          </button>

                          <button 
                            type="button"
                            onClick={() => {
                              const titleVal = (document.getElementById('input-article-title') as HTMLInputElement)?.value;
                              const authorVal = (document.getElementById('input-article-author') as HTMLInputElement)?.value;
                              const contentVal = (document.getElementById('input-article-content') as HTMLTextAreaElement)?.value;
                              const newTitle = titleVal || "BORRADOR DE ARTÍCULO";
                              const newAuthor = authorVal || "WIC COLOMBIA";
                              const newContent = contentVal || "Borrador en desarrollo...";
                              const newImg = editingArticle?.image || "/Fotos/Imagen para Inicio - Eventos 04.jpg";

                              const draftArt: Article = {
                                id: editingArticle?.id || `art-${Date.now()}`,
                                title: newTitle,
                                category: "BORRADOR",
                                author: newAuthor,
                                role: "Autor WIC",
                                date: "Hoy",
                                readTime: "3 min de lectura",
                                summary: newContent.slice(0, 100) + "...",
                                image: newImg,
                                status: "Borrador",
                                content: newContent
                              };

                              setArticlesList(prev => [draftArt, ...prev.filter(a => a.id !== draftArt.id)]);
                              alert('Borrador guardado en la Intranet.');
                              setAdminSubTab('blog-list');
                            }}
                            style={{ 
                              width: '100%', 
                              padding: '0.85rem', 
                              backgroundColor: 'transparent', 
                              color: '#af1daa', 
                              border: '1px solid #af1daa', 
                              borderRadius: '6px', 
                              fontWeight: '700', 
                              fontSize: '0.9rem',
                              letterSpacing: '1px',
                              cursor: 'pointer' 
                            }}
                          >
                            GUARDAR (BORRADOR)
                          </button>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <a href="#preview" onClick={(e) => { e.preventDefault(); setActiveTab('contenido'); }} style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            Ver vista previa pública <ExternalLink size={14} />
                          </a>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

                <div style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                  {(adminSubTab === 'member-editor' || adminSubTab === 'blog-editor') && (
                    <button 
                      onClick={() => setAdminSubTab(adminSubTab === 'member-editor' ? 'members-list' : 'blog-list')}
                      style={{ background: 'none', border: 'none', color: '#af1daa', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      ← Volver al Listado de {adminSubTab === 'member-editor' ? 'Miembros' : 'Blog'}
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setActiveTab('inicio');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Globe size={16} /> Volver a la Web Pública de WIC
                  </button>
                </div>
              </main>
            </div>
          ) : (
            /* FORMULARIO DE LOGIN SI NO HA INICIADO SESIÓN */
            <div style={{ 
              backgroundColor: '#FCF8FF', 
              minHeight: '100vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2rem 1rem'
            }}>
            <div style={{ 
              backgroundColor: '#FFFFFF', 
              width: '100%', 
              maxWidth: '430px', 
              borderRadius: '6px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)', 
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* FRANJA DE CORONA SUPERIOR MORADA */}
              <div style={{ height: '6px', backgroundColor: '#af1daa' }} />

              <div style={{ padding: '2.5rem 2rem 2.5rem 2rem' }}>
                <h1 style={{ 
                  color: '#1E1B4B', 
                  fontSize: '2.2rem', 
                  fontFamily: 'serif', 
                  fontWeight: '600', 
                  marginBottom: '0.4rem' 
                }}>
                  Iniciar Sesión
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Acceso restringido para especialistas en cumplimiento.
                </p>

                {isLoggedIn ? (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: '#DCFCE7', 
                      color: '#166534', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 1rem auto',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                    <h3 style={{ color: '#0F172A', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Autenticación Exitosa</h3>
                    <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Cargando Panel de Administración de WIC Colombia...</p>
                    
                    <button 
                      className="btn btn-fuchsia"
                      onClick={() => setIsLoggedIn(false)}
                      style={{ width: '100%', backgroundColor: '#af1daa', padding: '0.75rem' }}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (loginEmail && loginPassword) {
                      setIsLoggedIn(true);
                    }
                  }}>
                    {/* INPUT CORREO */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ 
                        display: 'block', 
                        color: '#64748B', 
                        fontSize: '0.75rem', 
                        fontWeight: '700', 
                        letterSpacing: '0.5px',
                        marginBottom: '0.4rem',
                        textTransform: 'uppercase'
                      }}>
                        CORREO ELECTRÓNICO
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="Ingresa tu email"
                          style={{ 
                            width: '100%', 
                            padding: '0.75rem 2.5rem 0.75rem 0.85rem', 
                            border: '1px solid #E2E8F0', 
                            borderRadius: '4px', 
                            fontSize: '0.95rem',
                            backgroundColor: '#FAF5FF',
                            color: '#1E1B4B',
                            outline: 'none'
                          }}
                        />
                        <Mail size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      </div>
                    </div>

                    {/* INPUT CONTRASEÑA */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <label style={{ 
                          color: '#64748B', 
                          fontSize: '0.75rem', 
                          fontWeight: '700', 
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          CONTRASEÑA
                        </label>
                        <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ color: '#af1daa', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none' }}>
                          ¿Olvidó su clave?
                        </a>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Ingresa tu contraseña"
                          style={{ 
                            width: '100%', 
                            padding: '0.75rem 2.5rem 0.75rem 0.85rem', 
                            border: '1px solid #E2E8F0', 
                            borderRadius: '4px', 
                            fontSize: '0.95rem',
                            backgroundColor: '#FAF5FF',
                            color: '#1E1B4B',
                            outline: 'none'
                          }}
                        />
                        <LockIcon size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      </div>
                    </div>

                    {/* CHECKBOX */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
                      <input type="checkbox" id="remember" style={{ cursor: 'pointer', accentColor: '#af1daa' }} />
                      <label htmlFor="remember" style={{ color: '#64748B', fontSize: '0.85rem', cursor: 'pointer' }}>
                        Mantener sesión activa por 8 horas
                      </label>
                    </div>

                    {/* BOTÓN INGRESAR */}
                    <button 
                      type="submit"
                      style={{ 
                        width: '100%', 
                        padding: '0.85rem', 
                        backgroundColor: '#af1daa', 
                        color: '#FFFFFF', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontSize: '0.9rem', 
                        fontWeight: '700', 
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      INGRESAR <span>→</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
          )
        )}

        {/* ---------------------------------------------------- */}
        {/* PÁGINA 5: ERROR 404 - INFRACCIÓN DE RUTA DETECTADA  */}
        {/* ---------------------------------------------------- */}
        {activeTab === '404' && (
          <div className="fade-in" style={{ backgroundColor: '#0A1128', minHeight: 'calc(100vh - 75px)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
            {/* DECORACIÓN RADIAL EN EL FONDO */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(175, 29, 170, 0.25) 0%, rgba(203, 84, 255, 0.1) 45%, rgba(10, 17, 40, 0) 70%)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '780px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 2 }}>
              
              {/* CÓDIGO 404 CON GLOW DE GRADIENTE */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                <span style={{ fontSize: '8rem', fontWeight: '900', background: 'linear-gradient(135deg, #af1daa, #eb54ff, #e6affc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, letterSpacing: '-2px' }}>
                  404
                </span>
                <span style={{ position: 'absolute', top: '-10px', right: '-25px', backgroundColor: '#af1daa', color: '#FFF', fontSize: '0.75rem', fontWeight: '800', padding: '0.35rem 0.75rem', borderRadius: '9999px', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 0 15px rgba(175,29,170,0.6)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertTriangle size={13} /> REVISIÓN WIC
                </span>
              </div>

              {/* TÍTULO Y DESCRIPCIÓN CON HUMOR DE COMPLIANCE */}
              <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '1rem', lineHeight: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                <ShieldAlert size={34} style={{ color: '#EB54FF' }} /> ¡Infracción de Ruta Detectada!
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '1.1rem', maxWidth: '620px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
                La página que estás buscando ha incurrido en un desvío de cumplimiento normativo o no existe en los registros oficiales de gobernanza de WIC Colombia.
              </p>

              {/* WIDGET INTERACTIVO DE AUDITORÍA DE RUTA */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(230, 175, 252, 0.25)', borderRadius: '1.25rem', padding: '2rem', marginBottom: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#E6AFFC', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={22} style={{ color: '#EB54FF' }} /> Auditoría Automática de Enlace
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Presiona el botón para ejecutar una verificación en tiempo real de la trazabilidad del enlace solicitante:
                </p>

                {auditProgress === null ? (
                  <button
                    onClick={runAuditDemo}
                    style={{ backgroundColor: '#af1daa', color: '#FFFFFF', border: 'none', padding: '0.85rem 2rem', borderRadius: '9999px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(175,29,170,0.4)', transition: 'transform 0.2s ease' }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Search size={18} /> Ejecutar Auditoría de Ruta
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '540px', margin: '0 auto' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: '12px', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(230,175,252,0.3)' }}>
                      <div style={{ width: `${auditProgress}%`, height: '100%', background: 'linear-gradient(90deg, #af1daa, #eb54ff, #e6affc)', transition: 'width 0.4s ease' }} />
                    </div>
                    <p style={{ color: auditProgress === 100 ? '#FCA5A5' : '#E6AFFC', fontSize: '0.85rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                      {auditProgress === 100 ? <AlertTriangle size={16} /> : <Search size={16} />}
                      <span>{auditStatusText}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* BOTONES DE NAVEGACIÓN Y RETORNO */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setActiveTab('inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="btn btn-fuchsia"
                  style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
                >
                  <Home size={18} /> Volver al Inicio
                </button>
                <button
                  onClick={() => { setActiveTab('miembros'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ backgroundColor: 'transparent', color: '#E6AFFC', border: '1px solid #EB54FF', padding: '0.85rem 1.8rem', borderRadius: '9999px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Users size={18} /> Conocer Fundadoras
                </button>
                <button
                  onClick={() => { setActiveTab('contenido'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ backgroundColor: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', padding: '0.85rem 1.8rem', borderRadius: '9999px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <BookOpen size={18} /> Leer Blog
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* FOOTER (OCULTO EN VISTA LOGIN/ADMIN SEGÚN MAQUETA 07-LOGIN) */}
      {activeTab !== 'login' && (
        <footer style={{ backgroundColor: '#0A1128', color: '#FFFFFF', borderTop: '1px solid #1E293B', padding: '4rem 1.5rem 2rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
              
              {/* COLUMNA 1: SOBRE WIC */}
              <div>
                <img 
                  src="/Logo/Logo WIC COL  (2).png" 
                  alt="Logo WIC Colombia Footer" 
                  style={{ height: '55px', objectFit: 'contain', marginBottom: '1.25rem', filter: 'brightness(0) invert(1)' }} 
                />
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Women in Compliance Colombia es la comunidad oficial de mujeres líderes dedicadas al fortalecimiento de la ética, el cumplimiento y el gobierno corporativo en el país.
                </p>
              </div>

              {/* COLUMNA 2: ENLACES RÁPIDOS */}
              <div>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Navegación</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#94A3B8', fontSize: '0.95rem' }}>
                  <li>
                    <button onClick={() => { setActiveTab('inicio'); window.scrollTo({top:0, behavior:'smooth'}); }} style={{ background:'none', border:'none', color:'#94A3B8', padding:0 }}>
                      Inicio
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveTab('miembros'); window.scrollTo({top:0, behavior:'smooth'}); }} style={{ background:'none', border:'none', color:'#94A3B8', padding:0 }}>
                      Afiliadas Fundadoras
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveTab('eventos'); window.scrollTo({top:0, behavior:'smooth'}); }} style={{ background:'none', border:'none', color:'#94A3B8', padding:0 }}>
                      Eventos Previos & Próximos
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveTab('contenido'); window.scrollTo({top:0, behavior:'smooth'}); }} style={{ background:'none', border:'none', color:'#94A3B8', padding:0 }}>
                      Contenido & Artículos
                    </button>
                  </li>
                </ul>
              </div>

              {/* COLUMNA 3: CONTÁCTENOS (VALORES EXACTOS DEL DOCUMENTO DE AJUSTES) */}
              <div>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Contáctenos</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94A3B8', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Phone size={18} style={{ color: '#af1daa' }} />
                    <span>Teléfono: <strong>3102173249</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail size={18} style={{ color: '#af1daa' }} />
                    <span>Correo: <strong>wiccolombia@outlook.com</strong></span>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ borderTop: '1px solid #1E293B', paddingTop: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} Women in Compliance Colombia (WIC COL). Todos los derechos reservados.
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}

export default App;
