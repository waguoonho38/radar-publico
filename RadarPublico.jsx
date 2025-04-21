import { useState } from "react";
import jsPDF from "jspdf";

export default function RadarPublico() {
  const [search, setSearch] = useState("");

  const dadosSimulados = [
    { cidade: "Campos dos Goytacazes", empresa: "Construsol", secretaria: "Saúde", objeto: "Adesão de ata de oxigênio", valor: 250000, alerta: true },
    { cidade: "Campos dos Goytacazes", empresa: "Construsol", secretaria: "Educação", objeto: "Adesão de ata de oxigênio", valor: 250000, alerta: true },
    { cidade: "São João da Barra", empresa: "Construsol", secretaria: "Educação", objeto: "Adesão de ata de papel A4", valor: 75000, alerta: true },
    { cidade: "Macaé", empresa: "AlphaTech", secretaria: "Obras", objeto: "Adesão de ata de cimento", valor: 400000, alerta: false },
    { cidade: "Itaperuna", empresa: "Construsol", secretaria: "Administração", objeto: "Adesão de ata de computadores", valor: 300000, alerta: true },
    { cidade: "Itaperuna", empresa: "Construsol", secretaria: "Educação", objeto: "Adesão de ata de papel A4", valor: 80000, alerta: true }
  ];

  const resultados = dadosSimulados.filter(item =>
    Object.values(item).some(valor =>
      String(valor).toLowerCase().includes(search.toLowerCase())
    )
  );

  const exportarCSV = () => {
    const header = "Cidade,Empresa,Secretaria,Objeto,Valor,Alerta\n";
    const linhas = resultados.map(item =>
      `${item.cidade},${item.empresa},${item.secretaria},${item.objeto},${item.valor},${item.alerta ? 'Sim' : 'Não'}`
    );
    const csvContent = header + linhas.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "dados_radar_publico.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Radar Público - Relatório de Adesões", 10, 10);
    let y = 20;
    resultados.forEach((item, index) => {
      doc.text(`Cidade: ${item.cidade}`, 10, y);
      doc.text(`Empresa: ${item.empresa}`, 10, y + 5);
      doc.text(`Secretaria: ${item.secretaria}`, 10, y + 10);
      doc.text(`Objeto: ${item.objeto}`, 10, y + 15);
      doc.text(`Valor: R$ ${item.valor.toLocaleString()}`, 10, y + 20);
      if (item.alerta) doc.text(`⚠️ Alerta: possível irregularidade`, 10, y + 25);
      y += 35;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("relatorio_radar_publico.pdf");
  };

  const denunciar = () => {
    const identificacao = confirm("Você deseja se identificar na denúncia? (Clique em OK para sim, Cancelar para manter anonimato)");
    const texto = `Prezados órgãos de controle,\n\nVenho, por meio desta, apresentar denúncia referente a possíveis irregularidades em adesões de atas de registro de preços por parte de órgãos públicos.\n\nSolicito que o Tribunal de Contas e o Ministério Público tomem ciência e apurem os fatos, conforme previsto na legislação vigente.\n\n${identificacao ? "Identificação: (preencha com seu nome e contato)" : "Esta denúncia foi enviada de forma anônima."}`;
    alert(texto);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Radar Público</h1>
      <p style={{ marginBottom: "16px" }}>
        Transparência em tempo real. Acompanhe contratos públicos com alertas automáticos de risco.
      </p>
      <input
        type="text"
        placeholder="Buscar por cidade, empresa, secretaria ou objeto"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "12px" }}
      />
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={exportarCSV}>Exportar CSV</button>
        <button onClick={exportarPDF}>Exportar PDF</button>
        <button onClick={denunciar} style={{ backgroundColor: "red", color: "white" }}>
          Denunciar
        </button>
      </div>
      {resultados.map((item, index) => (
        <div key={index} style={{ border: item.alerta ? "2px solid red" : "1px solid #ccc", padding: "10px", marginBottom: "12px" }}>
          <p><strong>Cidade:</strong> {item.cidade}</p>
          <p><strong>Empresa:</strong> {item.empresa}</p>
          <p><strong>Secretaria:</strong> {item.secretaria}</p>
          <p><strong>Objeto:</strong> {item.objeto}</p>
          <p><strong>Valor:</strong> R$ {item.valor.toLocaleString()}</p>
          {item.alerta && <p style={{ color: "red", fontWeight: "bold" }}>⚠️ Alerta: possível irregularidade</p>}
        </div>
      ))}
      {resultados.length === 0 && <p>Nenhum resultado encontrado.</p>}
      <footer style={{ marginTop: "30px", fontSize: "12px", textAlign: "center", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
        Contato: (22) 99834-8514 | Radar Público
      </footer>
    </div>
  );
}
