import styled from 'styled-components'

export const theme = {
  colors: {
    primary: '#134CD8',
    secondary: '#EEF3FF',
    muted: '#979899',
    background: '#F8F7FC',
    text: '#142032',
    dark: {
      background: '#1E1E1E',
      text: '#E1E1E1',
      border: '#333333'
    }
  },
  fonts: {
    default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
  }
}

export const Button = styled.button<{ variation?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.variation === 'primary' && `
    background: ${theme.colors.primary};
    color: white;
    &:hover {
      background: ${theme.colors.primary}dd;
    }
    &:disabled {
      background: ${theme.colors.muted};
      cursor: not-allowed;
    }
  `}
`

export const Input = styled.div`
  display: flex;
  flex-direction: column;
  width: 87.5%;
  label {
    font-size: 14px;
    color: ${theme.colors.text};
    font-weight: 600;
    font-family: ${theme.fonts.default};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  input {
    padding: 0.75rem;
    border: 1px solid #E7E9EE;
    border-radius: 4px;
    font-size: 14px;
    font-family: ${theme.fonts.default};
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }
  }
`

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  font-family: ${theme.fonts.default};
`

export const OutputArea = styled.div`
  width: 40%;
  min-height: 200px;
`

export const OutputContainer = styled.div.attrs({ role: 'log' })<{ variant?: 'dark' }>`
  width: 100%;
  max-height: 80vh;
  overflow: auto;
  font-family: ${theme.fonts.default};
  position: relative;
  resize: both;
  min-height: 200px;
  box-sizing: border-box;

  &::-webkit-resizer {
    border-width: 8px;
    border-style: solid;
    border-color: transparent ${props => props.variant === 'dark' ? theme.colors.dark.border : '#E7E9EE'} 
      ${props => props.variant === 'dark' ? theme.colors.dark.border : '#E7E9EE'} transparent;
    background: transparent;
  }

  ${props => props.variant === 'dark' ? `
    background: ${theme.colors.dark.background};
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid ${theme.colors.dark.border};
    
    h3 {
      color: ${theme.colors.dark.text};
      margin-bottom: 1rem;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    pre {
      background: transparent;
      padding: 1rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
      overflow-x: auto;
      color: ${theme.colors.dark.text};
      line-height: 1.5;
      min-height: 200px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      margin: 0;

      &:empty::before {
        content: 'Aguardando execução de comandos...';
        color: ${theme.colors.dark.text}88;
        font-style: italic;
      }
    }
  ` : `
    h3 {
      color: ${theme.colors.text};
      margin-bottom: 1rem;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    pre {
      background: ${theme.colors.background};
      padding: 1rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
      overflow-x: auto;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      margin: 0;
    }
  `}

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.variant === 'dark' ? theme.colors.dark.background : theme.colors.background};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.variant === 'dark' ? theme.colors.dark.border : '#E7E9EE'};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.variant === 'dark' ? '#444444' : '#D7D9DE'};
    }
  }
`

export const AppOutputContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  background: ${theme.colors.background};
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #E7E9EE;
  display: flex;
  flex-direction: column;
  font-family: ${theme.fonts.default};
  box-sizing: border-box;

  h3 {
    color: ${theme.colors.text};
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  pre {
    background: white;
    padding: 1rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 14px;
    overflow: auto;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid #E7E9EE;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.background};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #E7E9EE;
    border-radius: 4px;
    
    &:hover {
      background: #D7D9DE;
    }
  }
`

export const FormGroup = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;

  label {
    font-size: 14px;
    color: ${theme.colors.text};
    font-weight: 600;
    font-family: ${theme.fonts.default};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }
`

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100vh;
`

export const SearchContainer = styled.div`
  padding: 2rem;
  width: 100%;
  background: white;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

export const TextArea = styled.textarea`
  width: 80%;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid #E7E9EE;
  border-radius: 4px;
  resize: vertical;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.4;
  
  &:focus {
    outline: none;
    border-color: #134CD8;
  }
` 