export type BackgroundLocale = 'en' | 'es' | 'zh';

type Experience = {
  role: string;
  organization: string;
  period: string;
  start: string;
  end?: string;
  description: string;
};

type BackgroundContent = {
  education: {
    title: string;
    lead: string;
    degree: string;
    school: string;
    period: string;
    status: string;
    description: string;
    subjectsLabel: string;
    subjects: string[];
    languagesLabel: string;
    languages: { name: string; level: string }[];
  };
  experience: { title: string; lead: string; entries: Experience[] };
  skills: { title: string; lead: string; entries: { name: string; evidence: string }[] };
};

// La formación, los puestos y sus fechas proceden del CV de Javier.
export const background: Record<BackgroundLocale, BackgroundContent> = {
  en: {
    education: {
      title: 'Education',
      lead: 'The foundations behind the projects.',
      degree: 'Data Engineering & Systems',
      school: 'ETSIT · Universidad Politécnica de Madrid',
      period: '2022 - Present',
      status: 'Final-year undergraduate',
      description: 'Designing the systems that collect, process and turn data into useful products, with security built in.',
      subjectsLabel: 'Areas of study',
      subjects: ['Cloud Big Data', 'Distributed databases', 'Cloud computing', 'Machine learning', 'Large-scale processing', 'Cybersecurity & data protection'],
      languagesLabel: 'Languages',
      languages: [
        { name: 'Spanish', level: 'Native' },
        { name: 'English', level: 'B2 · TOEIC' },
        { name: 'French', level: 'Basic' },
      ],
    },
    experience: {
      title: 'Work experience',
      lead: 'Building systems, teaching people and learning from both.',
      entries: [
        {
          role: 'Cybersecurity consultant',
          organization: 'Freelance',
          period: '2025 - Present',
          start: '2025',
          description: 'Web security audits, authorized penetration testing, phishing simulations and security awareness for small businesses.',
        },
        {
          role: 'Technical instructor',
          organization: 'Grupo Studium Formación',
          period: 'Sep 2025 - Present',
          start: '2025-09',
          description: 'Hands-on AI, cybersecurity and programming workshops for teenagers. Making technical ideas approachable through practice.',
        },
        {
          role: 'Mathematics & programming tutor',
          organization: 'Private tuition',
          period: 'Sep 2022 - Present',
          start: '2022-09',
          description: 'One-to-one support, adapting explanations and exercises to each student’s needs.',
        },
        {
          role: 'Youth football coach',
          organization: 'Parque Arganzuela',
          period: 'Sep 2023 - 2025',
          start: '2023-09',
          end: '2025',
          description: 'Planning training and helping young players develop teamwork, responsibility and confidence.',
        },
      ],
    },
    skills: {
      title: 'Soft skills',
      lead: 'What I bring to the team, beyond the stack.',
      entries: [
        { name: 'Clear communication', evidence: 'Teaching AI, security and programming means finding explanations that work for different audiences.' },
        { name: 'Teamwork & leadership', evidence: 'Team projects and coaching youth football have taught me to coordinate, listen and support others.' },
        { name: 'Initiative & continuous learning', evidence: 'Personal tools, data projects and a fangame turn new ideas into something people can use.' },
        { name: 'Rigor & professional ethics', evidence: 'Authorized security work and explainable data systems call for evidence, reproducibility and care.' },
      ],
    },
  },
  es: {
    education: {
      title: 'Estudios',
      lead: 'La base de los proyectos.',
      degree: 'Ingeniería de Datos y Sistemas',
      school: 'ETSIT · Universidad Politécnica de Madrid',
      period: '2022 - Actualidad',
      status: 'Estudiante de último curso',
      description: 'Diseño de sistemas que recogen, procesan y convierten los datos en productos útiles, incorporando la seguridad desde el principio.',
      subjectsLabel: 'Áreas de estudio',
      subjects: ['Big Data en la nube', 'Bases de datos distribuidas', 'Computación en la nube', 'Aprendizaje automático', 'Procesamiento masivo', 'Ciberseguridad y protección de datos'],
      languagesLabel: 'Idiomas',
      languages: [
        { name: 'Español', level: 'Nativo' },
        { name: 'Inglés', level: 'B2 · TOEIC' },
        { name: 'Francés', level: 'Básico' },
      ],
    },
    experience: {
      title: 'Experiencia laboral',
      lead: 'Construir sistemas, enseñar y aprender de ambas cosas.',
      entries: [
        {
          role: 'Consultor de ciberseguridad',
          organization: 'Freelance',
          period: '2025 - Actualidad',
          start: '2025',
          description: 'Auditorías de seguridad web, pruebas de penetración autorizadas, simulaciones de phishing y concienciación para pequeñas empresas.',
        },
        {
          role: 'Docente técnico',
          organization: 'Grupo Studium Formación',
          period: 'Sep 2025 - Actualidad',
          start: '2025-09',
          description: 'Talleres prácticos de IA, ciberseguridad y programación para adolescentes. Acercar los conceptos técnicos a través de la práctica.',
        },
        {
          role: 'Profesor de matemáticas y programación',
          organization: 'Clases particulares',
          period: 'Sep 2022 - Actualidad',
          start: '2022-09',
          description: 'Apoyo individual, adaptando las explicaciones y los ejercicios a las necesidades de cada estudiante.',
        },
        {
          role: 'Entrenador de fútbol base',
          organization: 'Parque Arganzuela',
          period: 'Sep 2023 - 2025',
          start: '2023-09',
          end: '2025',
          description: 'Planificación de entrenamientos y acompañamiento de jóvenes jugadores para desarrollar equipo, responsabilidad y confianza.',
        },
      ],
    },
    skills: {
      title: 'Habilidades personales',
      lead: 'Lo que aporto al equipo, además del stack.',
      entries: [
        { name: 'Comunicación clara', evidence: 'Enseñar IA, seguridad y programación exige encontrar explicaciones que funcionen para públicos diferentes.' },
        { name: 'Trabajo en equipo y liderazgo', evidence: 'Los proyectos en equipo y el fútbol base me han enseñado a coordinar, escuchar y apoyar a los demás.' },
        { name: 'Iniciativa y aprendizaje continuo', evidence: 'Las herramientas propias, los proyectos de datos y un fangame convierten ideas nuevas en algo que se puede usar.' },
        { name: 'Rigor y ética profesional', evidence: 'Las auditorías autorizadas y los sistemas de datos explicables requieren evidencias, reproducibilidad y cuidado.' },
      ],
    },
  },
  zh: {
    education: {
      title: '教育背景',
      lead: '每个项目背后的知识基础。',
      degree: '数据与系统工程',
      school: 'ETSIT · 马德里理工大学（UPM）',
      period: '2022 年至今',
      status: '本科最后一年',
      description: '设计数据采集、处理与应用系统，将数据转化为实用产品，并从一开始就考虑安全性。',
      subjectsLabel: '主要学习领域',
      subjects: ['云端大数据', '分布式数据库', '云计算', '机器学习', '大规模数据处理', '网络安全与数据保护'],
      languagesLabel: '语言能力',
      languages: [
        { name: '西班牙语', level: '母语' },
        { name: '英语', level: 'B2 · TOEIC' },
        { name: '法语', level: '基础' },
      ],
    },
    experience: {
      title: '工作经历',
      lead: '构建系统、传授知识，并在两者中不断学习。',
      entries: [
        {
          role: '网络安全顾问',
          organization: '自由职业',
          period: '2025 年至今',
          start: '2025',
          description: '为小型企业开展网站安全审计、授权渗透测试、钓鱼模拟及安全意识培训。',
        },
        {
          role: '技术讲师',
          organization: 'Grupo Studium Formación',
          period: '2025 年 9 月至今',
          start: '2025-09',
          description: '为青少年教授人工智能、网络安全和编程实践课程，通过动手练习帮助学生理解技术概念。',
        },
        {
          role: '数学与编程家教',
          organization: '私人辅导',
          period: '2022 年 9 月至今',
          start: '2022-09',
          description: '提供一对一学习支持，根据每位学生的需求调整讲解方式与练习。',
        },
        {
          role: '青少年足球教练',
          organization: 'Parque Arganzuela',
          period: '2023 年 9 月 - 2025 年',
          start: '2023-09',
          end: '2025',
          description: '制定训练计划，帮助年轻球员培养团队精神、责任感与自信。',
        },
      ],
    },
    skills: {
      title: '软技能',
      lead: '除了技术栈，我能为团队带来的价值。',
      entries: [
        { name: '清晰沟通', evidence: '教授人工智能、安全与编程，需要根据不同听众找到合适的解释方式。' },
        { name: '团队协作与领导力', evidence: '团队项目与青少年足球执教让我学会协调、倾听并支持他人。' },
        { name: '主动性与持续学习', evidence: '通过自研工具、数据项目与同人游戏，将新想法变成可以使用的成果。' },
        { name: '严谨与职业道德', evidence: '授权安全测试与可解释数据系统都需要证据、可复现的方法和审慎的态度。' },
      ],
    },
  },
};
