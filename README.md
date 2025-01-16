```markdown:README.md
# MASA - Multi Account Search Apps

Uma ferramenta desktop desenvolvida para facilitar a busca de apps em múltiplas accounts VTEX simultaneamente.

## 🛠️ Tecnologias

- **Frontend**:
  - React
  - TypeScript
  - Styled Components
  - Vite

- **Backend**:
  - Tauri (Rust)
  - VTEX CLI

## ⚙️ Pré-requisitos

- Node.js (v14+)
- Rust (última versão estável)
- VTEX CLI instalado globalmente
- Git

## 🚀 Começando

1. **Clone o repositório**
```bash
git clone [git@github.com:gbrsilva/masa.git]
cd vtex-app-finder
```

2. **Instale as dependências**
```bash
yarn install
```

3. **Desenvolvimento**
```bash
yarn tauri:dev
```

4. **Build**
```bash
yarn tauri:build
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/
│   │   ├── MultiAccountSearch.tsx    # Componente de busca principal
│   │   └── styles.ts                 # Estilos compartilhados
│   ├── hooks/
│   │   └── useAutoScroll.ts         # Hook para auto-scroll do terminal
│   ├── App.tsx                      # Componente raiz
│   └── main.tsx                     # Entry point
│
└── src-tauri/
    └── src/
        └── main.rs                  # Lógica Rust para execução de comandos
```

## 💡 Funcionalidades

### Busca em Múltiplas Accounts
- Busca simultânea de apps em várias accounts VTEX
- Identifica se o app está na Edition ou instalado
- Exibe versão do app encontrado
- Interface intuitiva para inserção de múltiplas accounts

### Terminal Integrado
- Output em tempo real dos comandos VTEX
- Terminal com tema dark para melhor legibilidade
- Auto-scroll para novas mensagens
- Área redimensionável

## 🔧 Desenvolvimento

### Componentes Principais

#### MultiAccountSearch
```typescript
interface AppResult {
  name: string;
  version: string;
  account: string;
  status: 'edition' | 'installed' | 'not found';
}
```

O componente gerencia:
- Estado da busca
- Processamento de múltiplas accounts
- Exibição de resultados
- Tratamento de erros

#### Terminal Output
- Captura e exibe output do VTEX CLI
- Formatação de mensagens de erro
- Separadores visuais entre comandos

### Estilização
Utilizamos Styled Components com:
- Sistema de temas consistente
- Componentes reutilizáveis
- Suporte a dark mode no terminal
- Estilos responsivos

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
```bash
git checkout -b feature/MinhaFeature
```
3. Commit suas mudanças
```bash
git commit -m 'Adiciona nova feature'
```
4. Push para a branch
```bash
git push origin feature/MinhaFeature
```
5. Abra um Pull Request

## 📝 Scripts Disponíveis

- `yarn dev`: Inicia o ambiente de desenvolvimento Vite
- `yarn build`: Build do frontend
- `yarn tauri:dev`: Inicia a aplicação em modo desenvolvimento
- `yarn tauri:build`: Gera o executável da aplicação

## ⚠️ Notas Importantes

- Certifique-se de estar logado no VTEX CLI antes de usar a aplicação
- A aplicação depende do VTEX CLI instalado globalmente
- O tempo de busca pode variar dependendo do número de accounts

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
```
