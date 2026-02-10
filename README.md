# 🌐 Vistametric v2.0

O **Vistametric** é um ecossistema profissional de visualização e mapeamento 3D imersivo. Projetado para setores como imobiliário, industrial e patrimonial, o sistema permite transformar modelos 3D georreferenciados em experiências interativas de alta precisão, conectando o mundo 3D a visões panorâmicas de 360º.

> [!IMPORTANT]
> **Nota de Experimento**: Este projeto foi desenvolvido **100% por Inteligência Artificial** através do **Antigravity (Google DeepMind)**. O objetivo deste desenvolvimento foi testar a capacidade, precisão e velocidade extrema na criação de um **MVP (Minimum Viable Product)** complexo em regime *no-code* assistido.

---

## 🛠️ Modos de Operação

O Vistametric é inteligente e adapta sua interface automaticamente baseada no ambiente de execução:

### 🛠️ Modo Desenvolvedor (Local)
Para quem gerencia o projeto e preenche os dados:
- **Upload de Modelos**: Importe novos arquivos `.glb` que são salvos fisicamente no servidor.
- **Criação de Pontos**: Clique em qualquer lugar do modelo para criar hotspots ou câmeras.
- **Editor Completo**: Ajuste nomes, escalas métricas reais e vincule fotos 360º.
- **Persistência Física**: Botão "Salvar no Projeto" que grava as alterações diretamente no arquivo `project_config.json`.

### 🌐 Modo Visualizador (Produção)
Focado no usuário final e segurança:
- **Interface Limpa**: Aba de edição e botões de upload/salvamento ficam ocultos.
- **Apenas Visualização**: Navegação fluida entre os pontos de interesse pré-configurados.
- **Segurança**: Bloqueio total de modificações, garantindo a integridade dos dados publicados.

---

## 🚀 Principais Funcionalidades

- **Auto-Fit Inteligente**: Enquadramento automático da câmera baseado no tamanho real do modelo (de casas a bairros inteiros).
- **Navegação de Larga Escala**: Suporte a *Screen Space Panning* para explorar grandes áreas urbanas sem perder o centro.
- **Hotspots 360º**: Pontos de interesse que abrem visualizadores panorâmicos imersivos com suporte a cache local (IndexedDB).
- **Métricas Reais**: Sistema de escala métrica que permite estimar o tamanho real de edifícios e terrenos em metros.
- **Arquitetura Modular**: Backend robusto em Next.js e frontend desacoplado com hooks customizados (`useProjectStorage`, `useModelNavigation`).

---

## 🛠️ Stack Tecnológica

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Engine 3D**: [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Utilidades 3D**: [@react-three/drei](https://github.com/pmndrs/drei) (OrbitControls, Environment, useProgress)
- **Banco de Dados Local**: IndexedDB para armazenamento de imagens pesadas (evitando limites do navegador).
- **Backend**: Node.js API Routes para persistência física de arquivos e configurações JSON.

---

## 📦 Guia de Instalação

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-usuario/vistametric.git
    cd vistametric
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Inicie o ambiente de edição**:
    ```bash
    npm run dev
    ```

4.  **Publique para o mundo**:
    ```bash
    npm run build
    # O build gerado estará otimizado e em "Modo Visualizador"
    ```

---

## 🏗️ Estrutura de Pastas

- `/app/components/`: Componentes visuais e orquestração 3D.
- `/app/hooks/`: Lógica de negócio e navegação desacoplada.
- `/app/api/`: Endpoints de backend para gestão de arquivos e JSON.
- `/public/assets/models/`: Repositório físico dos modelos 3D (`.glb`).
- `/public/assets/hotspots/`: Armazenamento de fotos panorâmicas enviadas.
- `/public/data/project_config.json`: O "Coração" do projeto onde todos os pontos e configurações são persistidos.

---

## 📄 Licença e Uso

Este projeto é disponibilizado para fins de visualização patrimonial e industrial. Todas as imagens e modelos são processados localmente ou via servidor autorizado.

**Desenvolvido por Solluty Mapping & Engineering.**
