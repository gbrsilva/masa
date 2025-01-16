import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'
import { 
  Button, 
  AppOutputContainer, 
  Input, 
  FormGroup,
  SearchContainer,
  TextArea 
} from './styles'

interface AppResult {
  name: string;
  version: string;
  account: string;
  status: 'edition' | 'installed' | 'not found';
}

export function MultiAccountSearch() {
  const [appName, setAppName] = useState('')
  const [accounts, setAccounts] = useState('')
  const [results, setResults] = useState<AppResult[]>([])
  const [searching, setSearching] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [error, setError] = useState('')

  const searchInAccount = async (account: string): Promise<AppResult | null> => {
    let result: AppResult | null = null
    let inEditionSection = false
    
    try {
      // Switch para a account
      await invoke('execute_vtex_command', {
        command: 'switch',
        args: account,
        window: (window as any).__TAURI__.window
      })

      // Aguarda o switch completar
      await new Promise(resolve => setTimeout(resolve, 2000))

      return new Promise((resolve) => {
        let unlistenFn: (() => void) | null = null;
        
        const setupListener = async () => {
          const unlisten = await listen('terminal-output', (event: any) => {
            const line = event.payload as string
            
            // Identifica as seções
            if (line.includes('Edition Apps')) {
              inEditionSection = true
              return
            }
            if (line.includes('Installed Apps')) {
              inEditionSection = false
              return
            }
            
            // Busca exata pelo nome do app
            const appNameWithoutVersion = appName.split('@')[0]
            if (line.startsWith(appNameWithoutVersion)) {
              const parts = line.split(/\s+/)
              if (parts.length >= 2) {
                result = {
                  name: parts[0],
                  version: parts[1],
                  account,
                  status: inEditionSection ? 'edition' : 'installed'
                }
                if (unlistenFn) unlistenFn()
                resolve(result)
              }
            }
          })
          
          unlistenFn = unlisten

          // Executa o comando ls
          await invoke('execute_vtex_command', {
            command: 'ls',
            args: '',
            window: (window as any).__TAURI__.window
          })

          // Se não encontrar em 5 segundos, resolve com null
          setTimeout(() => {
            if (unlistenFn) unlistenFn()
            resolve(null)
          }, 5000)
        }

        setupListener()
      })

    } catch (error) {
      console.error(`Erro na account ${account}:`, error)
      return null
    }
  }

  const searchInAllAccounts = async () => {
    if (!appName.trim() || !accounts.trim()) return
    
    setSearching(true)
    setResults([])
    setError('')

    const accountList = accounts
      .split('\n')
      .map(acc => acc.trim())
      .filter(acc => acc)

    try {
      // Executa as buscas sequencialmente
      for (const account of accountList) {
        setCurrentAccount(account)
        const result = await searchInAccount(account)
        if (result) {
          setResults(prev => [...prev, result])
        }
        // Aguarda um pouco entre as buscas
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

    } catch (error) {
      setError(`Erro ao buscar: ${error}`)
    } finally {
      setSearching(false)
      setCurrentAccount('')
    }
  }

  return (
    <SearchContainer>
      <h2>Buscar App em Múltiplas Accounts</h2>
      <Input>
        <label>Nome do App</label>
        <input
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder="Ex: vtex.store"
        />
      </Input>

      <FormGroup>
        <label>Accounts (uma por linha)</label>
        <TextArea
          value={accounts}
          onChange={(e) => setAccounts(e.target.value)}
          placeholder="minha-loja1&#10;minha-loja2&#10;minha-loja3"
        />
      </FormGroup>

      <div style={{ marginTop: '1rem' }}>
        <Button
          variation="primary"
          onClick={searchInAllAccounts}
          disabled={!appName.trim() || !accounts.trim() || searching}
        >
          {searching ? `Buscando... (${currentAccount})` : 'Buscar'}
        </Button>
      </div>

      {results.length > 0 && (
        <AppOutputContainer>
          <h3>Apps Encontrados:</h3>
          <pre>
            {results.map((result, index) => (
              `${index + 1}. Account: ${result.account}\n   App: ${result.name}\n   Versão: ${result.version}\n   Status: ${result.status === 'edition' ? 'Na Edition' : 'Instalado'}\n\n`
            ))}
          </pre>
        </AppOutputContainer>
      )}

      {error && (
        <AppOutputContainer>
          <pre style={{ color: 'red' }}>{error}</pre>
        </AppOutputContainer>
      )}
    </SearchContainer>
  )
} 