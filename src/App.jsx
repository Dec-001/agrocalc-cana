import { useState, useEffect } from "react";

const EstimateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M12 17h.01M15 17h.01M9 10h.01M12 10h.01M15 10h.01M3 7l3-4 3 4M21 7l-3-4-3 4" />
  </svg>
);
const HarvestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const ConvertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const InputField = ({ label, value, onChange, unit }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <div className="flex rounded-md shadow-sm">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 text-lg text-white bg-gray-600 border border-gray-500 rounded-l-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
      />
      <span className="inline-flex items-center px-4 text-gray-300 bg-gray-700 border border-l-0 border-gray-500 rounded-r-md">
        {unit}
      </span>
    </div>
  </div>
);

const ResultCard = ({ label, value, unit, colorClass = "text-green-400" }) => (
  <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
    <p className="text-sm text-gray-400">{label}</p>
    <p className={`text-3xl font-bold ${colorClass}`}>
      {isNaN(value) || !isFinite(value) ? "0.00" : value.toFixed(2)}
      <span className="text-lg font-normal text-gray-300 ml-2">{unit}</span>
    </p>
  </div>
);

const TabButton = ({ tabId, children, icon, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tabId)}
    className={`flex-1 flex flex-col items-center justify-center p-3 transition-colors duration-200 focus:outline-none ${
      activeTab.startsWith(tabId.split("_")[0]) ? "text-yellow-400 border-t-4 border-yellow-400" : "text-gray-400"
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{children}</span>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState("estimar_alq");
  const [comprimentoRua, setComprimentoRua] = useState("320");
  const [producaoAmostra, setProducaoAmostra] = useState("12");
  const [ruasAmostra, setRuasAmostra] = useState("10");
  const [areaTalhaoAlq, setAreaTalhaoAlq] = useState("8.66");
  const [areaTalhaoHa, setAreaTalhaoHa] = useState("20.96");
  const [pesoGaiolao, setPesoGaiolao] = useState("75");
  const [areaTotalGleba, setAreaTotalGleba] = useState("7.57");
  const [areaRestanteColher, setAreaRestanteColher] = useState("3.97");
  const [cargasRealizadas, setCargasRealizadas] = useState("8");
  const [alqParaHa, setAlqParaHa] = useState("1");
  const [haParaAlq, setHaParaAlq] = useState("2.42");
  const [resultados, setResultados] = useState({});

  const ALQ_PARA_HA = 2.42;
  const ALQUEIRE_M2 = 24200;

  useEffect(() => {
    const numComprimentoRua = parseFloat(comprimentoRua) || 0;
    const numProducaoAmostra = parseFloat(producaoAmostra) || 0;
    const numRuasAmostra = parseFloat(ruasAmostra) || 0;
    const numPesoGaiolao = parseFloat(pesoGaiolao) || 0;
    const numAreaTotalGleba = parseFloat(areaTotalGleba) || 0;
    const numAreaRestanteColher = parseFloat(areaRestanteColher) || 0;
    const numCargasRealizadas = parseFloat(cargasRealizadas) || 0;
    const espacamentoFixo = 1.5;
    const producaoPorRua = numRuasAmostra > 0 ? numProducaoAmostra / numRuasAmostra : 0;
    const ruasPorAlqueire = numComprimentoRua > 0 ? ALQUEIRE_M2 / (numComprimentoRua * espacamentoFixo) : 0;
    const produtividadeEstimadaTonAlq = ruasPorAlqueire * producaoPorRua;
    const produtividadeEstimadaTonHa = produtividadeEstimadaTonAlq / ALQ_PARA_HA;
    const areaEstimadaEmAlqueires = activeTab.includes("alq") ? (parseFloat(areaTalhaoAlq) || 0) : (parseFloat(areaTalhaoHa) || 0) / ALQ_PARA_HA;
    const producaoTotalEstimada = areaEstimadaEmAlqueires * produtividadeEstimadaTonAlq;
    const totalViagensEstimadas = numPesoGaiolao > 0 ? producaoTotalEstimada / numPesoGaiolao : 0;
    const totalColhidoTon = numCargasRealizadas * numPesoGaiolao;
    const areaJaColhidaAlq = numAreaTotalGleba > numAreaRestanteColher ? numAreaTotalGleba - numAreaRestanteColher : 0;
    const produtividadeRealTonAlq = areaJaColhidaAlq > 0 ? totalColhidoTon / areaJaColhidaAlq : 0;
    const produtividadeRealTonHa = produtividadeRealTonAlq / ALQ_PARA_HA;
    const mediaViagensPorAlqueire = areaJaColhidaAlq > 0 ? numCargasRealizadas / areaJaColhidaAlq : 0;
    const estimativaRestanteTon = numAreaRestanteColher * produtividadeRealTonAlq;
    const estimativaViagensRestantes = numPesoGaiolao > 0 ? estimativaRestanteTon / numPesoGaiolao : 0;
    setResultados({ produtividadeEstimadaTonAlq, produtividadeEstimadaTonHa, producaoTotalEstimada, totalViagensEstimadas, totalColhidoTon, areaJaColhidaAlq, produtividadeRealTonAlq, produtividadeRealTonHa, mediaViagensPorAlqueire, estimativaViagensRestantes, estimativaRestanteTon });
  }, [comprimentoRua, producaoAmostra, ruasAmostra, areaTalhaoAlq, areaTalhaoHa, pesoGaiolao, areaTotalGleba, areaRestanteColher, cargasRealizadas, activeTab]);

  const handleAlqueireEstimateChange = (value) => { setAreaTalhaoAlq(value); setAreaTalhaoHa(((parseFloat(value) || 0) * ALQ_PARA_HA).toFixed(2)); };
  const handleHectareEstimateChange = (value) => { setAreaTalhaoHa(value); setAreaTalhaoAlq(((parseFloat(value) || 0) / ALQ_PARA_HA).toFixed(2)); };
  const handleAlqConverter = (value) => { setAlqParaHa(value); setHaParaAlq(((parseFloat(value) || 0) * ALQ_PARA_HA).toFixed(4)); };
  const handleHaConverter = (value) => { setHaParaAlq(value); setAlqParaHa(((parseFloat(value) || 0) / ALQ_PARA_HA).toFixed(4)); };

  const renderEstimativa = () => (
    <div className="space-y-4">
      <InputField label="Comprimento da Rua (metros)" value={comprimentoRua} onChange={setComprimentoRua} unit="m" />
      <InputField label="Produção da Amostra (toneladas)" value={producaoAmostra} onChange={setProducaoAmostra} unit="ton" />
      <InputField label="Número de Ruas da Amostra" value={ruasAmostra} onChange={setRuasAmostra} unit="ruas" />
      <InputField label="Peso médio por Carga (gaiolão)" value={pesoGaiolao} onChange={setPesoGaiolao} unit="ton" />
      <div className="flex items-center space-x-2">
        <div className="flex-1"><InputField label="Área do Talhão (Alqueires)" value={areaTalhaoAlq} onChange={handleAlqueireEstimateChange} unit="alq" /></div>
        <div className="flex-1"><InputField label="Área do Talhão (Hectares)" value={areaTalhaoHa} onChange={handleHectareEstimateChange} unit="ha" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <ResultCard label="Produtividade Estimada (ton/alq)" value={resultados.produtividadeEstimadaTonAlq} unit="ton/alq" />
        <ResultCard label="Produtividade Estimada (ton/ha)" value={resultados.produtividadeEstimadaTonHa} unit="ton/ha" />
        <ResultCard label="Produção Total Estimada" value={resultados.producaoTotalEstimada} unit="ton" colorClass="text-yellow-400" />
        <ResultCard label="Total de Viagens Estimadas" value={resultados.totalViagensEstimadas} unit="cargas" colorClass="text-yellow-400" />
      </div>
    </div>
  );

  const renderGestao = () => (
    <div className="space-y-4">
      <InputField label="Área Total da Gleba (Alqueires)" value={areaTotalGleba} onChange={setAreaTotalGleba} unit="alq" />
      <InputField label="Área Restante a Colher (Alqueires)" value={areaRestanteColher} onChange={setAreaRestanteColher} unit="alq" />
      <InputField label="Nº de Cargas Realizadas" value={cargasRealizadas} onChange={setCargasRealizadas} unit="cargas" />
      <InputField label="Peso médio por Carga (gaiolão)" value={pesoGaiolao} onChange={setPesoGaiolao} unit="ton" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <ResultCard label="Total já Colhido" value={resultados.totalColhidoTon} unit="ton" />
        <ResultCard label="Área já Colhida" value={resultados.areaJaColhidaAlq} unit="alq" />
        <ResultCard label="Produtividade Real (ton/alq)" value={resultados.produtividadeRealTonAlq} unit="ton/alq" />
        <ResultCard label="Produtividade Real (ton/ha)" value={resultados.produtividadeRealTonHa} unit="ton/ha" />
        <ResultCard label="Média de Viagens por Alqueire" value={resultados.mediaViagensPorAlqueire} unit="cargas/alq" />
        <ResultCard label="Estimativa Restante" value={resultados.estimativaRestanteTon} unit="ton" colorClass="text-yellow-400" />
        <ResultCard label="Viagens Restantes" value={resultados.estimativaViagensRestantes} unit="cargas" colorClass="text-yellow-400" />
      </div>
    </div>
  );

  const renderConversor = () => (
    <div className="space-y-4">
      <InputField label="Alqueires para Hectares" value={alqParaHa} onChange={handleAlqConverter} unit="alq" />
      <InputField label="Hectares para Alqueires" value={haParaAlq} onChange={handleHaConverter} unit="ha" />
    </div>
  );

  return (
    <div className="bg-gray-800 text-white min-h-screen font-sans">
      <div className="container mx-auto p-4 max-w-2xl">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-yellow-500">AgroCalc Cana</h1>
          <p className="text-gray-400">Sua calculadora para estimativa e gestão de colheita</p>
        </header>
        
        <main>
          <div className="bg-gray-900 rounded-lg shadow-xl">
            <nav className="flex border-b border-gray-700">
              <TabButton tabId="estimar_alq" activeTab={activeTab} setActiveTab={setActiveTab} icon={<EstimateIcon />}>Estimar</TabButton>
              <TabButton tabId="gestao_alq" activeTab={activeTab} setActiveTab={setActiveTab} icon={<HarvestIcon />}>Gerir Colheita</TabButton>
              <TabButton tabId="converter" activeTab={activeTab} setActiveTab={setActiveTab} icon={<ConvertIcon />}>Converter</TabButton>
            </nav>
            <div className="p-6">
              {activeTab.startsWith("estimar") && renderEstimativa()}
              {activeTab.startsWith("gestao") && renderGestao()}
              {activeTab.startsWith("converter") && renderConversor()}
            </div>
          </div>
        </main>

        <footer className="text-center text-gray-500 text-xs mt-8 pb-4">
          <p>&copy; 2025 - Desenvolvido para facilitar o trabalho no campo.</p>
        </footer>
      </div>
    </div>
  );
}
