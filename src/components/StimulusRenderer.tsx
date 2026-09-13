import React from 'react';
import { VisualDiagramData } from '../types';
import { MathTextRenderer } from './MathTextRenderer';
import { BarChart3, Table, Info, Layers, TrendingUp } from 'lucide-react';

interface StimulusRendererProps {
  stimulus: string;
  visualData?: VisualDiagramData;
  className?: string;
}

export const StimulusRenderer: React.FC<StimulusRendererProps> = ({
  stimulus,
  visualData,
  className = '',
}) => {
  // Check if the stimulus text itself contains a markdown table
  const { preText, tableData, postText } = parseMarkdownTable(stimulus);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Main Narrative Text (or text before table) */}
      {preText && (
        <div className="leading-relaxed">
          <MathTextRenderer text={preText} />
        </div>
      )}

      {/* 2. Structured Visual Diagram if provided in data */}
      {visualData && (
        <div className="my-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          {/* Header of Visual */}
          {visualData.judul && (
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              {visualData.tipe === 'diagram_batang' && (
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              )}
              {visualData.tipe === 'tabel' && (
                <Table className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              )}
              {visualData.tipe === 'infografis' && (
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                {visualData.judul}
              </h4>
              {visualData.satuan && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-auto font-medium">
                  Satuan: {visualData.satuan}
                </span>
              )}
            </div>
          )}

          {/* Diagram Batang (Bar Chart) */}
          {visualData.tipe === 'diagram_batang' && visualData.batang && (
            <div className="space-y-2.5 pt-1">
              {(() => {
                const maxVal = Math.max(...visualData.batang.map((b) => b.nilai), 1);
                return visualData.batang.map((item, idx) => {
                  const pct = Math.round((item.nilai / maxVal) * 100);
                  const barColor =
                    item.warna ||
                    (idx % 4 === 0
                      ? 'bg-indigo-500'
                      : idx % 4 === 1
                      ? 'bg-blue-500'
                      : idx % 4 === 2
                      ? 'bg-emerald-500'
                      : 'bg-amber-500');

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {item.label}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {item.nilai.toLocaleString('id-ID')} {item.unit || visualData.satuan || ''}
                        </span>
                      </div>
                      <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 flex items-center">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${Math.max(pct, 6)}%` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Visual Tabel Data */}
          {visualData.tipe === 'tabel' && visualData.kolom && visualData.baris && (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {visualData.kolom.map((col, cIdx) => (
                      <th key={cIdx} className="px-3 py-2 border-r last:border-r-0 border-slate-200 dark:border-slate-700">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {visualData.baris.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={
                        rIdx % 2 === 0
                          ? 'bg-white dark:bg-slate-900'
                          : 'bg-slate-50/70 dark:bg-slate-800/40'
                      }
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-3 py-2 border-r last:border-r-0 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                        >
                          <MathTextRenderer text={cell} inline />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Visual Infografis / Metrics */}
          {visualData.tipe === 'infografis' && visualData.poinInfografis && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {visualData.poinInfografis.map((poin, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center"
                >
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
                    {poin.label}
                  </span>
                  <strong className="text-base font-bold text-slate-900 dark:text-slate-100 my-0.5 block">
                    {poin.nilai}
                  </strong>
                  {poin.sublabel && (
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-medium">
                      {poin.sublabel}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {visualData.catatan && (
            <p className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 italic">
              * Sumber data: {visualData.catatan}
            </p>
          )}
        </div>
      )}

      {/* 3. Render In-text Markdown Table if detected */}
      {tableData && (
        <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                {tableData.headers.map((h, i) => (
                  <th key={i} className="px-3.5 py-2.5 border-r last:border-r-0 border-slate-200 dark:border-slate-800">
                    <MathTextRenderer text={h} inline />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {tableData.rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={
                    rIdx % 2 === 0
                      ? 'bg-white dark:bg-slate-900'
                      : 'bg-slate-50/70 dark:bg-slate-800/40'
                  }
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-3.5 py-2.5 border-r last:border-r-0 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                    >
                      <MathTextRenderer text={cell} inline />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Text after table */}
      {postText && (
        <div className="leading-relaxed pt-1">
          <MathTextRenderer text={postText} />
        </div>
      )}
    </div>
  );
};

/**
 * Extracts markdown tables (e.g. | A | B |\n|---|---|\n| 1 | 2 |) from text
 */
function parseMarkdownTable(text: string): {
  preText: string;
  tableData: { headers: string[]; rows: string[][] } | null;
  postText: string;
} {
  if (!text) return { preText: '', tableData: null, postText: '' };

  const lines = text.split('\n');
  let tableStartIndex = -1;
  let tableEndIndex = -1;

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1].trim();

    // Check if line looks like | A | B | and nextLine looks like |--|--|
    if (
      line.startsWith('|') &&
      line.endsWith('|') &&
      nextLine.startsWith('|') &&
      nextLine.includes('---')
    ) {
      tableStartIndex = i;
      // find end of table
      let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith('|') && lines[j].trim().endsWith('|')) {
        j++;
      }
      tableEndIndex = j;
      break;
    }
  }

  if (tableStartIndex !== -1 && tableEndIndex !== -1) {
    const headerLine = lines[tableStartIndex].trim();
    const headers = headerLine
      .slice(1, -1)
      .split('|')
      .map((h) => h.trim());

    const rows: string[][] = [];
    for (let r = tableStartIndex + 2; r < tableEndIndex; r++) {
      const rowLine = lines[r].trim();
      const cells = rowLine
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      rows.push(cells);
    }

    const preText = lines.slice(0, tableStartIndex).join('\n').trim();
    const postText = lines.slice(tableEndIndex).join('\n').trim();

    return {
      preText,
      tableData: { headers, rows },
      postText,
    };
  }

  return {
    preText: text,
    tableData: null,
    postText: '',
  };
}
