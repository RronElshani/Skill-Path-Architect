import { useEffect, useState, useRef } from 'react'
import { fetchAllModels, promoteModel } from '../services/models.js'
import { API_URL } from '../config/api.js'

export default function AdminModelOverview() {
  const [models, setModels] = useState([])
  const [activeModel, setActiveModel] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Tab control
  const [activeTab, setActiveTab] = useState('history') // 'history' | 'comparison'

  // Training form state
  const [algorithm, setAlgorithm] = useState('XGBoost')
  const [learningRate, setLearningRate] = useState('0.1')
  const [maxDepth, setMaxDepth] = useState('5')
  const [nEstimators, setNEstimators] = useState('500')
  const [cValue, setCValue] = useState('1.0')
  const [hiddenLayerSizes, setHiddenLayerSizes] = useState('100,50')
  const [epochs, setEpochs] = useState('200')

  // Live Console & Training state
  const [isTraining, setIsTraining] = useState(false)
  const [consoleLogs, setConsoleLogs] = useState([])
  const terminalEndRef = useRef(null)
  const eventSourceRef = useRef(null)

  // Action states
  const [promotingId, setPromotingId] = useState(null)



  // Load models from server
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await fetchAllModels()
      setModels(data)
      const active = data.find((m) => m.isActive)
      setActiveModel(active || data[0] || null)
    } catch (err) {
      setError(err.message || 'Failed to load models')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [consoleLogs])

  const handlePromote = async (id) => {
    if (!window.confirm('Are you sure you want to promote this model to production? This will replace the active model instantly.')) {
      return
    }
    setPromotingId(id)
    try {
      await promoteModel(id)
      await loadData(true)
      window.alert('Model successfully promoted!')
    } catch (err) {
      window.alert(err.message || 'Failed to promote model')
    } finally {
      setPromotingId(null)
    }
  }

  const handleStartTraining = () => {
    if (isTraining) return

    if (!window.confirm(`Start training a new ${algorithm} model? This run will execute in the background.`)) {
      return
    }

    setIsTraining(true)
    setConsoleLogs([`[Console Initialized] Spawning training subprocess...\n`])

    const params = new URLSearchParams()
    params.append('algorithm', algorithm)

    const token = localStorage.getItem('accessToken')
    if (token) {
      params.append('token', token)
    }

    if (algorithm === 'XGBoost') {
      params.append('learningRate', learningRate)
      params.append('maxDepth', maxDepth)
      params.append('nEstimators', nEstimators)
    } else if (algorithm === 'Random Forest') {
      params.append('maxDepth', maxDepth)
      params.append('nEstimators', nEstimators)
    } else if (algorithm === 'Neural Network') {
      params.append('learningRate', learningRate)
      params.append('epochs', epochs)
      params.append('hiddenLayerSizes', hiddenLayerSizes)
    } else if (algorithm === 'SVM') {
      params.append('cValue', cValue)
    }

    const sseUrl = `${API_URL}/admin/models/train?${params.toString()}`
    const eventSource = new EventSource(sseUrl)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)

        if (payload.type === 'log') {
          setConsoleLogs((prev) => [...prev, payload.message])
        } else if (payload.type === 'error') {
          setConsoleLogs((prev) => [...prev, `\n🚨 ERROR: ${payload.message}\n`])
          setIsTraining(false)
          eventSource.close()
        } else if (payload.type === 'success') {
          setConsoleLogs((prev) => [
            ...prev,
            `\n✅ SUCCESS: Model training complete!\nRun ID: ${payload.data.runId}\nSaved metrics to DB.\n`
          ])
          setIsTraining(false)
          eventSource.close()
          loadData(true)
        }
      } catch (err) {
        setConsoleLogs((prev) => [...prev, `[Event Parse Error]: ${event.data}\n`])
      }
    }

    eventSource.onerror = () => {
      setConsoleLogs((prev) => [...prev, `\n🚨 Connection lost or training process interrupted.\n`])
      setIsTraining(false)
      eventSource.close()
    }
  }

  const formatHyperparams = (hparams) => {
    if (!hparams) return '{}'
    return Object.entries(hparams)
      .map(([key, val]) => `${key}: ${Array.isArray(val) ? `[${val.join(', ')}]` : val}`)
      .join(', ')
  }

  // Base algorithm models for the comparison tab (always show the 4 seed classifiers)
  const baseModels = models.filter((m) => m.runId?.startsWith('run_initial_'))

  // Trained session models (non-seed runs only) for training history
  const trainedModels = models.filter((m) => !m.runId?.startsWith('run_initial_'))

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
          Model Management Console
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">ML Training & Lifecycle Portal</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          Launch and evaluate career path predictors, configure hyperparameters, stream live terminal logs, compare models, and hot-reload updated versions into production.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Production Model Active</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">
              {activeModel ? `${activeModel.algorithm} Classifier` : 'Loading model details...'}
            </h2>
            <p className="mt-1 text-xs text-slate-400 font-mono">
              Run ID: {activeModel ? activeModel.runId : 'N/A'} • Seeding Date: {activeModel ? new Date(activeModel.createdAt).toLocaleString() : 'N/A'}
            </p>
            <p className="mt-2 text-xs font-medium text-slate-300">
              <span className="text-slate-500 font-bold">Hyperparams:</span>{' '}
              <span className="font-mono text-amber-300">{activeModel ? formatHyperparams(activeModel.hyperparameters) : 'N/A'}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <span className="text-xs text-slate-400">Test Accuracy</span>
            <div className="mt-1 text-2xl font-extrabold text-amber-400">
              {activeModel ? `${(activeModel.accuracy * 100).toFixed(2)}%` : '--'}
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: activeModel ? `${activeModel.accuracy * 100}%` : '0%' }}></div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <span className="text-xs text-slate-400">Precision</span>
            <div className="mt-1 text-2xl font-extrabold text-emerald-400">
              {activeModel ? `${(activeModel.precision * 100).toFixed(2)}%` : '--'}
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: activeModel ? `${activeModel.precision * 100}%` : '0%' }}></div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <span className="text-xs text-slate-400">Recall</span>
            <div className="mt-1 text-2xl font-extrabold text-cyan-400">
              {activeModel ? `${(activeModel.recall * 100).toFixed(2)}%` : '--'}
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: activeModel ? `${activeModel.recall * 100}%` : '0%' }}></div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <span className="text-xs text-slate-400">F1-Score</span>
            <div className="mt-1 text-2xl font-extrabold text-purple-400">
              {activeModel ? `${(activeModel.f1Score * 100).toFixed(2)}%` : '--'}
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: activeModel ? `${activeModel.f1Score * 100}%` : '0%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Algorithm Trainer
            </h3>
            <p className="mt-1 text-xs text-slate-400">Launch child process scripts with parameter configurations.</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400">Select Classifier</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {['XGBoost', 'Random Forest', 'Neural Network', 'SVM'].map((algo) => (
                    <button
                      key={algo}
                      type="button"
                      onClick={() => setAlgorithm(algo)}
                      disabled={isTraining}
                      className={`rounded-lg py-2 px-3 text-xs font-semibold border transition ${algorithm === algo
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 ring-1 ring-amber-500/20'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                      {algo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Hyperparameters</h4>

                {algorithm === 'XGBoost' && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-400">Learning Rate (Eta)</label>
                      <input
                        type="number"
                        min="0.01"
                        max="1"
                        step="0.01"
                        value={learningRate}
                        onChange={(e) => setLearningRate(e.target.value)}
                        disabled={isTraining}
                        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-500/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">Max Depth</label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={maxDepth}
                        onChange={(e) => setMaxDepth(e.target.value)}
                        disabled={isTraining}
                        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-500/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">N Estimators (Trees)</label>
                      <input
                        type="number"
                        min="10"
                        max="1500"
                        value={nEstimators}
                        onChange={(e) => setNEstimators(e.target.value)}
                        disabled={isTraining}
                        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-500/40 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {algorithm === 'Random Forest' && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-400">Max Depth</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={maxDepth}
                        onChange={(e) => setMaxDepth(e.target.value)}
                        disabled={isTraining}
                        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-500/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">N Estimators (Trees)</label>
                      <input
                        type="number"
                        min="10"
                        max="1000"
                        value={nEstimators}
                        onChange={(e) => setNEstimators(e.target.value)}
                        disabled={isTraining}
                        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-500/40 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {algorithm === 'Neural Network' && (
                  <>
                    <div>
                      <label className="block text-xs text-slate-400">Initial Learning Rate</label>
                      <input
                        type="number"
                        min="0.0001"
                        max="0.1"
                        step="0.0001"
                        value={learningRate}
                        onChange={(e) => setLearningRate(e.target.value)}
                        disabled={isTraining}
                        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-500/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">Hidden Layer Sizes (e.g. 100,50)</label>
                      <input
                        type="text"
                        value={hiddenLayerSizes}
                        onChange={(e) => setHiddenLayerSizes(e.target.value)}
                        disabled={isTraining}
                        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:border-amber-500/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400">Max Iterations (Epochs)</label>
                      <input
                        type="number"
                        min="10"
                        max="1000"
                        value={epochs}
                        onChange={(e) => setEpochs(e.target.value)}
                        disabled={isTraining}
                        className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-500/40 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {algorithm === 'SVM' && (
                  <div>
                    <label className="block text-xs text-slate-400">C Regularization Value</label>
                    <input
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      value={cValue}
                      onChange={(e) => setCValue(e.target.value)}
                      disabled={isTraining}
                      className="mt-1.5 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-500/40 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleStartTraining}
                disabled={isTraining || loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500"
              >
                {isTraining ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Training Classifier...
                  </>
                ) : (
                  'Start Training Job'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {(isTraining || consoleLogs.length > 1) && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
              <div className="flex h-9 items-center justify-between border-b border-slate-900 bg-slate-900 px-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                  <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">training_subprocess.log</span>
                <button
                  type="button"
                  onClick={() => setConsoleLogs([])}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-300"
                >
                  Clear logs
                </button>
              </div>

              <div className="h-56 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-emerald-400 space-y-1 select-text scrollbar-thin scrollbar-thumb-slate-800">
                {consoleLogs.map((log, index) => (
                  <pre key={index} className="whitespace-pre-wrap">{log}</pre>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}

          <div className="border-b border-slate-800 flex items-center justify-between pb-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition ${activeTab === 'history'
                  ? 'bg-slate-800 text-amber-400 ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
              >
                Training Sessions History
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('comparison')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition ${activeTab === 'comparison'
                  ? 'bg-slate-800 text-amber-400 ring-1 ring-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
              >
                Model Performance Comparison
              </button>
            </div>
            <button
              type="button"
              onClick={() => loadData(true)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              Refresh
            </button>
          </div>

          {activeTab === 'history' && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider">
                      <th className="p-4 font-semibold">Algorithm</th>
                      <th className="p-4 font-semibold">Run Details</th>
                      <th className="p-4 font-semibold">Accuracy</th>
                      <th className="p-4 font-semibold">F1-Score</th>
                      <th className="p-4 text-center font-semibold">Status / Promotion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                          Retrieving model registry...
                        </td>
                      </tr>
                    ) : trainedModels.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                          No training sessions yet. Use the Algorithm Trainer to launch a new run.
                        </td>
                      </tr>
                    ) : (
                      trainedModels.map((model) => {
                        const isCurrentActive = model.isActive
                        return (
                          <tr
                            key={model._id}
                            className="transition-colors hover:bg-slate-800/40"
                          >
                            <td className="p-4">
                              <span className="font-bold text-white block">{model.algorithm}</span>
                              <span className="text-[10px] text-slate-500 block font-mono mt-0.5">{model.runId}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-slate-400 font-mono text-[10px] block max-w-[150px] truncate" title={formatHyperparams(model.hyperparameters)}>
                                {formatHyperparams(model.hyperparameters)}
                              </span>
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                {new Date(model.createdAt).toLocaleString()}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-amber-400 font-mono">
                              {(model.accuracy * 100).toFixed(1)}%
                            </td>
                            <td className="p-4 font-bold text-purple-400 font-mono">
                              {(model.f1Score * 100).toFixed(1)}%
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              {isCurrentActive ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                  Active Model
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handlePromote(model._id)}
                                  disabled={promotingId !== null}
                                  className="inline-flex items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/5 px-2.5 py-1 text-[10px] font-bold text-amber-300 transition hover:bg-amber-500 hover:text-slate-950 disabled:opacity-50"
                                >
                                  {promotingId === model._id ? 'Activating...' : 'Promote'}
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 backdrop-blur-sm space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Baseline Algorithm Comparison
              </h3>
              <p className="text-xs text-slate-500 -mt-3">
                Comparing the 4 pre-trained baseline classifiers. These scores reflect Jupyter notebook evaluations.
              </p>

              {loading ? (
                <p className="text-center text-slate-500 text-xs py-8">Comparing runs...</p>
              ) : baseModels.length === 0 ? (
                <p className="text-center text-slate-500 text-xs py-8">No baseline algorithm models found. Restart the server to seed them.</p>
              ) : (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-3">Model Accuracy Comparison</span>
                    <div className="space-y-2.5">
                      {baseModels.map((model) => (
                        <div key={model._id} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-medium">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              {model.algorithm}
                              {model.isActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Active"></span>
                              )}
                            </span>
                            <span className="text-amber-400 font-bold">{(model.accuracy * 100).toFixed(2)}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800/40">
                            <div
                              className={`h-full rounded-full transition-all ${model.isActive ? 'bg-amber-400' : 'bg-slate-600'}`}
                              style={{ width: `${model.accuracy * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/40">
                    <span className="text-xs font-semibold text-slate-400 block mb-3">Model F1-Score Comparison</span>
                    <div className="space-y-2.5">
                      {baseModels.map((model) => (
                        <div key={model._id} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-medium">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              {model.algorithm}
                              {model.isActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Active"></span>
                              )}
                            </span>
                            <span className="text-purple-400 font-bold">{(model.f1Score * 100).toFixed(2)}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800/40">
                            <div
                              className={`h-full rounded-full transition-all ${model.isActive ? 'bg-purple-500' : 'bg-slate-600'}`}
                              style={{ width: `${model.f1Score * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800/40">
                    <span className="text-xs font-semibold text-slate-400 block mb-3">Algorithm Comparison Summary Matrix</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] border border-slate-800 text-slate-300">
                        <thead>
                          <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                            <th className="p-2.5 font-semibold text-left">Algorithm</th>
                            <th className="p-2.5 font-semibold text-center">Accuracy</th>
                            <th className="p-2.5 font-semibold text-center">Precision</th>
                            <th className="p-2.5 font-semibold text-center">Recall</th>
                            <th className="p-2.5 font-semibold text-center">F1-Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {baseModels.map((model) => (
                            <tr key={model._id} className={model.isActive ? 'bg-amber-500/5' : ''}>
                              <td className="p-2.5">
                                <div className="font-bold flex items-center gap-1">
                                  {model.algorithm}
                                  {model.isActive && <span className="text-[9px] uppercase tracking-wide px-1.5 bg-emerald-500/10 text-emerald-400 rounded ring-1 ring-emerald-500/20">Active</span>}
                                </div>
                              </td>
                              <td className="p-2.5 text-center font-bold text-amber-400 font-mono">{(model.accuracy * 100).toFixed(2)}%</td>
                              <td className="p-2.5 text-center font-bold text-emerald-400 font-mono">{(model.precision * 100).toFixed(2)}%</td>
                              <td className="p-2.5 text-center font-bold text-cyan-400 font-mono">{(model.recall * 100).toFixed(2)}%</td>
                              <td className="p-2.5 text-center font-bold text-purple-400 font-mono">{(model.f1Score * 100).toFixed(2)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
