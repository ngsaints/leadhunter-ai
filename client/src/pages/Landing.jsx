import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { q: 'Preciso configurar algo?', a: 'Não! Basta criar sua conta e configurar seu nicho e cidade. A IA cuida do resto.' },
    { q: 'Funciona para qualquer cidade?', a: 'Sim! Funcionamos com qualquer cidade do Brasil. A IA encontra leads locais automaticamente.' },
    { q: 'E se o lead não responder?', a: 'A IA envia follow-ups automáticos. Se mesmo assim não responder, você pode tentar outro lead.' },
    { q: 'Posso cancelar quando quiser?', a: 'Sim, sem multas ou taxas de cancelamento. Você pode cancelar a qualquer momento.' },
  ]

  const nichos = [
    { ico: '💈', name: 'Barbearias', desc: 'Alto volume de buscas' },
    { ico: '🦷', name: 'Dentistas', desc: 'Ticket alto, recorrência' },
    { ico: '🏋️', name: 'Academias', desc: 'Demanda constante' },
    { ico: '💅', name: 'Salões de beleza', desc: 'Público fiel' },
    { ico: '🍕', name: 'Restaurantes', desc: 'Delivery + reservas' },
    { ico: '🏥', name: 'Clínicas', desc: 'Consultas agendadas' },
  ]

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-heading text-xl font-extrabold">
              Lead<span className="text-primary">Hunter</span> AI
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-7">
              <a href="#como" className="text-muted-light no-underline text-sm transition-colors hover:text-white">Como funciona</a>
              <a href="#planos" className="text-muted-light no-underline text-sm transition-colors hover:text-white">Planos</a>
              <a href="#faq" className="text-muted-light no-underline text-sm transition-colors hover:text-white">FAQ</a>
            </div>
            
            <div className="hidden md:flex gap-2.5 items-center">
              <button onClick={() => navigate('/auth')} className="btn-outline text-sm px-4 py-2">
                Entrar
              </button>
              <button onClick={() => navigate('/auth?tab=register')} className="btn-primary text-sm px-4 py-2">
                Começar grátis
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-100 border-t border-white/10">
            <div className="px-4 py-3 space-y-3">
              <a href="#como" className="block text-muted-light no-underline text-sm" onClick={() => setMobileMenuOpen(false)}>Como funciona</a>
              <a href="#planos" className="block text-muted-light no-underline text-sm" onClick={() => setMobileMenuOpen(false)}>Planos</a>
              <a href="#faq" className="block text-muted-light no-underline text-sm" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} className="btn-outline text-sm px-4 py-2 flex-1">
                  Entrar
                </button>
                <button onClick={() => { navigate('/auth?tab=register'); setMobileMenuOpen(false); }} className="btn-primary text-sm px-4 py-2 flex-1">
                  Começar grátis
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse,rgba(0,212,139,0.11)_0%,transparent_65%)] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 bg-primary-light border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-slow" />
          <span className="text-xs sm:text-sm">IA prospectando clientes 24h</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl mb-6">
          Encontre clientes no <span className="text-primary not-italic">WhatsApp</span> no automático
        </h1>

        <p className="text-base sm:text-lg text-muted-light max-w-lg leading-relaxed mb-8 font-light">
          A IA encontra empresas locais, escreve mensagens personalizadas e envia pelo seu WhatsApp. Você só fecha os negócios.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 sm:mb-20 w-full sm:w-auto">
          <button onClick={() => navigate('/auth?tab=register')} className="btn-primary text-base px-8 py-4">
            Começar grátis — sem cartão
          </button>
          <a href="#como" className="btn-outline text-base px-8 py-4 text-center">
            Ver como funciona
          </a>
        </div>

        {/* MOCKUP */}
        <div className="w-full max-w-4xl bg-dark-100 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="py-3 px-4 bg-dark-200 border-b border-white/8 flex gap-2 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-center">
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">247</div>
              <div className="text-xs text-muted mt-1">Leads este mês</div>
            </div>
            <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-center">
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">89</div>
              <div className="text-xs text-muted mt-1">Respondendo</div>
            </div>
            <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-center">
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">34</div>
              <div className="text-xs text-muted mt-1">Quentes 🔥</div>
            </div>
            <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-center">
              <div className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">12</div>
              <div className="text-xs text-muted mt-1">Fechamentos</div>
            </div>
            <div className="col-span-2 md:col-span-4 bg-white/5 border border-white/8 rounded-xl p-3 sm:p-4">
              <div className="text-xs text-muted uppercase tracking-widest mb-3">Atividade recente</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Barbearia Silva respondeu — <span className="text-primary">lead quente!</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span>Mensagem enviada para Academia Fit</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span>15 novos leads encontrados em Joinville</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="bg-primary-light border-y border-primary/20 py-12 sm:py-16 text-center px-4">
        <div className="font-heading text-4xl sm:text-5xl font-extrabold text-primary leading-none">+2.847</div>
        <div className="text-sm text-muted mt-2">negócios já receberam leads esta semana</div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="text-xs uppercase tracking-widest text-primary font-medium mb-4">Como funciona</div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              4 passos. Zero trabalho manual.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: '1', title: 'Configure seu nicho', desc: 'Escolha o tipo de negócio (ex: Barbearia) e a cidade alvo.' },
              { num: '2', title: 'IA encontra leads', desc: 'Nosso sistema varre a internet e encontra empresas do nicho na região.' },
              { num: '3', title: 'Mensagem personalizada', desc: 'A IA escreve uma mensagem única para cada lead e envia pelo WhatsApp.' },
              { num: '4', title: 'Você fecha o negócio', desc: 'Quando o lead responde, a IA qualifica e te avisa. Você só entra pra fechar.' },
            ].map((step, i) => (
              <div key={i} className="bg-dark-100 border border-white/8 p-6 sm:p-8 rounded-xl">
                <div className="font-heading text-5xl font-extrabold text-primary/10 leading-none mb-4">{step.num}</div>
                <h3 className="font-heading text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO CHAT */}
      <section className="py-16 sm:py-24 px-4 bg-dark-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-primary text-xs uppercase tracking-widest font-medium mb-4">Exemplo real</div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Veja a conversa acontecendo
          </h2>
          <p className="text-base text-muted-light leading-relaxed mb-8 sm:mb-12 font-light">
            A IA envia, o lead responde, a IA qualifica. Tudo automático.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h3 className="font-heading text-xl font-bold mb-4">Mensagem que o lead recebe:</h3>
              <div className="text-sm text-muted-light leading-relaxed space-y-3">
                <p>Olá, Barbearia Silva! Sou da equipe do LeadHunter AI.</p>
                <p>Vi que vocês estão em Joinville e temos uma oportunidade incrível para aumentar seus clientes.</p>
                <p>Vocês já trabalham com prospecção automática via WhatsApp?</p>
              </div>
            </div>

            <div className="bg-dark-100 rounded-2xl border border-white/10 overflow-hidden">
              <div className="py-3 px-4 bg-dark-200 flex items-center gap-3 border-b border-white/8">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-dark flex-shrink-0">LH</div>
                <div>
                  <div className="text-sm font-medium">LeadHunter AI</div>
                  <div className="text-xs text-primary">online</div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3 min-h-[260px]">
                <div className="max-w-[80%] py-2.5 px-3 rounded-xl text-sm leading-relaxed self-end bg-primary text-dark rounded-br-md">
                  Olá, Barbearia Silva! Vi que vocês estão em Joinville e tenho uma oportunidade para aumentar seus clientes 🚀
                </div>
                <div className="max-w-[80%] py-2.5 px-3 rounded-xl text-sm leading-relaxed self-start bg-white/10 rounded-bl-md">
                  Opa, me conta mais!
                </div>
                <div className="flex gap-1 self-start py-3 px-3 bg-white/8 rounded-xl rounded-bl-md">
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-typing" />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-primary text-xs uppercase tracking-widest font-medium mb-4">Benefícios</div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-8 sm:mb-12">
            Por que LeadHunter AI?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { ico: '⚡', title: '100% automático', desc: 'Encontrar leads, escrever mensagens e enviar. Você não faz nada manualmente.' },
              { ico: '🤖', title: 'IA que vende', desc: 'Mensagens personalizadas que convertem. A IA aprende e melhora com o tempo.' },
              { ico: '📍', title: 'Focado na sua região', desc: 'Leads locais, prontos para atender. Sem desperdício de tempo com fora da área.' },
              { ico: '💰', title: 'Custo que se paga', desc: '1 cliente fechado paga o ano inteiro. ROI comprovado pelos nossos usuários.' },
            ].map((ben, i) => (
              <div key={i} className="bg-dark-100 border border-white/8 rounded-xl p-6 sm:p-7 transition-all hover:border-primary/40">
                <div className="text-3xl mb-4">{ben.ico}</div>
                <h3 className="font-heading text-lg font-bold mb-2">{ben.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{ben.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="py-16 sm:py-24 px-4 bg-dark-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-primary text-xs uppercase tracking-widest font-medium mb-4">Resultados reais</div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-8 sm:mb-12">
            Números que falam por si
          </h2>

          <div className="bg-dark-100 rounded-2xl p-8 sm:p-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold leading-none text-primary">12.4K</div>
                <div className="text-xs text-muted mt-3 leading-relaxed">Leads gerados/mês</div>
              </div>
              <div>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold leading-none text-primary">68%</div>
                <div className="text-xs text-muted mt-3 leading-relaxed">Taxa de resposta</div>
              </div>
              <div>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold leading-none text-primary">23%</div>
                <div className="text-xs text-muted mt-3 leading-relaxed">Viram clientes</div>
              </div>
              <div>
                <div className="font-heading text-3xl sm:text-4xl font-extrabold leading-none text-primary">R$97</div>
                <div className="text-xs text-muted mt-3 leading-relaxed">Custo por mês</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NICHOs */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-primary text-xs uppercase tracking-widest font-medium mb-4">Para quem é?</div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-8 sm:mb-12">
            Funciona para qualquer negócio local
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {nichos.map((nicho, i) => (
              <div key={i} className="bg-dark-100 border border-white/8 rounded-xl p-5 sm:p-6 text-center transition-all hover:border-primary/40 hover:bg-primary-light">
                <div className="text-3xl mb-3">{nicho.ico}</div>
                <h3 className="text-sm font-medium mb-1">{nicho.name}</h3>
                <p className="text-xs text-muted">{nicho.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-16 sm:py-24 px-4 bg-dark-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="text-primary text-xs uppercase tracking-widest font-medium mb-4">Planos</div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Escolha seu plano
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <div className="bg-dark-100 border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="font-heading text-xl font-extrabold">Free</div>
              <div className="font-heading text-4xl font-extrabold leading-none mt-5 mb-1">R$0</div>
              <div className="text-xs text-muted mb-6">/mês</div>
              <ul className="space-y-3 mb-7">
                <li className="text-xs flex items-center gap-2 text-muted-light">
                  <span className="text-primary font-bold">✓</span> 20 leads/mês
                </li>
                <li className="text-xs flex items-center gap-2 text-muted-light">
                  <span className="text-primary font-bold">✓</span> IA para mensagens
                </li>
                <li className="text-xs flex items-center gap-2 text-muted-light">
                  <span className="text-primary font-bold">✓</span> Envio WhatsApp
                </li>
                <li className="text-xs flex items-center gap-2 text-muted-light">
                  <span className="text-primary font-bold">✓</span> Dashboard completo
                </li>
              </ul>
              <button onClick={() => navigate('/auth?tab=register')} className="btn-outline w-full py-3 text-sm">
                Começar grátis
              </button>
            </div>

            <div className="bg-dark-100 border-2 border-primary rounded-2xl p-6 sm:p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-dark py-1 px-4 rounded-full text-xs font-bold whitespace-nowrap">MAIS POPULAR</div>
              <div className="font-heading text-xl font-extrabold">Pro</div>
              <div className="font-heading text-4xl font-extrabold leading-none mt-5 mb-1">R$97</div>
              <div className="text-xs text-muted mb-6">/mês</div>
              <ul className="space-y-3 mb-7">
                <li className="text-xs flex items-center gap-2 text-muted-light">
                  <span className="text-primary font-bold">✓</span> Leads ilimitados
                </li>
                <li className="text-xs flex items-center gap-2 text-muted-light">
                  <span className="text-primary font-bold">✓</span> IA 24h/7
                </li>
                <li className="text-xs flex items-center gap-2 text-muted-light">
                  <span className="text-primary font-bold">✓</span> Auto-resposta
                </li>
                <li className="text-xs flex items-center gap-2 text-muted-light">
                  <span className="text-primary font-bold">✓</span> Suporte prioritário
                </li>
              </ul>
              <button onClick={() => navigate('/auth?tab=register')} className="btn-primary w-full py-3 text-sm">
                Assinar Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="text-primary text-xs uppercase tracking-widest font-medium mb-4">FAQ</div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-dark-100 border border-white/8 rounded-xl overflow-hidden">
                <button 
                  className="w-full py-4 px-5 text-sm font-medium text-left flex justify-between items-center transition-colors hover:text-primary"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span className="text-xl text-primary transition-transform duration-300" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: openFaq === i ? '200px' : '0' }}>
                  <p className="text-xs text-muted leading-relaxed px-5 pb-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="py-12 sm:py-16 px-4">
        <div className="text-center bg-primary-light border border-primary/20 rounded-2xl p-8 sm:p-12 max-w-2xl mx-auto">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="font-heading text-xl font-bold mb-2">7 dias de garantia</h3>
          <p className="text-sm text-muted-light leading-relaxed">
            Se não funcionar para você, devolvemos 100% do seu dinheiro. Sem perguntas.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(0,212,139,0.09)_0%,transparent_68%)] pointer-events-none" />
        <div className="text-center relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Pronto para <span className="text-primary not-italic">crescer</span>?
          </h2>
          <p className="text-base text-muted-light leading-relaxed mb-8">
            Comece grátis agora. Sem cartão de crédito.
          </p>
          <button onClick={() => navigate('/auth?tab=register')} className="btn-primary text-base px-8 py-4">
            Criar minha conta grátis
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-8 text-center px-4">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="text-xs text-muted no-underline hover:text-white">Termos</a>
          <a href="#" className="text-xs text-muted no-underline hover:text-white">Privacidade</a>
          <a href="#" className="text-xs text-muted no-underline hover:text-white">Contato</a>
        </div>
        <div className="text-xs text-white/25">
          © 2025 LeadHunter AI. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
