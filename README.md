
# 🌐 Vistametric v2.0


<p align="center">
    <img src="/public/assets/app-demo.png" alt="Vistametric Banner" width="80%"/>
</p>

<p align="center">
    <b>Vistametric é uma plataforma OpenSource de visualização e mapeamento 3D imersivo. Criado em React e Node.js, permite transformar modelos georreferenciados em experiências interativas de alta precisão, integrando ambientes 3D com panoramas de 360º. Projetado para setores como imobiliário, industrial e patrimonial, projetado para ser expandido e adaptado por desenvolvedores que desejam colaborar e inovar. </b>
</p>

---

## 🚀 Testar Online

👉 <a href="https://vistametric.vercel.app/" target="_blank" rel="noopener noreferrer">Acesse a aplicação online</a>

---

## 📑 Sumário

- [Visão Geral](#visão-geral)
- [Stacks Utilizadas](#stacks-utilizadas)
- [Demonstração Visual](#demonstração-visual)
- [Guia do Usuário](#guia-do-usuário)
- [Guia do Desenvolvedor](#guia-do-desenvolvedor)
- [Como Funciona](#como-funciona)
- [Testar Online](#testar-online)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Licença e Créditos](#licença-e-créditos)

---


## 👁️ Visão Geral

O **Vistametric** é um sistema para visualização, navegação e documentação de modelos 3D georreferenciados, com foco em setores como imobiliário, industrial e patrimonial. Permite criar experiências interativas, pontos panorâmicos e navegação inteligente entre ambientes, com interface adaptável para edição e visualização.

---


## 🛠️ Stacks Utilizadas

<p>
    <img src="https://img.shields.io/badge/Next.js-16-blue?logo=next.js"/>
    <img src="https://img.shields.io/badge/Three.js-3D-black?logo=three.js"/>
    <img src="https://img.shields.io/badge/React-19-blue?logo=react"/>
    <img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel"/>
    <img src="https://img.shields.io/badge/IndexedDB-Local%20Storage-yellow"/>
</p>

---



## 👤 Guia do Usuário

### Hotspots e Endpoints

**Hotspots** são pontos interativos sobre o modelo 3D, podendo abrir panoramas 360º, exibir informações ou fotos. **Endpoints** são posições salvas para navegação rápida, facilitando a movimentação entre ambientes ou setores do modelo.

### Como usar
1. Faça upload do modelo 3D (`.glb`).
2. Clique no modelo para adicionar Hotspot ou Endpoint.
3. Edite propriedades (nome, posição, imagem, orientação).
4. Salve no projeto.
5. Navegue entre endpoints e acesse hotspots pelas abas:
    - **Modelos**: Troca de modelos 3D
    - **Endpoints**: Navegação rápida

        - **Hotspots**: Gerenciamento dos pontos

---

## 🎛️ Ajustando velocidades e câmeras

### Ajuste de velocidade de navegação e câmera

Os principais parâmetros de velocidade e suavidade da navegação 3D podem ser ajustados diretamente no código, no componente `ModelViewer.jsx`, na configuração do `<OrbitControls />`:

- **dampingFactor**: Suavidade do movimento da câmera (padrão: 0.15)
- **rotateSpeed**: Velocidade de rotação da câmera (padrão: 1.2)
- **zoomSpeed**: Velocidade do zoom (padrão: 3.0)
- **panSpeed**: Velocidade do pan (arrastar lateral) (padrão: 1.5)
- **autoRotateSpeed**: Velocidade de rotação automática (padrão: 2)

Para alterar, edite os valores em:
```jsx
<OrbitControls
    ...
    dampingFactor={0.15}
    rotateSpeed={1.2}
    zoomSpeed={3.0}
    panSpeed={1.5}
    autoRotateSpeed={2}
    ...
/>
```

### Como ajustar e salvar posições de câmeras (endpoints)

- Para criar um endpoint/câmera, clique no modelo 3D e selecione a opção de adicionar endpoint.
- Para editar a posição de uma câmera, navegue até a posição desejada e utilize a função de captura de visão atual (ícone de edição ✏️ na lista de endpoints).
- As posições são salvas automaticamente no arquivo `project_config.json` ao clicar em "Salvar no Projeto".

### Dicas rápidas

- O enquadramento automático da câmera é feito ao carregar um modelo novo.
- Para navegação rápida, utilize a aba "Endpoints" e clique no nome da câmera desejada.
- Os parâmetros de velocidade podem ser ajustados para personalizar a experiência conforme o tipo de modelo ou preferência do usuário.

---


## 👨‍💻 Guia do Desenvolvedor

### Instalação e Execução
```bash
git clone https://github.com/seu-usuario/vistametric.git
cd vistametric
npm install
npm run dev
```
### Build de Produção
```bash
npm run build
# O build estará otimizado e em modo visualizador
```
### Estrutura
- `/app/components/`: Componentes visuais e 3D
- `/app/hooks/`: Lógica de navegação e storage
- `/app/api/`: Endpoints backend
- `/public/assets/models/`: Modelos 3D
- `/public/assets/hotspots/`: Panoramas 360º
- `/public/data/project_config.json`: Configurações persistidas

---


## ⚙️ Como Funciona

O Vistametric opera em dois modos:
- **Desenvolvedor**: Upload, criação e edição de pontos, persistência local.
- **Visualizador**: Interface limpa, apenas navegação e visualização.
Toda configuração é salva em `project_config.json` e os arquivos são armazenados em pastas públicas.



