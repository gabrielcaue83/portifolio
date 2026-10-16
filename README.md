# Cauê Gabriel — portfólio em mundos

Um portfólio dividido em mundos, cada um feito com uma ferramenta:

- **Casa** — zine cartoon (abertura, trampos, contato)
- **Mundo 01 · GSAP** — laboratório neon, galeria horizontal com demos ao vivo
- **Mundo 02 · Three.js** — estúdio de cinema, câmera que viaja por "shots"
- **Mundo 03 · Motion** — desenho de sábado de manhã, animação vetorial

Site estático: GSAP e Three.js vêm de CDN, sem etapa de build.

## Estrutura

```
index.html                 marcação das seções
assets/css/style.css       estilos de todos os mundos
assets/js/main.js          GSAP: personagem, transições, demos, guia
assets/js/three-world.js   cena 3D do mundo Three.js (módulo)
```

Dados de contato: objeto `CONFIG` no topo de `assets/js/main.js`.

## Rodar localmente

```bash
npx serve .
# ou
python3 -m http.server 8000
```

Publicado automaticamente no GitHub Pages a cada push na `main`.
