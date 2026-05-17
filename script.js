const canvas = document.getElementById('fundo-estrelas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const estrelas = [];
const quantidadeEstrelas = 90; // menos estrelas para reduzir ruído visual
const baseVelocidade = 6; // velocidade base reduzida

// parâmetros dinâmicos para efeito de viagem
let speedMultiplier = 1;
let targetSpeedMultiplier = 1;
let baseFov = 300;
let fovMultiplier = 1;
let targetFovMultiplier = 1;
let cameraX = 0; // deslocamento lateral da 'câmera'
let cameraXVel = 0;
let lateralSpeed = 0;

class Estrela3D {
    constructor() {
        this.iniciar();
        this.z = Math.random() * width;
    }

    iniciar() {
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = width;
        this.pz = this.z;
    }

            atualizar() {
                this.pz = this.z;
                // velocidade depende do multiplicador dinâmico
                this.z -= baseVelocidade * speedMultiplier;

                if (this.z < 1) {
                    this.iniciar();
                    this.pz = this.z;
                }
            }

        desenhar() {
            const fov = baseFov * fovMultiplier;
            // aplica deslocamento lateral da 'câmera' tanto para posição atual quanto anterior
            const sx = ((this.x + cameraX) / this.z) * fov + width / 2;
            const sy = (this.y / this.z) * fov + height / 2;
            const px = ((this.x + cameraX) / this.pz) * fov + width / 2;
            const py = (this.y / this.pz) * fov + height / 2;

            // Opacidade e espessura com limites para evitar artefatos visuais
            const rawOpacity = 1 - (this.z / width);
            const opacidade = Math.max(0, Math.min(1, rawOpacity));
            const rawEspessura = (1 - this.z / width) * 3 * fovMultiplier;
            const espessura = Math.max(0.35, Math.min(6, rawEspessura));

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacidade})`;
        ctx.lineWidth = espessura;
        ctx.stroke();
        }
}

for (let i = 0; i < quantidadeEstrelas; i++) {
    estrelas.push(new Estrela3D());
}

// Função auxiliar: replay de animação (remove e re-adiciona a classe)
function replayAnimation(el, cls = 'animate') {
    if (!el) return;
    el.classList.remove(cls);
    // Forçar reflow para reiniciar animação
    // eslint-disable-next-line no-unused-expressions
    void el.offsetWidth;
    el.classList.add(cls);
}

// Função para animar hero section (replay)
function animarHero() {
    const heroName = document.querySelector('.hero .animate-name');
    const heroSubtitle = document.querySelector('.hero .animate-subtitle');
    const heroIcons = document.querySelector('.hero .animate-icons');

    replayAnimation(heroName);
    replayAnimation(heroSubtitle);
    replayAnimation(heroIcons);
}

// Observer que reexecuta animações ao entrar no viewport (qualquer direção)
const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
            // Hero
            if (el.classList.contains('hero')) {
                animarHero();
            }

            // Título de projetos
            if (el.classList.contains('projects-title')) {
                replayAnimation(el);
            }

            // Título de skills
            if (el.classList.contains('skills-title')) {
                replayAnimation(el);
            }

            // Card individual: project
            if (el.classList.contains('project-card')) {
                replayAnimation(el);
            }

            // Card individual: skill
            if (el.classList.contains('skill-card')) {
                replayAnimation(el);
            }
        } else {
            // Remover classe para permitir replay na próxima entrada
            if (el.classList.contains('project-card') || el.classList.contains('projects-title') || el.classList.contains('skill-card') || el.classList.contains('skills-title')) {
                el.classList.remove('animate');
            }
        }
    });
}, { threshold: 0.35 });

// Observar hero
const heroSection = document.querySelector('.hero');
if (heroSection) elementObserver.observe(heroSection);

// Observar cada project-card individualmente para permitir animação ao entrar/reen
document.querySelectorAll('.project-card').forEach(card => elementObserver.observe(card));

// Observar título dos projetos
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) elementObserver.observe(projectsTitle);

// Observar seção de Certificados
const certificatesSection = document.querySelector('#certificates');
if (certificatesSection) {
    const certificatesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.2 });
    certificatesObserver.observe(certificatesSection);
}

// Observar seção Sobre Mim
const aboutSection = document.querySelector('#about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.3 });
    aboutObserver.observe(aboutSection);
}

// Observar título das skills
const skillsTitle = document.querySelector('.skills-title');
if (skillsTitle) elementObserver.observe(skillsTitle);

// Observar cada skill-card para replay ao entrar
document.querySelectorAll('.skill-card').forEach(card => elementObserver.observe(card));

// Executar animações iniciais
setTimeout(() => { animarHero(); }, 80);
setTimeout(() => {
    const projectsSection = document.querySelector('.projects-section');
    if (projectsSection && projectsSection.getBoundingClientRect().top < window.innerHeight) {
        // animar todos os cards em sequência
        document.querySelectorAll('.project-card').forEach((c, i) => {
            setTimeout(() => replayAnimation(c), i * 120);
        });
        if (projectsTitle) replayAnimation(projectsTitle);
    }
}, 200);

// Animar certificados se já estiverem visíveis na carga
setTimeout(() => {
    const certificatesSection = document.querySelector('#certificates');
    if (certificatesSection && certificatesSection.getBoundingClientRect().top < window.innerHeight) {
        certificatesSection.classList.add('show');
    }
}, 300);

// Animar seção Sobre Mim se já estiver visível
setTimeout(() => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection && aboutSection.getBoundingClientRect().top < window.innerHeight) {
        aboutSection.classList.add('show');
    }
}, 350);

// Animar skills se já estiverem visíveis na carga
setTimeout(() => {
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection && skillsSection.getBoundingClientRect().top < window.innerHeight) {
        document.querySelectorAll('.skill-card').forEach((c, i) => {
            setTimeout(() => replayAnimation(c), i * 100);
        });
        if (skillsTitle) replayAnimation(skillsTitle);
    }
}, 250);

// (Removido código duplicado de observação/animation que causava conflitos)

// IntersectionObserver para ativar modo 'viagem' quando a seção de projetos estiver visível
const projectsElement = document.getElementById('projects');
if (projectsElement) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // modo viagem menos agressivo: aumenta fov, velocidade e deslocamento lateral de forma moderada
                targetSpeedMultiplier = 1.4;
                targetFovMultiplier = 1.15;
                lateralSpeed = 0.6; // deslocamento lateral moderado
            } else {
                // volta ao normal
                targetSpeedMultiplier = 1;
                targetFovMultiplier = 1;
                lateralSpeed = 0;
            }
        });
    }, { threshold: 0.15 });

    io.observe(projectsElement);
}

// scroll padrão restaurado — nenhum handler que bloqueie o comportamento nativo

// Redimensionamento do canvas
function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', handleResize);

// Loop principal de animação das estrelas
function animar() {
    // limpar canvas
    ctx.clearRect(0, 0, width, height);

    // suavizar transição dos multiplicadores
    speedMultiplier += (targetSpeedMultiplier - speedMultiplier) * 0.04;
    fovMultiplier += (targetFovMultiplier - fovMultiplier) * 0.04;

    // ajustar deslocamento lateral (cameraX)
    cameraXVel += (lateralSpeed - cameraXVel) * 0.06;
    cameraX += cameraXVel;

    // atualizar e desenhar estrelas
    for (let i = 0; i < estrelas.length; i++) {
        estrelas[i].atualizar();
        estrelas[i].desenhar();
    }

    requestAnimationFrame(animar);
}

// iniciar
handleResize();
requestAnimationFrame(animar);
