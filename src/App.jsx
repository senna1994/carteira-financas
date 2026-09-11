import { useMemo, useState } from 'react'
import './App.css'

const categories = [
  'Alimentação',
  'Moradia',
  'Transporte',
  'Lazer',
  'Saúde',
  'Salário',
  'Investimento',
  'Outros',
]

const initialTransactions = [
  { id: 1, type: 'Entrada', value: 5500, category: 'Salário', description: 'Salário mensal', date: '2026-09-01' },
  { id: 2, type: 'Saída', value: 780, category: 'Alimentação', description: 'Supermercado', date: '2026-09-03' },
  { id: 3, type: 'Saída', value: 1280, category: 'Moradia', description: 'Aluguel', date: '2026-09-05' },
  { id: 4, type: 'Saída', value: 340, category: 'Transporte', description: 'Combustível', date: '2026-09-07' },
  { id: 5, type: 'Saída', value: 520, category: 'Lazer', description: 'Cinema e jantar', date: '2026-09-09' },
  { id: 6, type: 'Entrada', value: 1200, category: 'Investimento', description: 'Rendimento de carteira', date: '2026-09-10' },
]

const assetsByType = {
  acoes: [
    {
      ticker: 'VALE3',
      name: 'Vale',
      risk: 'Alto',
      return: '+14,5% a.a.',
      reason: 'Expõe a commodities e dividendos resilientes em um cenário de crescimento internacional.',
    },
    {
      ticker: 'ITUB4',
      name: 'Itaú',
      risk: 'Médio',
      return: '+11,8% a.a.',
      reason: 'Banco com forte capacidade de geração de lucro e boa distribuição de valor para acionistas.',
    },
    {
      ticker: 'PETR4',
      name: 'Petrobras',
      risk: 'Alto',
      return: '+16,2% a.a.',
      reason: 'Beneficia-se de ciclos de preços de petróleo e da eficiência operacional do setor.',
    },
  ],
  etfs: [
    {
      ticker: 'IVVB11',
      name: 'iShares S&P 500',
      risk: 'Médio',
      return: '+12,6% a.a.',
      reason: 'Diversificação internacional e baixa volatilidade relativa para quem busca crescimento estável.',
    },
    {
      ticker: 'BOVA11',
      name: 'BOVA',
      risk: 'Médio',
      return: '+12,1% a.a.',
      reason: 'Excelente opção de exposição ao mercado brasileiro com baixa alocação operacional.',
    },
    {
      ticker: 'SMAL11',
      name: 'Small Caps',
      risk: 'Alto',
      return: '+15,4% a.a.',
      reason: 'Indicador de empresas menores com maior potencial de crescimento em ciclos expansivos.',
    },
  ],
  fiis: [
    {
      ticker: 'HGLG11',
      name: 'HGLG11',
      risk: 'Baixo',
      return: '+9,8% a.a.',
      reason: 'Fundos com imóveis e aluguel estável, ideais para renda recorrente e proteção patrimonial.',
    },
    {
      ticker: 'XPML11',
      name: 'XPML11',
      risk: 'Baixo',
      return: '+10,4% a.a.',
      reason: 'Carteira de imóveis diversificada com foco em renda e liquidez moderada.',
    },
    {
      ticker: 'VISC11',
      name: 'VISC11',
      risk: 'Médio',
      return: '+11,1% a.a.',
      reason: 'Combina imóveis de qualidade e bons indicadores de ocupação, com potencial de valorização.',
    },
  ],
  rendaFixa: [
    {
      ticker: 'Tesouro Selic',
      name: 'Tesouro Selic',
      risk: 'Baixo',
      return: '+13,5% a.a.',
      reason: 'Excelente para reserva de emergência, liquidez e proteção de capital em cenários voláteis.',
    },
    {
      ticker: 'CDB',
      name: 'CDB',
      risk: 'Baixo',
      return: '+12,1% a.a.',
      reason: 'Alternativa acessível com rentabilidade previsível e boas opções de liquidez.',
    },
    {
      ticker: 'LCI/LCA',
      name: 'LCI/LCA',
      risk: 'Baixo',
      return: '+11,8% a.a.',
      reason: 'Permitem renda mais estável e baixa volatilidade para objetivos de médio prazo.',
    },
  ],
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)

function App() {
  const [page, setPage] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [transactionForm, setTransactionForm] = useState({
    type: 'Saída',
    value: '',
    category: 'Alimentação',
    description: '',
    date: '2026-09-11',
  })
  const [filters, setFilters] = useState({ month: 'Todos', category: 'Todos' })
  const [selectedAssetType, setSelectedAssetType] = useState('acoes')
  const [simulationForm, setSimulationForm] = useState({
    initial: '5000',
    monthly: '800',
    years: '5',
    rate: '11',
  })
  const [simulationResult, setSimulationResult] = useState(null)

  const summary = useMemo(() => {
    const entradas = transactions
      .filter((item) => item.type === 'Entrada')
      .reduce((sum, item) => sum + Number(item.value), 0)
    const saidas = transactions
      .filter((item) => item.type === 'Saída')
      .reduce((sum, item) => sum + Number(item.value), 0)

    return {
      total: entradas - saidas,
      entradas,
      saidas,
    }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const itemMonth = new Date(item.date).toLocaleString('pt-BR', { month: 'long' })
      const matchMonth = filters.month === 'Todos' || itemMonth === filters.month
      const matchCategory = filters.category === 'Todos' || item.category === filters.category
      return matchMonth && matchCategory
    })
  }, [transactions, filters])

  const expenseBreakdown = useMemo(() => {
    const entries = transactions
      .filter((item) => item.type === 'Saída')
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.value)
        return acc
      }, {})

    const total = Object.values(entries).reduce((sum, value) => sum + value, 0)

    return Object.entries(entries)
      .map(([category, value]) => ({
        category,
        value,
        percent: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const donutBackground = useMemo(() => {
    const palette = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#14b8a6', '#ef4444', '#f97316', '#64748b']
    let start = 0
    const breakdown = expenseBreakdown

    if (!breakdown.length) {
      return 'conic-gradient(#1f2937 0 100%)'
    }

    const gradient = breakdown
      .map((item, index) => {
        const segment = (item.percent / 100) * 360
        const color = palette[index % palette.length]
        const end = start + segment
        const chunk = `${color} ${start}deg ${end}deg`
        start = end
        return chunk
      })
      .join(', ')

    return `conic-gradient(${gradient})`
  }, [expenseBreakdown])

  const insights = useMemo(() => {
    if (!expenseBreakdown.length) return []

    return expenseBreakdown.slice(0, 3).map((item, index) => {
      const recommendation = index === 0
        ? `Seus gastos com ${item.category} somam ${item.percent.toFixed(0)}% das saídas. Reduzir em ${formatCurrency(item.value * 0.2)} por mês pode acelerar suas metas de reserva.`
        : item.percent > 18
          ? `A categoria ${item.category} está acima da média. Revisar esse gasto pode desbloquear mais espaço para investimentos.`
          : `Manter ${item.category} controlado é um bom próximo passo para liberar fluxo mensal.`

      return recommendation
    })
  }, [expenseBreakdown])

  const handleTransactionSubmit = (event) => {
    event.preventDefault()

    const value = Number(transactionForm.value)
    const description = transactionForm.description.trim()

    if (!description || !value || value <= 0) return

    const newTransaction = {
      id: Date.now(),
      type: transactionForm.type,
      value,
      category: transactionForm.category,
      description,
      date: transactionForm.date,
    }

    setTransactions((prev) => [newTransaction, ...prev])
    setTransactionForm({
      type: 'Saída',
      value: '',
      category: 'Alimentação',
      description: '',
      date: new Date().toISOString().slice(0, 10),
    })
  }

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSimulation = (event) => {
    event.preventDefault()

    const initial = Number(simulationForm.initial) || 0
    const monthly = Number(simulationForm.monthly) || 0
    const years = Number(simulationForm.years) || 0
    const annualRate = Number(simulationForm.rate) || 0
    const months = years * 12
    const monthlyRate = annualRate / 100 / 12

    let futureValue = initial

    if (months > 0 && monthlyRate !== 0) {
      futureValue = initial * (1 + monthlyRate) ** months
      futureValue += monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate)
    } else {
      futureValue = initial + monthly * months
    }

    const totalInvested = initial + monthly * months
    const gain = futureValue - totalInvested

    setSimulationResult({ futureValue, totalInvested, gain, annualRate, months })
  }

  const suggestion = useMemo(() => {
    if (!simulationResult) {
      return 'Defina um cenário para receber uma recomendação personalizada.'
    }

    if (simulationResult.months <= 12) {
      return 'Para metas curtas, prefira renda fixa e Tesouro Selic para preservar o capital.'
    }

    if (simulationResult.annualRate >= 14) {
      return 'Seu cenário de longo prazo favorece uma mistura de ETFs e ações com disciplina de aporte.'
    }

    return 'Com prazo moderado, uma estratégia de FIIs + ETFs tende a equilibrar segurança e crescimento.'
  }, [simulationResult])

  const monthOptions = ['Todos', ...new Set(transactions.map((item) => new Date(item.date).toLocaleString('pt-BR', { month: 'long' }))) ]

  const renderLoginPage = () => (
    <div className="login-page">
      <div className="login-backdrop" aria-hidden="true" />
      <div className="login-card glass-card">
        <div className="brand-block">
          <div className="brand-mark">C</div>
          <div>
            <p className="eyebrow">Carteira Inteligente</p>
            <h1>CapitalFlow</h1>
          </div>
        </div>

        <form className="auth-form">
          <label className="field-label">
            <span>E-mail ou usuário</span>
            <input type="text" defaultValue="ana.silva@capitalflow.com" />
          </label>

          <label className="field-label">
            <span>Senha</span>
            <div className="password-wrap">
              <input type={showPassword ? 'text' : 'password'} defaultValue="123456" />
              <button type="button" className="icon-button" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </label>

          <button type="button" className="link-button">Esqueci minha senha</button>

          <button type="button" className="primary-button large" onClick={() => setPage('dashboard')}>
            Entrar
          </button>

          <div className="divider"><span>ou continue com</span></div>

          <div className="social-row">
            <button type="button" className="social-button">Google</button>
            <button type="button" className="social-button">Apple</button>
          </div>

          <p className="signup-copy">
            Não tem conta? <button type="button" className="inline-link">Criar uma conta</button>
          </p>
        </form>
      </div>
    </div>
  )

  const renderDashboardPage = () => (
    <div className="app-page dashboard-page">
      <header className="topbar">
        <div className="brand-inline">
          <div className="brand-mark small">C</div>
          <div>
            <p className="eyebrow">Painel</p>
            <h2>CapitalFlow</h2>
          </div>
        </div>

        <div className="topbar-actions">
          <button type="button" className="ghost-button" onClick={() => setPage('login')}>Sair</button>
          <button type="button" className="primary-button" onClick={() => setPage('investments')}>
            Ir para Recomendações & Calculadora
          </button>
        </div>
      </header>

      <section className="summary-grid">
        <article className="stat-card primary">
          <span>Saldo Total</span>
          <strong>{formatCurrency(summary.total)}</strong>
          <small>+8,4% vs. mês anterior</small>
        </article>
        <article className="stat-card accent">
          <span>Total de Entradas</span>
          <strong>{formatCurrency(summary.entradas)}</strong>
          <small>Renda mensal ativa</small>
        </article>
        <article className="stat-card danger">
          <span>Total de Saídas</span>
          <strong>{formatCurrency(summary.saidas)}</strong>
          <small>Contas e consumo</small>
        </article>
      </section>

      <section className="content-grid dashboard-grid">
        <div className="panel form-panel">
          <div className="section-header">
            <h3>Adicionar movimentação</h3>
          </div>

          <form className="transaction-form" onSubmit={handleTransactionSubmit}>
            <div className="two-column">
              <label className="field-label inline-field">
                <span>Tipo</span>
                <select value={transactionForm.type} onChange={(event) => setTransactionForm((prev) => ({ ...prev, type: event.target.value }))}>
                  <option value="Entrada">Entrada</option>
                  <option value="Saída">Saída</option>
                </select>
              </label>

              <label className="field-label inline-field">
                <span>Valor (R$)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={transactionForm.value}
                  onChange={(event) => setTransactionForm((prev) => ({ ...prev, value: event.target.value }))}
                  placeholder="0,00"
                />
              </label>
            </div>

            <div className="two-column">
              <label className="field-label inline-field">
                <span>Categoria</span>
                <select value={transactionForm.category} onChange={(event) => setTransactionForm((prev) => ({ ...prev, category: event.target.value }))}>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="field-label inline-field">
                <span>Data</span>
                <input
                  type="date"
                  value={transactionForm.date}
                  onChange={(event) => setTransactionForm((prev) => ({ ...prev, date: event.target.value }))}
                />
              </label>
            </div>

            <label className="field-label">
              <span>Descrição</span>
              <input
                type="text"
                value={transactionForm.description}
                onChange={(event) => setTransactionForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Ex.: Treino premium, salário, conta de luz"
              />
            </label>

            <button type="submit" className="primary-button full-width">Salvar movimentação</button>
          </form>
        </div>

        <div className="panel table-panel">
          <div className="section-header row-between">
            <h3>Histórico</h3>
            <div className="filter-row">
              <select value={filters.month} onChange={(event) => setFilters((prev) => ({ ...prev, month: event.target.value }))}>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select value={filters.category} onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}>
                <option value="Todos">Todos</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="transaction-list">
            {filteredTransactions.length ? (
              filteredTransactions.map((item) => (
                <div key={item.id} className="transaction-item">
                  <div>
                    <strong>{item.description}</strong>
                    <p>
                      {item.category} • {new Date(item.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="transaction-meta">
                    <span className={item.type === 'Entrada' ? 'income' : 'expense'}>
                      {item.type === 'Entrada' ? '+' : '-'} {formatCurrency(item.value)}
                    </span>
                    <button type="button" className="delete-button" onClick={() => handleDeleteTransaction(item.id)}>Excluir</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Nenhuma movimentação encontrada para este filtro.</div>
            )}
          </div>
        </div>
      </section>

      <section className="insights-grid">
        <div className="panel chart-panel">
          <div className="section-header">
            <h3>Distribuição por categoria</h3>
          </div>

          <div className="chart-layout">
            <div className="donut-chart" style={{ background: donutBackground }}>
              <div className="donut-center">
                <strong>{expenseBreakdown.length ? `${expenseBreakdown[0].percent.toFixed(0)}%` : '0%'}</strong>
              </div>
            </div>

            <div className="legend-list">
              {expenseBreakdown.length ? (
                expenseBreakdown.map((item, index) => (
                  <div key={item.category} className="legend-item">
                    <span className="legend-dot" style={{ background: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#14b8a6', '#ef4444', '#f97316', '#64748b'][index % 8] }} />
                    <div>
                      <strong>{item.category}</strong>
                      <small>{item.percent.toFixed(0)}% • {formatCurrency(item.value)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p>Não há saídas registradas ainda.</p>
              )}
            </div>
          </div>
        </div>

        <div className="panel insight-panel">
          <div className="section-header">
            <h3>Insights de economia</h3>
          </div>

          <div className="insight-list">
            {insights.length ? (
              insights.map((tip) => <div key={tip} className="insight-item">{tip}</div>)
            ) : (
              <div className="empty-state">Cadastre algumas saídas para receber sugestões inteligentes.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  )

  const renderInvestmentsPage = () => (
    <div className="app-page investment-page">
      <header className="topbar">
        <div className="brand-inline">
          <div className="brand-mark small">C</div>
          <div>
            <p className="eyebrow">Investimentos</p>
            <h2>Carteira & projeções</h2>
          </div>
        </div>

        <div className="topbar-actions">
          <button type="button" className="ghost-button" onClick={() => setPage('dashboard')}>Voltar ao dashboard</button>
          <button type="button" className="primary-button" onClick={() => setPage('login')}>Fazer login</button>
        </div>
      </header>

      <section className="panel recommendations-panel">
        <div className="section-header row-between">
          <h3>Recomendações do mercado</h3>
          <div className="tab-list">
            {Object.keys(assetsByType).map((key) => (
              <button
                key={key}
                type="button"
                className={selectedAssetType === key ? 'tab active' : 'tab'}
                onClick={() => setSelectedAssetType(key)}
              >
                {key === 'acoes' ? 'Ações' : key === 'etfs' ? 'ETFs' : key === 'fiis' ? 'FIIs' : 'Renda Fixa'}
              </button>
            ))}
          </div>
        </div>

        <div className="asset-grid">
          {assetsByType[selectedAssetType].map((asset) => (
            <article key={asset.ticker} className="asset-card">
              <div className="asset-head">
                <div>
                  <p className="asset-name">{asset.name}</p>
                  <span className="ticker">{asset.ticker}</span>
                </div>
                <span className={`risk-badge ${asset.risk.toLowerCase().replace(' ', '-')}`}>{asset.risk}</span>
              </div>

              <strong className="asset-return">{asset.return}</strong>
              <p>{asset.reason}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="projection-grid">
        <div className="panel simulator-panel">
          <div className="section-header">
            <h3>Calculadora de metas e retorno</h3>
          </div>

          <form className="simulator-form" onSubmit={handleSimulation}>
            <div className="two-column">
              <label className="field-label inline-field">
                <span>Aporte inicial</span>
                <input type="number" value={simulationForm.initial} onChange={(event) => setSimulationForm((prev) => ({ ...prev, initial: event.target.value }))} />
              </label>

              <label className="field-label inline-field">
                <span>Aporte mensal</span>
                <input type="number" value={simulationForm.monthly} onChange={(event) => setSimulationForm((prev) => ({ ...prev, monthly: event.target.value }))} />
              </label>
            </div>

            <div className="two-column">
              <label className="field-label inline-field">
                <span>Tempo em anos</span>
                <input type="number" value={simulationForm.years} onChange={(event) => setSimulationForm((prev) => ({ ...prev, years: event.target.value }))} />
              </label>

              <label className="field-label inline-field">
                <span>Retorno anual (%)</span>
                <input type="number" value={simulationForm.rate} onChange={(event) => setSimulationForm((prev) => ({ ...prev, rate: event.target.value }))} />
              </label>
            </div>

            <button type="submit" className="primary-button full-width">Simular / Encontrar melhor investimento</button>
          </form>
        </div>

        <div className="panel result-panel">
          <div className="section-header">
            <h3>Resultado da simulação</h3>
          </div>

          {simulationResult ? (
            <>
              <div className="result-values">
                <div>
                  <span>Patrimônio final</span>
                  <strong>{formatCurrency(simulationResult.futureValue)}</strong>
                </div>
                <div>
                  <span>Valor aportado</span>
                  <strong>{formatCurrency(simulationResult.totalInvested)}</strong>
                </div>
                <div>
                  <span>Rendimento</span>
                  <strong>{formatCurrency(simulationResult.gain)}</strong>
                </div>
              </div>

              <div className="growth-chart">
                <div className="growth-segment invested" style={{ width: `${Math.min((simulationResult.totalInvested / simulationResult.futureValue) * 100, 100)}%` }} />
                <div className="growth-segment gain" style={{ width: `${Math.min((simulationResult.gain / simulationResult.futureValue) * 100, 100)}%` }} />
              </div>

              <div className="legend-row">
                <span><i className="dot invested-dot" /> Aporte próprio</span>
                <span><i className="dot gain-dot" /> Juros</span>
              </div>

              <div className="suggestion-box">
                <strong>Sugestão personalizada</strong>
                <p>{suggestion}</p>
              </div>
            </>
          ) : (
            <div className="empty-state large">Preencha os dados da simulação para ver o crescimento do patrimônio.</div>
          )}
        </div>
      </section>
    </div>
  )

  return (
    <div className="app-shell">
      {page === 'login' && renderLoginPage()}
      {page === 'dashboard' && renderDashboardPage()}
      {page === 'investments' && renderInvestmentsPage()}
    </div>
  )
}

export default App
