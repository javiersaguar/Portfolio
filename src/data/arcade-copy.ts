export type ArcadeLocale = 'en' | 'es' | 'zh';

const en = {
  role: 'Data Engineer',
  language: 'Language', theme: 'Switch theme', light: 'Switch to the light theme', dark: 'Switch to the dark theme',
  menu: 'Arcade menu', main: 'Main navigation', mobile: 'Mobile navigation', back: 'Back to the menu',
  title: 'Choose your next mission.', subtitle: 'A little curiosity goes a long way.',
  aim: 'Aim at an invader. Click to explore.', touch: 'Tap to aim. Tap again to explore.',
  keyboard: 'Tab or arrow keys to aim. Enter to explore.', ready: 'Ready when you are.',
  selected: 'Target acquired', fire: 'Click to fire', tap: 'Tap again to fire',
  skip: 'Skip intro', intro: 'Javier Saguar, introduction', direct: 'Explore the portfolio directly',
  soundOn: 'Sound on', soundOff: 'Sound off', soundLabel: 'Laser sound',
  github: 'GitHub (opens in a new tab)', home: 'Javier Saguar, back to the menu',
  destinations: [
    { id: 'about', label: 'About me', detail: 'The person behind the pixels.' },
    { id: 'projects', label: 'Projects', detail: 'Real projects. Real repositories.' },
    { id: 'experience', label: 'Experience', detail: 'Security, teaching and teamwork.' },
    { id: 'contact', label: 'Contact', detail: 'Let’s build something together.' },
    { id: 'education', label: 'Education', detail: 'Data Engineering at UPM.' },
    { id: 'stack', label: 'Tech stack', detail: 'The tools, and where I use them.' },
    { id: 'skills', label: 'Soft skills', detail: 'How I think, work and collaborate.' },
    { id: 'certifications', label: 'Certifications', detail: 'A few milestones along the way.' },
  ],
};

const es: typeof en = {
  role: 'Ingeniero de datos',
  language: 'Idioma', theme: 'Cambiar tema', light: 'Cambiar al tema claro', dark: 'Cambiar al tema oscuro',
  menu: 'Menú arcade', main: 'Navegación principal', mobile: 'Navegación móvil', back: 'Volver al menú',
  title: 'Elige tu próxima misión.', subtitle: 'La curiosidad te llevará lejos.',
  aim: 'Apunta a un marciano. Haz clic para explorar.', touch: 'Toca para apuntar. Toca otra vez para explorar.',
  keyboard: 'Tab o flechas para apuntar. Intro para explorar.', ready: 'Todo listo para empezar.',
  selected: 'Objetivo localizado', fire: 'Haz clic para disparar', tap: 'Toca otra vez para disparar',
  skip: 'Saltar intro', intro: 'Javier Saguar, introducción', direct: 'Explorar el portfolio directamente',
  soundOn: 'Sonido activado', soundOff: 'Sonido desactivado', soundLabel: 'Sonido del láser',
  github: 'GitHub (se abre en otra pestaña)', home: 'Javier Saguar, volver al menú',
  destinations: [
    { id: 'about', label: 'Sobre mí', detail: 'La persona detrás de los píxeles.' },
    { id: 'projects', label: 'Proyectos', detail: 'Proyectos y repositorios reales.' },
    { id: 'experience', label: 'Experiencia', detail: 'Seguridad, docencia y trabajo en equipo.' },
    { id: 'contact', label: 'Contacto', detail: 'Construyamos algo juntos.' },
    { id: 'education', label: 'Estudios', detail: 'Ingeniería de Datos en la UPM.' },
    { id: 'stack', label: 'Tech stack', detail: 'Las herramientas y cómo las utilizo.' },
    { id: 'skills', label: 'Soft skills', detail: 'Cómo pienso, trabajo y colaboro.' },
    { id: 'certifications', label: 'Certificaciones', detail: 'Algunos hitos del camino.' },
  ],
};

const zh: typeof en = {
  role: '数据工程师',
  language: '语言', theme: '切换主题', light: '切换为浅色主题', dark: '切换为深色主题',
  menu: '街机菜单', main: '主导航', mobile: '移动端导航', back: '返回菜单',
  title: '选择你的下一个任务。', subtitle: '让好奇心带你继续探索。',
  aim: '瞄准外星人，点击开始探索。', touch: '轻触瞄准，再次轻触开始探索。',
  keyboard: '按 Tab 或方向键瞄准，按回车键探索。', ready: '准备就绪，随时出发。',
  selected: '已锁定目标', fire: '点击发射', tap: '再次轻触发射',
  skip: '跳过开场', intro: 'Javier Saguar 开场动画', direct: '直接浏览作品集',
  soundOn: '声音已开启', soundOff: '声音已关闭', soundLabel: '激光音效',
  github: 'GitHub（在新标签页打开）', home: 'Javier Saguar，返回菜单',
  destinations: [
    { id: 'about', label: '关于我', detail: '像素背后的我。' },
    { id: 'projects', label: '项目', detail: '真实项目与代码仓库。' },
    { id: 'experience', label: '工作经历', detail: '网络安全、教学与团队合作。' },
    { id: 'contact', label: '联系我', detail: '一起创造新的可能。' },
    { id: 'education', label: '教育背景', detail: '马德里理工大学数据工程专业。' },
    { id: 'stack', label: '技术栈', detail: '我使用的工具与应用场景。' },
    { id: 'skills', label: '软技能', detail: '我的思考、工作与协作方式。' },
    { id: 'certifications', label: '专业认证', detail: '学习路上的一些里程碑。' },
  ],
};

export const arcadeCopy = (locale: ArcadeLocale) => ({ en, es, zh })[locale];
export const pageLocale = (url: URL): ArcadeLocale => {
  const first = url.pathname.split('/')[1];
  return first === 'es' || first === 'zh' ? first : 'en';
};
