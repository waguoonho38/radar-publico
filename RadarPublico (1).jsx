
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Radar Público</h1>
      <p className="text-muted-foreground">Transparência em tempo real. Acompanhe contratos públicos com alertas automáticos de risco.</p>
      <Input
        placeholder="Buscar por cidade, empresa, secretaria ou objeto"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex gap-4 py-2">
        <Button onClick={exportarCSV}>Exportar CSV</Button>
        <Button onClick={exportarPDF}>Exportar PDF</Button>
        <Button variant="destructive" onClick={denunciar}>Denunciar</Button>
      </div>
      <div className="space-y-4">
        {resultados.map((item, index) => (
          <Card key={index} className={item.alerta ? "border-red-500" : ""}>
            <CardContent className="p-4 space-y-1">
              <p><strong>Cidade:</strong> {item.cidade}</p>
              <p><strong>Empresa:</strong> {item.empresa}</p>
              <p><strong>Secretaria:</strong> {item.secretaria}</p>
              <p><strong>Objeto:</strong> {item.objeto}</p>
              <p><strong>Valor:</strong> R$ {item.valor.toLocaleString()}</p>
              {item.alerta && <p className="text-red-600 font-semibold">⚠️ Alerta: possível irregularidade</p>}
            </CardContent>
          </Card>
        ))}
        {resultados.length === 0 && <p>Nenhum resultado encontrado.</p>}
      </div>
      <footer className="text-center text-sm text-gray-500 pt-4 border-t">
        Contato: (22) 99834-8514 | Radar Público
      </footer>
    </div>
  );
}
