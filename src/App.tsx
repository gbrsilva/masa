import { useState, useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { useAutoScroll } from './hooks/useAutoScroll'
import { MultiAccountSearch } from './components/MultiAccountSearch'
import {
  Container,
  OutputArea,
  OutputContainer,
  Wrapper
} from './components/styles'
import { invoke } from '@tauri-apps/api/tauri'

function App() {
  const [output, setOutput] = useState<string[]>([])
  const outputRef = useAutoScroll<HTMLDivElement>([output])

  useEffect(() => {
    const unlisten1 = listen('terminal-output', (event: any) => {
      setOutput(prev => [
        ...prev,
        event.payload as string
      ])
    })
    
    const unlisten2 = listen('terminal-error', (event: any) => {
      setOutput(prev => [
        ...prev,
        `\n${'-'.repeat(50)}\n`,
        `Erro: ${event.payload as string}`,
        `${'-'.repeat(50)}\n`
      ])
    })
    
    return () => {
      unlisten1.then(fn => fn())
      unlisten2.then(fn => fn())
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await invoke('execute_vtex_command', {
          command: '--version',
          args: '',
          window: window.__TAURI__.window
        });
        console.log('Command executed successfully:', result);
      } catch (error) {
        console.error('Error executing command:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Wrapper>
        <div>
          <MultiAccountSearch />
        </div>

        <OutputArea>
          <OutputContainer 
            variant="dark"
            ref={outputRef}
          >
            <h3>Saída do Comando:</h3>
            <pre>{output.length > 0 ? output.join('\n') : 'Aguardando execução de comandos...'}</pre>
          </OutputContainer>
        </OutputArea>
      </Wrapper>
     
    </Container>
  )
}

export default App
